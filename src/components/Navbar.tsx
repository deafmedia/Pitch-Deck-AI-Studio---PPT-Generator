import React from 'react';
import { Presentation, Download, Sparkles, Play, Palette, FileSpreadsheet, Share2, Radio, Search, X, Layout, CornerDownLeft, Undo2, Redo2, FolderTree, User, LogOut, LogIn, Loader2, CheckCircle2 } from 'lucide-react';
import { PitchDeck, ThemePresetId, SlideData } from '../types';
import { THEME_PRESETS, SAMPLE_DECKS } from '../data/templates';
import { exportDeckToPptx } from '../lib/pptxExport';
import { UserProfile } from './AuthScreen';

interface NavbarProps {
  currentDeck: PitchDeck;
  saveStatus?: 'idle' | 'saving' | 'saved';
  onSelectSlideIndex?: (index: number) => void;
  onSelectDeck: (deck: PitchDeck) => void;
  onThemeChange: (themeId: ThemePresetId) => void;
  onOpenAiModal: () => void;
  onStartPresenting: () => void;
  onStartLiveStream: () => void;
  onOpenExportModal: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenFileExplorer?: () => void;
  onOpenAnalyticsModal?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDeck,
  saveStatus = 'saved',
  onSelectSlideIndex,
  onSelectDeck,
  onThemeChange,
  onOpenAiModal,
  onStartPresenting,
  onStartLiveStream,
  onOpenExportModal,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onOpenFileExplorer,
  onOpenAnalyticsModal,
  currentUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const searchContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Global hotkey shortcut for Search (⌘K or /)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper search filter across all slide properties
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    return currentDeck.slides
      .map((slide, originalIndex) => {
        const titleMatch = slide.title?.toLowerCase().includes(q);
        const subtitleMatch = slide.subtitle?.toLowerCase().includes(q);
        const eyebrowMatch = slide.eyebrow?.toLowerCase().includes(q);
        const badgeMatch = slide.accentBadge?.toLowerCase().includes(q);
        const bulletMatch = slide.bullets?.some((b) => b.toLowerCase().includes(q));
        const statsMatch = slide.stats?.some(
          (s) => s.value.toLowerCase().includes(q) || s.label.toLowerCase().includes(q) || s.sublabel?.toLowerCase().includes(q)
        );
        const cardsMatch = slide.cards?.some(
          (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tag?.toLowerCase().includes(q)
        );
        const notesMatch = slide.speakerNotes?.toLowerCase().includes(q);

        const isMatch =
          titleMatch || subtitleMatch || eyebrowMatch || badgeMatch || bulletMatch || statsMatch || cardsMatch || notesMatch;

        // Snippet preview logic
        let snippet = slide.subtitle || '';
        if (bulletMatch && slide.bullets) {
          const matchedBullet = slide.bullets.find((b) => b.toLowerCase().includes(q));
          if (matchedBullet) snippet = `• ${matchedBullet}`;
        } else if (cardsMatch && slide.cards) {
          const matchedCard = slide.cards.find((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
          if (matchedCard) snippet = `Card: ${matchedCard.title} - ${matchedCard.description}`;
        } else if (statsMatch && slide.stats) {
          const matchedStat = slide.stats.find((s) => s.value.toLowerCase().includes(q) || s.label.toLowerCase().includes(q));
          if (matchedStat) snippet = `Metric: ${matchedStat.value} ${matchedStat.label}`;
        } else if (notesMatch && slide.speakerNotes) {
          snippet = `Notes: ${slide.speakerNotes}`;
        }

        return {
          slide,
          index: originalIndex,
          isMatch,
          snippet,
        };
      })
      .filter((item) => item.isMatch);
  }, [searchQuery, currentDeck.slides]);

  // Handle keyboard navigation inside search input
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      searchInputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      const target = searchResults[selectedIndex] || searchResults[0];
      if (target && onSelectSlideIndex) {
        onSelectSlideIndex(target.index);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

  const handleSelectResult = (index: number) => {
    if (onSelectSlideIndex) {
      onSelectSlideIndex(index);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-5 flex items-center justify-between gap-3 text-slate-800 shrink-0 shadow-2xs z-30 sticky top-0">
      {/* Brand & Deck Title */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-xs ring-1 ring-blue-500/20 shrink-0">
          <span className="text-white font-black text-xs italic tracking-tight">AC</span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            ALL CREATE <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black">STUDIO</span>
          </h1>

          <span className="hidden lg:inline-block w-px h-3.5 bg-slate-200/80 shrink-0" />

          {/* Active Deck Title */}
          <span
            className="hidden sm:inline-block font-extrabold text-xs text-slate-700 truncate max-w-[100px] md:max-w-[160px] lg:max-w-[220px]"
            title={currentDeck.title}
          >
            {currentDeck.title}
          </span>

          {/* Auto-saving Status Indicator Badge */}
          {saveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300/80 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 animate-fade-in">
              <Loader2 className="w-2.5 h-2.5 text-amber-600 animate-spin" />
              <span className="hidden md:inline">Saving...</span>
            </span>
          )}

          {saveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 animate-fade-in">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              <span className="hidden md:inline">Saved</span>
            </span>
          )}

          {/* Pitch Health Score Button */}
          {onOpenAnalyticsModal && (
            <button
              onClick={onOpenAnalyticsModal}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/90 rounded-full text-[10px] font-extrabold tracking-wide uppercase shrink-0 transition cursor-pointer active:scale-95 shadow-2xs"
              title="View Deck Health Score & AI Pitch Analysis"
            >
              <Sparkles className="w-2.5 h-2.5 text-blue-600" />
              <span className="hidden sm:inline">Pitch Score</span>
            </button>
          )}
        </div>
      </div>

      {/* Center Search Input & Preset/Theme Controls */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Global Slide Search Input */}
        <div ref={searchContainerRef} className="relative w-32 sm:w-44 md:w-56 lg:w-64 min-w-0 shrink">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
                setSelectedIndex(0);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search slides (⌘K)..."
              className="w-full bg-slate-100/80 border border-slate-200/80 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-150"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2 p-0.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <kbd className="absolute right-2 text-[9px] font-mono font-extrabold text-slate-400 bg-slate-200/60 px-1 py-0.5 rounded border border-slate-300/50 pointer-events-none hidden md:inline-block">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-3 py-2 bg-slate-50/90 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex justify-between items-center">
                    <span>{searchResults.length} {searchResults.length === 1 ? 'Slide Match' : 'Slide Matches'}</span>
                    <span className="font-medium text-slate-400">Press ↵ to jump</span>
                  </div>
                  {searchResults.map((res, idx) => (
                    <button
                      key={res.slide.id}
                      onClick={() => handleSelectResult(res.index)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left p-2.5 transition flex items-start gap-2.5 cursor-pointer ${
                        idx === selectedIndex ? 'bg-blue-50/90 border-l-4 border-blue-600' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200/80 rounded-md text-[10px] font-mono font-bold text-slate-700 shrink-0 shadow-2xs">
                        #{res.index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {res.slide.title}
                          </h4>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 border border-blue-200/80 px-1.5 py-0.5 rounded-full shrink-0">
                            {res.slide.layout}
                          </span>
                        </div>
                        {res.snippet && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                            {res.snippet}
                          </p>
                        )}
                      </div>
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 shrink-0 self-center" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 font-medium">
                  No slides match "<span className="font-bold text-slate-800">{searchQuery}</span>"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Presentation File Explorer Button */}
        {onOpenFileExplorer && (
          <button
            onClick={onOpenFileExplorer}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 transition cursor-pointer active:scale-95 shrink-0"
            title="Open Presentation File Explorer"
          >
            <FolderTree className="w-3.5 h-3.5 text-blue-600" />
            <span>Explorer</span>
          </button>
        )}


        {/* Theme Picker Dropdown */}
        <div className="hidden 2xl:flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 rounded-lg px-2 py-1 text-xs shrink-0">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400 font-semibold text-[10px]">Theme:</span>
          <select
            value={currentDeck.theme}
            onChange={(e) => onThemeChange(e.target.value as ThemePresetId)}
            className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer"
          >
            {Object.values(THEME_PRESETS).map((t) => (
              <option key={t.id} value={t.id} className="bg-white text-slate-800">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Global Undo & Redo History Controls */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-100/80 border border-slate-200/80 rounded-lg p-0.5 text-xs shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 rounded-md hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 rounded-md hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* AI Deck Generator Button */}
        <button
          onClick={onOpenAiModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-slate-950 hover:bg-slate-800 text-white shadow-xs transition cursor-pointer active:scale-95 border border-slate-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">AI Builder</span>
        </button>

        {/* Live Stream + Sign Language Interpreter Studio */}
        <button
          onClick={onStartLiveStream}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition cursor-pointer active:scale-95"
          title="Launch Live Stream Studio"
        >
          <Radio className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden xl:inline">Live Stream</span>
        </button>

        {/* Presenter Mode */}
        <button
          onClick={onStartPresenting}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition cursor-pointer active:scale-95"
          title="Start Fullscreen Interactive Presentation Mode"
        >
          <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          <span>Present</span>
        </button>

        {/* Download PPTX Direct */}
        <button
          onClick={() => exportDeckToPptx(currentDeck)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer active:scale-95"
          title="Download editable PowerPoint (.pptx)"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download PPTX</span>
          <span className="sm:hidden">PPTX</span>
        </button>

        {/* More Export Options */}
        <button
          onClick={onOpenExportModal}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer active:scale-95"
          title="Export Options (PDF, JSON)"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* User Account / Sign In Control */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition cursor-pointer"
            >
              <img
                src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full bg-slate-300 border border-white shrink-0 object-cover"
              />
              <span className="hidden 2xl:inline text-xs font-extrabold text-slate-800 truncate max-w-[80px]">
                {currentUser.name}
              </span>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="font-extrabold text-xs text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">{currentUser.email}</div>
                  <div className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-blue-100 text-blue-700">
                    {currentUser.role || 'Pro Member'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer active:scale-95"
            title="Sign In or Register Account"
          >
            <LogIn className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

