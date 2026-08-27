import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { LumiAppContext, GlobalChatMessage, LumiContextType } from '../types/lumi';
import { voiceFeedback } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';

const defaultAppContext: LumiAppContext = {
  mode: 'hearing_accessibility',
  featureId: 'overview',
  featureName: 'Accessible Learning Hub',
  pageTitle: 'ALTA Learning Portal',
  screenContent: '',
  suggestedPrompts: [
    'What can Lumi help me with in ALTA?',
    'Explain the current accessibility features available.',
    'How do I use Indian Sign Language translation?'
  ]
};

const LumiContext = createContext<LumiContextType | undefined>(undefined);

export const LumiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GlobalChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        "Hello! I'm Lumi, your unified AI learning assistant. I am connected to your current screen and lessons across ALTA. Ask me anything, or say 'Hey Lumi' anytime!",
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);
  const [appContext, setAppContext] = useState<LumiAppContext>(defaultAppContext);

  const commandRecognitionRef = useRef<any>(null);
  const wakeWordRecognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const appContextRef = useRef(appContext);
  appContextRef.current = appContext;

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const isWakeWordActiveRef = useRef(isWakeWordActive);
  isWakeWordActiveRef.current = isWakeWordActive;

  const updateAppContext = useCallback((updates: Partial<LumiAppContext>) => {
    setAppContext((prev) => ({
      ...prev,
      ...updates,
      metadata: {
        ...(prev.metadata || {}),
        ...(updates.metadata || {})
      }
    }));
  }, []);

  const openLumi = useCallback((contextOverride?: Partial<LumiAppContext>) => {
    if (contextOverride) {
      updateAppContext(contextOverride);
    }
    setIsOpen(true);
    triggerHaptic('light');
  }, [updateAppContext]);

  const closeLumi = useCallback(() => {
    setIsOpen(false);
    triggerHaptic('light');
    if (isListening) {
      stopVoiceQuery();
    }
  }, [isListening]);

  const toggleLumi = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        triggerHaptic('success');
      } else {
        triggerHaptic('light');
      }
      return next;
    });
  }, []);

  const clearConversation = useCallback(() => {
    triggerHaptic('medium');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. I am still here to help with ${appContextRef.current.featureName}. What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    voiceFeedback.speak('Conversation cleared.');
  }, []);

  // Dispatch query to backend /api/tutor
  const sendQuery = useCallback(async (query: string, customContext?: string) => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    triggerHaptic('medium');
    const userMsg: GlobalChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextSnapshot: customContext || appContextRef.current.screenContent
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsLoading(true);
    setLiveTranscript('');

    if (!isOpenRef.current) {
      setIsOpen(true);
    }

    // Build rich context payload
    const activeCtx = appContextRef.current;
    const formattedContext = customContext || [
      `Active Mode: ${activeCtx.mode}`,
      `Current Feature: ${activeCtx.featureName} (${activeCtx.featureId})`,
      activeCtx.pageTitle ? `Page Title: ${activeCtx.pageTitle}` : '',
      activeCtx.activeSelection ? `Selected Item/Sentence: ${activeCtx.activeSelection}` : '',
      activeCtx.screenContent ? `Screen / Document Content:\n${activeCtx.screenContent}` : ''
    ].filter(Boolean).join('\n');

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          noteContext: formattedContext,
          feature: activeCtx.featureId,
          mode: activeCtx.mode
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || "I'm here to help you learn!";
      
      const assistantMsg: GlobalChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      triggerHaptic('success');

      // Send generated Lumi response to existing TTS voice pipeline
      try {
        voiceFeedback.speak(reply);
      } catch (speechErr) {
        console.warn('Lumi TTS voice output notice:', speechErr);
      }
    } catch (err) {
      console.warn('Lumi response fallback:', err);
      const fallbackReply = `Regarding ${activeCtx.featureName}: I heard your question "${trimmed}". Let's break down this concept step-by-step.`;
      
      const fallbackMsg: GlobalChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fallbackMsg]);
      try {
        voiceFeedback.speak(fallbackReply);
      } catch (speechErr) {
        console.warn('Lumi TTS fallback voice notice:', speechErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  // Voice Query Commands
  const startVoiceQuery = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      voiceFeedback.speak('Voice recognition is not supported in this browser.');
      return;
    }

    try {
      if (wakeWordRecognitionRef.current) {
        try { wakeWordRecognitionRef.current.abort(); } catch (e) {}
      }
      if (commandRecognitionRef.current) {
        try { commandRecognitionRef.current.abort(); } catch (e) {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
        triggerHaptic('light');
        if (!isOpenRef.current) setIsOpen(true);
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const text = (final || interim).trim();
        setLiveTranscript(text);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (text.length > 0) {
            rec.stop();
            sendQuery(text);
          }
        }, 1400);
      };

      rec.onerror = (e: any) => {
        console.warn('Voice command error:', e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      commandRecognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Failed to start voice query:', err);
      setIsListening(false);
    }
  }, [sendQuery]);

  const stopVoiceQuery = useCallback(() => {
    if (commandRecognitionRef.current) {
      try {
        commandRecognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setLiveTranscript('');
  }, []);

  // Background "Hey Lumi" Wake Word Detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    let isMounted = true;
    let retryTimeout: any = null;

    const startWakeRecognition = () => {
      if (!isMounted || !isWakeWordActiveRef.current || isListening) return;

      try {
        if (wakeWordRecognitionRef.current) {
          try {
            wakeWordRecognitionRef.current.abort();
          } catch (e) {}
        }

        const wakeRec = new SpeechRecognition();
        wakeRec.continuous = true;
        wakeRec.interimResults = true;
        wakeRec.lang = 'en-US';

        wakeRec.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const raw = event.results[i][0].transcript.toLowerCase();
            // Match any variation of "Hey Lumi", "Hi Lumi", "OK Lumi", "Lumi", "Hello Lumi", etc.
            const wakeMatch = raw.match(
              /(?:^|\b)(?:hey|hi|hello|ok|okay|yo|alright|listen)?\s*(?:lumi|loomi|lumie|loomy|lumy|loomie|lume)\b/i
            );

            if (wakeMatch) {
              const wakeIndex = wakeMatch.index || 0;
              const afterWake = raw.slice(wakeIndex + wakeMatch[0].length).replace(/^[,.!?\s]+/, '').trim();

              triggerHaptic('success');
              setIsOpen(true);

              try {
                wakeRec.abort();
              } catch (e) {}

              if (afterWake.length > 2) {
                // User said "Hey Lumi <question>" in one go
                sendQuery(afterWake);
              } else {
                // User said "Hey Lumi" -> announce and start listening for their question
                voiceFeedback.speak("I'm listening.");
                setTimeout(() => {
                  if (isMounted) {
                    startVoiceQuery();
                  }
                }, 350);
              }
              return;
            }
          }
        };

        wakeRec.onerror = (event: any) => {
          // Ignore benign errors like 'no-speech' or 'aborted'
          if (event.error === 'not-allowed') {
            console.info('Microphone access pending or disabled for wake word.');
          }
        };

        wakeRec.onend = () => {
          if (isMounted && isWakeWordActiveRef.current && !isListening) {
            retryTimeout = setTimeout(() => {
              if (isMounted && isWakeWordActiveRef.current && !isListening) {
                startWakeRecognition();
              }
            }, 300);
          }
        };

        wakeWordRecognitionRef.current = wakeRec;
        wakeRec.start();
      } catch (err) {
        // Retry gracefully if browser throws
        if (isMounted && isWakeWordActiveRef.current && !isListening) {
          retryTimeout = setTimeout(startWakeRecognition, 1000);
        }
      }
    };

    if (isWakeWordActive && !isListening) {
      startWakeRecognition();
    }

    // User gesture fallback in case browser policy blocked mic before first click
    const handleFirstGesture = () => {
      if (isMounted && isWakeWordActiveRef.current && !isListening) {
        startWakeRecognition();
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      if (wakeWordRecognitionRef.current) {
        try {
          wakeWordRecognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [isWakeWordActive, isListening, sendQuery, startVoiceQuery]);

  return (
    <LumiContext.Provider
      value={{
        isOpen,
        openLumi,
        closeLumi,
        toggleLumi,
        messages,
        isLoading,
        isListening,
        liveTranscript,
        isWakeWordActive,
        setIsWakeWordActive,
        sendQuery,
        startVoiceQuery,
        stopVoiceQuery,
        clearConversation,
        appContext,
        setAppContext,
        updateAppContext
      }}
    >
      {children}
    </LumiContext.Provider>
  );
};

export const useLumi = () => {
  const context = useContext(LumiContext);
  if (!context) {
    throw new Error('useLumi must be used within a LumiProvider');
  }
  return context;
};
