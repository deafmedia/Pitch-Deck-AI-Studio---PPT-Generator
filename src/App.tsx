import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  LayoutGrid,
  Sliders,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { SAMPLE_DECKS, THEME_PRESETS } from './data/templates';
import { PitchDeck, SlideData, SlideLayoutType, ThemePresetId } from './types';
import { Navbar } from './components/Navbar';
import { SlideThumbnails } from './components/SlideThumbnails';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideInspector } from './components/SlideInspector';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { PresentationMode } from './components/PresentationMode';
import { LiveStreamStudio } from './components/LiveStreamStudio';
import { ExportModal } from './components/ExportModal';
import { FileExplorerModal } from './components/FileExplorerModal';
import { AuthScreen, UserProfile } from './components/AuthScreen';
import { PitchAnalyticsModal } from './components/PitchAnalyticsModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ac_presentation_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [hasSkippedAuth, setHasSkippedAuth] = React.useState<boolean>(() => {
    return localStorage.getItem('ac_presentation_skipped_auth_v1') === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState<boolean>(false);

  // Pitch Deck state with initial load from localStorage
  const [currentDeck, setCurrentDeck] = React.useState<PitchDeck>(() => {
    try {
      const saved = localStorage.getItem('ac_pitch_deck_v1');
      return saved ? JSON.parse(saved) : SAMPLE_DECKS[0];
    } catch (e) {
      return SAMPLE_DECKS[0];
    }
  });
  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number>(0);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState<boolean>(false);
  const [isPresenting, setIsPresenting] = React.useState<boolean>(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = React.useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = React.useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = React.useState<boolean>(false);

  // Responsive Layout & Panel Toggle State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = React.useState<boolean>(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = React.useState<boolean>(true);
  const [mobileTab, setMobileTab] = React.useState<'slides' | 'canvas' | 'inspector'>('canvas');

  // Auto-saving Status Indicator state
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('saved');
  const isFirstRender = React.useRef(true);

  // Debounced 500ms LocalStorage Persistence Effect
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('ac_pitch_deck_v1', JSON.stringify(currentDeck));
        setSaveStatus('saved');
      } catch (e) {
        console.warn('LocalStorage save error:', e);
        setSaveStatus('saved');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentDeck]);

  // Deck Undo / Redo History Stack
  const [history, setHistory] = React.useState<PitchDeck[]>([currentDeck]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(0);

  // Auth Action Callbacks
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setHasSkippedAuth(true);
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem('ac_presentation_user_v1', JSON.stringify(user));
      localStorage.setItem('ac_presentation_skipped_auth_v1', 'true');
    } catch (e) {
      console.warn('LocalStorage user save failed', e);
    }
  };

  const handleContinueAsGuest = () => {
    setHasSkippedAuth(true);
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem('ac_presentation_skipped_auth_v1', 'true');
    } catch (e) {
      console.warn('LocalStorage skip save failed', e);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setHasSkippedAuth(false);
    try {
      localStorage.removeItem('ac_presentation_user_v1');
      localStorage.removeItem('ac_presentation_skipped_auth_v1');
    } catch (e) {
      console.warn('LocalStorage user remove failed', e);
    }
  };

  // Update current deck and push new state to history
  const updateDeckWithHistory = (newDeck: PitchDeck) => {
    setCurrentDeck(newDeck);
    const newHistory = history.slice(0, historyIndex + 1);
    // Limit history stack size to 30 snapshots
    if (newHistory.length >= 30) newHistory.shift();
    newHistory.push(newDeck);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo Deck Change
  const handleUndoDeck = React.useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevDeck = history[prevIndex];
      setCurrentDeck(prevDeck);
      setHistoryIndex(prevIndex);
      if (activeSlideIndex >= prevDeck.slides.length) {
        setActiveSlideIndex(Math.max(0, prevDeck.slides.length - 1));
      }
    }
  }, [historyIndex, history, activeSlideIndex]);

  // Redo Deck Change
  const handleRedoDeck = React.useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextDeck = history[nextIndex];
      setCurrentDeck(nextDeck);
      setHistoryIndex(nextIndex);
      if (activeSlideIndex >= nextDeck.slides.length) {
        setActiveSlideIndex(Math.max(0, nextDeck.slides.length - 1));
      }
    }
  }, [historyIndex, history, activeSlideIndex]);

  // Global Keyboard Shortcuts for Deck Undo/Redo (when not typing in active input)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      const isInput = targetTag === 'INPUT' || targetTag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      if (isInput || isPresenting) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedoDeck();
        } else {
          e.preventDefault();
          handleUndoDeck();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedoDeck();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleUndoDeck, handleRedoDeck, isPresenting]);

  // Active theme
  const activeTheme = THEME_PRESETS[currentDeck.theme] || THEME_PRESETS.corporate_blue;
  const activeSlide = currentDeck.slides[activeSlideIndex] || currentDeck.slides[0];

  // Select a preset deck
  const handleSelectDeck = (deck: PitchDeck) => {
    updateDeckWithHistory(deck);
    setActiveSlideIndex(0);
  };

  // Change theme
  const handleThemeChange = (themeId: ThemePresetId) => {
    updateDeckWithHistory({
      ...currentDeck,
      theme: themeId,
    });
  };

  // Update active slide data
  const handleUpdateActiveSlide = (updatedSlide: SlideData) => {
    const updatedSlides = [...currentDeck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({
      ...currentDeck,
      slides: updatedSlides,
    });
  };

  // Add new slide
  const handleAddSlide = (layout: SlideLayoutType) => {
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      layout,
      eyebrow: 'NEW SECTION',
      title: 'New Slide Title',
      subtitle: 'Click to edit subtitle or add details...',
      bullets: ['First key point or takeaway'],
      accentBadge: 'NEW SLIDE',
    };

    const newSlides = [...currentDeck.slides, newSlide];
    updateDeckWithHistory({
      ...currentDeck,
      slides: newSlides,
    });
    setActiveSlideIndex(newSlides.length - 1);
  };

  // Duplicate slide
  const handleDuplicateSlide = (index: number) => {
    const slideToDup = currentDeck.slides[index];
    const duplicated: SlideData = {
      ...slideToDup,
      id: `slide-${Date.now()}`,
      title: `${slideToDup.title} (Copy)`,
    };

    const updatedSlides = [...currentDeck.slides];
    updatedSlides.splice(index + 1, 0, duplicated);

    updateDeckWithHistory({
      ...currentDeck,
      slides: updatedSlides,
    });
    setActiveSlideIndex(index + 1);
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (currentDeck.slides.length <= 1) return;
    const updatedSlides = currentDeck.slides.filter((_, i) => i !== index);
    updateDeckWithHistory({
      ...currentDeck,
      slides: updatedSlides,
    });
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  // Move slide up or down
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentDeck.slides.length) return;

    const updatedSlides = [...currentDeck.slides];
    const [moved] = updatedSlides.splice(index, 1);
    updatedSlides.splice(targetIndex, 0, moved);

    updateDeckWithHistory({
      ...currentDeck,
      slides: updatedSlides,
    });
    setActiveSlideIndex(targetIndex);
  };

  // When AI generates a new deck
  const handleDeckGenerated = (newDeck: PitchDeck) => {
    updateDeckWithHistory(newDeck);
    setActiveSlideIndex(0);
  };

  // First Page Auth Gate: If user is not logged in and has not chosen guest mode
  if (!currentUser && !hasSkippedAuth) {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Navigation */}
      <Navbar
        currentDeck={currentDeck}
        activeSlideIndex={activeSlideIndex}
        saveStatus={saveStatus}
        onSelectSlideIndex={setActiveSlideIndex}
        onSelectDeck={handleSelectDeck}
        onThemeChange={handleThemeChange}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onStartPresenting={() => setIsPresenting(true)}
        onStartLiveStream={() => setIsLiveStreamOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndoDeck}
        onRedo={handleRedoDeck}
        onOpenFileExplorer={() => setIsFileExplorerOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Thumbnails Sidebar (Desktop & Mobile Overlay) */}
        <div
          className={`${
            mobileTab === 'slides'
              ? 'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex sm:relative sm:z-auto sm:bg-transparent'
              : isLeftPanelOpen
              ? 'hidden lg:flex'
              : 'hidden'
          }`}
        >
          <div className="w-72 sm:w-64 h-full bg-slate-50 flex flex-col z-50 sm:z-auto border-r border-slate-200">
            {/* Mobile Drawer Close Header */}
            <div className="lg:hidden p-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span>SLIDES EXPLORER</span>
              </span>
              <button
                onClick={() => setMobileTab('canvas')}
                className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-extrabold cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <SlideThumbnails
              slides={currentDeck.slides}
              activeSlideIndex={activeSlideIndex}
              onSelectSlide={(idx) => {
                setActiveSlideIndex(idx);
                setMobileTab('canvas');
              }}
              onAddSlide={handleAddSlide}
              onDuplicateSlide={handleDuplicateSlide}
              onDeleteSlide={handleDeleteSlide}
              onMoveSlide={handleMoveSlide}
            />
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div
          className={`flex-1 flex flex-col relative min-w-0 overflow-hidden ${
            mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Desktop Floating Panel Toggle Controls */}
          <div className="hidden lg:flex items-center justify-between absolute top-3 left-3 right-3 z-30 pointer-events-none">
            {/* Left Panel Toggle */}
            <button
              onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              className={`pointer-events-auto p-2 border rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-extrabold backdrop-blur-md active:scale-95 ${
                isLeftPanelOpen
                  ? 'bg-blue-50/95 text-blue-700 border-blue-400/80 ring-2 ring-blue-500/20 hover:bg-blue-100/90 hover:border-blue-500'
                  : 'bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border-slate-200/90'
              }`}
              title={isLeftPanelOpen ? 'Collapse Slides Panel' : 'Expand Slides Panel'}
            >
              <div className="relative flex items-center justify-center">
                {isLeftPanelOpen ? (
                  <PanelLeftClose className="w-4 h-4 text-blue-600" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-blue-600" />
                )}
                {isLeftPanelOpen && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse ring-2 ring-white" />
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wider">{isLeftPanelOpen ? 'Hide Slides' : 'Slides'}</span>
            </button>

            {/* Right Panel Toggle */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`pointer-events-auto p-2 border rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-extrabold backdrop-blur-md active:scale-95 ${
                isRightPanelOpen
                  ? 'bg-blue-50/95 text-blue-700 border-blue-400/80 ring-2 ring-blue-500/20 hover:bg-blue-100/90 hover:border-blue-500'
                  : 'bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border-slate-200/90'
              }`}
              title={isRightPanelOpen ? 'Collapse Inspector Panel' : 'Expand Inspector Panel'}
            >
              <span className="text-[10px] uppercase tracking-wider">{isRightPanelOpen ? 'Hide Inspector' : 'Inspector'}</span>
              <div className="relative flex items-center justify-center">
                {isRightPanelOpen ? (
                  <PanelRightClose className="w-4 h-4 text-blue-600" />
                ) : (
                  <PanelRightOpen className="w-4 h-4 text-blue-600" />
                )}
                {isRightPanelOpen && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse ring-2 ring-white" />
                )}
              </div>
            </button>
          </div>

          {activeSlide && (
            <SlideCanvas
              slide={activeSlide}
              theme={activeTheme}
              onUpdateSlide={handleUpdateActiveSlide}
            />
          )}
        </div>

        {/* Right Inspector Sidebar (Desktop & Mobile Overlay) */}
        <div
          className={`${
            mobileTab === 'inspector'
              ? 'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex justify-end sm:relative sm:z-auto sm:bg-transparent'
              : isRightPanelOpen
              ? 'hidden lg:flex'
              : 'hidden'
          }`}
        >
          <div className="w-full sm:w-80 md:w-96 lg:w-[380px] xl:w-[410px] h-full bg-white flex flex-col z-50 sm:z-auto border-l border-slate-200/90 shadow-xl shrink-0">
            {/* Mobile Inspector Header Close */}
            <div className="lg:hidden p-2.5 bg-slate-900 text-white flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 font-black text-xs uppercase">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>INSPECTOR & PROPERTIES</span>
              </span>
              <button
                onClick={() => setMobileTab('canvas')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-extrabold cursor-pointer border border-slate-700"
              >
                Close ✕
              </button>
            </div>

            {activeSlide && (
              <SlideInspector
                slide={activeSlide}
                allSlides={currentDeck.slides}
                theme={activeTheme}
                onUpdateSlide={handleUpdateActiveSlide}
                activeSlideIndex={activeSlideIndex}
                totalSlides={currentDeck.slides.length}
                onDuplicateSlide={() => handleDuplicateSlide(activeSlideIndex)}
                onDeleteSlide={() => handleDeleteSlide(activeSlideIndex)}
                onMoveSlide={handleMoveSlide}
                onSelectSlide={(index) => {
                  setActiveSlideIndex(index);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (< lg) */}
      <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-3 py-2 flex items-center justify-around text-slate-300 shrink-0 z-30 shadow-lg">
        <button
          onClick={() => setMobileTab('slides')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            mobileTab === 'slides'
              ? 'bg-blue-600 text-white font-extrabold shadow-md'
              : 'hover:bg-slate-800 text-slate-400 font-bold'
          }`}
        >
          <div className="flex items-center gap-1">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-wider">Slides</span>
          </div>
          <span className="text-[9px] opacity-80">({currentDeck.slides.length})</span>
        </button>

        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            mobileTab === 'canvas'
              ? 'bg-blue-600 text-white font-extrabold shadow-md'
              : 'hover:bg-slate-800 text-slate-400 font-bold'
          }`}
        >
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-wider">Canvas</span>
          </div>
          <span className="text-[9px] opacity-80">#{activeSlideIndex + 1}</span>
        </button>

        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            mobileTab === 'inspector'
              ? 'bg-blue-600 text-white font-extrabold shadow-md'
              : 'hover:bg-slate-800 text-slate-400 font-bold'
          }`}
        >
          <div className="flex items-center gap-1">
            <Sliders className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-wider">Inspector</span>
          </div>
          <span className="text-[9px] opacity-80">Edit</span>
        </button>
      </div>

      {/* AI Generator Modal */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onDeckGenerated={handleDeckGenerated}
      />

      {/* Fullscreen Presentation Mode */}
      {isPresenting && (
        <PresentationMode
          deck={currentDeck}
          initialSlideIndex={activeSlideIndex}
          onClose={() => setIsPresenting(false)}
          onLaunchLiveStream={() => setIsLiveStreamOpen(true)}
        />
      )}

      {/* Live Stream Studio with Personnel & Sign Language Interpreter */}
      {isLiveStreamOpen && (
        <LiveStreamStudio
          deck={currentDeck}
          initialSlideIndex={activeSlideIndex}
          onClose={() => setIsLiveStreamOpen(false)}
        />
      )}

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        deck={currentDeck}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* File Explorer Modal */}
      <FileExplorerModal
        isOpen={isFileExplorerOpen}
        onClose={() => setIsFileExplorerOpen(false)}
        currentDeck={currentDeck}
        onSelectDeck={handleSelectDeck}
      />

      {/* Pitch Deck Health Score Analytics Modal */}
      <PitchAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        deck={currentDeck}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onExportPptx={() => setIsExportModalOpen(true)}
      />

      {/* Auth Modal overlay when triggered from Navbar */}
      {isAuthModalOpen && (
        <AuthScreen
          isModal
          onCloseModal={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}
    </div>
  );
}
