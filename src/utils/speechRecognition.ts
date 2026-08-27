/**
 * Speech Recognition utility for ALTA Lumi AI Tutor & Video Transcription
 * Supports browser SpeechRecognition and webkitSpeechRecognition with continuous live captioning
 */

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
}

export type SpeechRecognitionCallback = (result: SpeechRecognitionResultPayload) => void;
export type SpeechCompleteCallback = (finalTranscript: string) => void;
export type SpeechErrorCallback = (error: string, fatal?: boolean) => void;
export type SpeechStateCallback = (isListening: boolean) => void;

export interface ContinuousLiveTranscriptionOptions {
  onInterimText?: (interim: string) => void;
  onFinalSegment: (finalText: string) => void;
  onStateChange?: (isListening: boolean) => void;
  onError?: (errorMessage: string, isFatal: boolean) => void;
  lang?: string;
}

class SpeechRecognitionManager {
  private recognition: any = null;
  private isListening = false;
  private isContinuousMode = false;
  private shouldKeepListening = false;
  private restartTimeout: any = null;
  private lang = 'en-US';

  // Callbacks for one-shot mode (Lumi voice commands)
  private onResultCallback: SpeechRecognitionCallback | null = null;
  private onCompleteCallback: SpeechCompleteCallback | null = null;
  private onErrorCallback: SpeechErrorCallback | null = null;
  private onStateCallback: SpeechStateCallback | null = null;
  private silenceTimer: any = null;
  private latestTranscript = '';
  private silenceDelayMs = 1600;

  // Callbacks for continuous live mode (Live Lecture / Mic Transcription)
  private continuousOptions: ContinuousLiveTranscriptionOptions | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.recognition = null;
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.lang;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.latestTranscript = '';
        if (this.isContinuousMode && this.continuousOptions?.onStateChange) {
          this.continuousOptions.onStateChange(true);
        } else if (this.onStateCallback) {
          this.onStateCallback(true);
        }
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        // CONTINUOUS LIVE TRANSCRIPTION MODE
        if (this.isContinuousMode && this.continuousOptions) {
          if (interimTranscript.trim() && this.continuousOptions.onInterimText) {
            this.continuousOptions.onInterimText(interimTranscript.trim());
          }

          if (finalTranscript.trim()) {
            this.continuousOptions.onFinalSegment(finalTranscript.trim());
            // Clear interim text on finalization
            if (this.continuousOptions.onInterimText) {
              this.continuousOptions.onInterimText('');
            }
          }
          return;
        }

