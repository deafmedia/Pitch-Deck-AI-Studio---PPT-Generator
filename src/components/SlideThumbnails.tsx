import React from 'react';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, LayoutGrid } from 'lucide-react';
import { SlideData, SlideLayoutType } from '../types';

interface SlideThumbnailsProps {
  slides: SlideData[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: (layout: SlideLayoutType) => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (index: number, direction: 'up' | 'down') => void;
}

export const SlideThumbnails: React.FC<SlideThumbnailsProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
}) => {
  const [showAddMenu, setShowAddMenu] = React.useState(false);

  const layouts: { id: SlideLayoutType; label: string }[] = [
    { id: 'title', label: 'Title / Cover' },
    { id: 'stats', label: 'Key Stats & Metrics' },
    { id: 'pillars', label: '6 Pillars / Value Cards' },
    { id: 'cards', label: 'Feature Cards Grid' },
    { id: 'problem_solution', label: 'Problem vs Solution' },
    { id: 'table', label: 'Comparison Table' },
    { id: 'timeline', label: 'Roadmap & Timeline' },
    { id: 'cta', label: 'Call to Action' },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 h-full select-none z-10">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 bg-white">
        <span className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-blue-600" />
          <span>SLIDES ({slides.length})</span>
        </span>

        {/* Add Slide Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs shadow-blue-200 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          {showAddMenu && (
            <div className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-slate-700 text-xs">
              <div className="px-3 py-1 font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">
                Select Layout
              </div>
              {layouts.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onAddSlide(l.id);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 font-semibold flex items-center justify-between transition cursor-pointer"
                >
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          return (
            <div
              key={slide.id || index}
              className={`group relative rounded-xl border text-left p-2.5 transition cursor-pointer ${
                isActive
                  ? 'border-blue-600 bg-white shadow-md shadow-blue-500/10 ring-2 ring-blue-600/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
              onClick={() => onSelectSlide(index)}
            >
              {/* Slide Number Badge */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className={`w-4 h-4 rounded text-center leading-4 text-[10px] font-extrabold ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="uppercase text-[9px] tracking-wider text-slate-400 font-mono font-bold">
                    {slide.layout}
                  </span>
                </span>

                {/* Quick Slide Actions on Hover & Touch */}
                <div className="sm:opacity-0 sm:group-hover:opacity-100 opacity-100 flex items-center gap-1 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(index, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1.5 rounded-md hover:bg-slate-100 active:bg-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(index, 'down');
                    }}
                    disabled={index === slides.length - 1}
                    className="p-1.5 rounded-md hover:bg-slate-100 active:bg-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSlide(index);
                    }}
                    className="p-1.5 rounded-md hover:bg-slate-100 active:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSlide(index);
                      }}
                      className="p-1.5 rounded-md hover:bg-red-50 active:bg-red-100 text-red-500 hover:text-red-700 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Thumbnail 16:9 Mini Canvas Preview */}
              <div className="aspect-[16/9] w-full bg-slate-900 rounded-lg border border-slate-800 p-2 overflow-hidden flex flex-col justify-between shadow-xs">
                <div>
                  {slide.eyebrow && (
                    <div className="text-[7px] text-blue-400 uppercase font-black tracking-widest truncate">
                      {slide.eyebrow}
                    </div>
                  )}
                  <div className="text-[10px] font-extrabold text-white line-clamp-2 leading-tight mt-0.5">
                    {slide.title || 'Untitled Slide'}
                  </div>
                </div>

                <div className="text-[8px] text-slate-400 truncate font-medium">
                  {slide.subtitle || `${slide.bullets?.length || 0} bullet items`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
