import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FileText,
  Upload,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  FileCode,
  Check,
  Headphones
} from 'lucide-react';
import mammoth from 'mammoth';
import { voiceFeedback } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { extractMediaAudioData } from '../utils/audioExtractor';

interface AudioLearningSectionProps {
  onBack?: () => void;
}

interface SentenceSegment {
  id: number;
  text: string;
  wordCount: number;
}

export const AudioLearningSection: React.FC<AudioLearningSectionProps> = ({ onBack }) => {
  // ----------------------------------------------------
  // CONTENT & INPUT STATE
  // ----------------------------------------------------
  const [inputText, setInputText] = useState<string>(
    'Welcome to the Audio Learning Portal. This system converts educational reading materials, scientific articles, and lecture notes into natural spoken audio. You can paste English text or upload TXT and DOCX files. Double-tap the audio playback card anytime to start or pause playback.'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isFileReading, setIsFileReading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // ----------------------------------------------------
  // AUDIO GENERATION & PLAYBACK STATE
  // ----------------------------------------------------
  const [isGenerated, setIsGenerated] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);

  // Double-tap gesture ref on the Audio Player card
  const lastAudioTapRef = useRef<number>(0);
  const audioTapTimerRef = useRef<any>(null);

  // Timer interval ref for updating elapsed playback time
  const playbackTimerRef = useRef<any>(null);

  // Reference to current active SpeechSynthesisUtterance
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  const currentSegmentIndexRef = useRef<number>(currentSegmentIndex);
  currentSegmentIndexRef.current = currentSegmentIndex;

  const playbackSpeedRef = useRef<number>(playbackSpeed);
  playbackSpeedRef.current = playbackSpeed;

  // Split content into clean sentence segments for structured playback navigation
  const segments: SentenceSegment[] = useMemo(() => {
    if (!inputText.trim()) return [];
    // Split on sentence boundaries (. ? ! or newline)
    const rawMatches = inputText
      .replace(/\r\n/g, '\n')
      .split(/(?<=[.?!])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return rawMatches.map((text, idx) => ({
      id: idx,
      text,
      wordCount: text.split(/\s+/).length,
    }));
  }, [inputText]);

  // Total words and estimated duration (assuming average 140 words per minute at 1.0x speed)
  const totalWords = useMemo(() => {
    return segments.reduce((sum, seg) => sum + seg.wordCount, 0);
  }, [segments]);

  const totalDurationSeconds = useMemo(() => {
    if (totalWords === 0) return 0;
    const baseSeconds = Math.round((totalWords / 140) * 60);
    return Math.max(5, Math.round(baseSeconds / playbackSpeed));
  }, [totalWords, playbackSpeed]);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (audioTapTimerRef.current) clearTimeout(audioTapTimerRef.current);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, []);

  // Format seconds into mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // SPEECH SYNTHESIS ENGINE
  // ----------------------------------------------------
  const playSegment = (index: number) => {
    if (!('speechSynthesis' in window) || segments.length === 0) {
      return;
    }

    if (index >= segments.length) {
      // Completed all segments
      stopAudioPlayback();
      voiceFeedback.speak('Audio playback completed.');
      return;
    }

    // Cancel existing utterance
    window.speechSynthesis.cancel();

    const segment = segments[index];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.rate = playbackSpeedRef.current;
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1.0;

    // Use a clean English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentSegmentIndex(index);
    };

    utterance.onend = () => {
      if (isPlayingRef.current && index + 1 < segments.length) {
        playSegment(index + 1);
      } else if (index + 1 >= segments.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTimeSeconds(totalDurationSeconds);
        clearInterval(playbackTimerRef.current);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error in segment:', e);
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startAudioPlayback = () => {
    if (segments.length === 0) {
      voiceFeedback.speak('No text available to play. Please enter or upload content.');
      return;
    }

    triggerHaptic('success');
    setIsPlaying(true);
    setIsPaused(false);
    voiceFeedback.speak('Audio playing');

    // Start progress timer
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    playbackTimerRef.current = setInterval(() => {
      setCurrentTimeSeconds((prev) => {
        if (prev >= totalDurationSeconds) {
          return totalDurationSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    playSegment(currentSegmentIndex);
  };

  const pauseAudioPlayback = () => {
    triggerHaptic('medium');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
    setIsPaused(true);
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    voiceFeedback.speak('Audio paused');
  };

  const resumeAudioPlayback = () => {
    triggerHaptic('success');
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      voiceFeedback.speak('Audio playing');

      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = setInterval(() => {
        setCurrentTimeSeconds((prev) => Math.min(totalDurationSeconds, prev + 1));
      }, 1000);
    } else {
      playSegment(currentSegmentIndex);
    }
  };

  const restartAudioPlayback = () => {
    triggerHaptic('medium');
    window.speechSynthesis.cancel();
    setCurrentSegmentIndex(0);
    setCurrentTimeSeconds(0);
    voiceFeedback.speak('Audio restarted');
    startAudioPlayback();
  };

  const stopAudioPlayback = () => {
    triggerHaptic('light');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTimeSeconds(0);
    setCurrentSegmentIndex(0);
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
  };

  const handleNextSegment = () => {
    triggerHaptic('light');
    if (currentSegmentIndex + 1 < segments.length) {
      const nextIdx = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIdx);
      const approxSec = Math.round((nextIdx / segments.length) * totalDurationSeconds);
      setCurrentTimeSeconds(approxSec);
      if (isPlaying) {
        playSegment(nextIdx);
      }
      voiceFeedback.speak(`Segment ${nextIdx + 1} of ${segments.length}`);
    } else {
      voiceFeedback.speak('At the end of audio.');
    }
  };

  const handlePreviousSegment = () => {
    triggerHaptic('light');
    if (currentSegmentIndex > 0) {
      const prevIdx = currentSegmentIndex - 1;
      setCurrentSegmentIndex(prevIdx);
      const approxSec = Math.round((prevIdx / segments.length) * totalDurationSeconds);
      setCurrentTimeSeconds(approxSec);
      if (isPlaying) {
        playSegment(prevIdx);
      }
      voiceFeedback.speak(`Segment ${prevIdx + 1} of ${segments.length}`);
    } else {
      voiceFeedback.speak('At the beginning of audio.');
    }
  };

  const handleChangeSpeed = (speed: number) => {
    triggerHaptic('selection');
    setPlaybackSpeed(speed);
    playbackSpeedRef.current = speed;
    voiceFeedback.speak(`Speed ${speed}x`);
    if (isPlaying) {
      // Re-trigger current segment with new speed
      playSegment(currentSegmentIndex);
    }
  };

  // ----------------------------------------------------
  // DOUBLE TAP GESTURE HANDLER (SCOPED TO AUDIO PLAYER)
  // Double Tap -> Play / Pause
  // ----------------------------------------------------
  const handleAudioPlayerTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent double tap from firing when user clicks an actual button directly
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select')) {
      return;
    }

    const now = Date.now();
    const timeDiff = now - lastAudioTapRef.current;
    lastAudioTapRef.current = now;

    if (timeDiff > 40 && timeDiff < 400) {
      // Confirmed Double Tap!
      if (audioTapTimerRef.current) {
        clearTimeout(audioTapTimerRef.current);
        audioTapTimerRef.current = null;
      }

      if (isPlaying) {
        pauseAudioPlayback();
      } else if (isPaused) {
        resumeAudioPlayback();
      } else {
        startAudioPlayback();
      }
    }
  };

  // ----------------------------------------------------
  // FILE UPLOAD HANDLER (.TXT, .DOCX, & AUDIO FILES)
  // ----------------------------------------------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setIsFileReading(true);
    triggerHaptic('medium');
    voiceFeedback.speak(`Processing file ${file.name}`);

    try {
      const fileName = file.name.toLowerCase();
      let extractedText = '';

      const isAudio =
        fileName.endsWith('.mp3') ||
        fileName.endsWith('.wav') ||
        fileName.endsWith('.m4a') ||
        fileName.endsWith('.ogg') ||
        fileName.endsWith('.webm') ||
        file.type.startsWith('audio/');

      if (fileName.endsWith('.txt')) {
        extractedText = await file.text();
      } else if (fileName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (isAudio) {
        voiceFeedback.speak('Transcribing spoken audio with AI speech engine...');
        const audioData = await extractMediaAudioData(file);

        const response = await fetch('/api/audio-transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: audioData.base64,
            mimeType: audioData.mimeType,
            fileName: file.name,
          }),
        });

        if (!response.ok) {
          let errMsg = 'Unable to transcribe the audio from this file. Please ensure it contains clear audible speech.';
          try {
            const errData = await response.json();
            if (errData?.error) errMsg = errData.error;
          } catch {
            // Ignore parse error
          }
          throw new Error(errMsg);
        }

        const data = await response.json();
        if (!data.transcript || !data.transcript.trim()) {
          throw new Error('Unable to transcribe the audio from this file. Please ensure it contains clear audible speech.');
        }

        extractedText = data.transcript;
      } else {
        throw new Error('Unsupported file format. Please upload a TXT, DOCX, or audio file (.mp3, .wav, .m4a, .ogg, .webm).');
      }

      if (!extractedText.trim()) {
        throw new Error('The uploaded file contains no readable speech or text.');
      }

      setInputText(extractedText.trim());
      setUploadedFileName(file.name);
      setIsGenerated(false);
      stopAudioPlayback();
      triggerHaptic('success');
      voiceFeedback.speak(`File uploaded successfully: ${file.name}. ${extractedText.split(/\s+/).length} words extracted. Tap Generate Audio to create spoken lesson.`);
    } catch (err: any) {
      console.error('File parsing error:', err);
      const errorMessage = err?.message || 'Failed to process the uploaded file. Please ensure it is a valid document or clear audio recording.';
      setFileError(errorMessage);
      triggerHaptic('error');
      voiceFeedback.speak(`File upload error: ${errorMessage}`);
    } finally {
      setIsFileReading(false);
      // Reset input value to allow re-uploading same file if desired
      e.target.value = '';
    }
  };

  // ----------------------------------------------------
  // GENERATE AUDIO ACTION
  // ----------------------------------------------------
  const handleGenerateAudio = () => {
    if (!inputText.trim()) {
      setFileError('Please enter some text or upload a file first.');
      voiceFeedback.speak('Please enter text or upload a file.');
      return;
    }

    setFileError(null);
    setIsGenerated(true);
    stopAudioPlayback();
    triggerHaptic('success');
    voiceFeedback.speak('Spoken audio generated successfully. Audio player is ready.');
  };

  return (
    <div
      id="audio-learning-workspace"
      className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-2 sm:p-6 text-[#0C4A6E] animate-fadeIn"
    >
      {/* ---------------------------------------------------- */}
      {/* HEADER SECTION                                       */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#BAE6FD]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0369A1] text-white flex items-center justify-center shadow-md">
            <Headphones className="w-6 h-6 text-[#BAE6FD]" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C4A6E] tracking-tight">
              Audio Learning
            </h2>
            <p className="text-sm font-semibold text-[#0369A1]">
              Convert English text and documents into natural spoken audio
            </p>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              voiceFeedback.speak('Returning to overview');
              onBack();
            }}
            className="px-4 py-2 bg-white hover:bg-[#E0F2FE] text-[#0369A1] font-bold rounded-xl border-2 border-[#0369A1] shadow-xs flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
          >
            <span>Overview</span>
          </button>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. TEXT INPUT & FILE UPLOAD CARD                     */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white border-3 border-[#0369A1] rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0369A1]" />
            <h3 className="text-lg font-bold text-[#0C4A6E]">
              Source Text or Document
            </h3>
          </div>

          {/* File Upload Button (TXT, DOCX, & Audio) */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="audio-file-upload-input"
              className="px-4 py-2 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] font-bold rounded-xl border-2 border-[#0369A1] shadow-xs flex items-center gap-2 cursor-pointer transition-colors focus-within:ring-4 focus-within:ring-[#BAE6FD]"
              title="Upload TXT, DOCX, or Audio file (.mp3, .wav, .m4a, .ogg, .webm)"
            >
              {isFileReading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0369A1]" />
              ) : (
                <Upload className="w-4 h-4 text-[#0369A1]" />
              )}
              <span className="text-sm">Upload File / Audio</span>
              <input
                id="audio-file-upload-input"
                type="file"
                accept=".txt,.docx,.mp3,.wav,.m4a,.ogg,.webm,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/*"
                onChange={handleFileUpload}
                disabled={isFileReading}
                className="sr-only"
                aria-label="Upload TXT, DOCX, or Audio file"
              />
            </label>

            {uploadedFileName && (
              <span className="text-xs font-bold text-[#0369A1] bg-[#F0F9FF] px-3 py-1.5 rounded-lg border border-[#BAE6FD] flex items-center gap-1.5 truncate max-w-[200px]">
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{uploadedFileName}</span>
              </span>
            )}
          </div>
        </div>

        {/* Error Alert if file reading fails */}
        {fileError && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-sm font-semibold flex items-start gap-2.5 animate-fadeIn"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Error reading document:</p>
              <p>{fileError}</p>
            </div>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="audio-learning-textarea"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setIsGenerated(false);
            }}
            placeholder="Type or paste educational English text here, or upload a TXT / DOCX file..."
            rows={5}
            className="w-full p-4 rounded-2xl border-2 border-[#BAE6FD] focus:border-[#0369A1] focus:ring-4 focus:ring-[#BAE6FD] text-base sm:text-lg font-medium text-[#0C4A6E] bg-[#F0F9FF] placeholder:text-slate-400 focus:outline-none transition-all leading-relaxed"
            aria-label="Educational text to convert into audio"
          />

          <div className="mt-1 flex items-center justify-between text-xs font-bold text-[#0369A1] px-1">
            <span>{totalWords} words • {segments.length} sentences</span>
            <span>Est. Duration: ~{formatTime(totalDurationSeconds)}</span>
          </div>
        </div>

        {/* Generate Audio Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500 font-medium">
            Natural English text-to-speech with accessible speed controls and double-tap gestures.
          </p>

          <button
            type="button"
            id="generate-audio-btn"
            onClick={handleGenerateAudio}
            disabled={!inputText.trim()}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0369A1] hover:bg-[#0284C7] disabled:opacity-50 text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer border-b-4 border-[#083344] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
          >
            <Sparkles className="w-5 h-5 text-[#BAE6FD]" />
            <span>Generate Audio</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. AUDIO PLAYER CARD (WITH DOUBLE TAP SUPPORT)       */}
      {/* ---------------------------------------------------- */}
      {isGenerated && (
        <div
          id="audio-player-card"
          onClick={handleAudioPlayerTap}
          onTouchEnd={handleAudioPlayerTap}
          className="bg-white border-4 border-[#0369A1] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 relative transition-all"
          aria-label="Audio Learning Player. Double tap anywhere on this card to play or pause."
        >
          {/* Top Status & Double-Tap Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#BAE6FD] pb-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isPlaying
                    ? 'bg-emerald-500 animate-pulse'
                    : isPaused
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
                aria-hidden="true"
              />
              <span
                id="audio-playback-status-text"
                aria-live="polite"
                className="text-base sm:text-lg font-black text-[#0C4A6E]"
              >
                {isPlaying
                  ? 'Audio playing'
                  : isPaused
                  ? 'Audio paused'
                  : 'Audio ready to play'}
              </span>
            </div>

            {/* Gesture Helper Badge */}
            <div className="bg-[#E0F2FE] border border-[#0369A1] text-[#0369A1] text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs select-none">
              <span>👆👆 Double Tap card to {isPlaying ? 'Pause' : 'Play'}</span>
            </div>
          </div>

          {/* Active Sentence Display */}
          <div className="bg-[#F0F9FF] border-2 border-[#BAE6FD] rounded-2xl p-5 min-h-[90px] flex flex-col justify-center">
            <span className="text-xs font-bold text-[#0369A1] uppercase tracking-wider mb-1">
              Active Segment ({segments.length > 0 ? currentSegmentIndex + 1 : 0} of {segments.length})
            </span>
            <p className="text-lg sm:text-xl font-bold text-[#0C4A6E] leading-relaxed">
              {segments[currentSegmentIndex]?.text || 'Press play to begin audio lesson.'}
            </p>
          </div>

          {/* Progress Bar & Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-[#0369A1]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0EA5E9]" />
                <span>{formatTime(currentTimeSeconds)}</span>
              </div>
              <span>{formatTime(totalDurationSeconds)}</span>
            </div>

            {/* Accessible Progress Slider */}
            <input
              type="range"
              min={0}
              max={totalDurationSeconds || 1}
              value={currentTimeSeconds}
              onChange={(e) => {
                const targetSec = Number(e.target.value);
                setCurrentTimeSeconds(targetSec);
                if (totalDurationSeconds > 0 && segments.length > 0) {
                  const targetSegmentIdx = Math.min(
                    segments.length - 1,
                    Math.floor((targetSec / totalDurationSeconds) * segments.length)
                  );
                  setCurrentSegmentIndex(targetSegmentIdx);
                  if (isPlaying) {
                    playSegment(targetSegmentIdx);
                  }
                }
              }}
              className="w-full h-3 bg-[#BAE6FD] rounded-lg appearance-none cursor-pointer accent-[#0369A1] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              aria-label="Audio progress scrub bar"
            />
          </div>

          {/* Core Audio Player Controls: [Previous] [Play/Pause] [Restart] [Next] [Stop] */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-2">
            {/* Previous Segment Button */}
            <button
              type="button"
              id="audio-prev-btn"
              onClick={handlePreviousSegment}
              disabled={currentSegmentIndex === 0}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] disabled:opacity-40 text-[#0369A1] border-2 border-[#0369A1] flex items-center justify-center shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              title="Previous sentence"
              aria-label="Previous sentence"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            {/* Play / Pause Main Button */}
            <button
              type="button"
              id="audio-play-pause-btn"
              onClick={() => {
                if (isPlaying) {
                  pauseAudioPlayback();
                } else if (isPaused) {
                  resumeAudioPlayback();
                } else {
                  startAudioPlayback();
                }
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#0369A1] hover:bg-[#0284C7] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-white focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              title={isPlaying ? 'Pause Audio' : 'Play Audio'}
              aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
              ) : (
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
              )}
            </button>

            {/* Restart Button */}
            <button
              type="button"
              id="audio-restart-btn"
              onClick={restartAudioPlayback}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] border-2 border-[#0369A1] flex items-center justify-center shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              title="Restart from beginning"
              aria-label="Restart audio from beginning"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            {/* Next Segment Button */}
            <button
              type="button"
              id="audio-next-btn"
              onClick={handleNextSegment}
              disabled={currentSegmentIndex >= segments.length - 1}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] disabled:opacity-40 text-[#0369A1] border-2 border-[#0369A1] flex items-center justify-center shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              title="Next sentence"
              aria-label="Next sentence"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            {/* Stop Button */}
            <button
              type="button"
              id="audio-stop-btn"
              onClick={stopAudioPlayback}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 flex items-center justify-center shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              title="Stop audio"
              aria-label="Stop audio"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Speed & Audio Adjustments Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[#BAE6FD]/60">
            {/* Playback Speed Buttons with Large Touch Targets */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 text-xs font-extrabold text-[#0369A1] mr-1">
                <Gauge className="w-4 h-4" />
                <span>Speed:</span>
              </div>

              {[0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleChangeSpeed(speed)}
                  className={`min-w-[44px] min-h-[44px] px-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BAE6FD] ${
                    playbackSpeed === speed
                      ? 'bg-[#0369A1] text-white shadow-sm scale-105'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border border-[#BAE6FD] hover:bg-[#E0F2FE]'
                  }`}
                  aria-pressed={playbackSpeed === speed}
                  aria-label={`Playback speed ${speed}x`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Mute Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                voiceFeedback.speak(nextMute ? 'Muted' : 'Unmuted');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-bold text-xs flex items-center gap-2 cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Muted' : 'Volume ON'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
