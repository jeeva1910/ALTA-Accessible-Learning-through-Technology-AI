import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Headphones,
  Sparkles,
  Volume2,
  Fingerprint,
  Layers,
  ArrowLeft,
  X,
  Menu
} from 'lucide-react';
import { voiceFeedback } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { BrailleNoteTaker } from './BrailleNoteTaker';
import { AudioLearningSection } from './AudioLearningSection';
import { useLumi } from '../context/LumiContext';

export type SidebarCategory =
  | 'welcome'
  | 'diagram_to_tactile'
  | 'note_taker'
  | 'audio_learning'
  | 'touch_to_concept';

interface VisualAccessibilityDashboardProps {
  onBackToPreferences?: () => void;
}

export const VisualAccessibilityDashboard: React.FC<VisualAccessibilityDashboardProps> = ({
  onBackToPreferences,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SidebarCategory>('welcome');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const { updateAppContext } = useLumi();

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
        triggerHaptic('light');
        voiceFeedback.speak('Navigation closed.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen]);

  // Sync category changes to global Lumi context
  useEffect(() => {
    switch (selectedCategory) {
      case 'note_taker':
        updateAppContext({
          mode: 'visual_accessibility',
          featureId: 'braille_notes',
          featureName: 'Braille Note Taker',
          pageTitle: 'Braille & Audio Notes',
          suggestedPrompts: [
            'Explain my current note step-by-step.',
            'Summarize this note into 3 key bullet points.',
            'Quiz me on the concepts in my note.'
          ]
        });
        break;
      case 'audio_learning':
        updateAppContext({
          mode: 'visual_accessibility',
          featureId: 'audio_learning',
          featureName: 'Audio Learning & TTS',
          pageTitle: 'Audio Lesson Studio',
          suggestedPrompts: [
            'Explain the main idea of this audio reading.',
            'Define difficult vocabulary from this text.',
            'Summarize key takeaways from this lesson.'
          ]
        });
        break;
      case 'diagram_to_tactile':
        updateAppContext({
          mode: 'visual_accessibility',
          featureId: 'overview',
          featureName: 'Diagram to Tactile',
          pageTitle: 'Tactile Diagram Guide',
          suggestedPrompts: [
            'How do tactile descriptions help visualize geometry?',
            'Describe how spatial tactile graphics work.'
          ]
        });
        break;
      case 'touch_to_concept':
        updateAppContext({
          mode: 'visual_accessibility',
          featureId: 'overview',
          featureName: 'Touch-to-Concept',
          pageTitle: 'Haptic Concept Explorer',
          suggestedPrompts: [
            'How can haptics represent mathematical graphs?',
            'Explain scientific force fields using touch analogies.'
          ]
        });
        break;
      default:
        updateAppContext({
          mode: 'visual_accessibility',
          featureId: 'overview',
          featureName: 'Visual Accessibility Hub',
          pageTitle: 'Alta Visual Learning Portal',
          suggestedPrompts: [
            'What visual accessibility features are available?',
            'How do I use the 6-dot Braille keyboard?',
            'How does audio learning playback work?'
          ]
        });
        break;
    }
  }, [selectedCategory, updateAppContext]);

  // Category handlers with voice & haptics
  const handleSelectCategory = (cat: SidebarCategory, label: string) => {
    triggerHaptic('selection');
    setSelectedCategory(cat);
    setIsMobileDrawerOpen(false);
    voiceFeedback.speak(`${label} selected`);
  };

  const handleBrandClick = () => {
    triggerHaptic('light');
    setSelectedCategory('welcome');
    setIsMobileDrawerOpen(false);
    voiceFeedback.speak('Alta Visual Accessibility Dashboard');
  };

  const toggleDesktopSidebar = () => {
    triggerHaptic('selection');
    const next = !isSidebarExpanded;
    setIsSidebarExpanded(next);
    voiceFeedback.speak(next ? 'Navigation expanded.' : 'Navigation collapsed.');
  };

  const toggleMobileDrawer = () => {
    triggerHaptic('selection');
    const next = !isMobileDrawerOpen;
    setIsMobileDrawerOpen(next);
    voiceFeedback.speak(next ? 'Navigation drawer opened.' : 'Navigation drawer closed.');
  };

  return (
    <div
      id="visual-accessibility-dashboard"
      className="min-h-screen w-full bg-[#F0F9FF] text-[#0C4A6E] font-sans flex flex-col md:flex-row relative selection:bg-[#BAE6FD]"
    >
      {/* ---------------------------------------------------- */}
      {/* MOBILE TOP BAR (< md)                                */}
      {/* ---------------------------------------------------- */}
      <header
        className="md:hidden sticky top-0 z-30 bg-white border-b-2 border-[#BAE6FD] px-4 py-3 flex items-center justify-between shadow-xs"
        role="banner"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileDrawer}
            aria-label={isMobileDrawerOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMobileDrawerOpen}
            className="w-10 h-10 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={handleBrandClick}
            className="text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BAE6FD] rounded-lg p-0.5"
          >
            <span className="font-black text-xl tracking-wider text-[#0369A1]">ALTA</span>
            <span className="block text-[11px] font-bold text-[#0C4A6E] -mt-1">Visual Learning</span>
          </button>
        </div>

        {onBackToPreferences && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              voiceFeedback.speak('Going back to mode selection');
              onBackToPreferences();
            }}
            className="px-3 py-1.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] rounded-xl text-xs font-bold flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#BAE6FD]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modes</span>
          </button>
        )}
      </header>

      {/* ---------------------------------------------------- */}
      {/* MOBILE DRAWER OVERLAY (< md)                         */}
      {/* ---------------------------------------------------- */}
      {isMobileDrawerOpen && (
        <>
          <div
            id="mobile-drawer-backdrop"
            onClick={() => {
              setIsMobileDrawerOpen(false);
              triggerHaptic('light');
            }}
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
            aria-hidden="true"
          />

          <aside
            id="mobile-drawer-sidebar"
            role="navigation"
            aria-label="Mobile learning categories"
            className="md:hidden fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-white border-r-4 border-[#0369A1] p-5 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#BAE6FD]">
                <div>
                  <h1 className="text-2xl font-black tracking-widest text-[#0369A1]">ALTA</h1>
                  <p className="text-xs font-bold text-[#0C4A6E]">Visual Accessibility</p>
                </div>

                <button
                  type="button"
                  onClick={toggleMobileDrawer}
                  aria-label="Close navigation"
                  className="w-9 h-9 rounded-xl text-[#0369A1] hover:bg-[#E0F2FE] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#BAE6FD]"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2.5" aria-label="Mobile navigation categories">
                <button
                  type="button"
                  onClick={() => handleSelectCategory('diagram_to_tactile', 'Diagram to Tactile')}
                  className={`w-full min-h-[50px] px-4 py-3 rounded-2xl font-bold text-base text-left flex items-center gap-3 transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] ${
                    selectedCategory === 'diagram_to_tactile'
                      ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <Layers className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Diagram to Tactile</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCategory('note_taker', 'Note Taker')}
                  className={`w-full min-h-[50px] px-4 py-3 rounded-2xl font-bold text-base text-left flex items-center gap-3 transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] ${
                    selectedCategory === 'note_taker'
                      ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <FileText className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Note Taker</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCategory('audio_learning', 'Audio Learning')}
                  className={`w-full min-h-[50px] px-4 py-3 rounded-2xl font-bold text-base text-left flex items-center gap-3 transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] ${
                    selectedCategory === 'audio_learning'
                      ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <Headphones className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Audio Learning</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCategory('touch_to_concept', 'Touch to Concept')}
                  className={`w-full min-h-[50px] px-4 py-3 rounded-2xl font-bold text-base text-left flex items-center gap-3 transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] ${
                    selectedCategory === 'touch_to_concept'
                      ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <Fingerprint className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Touch-to-Concept</span>
                </button>
              </nav>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t-2 border-[#BAE6FD]/60 flex items-center justify-between text-xs font-bold text-[#0369A1]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>Voice Active</span>
              </div>
              {onBackToPreferences && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onBackToPreferences();
                  }}
                  className="text-xs font-bold text-[#0369A1] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Switch Mode</span>
                </button>
              )}
            </div>
          </aside>
        </>
      )}

      {/* ---------------------------------------------------- */}
      {/* DESKTOP COLLAPSIBLE SIDEBAR (>= md)                 */}
      {/* ---------------------------------------------------- */}
      <aside
        id="left-sidebar"
        role="navigation"
        aria-label="Visual learning categories"
        className={`hidden md:flex flex-col justify-between shrink-0 shadow-lg z-20 bg-white border-r-4 border-[#0369A1] transition-all duration-300 ${
          isSidebarExpanded ? 'w-72 lg:w-80 p-6' : 'w-20 p-3 items-center'
        }`}
      >
        <div className="space-y-6 w-full">
          {/* Header & Hamburger Control */}
          <div className="flex items-center justify-between gap-2">
            {isSidebarExpanded ? (
              <div
                id="sidebar-brand-header"
                onClick={handleBrandClick}
                tabIndex={0}
                className="cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] rounded-xl p-1 -m-1 select-none flex-1 min-w-0"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl lg:text-3xl font-black tracking-widest text-[#0369A1]">
                    ALTA
                  </h1>
                </div>
                <div className="h-1 w-12 bg-[#0EA5E9] rounded-full mt-0.5" />
                <p className="text-xs font-bold text-[#0C4A6E] mt-1.5 truncate">
                  Visual Accessibility
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBrandClick}
                className="w-10 h-10 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-black text-lg focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
                title="ALTA Home Overview"
                aria-label="ALTA Home Overview"
              >
                A
              </button>
            )}

            {/* Hamburger Toggle Button */}
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              aria-label={isSidebarExpanded ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isSidebarExpanded}
              className="w-10 h-10 rounded-xl text-[#0369A1] hover:bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] shrink-0"
              title={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav
            id="sidebar-categories-nav"
            className="space-y-3 w-full"
            aria-label="Sub-categories"
          >
            {/* Category 1: Diagram to Tactile */}
            <button
              type="button"
              id="category-diagram-to-tactile"
              onClick={() => handleSelectCategory('diagram_to_tactile', 'Diagram to Tactile')}
              onFocus={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Diagram to Tactile');
              }}
              title="Diagram to Tactile"
              aria-label="Diagram to Tactile"
              className={`w-full min-h-[50px] rounded-2xl font-bold transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] flex items-center ${
                isSidebarExpanded ? 'px-4 py-3 text-base text-left gap-3.5' : 'justify-center p-3'
              } ${
                selectedCategory === 'diagram_to_tactile'
                  ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md scale-[1.02]'
                  : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0369A1]'
              }`}
            >
              <Layers className="w-6 h-6 shrink-0" aria-hidden="true" />
              {isSidebarExpanded && <span className="truncate">Diagram to Tactile</span>}
            </button>

            {/* Category 2: Note Taker */}
            <button
              type="button"
              id="category-note-taker"
              onClick={() => handleSelectCategory('note_taker', 'Note Taker')}
              onFocus={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Note Taker');
              }}
              title="Note Taker"
              aria-label="Note Taker"
              className={`w-full min-h-[50px] rounded-2xl font-bold transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] flex items-center ${
                isSidebarExpanded ? 'px-4 py-3 text-base text-left gap-3.5' : 'justify-center p-3'
              } ${
                selectedCategory === 'note_taker'
                  ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md scale-[1.02]'
                  : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0369A1]'
              }`}
            >
              <FileText className="w-6 h-6 shrink-0" aria-hidden="true" />
              {isSidebarExpanded && <span className="truncate">Note Taker</span>}
            </button>

            {/* Category 3: Audio Learning */}
            <button
              type="button"
              id="category-audio-learning"
              onClick={() => handleSelectCategory('audio_learning', 'Audio Learning')}
              onFocus={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Audio Learning');
              }}
              title="Audio Learning"
              aria-label="Audio Learning"
              className={`w-full min-h-[50px] rounded-2xl font-bold transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] flex items-center ${
                isSidebarExpanded ? 'px-4 py-3 text-base text-left gap-3.5' : 'justify-center p-3'
              } ${
                selectedCategory === 'audio_learning'
                  ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md scale-[1.02]'
                  : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0369A1]'
              }`}
            >
              <Headphones className="w-6 h-6 shrink-0" aria-hidden="true" />
              {isSidebarExpanded && <span className="truncate">Audio Learning</span>}
            </button>

            {/* Category 4: Touch-to-Concept */}
            <button
              type="button"
              id="category-touch-to-concept"
              onClick={() => handleSelectCategory('touch_to_concept', 'Touch to Concept')}
              onFocus={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Touch to Concept');
              }}
              title="Touch to Concept"
              aria-label="Touch to Concept"
              className={`w-full min-h-[50px] rounded-2xl font-bold transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] flex items-center ${
                isSidebarExpanded ? 'px-4 py-3 text-base text-left gap-3.5' : 'justify-center p-3'
              } ${
                selectedCategory === 'touch_to_concept'
                  ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md scale-[1.02]'
                  : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0369A1]'
              }`}
            >
              <Fingerprint className="w-6 h-6 shrink-0" aria-hidden="true" />
              {isSidebarExpanded && <span className="truncate">Touch-to-Concept</span>}
            </button>
          </nav>
        </div>

        {/* Footer & Mode Back Action */}
        <div className="pt-4 border-t-2 border-[#BAE6FD]/60 w-full">
          {onBackToPreferences && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Going back to mode selection');
                onBackToPreferences();
              }}
              title="Back to Mode Selection"
              aria-label="Back to Mode Selection"
              className={`w-full min-h-[44px] rounded-xl text-[#0369A1] hover:bg-[#E0F2FE] font-bold text-xs flex items-center transition-colors focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] ${
                isSidebarExpanded ? 'px-3 py-2 justify-start gap-2' : 'justify-center p-2'
              }`}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>Modes Selection</span>}
            </button>
          )}

          {isSidebarExpanded && (
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#0369A1]">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Voice Active</span>
              </div>
              <span className="bg-[#E0F2FE] px-2 py-0.5 rounded text-[#0369A1]">
                "Hey Lumi"
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN CONTENT AREA                                 */}
      {/* ---------------------------------------------------- */}
      <main
        id="main-content-area"
        className="flex-1 min-h-[calc(100vh-60px)] md:min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative"
        role="main"
      >
        {/* State A: Clean Central Welcome Message (Default View) */}
        {selectedCategory === 'welcome' && (
          <div
            id="central-welcome-container"
            className="w-full max-w-3xl text-center space-y-6 animate-fadeIn py-6"
          >
            <h2
              id="central-welcome-title"
              tabIndex={0}
              onClick={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Step Into Your Learning Journey with Alta');
              }}
              onFocus={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Step Into Your Learning Journey with Alta');
              }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0C4A6E] tracking-tight leading-tight cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] rounded-2xl p-2"
            >
              Step Into Your Learning Journey with Alta
            </h2>

            <p
              id="central-welcome-subtitle"
              tabIndex={0}
              onClick={() => {
                triggerHaptic('light');
                voiceFeedback.speak(
                  'Learn, explore, and discover concepts in a way that works for you.'
                );
              }}
              onFocus={() => {
                triggerHaptic('light');
                voiceFeedback.speak(
                  'Learn, explore, and discover concepts in a way that works for you.'
                );
              }}
              className="text-lg sm:text-xl lg:text-2xl text-[#0369A1] font-medium leading-relaxed max-w-2xl mx-auto cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] rounded-2xl p-2"
            >
              Learn, explore, and discover concepts in a way that works for you.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSelectCategory('note_taker', 'Note Taker')}
                className="px-6 py-3.5 rounded-2xl bg-[#0369A1] hover:bg-[#0284C7] text-white font-black text-base sm:text-lg shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                <span>Open Braille Note Taker</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('audio_learning', 'Audio Learning')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#E0F2FE] text-[#0C4A6E] border-2 border-[#0369A1] font-black text-base sm:text-lg shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Headphones className="w-5 h-5 text-[#0369A1]" />
                <span>Audio Learning Studio</span>
              </button>
            </div>
          </div>
        )}

        {/* State B: Diagram to Tactile */}
        {selectedCategory === 'diagram_to_tactile' && (
          <div className="w-full max-w-2xl text-center space-y-6 animate-fadeIn py-8">
            <h3 className="text-3xl sm:text-4xl font-black text-[#0C4A6E]">Diagram to Tactile</h3>
            <p className="text-xl text-[#0369A1] font-medium">
              Transform diagrams into descriptive tactile representations and audio guides.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('welcome')}
              className="px-6 py-3 bg-[#0369A1] text-white font-bold rounded-xl text-lg hover:bg-[#075985]"
            >
              Back to Overview
            </button>
          </div>
        )}

        {/* State C: Note Taker */}
        {selectedCategory === 'note_taker' && (
          <div className="w-full h-full flex flex-col animate-fadeIn">
            <BrailleNoteTaker
              onBack={() => {
                triggerHaptic('light');
                setSelectedCategory('welcome');
                voiceFeedback.speak('Returning to overview');
              }}
            />
          </div>
        )}

        {/* State D: Audio Learning */}
        {selectedCategory === 'audio_learning' && (
          <div className="w-full h-full flex flex-col animate-fadeIn">
            <AudioLearningSection
              onBack={() => {
                triggerHaptic('light');
                setSelectedCategory('welcome');
                voiceFeedback.speak('Returning to overview');
              }}
            />
          </div>
        )}

        {/* State E: Touch to Concept */}
        {selectedCategory === 'touch_to_concept' && (
          <div className="w-full max-w-2xl text-center space-y-6 animate-fadeIn py-8">
            <h3 className="text-3xl sm:text-4xl font-black text-[#0C4A6E]">Touch-to-Concept</h3>
            <p className="text-xl text-[#0369A1] font-medium">
              Explore scientific, mathematical, and spatial ideas through haptic-guided touch feedback.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('welcome')}
              className="px-6 py-3 bg-[#0369A1] text-white font-bold rounded-xl text-lg hover:bg-[#075985]"
            >
              Back to Overview
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

