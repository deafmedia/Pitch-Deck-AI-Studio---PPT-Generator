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

export default function App() {
  // Default to the DEF Demo UX Pitch Deck (which matches the attached prompt brief)
  const [currentDeck, setCurrentDeck] = React.useState<PitchDeck>(SAMPLE_DECKS[0]);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number>(0);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState<boolean>(false);
  const [isPresenting, setIsPresenting] = React.useState<boolean>(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = React.useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);

  // Active theme
  const activeTheme = THEME_PRESETS[currentDeck.theme] || THEME_PRESETS.corporate_blue;
  const activeSlide = currentDeck.slides[activeSlideIndex] || currentDeck.slides[0];

  // Select a preset deck
  const handleSelectDeck = (deck: PitchDeck) => {
    setCurrentDeck(deck);
    setActiveSlideIndex(0);
  };

  // Change theme
  const handleThemeChange = (themeId: ThemePresetId) => {
    setCurrentDeck({
      ...currentDeck,
      theme: themeId,
    });
  };

  // Update active slide data
  const handleUpdateActiveSlide = (updatedSlide: SlideData) => {
    const updatedSlides = [...currentDeck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    setCurrentDeck({
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
    setCurrentDeck({
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

    setCurrentDeck({
      ...currentDeck,
      slides: updatedSlides,
    });
    setActiveSlideIndex(index + 1);
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (currentDeck.slides.length <= 1) return;
    const updatedSlides = currentDeck.slides.filter((_, i) => i !== index);
    setCurrentDeck({
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

    setCurrentDeck({
      ...currentDeck,
      slides: updatedSlides,
    });
    setActiveSlideIndex(targetIndex);
  };

  // When AI generates a new deck
  const handleDeckGenerated = (newDeck: PitchDeck) => {
    setCurrentDeck(newDeck);
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
    </div>
  );
}
