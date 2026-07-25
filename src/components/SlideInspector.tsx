import React, { useState } from 'react';
import {
  Sliders,
  Layout,
  MessageSquare,
  Tag,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  Palette,
  Clock3,
  Video,
  Grid,
  BarChart3,
  Columns,
  Layers,
  Table as TableIcon,
  Clock,
  Users,
  Target,
  Maximize2,
  ChevronDown,
  ChevronUp,
  List,
  EyeOff,
  Lock,
  CheckSquare,
  FileText,
  ListChecks,
  AlertCircle,
  Type,
  Image as ImageIcon,
  Film,
  Play,
  Shield,
  Rocket,
  Globe,
  Cpu,
  Zap,
  Heart,
  Award,
  Smartphone,
  Laptop,
  Cloud,
  Link as LinkIcon,
  X,
  ShieldCheck,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Info,
  Wand2
} from 'lucide-react';
import { SlideData, SlideLayoutType, ThemePreset, SlideTransitionType } from '../types';
import { SlideLayoutPickerModal, LAYOUT_OPTIONS } from './SlideLayoutPickerModal';
import { ImageLibraryModal } from './ImageLibraryModal';
import { scanSlideAccessibility } from '../lib/accessibility';

interface SlideInspectorProps {
  slide: SlideData;
  allSlides?: SlideData[];
  theme: ThemePreset;
  onUpdateSlide: (updated: SlideData) => void;
  activeSlideIndex?: number;
  totalSlides?: number;
  onDuplicateSlide?: () => void;
  onDeleteSlide?: () => void;
  onMoveSlide?: (fromIndex: number, toIndex: number) => void;
  onSelectSlide?: (index: number) => void;
}

