/**
 * Audio Extraction & Media Processing Utility for ALTA
 * Extracts clean 16kHz mono PCM WAV from video and audio files in-browser,
 * optimizing bandwidth and ensuring high-accuracy transcription by Gemini.
 */

export interface ExtractedAudioResult {
  base64: string;
  mimeType: string;
  duration?: number;
  extractedFromTrack: boolean;
}

/**
 * Reads a File or Blob directly as base64 string
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64 || '');
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Encodes an AudioBuffer into 16-bit PCM Mono WAV Blob at a target sample rate (default 16000Hz)
 */
export function audioBufferToWavBlob(audioBuffer: AudioBuffer, targetSampleRate = 16000): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const originalSampleRate = audioBuffer.sampleRate;
  const originalLength = audioBuffer.length;

  // Downmix to single mono channel
  const monoSamples = new Float32Array(originalLength);
  for (let c = 0; c < numChannels; c++) {
    const channelData = audioBuffer.getChannelData(c);
    for (let i = 0; i < originalLength; i++) {
      monoSamples[i] += channelData[i] / numChannels;
    }
  }

  // Resample if necessary
  let finalSamples: Float32Array;
  let finalSampleRate = originalSampleRate;

  if (originalSampleRate !== targetSampleRate) {
    const ratio = originalSampleRate / targetSampleRate;
    const newLength = Math.round(originalLength / ratio);
    finalSamples = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const origIdx = Math.min(originalLength - 1, Math.floor(i * ratio));
      finalSamples[i] = monoSamples[origIdx];
    }
    finalSampleRate = targetSampleRate;
  } else {
    finalSamples = monoSamples;
  }

  // WAV header + 16-bit PCM samples
  const bytesPerSample = 2; // 16-bit
  const dataByteLength = finalSamples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(buffer);

  // Write ASCII string helper
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataByteLength, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = mono)
  view.setUint32(24, finalSampleRate, true); // SampleRate
  view.setUint32(28, finalSampleRate * bytesPerSample, true); // ByteRate
  view.setUint16(32, bytesPerSample, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataByteLength, true);

  // Write 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < finalSamples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, finalSamples[i]));
    const int16 = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, int16, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Extracts audio track from video/audio file or prepares real media base64
 * 1. Attempts Web Audio API decodeAudioData to extract clean 16kHz mono WAV (fast & compact)
 * 2. If browser audio decoder cannot decode container, falls back to direct raw media base64
 */
export async function extractMediaAudioData(file: File): Promise<ExtractedAudioResult> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

  // If Web Audio API is supported, attempt to extract and compress audio track
  if (AudioContextClass) {
    let audioCtx: AudioContext | null = null;
    try {
      audioCtx = new AudioContextClass();
      const arrayBuffer = await file.arrayBuffer();

      // decodeAudioData decodes audio from mp4, webm, wav, mp3, ogg, etc.
      const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
        audioCtx!.decodeAudioData(
          arrayBuffer.slice(0),
          (decoded) => resolve(decoded),
          (err) => reject(err)
        );
      });

      if (audioBuffer && audioBuffer.length > 0) {
        const wavBlob = audioBufferToWavBlob(audioBuffer, 16000);
        const base64 = await fileToBase64(wavBlob);
        return {
          base64,
          mimeType: 'audio/wav',
          duration: Math.round(audioBuffer.duration),
          extractedFromTrack: true,
        };
      }
    } catch (decodeErr) {
      console.warn('[AudioExtractor] Browser WebAudio decode fallback to raw media stream:', decodeErr);
    } finally {
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    }
  }

  // Fallback: Read raw media file base64 directly
  const rawBase64 = await fileToBase64(file);
  let mimeType = file.type || 'application/octet-stream';
  if (!mimeType || mimeType === 'application/octet-stream') {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'mp3') mimeType = 'audio/mp3';
    else if (ext === 'wav') mimeType = 'audio/wav';
    else if (ext === 'm4a') mimeType = 'audio/m4a';
    else if (ext === 'ogg') mimeType = 'audio/ogg';
    else if (ext === 'webm') mimeType = file.type.startsWith('video/') ? 'video/webm' : 'audio/webm';
    else if (ext === 'mp4') mimeType = 'video/mp4';
    else if (ext === 'mov') mimeType = 'video/quicktime';
  }

  return {
    base64: rawBase64,
    mimeType,
    extractedFromTrack: false,
  };
}
