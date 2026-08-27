export interface ISLSignToken {
  word: string;
  search_key: string;
  isAvailable?: boolean;
}

export interface ISLTranslationResult {
  english: string;
  isl_gloss: string;
  signs: ISLSignToken[];
  linguisticNotes?: string[];
  provider?: string;
}

export interface ISLDictionaryEntry {
  id: string;
  search_key: string;
  gloss: string;
  category: 'Everyday' | 'Education' | 'Science' | 'Time' | 'Social' | 'Actions' | 'People' | 'Questions';
  videoAvailable: boolean;
  videoUrl?: string;
  handshape?: string;
  movementDescription?: string;
  nonManualMarkers?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
}

export interface EducationalLesson {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  content: string;
}