const STOCK_IMAGE_PRESETS = [
  { label: 'Modern Office Workspace', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', tag: 'Workspace' },
  { label: 'Tech & AI Data Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', tag: 'Analytics' },
  { label: 'Executive Team Meeting', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', tag: 'Teamwork' },
  { label: 'Sign Language ISL Studio', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', tag: 'Accessibility' },
  { label: 'Cybersecurity & Cloud', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', tag: 'Security' },
  { label: 'Mobile App Wireframe UX', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', tag: 'UX Design' },
];

const AVAILABLE_SLIDE_ICONS = [
  { name: 'Sparkles', icon: Sparkles, label: 'AI Sparkles' },
  { name: 'Shield', icon: Shield, label: 'Security' },
  { name: 'Rocket', icon: Rocket, label: 'Launch' },
  { name: 'Target', icon: Target, label: 'Target Goal' },
  { name: 'Globe', icon: Globe, label: 'Global' },
  { name: 'BarChart3', icon: BarChart3, label: 'Metrics' },
  { name: 'Users', icon: Users, label: 'Community' },
  { name: 'Cpu', icon: Cpu, label: 'Hardware' },
  { name: 'Layers', icon: Layers, label: 'Architecture' },
  { name: 'Zap', icon: Zap, label: 'Performance' },
  { name: 'Heart', icon: Heart, label: 'Impact' },
  { name: 'Award', icon: Award, label: 'Milestone' },
  { name: 'Smartphone', icon: Smartphone, label: 'Mobile' },
  { name: 'Laptop', icon: Laptop, label: 'Desktop' },
  { name: 'Cloud', icon: Cloud, label: 'Cloud App' },
  { name: 'Video', icon: Video, label: 'Stream' },
  { name: 'ImageIcon', icon: ImageIcon, label: 'Media' },
];

export const SlideInspector: React.FC<SlideInspectorProps> = ({
  slide,
  allSlides,
  theme,
  onUpdateSlide,
  activeSlideIndex = 0,
  totalSlides = 1,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  onSelectSlide,
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'content' | 'media' | 'presenter' | 'copilot' | 'a11y'>('layout');
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isImageLibraryOpen, setIsImageLibraryOpen] = useState<boolean>(false);
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);
  const [newCheckitemText, setNewCheckitemText] = useState<string>('');

  // Scan current slide for accessibility issues
  const accessibilityIssues = scanSlideAccessibility(slide, theme);
  const criticalCount = accessibilityIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = accessibilityIssues.filter((i) => i.severity === 'warning').length;

  // Deck-Wide Global Accessibility Scan
  const deckSlidesList = allSlides && allSlides.length > 0 ? allSlides : [slide];
  const deckA11yScans = deckSlidesList.map((s, idx) => ({
    slide: s,
    index: idx,
    issues: scanSlideAccessibility(s, theme),
    critical: scanSlideAccessibility(s, theme).filter((i) => i.severity === 'critical').length,
    warning: scanSlideAccessibility(s, theme).filter((i) => i.severity === 'warning').length,
  }));

  const deckTotalCritical = deckA11yScans.reduce((sum, item) => sum + item.critical, 0);
  const deckTotalWarning = deckA11yScans.reduce((sum, item) => sum + item.warning, 0);
  const slidesNeedingAttention = deckA11yScans.filter((item) => item.issues.length > 0);
  const slidesNeedingAttentionCount = slidesNeedingAttention.length;

  const rawDeckScore = 100 - (deckTotalCritical * 12 + deckTotalWarning * 4);
  const globalDeckA11yScore = Math.max(30, Math.min(100, rawDeckScore));
  const globalDeckGrade =
    globalDeckA11yScore >= 95
      ? 'A+'
      : globalDeckA11yScore >= 85
      ? 'A'
      : globalDeckA11yScore >= 75
      ? 'B'
      : globalDeckA11yScore >= 60
      ? 'C'
      : 'Needs Review';

  // AI Copilot State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [targetLang, setTargetLang] = useState<string>('Spanish');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // AI Slide Rewrite Handler
  const handleAiRewriteSlide = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          currentSlide: slide,
          layout: slide.layout,
        }),
      });
      const data = await res.json();
      if (data.slide) {
        onUpdateSlide({
          ...slide,
          ...data.slide,
        });
        setAiPrompt('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI Speaker Notes Auto-Draft
  const handleAiSpeakerNotes = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/generate-speaker-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideTitle: slide.title,
          slideSubtitle: slide.subtitle,
          bullets: slide.bullets,
          layout: slide.layout,
        }),
      });
      const data = await res.json();
      if (data.speakerNotes) {
        onUpdateSlide({
          ...slide,
          speakerNotes: data.speakerNotes,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI Slide Translator
  const handleTranslateSlide = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slide,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data.slide) {
        onUpdateSlide(data.slide);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Speaker notes word and speaking time metrics
  const notesText = slide.speakerNotes || '';
  const wordsCount = notesText.trim().split(/\s+/).filter(Boolean).length;
  const charsCount = notesText.length;
  const estSpeakingTimeSec = Math.ceil(wordsCount / 2.16);

  const handleCopyNotes = () => {
    if (notesText) {
      navigator.clipboard.writeText(notesText);
      setCopiedNotes(true);
      setTimeout(() => setCopiedNotes(false), 2000);
    }
  };

  const handleAutoDraftNotes = () => {
    const bulletsList = slide.bullets && slide.bullets.length > 0 
      ? slide.bullets.map(b => `  - ${b}`).join('\n')
      : '  - Outline key strategic priorities\n  - Address core value proposition';
    
    const drafted = `• Slide Title: ${slide.title}\n• Core Premise: ${slide.subtitle || 'Focus on executive takeaways.'}\n• Key Talking Points:\n${bulletsList}\n• Speaker Reminder: Pause 3 sec after revealing main figures for audience retention.`;
    
    onUpdateSlide({
      ...slide,
      speakerNotes: notesText ? `${notesText}\n\n${drafted}` : drafted,
    });
  };

  const handleAddCheckitem = () => {
    if (!newCheckitemText.trim()) return;
    const currentList = slide.privateChecklist || [];
    const newItem = { id: Date.now().toString(), text: newCheckitemText.trim(), done: false };
    onUpdateSlide({
      ...slide,
      privateChecklist: [...currentList, newItem],
    });
    setNewCheckitemText('');
  };

  const handleToggleCheckitem = (id: string) => {
    const currentList = slide.privateChecklist || [];
    onUpdateSlide({
      ...slide,
      privateChecklist: currentList.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    });
  };

  const handleDeleteCheckitem = (id: string) => {
    const currentList = slide.privateChecklist || [];
    onUpdateSlide({
      ...slide,
      privateChecklist: currentList.filter((item) => item.id !== id),
    });
  };

  // Quick Preset Accent Badges
  const PRESET_TAGS = [
    'DEAF-FIRST UX',
    'SERIES A',
    'PRODUCT DEMO',
    'FINANCIALS',
    'ROADMAP',
    'IMPORTANT',
    'VISION',
  ];

  // Quick Preset Accent Colors
  const COLOR_ACCENTS = [
    { label: 'Theme Default', color: theme.accentColor },
    { label: 'Electric Blue', color: '#3b82f6' },
    { label: 'Emerald Impact', color: '#10b981' },
    { label: 'Royal Violet', color: '#8b5cf6' },
    { label: 'Sunset Amber', color: '#f59e0b' },
    { label: 'Crimson Rose', color: '#f43f5e' },
    { label: 'Cyber Cyan', color: '#06b6d4' },
  ];

  // Helper to get active layout meta
  const currentLayoutOption = LAYOUT_OPTIONS.find((l) => l.id === slide.layout) || LAYOUT_OPTIONS[0];

  return (
    <aside className="w-full bg-white flex flex-col shrink-0 h-full text-slate-700 text-xs shadow-xs z-20 overflow-hidden">
      {/* Inspector Top Header */}
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2 font-black tracking-tight text-xs">
          <div className="p-1 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <span>SLIDE PROPERTIES</span>
        </div>

        {/* Slide Counter & Index Badge */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-[10px] font-extrabold text-slate-300">
          <span>Slide {activeSlideIndex + 1} of {totalSlides}</span>
        </div>
      </div>

      {/* Quick Slide Management Toolbar */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1">
          {onMoveSlide && (
            <>
              <button
                disabled={activeSlideIndex === 0}
                onClick={() => onMoveSlide(activeSlideIndex, activeSlideIndex - 1)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                title="Move Slide Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={activeSlideIndex === totalSlides - 1}
                onClick={() => onMoveSlide(activeSlideIndex, activeSlideIndex + 1)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                title="Move Slide Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {onDuplicateSlide && (
            <button
              onClick={onDuplicateSlide}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition flex items-center gap-1 font-bold text-[11px] cursor-pointer"
              title="Duplicate This Slide"
            >
              <Copy className="w-3.5 h-3.5 text-blue-600" />
              <span>Duplicate</span>
            </button>
          )}
        </div>

        {onDeleteSlide && totalSlides > 1 && (
          <button
            onClick={onDeleteSlide}
            className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition flex items-center gap-1 font-bold text-[11px] cursor-pointer"
            title="Delete Slide"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>

      {/* Navigation Inspector Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-slate-100/90 p-1.5 gap-1 text-[11px] font-extrabold shrink-0 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'layout'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Layout className="w-3.5 h-3.5 shrink-0" />
          <span>Layout</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'content'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <List className="w-3.5 h-3.5 shrink-0" />
          <span>Content</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'media'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          <span>Media</span>
        </button>

        <button
          onClick={() => setActiveTab('presenter')}
          className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'presenter'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('a11y')}
          className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 relative cursor-pointer shrink-0 ${
            activeTab === 'a11y'
              ? 'bg-emerald-600 text-white shadow-xs font-black'
              : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
          }`}
          title="Slide Accessibility & WCAG Scanner"
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400 fill-emerald-400/20" />
          <span>A11y</span>
          {accessibilityIssues.length > 0 && (
            <span
              className={`px-1.5 py-0.2 text-[9px] font-black rounded-full shrink-0 ${
                activeTab === 'a11y'
                  ? 'bg-white text-emerald-950'
                  : criticalCount > 0
                  ? 'bg-red-500 text-white'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              {accessibilityIssues.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'copilot'
              ? 'bg-blue-600 text-white shadow-xs font-black'
              : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100/90'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400 fill-amber-400" />
          <span>AI Magic</span>
        </button>
      </div>

      {/* Main Property Inspector Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/40">
        {/* TAB 1: LAYOUT & STYLING */}
        {activeTab === 'layout' && (
          <div className="space-y-5">
            {/* Visual Layout Picker Trigger Card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-blue-600" />
                  Active Slide Layout
                </label>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className="text-blue-600 hover:text-blue-700 font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Gallery</span>
                </button>
              </div>

              {/* Selected Layout Feature Display Box */}
              <div
                onClick={() => setIsGalleryOpen(true)}
                className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-2xl transition cursor-pointer group flex items-start gap-3 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  {currentLayoutOption.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-xs text-slate-900 flex items-center justify-between">
                    <span className="truncate">{currentLayoutOption.label}</span>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase bg-blue-100 px-1.5 py-0.5 rounded-full shrink-0">
                      Change
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 font-medium mt-0.5">
                    {currentLayoutOption.description}
                  </p>
                </div>
              </div>

              {/* Quick Layout Swap Pills */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quick Swap Layout
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {LAYOUT_OPTIONS.map((opt) => {
                    const isCurrent = opt.id === slide.layout;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSlide({ ...slide, layout: opt.id })}
                        className={`p-1.5 rounded-xl text-left border text-[11px] font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="shrink-0">{opt.icon}</span>
                        <span className="truncate">{opt.label.split('/')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Title & Subtitle Typography Font Size Sliders */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  Title & Subtitle Font Size
                </label>
                {(slide.titleFontSize || slide.subtitleFontSize) && (
                  <button
                    type="button"
                    onClick={() => onUpdateSlide({ ...slide, titleFontSize: undefined, subtitleFontSize: undefined })}
                    className="text-[10px] font-extrabold text-slate-400 hover:text-slate-700 underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Title Font Size Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Title Size</span>
                  <span className="font-mono text-blue-600 font-extrabold bg-blue-100/80 px-1.5 py-0.5 rounded text-[10px]">
                    {slide.titleFontSize || 36}px
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-slate-400">20px</span>
                  <input
                    type="range"
                    min={20}
                    max={64}
                    step={1}
                    value={slide.titleFontSize || 36}
                    onChange={(e) => onUpdateSlide({ ...slide, titleFontSize: parseInt(e.target.value, 10) })}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] font-extrabold text-slate-400">64px</span>
                </div>
              </div>

              {/* Subtitle Font Size Slider */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Subtitle Size</span>
                  <span className="font-mono text-indigo-600 font-extrabold bg-indigo-100/80 px-1.5 py-0.5 rounded text-[10px]">
                    {slide.subtitleFontSize || 18}px
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-slate-400">12px</span>
                  <input
                    type="range"
                    min={12}
                    max={36}
                    step={1}
                    value={slide.subtitleFontSize || 18}
                    onChange={(e) => onUpdateSlide({ ...slide, subtitleFontSize: parseInt(e.target.value, 10) })}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] font-extrabold text-slate-400">36px</span>
                </div>
              </div>
            </div>

            {/* Slide Transition Animation Selector */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Slide Transition Animation</span>
                </label>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded capitalize">
                  {slide.transition || 'slide'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'slide', label: 'Slide Left', desc: 'Horizontal slide' },
                  { id: 'fade', label: 'Cross Fade', desc: 'Smooth opacity' },
                  { id: 'zoom', label: 'Zoom Effect', desc: 'Focal scale' },
                  { id: 'flip', label: '3D Flip', desc: 'Perspective flip' },
                  { id: 'scale_up', label: 'Scale Up', desc: 'Expand & reveal' },
                  { id: 'fade_up', label: 'Fade Up', desc: 'Vertical glide' },
                ].map((tr) => {
                  const isSelected = (slide.transition || 'slide') === tr.id;
                  return (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => onUpdateSlide({ ...slide, transition: tr.id as SlideTransitionType })}
                      className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-black'
                          : 'bg-white hover:bg-slate-100/80 text-slate-700 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-extrabold">
                        <span>{tr.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                      </div>
                      <span className={`text-[9px] font-medium mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {tr.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slide Header Eyebrow */}
            <div>
              <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest mb-1.5 block">
                Category Eyebrow Text
              </label>
              <input
                type="text"
                value={slide.eyebrow || ''}
                onChange={(e) => onUpdateSlide({ ...slide, eyebrow: e.target.value })}
                placeholder="e.g. EXECUTIVE SUMMARY, PHASE 1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Top Accent Tag Badge */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  Top Accent Badge
                </label>
              </div>
              <input
                type="text"
                value={slide.accentBadge || ''}
                onChange={(e) => onUpdateSlide({ ...slide, accentBadge: e.target.value })}
                placeholder="e.g. DEAF-FIRST UX, SERIES A"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />

              {/* Quick Preset Tags Chips */}
              <div className="flex flex-wrap gap-1 mt-2">
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onUpdateSlide({ ...slide, accentBadge: tag })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                      slide.accentBadge === tag
                        ? 'bg-amber-100 text-amber-800 border-amber-300 font-black'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Slide Accent Color Override */}
            <div>
              <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest mb-2 block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                Theme Accent Palette Override
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {COLOR_ACCENTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      // Apply custom accent badge if selected
                      onUpdateSlide({ ...slide });
                    }}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] font-bold text-slate-700 transition cursor-pointer"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT MANAGERS */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Stats Manager */}
            {slide.layout === 'stats' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <span>Manage Metric Cards ({slide.stats?.length || 0})</span>
                  </h4>
                  <button
                    onClick={() => {
                      const current = slide.stats || [];
                      onUpdateSlide({
                        ...slide,
                        stats: [...current, { value: '100%', label: 'Metric Name', sublabel: 'Sub detail text' }],
                      });
                    }}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Stat
                  </button>
                </div>

                {(slide.stats || []).map((st, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-extrabold">Card #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = (slide.stats || []).filter((_, i) => i !== idx);
                          onUpdateSlide({ ...slide, stats: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="text-[9px] font-extrabold uppercase text-slate-400">Value</label>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => {
                            const newStats = [...(slide.stats || [])];
                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                            onUpdateSlide({ ...slide, stats: newStats });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-black text-slate-900"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] font-extrabold uppercase text-slate-400">Label</label>
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => {
                            const newStats = [...(slide.stats || [])];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            onUpdateSlide({ ...slide, stats: newStats });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cards & Pillars Manager */}
            {(slide.layout === 'pillars' || slide.layout === 'cards') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <Columns className="w-4 h-4 text-indigo-600" />
                    <span>Manage Cards ({slide.cards?.length || 0})</span>
                  </h4>
                  <button
                    onClick={() => {
                      const current = slide.cards || [];
                      onUpdateSlide({
                        ...slide,
                        cards: [...current, { tag: 'TAG', title: 'New Card Title', description: 'Description text' }],
                      });
                    }}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Card
                  </button>
                </div>

                {(slide.cards || []).map((cd, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-extrabold">Card #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = (slide.cards || []).filter((_, i) => i !== idx);
                          onUpdateSlide({ ...slide, cards: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={cd.title}
                      onChange={(e) => {
                        const newCards = [...(slide.cards || [])];
                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                        onUpdateSlide({ ...slide, cards: newCards });
                      }}
                      placeholder="Card Title"
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-900"
                    />

                    <textarea
                      value={cd.description}
                      onChange={(e) => {
                        const newCards = [...(slide.cards || [])];
                        newCards[idx] = { ...newCards[idx], description: e.target.value };
                        onUpdateSlide({ ...slide, cards: newCards });
                      }}
                      rows={2}
                      placeholder="Description"
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-700 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Timeline Manager */}
            {slide.layout === 'timeline' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Manage Roadmap Steps</span>
                  </h4>
                  <button
                    onClick={() => {
                      const current = slide.timelineSteps || [];
                      onUpdateSlide({
                        ...slide,
                        timelineSteps: [
                          ...current,
                          { period: `STEP 0${current.length + 1}`, title: 'Milestone Title', description: 'Step details...' },
                        ],
                      });
                    }}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Step
                  </button>
                </div>

                {(slide.timelineSteps || []).map((step, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={step.period}
                        onChange={(e) => {
                          const updated = [...(slide.timelineSteps || [])];
                          updated[idx] = { ...updated[idx], period: e.target.value };
                          onUpdateSlide({ ...slide, timelineSteps: updated });
                        }}
                        className="bg-amber-100 text-amber-800 border border-amber-300 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md"
                      />
                      <button
                        onClick={() => {
                          const updated = (slide.timelineSteps || []).filter((_, i) => i !== idx);
                          onUpdateSlide({ ...slide, timelineSteps: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...(slide.timelineSteps || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        onUpdateSlide({ ...slide, timelineSteps: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Bullets & Key Takeaways List */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-black text-xs text-slate-900">
                <span>Key Bullet Takeaways ({slide.bullets?.length || 0})</span>
                <button
                  onClick={() => {
                    const current = slide.bullets || [];
                    onUpdateSlide({
                      ...slide,
                      bullets: [...current, 'New key takeaway or bullet point'],
                    });
                  }}
                  className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3 h-3" /> Add Bullet
                </button>
              </div>

              {(slide.bullets || []).map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const updated = [...(slide.bullets || [])];
                      updated[idx] = e.target.value;
                      onUpdateSlide({ ...slide, bullets: updated });
                    }}
                    className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const updated = (slide.bullets || []).filter((_, i) => i !== idx);
                      onUpdateSlide({ ...slide, bullets: updated });
                    }}
                    className="text-slate-400 hover:text-red-600 cursor-pointer p-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA & ASSETS MANAGER */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            {/* Header banner with Library Browser launcher button */}
            <div className="p-3.5 bg-linear-to-br from-blue-600 via-indigo-600 to-slate-900 text-white rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-xs">
                  <ImageIcon className="w-4 h-4 text-blue-300" />
                  <span>Media & Asset Library</span>
                </div>
                <span className="px-2 py-0.5 bg-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-wider">
                  HD Visuals
                </span>
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
                Browse our stock photo gallery, search vector icons, or upload custom graphics for slide #{slide.id}.
              </p>
              <button
                type="button"
                onClick={() => setIsImageLibraryOpen(true)}
                className="w-full py-2 px-3 bg-white hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Open Image & Icon Library Browser</span>
              </button>
            </div>

            {/* SECTION 1: Slide Vector Icon Picker */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Slide Feature Icon
                </label>
                {slide.iconName && (
                  <button
                    type="button"
                    onClick={() => onUpdateSlide({ ...slide, iconName: undefined })}
                    className="text-[10px] font-extrabold text-slate-400 hover:text-red-600 underline cursor-pointer"
                  >
                    Remove Icon
                  </button>
                )}
              </div>

              {/* Icon Grid */}
              <div className="grid grid-cols-6 gap-1.5 pt-1">
                {AVAILABLE_SLIDE_ICONS.map((ic) => {
                  const IconComp = ic.icon;
                  const isSelected = slide.iconName === ic.name;
                  return (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => onUpdateSlide({ ...slide, iconName: isSelected ? undefined : ic.name })}
                      className={`p-2 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs ring-2 ring-blue-400/30'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                      title={ic.label}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: Slide Image Picker & URL Input */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  Slide Photo / Visual Image
                </label>
                {slide.imageUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateSlide({ ...slide, imageUrl: undefined, mediaCaption: undefined })}
                    className="text-[10px] font-extrabold text-slate-400 hover:text-red-600 underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              {/* Active Image Preview Box */}
              {slide.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-300 group aspect-video bg-slate-900">
                  <img
                    src={slide.imageUrl}
                    alt="Slide media preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateSlide({ ...slide, imageUrl: undefined })}
                    className="absolute top-2 right-2 p-1 bg-slate-950/80 hover:bg-red-600 text-white rounded-lg transition cursor-pointer"
                    title="Delete Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Direct URL Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">Custom Image URL</label>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={slide.imageUrl || ''}
                      onChange={(e) => onUpdateSlide({ ...slide, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-2 py-1.5 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Media Caption */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">Image Caption / Label</label>
                <input
                  type="text"
                  value={slide.mediaCaption || ''}
                  onChange={(e) => onUpdateSlide({ ...slide, mediaCaption: e.target.value })}
                  placeholder="e.g. Figure 1.1: Platform Architecture Diagram"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Image Alt-Text (Screen Readers) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Image Alt-Text (Screen Readers)</span>
                  </label>
                  {!slide.imageAltText && (
                    <span className="text-[9px] text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      WCAG Warning
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={slide.imageAltText || ''}
                  onChange={(e) => onUpdateSlide({ ...slide, imageAltText: e.target.value })}
                  placeholder="Describe image visual content for screen readers..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Curated Unsplash Stock Photo Gallery Presets */}
              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                  Select Stock Image Preset
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {STOCK_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onUpdateSlide({ ...slide, imageUrl: preset.url, mediaCaption: preset.label })}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 text-left transition cursor-pointer aspect-video bg-slate-100"
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[9px] font-bold text-white truncate">{preset.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: Video Embed Section */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-600" />
                  Embedded Video URL (YouTube / Vimeo)
                </label>
                {slide.videoUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateSlide({ ...slide, videoUrl: undefined })}
                    className="text-[10px] font-extrabold text-slate-400 hover:text-red-600 underline cursor-pointer"
                  >
                    Remove Video
                  </button>
                )}
              </div>

              <div className="relative">
                <Film className="w-3.5 h-3.5 text-purple-500 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={slide.videoUrl || ''}
                  onChange={(e) => onUpdateSlide({ ...slide, videoUrl: e.target.value })}
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-2 py-1.5 text-xs font-mono text-purple-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Sample Video Embed Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onUpdateSlide({ ...slide, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })}
                  className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5 text-purple-600" />
                  <span>Sample YouTube Video</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HIDDEN SPEAKER NOTES & PRIVATE ANNOTATIONS LAYER */}
        {activeTab === 'presenter' && (
          <div className="space-y-4">
            {/* Privacy Notification Banner */}
            <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <EyeOff className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-white uppercase tracking-wide">
                    Hidden Notes Layer
                  </span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Excluded from Canvas
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                These notes and private reminders are strictly stored on the slide layer for presenter view & PowerPoint export. They will never render on the main presentation slide canvas.
              </p>
            </div>

            {/* Speaker Notes Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  Speaker Notes Text Script
                </label>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold">
                  <span>{wordsCount} words</span>
                  <span>•</span>
                  <span>~{estSpeakingTimeSec}s talking</span>
                </div>
              </div>

              <textarea
                value={slide.speakerNotes || ''}
                onChange={(e) => onUpdateSlide({ ...slide, speakerNotes: e.target.value })}
                rows={7}
                placeholder="Type private presenter notes, talking points, or speech script here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white resize-none leading-relaxed transition shadow-2xs placeholder:text-slate-400"
              />

              {/* Action Toolbar for Notes */}
              <div className="flex items-center justify-between mt-2 pt-1">
                <button
                  type="button"
                  onClick={handleAutoDraftNotes}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition cursor-pointer"
                  title="Auto-draft talking points based on current slide content"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Draft Talking Points</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyNotes}
                    disabled={!notesText}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                    title="Copy speaker notes to clipboard"
                  >
                    {copiedNotes ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {notesText && (
                    <button
                      type="button"
                      onClick={() => onUpdateSlide({ ...slide, speakerNotes: '' })}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Clear Notes"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Private Presenter Action Reminders / Checklist */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-amber-600" />
                  Private Slide Reminders ({slide.privateChecklist?.length || 0})
                </label>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded">
                  Presenter Only
                </span>
              </div>

              {/* Add New Checklist Item Input */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCheckitemText}
                  onChange={(e) => setNewCheckitemText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCheckitem()}
                  placeholder="e.g. Pause for 3 sec after stats reveal..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCheckitem}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition shrink-0 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reminders List */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                {(slide.privateChecklist || []).length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-1">
                    No private reminders added yet. Add cues like "Mention competitor pricing" or "Emphasize Q3 target".
                  </p>
                ) : (
                  (slide.privateChecklist || []).map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded-xl border transition ${
                        item.done
                          ? 'bg-slate-100/70 border-slate-200 text-slate-400 line-through'
                          : 'bg-white border-slate-200/80 text-slate-800 font-medium'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCheckitem(item.id)}
                        className="flex items-center gap-2 flex-1 text-left text-xs cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition ${
                            item.done
                              ? 'bg-amber-500 border-amber-500 text-slate-950'
                              : 'border-slate-300 bg-white hover:border-amber-400'
                          }`}
                        >
                          {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{item.text}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCheckitem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sign Language (ISL) Interpreter Cue Markers */}
            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-purple-900 text-xs">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Sign Language Interpreter Cues</span>
              </div>
              <p className="text-[11px] text-purple-700 font-medium leading-relaxed">
                Add timing markers or visual sign prompts for live ISL interpreter video sync during live streams.
              </p>
              <input
                type="text"
                placeholder="e.g. [0:15 ISL Pause - Highlight 6 Pillars]"
                className="w-full bg-white border border-purple-200 rounded-xl p-2 text-xs font-bold text-purple-900 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
              />
            </div>

            {/* Auto Advance Slide Timer */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <label className="font-extrabold text-slate-600 uppercase text-[10px] tracking-widest mb-1.5 block flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5 text-slate-500" />
                Presentation Auto-Advance Timer
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={300}
                  placeholder="0 (Manual Click)"
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <span className="text-xs font-bold text-slate-500 shrink-0">sec</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI COPILOT & TRANSLATE */}
        {activeTab === 'copilot' && (
          <div className="space-y-5">
            {/* AI Slide Rewrite Box */}
            <div className="p-3.5 bg-linear-to-br from-blue-50 to-indigo-50/80 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-black text-blue-900 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  AI Slide Magic Rewrite
                </label>
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Gemini AI
                </span>
              </div>

              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                Instruction for AI to rewrite or enhance this slide (e.g. "Add 3 stat metrics", "Rewrite bullets for investor pitch"):
              </p>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. Make this slide punchier, highlight $42M TAM, and add key takeaways for Series A investors..."
                className="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />

              <button
                type="button"
                onClick={handleAiRewriteSlide}
                disabled={isAiGenerating || !aiPrompt.trim()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isAiGenerating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    <span>AI Rewriting Slide...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Rewrite Active Slide</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Auto Speaker Notes */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                1-Tap Speaker Notes Generator
              </label>

              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Generate structured, talk-track speaker notes with timing cues directly from this slide's title and takeaways.
              </p>

              <button
                type="button"
                onClick={handleAiSpeakerNotes}
                disabled={isAiGenerating}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Draft Speaker Notes</span>
              </button>
            </div>

            {/* AI Slide Translator */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <label className="font-extrabold text-slate-700 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                Multi-Language Slide Translator
              </label>

              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Translate slide content into target language or accessibility gloss (ISL Sign Language):
              </p>

              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
              >
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="Chinese">Chinese (中文)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="ISL Gloss">Indian Sign Language (ISL Gloss)</option>
              </select>

              <button
                type="button"
                onClick={handleTranslateSlide}
                disabled={isTranslating}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isTranslating ? (
                  <span>Translating...</span>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Translate Slide Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: ACCESSIBILITY & WCAG 2.1 SCANNER */}
        {activeTab === 'a11y' && (
          <div className="space-y-4">
            {/* GLOBAL DECK ACCESSIBILITY HEALTH SCORE SUMMARY */}
            <div className="p-4 rounded-2xl border bg-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-200">
                    Deck Accessibility Score
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
                  Grade {globalDeckGrade}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-1.5">
                    <span>{globalDeckA11yScore}</span>
                    <span className="text-xs text-slate-400 font-bold">/ 100</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {slidesNeedingAttentionCount === 0
                      ? 'All slides meet WCAG 2.1 AA accessibility guidelines.'
                      : `${slidesNeedingAttentionCount} of ${deckSlidesList.length} slide${deckSlidesList.length > 1 ? 's' : ''} need attention.`}
                  </p>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="text-xs font-black text-amber-400">
                    {slidesNeedingAttentionCount} Slide{slidesNeedingAttentionCount === 1 ? '' : 's'} Flagged
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    {deckTotalCritical} Critical • {deckTotalWarning} Warnings
                  </div>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <div className="text-slate-400 font-bold">Total Slides</div>
                  <div className="text-sm font-black text-white">{deckSlidesList.length}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <div className="text-slate-400 font-bold">Needing Fixes</div>
                  <div className="text-sm font-black text-amber-400">{slidesNeedingAttentionCount}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <div className="text-slate-400 font-bold">Compliant</div>
                  <div className="text-sm font-black text-emerald-400">
                    {deckSlidesList.length - slidesNeedingAttentionCount}
                  </div>
                </div>
              </div>
            </div>

            {/* DECK SLIDES ACCESSIBILITY MATRIX LIST */}
            {deckSlidesList.length > 1 && (
              <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <span>Deck Audit Matrix</span>
                  <span>{slidesNeedingAttentionCount} Issue{slidesNeedingAttentionCount === 1 ? '' : 's'}</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {deckA11yScans.map((scan) => {
                    const isCurrent = scan.index === activeSlideIndex;
                    const hasIssues = scan.issues.length > 0;

                    return (
                      <div
                        key={scan.slide.id || scan.index}
                        onClick={() => onSelectSlide && onSelectSlide(scan.index)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 ${
                              isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            #{scan.index + 1}
                          </span>
                          <span className="truncate text-[11px] font-bold">
                            {scan.slide.title || 'Untitled Slide'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {hasIssues ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                scan.critical > 0
                                  ? isCurrent
                                    ? 'bg-red-400 text-red-950'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                  : isCurrent
                                  ? 'bg-amber-300 text-slate-950'
                                  : 'bg-amber-100 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {scan.issues.length} Issue{scan.issues.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 ${
                                isCurrent
                                  ? 'bg-emerald-400 text-emerald-950'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Passing</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTIVE SLIDE DETAILED ACCESSIBILITY AUDIT */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Active Slide #{activeSlideIndex + 1} Scan</span>
                </h4>
                <span className="text-[10px] font-extrabold text-slate-600">
                  {accessibilityIssues.length} issue{accessibilityIssues.length === 1 ? '' : 's'}
                </span>
              </div>

              {accessibilityIssues.length === 0 ? (
                <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl text-center space-y-1.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-xs text-emerald-950">Active Slide Passes All Checks</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Visual contrast ratios, title heading, and image alt-text meet WCAG 2.1 AA standards.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {accessibilityIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3 rounded-2xl border space-y-2 transition ${
                        issue.severity === 'critical'
                          ? 'bg-red-50/60 border-red-200'
                          : issue.severity === 'warning'
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-blue-50/60 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {issue.severity === 'critical' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          ) : issue.severity === 'warning' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                          <h4 className="font-black text-xs text-slate-900">{issue.title}</h4>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            issue.severity === 'critical'
                              ? 'bg-red-200 text-red-900'
                              : issue.severity === 'warning'
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-blue-200 text-blue-900'
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="text-[11px] font-extrabold text-slate-900 bg-white/80 p-2 rounded-xl border border-slate-200/80">
                        <span className="text-slate-500 font-bold uppercase text-[9px] block">Action:</span>
                        {issue.suggestion}
                      </div>

                      {/* Auto Fix Button */}
                      {issue.autoFix && (
                        <button
                          type="button"
                          onClick={() => onUpdateSlide(issue.autoFix!(slide))}
                          className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>1-Tap Auto-Fix Issue</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slide Layout Picker Gallery Modal */}
      <SlideLayoutPickerModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        currentLayout={slide.layout}
        onSelectLayout={(newLayout) => onUpdateSlide({ ...slide, layout: newLayout })}
      />

      {/* Image & Icon Library Browser Modal */}
      <ImageLibraryModal
        isOpen={isImageLibraryOpen}
        onClose={() => setIsImageLibraryOpen(false)}
        slide={slide}
        onUpdateSlide={onUpdateSlide}
      />
    </aside>
  );
};
