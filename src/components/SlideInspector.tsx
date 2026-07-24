import React from 'react';
import { Sliders, Layout, MessageSquare, Tag, Plus, Trash2, FileText } from 'lucide-react';
import { SlideData, SlideLayoutType, ThemePreset } from '../types';

interface SlideInspectorProps {
  slide: SlideData;
  theme: ThemePreset;
  onUpdateSlide: (updated: SlideData) => void;
}

export const SlideInspector: React.FC<SlideInspectorProps> = ({
  slide,
  theme,
  onUpdateSlide,
}) => {
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
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 h-full text-slate-700 text-xs overflow-y-auto z-10">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 font-extrabold flex items-center gap-2 text-slate-800 bg-slate-50">
        <Sliders className="w-4 h-4 text-blue-600" />
        <span>SLIDE PROPERTIES</span>
      </div>

      <div className="p-4 space-y-5">
        {/* Layout Switcher */}
        <div>
          <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest mb-1.5 block flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-slate-400" />
            Slide Layout Type
          </label>
          <select
            value={slide.layout}
            onChange={(e) => onUpdateSlide({ ...slide, layout: e.target.value as SlideLayoutType })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition"
          >
            {layouts.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Accent Badge Tag */}
        <div>
          <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest mb-1.5 block flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Top Accent Tag
          </label>
          <input
            type="text"
            value={slide.accentBadge || ''}
            onChange={(e) => onUpdateSlide({ ...slide, accentBadge: e.target.value })}
            placeholder="e.g. DEAF-FIRST UX, SERIES A"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>

        {/* Speaker Notes */}
        <div>
          <label className="font-extrabold text-slate-500 uppercase text-[10px] tracking-widest mb-1.5 block flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            Presenter Speaker Notes
          </label>
          <textarea
            value={slide.speakerNotes || ''}
            onChange={(e) => onUpdateSlide({ ...slide, speakerNotes: e.target.value })}
            rows={5}
            placeholder="Notes for presentation mode or exported PPTX notes page..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white resize-none leading-relaxed text-xs font-medium transition"
          />
        </div>

        {/* Slide Stats Manager if stats layout */}
        {slide.layout === 'stats' && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-extrabold text-slate-500 text-[10px] uppercase tracking-wider">
              <span>Manage Metric Cards</span>
              <button
                onClick={() => {
                  const current = slide.stats || [];
                  onUpdateSlide({
                    ...slide,
                    stats: [...current, { value: '100%', label: 'Metric Name', sublabel: 'Sub text' }],
                  });
                }}
                className="text-blue-600 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Stat
              </button>
            </div>
            {(slide.stats || []).map((st, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">Stat #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = (slide.stats || []).filter((_, i) => i !== idx);
                      onUpdateSlide({ ...slide, stats: updated });
                    }}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => {
                    const newStats = [...(slide.stats || [])];
                    newStats[idx] = { ...newStats[idx], value: e.target.value };
                    onUpdateSlide({ ...slide, stats: newStats });
                  }}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-900 font-bold"
                  placeholder="Value"
                />
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => {
                    const newStats = [...(slide.stats || [])];
                    newStats[idx] = { ...newStats[idx], label: e.target.value };
                    onUpdateSlide({ ...slide, stats: newStats });
                  }}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                  placeholder="Label"
                />
              </div>
            ))}
          </div>
        )}

        {/* Slide Cards Manager if pillars/cards layout */}
        {(slide.layout === 'pillars' || slide.layout === 'cards') && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-extrabold text-slate-500 text-[10px] uppercase tracking-wider">
              <span>Manage Cards ({slide.cards?.length || 0})</span>
              <button
                onClick={() => {
                  const current = slide.cards || [];
                  onUpdateSlide({
                    ...slide,
                    cards: [...current, { tag: 'TAG', title: 'New Card Title', description: 'Description text' }],
                  });
                }}
                className="text-blue-600 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Card
              </button>
            </div>
            {(slide.cards || []).map((cd, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">Card #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = (slide.cards || []).filter((_, i) => i !== idx);
                      onUpdateSlide({ ...slide, cards: updated });
                    }}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
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
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-900 font-bold"
                  placeholder="Title"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
