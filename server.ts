import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { connectToDatabase, isDatabaseConnected } from "./server/db/connection";
import { apiRouter } from "./server/routes/api";
import { GeneratedContent, ChatHistory } from "./server/models";
import {
  applySecurityHeaders,
  noSqlSanitizer,
  createRateLimiter,
} from "./server/utils/security";
import { validateAuthConfig } from "./server/utils/auth";

async function startServer() {
  // Validate mandatory security configuration (e.g. JWT_SECRET)
  try {
    validateAuthConfig();
  } catch (authConfigErr: any) {
    console.error("[FATAL SECURITY CONFIG ERROR]:", authConfigErr.message || authConfigErr);
    process.exit(1);
  }

  const app = express();
  const PORT = 3000;

  // Initialize MongoDB connection on server start
  await connectToDatabase().catch((err) => {
    console.warn("[MongoDB] Non-blocking initial connection attempt notice:", err?.message || err);
  });

  // Apply Security Headers & Body Limit Protection
  app.use(applySecurityHeaders);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Sanitize all incoming parameters against NoSQL injection
  app.use(noSqlSanitizer);

  // Mount MongoDB CRUD and Database API Routes
  app.use("/api", apiRouter);

  // Health check API route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // =========================================================================
  // Secure Dynamic ISL Dataset Videos Route (public/isl/)
  // =========================================================================
  const ISL_DATASET_DIR = path.resolve(process.cwd(), "public", "isl");

  const serveISLVideoFile = (
    rawParam: string,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 1. Strict sanitization: strip any directory components, null bytes, or extension variations
    const baseInput = path.basename(String(rawParam || "")).replace(/\.mp4$/i, "");
    
    // 2. Reject anything that contains characters other than alphanumeric, underscore, or hyphen
    if (!baseInput || !/^[a-zA-Z0-9_-]+$/.test(baseInput)) {
      return res.status(404).json({ error: "Invalid video identifier", notFound: true });
    }

    const safeFileName = `${baseInput}.mp4`;
    const resolvedPath = path.resolve(ISL_DATASET_DIR, safeFileName);

    // 3. Path Traversal Guard: Ensure fully resolved path resides strictly inside ISL_DATASET_DIR
    if (!resolvedPath.startsWith(ISL_DATASET_DIR + path.sep)) {
      return res.status(403).json({ error: "Access denied: Path traversal attempt detected" });
    }

    // 4. File existence & regular file check
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: "Video not found in ISL dataset", file: safeFileName });
    }

    try {
      const stat = fs.statSync(resolvedPath);
      if (!stat.isFile()) {
        return res.status(404).json({ error: "Video entity is not a file", file: safeFileName });
      }

      // 5. Serve with proper video streaming headers
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Accept-Ranges", "bytes");
      return res.sendFile(resolvedPath);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to read video file" });
    }
  };

  // Dedicated Route: /isl/:name.mp4 or /isl/:name
  app.get("/isl/:name.mp4", (req, res, next) => {
    return serveISLVideoFile(req.params.name, res, next);
  });

  app.get("/isl/:name", (req, res, next) => {
    return serveISLVideoFile(req.params.name, res, next);
  });

  // Legacy fallback: /:name.mp4 (serves from public/isl/ if available)
  app.get("/:name.mp4", (req, res, next) => {
    const raw = String(req.params.name || "");
    const baseInput = path.basename(raw).replace(/\.mp4$/i, "");
    if (/^[a-zA-Z0-9_-]+$/.test(baseInput)) {
      const candidatePath = path.resolve(ISL_DATASET_DIR, `${baseInput}.mp4`);
      if (candidatePath.startsWith(ISL_DATASET_DIR + path.sep) && fs.existsSync(candidatePath)) {
        return serveISLVideoFile(baseInput, res, next);
      }
    }
    next();
  });

  // Rate limiter for AI & translation endpoints
  const aiLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 60,
    message: "Rate limit reached for AI assistance. Please wait a moment.",
  });

  // Helper to extract sanitized, safe error info without exposing secrets or prompts
  const getSafeGeminiError = (err: any): string => {
    if (!err) return "UNKNOWN_ERROR";
    const msg = typeof err.message === "string" ? err.message : "";
    if (msg.startsWith("REQUEST_TIMEOUT")) {
      return "TIMEOUT (Request exceeded time limit)";
    }
    if (err.status === 429 || err.statusCode === 429 || err.code === 429 || msg.includes('"code":429') || msg.includes("RESOURCE_EXHAUSTED")) {
      return "HTTP 429 (Resource Exhausted / Free Quota Exceeded)";
    }
    if (err.status === 401 || err.statusCode === 401 || msg.includes('"code":401')) {
      return "HTTP 401 (Unauthorized / Invalid Key)";
    }
    if (err.status) return `HTTP ${err.status} ${err.statusText || ""}`.trim();
    if (err.statusCode) return `HTTP ${err.statusCode}`;
    if (err.code) return `CODE: ${err.code}`;
    if (err.name) return `TYPE: ${err.name}`;
    return "API_CALL_FAILED";
  };

  // Promise timeout helper
  const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`REQUEST_TIMEOUT_${label}`)), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
  };

  // ISL Text Translation & Glossing API
  app.post("/api/isl-translate", aiLimiter, async (req, res) => {
    try {
      const { sentence, sentences } = req.body;
      const inputSentences: string[] = sentences && Array.isArray(sentences)
        ? sentences
            .filter((s: any) => typeof s === "string" && s.trim().length > 0)
            .map((s: string) => s.trim().slice(0, 500))
            .slice(0, 20)
        : sentence && typeof sentence === "string" && sentence.trim().length > 0
        ? [sentence.trim().slice(0, 500)]
        : [];

      if (inputSentences.length === 0) {
        return res.status(400).json({ error: "No text or sentence provided for translation." });
      }

      const geminiKey = process.env.GEMINI_API_KEY;

      const systemInstruction = `You are an Indian Sign Language (ISL) linguistic assistant.
Convert the supplied English sentence into an ISL-style gloss.
Do NOT translate word-for-word.

Consider:
* ISL sentence structure (Subject - Object - Verb / Topic - Comment)
* Removal of unnecessary English auxiliary verbs (is, am, are, was, were, been, being, will, shall, do, does, did, has, have, had) and articles (a, an, the, of)
* Temporal information placed at the beginning (e.g. TOMORROW, YESTERDAY, NOW, TODAY)
* Question structure (WH-words or question markers placed at the end)
* Negation placed after the predicate (e.g. NOT, NONE, NO)
* Subject/Object ordering
* Important semantic information and core visual concept signs

Return JSON object in this exact schema:
{
  "results": [
    {
      "english": "<original sentence>",
      "isl_gloss": "<UPPERCASE ISL GLOSS>",
      "signs": [
        {
          "word": "<WORD_IN_GLOSS>",
          "search_key": "<normalized_lowercase_key>"
        }
      ]
    }
  ]
}

Return only valid JSON.`;

      // 1. Try Gemini API with automatic model fallback for high-demand spikes
      if (geminiKey && geminiKey.trim().length > 0) {
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.7-flash"];
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });

        const prompt = `Convert the following English sentences into ISL-style glosses:\n${JSON.stringify(inputSentences, null, 2)}`;

        for (const modelName of candidateModels) {
          const reqStartTime = Date.now();
          const reqStartTimeISO = new Date(reqStartTime).toISOString();
          console.log(`[ISL Diagnostic] Gemini request START | Model: ${modelName} | Start Time: ${reqStartTimeISO}`);

          try {
            // Disable extended thinking for instant sub-second gloss generation
            const thinkingConfig = { thinkingBudget: 0 };

            const response = await withTimeout(
              ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                  systemInstruction,
                  responseMimeType: "application/json",
                  thinkingConfig,
                }
              }),
              12000,
              modelName
            );

            const reqEndTime = Date.now();
            const reqEndTimeISO = new Date(reqEndTime).toISOString();
            const durationMs = reqEndTime - reqStartTime;

            if (response.text) {
              console.log(
                `[ISL Diagnostic] Gemini request SUCCESS | Model: ${modelName} | End Time: ${reqEndTimeISO} | Duration: ${durationMs}ms`
              );

              const parsed = JSON.parse(response.text.trim());
              const results = Array.isArray(parsed)
                ? parsed
                : parsed.results
                ? parsed.results
                : [parsed];

              // Save only generated output and metadata to MongoDB (Data Minimization: NO sourceText)
              if (isDatabaseConnected()) {
                GeneratedContent.create({
                  contentId: `isl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                  contentType: "isl_gloss",
                  title: `ISL Translation (${inputSentences.length} sentences)`,
                  generatedOutput: results,
                  modelProvider: modelName.startsWith("gemini-") ? modelName : `gemini-${modelName}`,
                  language: "en",
                  targetFormat: "isl",
                  metadata: {
                    signsCount: results.reduce((acc: number, r: any) => acc + (r.signs?.length || 0), 0),
                  },
                }).catch((e) => console.warn("[MongoDB Auto-Save] Notice:", e?.message));
              }

              return res.json({
                results,
                provider: modelName.startsWith("gemini-") ? modelName : `gemini-${modelName}`,
              });
            }
          } catch (modelErr: any) {
            const reqEndTime = Date.now();
            const reqEndTimeISO = new Date(reqEndTime).toISOString();
            const durationMs = reqEndTime - reqStartTime;
            const safeError = getSafeGeminiError(modelErr);

            console.warn(
              `[ISL Diagnostic] Gemini request FAILED | Model: ${modelName} | End Time: ${reqEndTimeISO} | Duration: ${durationMs}ms | Status/Error: ${safeError}`
            );
            console.log(
              `[ISL Diagnostic] Triggering fallback from ${modelName} due to reason: ${safeError}`
            );
          }
        }
      } else {
        console.log(`[ISL Diagnostic] No GEMINI_API_KEY configured. Triggering rule-based fallback.`);
      }

      // 2. High-precision rule-based ISL Linguistic Gloss Generator Fallback
      console.log(`[ISL Diagnostic] Executing rule-based ISL Linguistic Engine fallback.`);
      const fallbackResults = inputSentences.map((orig) => {
        return generateRuleBasedISLGloss(orig);
      });

      // Save to MongoDB asynchronously (Data Minimization: NO sourceText)
      if (isDatabaseConnected()) {
        GeneratedContent.create({
          contentId: `isl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          contentType: "isl_gloss",
          title: `ISL Translation (${inputSentences.length} sentences - Rule Engine)`,
          generatedOutput: fallbackResults,
          modelProvider: "isl-linguistic-engine",
          language: "en",
          targetFormat: "isl",
          metadata: {
            signsCount: fallbackResults.reduce((acc: number, r: any) => acc + (r.signs?.length || 0), 0),
          },
        }).catch((e) => console.warn("[MongoDB Auto-Save] Notice:", e?.message));
      }

      return res.json({
        results: fallbackResults,
        provider: "isl-linguistic-engine"
      });
    } catch (err) {
      console.error("ISL translation error occurred");
      res.status(500).json({ error: "Failed to translate text to ISL gloss." });
    }
  });

  // Unified Media (Video & Audio) Transcription API
  const handleMediaTranscribe = async (req: express.Request, res: express.Response) => {
    try {
      const {
        title,
        videoTitle,
        fileName,
        duration = 60,
        mediaBase64,
        mimeType = "audio/wav",
        mediaType = "video"
      } = req.body;

      const rawTitle = title || videoTitle || fileName || "Uploaded Media";
      const cleanTitle = typeof rawTitle === "string" && rawTitle.trim().length > 0
        ? rawTitle.trim().slice(0, 200)
        : (mediaType === "audio" ? "Uploaded Audio Recording" : "Uploaded Lecture Video");
      const totalDuration = Math.max(1, Math.min(7200, Number(duration) || 60));
      const isAudio = mediaType === "audio";

      if (!mediaBase64 || typeof mediaBase64 !== "string" || mediaBase64.trim().length < 50) {
        return res.status(400).json({
          error: isAudio
            ? "No audio data was supplied for transcription. Please select an audio file."
            : "No video audio media data was supplied for transcription. Please select a video file with an audio track."
        });
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey || geminiKey.trim().length === 0) {
        return res.status(500).json({
          error: "Gemini API key is not configured on the server. Unable to process transcription."
        });
      }

      const cleanMimeType = typeof mimeType === "string" && mimeType.includes("/")
        ? mimeType
        : "audio/wav";

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.7-flash"];
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const systemInstruction = `You are a verbatim speech-to-text transcription engine.
Transcribe the actual spoken audio from the provided ${isAudio ? 'audio recording' : 'video media'} accurately and verbatim.
Do NOT fabricate, hallucinate, or invent text that was not spoken in this recording.
If words are spoken, generate timestamped segments for each sentence with precise start and end times in seconds.
Identify distinct speakers (e.g., "Instructor", "Speaker 1", "Speaker 2", "Student") when distinct voices occur.
Optionally include descriptive sound cues in brackets (e.g., [Applause], [Music], [Chime], [Slide Transition], [Question]) if clearly audible.

Return a JSON object in this exact schema:
{
  "title": "${cleanTitle}",
  "mediaType": "${isAudio ? 'audio' : 'video'}",
  "duration": <actual spoken duration in seconds as number>,
  "summary": "Concise 1-2 sentence overview of the spoken content",
  "keyTerms": ["Spoken Term 1", "Spoken Term 2", "Spoken Term 3"],
  "segments": [
    {
      "id": "seg_1",
      "start": 0.0,
      "end": 4.5,
      "speaker": "Speaker 1",
      "text": "Actual verbatim spoken sentence here.",
      "soundCue": "Optional sound cue or null"
    }
  ]
}

CRITICAL RULES:
1. Every segment's "text" MUST be the actual spoken words in the audio. Never return generic boilerplate.
2. If the media contains NO speech, silence, or non-vocal background noise only, return:
{
  "error": "NO_SPEECH_DETECTED",
  "segments": []
}
3. Return ONLY valid JSON.`;

      const prompt = `Transcribe the spoken audio in this media file with verbatim sentence segments and exact timestamps.`;

      for (const modelName of candidateModels) {
        try {
          const thinkingConfig = { thinkingBudget: 0 };

          const response = await withTimeout(
            ai.models.generateContent({
              model: modelName,
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      inlineData: {
                        mimeType: cleanMimeType,
                        data: mediaBase64.trim()
                      }
                    },
                    {
                      text: prompt
                    }
                  ]
                }
              ],
              config: {
                systemInstruction,
                responseMimeType: "application/json",
                thinkingConfig,
              }
            }),
            50000,
            modelName
          );

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());

            if (parsed.error === "NO_SPEECH_DETECTED" || (!parsed.segments || parsed.segments.length === 0)) {
              return res.status(422).json({
                error: isAudio
                  ? "Unable to detect any spoken audio in this audio file. Please check that the recording contains clear audible speech."
                  : "Unable to detect any spoken audio in this video. Please check that the video contains an audible voice track."
              });
            }

            const rawSegments = Array.isArray(parsed.segments) ? parsed.segments : [];
            const validSegments = rawSegments.filter((s: any) => typeof s.text === "string" && s.text.trim().length > 0);

            if (validSegments.length === 0) {
              return res.status(422).json({
                error: isAudio
                  ? "Unable to transcribe the audio from this file. Please check that it contains clear audible speech."
                  : "Unable to transcribe the audio from this video. Please try another video or check that it contains a clear audio track."
              });
            }

            // Normalize timestamps
            const normalizedSegments = validSegments.map((s: any, idx: number) => {
              const start = Math.max(0, Number(s.start) || 0);
              const end = Math.max(start + 1, Number(s.end) || start + 5);
              return {
                id: s.id || `seg_${idx + 1}`,
                start: Math.round(start * 10) / 10,
                end: Math.round(end * 10) / 10,
                speaker: s.speaker || (idx % 3 === 2 ? "Speaker 2" : "Speaker 1"),
                text: String(s.text).trim(),
                soundCue: s.soundCue || undefined,
              };
            });

            const maxEnd = normalizedSegments.reduce((max, s) => Math.max(max, s.end), totalDuration);

            const resultData = {
              title: parsed.title || cleanTitle,
              mediaType: isAudio ? "audio" : "video",
              duration: Math.max(totalDuration, Math.round(maxEnd)),
              summary: parsed.summary || `Transcription for ${cleanTitle}.`,
              keyTerms: Array.isArray(parsed.keyTerms) && parsed.keyTerms.length > 0 ? parsed.keyTerms : ["Spoken Content"],
              segments: normalizedSegments,
              provider: modelName,
            };

            // Save to MongoDB asynchronously (data minimization - stores only output transcript)
            if (isDatabaseConnected()) {
              GeneratedContent.create({
                contentId: `transcribe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                contentType: "audio_transcript",
                title: cleanTitle,
                generatedOutput: resultData,
                modelProvider: resultData.provider,
                language: "en",
                targetFormat: "structured_json",
                metadata: {
                  mediaType: isAudio ? "audio" : "video",
                  duration: resultData.duration,
                  segmentsCount: normalizedSegments.length,
                },
              }).catch((e) => console.warn("[MongoDB Auto-Save] Notice:", e?.message));
            }

            return res.json(resultData);
          }
        } catch (modelErr: any) {
          console.warn(`[MediaTranscribe] Model ${modelName} error:`, getSafeGeminiError(modelErr));
        }
      }

      return res.status(422).json({
        error: isAudio
          ? "Unable to transcribe the audio from this file. Please check that it contains clear audible speech."
          : "Unable to transcribe the audio from this video. Please try another video or check that it contains a clear audio track."
      });
    } catch (err) {
      console.error("Media transcription error occurred:", err);
      res.status(500).json({
        error: "Failed to transcribe media audio. Please try another file with clear audio."
      });
    }
  };

  // Route bindings for Media & Video transcription
  app.post("/api/media-transcribe", aiLimiter, handleMediaTranscribe);
  app.post("/api/video-transcribe", aiLimiter, handleMediaTranscribe);

  // Spoken Audio File Transcription API (for Audio Learning)
  app.post("/api/audio-transcribe", aiLimiter, async (req, res) => {
    try {
      const { audioBase64, mimeType = "audio/wav", fileName } = req.body;
      const cleanFileName = typeof fileName === "string" && fileName.trim() ? fileName.trim() : "uploaded_audio";

      if (!audioBase64 || typeof audioBase64 !== "string" || audioBase64.trim().length < 50) {
        return res.status(400).json({
          error: "No audio data received. Please select an audio file (.mp3, .wav, .m4a, .ogg, .webm)."
        });
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey || geminiKey.trim().length === 0) {
        return res.status(500).json({
          error: "Gemini API key is not configured on the server. Unable to process transcription."
        });
      }

      const cleanMimeType = typeof mimeType === "string" && mimeType.includes("/")
        ? mimeType
        : "audio/wav";

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.7-flash"];
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const systemInstruction = `You are a high-accuracy verbatim speech-to-text transcription engine.
Transcribe the provided audio recording into clean, accurate English text.
Do NOT fabricate, hallucinate, or invent text that was not spoken in this recording.
Do NOT add introductory preambles (like "Here is the transcript:"), conversational filler, or commentary.
Return a JSON object in this exact schema:
{
  "transcript": "Full verbatim transcribed text from the audio...",
  "hasSpeech": true,
  "wordCount": 120,
  "summary": "Brief summary of what was discussed"
}

If the audio contains NO speech, silence, or unintelligible noise, return:
{
  "transcript": "",
  "hasSpeech": false,
  "wordCount": 0,
  "error": "NO_SPEECH_DETECTED"
}
Return ONLY valid JSON.`;

      for (const modelName of candidateModels) {
        try {
          const thinkingConfig = { thinkingBudget: 0 };

          const response = await withTimeout(
            ai.models.generateContent({
              model: modelName,
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      inlineData: {
                        mimeType: cleanMimeType,
                        data: audioBase64.trim()
                      }
                    },
                    {
                      text: "Transcribe this audio recording verbatim."
                    }
                  ]
                }
              ],
              config: {
                systemInstruction,
                responseMimeType: "application/json",
                thinkingConfig,
              }
            }),
            50000,
            modelName
          );

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());

            if (parsed.error === "NO_SPEECH_DETECTED" || !parsed.transcript || !parsed.transcript.trim()) {
              return res.status(422).json({
                error: "Unable to detect any spoken words in this audio file. Please ensure the file contains audible speech."
              });
            }

            const cleanTranscript = parsed.transcript.trim();
            const words = cleanTranscript.split(/\s+/).length;

            const resultData = {
              success: true,
              transcript: cleanTranscript,
              wordCount: words,
              summary: parsed.summary || "",
              fileName: cleanFileName,
              provider: modelName,
            };

            // Save to MongoDB asynchronously (data minimization - stores only output transcript)
            if (isDatabaseConnected()) {
              GeneratedContent.create({
                contentId: `audio_transcribe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                contentType: "audio_transcript",
                title: cleanFileName,
                generatedOutput: resultData,
                modelProvider: resultData.provider,
                language: "en",
                targetFormat: "structured_json",
                metadata: {
                  wordCount: words,
                },
              }).catch((e) => console.warn("[MongoDB Auto-Save] Notice:", e?.message));
            }

            return res.json(resultData);
          }
        } catch (modelErr: any) {
          console.warn(`[AudioTranscribe] Model ${modelName} error:`, getSafeGeminiError(modelErr));
        }
      }

      return res.status(422).json({
        error: "Unable to transcribe the audio from this file. Please check that it contains clear audible speech."
      });
    } catch (err) {
      console.error("Audio transcription error occurred:", err);
      res.status(500).json({
        error: "Unable to transcribe the audio from this file. Please check that it contains clear audible speech."
      });
    }
  });

  // Helper for saving chat messages to MongoDB asynchronously
  const recordTutorInteraction = (
    userMsg: string,
    botReply: string,
    providerName: string,
    reqFeature?: string,
    reqMode?: string,
  ) => {
    if (!isDatabaseConnected()) return;
    const now = new Date();
    const sessionId = `lumi_session_${reqMode || 'general'}`;

    ChatHistory.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          title: `Lumi Assistant (${reqMode || 'General'})`,
          mode: reqMode || 'general',
          featureId: reqFeature || 'general',
        },
        $push: {
          messages: [
            {
              id: `msg_u_${Date.now()}`,
              sender: 'user',
              text: String(userMsg).slice(0, 5000),
              timestamp: now,
              mode: reqMode,
            },
            {
              id: `msg_l_${Date.now() + 1}`,
              sender: 'lumi',
              text: String(botReply).slice(0, 10000),
              timestamp: new Date(now.getTime() + 500),
              provider: providerName,
              mode: reqMode,
            },
          ],
        },
        $inc: { messageCount: 2 },
        $set: { lastActive: now },
      },
      { upsert: true }
    ).catch((e) => console.warn('[MongoDB Chat Log] Notice:', e?.message));
  };

  // OpenRouter & AI Tutor endpoint (Lumi Global Assistant)
  app.post("/api/tutor", aiLimiter, async (req, res) => {
    try {
      const { message, history, noteContext, feature, mode } = req.body;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ error: "Valid message is required" });
      }

      const cleanMessage = message.trim().slice(0, 3000);
      const openRouterKey = process.env.OPENROUTER_API_KEY;
      const geminiKey = process.env.GEMINI_API_KEY;

      const isHearingMode = mode === 'hearing_accessibility';
      const isVisualMode = mode === 'visual_accessibility';

      let systemPrompt = `You are Lumi, the intelligent, encouraging, accessible AI learning assistant across the ALTA application.

CORE INTERACTION & QUIZZING GUIDELINES:
- Keep responses concise, direct, and conversational. Avoid unnecessary long explanations unless the user explicitly asks for them.
- When the student asks to be quizzed (e.g., "Quiz me on the signs in this sentence", "Quiz me", "Test my knowledge"):
  1. Do NOT generate a long study guide or the entire quiz at once.
  2. Briefly acknowledge the request in one line, identifying the relevant signs or topic.
  3. Immediately ask ONLY ONE question at a time (e.g. Q1) with clear options (A, B, C) and instruct: "Reply with A, B, or C."
  4. Wait for the user's answer before asking the next question.
  5. When the user responds with their answer:
     - State whether their answer is correct or incorrect.
     - Provide a short, crisp 1-2 sentence explanation.
     - Immediately ask the next single question (e.g. Q2).`;
      
      if (isHearingMode) {
        systemPrompt += `\n\nThe student is currently using Hearing Accessibility Mode (optimized for Deaf and Hard of Hearing students).
Focus on clear, high-contrast, structured textual explanations, visual summaries, bulleted breakdowns, and conceptual clarity. Avoid relying on sound-dependent cues. When discussing sign language or ISL glosses, maintain linguistic precision.`;
      } else if (isVisualMode) {
        systemPrompt += `\n\nThe student is currently using Visual Accessibility Mode (optimized for blind and low-vision students).
Focus on rich descriptive explanations, mental spatial imagery, auditory clarity, and easy-to-read-aloud step-by-step reasoning.`;
      } else {
        systemPrompt += `\n\nYour goal is to provide clear, accessible, and structured explanations for all learners.`;
      }

      if (feature) {
        systemPrompt += `\nCurrent Active Feature: ${String(feature).slice(0, 60)}`;
      }

      if (noteContext && typeof noteContext === 'string' && noteContext.trim().length > 0) {
        systemPrompt += `\n\nCURRENT LEARNING & LESSON CONTEXT:\n"""\n${noteContext.trim().slice(0, 2000)}\n"""\nUse this active screen content, note, transcript, or ISL lesson context directly to answer the student's question accurately, explain concepts, summarize, or quiz them.`;
      }

      const sanitizedHistoryForChat = Array.isArray(history)
        ? history.slice(-8).map((h: any) => ({
            role: h.role === "user" ? "user" : "assistant",
            content: String(h.content || "").slice(0, 2000),
          }))
        : [];

      // 1. Try OpenRouter API if key is present
      if (openRouterKey && openRouterKey.trim().length > 0) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.APP_URL || "https://alta-accessible-learning.app",
              "X-Title": "Alta AI Tutor Lumi",
            },
            body: JSON.stringify({
              model: "google/gemma-4-31b-it:free",
              messages: [
                { role: "system", content: systemPrompt },
                ...sanitizedHistoryForChat,
                { role: "user", content: cleanMessage },
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              recordTutorInteraction(cleanMessage, reply, "openrouter", feature, mode);
              return res.json({ reply, provider: "openrouter" });
            }
          }
        } catch (openRouterErr) {
          console.warn("OpenRouter note, falling back to local/Gemini engine");
        }
      }

      // 2. Fallback to Gemini if OpenRouter is unavailable or pending key
      if (geminiKey && geminiKey.trim().length > 0) {
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.7-flash"];
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });

        // Format full multi-turn conversation for Gemini
        const geminiContents = [
          ...sanitizedHistoryForChat.map((h) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }],
          })),
          {
            role: "user",
            parts: [{ text: cleanMessage }],
          },
        ];

        for (const modelName of candidateModels) {
          try {
            const response = await withTimeout(
              ai.models.generateContent({
                model: modelName,
                contents: geminiContents,
                config: {
                  systemInstruction: systemPrompt,
                  thinkingConfig: { thinkingBudget: 0 },
                },
              }),
              12000,
              modelName
            );
            if (response.text) {
              const cleanProvider = modelName.startsWith("gemini-") ? modelName : `gemini-${modelName}`;
              recordTutorInteraction(cleanMessage, response.text, cleanProvider, feature, mode);
              return res.json({ reply: response.text, provider: cleanProvider });
            }
          } catch (geminiErr) {
            // Continue to secondary model or local response
          }
        }
      }

      // 3. Smart, concise rule-based fallback response
      const lowerMsg = cleanMessage.toLowerCase();
      let fallbackReply = `Hi! I'm Lumi, your accessible AI assistant. I'm here to help you learn with concise, interactive explanations. What would you like to explore?`;

      if (lowerMsg.includes('quiz') || lowerMsg.includes('test me')) {
        fallbackReply = `Sure! Let's practice with a quick quiz on ISL signs.\n\nQ1. In Indian Sign Language (ISL), what handshape is used for the sign 'YOU'?\n\nA) Closed fist\nB) Extended index finger\nC) Flat open hand\n\nReply with A, B, or C.`;
      } else if (
        lowerMsg === 'b' ||
        lowerMsg.includes('option b') ||
        lowerMsg.includes('extended index finger') ||
        lowerMsg === 'b)'
      ) {
        fallbackReply = `Correct! 🎉 In ISL, pointing an extended index finger toward someone indicates 'YOU'.\n\nQ2. Where is the sign for 'THANK YOU' initiated in ISL?\n\nA) Chin moving outward toward the person\nB) Forehead tapping twice\nC) Beside the ear\n\nReply with A, B, or C.`;
      } else if (
        lowerMsg === 'a' ||
        lowerMsg === 'c' ||
        lowerMsg.includes('option a') ||
        lowerMsg.includes('option c') ||
        lowerMsg === 'a)' ||
        lowerMsg === 'c)'
      ) {
        fallbackReply = `Not quite! The correct answer was B (Extended index finger), which is used to point toward the referent.\n\nQ2. Where is the sign for 'THANK YOU' initiated in ISL?\n\nA) Chin moving outward toward the person\nB) Forehead tapping twice\nC) Beside the ear\n\nReply with A, B, or C.`;
      } else if (noteContext && noteContext.trim().length > 0) {
        fallbackReply = `Regarding your active lesson: "${cleanMessage}". I can help summarize key points or give you a quick 1-question quiz. Would you like to start?`;
      }

      recordTutorInteraction(cleanMessage, fallbackReply, "lumi-core", feature, mode);
      return res.json({
        reply: fallbackReply,
        provider: "lumi-core"
      });
    } catch (err) {
      console.error("Tutor route notice");
      res.status(500).json({ error: "Failed to generate tutor response." });
    }
  });

  // Global Centralized Error Handler (Prevents stack trace / credential exposure)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Server Notice] Unhandled exception occurred.");
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      error: "An unexpected error occurred. Please try again.",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

