import React, { useState } from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { voiceFeedback } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';

type LearningMode = 'visual_accessibility' | 'hearing_accessibility' | null;

interface PreferencePageProps {
  onSelectMode?: (mode: 'visual_accessibility' | 'hearing_accessibility') => void;
}

export const PreferencePage: React.FC<PreferencePageProps> = ({ onSelectMode }) => {
  const [selectedMode, setSelectedMode] = useState<LearningMode>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleHeadingTrigger = () => {
    triggerHaptic('light');
    voiceFeedback.speak('Choose Your Learning Mode');
  };

  const handleSubtextTrigger = () => {
    triggerHaptic('light');
    voiceFeedback.speak('Select an option to personalize your learning experience');
  };

  const handleSelectVisual = () => {
    triggerHaptic('selection');
    setSelectedMode('visual_accessibility');
    setIsConfirmed(false);
    voiceFeedback.speak('Visual Accessibility selected');
  };

  const handleSelectHearing = () => {
    triggerHaptic('selection');
    setSelectedMode('hearing_accessibility');
    setIsConfirmed(false);
    voiceFeedback.speak('Hearing Accessibility selected');
  };

  const handleContinueTouch = () => {
    triggerHaptic('medium');
    voiceFeedback.speak('Continue button');
  };

  const handleContinueClick = () => {
    if (!selectedMode) {
      triggerHaptic('heavy');
      voiceFeedback.speak('Please select a learning mode first');
      return;
    }

    triggerHaptic('success');
    setIsConfirmed(true);
    const modeName =
      selectedMode === 'visual_accessibility'
        ? 'Visual Accessibility mode'
        : 'Hearing Accessibility mode';
    voiceFeedback.speak(`Continue button. ${modeName} confirmed.`);

    if (onSelectMode) {
      setTimeout(() => {
        onSelectMode(selectedMode);
      }, 500);
    }
  };

  return (
    <div
      id="preference-page"
      className="min-h-screen w-full bg-[#F0F9FF] text-[#0C4A6E] font-sans flex flex-col items-center justify-between p-6 sm:p-12 md:p-16 selection:bg-[#BAE6FD]"
    >
      <main
        id="preference-container"
        className="w-full max-w-5xl flex-1 flex flex-col items-center justify-between"
        role="region"
        aria-label="Accessibility preference selection"
      >
        {/* Header Section */}
        <div id="preference-header" className="text-center pt-2 sm:pt-4">
          <h2
            id="preference-title"
            className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0C4A6E] mb-4 tracking-tight cursor-pointer"
            onClick={handleHeadingTrigger}
            onFocus={handleHeadingTrigger}
            onTouchStart={handleHeadingTrigger}
            onMouseEnter={handleHeadingTrigger}
            tabIndex={0}
          >
            Choose Your Learning Mode
          </h2>
          <p
            id="preference-subtitle"
            className="text-xl sm:text-2xl md:text-3xl text-[#0369A1] font-medium max-w-2xl mx-auto cursor-pointer"
            onClick={handleSubtextTrigger}
            onFocus={handleSubtextTrigger}
            onTouchStart={handleSubtextTrigger}
            onMouseEnter={handleSubtextTrigger}
            tabIndex={0}
          >
            Select an option to personalize your learning experience.
          </p>
        </div>

        {/* Exactly TWO Large Selectable Option Cards without eye/ear icons */}
        <div
          id="learning-mode-options"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 w-full my-8 sm:my-12 items-stretch"
          role="radiogroup"
          aria-label="Learning mode choices"
        >
          {/* Card 1: Visual Accessibility */}
          <button
            type="button"
            id="option-visual-accessibility"
            role="radio"
            aria-checked={selectedMode === 'visual_accessibility'}
            onClick={handleSelectVisual}
            onFocus={handleSelectVisual}
            onTouchStart={handleSelectVisual}
            onMouseEnter={handleSelectVisual}
            className={`group bg-white border-4 rounded-[40px] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xl hover:bg-[#E0F2FE] focus:outline-none focus:ring-8 focus:ring-[#BAE6FD] transition-all cursor-pointer relative min-h-[260px] ${
              selectedMode === 'visual_accessibility'
                ? 'border-[#0369A1] bg-[#E0F2FE] ring-8 ring-[#BAE6FD] shadow-2xl scale-[1.02]'
                : 'border-[#0369A1] hover:scale-[1.01]'
            }`}
          >
            {selectedMode === 'visual_accessibility' && (
              <div className="absolute top-6 right-6">
                <CheckCircle2 className="w-8 h-8 text-[#0369A1] fill-[#BAE6FD]" aria-hidden="true" />
              </div>
            )}
            <h3 className="text-3xl sm:text-4xl font-black mb-4 text-[#0369A1] tracking-tight">
              VISUAL ACCESSIBILITY
            </h3>
            <p className="text-lg sm:text-xl text-[#0C4A6E] font-medium leading-relaxed max-w-sm">
              Audio, Braille and accessible diagram support
            </p>
            <div className="mt-8 flex items-center gap-2 text-base font-bold text-[#0369A1] bg-[#BAE6FD]/40 px-4 py-1.5 rounded-full border border-[#0369A1]/30">
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>{selectedMode === 'visual_accessibility' ? 'Selected' : 'Touch to select'}</span>
            </div>
          </button>

          {/* Card 2: Hearing Accessibility */}
          <button
            type="button"
            id="option-hearing-accessibility"
            role="radio"
            aria-checked={selectedMode === 'hearing_accessibility'}
            onClick={handleSelectHearing}
            onFocus={handleSelectHearing}
            onTouchStart={handleSelectHearing}
            onMouseEnter={handleSelectHearing}
            className={`group bg-white border-4 rounded-[40px] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xl hover:bg-[#E0F2FE] focus:outline-none focus:ring-8 focus:ring-[#BAE6FD] transition-all cursor-pointer relative min-h-[260px] ${
              selectedMode === 'hearing_accessibility'
                ? 'border-[#0369A1] bg-[#E0F2FE] ring-8 ring-[#BAE6FD] shadow-2xl scale-[1.02]'
                : 'border-[#0369A1] hover:scale-[1.01]'
            }`}
          >
            {selectedMode === 'hearing_accessibility' && (
              <div className="absolute top-6 right-6">
                <CheckCircle2 className="w-8 h-8 text-[#0369A1] fill-[#BAE6FD]" aria-hidden="true" />
              </div>
            )}
            <h3 className="text-3xl sm:text-4xl font-black mb-4 text-[#0369A1] tracking-tight">
              Hearing Accessibility
            </h3>
            <p className="text-lg sm:text-xl text-[#0C4A6E] font-medium leading-relaxed max-w-sm">
              Captions, transcripts and sign-language support
            </p>
            <div className="mt-8 flex items-center gap-2 text-base font-bold text-[#0369A1] bg-[#BAE6FD]/40 px-4 py-1.5 rounded-full border border-[#0369A1]/30">
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>{selectedMode === 'hearing_accessibility' ? 'Selected' : 'Touch to select'}</span>
            </div>
          </button>
        </div>

        {/* Status Confirmation feedback if confirmed */}
        {isConfirmed && (
          <div
            id="confirmation-banner"
            role="status"
            aria-live="polite"
            className="mb-6 p-4 rounded-2xl bg-white border-4 border-[#0369A1] text-[#0C4A6E] flex items-center gap-3 font-bold text-lg shadow-md"
          >
            <CheckCircle2 className="w-6 h-6 text-[#0369A1] flex-shrink-0" aria-hidden="true" />
            <span>
              {selectedMode === 'visual_accessibility'
                ? 'Visual Accessibility mode configured with audio & braille support.'
                : 'Hearing Accessibility mode configured with captions & transcript support.'}
            </span>
          </div>
        )}

        {/* Tactile Editorial Continue Button */}
        <div id="continue-action-container" className="w-full flex flex-col items-center pt-2">
          <button
            type="button"
            id="continue-button"
            onClick={handleContinueClick}
            onFocus={handleContinueTouch}
            onTouchStart={handleContinueTouch}
            onMouseEnter={handleContinueTouch}
            aria-label="Continue button"
            className="w-full max-w-md h-24 bg-[#0369A1] text-white text-3xl font-black rounded-2xl hover:bg-[#075985] active:scale-95 transition-transform border-b-8 border-[#083344] focus:outline-none focus:ring-8 focus:ring-[#BAE6FD] flex items-center justify-center gap-3 cursor-pointer shadow-lg tracking-wide"
          >
            <span>CONTINUE</span>
            <Volume2 className="w-7 h-7 text-[#BAE6FD]" aria-hidden="true" />
          </button>

          {/* Touch voice hint */}
          <p className="mt-4 text-[#0369A1] text-sm sm:text-base font-semibold flex items-center gap-2">
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>Touch or focus on any element for voice & haptic feedback.</span>
          </p>
        </div>
      </main>
    </div>
  );
};
