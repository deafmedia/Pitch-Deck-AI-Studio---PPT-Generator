import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  Volume2,
  Users,
  Radio,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Captions,
  Subtitles,
  ShieldCheck,
  Settings,
  Layout,
  Layers,
  HelpCircle,
  ThumbsUp,
  Send,
  CheckCircle2,
  Sparkle,
  Pencil,
  Disc,
  Key,
  Globe,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Play,
  Square,
  Tv,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { PitchDeck, ThemePreset } from '../types';
import { THEME_PRESETS } from '../data/templates';
import { AnnotationCanvas } from './AnnotationCanvas';

interface LiveStreamStudioProps {
  deck: PitchDeck;
  initialSlideIndex?: number;
  onClose: () => void;
}

type StreamLayoutMode = 'side_by_side' | 'pip' | 'interpreter_focus';

interface PersonnelCam {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarGradient: string;
  isCameraOn: boolean;
  isMicOn: boolean;
  isSpeaking: boolean;
}

interface QuestionItem {
  id: string;
  author: string;
  role: string;
  text: string;
  votes: number;
  isAnswered: boolean;
  isAnsweringLive?: boolean;
  timeAgo: string;
}

export const LiveStreamStudio: React.FC<LiveStreamStudioProps> = ({
  deck,
  initialSlideIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialSlideIndex);
  const [layoutMode, setLayoutMode] = React.useState<StreamLayoutMode>('side_by_side');
  const [personnelGridMode, setPersonnelGridMode] = React.useState<boolean>(true);
  
  // 4 Live Personnel Camera State
  const [personnelCams, setPersonnelCams] = React.useState<PersonnelCam[]>([
    {
      id: 'cam1',
      name: 'Alex Morgan',
      role: 'CEO & Key Presenter',
      initials: 'AM',
      avatarGradient: 'from-blue-600 to-indigo-900',
      isCameraOn: true,
      isMicOn: true,
      isSpeaking: true,
    },
    {
      id: 'cam2',
      name: 'Sarah Chen',
      role: 'Head of Accessibility & UX',
      initials: 'SC',
      avatarGradient: 'from-amber-600 to-red-900',
      isCameraOn: true,
      isMicOn: true,
      isSpeaking: false,
    },
    {
      id: 'cam3',
      name: 'Marcus Vance',
      role: 'Chief Technology Officer',
      initials: 'MV',
      avatarGradient: 'from-emerald-600 to-teal-900',
      isCameraOn: true,
      isMicOn: false,
      isSpeaking: false,
    },
    {
      id: 'cam4',
      name: 'Dr. Maya Lin',
      role: 'AI & Sign Relay Lead',
      initials: 'ML',
      avatarGradient: 'from-purple-600 to-pink-900',
      isCameraOn: true,
      isMicOn: true,
      isSpeaking: false,
    },
  ]);

  const [activeSpotlightCamId, setActiveSpotlightCamId] = React.useState<string>('cam1');
  const [isInterpreterActive, setIsInterpreterActive] = React.useState(true);
  const [isAnnotating, setIsAnnotating] = React.useState(false);
  const [showCaptions, setShowCaptions] = React.useState(true);
  const [showNotes, setShowNotes] = React.useState(false);
  const [showQna, setShowQna] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  // Screen Recording State
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingSeconds, setRecordingSeconds] = React.useState(0);
  const [recordingQuality, setRecordingQuality] = React.useState<'1080p60' | '4k30' | '720p60'>('1080p60');
  const [recordAudioSource, setRecordAudioSource] = React.useState<'system_mic' | 'system_only' | 'mic_only'>('system_mic');
  const [recordInterpreterPip, setRecordInterpreterPip] = React.useState(true);

  // YouTube Live Stream Settings State
  const [youtubeConnected, setYoutubeConnected] = React.useState(true);
  const [youtubeChannelName, setYoutubeChannelName] = React.useState('Deaf Tech Stream Official');
  const [streamKey, setStreamKey] = React.useState('yt-live-rtmp-8492-9901-deaf-studio');
  const [showStreamKey, setShowStreamKey] = React.useState(false);
  const [streamPrivacy, setStreamPrivacy] = React.useState<'public' | 'unlisted' | 'private'>('public');
  const [streamBitrate, setStreamBitrate] = React.useState('6000 kbps (1080p60)');
  const [isKeyCopied, setIsKeyCopied] = React.useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = React.useState<'youtube' | 'recording' | 'accessibility'>('youtube');

  const [viewerCount, setViewerCount] = React.useState(1284);
  const [captionText, setCaptionText] = React.useState(
    "Live Speech: 'Welcome everyone to the DEF Demo UX presentation. Today we are demonstrating deaf-first digital identity and real-time video relay sign language integration...'"
  );

  // Screen Recording Duration Counter
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Personnel Q&A State
  const [questions, setQuestions] = React.useState<QuestionItem[]>([
    {
      id: 'q1',
      author: 'Sarah Chen',
      role: 'Head of Accessibility & UX',
      text: 'How does the deaf-first membership authentication interface integrate with emergency VRS video relay calls?',
      votes: 18,
      isAnswered: false,
      isAnsweringLive: true,
      timeAgo: '2m ago',
    },
    {
      id: 'q2',
      author: 'David Vance',
      role: 'Series A Lead Investor',
      text: 'What is the latency threshold when transmitting simultaneous slide state updates and high-definition sign language video streams?',
      votes: 12,
      isAnswered: false,
      isAnsweringLive: false,
      timeAgo: '5m ago',
    },
    {
      id: 'q3',
      author: 'Elena Rostova',
      role: 'Senior Product Manager',
      text: 'Can we export this entire slide deck with presenter speaker notes intact into editable Microsoft PowerPoint .pptx format?',
      votes: 9,
      isAnswered: true,
      isAnsweringLive: false,
      timeAgo: '10m ago',
    },
  ]);
  const [newQuestionText, setNewQuestionText] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'all' | 'unanswered'>('all');

  // WebCam Stream Reference
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState(false);

  const theme: ThemePreset = THEME_PRESETS[deck.theme] || THEME_PRESETS.corporate_blue;
  const currentSlide = deck.slides[currentIndex] || deck.slides[0];

  const activeLiveQuestion = questions.find((q) => q.isAnsweringLive);

  // Request Camera Stream on Mount
  React.useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCameraPermission(true);
          }
        }
      } catch (err) {
        console.log('Webcam not available or permission denied, using simulated live video feed.');
        setHasCameraPermission(false);
      }
    };

    const isCam1On = personnelCams[0]?.isCameraOn;
    if (isCam1On) {
      enableCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [personnelCams]);

  // Simulate Live Viewers fluctuation & scrolling captions
  React.useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);

    const captionPhrases = [
      `Slide ${currentIndex + 1}: ${currentSlide.title}. Key highlight: ${currentSlide.bullets?.[0] || 'Deaf-first technology platform'}.`,
      "VRS Sign Language Interpreter #4092 translating in real-time Indian Sign Language (ISL).",
      activeLiveQuestion ? `Answering Personnel Q&A from ${activeLiveQuestion.author}: "${activeLiveQuestion.text}"` : "Live Captions: 'Our architecture ensures zero-latency streaming for critical emergency relay calls.'",
      "Presenter Alex Morgan: 'Notice how the accessibility features are built directly into the slide deck layout.'"
    ];

    let phraseIdx = 0;
    const captionInterval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % captionPhrases.length;
      setCaptionText(captionPhrases[phraseIdx]);
    }, 6000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(captionInterval);
    };
  }, [currentIndex, currentSlide, activeLiveQuestion]);

  const navigate = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < deck.slides.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      author: 'You (Personnel)',
      role: 'Broadcast Participant',
      text: newQuestionText.trim(),
      votes: 1,
      isAnswered: false,
      isAnsweringLive: false,
      timeAgo: 'Just now',
    };
    setQuestions([newQ, ...questions]);
    setNewQuestionText('');
  };

  const handleUpvote = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    );
  };

  const handleToggleAnswerLive = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return { ...q, isAnsweringLive: !q.isAnsweringLive };
        }
        return { ...q, isAnsweringLive: false };
      })
    );
  };

  const handleMarkAnswered = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isAnswered: true, isAnsweringLive: false } : q))
    );
  };

  const togglePersonnelCam = (id: string) => {
    setPersonnelCams((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isCameraOn: !c.isCameraOn } : c))
    );
  };

  const togglePersonnelMic = (id: string) => {
    setPersonnelCams((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isMicOn: !c.isMicOn } : c))
    );
  };

  const setPersonnelSpeaking = (id: string) => {
    setPersonnelCams((prev) =>
      prev.map((c) => ({ ...c, isSpeaking: c.id === id }))
    );
    setActiveSpotlightCamId(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-100 font-sans overflow-hidden select-none">
      {/* Top Studio Control Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Live Indicator Badge */}
          <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-3 py-1 rounded-full text-red-400 font-extrabold text-xs">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shrink-0" />
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>LIVE BROADCAST</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Title & Deck info */}
          <div>
            <h1 className="font-extrabold text-sm text-white flex items-center gap-2">
              {deck.title}
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Video className="w-3 h-3 text-blue-400" />
                4 Personnel Cams + ISL Relay
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-300">
                <Users className="w-3 h-3 text-emerald-400" />
                <span className="font-mono font-bold text-emerald-400">{viewerCount.toLocaleString()}</span> Viewers
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                VRS Certified Interpreter Active
              </span>
            </p>
          </div>
        </div>

        {/* Layout Switcher & Actions */}
        <div className="flex items-center gap-3">
          {/* Stream Layout Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setLayoutMode('side_by_side')}
              className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1.5 ${
                layoutMode === 'side_by_side'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side-by-Side</span>
            </button>
            <button
              onClick={() => setLayoutMode('pip')}
              className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1.5 ${
                layoutMode === 'pip'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PIP Float</span>
            </button>
            <button
              onClick={() => setLayoutMode('interpreter_focus')}
              className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1.5 ${
                layoutMode === 'interpreter_focus'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Interpreter Focus</span>
            </button>
          </div>

          {/* Screen Recording Toggle Button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
              isRecording
                ? 'bg-red-600 border-red-500 text-white shadow-lg ring-2 ring-red-500/50'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
            title={isRecording ? 'Stop Screen Recording' : 'Start Screen Recording'}
          >
            <Disc className={`w-4 h-4 ${isRecording ? 'text-white animate-spin' : 'text-red-400'}`} />
            <span className="hidden sm:inline font-mono">
              {isRecording
                ? `REC ${Math.floor(recordingSeconds / 60)
                    .toString()
                    .padStart(2, '0')}:${(recordingSeconds % 60).toString().padStart(2, '0')}`
                : 'Screen Record'}
            </span>
            {isRecording && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />}
          </button>

          {/* YouTube Live Stream & Studio Settings Modal Toggle */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showSettingsModal
                ? 'bg-red-950/80 border-red-500/60 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="YouTube Live Stream & Recording Settings"
          >
            <Settings className="w-4 h-4 text-red-400" />
            <span className="hidden md:inline">Settings</span>
          </button>
          <button
            onClick={() => setIsAnnotating(!isAnnotating)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
              isAnnotating
                ? 'bg-amber-400 border-amber-300 text-slate-950 font-extrabold shadow-lg ring-2 ring-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Live Stream Slide Annotation & Drawing Overlay"
          >
            <Pencil className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">{isAnnotating ? 'Drawing Active' : 'Annotate Slide'}</span>
            {isAnnotating && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          {/* Toggle Personnel Q&A Drawer */}
          <button
            onClick={() => {
              setShowQna(!showQna);
              setShowNotes(false);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
              showQna
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Personnel Question & Answer Panel"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Personnel Q&A</span>
            {questions.filter((q) => !q.isAnswered).length > 0 && (
              <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                {questions.filter((q) => !q.isAnswered).length}
              </span>
            )}
          </button>

          {/* Toggle Closed Captions */}
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showCaptions
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Live Speech-to-Text Captions"
          >
            <Captions className="w-4 h-4" />
            <span className="hidden md:inline">CC</span>
          </button>

          {/* Toggle Speaker Notes */}
          <button
            onClick={() => {
              setShowNotes(!showNotes);
              setShowQna(false);
            }}
            className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
              showNotes ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Presenter Notes"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Exit Studio */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="End Broadcast Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Studio Workspace Content Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4 relative bg-slate-950">
        {/* Main Presentation Canvas Viewport */}
        <div
          className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-300 ${
            layoutMode === 'side_by_side'
              ? 'w-2/3'
              : layoutMode === 'interpreter_focus'
              ? 'w-1/2'
              : 'w-full'
          }`}
        >
          {/* Active Question Banner Overlay on Presentation View if 'Answering Live' */}
          {activeLiveQuestion && (
            <div className="w-full max-w-5xl mb-3 bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-500/70 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 text-xs z-20 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-400 uppercase text-[10px] tracking-wider">
                      ANSWERING PERSONNEL QUESTION LIVE
                    </span>
                    <span className="bg-purple-900/80 border border-purple-500/50 text-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Subtitles className="w-3 h-3 text-purple-400" />
                      Sign Language Relay Active
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm mt-0.5">
                    "{activeLiveQuestion.text}"
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Submitted by <span className="font-bold text-slate-200">{activeLiveQuestion.author}</span> ({activeLiveQuestion.role})
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleMarkAnswered(activeLiveQuestion.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done Answering
              </button>
            </div>
          )}

          <div
            className="w-full max-w-5xl aspect-[16/9] rounded-2xl shadow-2xl p-8 sm:p-12 flex flex-col justify-between border border-slate-800 relative transition-all overflow-hidden"
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily,
            }}
          >
            {/* Slide Eyebrow & Badge */}
            <div className="flex items-center justify-between shrink-0 mb-4">
              {currentSlide.eyebrow && (
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: theme.accentColor }}>
                  {currentSlide.eyebrow}
                </span>
              )}
              {currentSlide.accentBadge && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                  style={{
                    borderColor: theme.accentColor,
                    color: theme.accentColor,
                    backgroundColor: `${theme.accentColor}15`,
                  }}
                >
                  {currentSlide.accentBadge}
                </span>
              )}
            </div>

            {/* Slide Core Body */}
            <div className="flex-1 flex flex-col justify-center my-2 overflow-hidden">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight" style={{ color: theme.textColor }}>
                {currentSlide.title}
              </h2>

              {currentSlide.subtitle && (
                <p className="text-sm sm:text-lg opacity-85 mb-4 leading-relaxed" style={{ color: theme.secondaryColor }}>
                  {currentSlide.subtitle}
                </p>
              )}

              {/* Bullets */}
              {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                <div className="space-y-2.5 mt-2">
                  {currentSlide.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-base">
                      <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: theme.accentColor }} />
                      <span className="leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Grid */}
              {currentSlide.stats && currentSlide.stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {currentSlide.stats.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border flex flex-col justify-between"
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.accentColor }}
                    >
                      <div className="text-2xl sm:text-3xl font-black" style={{ color: theme.accentColor }}>
                        {st.value}
                      </div>
                      <div className="text-xs font-bold mt-1" style={{ color: theme.textColor }}>
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cards Grid */}
              {currentSlide.cards && currentSlide.cards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  {currentSlide.cards.slice(0, 3).map((cd, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border"
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
                    >
                      <div className="font-bold text-xs sm:text-sm" style={{ color: theme.textColor }}>
                        {cd.title}
                      </div>
                      <div className="text-[11px] opacity-80 mt-1 line-clamp-2" style={{ color: theme.secondaryColor }}>
                        {cd.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between text-[11px] opacity-60 pt-3 border-t border-slate-700/20">
              <span>{deck.title}</span>
              <span>Slide {currentIndex + 1} of {deck.slides.length}</span>
            </div>

            {/* Slide Drawing Annotation Overlay Canvas */}
            <AnnotationCanvas
              slideId={currentSlide.id}
              isActive={isAnnotating}
              onToggleActive={setIsAnnotating}
            />
          </div>

          {/* Navigation Overlay Controls */}
          <div className="mt-4 flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl shadow-xl">
            <button
              onClick={() => navigate(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-300">
              Slide {currentIndex + 1} / {deck.slides.length}
            </span>
            <button
              onClick={() => navigate(currentIndex + 1)}
              disabled={currentIndex === deck.slides.length - 1}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Feeds Panel (4 Personnel Cameras + Sign Language Interpreter) */}
        <div
          className={`flex flex-col gap-4 transition-all duration-300 ${
            layoutMode === 'side_by_side'
              ? 'w-80 sm:w-96'
              : layoutMode === 'interpreter_focus'
              ? 'w-1/2'
              : 'absolute bottom-8 right-8 w-80 z-40 shadow-2xl rounded-2xl p-2 bg-slate-900/95 border border-slate-800 backdrop-blur-md'
          }`}
        >
          {/* Header Bar for Personnel Cameras */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="font-extrabold text-xs text-white">4 Personnel Cameras Live</span>
            </div>
            <button
              onClick={() => setPersonnelGridMode(!personnelGridMode)}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700 cursor-pointer"
            >
              {personnelGridMode ? 'Spotlight View' : '2x2 Grid View'}
            </button>
          </div>

          {/* Personnel Cameras Container */}
          {personnelGridMode ? (
            /* 2x2 Grid Layout for 4 Personnel Cams */
            <div className="grid grid-cols-2 gap-2">
              {personnelCams.map((cam, index) => {
                const isSpotlight = activeSpotlightCamId === cam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => setPersonnelSpeaking(cam.id)}
                    className={`bg-slate-900 border rounded-xl overflow-hidden shadow-lg relative flex flex-col group cursor-pointer transition transform hover:scale-[1.02] ${
                      isSpotlight ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-slate-800 hover:border-slate-700'
                    }`}
                    title={`Click to spotlight ${cam.name}`}
                  >
                    <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                      {cam.isCameraOn ? (
                        index === 0 && hasCameraPermission ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${cam.avatarGradient} flex flex-col items-center justify-center p-2 relative overflow-hidden`}>
                            <div className="relative">
                              <div className={`w-10 h-10 rounded-full bg-slate-900/80 border-2 flex items-center justify-center text-white font-extrabold text-sm shadow-md ${
                                cam.isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-400/50' : 'border-slate-700'
                              }`}>
                                {cam.initials}
                              </div>
                              {cam.isSpeaking && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-white mt-1 truncate max-w-[110px] text-center">
                              {cam.name}
                            </span>
                            <span className="text-[9px] text-slate-300 opacity-80 truncate max-w-[110px] text-center">
                              {cam.role.split('&')[0]}
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                          <VideoOff className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold text-slate-400">{cam.name}</span>
                          <span className="text-[8px] text-slate-600">Cam Off</span>
                        </div>
                      )}

                      {/* Live Badge */}
                      <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-bold text-white flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${cam.isCameraOn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        <span>CAM {index + 1}</span>
                      </div>

                      {/* Speaker Active Ring */}
                      {cam.isSpeaking && (
                        <div className="absolute bottom-1 left-1 bg-emerald-950/80 border border-emerald-500/50 px-1.5 py-0.5 rounded text-[8px] font-extrabold text-emerald-300">
                          SPEAKING
                        </div>
                      )}
                    </div>

                    {/* Camera Bar Controls */}
                    <div className="p-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px]" onClick={(e) => e.stopPropagation()}>
                      <span className="font-bold text-slate-300 truncate max-w-[80px]">{cam.name.split(' ')[0]}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePersonnelMic(cam.id)}
                          className={`p-1 rounded transition cursor-pointer ${
                            cam.isMicOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                          title={cam.isMicOn ? 'Mute' : 'Unmute'}
                        >
                          {cam.isMicOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => togglePersonnelCam(cam.id)}
                          className={`p-1 rounded transition cursor-pointer ${
                            cam.isCameraOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                          title={cam.isCameraOn ? 'Cam Off' : 'Cam On'}
                        >
                          {cam.isCameraOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Single Spotlight Camera View */
            (() => {
              const activeCam = personnelCams.find((c) => c.id === activeSpotlightCamId) || personnelCams[0];
              return (
                <div
                  onClick={() => setLayoutMode(layoutMode === 'pip' ? 'side_by_side' : 'pip')}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative flex flex-col group cursor-pointer"
                >
                  <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                    {activeCam.isCameraOn ? (
                      activeCam.id === 'cam1' && hasCameraPermission ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform -scale-x-100"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${activeCam.avatarGradient} flex flex-col items-center justify-center relative`}>
                          <div className="w-16 h-16 rounded-full bg-slate-900/80 border-2 border-emerald-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg ring-4 ring-emerald-500/30">
                            {activeCam.initials}
                          </div>
                          <span className="text-xs font-bold text-slate-200 mt-2">{activeCam.name}</span>
                          <span className="text-[10px] text-slate-300 opacity-80">{activeCam.role}</span>
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-500">
                        <VideoOff className="w-8 h-8 mb-1" />
                        <span className="text-xs font-bold">{activeCam.name} Camera Off</span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span>SPOTLIGHT PERSONNEL</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900 flex items-center justify-between text-xs border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
                    <span className="font-bold text-slate-300 text-[11px]">{activeCam.name} ({activeCam.role.split(' ')[0]})</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePersonnelMic(activeCam.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          activeCam.isMicOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {activeCam.isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => togglePersonnelCam(activeCam.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          activeCam.isCameraOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {activeCam.isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Feed 2: Sign Language Interpreter Stream (VRS / ISL Certified) */}
          {isInterpreterActive && (
            <div
              onClick={() => setLayoutMode(layoutMode === 'interpreter_focus' ? 'side_by_side' : 'interpreter_focus')}
              className={`bg-slate-900 border-2 border-purple-500/50 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col flex-1 group cursor-pointer transition transform hover:scale-[1.01] ${
                layoutMode === 'interpreter_focus' ? 'ring-4 ring-purple-500' : ''
              }`}
              title="Click to toggle Focus Mode for Sign Language Interpreter"
            >
              <div className="relative aspect-video sm:aspect-auto flex-1 bg-gradient-to-tr from-purple-950/80 via-slate-950 to-indigo-950 flex flex-col items-center justify-center p-4">
                {/* Simulated Sign Language Interpreter Animation */}
                <div className="relative flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-200 font-extrabold text-2xl shadow-xl backdrop-blur-xs relative overflow-hidden">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: 'easeInOut',
                      }}
                      className="flex flex-col items-center"
                    >
                      <Subtitles className="w-8 h-8 text-purple-300" />
                    </motion.div>
                  </div>

                  {/* Active Hands/Signing Pulse Graphic */}
                  <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-1 rounded-full text-[10px] shadow-lg animate-bounce">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs font-extrabold text-white flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    Certified ISL Interpreter #4092
                  </span>
                  <span className="text-[10px] text-purple-300 font-medium block mt-0.5">
                    Live VRS Sign Language Feed • RID Certified
                  </span>
                </div>

                {/* Hover Cue */}
                <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                  <span className="bg-purple-950/90 text-purple-200 font-bold text-[10px] px-2.5 py-1 rounded-full border border-purple-400 shadow-lg">
                    Click to Focus Interpreter Stream
                  </span>
                </div>

                {/* High Contrast Background Banner for Deaf Accessibility */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-purple-950/90 border border-purple-500/50 px-2.5 py-1 rounded-md text-[10px] font-extrabold text-purple-200">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                  <span>SIGN LANGUAGE INTERPRETER</span>
                </div>
              </div>

              {/* Controls Bar for Interpreter Stream */}
              <div className="p-2.5 bg-purple-950/40 border-t border-purple-500/30 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                <span className="font-extrabold text-purple-300 text-[11px] flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  Real-time Sign Relay
                </span>
                <button
                  onClick={() => setIsInterpreterActive(false)}
                  className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Minimize Interpreter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personnel Q&A Drawer Panel */}
      {showQna && (
        <div className="absolute bottom-16 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl text-xs flex flex-col max-h-[500px] z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Personnel Q&A</h3>
                <p className="text-[10px] text-slate-400">Questions answered live with Sign Language Relay</p>
              </div>
            </div>
            <button
              onClick={() => setShowQna(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-3 bg-slate-950 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 rounded text-[11px] font-bold transition ${
                activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('unanswered')}
              className={`flex-1 py-1 rounded text-[11px] font-bold transition ${
                activeTab === 'unanswered' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unanswered ({questions.filter((q) => !q.isAnswered).length})
            </button>
          </div>

          {/* Questions List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-3 max-h-64">
            {questions
              .filter((q) => (activeTab === 'unanswered' ? !q.isAnswered : true))
              .map((q) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-xl border transition ${
                    q.isAnsweringLive
                      ? 'bg-amber-950/40 border-amber-500/80 text-amber-100 ring-1 ring-amber-500'
                      : q.isAnswered
                      ? 'bg-slate-950/50 border-slate-800 opacity-60 text-slate-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-xs text-white block">{q.author}</span>
                      <span className="text-[10px] text-slate-400 block">{q.role} • {q.timeAgo}</span>
                    </div>
                    <button
                      onClick={() => handleUpvote(q.id)}
                      className="flex items-center gap-1 bg-slate-900 border border-slate-700 hover:border-slate-500 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-300 transition cursor-pointer"
                      title="Upvote question"
                    >
                      <ThumbsUp className="w-3 h-3 text-amber-400" />
                      <span>{q.votes}</span>
                    </button>
                  </div>

                  <p className="mt-1.5 text-xs font-medium leading-relaxed">{q.text}</p>

                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
                    {q.isAnswered ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Answered Live
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleAnswerLive(q.id)}
                        className={`font-bold px-2 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                          q.isAnsweringLive
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-purple-900/60 border border-purple-500/40 text-purple-200 hover:bg-purple-800'
                        }`}
                      >
                        <Radio className="w-3 h-3" />
                        {q.isAnsweringLive ? 'Answering Now...' : 'Answer Live on Stream'}
                      </button>
                    )}

                    {!q.isAnswered && (
                      <button
                        onClick={() => handleMarkAnswered(q.id)}
                        className="text-slate-400 hover:text-emerald-400 underline cursor-pointer"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Submit Question Form */}
          <form onSubmit={handleAddQuestion} className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Ask personnel question..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!newQuestionText.trim()}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition disabled:opacity-40 cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {/* Live AI Speech-to-Text Captions Ticker Bar */}
      {showCaptions && (
        <div className="bg-slate-900 border-t border-slate-800 p-3 sm:px-8 flex items-center justify-between text-xs shrink-0 shadow-2xl z-20">
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
              <Captions className="w-3.5 h-3.5" />
              LIVE CC
            </span>
            <p className="text-slate-200 font-medium truncate sm:text-sm animate-fade-in">
              {captionText}
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:block shrink-0 ml-4">
            AI Speech-to-Text • Deaf Accessibility Engine
          </span>
        </div>
      )}

      {/* Speaker Notes Overlay Drawer */}
      {showNotes && (
        <div className="absolute bottom-16 left-6 right-6 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl text-xs max-h-48 overflow-y-auto text-slate-200 z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Presenter Speaker Notes (Slide {currentIndex + 1})
            </span>
            <button onClick={() => setShowNotes(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="leading-relaxed font-medium">
            {currentSlide.speakerNotes || 'No specific speaker notes recorded for this slide.'}
          </p>
        </div>
      )}

      {/* YouTube Live Stream & Screen Recording Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-extrabold">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                    Broadcast & Recording Settings
                    <span className="text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                      YouTube Studio
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Configure RTMP stream keys, personal account login, and screen recording</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-2 shrink-0">
              <button
                onClick={() => setActiveSettingsTab('youtube')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeSettingsTab === 'youtube'
                    ? 'border-red-500 text-red-400 bg-red-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-4 h-4 text-red-500" />
                <span>YouTube Live Stream</span>
              </button>
              <button
                onClick={() => setActiveSettingsTab('recording')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeSettingsTab === 'recording'
                    ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Disc className="w-4 h-4 text-blue-500" />
                <span>Screen Recording</span>
              </button>
              <button
                onClick={() => setActiveSettingsTab('accessibility')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeSettingsTab === 'accessibility'
                    ? 'border-purple-500 text-purple-400 bg-purple-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Subtitles className="w-4 h-4 text-purple-500" />
                <span>Sign Relay & CC</span>
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
              {activeSettingsTab === 'youtube' && (
                <div className="space-y-4">
                  {/* YouTube Account Login Card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-lg">
                        YT
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{youtubeChannelName}</span>
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            Connected
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Personal YouTube Channel • Stream permissions verified
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setYoutubeConnected(!youtubeConnected)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition cursor-pointer shrink-0"
                    >
                      {youtubeConnected ? 'Switch Account' : 'Connect YouTube'}
                    </button>
                  </div>

                  {/* RTMP Stream Key Settings */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span>YouTube Stream Key (RTMP)</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">rtmp://a.rtmp.youtube.com/live2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showStreamKey ? 'text' : 'password'}
                          value={streamKey}
                          onChange={(e) => setStreamKey(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStreamKey(!showStreamKey)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(streamKey);
                          setIsKeyCopied(true);
                          setTimeout(() => setIsKeyCopied(false), 2000);
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        {isKeyCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{isKeyCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Privacy & Bitrate Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Stream Privacy */}
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block">
                        Privacy Mode
                      </label>
                      <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                        {[
                          { id: 'public', label: 'Public', icon: Globe },
                          { id: 'unlisted', label: 'Unlisted', icon: Key },
                          { id: 'private', label: 'Private', icon: Lock },
                        ].map((p) => {
                          const IconComp = p.icon;
                          const isSel = streamPrivacy === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => setStreamPrivacy(p.id as any)}
                              className={`flex-1 py-1.5 rounded-md font-bold transition flex items-center justify-center gap-1 ${
                                isSel ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{p.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stream Resolution & Bitrate */}
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block">
                        Ingest Bitrate Target
                      </label>
                      <select
                        value={streamBitrate}
                        onChange={(e) => setStreamBitrate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                      >
                        <option value="6000 kbps (1080p60)">6,000 kbps — 1080p @ 60 FPS (Ultra Quality)</option>
                        <option value="4500 kbps (1080p30)">4,500 kbps — 1080p @ 30 FPS (Standard)</option>
                        <option value="3000 kbps (720p60)">3,000 kbps — 720p @ 60 FPS (Bandwidth Saver)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'recording' && (
                <div className="space-y-4">
                  {/* Screen Recording Quick Control Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        Local Screen & Audio Recording
                        {isRecording && (
                          <span className="bg-red-500 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                            RECORDING ACTIVE
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Capture presentation slides, presenter webcams, and sign language interpreter streams
                      </p>
                    </div>
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`px-4 py-2 rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center gap-2 ${
                        isRecording
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                      }`}
                    >
                      {isRecording ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                    </button>
                  </div>

                  {/* Recording Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block">
                        Recording Resolution
                      </label>
                      <select
                        value={recordingQuality}
                        onChange={(e) => setRecordingQuality(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                      >
                        <option value="1080p60">1080p HD @ 60 FPS (Recommended)</option>
                        <option value="4k30">4K Ultra HD @ 30 FPS</option>
                        <option value="720p60">720p HD @ 60 FPS</option>
                      </select>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block">
                        Audio Recording Source
                      </label>
                      <select
                        value={recordAudioSource}
                        onChange={(e) => setRecordAudioSource(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                      >
                        <option value="system_mic">System Audio + Microphone Mix</option>
                        <option value="system_only">System Audio Only (No Mic)</option>
                        <option value="mic_only">Microphone Only</option>
                      </select>
                    </div>
                  </div>

                  {/* PIP Recording Checkbox */}
                  <label className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition">
                    <div>
                      <span className="font-extrabold text-white text-xs block">Record Sign Language Interpreter PIP</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Embed the live sign relay stream into a separate side panel in the exported MP4
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={recordInterpreterPip}
                      onChange={(e) => setRecordInterpreterPip(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-900 cursor-pointer"
                    />
                  </label>
                </div>
              )}

              {activeSettingsTab === 'accessibility' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                    <h3 className="font-extrabold text-sm text-purple-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      VRS Sign Relay Sub-Stream Forwarding
                    </h3>
                    <p className="text-xs text-purple-300/80">
                      Forward dedicated high-definition ISL/ASL Video Relay Service stream to secondary accessibility channels.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <label className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block">
                      Automated Speech-to-Text Language Engine
                    </label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold">
                      <option value="en-US">English (US) — High Precision Neural Model</option>
                      <option value="hi-IN">Hindi / Indian English — Dual Subtitles</option>
                      <option value="es-ES">Spanish — Multilingual Captioning</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Changes saved automatically to studio session
              </span>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition shadow-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

