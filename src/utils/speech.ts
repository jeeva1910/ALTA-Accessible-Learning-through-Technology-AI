import { triggerHaptic } from './haptics';

/**
 * Web Speech API text-to-speech manager for ALTA
 * Provides rapid, clear, and accessible spoken feedback with controls for play, pause, stop, and replay.
 */

type SpeechStateListener = (isSpeaking: boolean, activeText: string) => void;

class VoiceFeedbackService {
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;
  private currentListener: ((text: string) => void) | null = null;
  private stateListeners: Set<SpeechStateListener> = new Set();
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private _isSpeaking: boolean = false;

  public onSpeech(listener: (text: string) => void) {
    this.currentListener = listener;
  }

  public subscribe(listener: SpeechStateListener) {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private notifyState(speaking: boolean, text: string = '') {
    this._isSpeaking = speaking;
    this.stateListeners.forEach((fn) => {
      try {
        fn(speaking, text);
      } catch (e) {
        console.warn('Speech listener error:', e);
      }
    });
  }

  public isSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking && !window.speechSynthesis.paused;
    }
    return this._isSpeaking;
  }

  public isPaused(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.paused;
    }
    return false;
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
        this.notifyState(false, this.lastSpokenText);
      } catch (err) {
        console.warn('Pause speech error:', err);
      }
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        this.notifyState(true, this.lastSpokenText);
      } catch (err) {
        console.warn('Resume speech error:', err);
      }
    }
  }

  public cancel() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('Cancel speech error:', err);
      }
    }
    this.currentUtterance = null;
    this.notifyState(false, '');
  }

  public stop() {
    this.cancel();
  }

  /**
   * Cleans raw markdown/formatting so TTS sounds natural
   */
  private cleanTextForSpeech(raw: string): string {
    return raw
      .replace(/[*#_`~>]/g, '') // remove markdown marks
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove markdown links
      .replace(/https?:\/\/\S+/g, '') // remove raw URLs
      .replace(/\n+/g, '. ') // turn newlines into brief pauses
      .trim();
  }

  public speak(text: string, force: boolean = false) {
    if (!text || typeof text !== 'string') return;

    const cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) return;

    const now = Date.now();
    // Prevent double firing of exact identical text within 250ms unless forced
    if (!force && this.lastSpokenText === cleanedText && now - this.lastSpokenTime < 250) {
      return;
    }

    this.lastSpokenText = cleanedText;
    this.lastSpokenTime = now;

    // Trigger subtle tactile pulse
    triggerHaptic('light');

    if (this.currentListener) {
      const listener = this.currentListener;
      setTimeout(() => {
        listener(cleanedText);
      }, 0);
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Fix for Chromium speech queue deadlock: resume before cancelling
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice =
            voices.find(
              (v) =>
                (v.lang.includes('en') || v.lang.includes('US')) &&
                (v.name.includes('Natural') ||
                  v.name.includes('Google') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Karen') ||
                  v.name.includes('Alex'))
            ) || voices.find((v) => v.lang.startsWith('en'));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onstart = () => {
          this.notifyState(true, cleanedText);
        };

        utterance.onend = () => {
          this.notifyState(false, '');
          this.currentUtterance = null;
        };

        utterance.onerror = (e) => {
          console.info('Speech utterance notice/end:', e.error);
          this.notifyState(false, '');
          this.currentUtterance = null;
        };

        this.currentUtterance = utterance;
        this.notifyState(true, cleanedText);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        this.notifyState(false, '');
      }
    }
  }
}

export const voiceFeedback = new VoiceFeedbackService();

