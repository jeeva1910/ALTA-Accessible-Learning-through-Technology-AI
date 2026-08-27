import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Upload,
  Search,
  Download,
  Copy,
  Check,
  Edit2,
  Sparkles,
  FileText,
  Clock,
  Mic,
  MicOff,
  Radio,
  FileCode,
  ArrowRight,
  Eye,
  Settings2,
  Volume1,
  HelpCircle,
  AlertCircle,
  X,
  Plus,
  Video,
  Music,
  FileAudio,
  BookOpen
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { speechRecognizer } from '../utils/speechRecognition';
import { useLumi } from '../context/LumiContext';
import { extractMediaAudioData } from '../utils/audioExtractor';

export interface TranscriptSegment {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  speaker: string;
  text: string;
  soundCue?: string;
}

export interface LectureSample {
  id: string;
  title: string;
  subject: string;
  duration: number;
  segments: TranscriptSegment[];
}

const SAMPLE_LECTURES: LectureSample[] = [
  {
    id: 'phys-101',
    title: "Newton's Laws of Motion & Inertia",
    subject: "Physics",
    duration: 65,
    segments: [
      {
        id: 's1',
        start: 0,
        end: 11,
        speaker: 'Prof. Miller (Physics)',
        text: 'Good morning class. Today we begin our module on classical mechanics, specifically examining Newton’s First Law of Motion: the law of inertia.',
        soundCue: 'Slide Transition'
      },
      {
        id: 's2',
        start: 11,
        end: 22,
        speaker: 'Prof. Miller (Physics)',
        text: 'An object at rest stays at rest, and an object in uniform motion stays in motion with the exact same speed and direction unless acted upon by an unbalanced net external force.',
        soundCue: 'Chalkboard Writing'
      },
      {
        id: 's3',
        start: 22,
        end: 33,
        speaker: 'Alex (Student Question)',
        text: 'Professor Miller, how does frictional resistance on a horizontal plane change this ideal theoretical state of perpetual motion?',
        soundCue: 'Hand Raised'
      },
      {
        id: 's4',
        start: 33,
        end: 45,
        speaker: 'Prof. Miller (Physics)',
        text: 'Excellent observation Alex. Friction is precisely the opposing net external force that continuously dissipates kinetic energy into thermal energy.',
        soundCue: 'Diagram Highlighted'
      },
      {
        id: 's5',
        start: 45,
        end: 55,
        speaker: 'Prof. Miller (Physics)',
        text: 'Notice that mass is the direct quantitative measure of inertia: a higher mass requires a proportionally larger force to alter its velocity.',
        soundCue: 'Animation Cue'
      },
      {
        id: 's6',
        start: 55,
        end: 65,
        speaker: 'Prof. Miller (Physics)',
        text: 'In our next session, we will compute net force vectors in multi-body mechanical systems with free-body diagrams.',
        soundCue: 'Bell Ring'
      }
    ]
  },
  {
    id: 'bio-201',
    title: 'Photosynthesis & Chloroplast Ultrastructure',
    subject: 'Biology',
    duration: 60,
    segments: [
      {
        id: 'b1',
        start: 0,
        end: 10,
        speaker: 'Dr. Alvarez (Biology)',
        text: 'Welcome back everyone. Today we examine the light-dependent reactions occurring within the thylakoid membranes of plant chloroplasts.',
        soundCue: 'Microscope View'
      },
      {
        id: 'b2',
        start: 10,
        end: 22,
        speaker: 'Dr. Alvarez (Biology)',
        text: 'When photons strike chlorophyll pigments in Photosystem II, electrons are excited and transferred along the electron transport chain, splitting water molecules.',
        soundCue: 'Electron Flow Diagram'
      },
      {
        id: 'b3',
        start: 22,
        end: 34,
        speaker: 'Maya (Student Question)',
        text: 'Does oxygen release occur directly as a byproduct during this photolysis step inside the thylakoid lumen?',
        soundCue: 'Student Question'
      },
      {
        id: 'b4',
        start: 34,
        end: 46,
        speaker: 'Dr. Alvarez (Biology)',
        text: 'Precisely Maya! Oxygen is released into the atmosphere, while the established proton gradient drives ATP synthase to produce ATP.',
        soundCue: 'Molecular Animation'
      },
      {
        id: 'b5',
        start: 46,
        end: 60,
        speaker: 'Dr. Alvarez (Biology)',
        text: 'In the stroma, the Calvin Cycle then utilizes this ATP and NADPH to fix carbon dioxide into glucose precursors.',
        soundCue: 'Chime'
      }
    ]
  },
  {
    id: 'cs-301',
    title: 'Divide & Conquer: Merge Sort Analysis',
    subject: 'Computer Science',
    duration: 55,
    segments: [
      {
        id: 'c1',
        start: 0,
        end: 12,
        speaker: 'Prof. Chen (Computer Science)',
        text: 'Today we analyze recursive divide-and-conquer algorithms, focusing on the mathematical asymptotic proof of Merge Sort.',
        soundCue: 'Terminal Output'
      },
      {
        id: 'c2',
        start: 12,
        end: 24,
        speaker: 'Prof. Chen (Computer Science)',
        text: 'Merge Sort divides an array of size n into two halves of size n/2, recursively sorts both halves, and then merges them in linear time O(n).',
        soundCue: 'Recursion Tree Graph'
      },
      {
        id: 'c3',
        start: 24,
        end: 36,
        speaker: 'David (Student Question)',
        text: 'Why does Merge Sort guarantee O(n log n) worst-case time complexity, unlike standard Quicksort with bad pivot choices?',
        soundCue: 'Code Highlight'
      },
      {
        id: 'c4',
        start: 36,
        end: 48,
        speaker: 'Prof. Chen (Computer Science)',
        text: 'Because the recursion tree depth is strictly bounded by log2(n), and each recursion level processes all n elements during the merge phase.',
        soundCue: 'Formula Highlight'
      },
      {
        id: 'c5',
        start: 48,
        end: 55,
        speaker: 'Prof. Chen (Computer Science)',
        text: 'The primary tradeoff is that Merge Sort requires O(n) auxiliary memory space to store temporary merged arrays.',
        soundCue: 'Summary Slide'
      }
    ]
  }
];

