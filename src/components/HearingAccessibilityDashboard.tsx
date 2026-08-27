import React, { useState, useEffect } from 'react';
import {
  FileText,
  Hand,
  ArrowLeft,
  X,
  Menu,
  Eye
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { VideoTranscriptionWorkspace } from './VideoTranscriptionWorkspace';
import { ISLTextTranslator } from './ISLTextTranslator';
import { useLumi } from '../context/LumiContext';

export type HearingCategory = 'welcome' | 'isl_translator' | 'transcription';

interface HearingAccessibilityDashboardProps {
  onBackToPreferences?: () => void;
}

export const HearingAccessibilityDashboard: React.FC<HearingAccessibilityDashboardProps> = ({
  onBackToPreferences,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HearingCategory>('isl_translator');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const { updateAppContext } = useLumi();

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
        triggerHaptic('light');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen]);

  // Sync category changes to global Lumi context
  useEffect(() => {
    if (selectedCategory === 'isl_translator') {
      updateAppContext({
        mode: 'hearing_accessibility',
        featureId: 'isl_translator',
        featureName: 'ISL Text Translator',
        pageTitle: 'ISL Document & Lesson Translation',
        suggestedPrompts: [
          'Explain how ISL sentence structure differs from English.',
          'What are the core handshapes used in Indian Sign Language?',
          'How do non-manual markers and facial expressions work in ISL?'
        ]
      });
    } else if (selectedCategory === 'transcription') {
      updateAppContext({
        mode: 'hearing_accessibility',
        featureId: 'video_transcription',
        featureName: 'Video & Mic Transcription Studio',
        pageTitle: 'Lecture Transcription Studio',
        suggestedPrompts: [
          'Summarize the current video transcription.',
          'Identify key scientific terms in this lecture transcript.',
          'Generate a 3-question quiz from this transcription.'
        ]
      });
    } else {
      updateAppContext({
        mode: 'hearing_accessibility',
        featureId: 'overview',
        featureName: 'Hearing Accessibility Hub',
        pageTitle: 'Alta Hearing Learning Portal',
        suggestedPrompts: [
          'How does the ISL Text Translator work?',
          'How do I upload lecture videos for transcription?',
          'What features are available in Hearing Accessibility mode?'
        ]
      });
    }
  }, [selectedCategory, updateAppContext]);

  // Category selection handler
  const handleSelectCategory = (cat: HearingCategory) => {
    triggerHaptic('selection');
    setSelectedCategory(cat);
    setIsMobileDrawerOpen(false);
  };

  const handleBrandClick = () => {
    triggerHaptic('light');
    setSelectedCategory('welcome');
    setIsMobileDrawerOpen(false);
  };

  const toggleDesktopSidebar = () => {
    triggerHaptic('selection');
    setIsSidebarExpanded((prev) => !prev);
  };

  const toggleMobileDrawer = () => {
    triggerHaptic('selection');
    setIsMobileDrawerOpen((prev) => !prev);
  };

  return (
    <div
      id="hearing-accessibility-dashboard"
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
            <span className="block text-[11px] font-bold text-[#0C4A6E] -mt-1">Hearing Mode</span>
          </button>
        </div>

        {onBackToPreferences && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
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
            id="mobile-drawer-backdrop-hearing"
            onClick={() => {
              setIsMobileDrawerOpen(false);
              triggerHaptic('light');
            }}
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
            aria-hidden="true"
          />

          <aside
            id="mobile-drawer-sidebar-hearing"
            role="navigation"
            aria-label="Mobile hearing learning categories"
            className="md:hidden fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-white border-r-4 border-[#0369A1] p-5 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#BAE6FD]">
                <div>
                  <h1 className="text-2xl font-black tracking-widest text-[#0369A1]">ALTA</h1>
                  <p className="text-xs font-bold text-[#0C4A6E]">Hearing Accessibility</p>
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
              <nav className="space-y-2.5" aria-label="Mobile hearing categories">
                <button
                  type="button"
                  onClick={() => handleSelectCategory('isl_translator')}
                  className={`w-full min-h-[50px] px-4 py-3 rounded-2xl font-bold text-base text-left flex items-center justify-between transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] ${
                    selectedCategory === 'isl_translator'
                      ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Hand className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">ISL Text Translator</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedCategory === 'isl_translator' ? 'bg-white text-[#0369A1]' : 'bg-[#E0F2FE] text-[#0369A1]'
                  }`}>
                    Gemini
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCategory('transcription')}
                  className={`w-full min-h-[50px] px-4 py-3 rounded-2xl font-bold text-base text-left flex items-center gap-3 transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] ${
                    selectedCategory === 'transcription'
                      ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md'
                      : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <FileText className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Transcription</span>
                </button>
              </nav>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t-2 border-[#BAE6FD]/60 flex items-center justify-between text-xs font-bold text-[#0369A1]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 shrink-0 text-[#0284C7]" />
                <span>Visual Mode</span>
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
        aria-label="Hearing learning categories"
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
                  Hearing Accessibility
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
            {/* Button 1: ISL Text Translator */}
            <button
              type="button"
              id="category-isl-translator"
              onClick={() => handleSelectCategory('isl_translator')}
              title="ISL Text Translator"
              aria-label="ISL Text Translator"
              className={`w-full min-h-[50px] rounded-2xl font-bold transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] flex items-center ${
                isSidebarExpanded ? 'px-4 py-3 text-base justify-between' : 'justify-center p-3'
              } ${
                selectedCategory === 'isl_translator'
                  ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md scale-[1.02]'
                  : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0369A1]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Hand className="w-6 h-6 shrink-0" aria-hidden="true" />
                {isSidebarExpanded && <span className="truncate">ISL Translator</span>}
              </div>
              {isSidebarExpanded && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  selectedCategory === 'isl_translator' ? 'bg-white text-[#0369A1]' : 'bg-[#E0F2FE] text-[#0369A1]'
                }`}>
                  Gemini
                </span>
              )}
            </button>

            {/* Button 2: Media Transcription */}
            <button
              type="button"
              id="category-transcription"
              onClick={() => handleSelectCategory('transcription')}
              title="Media Transcription"
              aria-label="Media Transcription"
              className={`w-full min-h-[50px] rounded-2xl font-bold transition-all border-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] flex items-center ${
                isSidebarExpanded ? 'px-4 py-3 text-base gap-3' : 'justify-center p-3'
              } ${
                selectedCategory === 'transcription'
                  ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-md scale-[1.02]'
                  : 'bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD] hover:bg-[#E0F2FE] hover:border-[#0369A1]'
              }`}
            >
              <FileText className="w-6 h-6 shrink-0" aria-hidden="true" />
              {isSidebarExpanded && <span className="truncate">Media Transcription</span>}
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
                <Eye className="w-3.5 h-3.5 shrink-0 text-[#0284C7]" aria-hidden="true" />
                <span>Visual-First Mode</span>
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

        {/* State A: Main Overview View */}
        {selectedCategory === 'welcome' && (
          <div
            id="central-welcome-container"
            className="w-full max-w-4xl text-center space-y-8 animate-fadeIn"
          >
            <div className="space-y-4">
              <h2
                id="central-welcome-title"
                tabIndex={0}
                onClick={() => triggerHaptic('light')}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0C4A6E] tracking-tight leading-tight focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] rounded-2xl p-2"
              >
                Hearing Accessibility Learning
              </h2>

              <p
                id="central-welcome-subtitle"
                tabIndex={0}
                onClick={() => triggerHaptic('light')}
                className="text-xl sm:text-2xl text-[#0369A1] font-medium leading-relaxed max-w-2xl mx-auto focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] rounded-2xl p-2"
              >
                Convert educational lessons to Indian Sign Language glosses, video demonstrations, and multi-speaker captions.
              </p>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              <button
                onClick={() => handleSelectCategory('isl_translator')}
                className="p-6 bg-white rounded-3xl border-4 border-[#0369A1] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col gap-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0369A1] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <Hand className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0C4A6E]">ISL Text Translator</h3>
                  <p className="text-sm font-medium text-[#0369A1] mt-1">
                    Upload .TXT or .DOCX lesson files to generate ISL grammatical glosses and sequential sign videos.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSelectCategory('transcription')}
                className="p-6 bg-white rounded-3xl border-4 border-[#BAE6FD] hover:border-[#0369A1] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col gap-3 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0C4A6E]">Media Transcription Workspace</h3>
                  <p className="text-sm font-medium text-[#0369A1] mt-1">
                    Upload video and audio files to extract timestamped speech-to-text transcripts, synchronize captions, and export subtitles.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* State A.2: ISL Text Translator */}
        {selectedCategory === 'isl_translator' && (
          <div className="w-full h-full animate-fadeIn">
            <ISLTextTranslator />
          </div>
        )}

        {/* State B: Transcription Feature View with Video & Audio Upload, Synchronized Captions & Live Mic */}
        {selectedCategory === 'transcription' && (
          <div className="w-full max-w-6xl h-full flex flex-col space-y-5 animate-fadeIn">
            {/* Header with Back button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b-2 border-[#BAE6FD]/60">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="back-to-overview-from-transcription"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedCategory('welcome');
                  }}
                  className="px-4 py-2 bg-white hover:bg-[#E0F2FE] text-[#0369A1] font-black rounded-2xl flex items-center gap-2 border-2 border-[#0369A1] shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0C4A6E]">
                    Media Transcription Workspace
                  </h2>
                  <p className="text-sm font-semibold text-[#0369A1]">
                    Video & Audio speech-to-text generation, synchronized captions, search, and subtitle export
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Video & Live Speech Transcription Workspace */}
            <VideoTranscriptionWorkspace />
          </div>
        )}
      </main>
    </div>
  );
};
