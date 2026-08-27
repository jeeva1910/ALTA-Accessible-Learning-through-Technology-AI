import React from 'react';
import { Play, Pause, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { ISLSignToken, ISLDictionaryEntry } from '../types/isl';
import { ISLSignVisualPlayer } from './ISLSignVisualPlayer';

interface ISLSignVideoCardProps {
  signToken: ISLSignToken;
  dictionaryEntry: ISLDictionaryEntry | null;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onPlayToggle: () => void;
  playbackSpeed: number;
}

export const ISLSignVideoCard: React.FC<ISLSignVideoCardProps> = ({
  signToken,
  dictionaryEntry,
  isActive,
  isPlaying,
  onSelect,
  onPlayToggle,
  playbackSpeed
}) => {
  const isAvailable = Boolean(dictionaryEntry && dictionaryEntry.videoAvailable);

  return (
    <div
      id={`sign-card-${signToken.search_key}`}
      onClick={onSelect}
      className={`group relative rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col bg-white ${
        isActive
          ? 'border-[#0284C7] ring-4 ring-[#BAE6FD] shadow-xl scale-[1.02]'
          : 'border-[#E2E8F0] hover:border-[#38BDF8] hover:shadow-md'
      }`}
    >
      {/* Top Card Header */}
      <div className={`px-3.5 py-2.5 flex items-center justify-between border-b ${
        isActive ? 'bg-[#E0F2FE] border-[#BAE6FD]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-base font-black tracking-wider uppercase font-mono ${
            isActive ? 'text-[#0369A1]' : 'text-[#0F172A]'
          }`}>
            {signToken.word}
          </span>
        </div>

        {isAvailable ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ISL Video Available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Sign video unavailable
          </span>
        )}
      </div>

      {/* Video / Visual Demonstration Canvas */}
      <div className="p-2.5">
        <ISLSignVisualPlayer
          signEntry={dictionaryEntry}
          keyword={signToken.word}
          isPlaying={isActive && isPlaying}
          onPlayToggle={onPlayToggle}
          playbackSpeed={playbackSpeed}
          size="md"
        />
      </div>

      {/* Footer Info / Linguistic Clue */}
      <div className="px-3.5 pb-3 pt-1 flex items-center justify-between text-xs text-[#64748B]">
        {isAvailable ? (
          <div className="flex items-center gap-1.5 text-[#0369A1] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Category: {dictionaryEntry?.category}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-700 font-medium">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Unverified sign token</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
            if (isAvailable) onPlayToggle();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            isAvailable
              ? isActive && isPlaying
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'bg-[#0284C7] text-white hover:bg-[#0369A1] shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isAvailable}
        >
          {isActive && isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Sign</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