export type WorkspaceSourceMode = 'upload_video' | 'upload_audio' | 'sample' | 'live_mic';
export type MediaType = 'video' | 'audio';

export const MediaTranscriptionWorkspace: React.FC = () => {
  // Main Source Mode: 'upload_video' | 'upload_audio' | 'sample' | 'live_mic'
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceSourceMode>('sample');

  // Selected Sample
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_LECTURES[0].id);

  // Uploaded Media State
  const [uploadedMediaFile, setUploadedMediaFile] = useState<File | null>(null);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<MediaType | null>(null);

  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatusText, setUploadStatusText] = useState<string>('Processing Media Audio...');
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  // Active Lecture Metadata & Segments
  const [currentTitle, setCurrentTitle] = useState<string>(SAMPLE_LECTURES[0].title);
  const [currentSubject, setCurrentSubject] = useState<string>(SAMPLE_LECTURES[0].subject);
  const [duration, setDuration] = useState<number>(SAMPLE_LECTURES[0].duration);
  const [segments, setSegments] = useState<TranscriptSegment[]>(SAMPLE_LECTURES[0].segments);

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [showCaptionsOnPlayer, setShowCaptionsOnPlayer] = useState<boolean>(true);

  // Live Microphone State
  const [isLiveListening, setIsLiveListening] = useState<boolean>(false);
  const [interimLiveText, setInterimLiveText] = useState<string>('');
  const [liveSessionElapsed, setLiveSessionElapsed] = useState<number>(0);
  const [liveSpeakerName, setLiveSpeakerName] = useState<string>('Teacher / Speaker');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSpeaker, setFilterSpeaker] = useState<string>('all');

  // Editing Segment State
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [editSoundCue, setEditSoundCue] = useState<string>('');

  // UI Accessibility Preferences
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('large');
  const [autoScrollTranscript, setAutoScrollTranscript] = useState<boolean>(true);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const simulationTimerRef = useRef<any>(null);
  const liveTimerRef = useRef<any>(null);
  const transcriptScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeSegmentCardRef = useRef<HTMLDivElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);

  const { openLumi, updateAppContext } = useLumi();

  // Format seconds to mm:ss
  const formatTime = (secs: number): string => {
    const safeSecs = Math.max(0, Math.floor(secs));
    const m = Math.floor(safeSecs / 60);
    const s = safeSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Format seconds to SRT timestamp: 00:00:00,000
  const formatSrtTime = (secs: number): string => {
    const totalMs = Math.floor(secs * 1000);
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  // Load sample lecture when selection changes
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_LECTURES.find((s) => s.id === sampleId);
    if (!found) return;

    triggerHaptic('selection');
    setSelectedSampleId(sampleId);
    setWorkspaceMode('sample');
    setUploadedMediaType(null);
    setCurrentTitle(found.title);
    setCurrentSubject(found.subject);
    setDuration(found.duration);
    setSegments(found.segments);
    setCurrentTime(0);
    setIsPlaying(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  // Switch to Live Microphone Transcription mode
  const handleStartLiveMicMode = async () => {
    triggerHaptic('medium');
    setMicErrorMessage(null);

    // Stop sample or media playback if running
    if (isPlaying) {
      setIsPlaying(false);
      if (videoRef.current) videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
    }

    setWorkspaceMode('live_mic');
    setUploadedMediaType(null);
    setCurrentTitle('Live Microphone Lecture Transcription');
    setCurrentSubject('Live Classroom');
    setLiveSessionElapsed(0);
    setInterimLiveText('');

    // If starting fresh live session without previous live segments, initialize with prompt
    setSegments((prev) => {
      if (workspaceMode !== 'live_mic') {
        return [
          {
            id: `live_${Date.now()}`,
            start: 0,
            end: 0,
            speaker: 'System',
            text: 'Live transcription initialized. Speak clearly into the microphone...',
            soundCue: 'Mic Activated'
          }
        ];
      }
      return prev;
    });

    // Check microphone permissions
    const permResult = await speechRecognizer.requestMicrophonePermission();
    if (!permResult.granted) {
      setMicErrorMessage(permResult.error || 'Microphone access was denied. Please check your browser settings.');
      return;
    }

    // Start continuous live recognition
    const sessionStartTime = Date.now();
    let currentSegmentStartTime = 0;

    const started = speechRecognizer.startContinuous({
      onInterimText: (interim) => {
        setInterimLiveText(interim);
      },
      onFinalSegment: (finalText) => {
        if (!finalText.trim()) return;

        const currentSec = Math.floor((Date.now() - sessionStartTime) / 1000);
        const startSec = currentSegmentStartTime;
        const endSec = Math.max(startSec + 2, currentSec);
        currentSegmentStartTime = endSec;

        const newSeg: TranscriptSegment = {
          id: `live_seg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          start: startSec,
          end: endSec,
          speaker: liveSpeakerName || 'Live Speaker',
          text: finalText.trim(),
          soundCue: 'Voice Captured'
        };

        setSegments((prev) => [...prev.filter((s) => s.speaker !== 'System'), newSeg]);
        setDuration((prev) => Math.max(prev, endSec));
        triggerHaptic('light');
      },
      onStateChange: (listening) => {
        setIsLiveListening(listening);
      },
      onError: (errStr, isFatal) => {
        setMicErrorMessage(errStr);
        if (isFatal) {
          setIsLiveListening(false);
        }
      }
    });

    if (started) {
      setIsLiveListening(true);
      triggerHaptic('success');
    }
  };

  // Stop Live Microphone transcription
  const handleStopLiveMic = () => {
    triggerHaptic('medium');
    speechRecognizer.stop();
    setIsLiveListening(false);
    setInterimLiveText('');
  };

  // Live Microphone Session Timer
  useEffect(() => {
    if (isLiveListening) {
      liveTimerRef.current = setInterval(() => {
        setLiveSessionElapsed((prev) => prev + 1);
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    }
    return () => {
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    };
  }, [isLiveListening]);

  // Synthetic timer for Sample Presentation when playing
  useEffect(() => {
    if (isPlaying && (workspaceMode === 'sample' || (!uploadedMediaUrl && workspaceMode !== 'live_mic'))) {
      simulationTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.25 * playbackSpeed;
        });
      }, 250);
    } else {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    }
    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [isPlaying, duration, playbackSpeed, uploadedMediaUrl, workspaceMode]);

  // ----------------------------------------------------
  // UNIFIED FILE UPLOAD HANDLER (VIDEO & AUDIO)
  // ----------------------------------------------------
  const handleMediaUpload = async (file: File, type: MediaType) => {
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();
    setUploadErrorMessage(null);

    // Validate Audio Format
    if (type === 'audio') {
      const isAudioExt =
        fileNameLower.endsWith('.mp3') ||
        fileNameLower.endsWith('.wav') ||
        fileNameLower.endsWith('.m4a') ||
        fileNameLower.endsWith('.ogg') ||
        fileNameLower.endsWith('.webm') ||
        file.type.startsWith('audio/');

      if (!isAudioExt) {
        setUploadErrorMessage('Unsupported audio format. Please upload an MP3, WAV, M4A, OGG, or WEBM audio file.');
        triggerHaptic('error');
        return;
      }
    }

    // Validate Video Format
    if (type === 'video') {
      const isVideoExt =
        fileNameLower.endsWith('.mp4') ||
        fileNameLower.endsWith('.webm') ||
        fileNameLower.endsWith('.mov') ||
        fileNameLower.endsWith('.mkv') ||
        file.type.startsWith('video/');

      if (!isVideoExt) {
        setUploadErrorMessage('Unsupported video format. Please upload an MP4, WEBM, MOV, or MKV video file.');
        triggerHaptic('error');
        return;
      }
    }

    triggerHaptic('medium');
    setUploadedMediaFile(file);
    setUploadedMediaType(type);
    const mediaBlobUrl = URL.createObjectURL(file);
    setUploadedMediaUrl(mediaBlobUrl);
    setWorkspaceMode(type === 'video' ? 'upload_video' : 'upload_audio');
    setCurrentTitle(file.name);
    setCurrentSubject(type === 'video' ? 'Video Lecture' : 'Audio Recording');
    setCurrentTime(0);
    setIsPlaying(false);
    setIsProcessingUpload(true);
    setUploadProgress(15);
    setUploadStatusText(`Extracting audio stream from ${type === 'video' ? 'video' : 'audio'} file...`);

    const processAudioAndTranscribe = async (mediaDuration: number) => {
      try {
        setUploadProgress(35);
        setUploadStatusText('Decoding & optimizing audio track for high-accuracy STT...');

        const audioData = await extractMediaAudioData(file);

        setUploadProgress(65);
        setUploadStatusText(`Transcribing verbatim speech via AI speech engine...`);

        const response = await fetch('/api/media-transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name,
            mediaType: type,
            duration: mediaDuration,
            mediaBase64: audioData.base64,
            mimeType: audioData.mimeType,
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.segments && Array.isArray(data.segments) && data.segments.length > 0) {
            setSegments(data.segments);
            if (data.title) setCurrentTitle(data.title);
            if (data.duration) setDuration(Number(data.duration));
            setUploadErrorMessage(null);
            triggerHaptic('success');
          } else {
            setSegments([]);
            setUploadErrorMessage(
              type === 'audio'
                ? 'Unable to detect any spoken audio in this audio file. Please check that the recording contains clear audible speech.'
                : 'Unable to detect any spoken audio in this video. Please check that the video contains an audible voice track.'
            );
            triggerHaptic('error');
          }
        } else {
          let errorMsg =
            type === 'audio'
              ? 'Unable to transcribe the audio from this file. Please check that it contains clear audible speech.'
              : 'Unable to transcribe the audio from this video. Please check that the video contains an audible voice track.';
          try {
            const errData = await response.json();
            if (errData?.error) errorMsg = errData.error;
          } catch {
            // Ignore json parse error
          }
          setSegments([]);
          setUploadErrorMessage(errorMsg);
          triggerHaptic('error');
        }
      } catch (err: any) {
        console.error('Media audio transcription failed:', err);
        setSegments([]);
        setUploadErrorMessage(
          err?.message ||
            (type === 'audio'
              ? 'Unable to transcribe this audio file. Please check that the recording contains clear audible speech.'
              : 'Unable to transcribe this video. Please check that it contains a clear audio track.')
        );
        triggerHaptic('error');
      } finally {
        setUploadProgress(100);
        setTimeout(() => setIsProcessingUpload(false), 500);
      }
    };

    // Determine duration based on media type
    if (type === 'video') {
      const tempVideo = document.createElement('video');
      tempVideo.src = mediaBlobUrl;
      tempVideo.onloadedmetadata = () => {
        const vidDuration = Math.max(5, Math.floor(tempVideo.duration || 60));
        setDuration(vidDuration);
        processAudioAndTranscribe(vidDuration);
      };
      tempVideo.onerror = () => {
        const fallbackDur = 60;
        setDuration(fallbackDur);
        processAudioAndTranscribe(fallbackDur);
      };
    } else {
      const tempAudio = document.createElement('audio');
      tempAudio.src = mediaBlobUrl;
      tempAudio.onloadedmetadata = () => {
        const audDuration = Math.max(5, Math.floor(tempAudio.duration || 60));
        setDuration(audDuration);
        processAudioAndTranscribe(audDuration);
      };
      tempAudio.onerror = () => {
        const fallbackDur = 60;
        setDuration(fallbackDur);
        processAudioAndTranscribe(fallbackDur);
      };
    }
  };

  // Active transcript segment based on currentTime
  const activeSegment = useMemo(() => {
    return segments.find((seg) => currentTime >= seg.start && currentTime < seg.end) || null;
  }, [segments, currentTime]);

  // Auto-scroll transcript container to active segment
  useEffect(() => {
    if (autoScrollTranscript && activeSegmentCardRef.current && transcriptScrollContainerRef.current) {
      activeSegmentCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeSegment, autoScrollTranscript]);

  // Synchronize Lumi Context with current lecture & transcript
  useEffect(() => {
    const activeText = activeSegment ? `[${activeSegment.speaker} at ${formatTime(activeSegment.start)}]: "${activeSegment.text}"` : '';
    const fullTranscriptSummary = segments.map((s) => `[${formatTime(s.start)} - ${s.speaker}]: ${s.text}`).join('\n');

    updateAppContext({
      mode: 'hearing_accessibility',
      featureId: 'video_transcription',
      featureName: 'Media & Speech Transcription Studio',
      pageTitle: currentTitle,
      activeSelection: activeText,
      screenContent: `MEDIA SOURCE: ${currentTitle} (${currentSubject}, Type: ${uploadedMediaType || 'Sample/Live'}, Duration: ${formatTime(duration)})\nCURRENT TIME: ${formatTime(currentTime)}\nACTIVE LINE: ${activeText}\n\nFULL TRANSCRIPT:\n${fullTranscriptSummary}`,
      suggestedPrompts: [
        `Summarize the key takeaways in "${currentTitle}"`,
        `Explain the concept discussed at ${formatTime(currentTime)}: "${activeSegment?.text || ''}"`,
        `Generate a 3-question quiz from this transcription`,
        `Extract the main educational concepts from this transcript`
      ]
    });
  }, [currentTitle, currentSubject, duration, currentTime, activeSegment, segments, uploadedMediaType, updateAppContext]);

  // Play / Pause toggle
  const togglePlayPause = () => {
    triggerHaptic('selection');
    if (uploadedMediaType === 'video' && uploadedMediaUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else if (uploadedMediaType === 'audio' && uploadedMediaUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // Seek media and time to specific segment
  const seekToSegment = (seg: TranscriptSegment) => {
    triggerHaptic('light');
    setCurrentTime(seg.start);

    if (uploadedMediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = seg.start;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else if (uploadedMediaType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = seg.start;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  // Jump seconds forward or backward
  const handleJumpTime = (offset: number) => {
    triggerHaptic('light');
    const newTime = Math.max(0, Math.min(duration, currentTime + offset));
    setCurrentTime(newTime);

    if (uploadedMediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    if (uploadedMediaType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Edit Segment Handlers
  const handleStartEdit = (seg: TranscriptSegment) => {
    triggerHaptic('light');
    setEditingSegmentId(seg.id);
    setEditText(seg.text);
    setEditSoundCue(seg.soundCue || '');
  };

  const handleSaveEdit = (segId: string) => {
    if (!editText.trim()) return;
    triggerHaptic('success');
    setSegments((prev) =>
      prev.map((s) => (s.id === segId ? { ...s, text: editText.trim(), soundCue: editSoundCue.trim() || undefined } : s))
    );
    setEditingSegmentId(null);
  };

  const handleCancelEdit = () => {
    triggerHaptic('light');
    setEditingSegmentId(null);
  };

  // Add new blank segment manually
  const handleAddManualSegment = () => {
    triggerHaptic('medium');
    const lastSeg = segments[segments.length - 1];
    const newStart = lastSeg ? lastSeg.end : Math.floor(currentTime);
    const newEnd = newStart + 8;
    const newSeg: TranscriptSegment = {
      id: `seg_${Date.now()}`,
      start: newStart,
      end: newEnd,
      speaker: 'Speaker 1',
      text: 'New transcript dialogue line...',
      soundCue: undefined
    };
    setSegments((prev) => [...prev, newSeg]);
    setDuration((prev) => Math.max(prev, newEnd));
    handleStartEdit(newSeg);
  };

  // Export handlers
  const handleDownloadTxt = () => {
    triggerHaptic('medium');
    let content = `ALTA ACCESSIBLE TRANSCRIPTION REPORT\n`;
    content += `====================================\n`;
    content += `Title: ${currentTitle}\n`;
    content += `Type: ${uploadedMediaType === 'audio' ? 'Audio File' : uploadedMediaType === 'video' ? 'Video File' : 'Lecture Presentation'}\n`;
    content += `Subject: ${currentSubject}\n`;
    content += `Total Duration: ${formatTime(duration)}\n`;
    content += `Export Date: ${new Date().toLocaleString()}\n`;
    content += `====================================\n\n`;

    segments.forEach((seg) => {
      const soundTag = seg.soundCue ? ` [${seg.soundCue}]` : '';
      content += `[${formatTime(seg.start)} - ${formatTime(seg.end)}] ${seg.speaker}${soundTag}:\n${seg.text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSrt = () => {
    triggerHaptic('medium');
    let srtContent = '';
    segments.forEach((seg, idx) => {
      const index = idx + 1;
      const startTimeStr = formatSrtTime(seg.start);
      const endTimeStr = formatSrtTime(seg.end);
      const soundTag = seg.soundCue ? ` [${seg.soundCue}]` : '';
      srtContent += `${index}\n${startTimeStr} --> ${endTimeStr}\n${seg.speaker}${soundTag}: ${seg.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    triggerHaptic('success');
    const fullText = segments
      .map((s) => `[${formatTime(s.start)}] ${s.speaker}${s.soundCue ? ` [${s.soundCue}]` : ''}: ${s.text}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Ask Lumi Quick Actions
  const handleAskLumiSummary = () => {
    triggerHaptic('medium');
    openLumi(`Summarize the key educational concepts in this transcript for "${currentTitle}".`);
  };

  // Filtered segments based on search and speaker
  const filteredSegments = useMemo(() => {
    return segments.filter((seg) => {
      const matchSearch =
        !searchQuery.trim() ||
        seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seg.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seg.soundCue && seg.soundCue.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchSpeaker = filterSpeaker === 'all' || seg.speaker === filterSpeaker;
      return matchSearch && matchSpeaker;
    });
  }, [segments, searchQuery, filterSpeaker]);

  // Unique speakers list for filter dropdown
  const uniqueSpeakers = useMemo(() => {
    const set = new Set<string>();
    segments.forEach((s) => set.add(s.speaker));
    return Array.from(set);
  }, [segments]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechRecognizer.stop();
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
      if (uploadedMediaUrl) URL.revokeObjectURL(uploadedMediaUrl);
    };
  }, [uploadedMediaUrl]);

  return (
    <div
      id="media-transcription-workspace"
      className={`w-full flex flex-col space-y-5 rounded-3xl transition-colors ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-transparent text-[#0C4A6E]'
      }`}
    >
      {/* ---------------------------------------------------- */}
      {/* 1. TOP CONTROL BAR: VIDEO | AUDIO | DEMO | LIVE MIC  */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-2 border-[#BAE6FD] rounded-2xl shadow-sm">
        {/* Source Mode Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Upload Video Button */}
          <button
            type="button"
            id="btn-upload-video"
            onClick={() => videoFileInputRef.current?.click()}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              workspaceMode === 'upload_video'
                ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-xs'
                : 'bg-white text-[#0369A1] border-[#BAE6FD] hover:bg-[#E0F2FE]'
            }`}
            title="Upload MP4, WEBM, MOV, MKV video file"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Upload Video</span>
          </button>
          <input
            ref={videoFileInputRef}
            type="file"
            accept="video/*,.mp4,.webm,.mov,.mkv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleMediaUpload(f, 'video');
              e.target.value = '';
            }}
          />

          {/* Upload Audio Button */}
          <button
            type="button"
            id="btn-upload-audio"
            onClick={() => audioFileInputRef.current?.click()}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              workspaceMode === 'upload_audio'
                ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-xs'
                : 'bg-white text-[#0369A1] border-[#BAE6FD] hover:bg-[#E0F2FE]'
            }`}
            title="Upload MP3, WAV, M4A, OGG, WEBM audio file"
          >
            <FileAudio className="w-3.5 h-3.5" />
            <span>Upload Audio</span>
          </button>
          <input
            ref={audioFileInputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.ogg,.webm,audio/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleMediaUpload(f, 'audio');
              e.target.value = '';
            }}
          />

          {/* Demo Lectures Dropdown / Selector */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="btn-demo-lectures"
              onClick={() => {
                if (workspaceMode !== 'sample') {
                  handleSelectSample(selectedSampleId);
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                workspaceMode === 'sample'
                  ? 'bg-[#0369A1] text-white border-[#0369A1] shadow-xs'
                  : 'bg-white text-[#0369A1] border-[#BAE6FD] hover:bg-[#E0F2FE]'
              }`}
              title="Switch to Demo Lecture Samples"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Demo Lectures</span>
            </button>

            {workspaceMode === 'sample' && (
              <select
                value={selectedSampleId}
                onChange={(e) => handleSelectSample(e.target.value)}
                className="px-2 py-2 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs font-bold text-[#0369A1] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
                aria-label="Select Demo Lecture"
              >
                {SAMPLE_LECTURES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.subject})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Live Mic Mode Toggle */}
          <button
            type="button"
            id="btn-live-mic-transcribe"
            onClick={isLiveListening ? handleStopLiveMic : handleStartLiveMicMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isLiveListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : workspaceMode === 'live_mic'
                ? 'bg-[#0369A1] text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Start live speech microphone transcription"
          >
            {isLiveListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isLiveListening ? 'Stop Live Mic' : 'Live Mic Transcribe'}</span>
          </button>
        </div>

        {/* Current Mode Badge & Accessibility Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0369A1] bg-[#F0F9FF] px-3.5 py-1.5 rounded-xl border border-[#BAE6FD]">
            {workspaceMode === 'live_mic'
              ? '● Live Microphone'
              : workspaceMode === 'upload_audio'
              ? '● Audio File'
              : workspaceMode === 'upload_video'
              ? '● Video File'
              : '● Lecture Demo'}
          </span>

          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              highContrast ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white text-neutral-600 border-[#BAE6FD]'
            }`}
            title="Toggle High Contrast"
            aria-label="Toggle High Contrast"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mic Error Notice */}
      {micErrorMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Microphone Error</p>
            <p className="text-xs mt-0.5">{micErrorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setMicErrorMessage(null)}
            className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Media Upload & Transcription Error Notice */}
      {uploadErrorMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Transcription Notice</p>
            <p className="text-sm mt-0.5 font-medium text-red-700">{uploadErrorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadErrorMessage(null)}
            className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Processing Indicator */}
      {isProcessingUpload && (
        <div className="p-4 bg-white border-2 border-[#0369A1] rounded-2xl shadow-sm space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-[#0369A1]">
            <span className="flex items-center gap-2">
              <Radio className="w-4 h-4 animate-spin text-[#0284C7]" />
              {uploadStatusText}
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#E0F2FE] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0369A1] h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE: 2-COLUMN DESKTOP LAYOUT           */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================================================== */}
        {/* LEFT COLUMN: PLAYER & CONTROLS (7 cols)            */}
        {/* ================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Media Container / Audio Deck / Video Player */}
          <div
            className={`relative rounded-3xl overflow-hidden border-4 shadow-lg flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] ${
              highContrast
                ? 'bg-neutral-950 border-yellow-400'
                : 'bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0369A1] border-[#0369A1]'
            }`}
          >
            {/* Live Mic Listening Waveform Overlay */}
            {isLiveListening && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-black shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE RECORDING ({formatTime(liveSessionElapsed)})</span>
              </div>
            )}

            {/* A. HTML5 Video Player (When Video is uploaded) */}
            {workspaceMode === 'upload_video' && uploadedMediaUrl ? (
              <video
                ref={videoRef}
                src={uploadedMediaUrl}
                className="w-full h-full object-contain max-h-[380px]"
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlayPause}
              />
            ) : workspaceMode === 'upload_audio' && uploadedMediaUrl ? (
              /* B. Dedicated Audio Player Stage */
              <div className="w-full h-full p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 select-none">
                <audio
                  ref={audioRef}
                  src={uploadedMediaUrl}
                  onTimeUpdate={() => {
                    if (audioRef.current) {
                      setCurrentTime(audioRef.current.currentTime);
                    }
                  }}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Animated Soundwave Visualizer Bars */}
                <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-xs px-4">
                  {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className={`w-2 rounded-full transition-all duration-200 ${
                        isPlaying
                          ? 'bg-sky-300 animate-pulse'
                          : 'bg-white/30'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 1.1)) % 100)}%` : '20%',
                        animationDelay: `${i * 80}ms`
                      }}
                    />
                  ))}
                </div>

                {/* Audio Info Card */}
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      AUDIO TRACK
                    </span>
                    <span className="px-2.5 py-0.5 bg-sky-400/30 text-sky-100 rounded-md text-[11px] font-mono font-bold">
                      {formatTime(duration)}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug break-all line-clamp-2">
                    {currentTitle}
                  </h3>
                  <p className="text-xs text-sky-100 font-medium">
                    High-accuracy spoken audio transcription with synchronized captions.
                  </p>
                </div>
              </div>
            ) : (
              /* C. Interactive Presentation Canvas (Demo or Live Mic) */
              <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-4 select-none">
                <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                  {isLiveListening ? (
                    <Mic className="w-8 h-8 text-red-400 animate-bounce" />
                  ) : (
                    <Play className="w-8 h-8 ml-1 text-white opacity-90" />
                  )}
                </div>

                <div className="space-y-1 max-w-md">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[11px] font-black uppercase tracking-wider">
                    {currentSubject}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {currentTitle}
                  </h3>
                  <p className="text-xs text-sky-100 font-medium">
                    {workspaceMode === 'live_mic'
                      ? 'Live microphone streaming active. Capturing classroom speech.'
                      : 'Interactive synchronized visual lecture with open subtitles & timestamps.'}
                  </p>
                </div>
              </div>
            )}

            {/* OPEN CAPTIONS SUBTITLE OVERLAY */}
            {showCaptionsOnPlayer && (
              <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-none flex flex-col items-center">
                {/* Active Segment Caption */}
                {activeSegment && (
                  <div className="bg-black/85 backdrop-blur-md text-yellow-300 border border-yellow-400/60 px-4 py-2.5 rounded-2xl max-w-[90%] text-center shadow-2xl animate-fadeIn">
                    <div className="flex items-center justify-center gap-2 text-[11px] font-black text-sky-300 mb-0.5">
                      <span>{activeSegment.speaker}</span>
                      {activeSegment.soundCue && (
                        <span className="bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-md">
                          ♫ {activeSegment.soundCue}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-sm sm:text-base leading-snug text-yellow-200">
                      {activeSegment.text}
                    </p>
                  </div>
                )}

                {/* Interim Live Speech Bubble */}
                {isLiveListening && interimLiveText && (
                  <div className="mt-2 bg-red-950/90 text-white border border-red-500 px-3 py-1.5 rounded-xl text-xs font-semibold italic max-w-[85%] text-center animate-pulse">
                    "...{interimLiveText}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Media Playback Scrubber & Control Deck */}
          <div className="p-4 sm:p-5 bg-white border-2 border-[#BAE6FD] rounded-3xl shadow-sm space-y-3">
            {/* Timeline Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#0369A1]">
                <span className="font-mono">{formatTime(currentTime)}</span>
                <span className="font-mono text-neutral-400">{formatTime(duration)}</span>
              </div>

              <input
                type="range"
                min={0}
                max={duration || 60}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (uploadedMediaType === 'video' && videoRef.current) {
                    videoRef.current.currentTime = val;
                  }
                  if (uploadedMediaType === 'audio' && audioRef.current) {
                    audioRef.current.currentTime = val;
                  }
                }}
                className="w-full h-2.5 bg-[#E0F2FE] rounded-lg appearance-none cursor-pointer accent-[#0369A1]"
                aria-label="Media playback position"
              />
            </div>

            {/* Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Play / Pause & Jumps */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleJumpTime(-5)}
                  className="p-2 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-bold text-xs border border-[#BAE6FD] cursor-pointer"
                  title="Rewind 5 seconds"
                >
                  -5s
                </button>

                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="w-11 h-11 rounded-2xl bg-[#0369A1] hover:bg-[#0284C7] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                  title={isPlaying ? 'Pause Playback' : 'Play Media'}
                  aria-label={isPlaying ? 'Pause Playback' : 'Play Media'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleJumpTime(5)}
                  className="p-2 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-bold text-xs border border-[#BAE6FD] cursor-pointer"
                  title="Forward 5 seconds"
                >
                  +5s
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setCurrentTime(0);
                    if (uploadedMediaType === 'video' && videoRef.current) videoRef.current.currentTime = 0;
                    if (uploadedMediaType === 'audio' && audioRef.current) audioRef.current.currentTime = 0;
                  }}
                  className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                  title="Restart playback"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed & Caption Toggles */}
              <div className="flex items-center gap-2">
                {/* Speed selector */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => {
                    const spd = parseFloat(e.target.value);
                    setPlaybackSpeed(spd);
                    if (uploadedMediaType === 'video' && videoRef.current) videoRef.current.playbackRate = spd;
                    if (uploadedMediaType === 'audio' && audioRef.current) audioRef.current.playbackRate = spd;
                  }}
                  className="px-2.5 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs font-bold text-[#0369A1] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
                  aria-label="Playback speed"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1.0}>1.0x (Normal)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                </select>

                {/* Subtitle toggle */}
                <button
                  type="button"
                  onClick={() => setShowCaptionsOnPlayer(!showCaptionsOnPlayer)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showCaptionsOnPlayer
                      ? 'bg-[#0369A1] text-white border-[#0369A1]'
                      : 'bg-white text-neutral-500 border-neutral-300'
                  }`}
                  title="Toggle open captions overlay"
                >
                  CC {showCaptionsOnPlayer ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* RIGHT COLUMN: SYNCHRONIZED TRANSCRIPT STUDIO       */}
        {/* ================================================== */}
        <div className="lg:col-span-5 space-y-4">
          {/* Transcript Control Header */}
          <div className="p-4 bg-white border-2 border-[#BAE6FD] rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0369A1]" />
                <h4 className="font-black text-[#0C4A6E] text-base">Media Transcript</h4>
                <span className="px-2 py-0.5 bg-[#E0F2FE] text-[#0369A1] text-xs font-bold rounded-full">
                  {segments.length} lines
                </span>
              </div>

              {/* Add manual segment */}
              <button
                type="button"
                onClick={handleAddManualSegment}
                className="p-1.5 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] cursor-pointer"
                title="Add new transcript line"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Ask Lumi Assistant Button */}
            <button
              type="button"
              onClick={handleAskLumiSummary}
              className="w-full py-2 px-3 bg-gradient-to-r from-[#0369A1] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>Ask Lumi to Summarize Transcript</span>
            </button>

            {/* Search and Speaker Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search spoken dialogue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs font-medium text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {uniqueSpeakers.length > 1 && (
                <select
                  value={filterSpeaker}
                  onChange={(e) => setFilterSpeaker(e.target.value)}
                  className="px-2 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs font-bold text-[#0369A1] cursor-pointer"
                >
                  <option value="all">All Speakers</option>
                  {uniqueSpeakers.map((spk) => (
                    <option key={spk} value={spk}>
                      {spk}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Export & Copy Row */}
            <div className="flex items-center justify-between pt-1 border-t border-[#BAE6FD]/40">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-2.5 py-1 bg-white hover:bg-[#F0F9FF] text-[#0369A1] font-bold text-xs rounded-xl border border-[#BAE6FD] flex items-center gap-1 cursor-pointer"
                  title="Download .TXT report"
                >
                  <Download className="w-3 h-3" />
                  <span>.TXT</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSrt}
                  className="px-2.5 py-1 bg-white hover:bg-[#F0F9FF] text-[#0369A1] font-bold text-xs rounded-xl border border-[#BAE6FD] flex items-center gap-1 cursor-pointer"
                  title="Download .SRT subtitle file"
                >
                  <FileCode className="w-3 h-3" />
                  <span>.SRT</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoScrollTranscript(!autoScrollTranscript)}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                    autoScrollTranscript
                      ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                      : 'bg-white text-neutral-400 border-neutral-200'
                  }`}
                  title="Toggle auto-scrolling with playback"
                >
                  Auto-Scroll: {autoScrollTranscript ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="px-2.5 py-1 bg-[#0369A1] hover:bg-[#0284C7] text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  {copiedToast ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToast ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transcript Scrolling List */}
          <div
            ref={transcriptScrollContainerRef}
            className={`border-4 rounded-3xl p-4 space-y-3 max-h-[480px] overflow-y-auto ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-white text-[#0C4A6E] border-[#0369A1]'
            }`}
          >
            {filteredSegments.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 space-y-2">
                <Search className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-sm font-semibold">No transcript lines match your filter.</p>
              </div>
            ) : (
              filteredSegments.map((seg) => {
                const isActive = currentTime >= seg.start && currentTime < seg.end;
                const isEditing = editingSegmentId === seg.id;

                return (
                  <div
                    key={seg.id}
                    ref={isActive ? activeSegmentCardRef : null}
                    onClick={() => !isEditing && seekToSegment(seg)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isActive
                        ? highContrast
                          ? 'bg-neutral-900 border-yellow-400 shadow-md ring-2 ring-yellow-400'
                          : 'bg-[#E0F2FE] border-[#0369A1] shadow-md ring-2 ring-[#BAE6FD]'
                        : highContrast
                        ? 'bg-neutral-950 border-neutral-800 hover:border-yellow-500/50'
                        : 'bg-[#F0F9FF] border-[#BAE6FD] hover:border-[#0369A1]'
                    }`}
                  >
                    {/* Header: Timestamp, Speaker, Sound Cue, Edit Button */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        {/* Timestamp Pill */}
                        <span
                          className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-[#0369A1] text-white'
                              : 'bg-white text-[#0369A1] border border-[#BAE6FD]'
                          }`}
                        >
                          {formatTime(seg.start)} - {formatTime(seg.end)}
                        </span>

                        <span className="font-black text-xs truncate text-[#0C4A6E]">
                          {seg.speaker}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {seg.soundCue && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#BAE6FD] text-[#0C4A6E]">
                            ♫ {seg.soundCue}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(seg);
                          }}
                          className="p-1 text-[#0369A1] hover:bg-white rounded-lg cursor-pointer"
                          title="Edit line text"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Segment Content / Editor */}
                    {isEditing ? (
                      <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2.5 bg-white border-2 border-[#0369A1] rounded-xl text-sm font-semibold text-[#0C4A6E] focus:outline-none"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Optional Sound Cue (e.g. Chime)"
                            value={editSoundCue}
                            onChange={(e) => setEditSoundCue(e.target.value)}
                            className="flex-1 px-2.5 py-1 bg-white border border-[#BAE6FD] rounded-lg text-xs font-medium text-[#0C4A6E]"
                          />
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(seg.id)}
                              className="px-3 py-1 bg-[#0369A1] hover:bg-[#0284C7] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`font-semibold leading-relaxed ${
                          fontSize === 'normal'
                            ? 'text-sm'
                            : fontSize === 'large'
                            ? 'text-base'
                            : 'text-lg font-bold'
                        } ${isActive ? 'text-[#0C4A6E]' : 'text-[#0C4A6E]/90'}`}
                      >
                        {seg.text}
                      </p>
                    )}
                  </div>
                );
              })
            )}

            {/* Real-Time Live Microphone Speech Stream Indicator */}
            {isLiveListening && interimLiveText && (
              <div className="p-3.5 bg-red-50 border-2 border-red-300 rounded-2xl animate-pulse flex items-center gap-2">
                <Mic className="w-4 h-4 text-red-600 animate-spin shrink-0" />
                <p className="text-xs text-red-900 font-semibold italic truncate">
                  Speaking now: "{interimLiveText}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTranscriptionWorkspace;