        // ONE-SHOT VOICE QUERY MODE (For Lumi)
        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          this.latestTranscript = currentText;
          if (this.onResultCallback) {
            this.onResultCallback({
              transcript: currentText,
              isFinal: !!finalTranscript,
            });
          }
          this.resetSilenceTimer();
        }
      };

      this.recognition.onerror = (event: any) => {
        const errType = event.error || 'unknown';
        console.warn('[SpeechRecognition] Event error:', errType);

        // Non-fatal errors that shouldn't kill continuous listening
        if (errType === 'no-speech') {
          return;
        }

        // Fatal errors (permission denied, no device)
        const isFatal =
          errType === 'not-allowed' ||
          errType === 'permission-denied' ||
          errType === 'audio-capture' ||
          errType === 'service-not-allowed';

        if (isFatal) {
          this.shouldKeepListening = false;
          this.isListening = false;
        }

        let userMsg = 'Speech recognition encountered an issue.';
        if (errType === 'not-allowed' || errType === 'permission-denied') {
          userMsg = 'Microphone permission was denied. Please allow microphone access in your browser.';
        } else if (errType === 'audio-capture') {
          userMsg = 'No microphone device was detected. Please connect a microphone.';
        } else if (errType === 'network') {
          userMsg = 'Network connectivity issue with speech service.';
        }

        if (this.isContinuousMode && this.continuousOptions?.onError) {
          this.continuousOptions.onError(userMsg, isFatal);
        } else if (this.onErrorCallback) {
          this.onErrorCallback(userMsg, isFatal);
        }

        if (isFatal) {
          this.clearSilenceTimer();
          if (this.onStateCallback) this.onStateCallback(false);
          if (this.continuousOptions?.onStateChange) this.continuousOptions.onStateChange(false);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;

        // In continuous mode, if the engine ended naturally (e.g. sentence boundary in Chrome),
        // automatically restart if the user has not clicked stop!
        if (this.isContinuousMode && this.shouldKeepListening) {
          if (this.restartTimeout) clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (this.shouldKeepListening) {
              try {
                this.recognition.start();
              } catch (restartErr) {
                console.warn('[SpeechRecognition] Auto-restart notice:', restartErr);
              }
            }
          }, 200);
          return;
        }

        if (this.continuousOptions?.onStateChange) {
          this.continuousOptions.onStateChange(false);
        }
        if (this.onStateCallback) {
          this.onStateCallback(false);
        }

        // One-shot mode complete
        if (this.latestTranscript && this.onCompleteCallback && !this.isContinuousMode) {
          const text = this.latestTranscript;
          this.latestTranscript = '';
          this.onCompleteCallback(text);
        }
      };
    } catch (initErr) {
      console.warn('[SpeechRecognition] Initialization failed:', initErr);
      this.recognition = null;
    }
  }

  private clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private resetSilenceTimer() {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      if (this.latestTranscript.trim().length > 0 && this.isListening) {
        const finishedText = this.latestTranscript.trim();
        this.stop();
        if (this.onCompleteCallback) {
          this.onCompleteCallback(finishedText);
        }
      }
    }, this.silenceDelayMs);
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Request microphone permission explicitly via mediaDevices
   */
  public async requestMicrophonePermission(): Promise<{ granted: boolean; error?: string }> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return { granted: true }; // Fallback to direct recognition.start()
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release stream immediately; SpeechRecognition manages its own capture
      stream.getTracks().forEach((track) => track.stop());
      return { granted: true };
    } catch (err: any) {
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      const msg = isDenied
        ? 'Microphone permission was denied in your browser settings. Please enable microphone access.'
        : 'Could not access microphone: ' + (err.message || 'Device unavailable');
      return { granted: false, error: msg };
    }
  }

  /**
   * Start Continuous Live Transcription (For Lectures, Meetings, Live Captions)
   * Stays active continuously until stop() is called.
   */
  public startContinuous(options: ContinuousLiveTranscriptionOptions): boolean {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        if (options.onError) {
          options.onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.', true);
        }
        return false;
      }
    }

    this.isContinuousMode = true;
    this.shouldKeepListening = true;
    this.continuousOptions = options;
    this.clearSilenceTimer();

    try {
      if (this.isListening) {
        try { this.recognition.abort(); } catch (e) {}
      }
      this.recognition.lang = options.lang || 'en-US';
      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('[SpeechRecognition] Failed to start continuous listening:', err);
      if (options.onError) {
        options.onError('Could not start microphone listening: ' + (err.message || 'Unknown error'), false);
      }
      return false;
    }
  }

  /**
   * Start One-Shot Voice Query (For Lumi Assistant)
   */
  public start(
    onResult: SpeechRecognitionCallback,
    onComplete?: SpeechCompleteCallback,
    onStateChange?: SpeechStateCallback,
    onError?: SpeechErrorCallback,
    silenceMs = 1600
  ): boolean {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        if (onError) onError('Speech recognition is not supported in this browser.', true);
        return false;
      }
    }

    this.isContinuousMode = false;
    this.shouldKeepListening = false;
    this.silenceDelayMs = silenceMs;
    this.latestTranscript = '';
    this.clearSilenceTimer();
    this.onResultCallback = onResult;
    this.onCompleteCallback = onComplete || null;
    this.onStateCallback = onStateChange || null;
    this.onErrorCallback = onError || null;

    try {
      if (this.isListening) {
        try { this.recognition.abort(); } catch (e) {}
      }
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      if (onError) onError('Microphone access could not be started.');
      return false;
    }
  }

  /**
   * Stop any active speech recognition cleanly
   */
  public stop(): void {
    this.shouldKeepListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    this.clearSilenceTimer();

    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
    this.isListening = false;
    this.isContinuousMode = false;
    if (this.onStateCallback) this.onStateCallback(false);
    if (this.continuousOptions?.onStateChange) this.continuousOptions.onStateChange(false);
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognizer = new SpeechRecognitionManager();
