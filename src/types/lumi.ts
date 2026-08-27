import type { Dispatch, SetStateAction } from 'react';

export interface LumiAppContext {
  mode: 'visual_accessibility' | 'hearing_accessibility' | 'general';
  featureId: 'braille_notes' | 'audio_learning' | 'isl_translator' | 'video_transcription' | 'overview' | 'general';
  featureName: string;
  pageTitle: string;
  screenContent?: string;
  activeSelection?: string;
  suggestedPrompts?: string[];
  metadata?: Record<string, any>;
}

export interface GlobalChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextSnapshot?: string;
}

export interface LumiContextType {
  isOpen: boolean;
  openLumi: (contextOverride?: Partial<LumiAppContext>) => void;
  closeLumi: () => void;
  toggleLumi: () => void;
  messages: GlobalChatMessage[];
  isLoading: boolean;
  isListening: boolean;
  liveTranscript: string;
  isWakeWordActive: boolean;
  setIsWakeWordActive: (active: boolean) => void;
  sendQuery: (query: string, customContext?: string) => Promise<void>;
  startVoiceQuery: () => void;
  stopVoiceQuery: () => void;
  clearConversation: () => void;
  appContext: LumiAppContext;
  setAppContext: Dispatch<SetStateAction<LumiAppContext>>;
  updateAppContext: (updates: Partial<LumiAppContext>) => void;
}

