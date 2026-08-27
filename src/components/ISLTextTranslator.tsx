import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCode,
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2,
  Sliders,
  Layers,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Bot
} from 'lucide-react';
import { extractTextFromFile, splitIntoSentences, SAMPLE_LESSONS } from '../utils/documentParser';
import { lookupISLSign } from '../data/islDictionary';
import { ISLTranslationResult, ISLSignToken, ISLDictionaryEntry } from '../types/isl';
import { ISLSignVideoCard } from './ISLSignVideoCard';
import { ISLSignVisualPlayer } from './ISLSignVisualPlayer';
import { useLumi } from '../context/LumiContext';

export const ISLTextTranslator: React.FC = () => {
  // Global Lumi context integration
  const { openLumi, updateAppContext, isOpen: isLumiOpen } = useLumi();
  // Document and text states
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [sentences, setSentences] = useState<string[]>([]);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number>(0);
  const [manualInputText, setManualInputText] = useState<string>('');
  const [manualInputError, setManualInputError] = useState<string | null>(null);

  // Translation cache & state
  const [translations, setTranslations] = useState<Record<number, ISLTranslationResult>>({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Sign Sequencer & Player state
  const [activeSignIndex, setActiveSignIndex] = useState<number>(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [heroView, setHeroView] = useState<boolean>(false);
  const [copiedGloss, setCopiedGloss] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load default sample lesson on initial mount
  useEffect(() => {
    loadSampleLesson(SAMPLE_LESSONS[0]);
  }, []);

  // When sentences change, automatically fetch/generate translations
  useEffect(() => {
    if (sentences.length > 0) {
      translateAllSentences(sentences);
    }
  }, [sentences]);

  // Handle sequence auto-play through matching signs in the current sentence
  const currentTranslation = translations[selectedSentenceIndex];
  const currentSigns: ISLSignToken[] = currentTranslation?.signs || [];

  useEffect(() => {
    if (isPlayingSequence && currentSigns.length > 0) {
      const stepDuration = Math.max(1200, Math.floor(2200 / playbackSpeed));

      sequenceTimerRef.current = setTimeout(() => {
        setActiveSignIndex((prev) => {
          if (prev >= currentSigns.length - 1) {
            setIsPlayingSequence(false); // Finished sequence
            return prev;
          }
          return prev + 1;
        });
      }, stepDuration);
    } else {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    }

    return () => {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    };
  }, [isPlayingSequence, activeSignIndex, currentSigns.length, playbackSpeed]);

  // Reset active sign when switching sentence
  useEffect(() => {
    setActiveSignIndex(0);
    setIsPlayingSequence(false);
  }, [selectedSentenceIndex]);

  // Sync active ISL sentence and gloss to global Lumi context
  useEffect(() => {
    if (currentTranslation) {
      const activeToken = currentSigns[activeSignIndex];
      updateAppContext({
        mode: 'hearing_accessibility',
        featureId: 'isl_translator',
        featureName: 'ISL Text Translator',
        pageTitle: fileName ? `Lesson: ${fileName}` : 'ISL Translation Studio',
        screenContent: `Original Sentence: "${currentTranslation.english}"\nISL Gloss: "${currentTranslation.isl_gloss}"\nActive Sign: ${activeToken?.word || 'None'}\nAll Signs: ${currentSigns.map((s) => s.word).join(', ')}`,
        activeSelection: currentTranslation.english,
        suggestedPrompts: [
          `Explain why "${currentTranslation.english}" translates to "${currentTranslation.isl_gloss}" in ISL grammar.`,
          `What are the non-manual markers and facial cues needed for "${activeToken?.word || 'this sentence'}"?`,
          'Quiz me on the signs in this sentence.',
          'Provide an everyday conversational scenario using these signs.'
        ]
      });
    }
  }, [currentTranslation, activeSignIndex, currentSigns, fileName, updateAppContext]);

  // Translate all sentences via API (Gemini backend with rule-based fallback)
  const translateAllSentences = async (sentenceList: string[]) => {
    if (!sentenceList || sentenceList.length === 0) return;

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const response = await fetch('/api/isl-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentences: sentenceList })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const results: ISLTranslationResult[] = data.results || [];

      const newTranslations: Record<number, ISLTranslationResult> = {};
      results.forEach((res, idx) => {
        newTranslations[idx] = res;
      });

      setTranslations(newTranslations);
    } catch (err: any) {
      console.warn('API error during batch translation, executing client linguistic fallback:', err);
      // Client-side rule based fallback if network fails
      const fallbackTranslations: Record<number, ISLTranslationResult> = {};
      sentenceList.forEach((s, idx) => {
        fallbackTranslations[idx] = buildClientFallbackGloss(s);
      });
      setTranslations(fallbackTranslations);
    } finally {
      setIsTranslating(false);
    }
  };

  // Helper client fallback
  const buildClientFallbackGloss = (text: string): ISLTranslationResult => {
    const rawTokens = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const stopWords = new Set(['the', 'a', 'an', 'is', 'am', 'are', 'was', 'were', 'been', 'will', 'shall', 'to', 'of']);
    const glossWords = rawTokens.filter((w) => !stopWords.has(w.toLowerCase()));
    const islGloss = glossWords.map((w) => w.toUpperCase()).join(' ') || text.toUpperCase();
    
    return {
      english: text,
      isl_gloss: islGloss,
      signs: glossWords.map((w) => ({
        word: w.toUpperCase(),
        search_key: w.toLowerCase()
      })),
      provider: 'client-linguistic-engine'
    };
  };

  // File upload handler (.txt, .docx)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsTranslating(true);
      const text = await extractTextFromFile(file);
      setFileName(file.name);
      setRawText(text);

      const split = splitIntoSentences(text);
      setSentences(split);
      setSelectedSentenceIndex(0);
      setActiveSignIndex(0);
    } catch (err: any) {
      setTranslationError(err.message || 'Failed to read document.');
    } finally {
      setIsTranslating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const loadSampleLesson = (lesson: typeof SAMPLE_LESSONS[0]) => {
    setFileName(`${lesson.title}.txt`);
    setRawText(lesson.content);
    const split = splitIntoSentences(lesson.content);
    setSentences(split);
    setSelectedSentenceIndex(0);
    setActiveSignIndex(0);
  };

  const handleReset = () => {
    setRawText('');
    setFileName('');
    setSentences([]);
    setTranslations({});
    setSelectedSentenceIndex(0);
    setActiveSignIndex(0);
    setIsPlayingSequence(false);
    setManualInputText('');
    setManualInputError(null);
  };

  const handleTriggerUpload = (acceptType?: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType || '.txt,.docx';
      fileInputRef.current.click();
    }
  };

  const handleManualTranslate = () => {
    const trimmed = manualInputText.trim();
    if (!trimmed) {
      setManualInputError('Please enter some English text.');
      return;
    }

    setManualInputError(null);
    setFileName('Manual Text');
    setRawText(trimmed);

    const split = splitIntoSentences(trimmed);
    setSentences(split);
    setSelectedSentenceIndex(0);
    setActiveSignIndex(0);
  };

  // Sequence Controls
  const handlePlaySequence = () => {
    if (activeSignIndex >= currentSigns.length - 1) {
      setActiveSignIndex(0); // Restart from beginning if reached end
    }
    setIsPlayingSequence(true);
  };

  const handlePauseSequence = () => {
    setIsPlayingSequence(false);
  };

  const handlePreviousSign = () => {
    setIsPlayingSequence(false);
    setActiveSignIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSign = () => {
    setIsPlayingSequence(false);
    setActiveSignIndex((prev) => Math.min(currentSigns.length - 1, prev + 1));
  };

  const handleRestartSequence = () => {
    setActiveSignIndex(0);
    setIsPlayingSequence(true);
  };

  const handleCopyGloss = () => {
    if (currentTranslation?.isl_gloss) {
      navigator.clipboard.writeText(currentTranslation.isl_gloss);
      setCopiedGloss(true);
      setTimeout(() => setCopiedGloss(false), 2000);
    }
  };

  const activeSignToken = currentSigns[activeSignIndex];
  const activeSignEntry: ISLDictionaryEntry | null = activeSignToken
    ? lookupISLSign(activeSignToken.search_key)
    : null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 text-[#0C4A6E]">
      {/* Main 3-Column Accessible Educational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Upload Lesson (Col 1-4) */}
        <section
          aria-labelledby="upload-lesson-heading"
          className="lg:col-span-4 bg-white rounded-3xl border-2 border-[#BAE6FD] p-5 sm:p-6 shadow-sm flex flex-col gap-4"
        >
          <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#0284C7]" />
              <h2 id="upload-lesson-heading" className="text-lg font-bold text-[#0C4A6E]">
                Upload Lesson
              </h2>
            </div>
            {rawText && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-[#0369A1] hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* Upload Drop Zone & Explicit Buttons */}
          <div className="flex flex-col gap-3">
            <div
              onClick={() => handleTriggerUpload('.txt,.docx')}
              className="border-2 border-dashed border-[#38BDF8] hover:border-[#0284C7] bg-[#F0F9FF] hover:bg-[#E0F2FE]/60 rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-11 h-11 rounded-full bg-white border border-[#BAE6FD] text-[#0284C7] group-hover:scale-110 flex items-center justify-center shadow-sm transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#0369A1]">
                Drop documents or select below
              </p>
            </div>

            {/* Upload TXT and Upload DOCX Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleTriggerUpload('.txt')}
                className="px-3 py-2.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0284C7] text-xs sm:text-sm font-bold text-[#0C4A6E] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-[#0284C7]" />
                Upload TXT
              </button>
              <button
                type="button"
                onClick={() => handleTriggerUpload('.docx')}
                className="px-3 py-2.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0284C7] text-xs sm:text-sm font-bold text-[#0C4A6E] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <FileCode className="w-4 h-4 text-[#0284C7]" />
                Upload DOCX
              </button>
            </div>
          </div>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-1" aria-hidden="true">
            <div className="border-t-2 border-[#BAE6FD] w-full" />
            <span className="bg-white px-3 text-xs font-black tracking-widest text-[#0369A1] uppercase">
              OR
            </span>
            <div className="border-t-2 border-[#BAE6FD] w-full" />
          </div>

          {/* Manual English Text Input Section */}
          <div className="flex flex-col gap-2.5">
            <label htmlFor="manual-english-input" className="text-sm font-extrabold text-[#0C4A6E]">
              Enter English Text
            </label>
            <textarea
              id="manual-english-input"
              value={manualInputText}
              onChange={(e) => {
                setManualInputText(e.target.value);
                if (manualInputError) setManualInputError(null);
              }}
              placeholder="Type or paste your English educational text here..."
              rows={5}
              className="w-full p-3.5 rounded-2xl border-2 border-[#BAE6FD] focus:border-[#0284C7] focus:ring-4 focus:ring-[#BAE6FD] bg-[#F0F9FF] text-[#0C4A6E] text-base placeholder-[#0369A1]/60 font-medium transition-all resize-y min-h-[140px] focus:outline-none leading-relaxed"
            />

            {manualInputError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm font-semibold text-red-700 flex items-center gap-1.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{manualInputError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleManualTranslate}
              disabled={isTranslating}
              className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              Translate to ISL
            </button>
          </div>
        </section>

        {/* Right Panel: ISL Gloss & Sign Demonstration (Col 5-12) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Below: ISL Gloss */}
          <div className="bg-white rounded-3xl border-2 border-[#0284C7] p-5 sm:p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0284C7]" />
                <h2 className="text-lg font-black text-[#0C4A6E]">
                  ISL Gloss
                </h2>
              </div>

              {currentTranslation?.isl_gloss && (
                <button
                  onClick={handleCopyGloss}
                  className="px-3 py-1.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] hover:bg-[#E0F2FE] text-xs font-bold text-[#0369A1] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedGloss ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Gloss</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Gloss Tokens Banner */}
            {isTranslating ? (
              <div className="py-6 flex items-center justify-center gap-3 text-[#0369A1] font-bold text-sm">
                <RefreshCw className="w-5 h-5 animate-spin text-[#0284C7]" />
                <span>Translating to ISL Grammatical Gloss with Gemini...</span>
              </div>
            ) : currentTranslation ? (
              <div className="flex flex-col gap-4">
                {/* Visual Tokens Badges */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] border-2 border-[#38BDF8] flex flex-wrap gap-2.5 items-center">
                  {currentSigns.map((token, idx) => {
                    const entry = lookupISLSign(token.search_key);
                    const isAvail = Boolean(entry && entry.videoAvailable);
                    const isSelected = activeSignIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveSignIndex(idx);
                          setIsPlayingSequence(false);
                        }}
                        className={`px-3.5 py-2 rounded-xl font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0284C7] text-white shadow-lg ring-4 ring-[#BAE6FD] scale-105'
                            : isAvail
                            ? 'bg-white text-[#0C4A6E] border border-[#7DD3FC] hover:border-[#0284C7] shadow-sm'
                            : 'bg-amber-50 text-amber-900 border border-amber-300'
                        }`}
                      >
                        <span>{token.word}</span>
                        {isAvail ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Video available" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-500" title="Video unavailable" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-[#64748B]">
                No gloss generated yet.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Main ISL Sign Representation Workspace */}
      <section
        aria-labelledby="sign-representation-heading"
        className="w-full bg-white rounded-3xl border-2 border-[#BAE6FD] p-5 sm:p-7 lg:p-8 shadow-md flex flex-col gap-6"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E0F2FE] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h2 id="sign-representation-heading" className="text-xl sm:text-2xl font-black text-[#0C4A6E]">
                ISL Sign Representation
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#0369A1] mt-1">
              Sequential video representations matched against verified ISL Dictionary dataset
            </p>
          </div>

          {/* Sequential Player Controls Bar (Header / Quick Access) */}
          <div className="flex flex-wrap items-center gap-2 bg-[#F0F9FF] p-2 rounded-2xl border border-[#BAE6FD]">
            <button
              onClick={handlePreviousSign}
              disabled={activeSignIndex === 0}
              title="Previous Sign"
              className="px-3 py-2 rounded-xl bg-white text-[#0C4A6E] font-bold text-xs hover:bg-[#E0F2FE] border border-[#BAE6FD] disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <SkipBack className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {isPlayingSequence ? (
              <button
                onClick={handlePauseSequence}
                title="Pause Sequence"
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={handlePlaySequence}
                title="Play Sequential Signs"
                className="px-4 py-2 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Sequence</span>
              </button>
            )}

            <button
              onClick={handleNextSign}
              disabled={activeSignIndex >= currentSigns.length - 1}
              title="Next Sign"
              className="px-3 py-2 rounded-xl bg-white text-[#0C4A6E] font-bold text-xs hover:bg-[#E0F2FE] border border-[#BAE6FD] disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestartSequence}
              title="Restart Sequence"
              className="px-3 py-2 rounded-xl bg-white text-[#0369A1] font-bold text-xs hover:bg-[#E0F2FE] border border-[#BAE6FD] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Restart</span>
            </button>

            {/* Playback Speed selector */}
            <div className="flex items-center gap-1 border-l border-[#BAE6FD] pl-2 ml-1">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-white text-[#0369A1] hover:bg-[#E0F2FE]'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Prominent ISL Gloss Banner at Top of ISL Section */}
        {currentTranslation?.isl_gloss && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] border-2 border-[#38BDF8] flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
                  ISL Gloss Sequence
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0284C7]/15 text-[#0369A1]">
                  {currentSigns.length} {currentSigns.length === 1 ? 'sign' : 'signs'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openLumi()}
                  className="px-2.5 py-1 rounded-lg bg-[#0369A1] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Bot className="w-3.5 h-3.5 text-sky-200" />
                  <span>Ask Lumi</span>
                </button>
                <button
                  onClick={handleCopyGloss}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#BAE6FD] hover:bg-[#E0F2FE] text-xs font-bold text-[#0369A1] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedGloss ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Gloss</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Clickable Gloss Sequence Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              {currentSigns.map((token, idx) => {
                const entry = lookupISLSign(token.search_key);
                const isAvail = Boolean(entry && entry.videoAvailable);
                const isSelected = activeSignIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSignIndex(idx);
                      setIsPlayingSequence(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0284C7] text-white shadow-md ring-3 ring-[#BAE6FD] scale-105'
                        : isAvail
                        ? 'bg-white text-[#0C4A6E] border border-[#7DD3FC] hover:border-[#0284C7] hover:bg-[#F0F9FF] shadow-xs'
                        : 'bg-amber-50 text-amber-900 border border-amber-300 hover:border-amber-400'
                    }`}
                  >
                    <span>{token.word}</span>
                    {isAvail ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Video available" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Video unavailable" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Desktop Two-Column Layout (Left 62-65% Video Player, Right 35-38% Scrollable Sign Sequence) */}
        {currentSigns.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* LEFT COLUMN: Large Real ISL Video Player & Active Sign Details (~62-65% on Desktop) */}
            <div className="w-full lg:w-[62%] xl:w-[65%] flex flex-col gap-4">
              {/* Real ISL Video Player */}
              <div className="w-full">
                <ISLSignVisualPlayer
                  signEntry={activeSignEntry}
                  keyword={activeSignToken?.word || 'SIGN'}
                  isPlaying={isPlayingSequence}
                  onPlayToggle={() => setIsPlayingSequence(!isPlayingSequence)}
                  onPreviousSign={handlePreviousSign}
                  onNextSign={handleNextSign}
                  hasPreviousSign={activeSignIndex > 0}
                  hasNextSign={activeSignIndex < currentSigns.length - 1}
                  playbackSpeed={playbackSpeed}
                  size="hero"
                />
              </div>

              {/* Active Sign Metadata & Linguistic Clues Card */}
              {activeSignToken && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F9FF] border-2 border-[#BAE6FD] flex flex-col gap-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E0F2FE] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0284C7] text-white">
                        Active Sign #{activeSignIndex + 1} of {currentSigns.length}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-[#0C4A6E] tracking-wider uppercase font-mono">
                        {activeSignToken.word}
                      </h3>
                    </div>

                    {activeSignEntry?.videoAvailable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Real MP4 Dataset
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Sign video unavailable
                      </span>
                    )}
                  </div>

                  {activeSignEntry?.videoAvailable ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#0C4A6E]">
                      <div className="p-2.5 rounded-xl bg-white border border-[#BAE6FD]">
                        <span className="block font-bold text-[#0284C7] mb-0.5">Handshape</span>
                        <p className="font-medium line-clamp-2">{activeSignEntry.handshape}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#BAE6FD]">
                        <span className="block font-bold text-[#0284C7] mb-0.5">Movement</span>
                        <p className="font-medium line-clamp-2">{activeSignEntry.movementDescription}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#BAE6FD]">
                        <span className="block font-bold text-[#0284C7] mb-0.5">Non-Manual Marker</span>
                        <p className="font-medium line-clamp-2">{activeSignEntry.nonManualMarkers}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p>
                        No recorded demonstration video exists for <strong>"{activeSignToken.word}"</strong> in the local ISL dataset. Authentic sign assistants do not invent gestures.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Compact & Independently Scrollable Sign Sequence List (~35-38% on Desktop) */}
            <div className="w-full lg:w-[38%] xl:w-[35%] flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0284C7]" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0C4A6E]">
                    ISL Sign Sequence
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#0369A1]">
                  Click to play sign
                </span>
              </div>

              {/* Scrollable Sign Sequence List */}
              <div className="flex flex-col gap-2.5 max-h-[460px] sm:max-h-[520px] lg:max-h-[580px] overflow-y-auto pr-1">
                {currentSigns.map((token, idx) => {
                  const entry = lookupISLSign(token.search_key);
                  const isAvail = Boolean(entry && entry.videoAvailable);
                  const isActive = activeSignIndex === idx;

                  return (
                    <div
                      key={idx}
                      id={`sign-sequence-item-${idx}`}
                      onClick={() => {
                        setActiveSignIndex(idx);
                        setIsPlayingSequence(false);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                        isActive
                          ? 'bg-[#E0F2FE] border-[#0284C7] ring-3 ring-[#BAE6FD] shadow-md scale-[1.01]'
                          : 'bg-white border-[#BAE6FD]/80 hover:border-[#0284C7] hover:bg-[#F0F9FF] shadow-xs'
                      }`}
                    >
                      {/* Left: Index badge & Gloss Word */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            isActive
                              ? 'bg-[#0284C7] text-white shadow-xs'
                              : 'bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]'
                          }`}
                        >
                          #{idx + 1}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span
                            className={`font-mono text-sm sm:text-base font-black tracking-wider uppercase truncate ${
                              isActive ? 'text-[#0284C7]' : 'text-[#0C4A6E]'
                            }`}
                          >
                            {token.word}
                          </span>
                          <span className="text-[11px] font-medium text-[#0369A1] truncate">
                            {entry?.category || 'Everyday'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Availability status badge & Play trigger */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isAvail ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span className="hidden sm:inline">Real MP4</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span className="hidden sm:inline">Unavailable</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isActive && isPlayingSequence) {
                              setIsPlayingSequence(false);
                            } else {
                              setActiveSignIndex(idx);
                              setIsPlayingSequence(true);
                            }
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#0284C7] text-white hover:bg-[#0369A1] shadow-xs'
                              : 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] hover:bg-[#E0F2FE]'
                          }`}
                        >
                          {isActive && isPlayingSequence ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-[#64748B] text-sm rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#BAE6FD]">
            Select or upload a lesson to render matching ISL sign representations.
          </div>
        )}

        {/* 3. Bottom Transport Controls Footer Bar */}
        {currentSigns.length > 0 && (
          <div className="pt-3 border-t border-[#E0F2FE] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#0369A1] font-bold">
                Viewing Sign {activeSignIndex + 1} of {currentSigns.length}
              </span>
              <span className="text-[#64748B] hidden sm:inline">|</span>
              <span className="text-[#64748B] hidden sm:inline">
                Sequential Auto-play advances automatically upon video completion
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousSign}
                disabled={activeSignIndex === 0}
                className="px-3 py-1.5 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-[#0C4A6E] font-bold hover:bg-[#E0F2FE] disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <SkipBack className="w-3.5 h-3.5" />
                <span>Previous Sign</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPlayingSequence(!isPlayingSequence)}
                className="px-4 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold cursor-pointer flex items-center gap-1 shadow-xs"
              >
                {isPlayingSequence ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Sequence</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNextSign}
                disabled={activeSignIndex >= currentSigns.length - 1}
                className="px-3 py-1.5 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-[#0C4A6E] font-bold hover:bg-[#E0F2FE] disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <span>Next Sign</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
