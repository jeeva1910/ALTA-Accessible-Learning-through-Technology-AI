/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { PreferencePage } from './components/PreferencePage';
import { VisualAccessibilityDashboard } from './components/VisualAccessibilityDashboard';
import { HearingAccessibilityDashboard } from './components/HearingAccessibilityDashboard';
import { GlobalLumiAssistant } from './components/GlobalLumiAssistant';
import { LumiProvider, useLumi } from './context/LumiContext';
import { voiceFeedback } from './utils/speech';
import { Volume2 } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<
    'login' | 'preference' | 'visual_dashboard' | 'hearing_dashboard'
  >('login');
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  const { isOpen: isLumiAssistantOpen, updateAppContext } = useLumi();

  useEffect(() => {
    // Listen for speech events to provide visual subtitles
    voiceFeedback.onSpeech((text) => {
      setLiveAnnouncement(text);
    });

    // Only announce if starting on login or visual page
    if (currentPage !== 'hearing_dashboard') {
      const timer = setTimeout(() => {
        voiceFeedback.speak('Welcome to ALTA Accessible Learning.');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Sync mode changes to global Lumi context
  useEffect(() => {
    if (currentPage === 'visual_dashboard') {
      updateAppContext({
        mode: 'visual_accessibility',
        featureId: 'overview',
        featureName: 'Visual Accessibility Hub',
        pageTitle: 'Alta Visual Learning Portal',
      });
    } else if (currentPage === 'hearing_dashboard') {
      updateAppContext({
        mode: 'hearing_accessibility',
        featureId: 'overview',
        featureName: 'Hearing Accessibility Hub',
        pageTitle: 'Alta Hearing Learning Portal',
      });
    } else {
      updateAppContext({
        mode: 'general',
        featureId: 'general',
        featureName: 'Accessible Learning Portal',
        pageTitle: 'Alta Portal',
      });
    }
  }, [currentPage, updateAppContext]);

  const handleLogin = () => {
    setCurrentPage('preference');
    voiceFeedback.speak('Choose your learning mode');
  };

  const handleSelectMode = (mode: 'visual_accessibility' | 'hearing_accessibility') => {
    if (mode === 'visual_accessibility') {
      setCurrentPage('visual_dashboard');
      voiceFeedback.speak('Welcome to Visual Accessibility Learning Dashboard');
    } else {
      voiceFeedback.cancel(); // Stop any pending speech
      setCurrentPage('hearing_dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F0F9FF] text-[#0C4A6E] font-sans selection:bg-[#BAE6FD] flex flex-row">
      {/* Global "Hey Lumi" Voice & AI Learning Assistant (Floating Bottom-Right) */}
      <GlobalLumiAssistant />

      {/* Main Application Canvas */}
      <div className="flex-1 min-w-0">
        {/* Live Voice Announcement Banner (Only show when not on hearing_dashboard) */}
        {currentPage !== 'hearing_dashboard' && (
          <aside
            id="live-voice-announcement-bar"
            aria-live="assertive"
            aria-atomic="true"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[90%] sm:w-auto px-5 py-2.5 bg-[#0C4A6E] text-white text-sm sm:text-base font-bold rounded-full shadow-2xl flex items-center justify-center gap-2.5 border-2 border-[#0EA5E9] transition-all pointer-events-none"
          >
            <Volume2 className="w-5 h-5 text-[#BAE6FD] animate-pulse flex-shrink-0" aria-hidden="true" />
            <span className="truncate">
              Voice: {liveAnnouncement || 'Touch any element to hear speech'}
            </span>
          </aside>
        )}

        {/* Pages */}
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        {currentPage === 'preference' && <PreferencePage onSelectMode={handleSelectMode} />}
        {currentPage === 'visual_dashboard' && (
          <VisualAccessibilityDashboard
            onBackToPreferences={() => setCurrentPage('preference')}
          />
        )}
        {currentPage === 'hearing_dashboard' && (
          <HearingAccessibilityDashboard
            onBackToPreferences={() => setCurrentPage('preference')}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LumiProvider>
      <AppContent />
    </LumiProvider>
  );
}