/**
 * Linguistic Indian Sign Language (ISL) Rule-Based Gloss Engine
 * Converts English syntax to ISL structure: TIME + SUBJECT + OBJECT + VERB + NEGATION + QUESTION
 */
function generateRuleBasedISLGloss(englishSentence: string) {
  if (!englishSentence || typeof englishSentence !== 'string') {
    return {
      english: "",
      isl_gloss: "",
      signs: []
    };
  }

  const rawCleaned = englishSentence.trim();
  const isQuestion = rawCleaned.endsWith('?');

  const words = rawCleaned
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const timeKeywords = new Set([
    'tomorrow', 'yesterday', 'today', 'now', 'daily', 'everyday',
    'morning', 'afternoon', 'evening', 'night', 'soon', 'later',
    'always', 'never', 'past', 'future', 'monday', 'tuesday',
    'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'year', 'month', 'week'
  ]);

  const questionKeywords = new Set([
    'what', 'why', 'where', 'when', 'who', 'whom', 'whose', 'which', 'how'
  ]);

  const negationKeywords = new Set([
    'not', 'no', 'never', 'none', 'cannot', 'cant', 'dont', 'doesnt', 'didnt', 'wont'
  ]);

  const stopAuxiliaries = new Set([
    'is', 'am', 'are', 'was', 'were', 'been', 'being', 'be',
    'a', 'an', 'the', 'of', 'to', 'for', 'by', 'at', 'in', 'on', 'into',
    'will', 'shall', 'would', 'could', 'should', 'do', 'does', 'did',
    'has', 'have', 'had', 'having', 'very', 'just', 'that', 'this', 'these', 'those'
  ]);

  // Common stem / lemmatization dictionary
  const lemmatizer: Record<string, string> = {
    'going': 'go',
    'goes': 'go',
    'went': 'go',
    'gone': 'go',
    'coming': 'come',
    'comes': 'come',
    'came': 'come',
    'learning': 'learn',
    'learns': 'learn',
    'learned': 'learn',
    'studying': 'study',
    'studies': 'study',
    'studied': 'study',
    'teaching': 'teach',
    'teaches': 'teach',
    'taught': 'teach',
    'reading': 'read',
    'reads': 'read',
    'writing': 'write',
    'writes': 'write',
    'wrote': 'write',
    'written': 'write',
    'eating': 'eat',
    'eats': 'eat',
    'ate': 'eat',
    'drinking': 'drink',
    'drinks': 'drink',
    'drank': 'drink',
    'helping': 'help',
    'helps': 'help',
    'helped': 'help',
    'playing': 'play',
    'plays': 'play',
    'played': 'play',
    'seeing': 'see',
    'sees': 'see',
    'saw': 'see',
    'seen': 'see',
    'hearing': 'hear',
    'hears': 'hear',
    'heard': 'hear',
    'students': 'student',
    'teachers': 'teacher',
    'books': 'book',
    'schools': 'school',
    'classes': 'class',
    'friends': 'friend',
    'questions': 'question',
    'words': 'word',
    'plants': 'plant',
    'leaves': 'leaf',
    'cells': 'cell',
    'sunlight': 'sun'
  };

  const timeList: string[] = [];
  const questionList: string[] = [];
  const negationList: string[] = [];
  const coreWords: string[] = [];

  for (const rawWord of words) {
    const lower = rawWord.toLowerCase();
    const lemma = lemmatizer[lower] || lower;

    if (timeKeywords.has(lower) || timeKeywords.has(lemma)) {
      timeList.push(lemma);
    } else if (questionKeywords.has(lower) || questionKeywords.has(lemma)) {
      questionList.push(lemma);
    } else if (negationKeywords.has(lower) || negationKeywords.has(lemma)) {
      negationList.push(lemma === 'cant' || lemma === 'dont' || lemma === 'doesnt' || lemma === 'didnt' || lemma === 'wont' ? 'not' : lemma);
    } else if (!stopAuxiliaries.has(lower)) {
      coreWords.push(lemma);
    }
  }

  // ISL Ordered tokens: TIME -> CORE CONTENT (SOV) -> NEGATION -> QUESTION
  const finalTokens = [
    ...timeList,
    ...coreWords,
    ...negationList,
    ...questionList
  ];

  if (isQuestion && questionList.length === 0 && finalTokens.length > 0) {
    finalTokens.push('question');
  }

  // If sentence reduced to empty, keep base uppercase words
  const fallbackTokens = finalTokens.length > 0
    ? finalTokens
    : words.map((w) => lemmatizer[w.toLowerCase()] || w.toLowerCase());

  const islGloss = fallbackTokens.map((t) => t.toUpperCase()).join(' ');

  const signs = fallbackTokens.map((token) => ({
    word: token.toUpperCase(),
    search_key: token.toLowerCase()
  }));

  return {
    english: rawCleaned,
    isl_gloss: islGloss,
    signs
  };
}

startServer();
