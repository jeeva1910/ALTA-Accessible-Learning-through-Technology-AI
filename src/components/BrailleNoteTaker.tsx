import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Volume2,
  Mic,
  MicOff,
  Copy,
  Trash2,
  Check,
  RotateCcw,
  CornerDownLeft,
  Space as SpaceIcon,
  Delete as DeleteIcon,
  Sparkles,
  BookOpen,
  ListCheck,
  Wand2,
  Lightbulb,
  ChevronDown,
  X,
  MoreVertical,
  Plus
} from 'lucide-react';
import { voiceFeedback } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { speechRecognizer } from '../utils/speechRecognition';
import { lookupBraille, getBrailleUnicode } from '../utils/braille';
import { useLumi } from '../context/LumiContext';

interface BrailleNoteTakerProps {
  onBack?: () => void;
}

export const BrailleNoteTaker: React.FC<BrailleNoteTakerProps> = ({ onBack }) => {
  // ----------------------------------------------------
  // NOTE STATE
  // ----------------------------------------------------
  const [noteTitle, setNoteTitle] = useState<string>('Photosynthesis & Cellular Energy');
  const [noteContent, setNoteContent] = useState<string>(
    'Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water.'
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // Braille keyboard overlay state (only open/close when triple tapped or selected)
  const [isBrailleOpen, setIsBrailleOpen] = useState(false);

  // Global Lumi Context Integration
  const { openLumi, sendQuery, updateAppContext, isOpen: isLumiOpen } = useLumi();

  // ----------------------------------------------------
  // REFS FOR MULTI-TAP & KEYBOARD INTERACTION
  // ----------------------------------------------------
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tapCountRef = useRef<number>(0);
  const tapTimerRef = useRef<any>(null);

  // ----------------------------------------------------
  // VOICE INPUT STATE FOR NOTE AREA
  // ----------------------------------------------------
  const [isNoteVoiceListening, setIsNoteVoiceListening] = useState(false);
  const [voiceInterimText, setVoiceInterimText] = useState('');

  // ----------------------------------------------------
  // BRAILLE 6-DOT KEYBOARD STATE
  // ----------------------------------------------------
  const [activeDots, setActiveDots] = useState<number[]>([]);
  const [recognizedChar, setRecognizedChar] = useState<string | null>(null);
  const [, setLastCommittedChar] = useState<string | null>(null);
  const [, setLastActionFeedback] = useState<string>('Braille keyboard ready');

  // Gesture tracking refs for Braille keyboard area
  const touchStartRef = useRef<{ x: number; y: number; touches: number; time: number }>({
    x: 0,
    y: 0,
    touches: 1,
    time: 0,
  });

  // Keep global Lumi context synchronized with active note
  useEffect(() => {
    updateAppContext({
      mode: 'visual_accessibility',
      featureId: 'braille_notes',
      featureName: 'Braille Note Taker',
      pageTitle: noteTitle || 'Untitled Note',
      screenContent: noteContent,
      suggestedPrompts: [
        'Explain this note in simple step-by-step terms.',
        'Summarize this note into 3 key takeaways.',
        'Quiz me with 2 questions based on this note.',
        'Suggest how I can improve or expand this note.'
      ]
    });
  }, [noteTitle, noteContent, updateAppContext]);

  // Initial welcome announcement
  useEffect(() => {
    voiceFeedback.speak('Note ready. Triple tap screen to open Braille keyboard.');
    return () => {
      speechRecognizer.stop();
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  // Update recognized character whenever activeDots change
  useEffect(() => {
    if (activeDots.length > 0) {
      const match = lookupBraille(activeDots);
      if (match) {
        setRecognizedChar(match.char.toUpperCase());
        voiceFeedback.speak(match.name);
      } else {
        setRecognizedChar('?');
        voiceFeedback.speak(`Dots ${activeDots.sort().join(' ')}`);
      }
    } else {
      setRecognizedChar(null);
    }
  }, [activeDots]);

  // ----------------------------------------------------
  // BRAILLE DOT TOGGLE
  // ----------------------------------------------------
  const toggleDot = (dotNumber: number) => {
    triggerHaptic('light');
    setActiveDots((prev) => {
      const exists = prev.includes(dotNumber);
      const next = exists ? prev.filter((d) => d !== dotNumber) : [...prev, dotNumber];
      return next.sort((a, b) => a - b);
    });
  };

  // ----------------------------------------------------
  // COMMIT BRAILLE CHARACTER (Top-to-Bottom Swipe / Action)
  // ----------------------------------------------------
  const commitBrailleCharacter = () => {
    if (activeDots.length === 0) return;

    const match = lookupBraille(activeDots);
    if (match) {
      const charToAppend = match.char;
      setNoteContent((prev) => prev + charToAppend);
      setLastCommittedChar(match.char.toUpperCase());
      setLastActionFeedback(`Added "${match.char.toUpperCase()}"`);
      triggerHaptic('success');
      voiceFeedback.speak(match.char.toUpperCase());
    } else {
      triggerHaptic('light');
      voiceFeedback.speak('Unknown Braille combination');
    }
    setActiveDots([]);
  };

  // ----------------------------------------------------
  // SPACE ACTION (Two-Finger Tap)
  // ----------------------------------------------------
  const handleSpace = () => {
    if (activeDots.length > 0) {
      commitBrailleCharacter();
    }
    setNoteContent((prev) => prev + ' ');
    setLastActionFeedback('Space');
    triggerHaptic('medium');
    voiceFeedback.speak('Space');
  };

  // ----------------------------------------------------
  // ENTER / NEW LINE ACTION (Three-Finger Tap)
  // ----------------------------------------------------
  const handleNewLine = () => {
    if (activeDots.length > 0) {
      commitBrailleCharacter();
    }
    setNoteContent((prev) => prev + '\n');
    setLastActionFeedback('New line');
    triggerHaptic('medium');
    voiceFeedback.speak('New line');
  };

  // ----------------------------------------------------
  // DELETE ACTION (Right-to-Left Swipe)
  // ----------------------------------------------------
  const handleDelete = () => {
    triggerHaptic('medium');
    if (activeDots.length > 0) {
      setActiveDots([]);
      voiceFeedback.speak('Dots cleared');
      return;
    }

    if (noteContent.length > 0) {
      const charToDelete = noteContent[noteContent.length - 1];
      setNoteContent((prev) => prev.slice(0, -1));
      const spokenName =
        charToDelete === ' '
          ? 'Space'
          : charToDelete === '\n'
          ? 'New line'
          : charToDelete.toUpperCase();
      setLastActionFeedback(`Deleted ${spokenName}`);
      voiceFeedback.speak(`Deleted ${spokenName}`);
    } else {
      voiceFeedback.speak('Note is empty');
    }
  };

  // ----------------------------------------------------
  // GESTURE HANDLERS ON THE BRAILLE KEYBOARD AREA
  // ----------------------------------------------------
  const handleKeyboardTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touches = e.touches.length;
    const firstTouch = e.touches[0];
    touchStartRef.current = {
      x: firstTouch.clientX,
      y: firstTouch.clientY,
      touches,
      time: Date.now(),
    };

    // TWO-FINGER TAP -> Space
    if (touches === 2) {
      e.preventDefault();
      handleSpace();
    } else if (touches === 3) {
      // THREE-FINGER TAP -> New Line
      e.preventDefault();
      handleNewLine();
    }
  };

  const handleKeyboardTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const { touches, x, y } = touchStartRef.current;

    // Only process swipe gestures if it was a single-finger interaction
    if (touches === 1 && e.changedTouches.length === 1) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - x;
      const deltaY = endY - y;

      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40;
      const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 40;

      // 1. Right-to-Left Swipe → DELETE
      if (isHorizontalSwipe && deltaX < -40) {
        e.preventDefault();
        handleDelete();
        return;
      }

      // 2. Top-to-Bottom Swipe → COMMIT CURRENT CHARACTER
      if (isVerticalSwipe && deltaY > 40) {
        e.preventDefault();
        if (activeDots.length > 0) {
          commitBrailleCharacter();
        } else {
          triggerHaptic('light');
          voiceFeedback.speak('No dots selected to commit');
        }
        return;
      }
    }
  };

  // ----------------------------------------------------
  // MULTI-TAP DETECTOR (Screen & Overlay):
  // - Single Tap: places cursor & enables normal editing
  // - Double Tap: toggles Voice Input
  // - Triple Tap: opens/closes Braille keyboard overlay
  // ----------------------------------------------------
  const handleScreenMultiTap = () => {
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
    }

    tapCountRef.current += 1;

    if (tapCountRef.current === 3) {
      // TRIPLE TAP -> Toggle Braille Transparent Overlay Keyboard
      tapCountRef.current = 0;
      triggerHaptic('success');
      setIsBrailleOpen((prev) => {
        const next = !prev;
        voiceFeedback.speak(next ? 'Braille keyboard open' : 'Braille keyboard closed');
        return next;
      });
      return;
    }

    if (tapCountRef.current === 2) {
      // Potential DOUBLE TAP -> wait 220ms to distinguish from triple tap
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
        toggleNoteVoiceInput();
      }, 220);
      return;
    }

    // First tap -> reset after 320ms
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 320);
  };

  const toggleNoteVoiceInput = () => {
    if (isNoteVoiceListening) {
      speechRecognizer.stop();
      setIsNoteVoiceListening(false);
      triggerHaptic('medium');
      voiceFeedback.speak('Voice input stopped.');
    } else {
      triggerHaptic('success');
      setIsNoteVoiceListening(true);
      setVoiceInterimText('');
      voiceFeedback.speak('Listening.');

      speechRecognizer.start(
        (res) => {
          setVoiceInterimText(res.transcript);
          triggerHaptic('light');
        },
        (finalTranscript) => {
          if (finalTranscript.trim()) {
            setNoteContent((prev) => {
              const prefix = prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '';
              return prev + prefix + finalTranscript.trim();
            });
            voiceFeedback.speak(`Added: ${finalTranscript.trim()}`);
            setVoiceInterimText('');
          }
        },
        (listening) => {
          setIsNoteVoiceListening(listening);
        },
        (err) => {
          console.warn('Note voice input err:', err);
          setIsNoteVoiceListening(false);
          voiceFeedback.speak('Voice input stopped.');
        }
      );
    }
  };

  // ----------------------------------------------------
  // READ NOTE ALOUD
  // ----------------------------------------------------
  const handleReadNoteAloud = () => {
    triggerHaptic('medium');
    if (!noteContent.trim()) {
      voiceFeedback.speak('Note is empty.');
      return;
    }
    voiceFeedback.speak(`Reading note: ${noteContent}`);
  };

  const handleCopyNote = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(noteContent);
    setIsCopied(true);
    setIsMoreMenuOpen(false);
    voiceFeedback.speak('Note copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClearNote = () => {
    triggerHaptic('medium');
    setNoteContent('');
    setIsMoreMenuOpen(false);
    voiceFeedback.speak('Note cleared');
  };

  const handleNewNote = () => {
    triggerHaptic('success');
    setNoteTitle('Title');
    setNoteContent('');
    setIsMoreMenuOpen(false);
    voiceFeedback.speak('New note created');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    triggerHaptic('light');
    voiceFeedback.speak(`Asking Lumi: ${promptText}`);
    openLumi({
      featureId: 'braille_notes',
      featureName: 'Braille Note Taker',
      pageTitle: noteTitle,
      screenContent: noteContent
    });
    sendQuery(promptText);
  };

  return (
    <div
      id="braille-note-taker-root"
      className="relative w-full flex-1 flex flex-col lg:flex-row gap-6 p-2 sm:p-4 max-w-[1600px] mx-auto min-h-[calc(100vh-100px)] text-slate-900 overflow-hidden"
    >
      {/* ============================================================ */}
      {/* PRIMARY WRITING CANVAS (Simple, minimal, distraction-free)    */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm transition-all">
        
        {/* ---------------------------------------------------------- */}
        {/* MINIMAL TOP TOOLBAR                                        */}
        {/* ---------------------------------------------------------- */}
        <header
          id="note-toolbar"
          className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100"
        >
          {/* LEFT: Back Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              id="note-back-btn"
              onClick={() => {
                triggerHaptic('light');
                if (onBack) {
                  onBack();
                } else {
                  voiceFeedback.speak('Back');
                }
              }}
              className="w-10 h-10 -ml-1 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
              title="Go back"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* CENTER: Editable Note Title */}
          <div className="flex-1 min-w-0 px-1">
            <input
              type="text"
              id="note-title-input"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-xl sm:text-2xl font-bold text-slate-900 bg-transparent border-none focus:outline-none placeholder:text-slate-400 truncate"
              aria-label="Note Title"
            />
          </div>

          {/* RIGHT: Minimal Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative">
            {/* Ask Lumi Assistant Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('success');
                openLumi();
                voiceFeedback.speak('Lumi AI Assistant opened with your note context.');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isLumiOpen
                  ? 'bg-sky-600 text-white'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
              }`}
              title="Ask Lumi about this note"
            >
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span className="hidden sm:inline">Ask Lumi</span>
            </button>

            {/* Read Aloud Button */}
            <button
              type="button"
              id="read-note-aloud-btn"
              onClick={handleReadNoteAloud}
              className="w-9 h-9 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
              title="Read Note Aloud"
              aria-label="Read Note Aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* New Note Button */}
            <button
              type="button"
              id="new-note-btn"
              onClick={handleNewNote}
              className="w-9 h-9 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
              title="New Note"
              aria-label="New Note"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* More Menu Toggle (⋮) */}
            <div className="relative">
              <button
                type="button"
                id="more-options-btn"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
                title="More Options"
                aria-label="More Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {isMoreMenuOpen && (
                <div
                  id="note-more-dropdown"
                  className="absolute right-0 top-11 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn text-sm"
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleNoteVoiceInput();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    {isNoteVoiceListening ? <MicOff className="w-4 h-4 text-rose-500" /> : <Mic className="w-4 h-4 text-sky-600" />}
                    <span>{isNoteVoiceListening ? 'Stop Voice Input' : 'Voice Input (Double-Tap)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsBrailleOpen(!isBrailleOpen);
                      setIsMoreMenuOpen(false);
                      voiceFeedback.speak(isBrailleOpen ? 'Braille keyboard closed' : 'Braille keyboard open');
                    }}
                    className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <span className="w-4 h-4 flex items-center justify-center font-mono font-bold text-xs text-sky-700">⠿</span>
                    <span>{isBrailleOpen ? 'Hide Braille Keyboard' : 'Braille Keyboard (Triple-Tap)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openLumi();
                      setIsMoreMenuOpen(false);
                      voiceFeedback.speak('Lumi AI Assistant opened');
                    }}
                    className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Lumi AI Assistant</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={handleCopyNote}
                    className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Note'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearNote}
                    className="w-full px-4 py-2.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Content</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* VOICE LISTENING FLOATING STATUS                            */}
        {/* ---------------------------------------------------------- */}
        {isNoteVoiceListening && (
          <div className="my-2 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 animate-pulse shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span className="font-bold shrink-0">Listening:</span>
              <span className="italic truncate text-rose-800">
                {voiceInterimText || 'Speak now (double-tap to stop)...'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleNoteVoiceInput}
              className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 shrink-0 cursor-pointer"
            >
              Stop
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------- */}
        {/* BLANK-PAGE WRITING CANVAS                                  */}
        {/* ---------------------------------------------------------- */}
        <div
          id="note-blank-page-area"
          onClick={handleScreenMultiTap}
          onTouchEnd={handleScreenMultiTap}
          className="relative flex-1 w-full min-h-[360px] py-3 cursor-text flex flex-col"
          title="Single tap to edit, double-tap for voice, triple-tap for Braille keyboard"
        >
          <textarea
            ref={textareaRef}
            id="note-textarea"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Start typing your accessible notes..."
            className="w-full flex-1 min-h-[340px] bg-transparent text-slate-900 text-lg sm:text-xl font-normal leading-relaxed resize-none focus:outline-none placeholder:text-slate-300 selection:bg-sky-100 selection:text-sky-900"
            aria-label="Note Content Editor"
          />

          {/* Quick Smart Actions Connected to Lumi */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[11px] mr-1">Ask Lumi:</span>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Explain this note in simple step-by-step terms.')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-sky-50 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3 h-3 text-sky-600" />
                <span>Explain Note</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Summarize this note into 3 key takeaways.')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-sky-50 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3 h-3 text-sky-600" />
                <span>Summarize</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Quiz me with 2 questions based on this note.')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-sky-50 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ListCheck className="w-3 h-3 text-sky-600" />
                <span>Quiz Me</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Help me improve and expand this note.')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-sky-50 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Wand2 className="w-3 h-3 text-sky-600" />
                <span>Improve</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>{noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0} words</span>
              <span>• Triple-tap for Braille</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TRANSPARENT BRAILLE KEYBOARD OVERLAY                         */}
      {/* ============================================================ */}
      {isBrailleOpen && (
        <section
          id="braille-keyboard-section"
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-[2px] flex flex-col justify-between p-4 sm:p-8 text-white select-none animate-fadeIn"
          aria-labelledby="braille-keyboard-heading"
          onTouchStart={handleKeyboardTouchStart}
          onTouchEnd={handleKeyboardTouchEnd}
          onClick={handleScreenMultiTap}
        >
          {/* Top Bar of Transparent Overlay */}
          <div className="w-full flex items-center justify-between px-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <span className="text-2xl font-black text-sky-300 font-mono">
                  {getBrailleUnicode(activeDots)}
                </span>
                <span className="text-sm font-bold text-white">
                  {recognizedChar ? (
                    <span className="text-emerald-400 font-extrabold">{recognizedChar}</span>
                  ) : (
                    <span className="text-white/60">Dots {activeDots.length > 0 ? activeDots.join(',') : '—'}</span>
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsBrailleOpen(false);
                voiceFeedback.speak('Braille keyboard closed');
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
              title="Close Braille Keyboard (or triple-tap)"
              aria-label="Close Braille Keyboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FLOATING 6 BRAILLE DOTS (Left: 4, 5, 6 | Right: 1, 2, 3) */}
          <div
            id="braille-six-dots-container"
            className="flex-1 flex items-center justify-between max-w-2xl sm:max-w-3xl mx-auto w-full px-4 sm:px-12 my-auto"
            role="group"
            aria-label="Six Dot Braille Keyboard"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT COLUMN: Dots 4, 5, 6 */}
            <div className="flex flex-col items-center justify-around gap-6 sm:gap-10">
              {[4, 5, 6].map((dotNum) => {
                const isSelected = activeDots.includes(dotNum);
                return (
                  <button
                    key={dotNum}
                    type="button"
                    id={`braille-dot-${dotNum}`}
                    onClick={() => toggleDot(dotNum)}
                    aria-pressed={isSelected}
                    aria-label={`Dot ${dotNum}, ${isSelected ? 'selected' : 'not selected'}`}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-extrabold text-3xl sm:text-4xl transition-all cursor-pointer shadow-2xl ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-110 shadow-blue-500/50'
                        : 'bg-white text-blue-600 hover:scale-105 active:scale-95 border-2 border-white'
                    }`}
                  >
                    <span>{dotNum}</span>
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN: Dots 1, 2, 3 */}
            <div className="flex flex-col items-center justify-around gap-6 sm:gap-10">
              {[1, 2, 3].map((dotNum) => {
                const isSelected = activeDots.includes(dotNum);
                return (
                  <button
                    key={dotNum}
                    type="button"
                    id={`braille-dot-${dotNum}`}
                    onClick={() => toggleDot(dotNum)}
                    aria-pressed={isSelected}
                    aria-label={`Dot ${dotNum}, ${isSelected ? 'selected' : 'not selected'}`}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-extrabold text-3xl sm:text-4xl transition-all cursor-pointer shadow-2xl ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-110 shadow-blue-500/50'
                        : 'bg-white text-blue-600 hover:scale-105 active:scale-95 border-2 border-white'
                    }`}
                  >
                    <span>{dotNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Gestures & Action Controls */}
          <div
            className="w-full flex flex-col items-center gap-2 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                id="commit-braille-btn"
                onClick={commitBrailleCharacter}
                disabled={activeDots.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Commit</span>
              </button>

              <button
                type="button"
                id="braille-space-btn"
                onClick={handleSpace}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm border border-white/20"
              >
                <SpaceIcon className="w-4 h-4" />
                <span>Space</span>
              </button>

              <button
                type="button"
                id="braille-delete-btn"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <DeleteIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <button
                type="button"
                id="braille-newline-btn"
                onClick={handleNewLine}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm border border-white/20"
              >
                <CornerDownLeft className="w-4 h-4" />
                <span>New Line</span>
              </button>

              {activeDots.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveDots([]);
                    voiceFeedback.speak('Reset dots');
                  }}
                  className="px-3 py-2 text-white/70 hover:text-white rounded-xl flex items-center gap-1 cursor-pointer text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-white/60 text-center select-none pt-1">
              Swipe Down to Commit • 2-Finger Tap for Space • Swipe Left to Delete • Triple-Tap to Close
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
