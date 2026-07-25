import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Clock, MessageSquare, Sparkles, Radio, Pencil } from 'lucide-react';
import { PitchDeck, ThemePreset } from '../types';
import { THEME_PRESETS } from '../data/templates';
import { AnnotationCanvas } from './AnnotationCanvas';

interface PresentationModeProps {
  deck: PitchDeck;
  initialSlideIndex?: number;
  onClose: () => void;
  onLaunchLiveStream?: () => void;
}

type TransitionType = 'slide' | 'fade' | 'zoom';

export const PresentationMode: React.FC<PresentationModeProps> = ({
  deck,
  initialSlideIndex = 0,
  onClose,
  onLaunchLiveStream,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialSlideIndex);
  const [direction, setDirection] = React.useState<number>(0);
  const [transitionStyle, setTransitionStyle] = React.useState<TransitionType>('slide');
  const [showNotes, setShowNotes] = React.useState(false);
  const [isAnnotating, setIsAnnotating] = React.useState(false);
  const [secondsElapsed, setSecondsElapsed] = React.useState(0);

  const theme: ThemePreset = THEME_PRESETS[deck.theme] || THEME_PRESETS.corporate_blue;
  const currentSlide = deck.slides[currentIndex] || deck.slides[0];

  const navigate = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= deck.slides.length) return;
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  };

  // Timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard Navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        if (currentIndex < deck.slides.length - 1) {
          navigate(currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          navigate(currentIndex - 1);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.slides.length, onClose]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Motion variants according to chosen transition style
  const activeTransition = currentSlide.transition || transitionStyle;

  const getVariants = () => {
    if (activeTransition === 'fade') {
      return {
        enter: { opacity: 0, scale: 0.98 },
        center: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
      };
    }
    if (activeTransition === 'zoom') {
      return {
        enter: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 1.15 : 0.85 }),
        center: { opacity: 1, scale: 1 },
        exit: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 0.85 : 1.15 }),
      };
    }
    // Default: 'slide'
    return {
      enter: (dir: number) => ({
        x: dir > 0 ? 800 : -800,
        opacity: 0,
        scale: 0.95,
      }),
      center: {
        x: 0,
        opacity: 1,
        scale: 1,
      },
      exit: (dir: number) => ({
        x: dir < 0 ? 800 : -800,
        opacity: 0,
        scale: 0.95,
      }),
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between select-none font-sans text-white overflow-hidden">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-300 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-extrabold text-white tracking-tight">{deck.title}</span>
          <span className="text-slate-400 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded">
            {currentIndex + 1} / {deck.slides.length}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {formatTimer(secondsElapsed)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Transition Effect Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 text-[11px] font-medium">Transition:</span>
            <select
              value={transitionStyle}
              onChange={(e) => setTransitionStyle(e.target.value as TransitionType)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="slide" className="bg-slate-900">Slide</option>
              <option value="fade" className="bg-slate-900">Fade</option>
              <option value="zoom" className="bg-slate-900">Zoom</option>
            </select>
          </div>

          {/* Live Broadcast & Interpreter Studio Trigger */}
          {onLaunchLiveStream && (
            <button
              onClick={() => {
                onClose();
                onLaunchLiveStream();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/50 text-xs font-bold transition cursor-pointer"
              title="Switch to Live Broadcast Studio with Sign Language Interpreter"
            >
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Live + Interpreter Studio</span>
            </button>
          )}

          {/* Annotate Toggle */}
          <button
            onClick={() => setIsAnnotating(!isAnnotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              isAnnotating
                ? 'bg-amber-400 text-slate-950 font-extrabold ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Overlay Drawing & Annotation Tool"
          >
            <Pencil className="w-3.5 h-3.5 text-amber-400" />
            <span>Annotate</span>
          </button>

          {/* Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              showNotes ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          {/* Exit */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Exit Presentation (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Canvas Container with Animated Slide Transitions */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={getVariants()}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.35,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="w-full max-w-6xl aspect-[16/9] rounded-2xl shadow-2xl p-8 sm:p-16 flex flex-col justify-between border border-slate-700/40 relative"
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily,
            }}
          >
            {/* Header */}
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

            {/* Center Content */}
            <div className="flex-1 flex flex-col justify-center my-4 overflow-hidden">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 leading-tight" style={{ color: theme.textColor }}>
                {currentSlide.title}
              </h1>

              {currentSlide.subtitle && (
                <p className="text-base sm:text-xl opacity-80 mb-6 leading-relaxed" style={{ color: theme.secondaryColor }}>
                  {currentSlide.subtitle}
                </p>
              )}

              {/* Bullets */}
              {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                <div className="space-y-3 mt-2">
                  {currentSlide.bullets.map((b, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="flex items-start gap-3 text-sm sm:text-lg"
                    >
                      <span className="w-2 h-2 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: theme.accentColor }} />
                      <span className="leading-relaxed">{b}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Stats */}
              {currentSlide.stats && currentSlide.stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {currentSlide.stats.map((st, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                      className="p-5 rounded-2xl border flex flex-col justify-between"
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.accentColor }}
                    >
                      <div className="text-3xl sm:text-4xl font-black" style={{ color: theme.accentColor }}>
                        {st.value}
                      </div>
                      <div className="text-sm font-bold mt-2" style={{ color: theme.textColor }}>
                        {st.label}
                      </div>
                      {st.sublabel && (
                        <div className="text-xs opacity-75 mt-1" style={{ color: theme.secondaryColor }}>
                          {st.sublabel}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Cards */}
              {currentSlide.cards && currentSlide.cards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  {currentSlide.cards.slice(0, 6).map((cd, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                      className="p-4 rounded-xl border flex flex-col justify-between"
                      style={{ backgroundColor: theme.cardBg, borderColor: cd.highlight ? theme.accentColor : theme.cardBorder }}
                    >
                      {cd.tag && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: theme.accentColor }}>
                          {cd.tag}
                        </span>
                      )}
                      <div className="font-bold text-sm sm:text-base" style={{ color: theme.textColor }}>
                        {cd.title}
                      </div>
                      <div className="text-xs opacity-80 mt-1 line-clamp-3 leading-relaxed" style={{ color: theme.secondaryColor }}>
                        {cd.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs opacity-60 pt-4 border-t border-slate-700/20">
              <span>{deck.title}</span>
              <span>{currentIndex + 1} / {deck.slides.length}</span>
            </div>

            {/* Slide Drawing Annotation Overlay */}
            <AnnotationCanvas
              slideId={currentSlide.id}
              isActive={isAnnotating}
              onToggleActive={setIsAnnotating}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Speaker Notes Overlay Drawer */}
      {showNotes && (
        <div className="bg-slate-900 border-t border-slate-800 p-4 text-xs max-h-40 overflow-y-auto text-slate-300 z-50">
          <span className="font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Presenter Notes (Slide {currentIndex + 1})
          </span>
          <p className="leading-relaxed">
            {currentSlide.speakerNotes || 'No specific notes recorded for this slide.'}
          </p>
        </div>
      )}

      {/* Navigation Buttons (Left/Right Overlay) */}
      <button
        onClick={() => navigate(currentIndex - 1)}
        disabled={currentIndex === 0}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-white disabled:opacity-20 transition z-50 cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate(currentIndex + 1)}
        disabled={currentIndex === deck.slides.length - 1}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-white disabled:opacity-20 transition z-50 cursor-pointer shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

