import React from 'react';
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

export default function App() {
  // Default to the DEF Demo UX Pitch Deck (which matches the attached prompt brief)
  const [currentDeck, setCurrentDeck] = React.useState<PitchDeck>(SAMPLE_DECKS[0]);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number>(0);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState<boolean>(false);
  const [isPresenting, setIsPresenting] = React.useState<boolean>(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = React.useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = React.useState<boolean>(false);

  // Deck Undo / Redo History Stack
  const [history, setHistory] = React.useState<PitchDeck[]>([SAMPLE_DECKS[0]]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(0);

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

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Navigation */}
      <Navbar
        currentDeck={currentDeck}
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
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails */}
        <SlideThumbnails
          slides={currentDeck.slides}
          activeSlideIndex={activeSlideIndex}
          onSelectSlide={setActiveSlideIndex}
          onAddSlide={handleAddSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onMoveSlide={handleMoveSlide}
        />

        {/* Center Canvas */}
        {activeSlide && (
          <SlideCanvas
            slide={activeSlide}
            theme={activeTheme}
            onUpdateSlide={handleUpdateActiveSlide}
          />
        )}

        {/* Right Inspector */}
        {activeSlide && (
          <SlideInspector
            slide={activeSlide}
            theme={activeTheme}
            onUpdateSlide={handleUpdateActiveSlide}
          />
        )}
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
    </div>
  );
}
