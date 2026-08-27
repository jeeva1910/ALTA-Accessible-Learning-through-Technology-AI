import React, { useEffect, useState, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  AlertCircle,
  CheckCircle2,
  VolumeX,
  Repeat
} from 'lucide-react';
import { ISLDictionaryEntry } from '../types/isl';

interface ISLSignVisualPlayerProps {
  signEntry: ISLDictionaryEntry | null;
  keyword: string;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  onEnded?: () => void;
  onPreviousSign?: () => void;
  onNextSign?: () => void;
  hasPreviousSign?: boolean;
  hasNextSign?: boolean;
  playbackSpeed?: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const ISLSignVisualPlayer: React.FC<ISLSignVisualPlayerProps> = ({
  signEntry,
  keyword,
  isPlaying = false,
  onPlayToggle,
  onEnded,
  onPreviousSign,
  onNextSign,
  hasPreviousSign = false,
  hasNextSign = false,
  playbackSpeed = 1.0,
  size = 'md'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const isVideoAvailable = Boolean(signEntry && signEntry.videoAvailable && signEntry.videoUrl);
  const videoUrl = signEntry?.videoUrl;
  const gloss = signEntry?.gloss || keyword.toUpperCase();

  // Handle Fullscreen state change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Sync external playing state with HTML5 Video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoAvailable) return;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay policy or interrupt handling
          console.log('[ISL Video Player] Play prevented or interrupted:', err.message);
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, isVideoAvailable, videoUrl]);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, videoUrl]);

  // Reset video state when URL / sign changes
  useEffect(() => {
    setVideoError(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [videoUrl]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isVideoAvailable || !videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      if (onPlayToggle && !isPlaying) onPlayToggle();
    } else {
      videoRef.current.pause();
      if (onPlayToggle && isPlaying) onPlayToggle();
    }
  };

  const handleRestart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    if (onPlayToggle && !isPlaying) onPlayToggle();
  };

  const handleFullscreenToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const elem = containerRef.current || videoRef.current;
    if (!elem) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const handleVideoEnded = () => {
    if (isLooping && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else {
      if (onEnded) onEnded();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      id={`isl-video-player-${signEntry?.search_key || keyword}`}
      className={`relative w-full rounded-2xl bg-[#082F49] border-2 border-[#0284C7] shadow-lg overflow-hidden flex flex-col transition-all text-white ${
        size === 'hero'
          ? 'min-h-[360px] sm:min-h-[400px] lg:min-h-[450px] aspect-[16/10] sm:aspect-video'
          : size === 'lg'
          ? 'min-h-[320px] aspect-video'
          : 'min-h-[260px]'
      }`}
    >
      {/* Top Header Badge */}
      <div className="px-3.5 py-2 bg-[#0C4A6E] border-b border-[#0369A1] flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black tracking-wider uppercase text-[#BAE6FD]">
            {gloss}
          </span>
          {isVideoAvailable && !videoError ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Real MP4 Dataset
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Sign video unavailable
            </span>
          )}
        </div>

        {/* Video Fullscreen Trigger */}
        <button
          type="button"
          onClick={handleFullscreenToggle}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          className="p-1 rounded-lg bg-[#082F49] hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white border border-[#0369A1] transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Video Display Stage */}
      <div className="relative flex-1 flex items-center justify-center bg-black min-h-[200px] overflow-hidden group">
        {isVideoAvailable && !videoError && videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              preload="auto"
              muted={false}
              onClick={handleTogglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              onError={() => setVideoError(true)}
              className="w-full h-full max-h-[360px] sm:max-h-[400px] lg:max-h-[450px] object-contain cursor-pointer"
            />

            {/* Click-to-Play/Pause Center Overlay (visible on pause or hover) */}
            {(!isPlaying || (videoRef.current && videoRef.current.paused)) && (
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={`Play ${gloss} video`}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#0284C7]/85 hover:bg-[#0284C7] text-white flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 active:scale-95 border-2 border-white/30 cursor-pointer z-10"
              >
                <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
              </button>
            )}
          </>
        ) : (
          /* Sign Video Unavailable Screen (No fake animation) */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3 bg-gradient-to-b from-[#0C4A6E] to-[#082F49]">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-amber-200">
                Sign video unavailable
              </p>
              <p className="text-xs text-[#BAE6FD]/80 max-w-xs">
                No recorded MP4 demonstration exists in the local ISL dataset for "{gloss}".
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Transport Controls Bar */}
      {isVideoAvailable && !videoError && (
        <div className="px-3.5 py-2.5 bg-[#0C4A6E] border-t border-[#0369A1] flex flex-col gap-2 z-20">
          {/* Scrubber Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#BAE6FD]">
              {currentTime.toFixed(1)}s
            </span>
            <div
              onClick={(e) => {
                if (!videoRef.current || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                videoRef.current.currentTime = ratio * duration;
              }}
              className="flex-1 h-2 bg-[#082F49] rounded-full cursor-pointer overflow-hidden border border-[#0369A1]"
            >
              <div
                className="h-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-[#BAE6FD]">
              {duration ? `${duration.toFixed(1)}s` : '0.0s'}
            </span>
          </div>

          {/* Action Buttons: Play, Pause, Restart, Previous, Next, Fullscreen */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1.5">
              {/* Previous Sign Button */}
              {onPreviousSign && (
                <button
                  type="button"
                  onClick={onPreviousSign}
                  disabled={!hasPreviousSign}
                  title="Previous Sign"
                  className="p-1.5 rounded-lg bg-[#082F49] hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white border border-[#0369A1] disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Play / Pause */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              {/* Restart */}
              <button
                type="button"
                onClick={handleRestart}
                title="Restart Video"
                className="p-1.5 rounded-lg bg-[#082F49] hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white border border-[#0369A1] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Next Sign Button */}
              {onNextSign && (
                <button
                  type="button"
                  onClick={onNextSign}
                  disabled={!hasNextSign}
                  title="Next Sign"
                  className="p-1.5 rounded-lg bg-[#082F49] hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white border border-[#0369A1] disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Loop Toggle */}
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                title={isLooping ? 'Looping enabled' : 'Looping disabled'}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLooping
                    ? 'bg-[#0284C7] text-white border-[#38BDF8]'
                    : 'bg-[#082F49] text-[#64748B] border-[#0369A1]'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#BAE6FD] bg-[#082F49] px-2 py-0.5 rounded border border-[#0369A1]">
                {playbackSpeed}x
              </span>
              <button
                type="button"
                onClick={handleFullscreenToggle}
                title="Browser Fullscreen"
                className="p-1.5 rounded-lg bg-[#082F49] hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white border border-[#0369A1] transition-colors cursor-pointer"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
