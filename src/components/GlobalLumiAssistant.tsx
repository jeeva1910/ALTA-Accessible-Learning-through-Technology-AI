import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Square,
  RotateCcw,
  X,
  Send,
  Loader2,
  Radio,
  Layers,
  Trash2,
  Minus,
  MessageSquare
} from 'lucide-react';
import { useLumi } from '../context/LumiContext';
import { voiceFeedback } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';

export const GlobalLumiAssistant: React.FC = () => {
  const {
    isOpen,
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
  } = useLumi();

  const [inputText, setInputText] = useState('');
  const [isSpeakingResponse, setIsSpeakingResponse] = useState(false);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Subscribe to speech synthesis state updates
  useEffect(() => {
    const unsubscribe = voiceFeedback.subscribe((speaking, text) => {
      setIsSpeakingResponse(speaking);
      setCurrentlySpeakingText(speaking ? text : '');
    });
    return unsubscribe;
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Handle Escape key to close floating panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        triggerHaptic('light');
        voiceFeedback.speak('Lumi minimized.');
        closeLumi();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLumi]);

  const handleStopSpeaking = () => {
    triggerHaptic('light');
    voiceFeedback.stop();
    setIsSpeakingResponse(false);
  };

  const handlePlayMessage = (text: string) => {
    triggerHaptic('light');
    if (isSpeakingResponse && currentlySpeakingText === text) {
      voiceFeedback.stop();
    } else {
      voiceFeedback.speak(text, true);
    }
  };

  const handleReplayLastResponse = () => {
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
    if (lastAssistantMsg) {
      triggerHaptic('medium');
      voiceFeedback.speak(lastAssistantMsg.content, true);
    } else {
      voiceFeedback.speak('No previous response to replay.', true);
    }
  };

  const handleToggleCommandMic = () => {
    if (isListening) {
      stopVoiceQuery();
      triggerHaptic('light');
      voiceFeedback.speak('Microphone stopped.');
    } else {
      triggerHaptic('success');
      startVoiceQuery();
      voiceFeedback.speak('Listening. Ask your question now.');
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    sendQuery(text);
  };

  // Feature-aware suggested prompts
  const getContextualPrompts = () => {
    if (appContext.suggestedPrompts && appContext.suggestedPrompts.length > 0) {
      return appContext.suggestedPrompts;
    }

    switch (appContext.featureId) {
      case 'braille_notes':
        return [
          'Explain this note in simple step-by-step terms.',
          'Summarize this note into 3 key takeaways.',
          'Quiz me with 2 questions based on this note.',
          'Suggest improvements for my note.'
        ];
      case 'audio_learning':
        return [
          'Explain the main idea of this audio lesson.',
          'Define difficult vocabulary from this text.',
          'Summarize key takeaways from this reading.'
        ];
      case 'isl_translator':
        return [
          'Explain the ISL grammar structure of this sentence.',
          'Why does ISL place time and question words differently?',
          'Quiz me on the signs in this sentence.'
        ];
      case 'video_transcription':
        return [
          'Summarize the core points of this lecture.',
          'Explain technical terms in this transcript.',
          'Generate 2 quiz questions from this video.'
        ];
      default:
        return [
          'Explain the key concepts of this topic in simple terms.',
          'Summarize what I should remember into 3 key bullet points.',
          'Give me 2 practice quiz questions to test my understanding.'
        ];
    }
  };

  const dynamicPrompts = getContextualPrompts();

  return (
    <>
      {/* ---------------------------------------------------- */}
      {/* 1. FLOATING LUMI ASSISTANT CHAT PANEL (BOTTOM-RIGHT) */}
      {/* ---------------------------------------------------- */}
      {isOpen && (
        <div
          ref={panelRef}
          id="floating-lumi-panel"
          role="dialog"
          aria-label="Lumi AI assistant"
          aria-modal="false"
          className="fixed bottom-[84px] sm:bottom-[88px] right-3 sm:right-5 z-50 w-[calc(100vw-24px)] sm:w-[410px] md:w-[430px] max-w-[440px] h-[550px] max-h-[calc(100vh-100px)] bg-white rounded-3xl border-2 border-[#0369A1] shadow-2xl flex flex-col justify-between text-[#0C4A6E] overflow-hidden transition-all duration-200"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b-2 border-[#BAE6FD] bg-[#F0F9FF] flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#0369A1] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-[#BAE6FD]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-[#0C4A6E] flex items-center gap-1.5 leading-tight">
                    <span>Lumi AI</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0369A1] text-white">
                      Tutor
                    </span>
                  </h3>
                  <p className="text-[11px] font-semibold text-[#0369A1]">
                    {appContext.featureName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Clear conversation */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    clearConversation();
                  }}
                  className="w-8 h-8 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#BAE6FD]"
                  title="Clear Conversation"
                  aria-label="Clear Conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Minimize / Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    voiceFeedback.speak('Lumi closed.');
                    closeLumi();
                  }}
                  className="w-8 h-8 rounded-xl text-[#0369A1] hover:bg-[#E0F2FE] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#BAE6FD]"
                  title="Close Lumi AI assistant"
                  aria-label="Close Lumi AI assistant"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Context & Mode Pill */}
            <div className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-xl bg-white border border-[#BAE6FD] text-[11px] shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#0369A1] font-bold truncate">
                <Layers className="w-3 h-3 text-[#0284C7] shrink-0" />
                <span className="truncate">{appContext.pageTitle || appContext.featureName}</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E0F2FE] text-[#0369A1] shrink-0">
                {appContext.mode === 'hearing_accessibility' ? 'Hearing' : 'Visual'}
              </span>
            </div>
          </div>

          {/* Status & Wake Word Bar */}
          <div className="px-3.5 py-1.5 bg-white border-b border-[#BAE6FD] flex items-center justify-between text-xs font-bold text-[#0369A1] shrink-0">
            <div className="flex items-center gap-1.5">
              <Radio
                className={`w-3.5 h-3.5 ${
                  isListening
                    ? 'text-rose-600 animate-spin'
                    : isWakeWordActive
                    ? 'text-emerald-600 animate-pulse'
                    : 'text-slate-400'
                }`}
              />
              <span className="text-[11px]">
                {isListening
                  ? 'Listening...'
                  : isWakeWordActive
                  ? '"Hey Lumi" Active'
                  : 'Wake Off'}
              </span>
            </div>

            {/* Wake Word Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                const next = !isWakeWordActive;
                setIsWakeWordActive(next);
                voiceFeedback.speak(
                  next ? '"Hey Lumi" wake phrase enabled.' : '"Hey Lumi" wake phrase disabled.'
                );
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                isWakeWordActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
              title="Toggle wake phrase 'Hey Lumi'"
            >
              {isWakeWordActive ? 'Wake ON' : 'Wake OFF'}
            </button>
          </div>

          {/* Live Transcript Banner */}
          {isListening && (
            <div className="mx-3 my-1.5 p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2 animate-pulse shrink-0">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span className="truncate">{liveTranscript || 'Listening to your question...'}</span>
            </div>
          )}

          {/* Conversation Stream */}
          <div
            id="lumi-messages-container"
            className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs sm:text-sm select-text"
            role="log"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <div className="text-center py-8 px-4 text-slate-500 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-[#0C4A6E]">
                  Ask Lumi anything about this page or lesson.
                </p>
                <p className="text-[11px] text-slate-500">
                  Type below or tap Speak to use your voice.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-[#0369A1] text-white rounded-br-none font-medium'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border border-[#BAE6FD] rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 text-[9px] font-extrabold uppercase opacity-75">
                    <span>{msg.role === 'assistant' ? 'Lumi' : 'You'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-line font-medium leading-relaxed">{msg.content}</p>

                  {msg.role === 'assistant' && (
                    <div className="mt-2 pt-1.5 border-t border-[#BAE6FD]/60 flex items-center gap-2 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => handlePlayMessage(msg.content)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                          isSpeakingResponse && currentlySpeakingText === msg.content.replace(/[*#_`~>]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/https?:\/\/\S+/g, '').replace(/\n+/g, '. ').trim()
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white hover:bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                        }`}
                        title={
                          isSpeakingResponse && currentlySpeakingText === msg.content.replace(/[*#_`~>]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/https?:\/\/\S+/g, '').replace(/\n+/g, '. ').trim()
                            ? 'Stop spoken audio'
                            : 'Read this answer aloud'
                        }
                        aria-label="Read this answer aloud"
                      >
                        {isSpeakingResponse && currentlySpeakingText === msg.content.replace(/[*#_`~>]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/https?:\/\/\S+/g, '').replace(/\n+/g, '. ').trim() ? (
                          <>
                            <Square className="w-2.5 h-2.5 fill-current text-rose-700" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-[#0369A1]" />
                            <span>Speak Text</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] font-bold text-xs w-fit animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0369A1]" />
                <span>Lumi is formulating your explanation...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 bg-[#F0F9FF] border-t border-[#BAE6FD] flex flex-wrap gap-1 max-h-20 overflow-y-auto shrink-0">
            {dynamicPrompts.slice(0, 3).map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendQuery(promptText)}
                className="px-2 py-0.5 bg-white hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-2xs transition-colors truncate max-w-full"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#0EA5E9] shrink-0" />
                <span className="truncate">{promptText}</span>
              </button>
            ))}
          </div>

          {/* Audio & Action Controls */}
          <div className="p-2.5 bg-white border-t border-[#BAE6FD] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReplayLastResponse}
                className="px-2.5 py-1.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BAE6FD]"
                title="Replay latest spoken answer"
                aria-label="Replay latest spoken answer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay</span>
              </button>

              <button
                type="button"
                onClick={handleStopSpeaking}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BAE6FD]"
                title="Stop text-to-speech audio"
                aria-label="Stop text-to-speech audio"
              >
                <Square className="w-3 h-3 fill-current text-slate-600" />
                <span>Stop</span>
              </button>
            </div>

            {/* Toggle Mic Button */}
            <button
              type="button"
              onClick={handleToggleCommandMic}
              className={`h-8 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BAE6FD] ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#0369A1] hover:bg-[#0284C7] text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak to Lumi'}
              aria-label={isListening ? 'Stop Listening' : 'Speak to Lumi'}
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
              <span>{isListening ? 'Listening' : 'Speak'}</span>
            </button>
          </div>

          {/* Text Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-[#F0F9FF] border-t border-[#BAE6FD] flex items-center gap-1.5 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Lumi anything..."
              className="flex-1 h-9 px-3 text-xs font-medium border border-[#BAE6FD] focus:border-[#0369A1] rounded-xl bg-white text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#BAE6FD] placeholder:text-slate-400"
              aria-label="Ask Lumi a question"
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="h-9 w-9 bg-[#0369A1] hover:bg-[#0284C7] disabled:opacity-40 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BAE6FD]"
              aria-label="Send question to Lumi"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. FLOATING TRIGGER BUTTON (FIXED BOTTOM-RIGHT)      */}
      {/* ---------------------------------------------------- */}
      <button
        id="floating-lumi-trigger-btn"
        type="button"
        onClick={() => {
          triggerHaptic('selection');
          toggleLumi();
          voiceFeedback.speak(isOpen ? 'Lumi closed.' : 'Lumi opened.');
        }}
        aria-label={isOpen ? 'Close Lumi AI assistant' : 'Open Lumi AI assistant'}
        aria-expanded={isOpen}
        aria-controls="floating-lumi-panel"
        className={`fixed bottom-5 right-5 z-50 h-12 sm:h-13 px-4 sm:px-5 rounded-full font-black text-sm sm:text-base flex items-center gap-2.5 shadow-2xl border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] active:scale-95 ${
          isOpen
            ? 'bg-[#0C4A6E] text-white border-[#38BDF8] shadow-[#0C4A6E]/30 scale-105'
            : 'bg-[#0369A1] hover:bg-[#0284C7] text-white border-[#7DD3FC]'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#BAE6FD] animate-pulse" aria-hidden="true" />
          {isListening && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          )}
        </div>
        <span className="font-extrabold tracking-wide">✨ Lumi</span>
        {isWakeWordActive && (
          <span className="hidden sm:inline-block text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#0C4A6E] text-[#BAE6FD]">
            Voice
          </span>
        )}
      </button>
    </>
  );
};

