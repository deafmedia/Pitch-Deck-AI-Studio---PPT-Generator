import React from 'react';
import { SlideData, ThemePreset } from '../types';
import { Plus, Trash2, Edit2, CheckCircle2, TrendingUp, Layers, Table, Clock } from 'lucide-react';

interface SlideCanvasProps {
  slide: SlideData;
  theme: ThemePreset;
  onUpdateSlide: (updated: SlideData) => void;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  theme,
  onUpdateSlide,
}) => {
  const [editingField, setEditingField] = React.useState<string | null>(null);

  // Field change helper
  const updateField = (key: keyof SlideData, value: any) => {
    onUpdateSlide({
      ...slide,
      [key]: value,
    });
  };

  // Helper to add bullet point
  const handleAddBullet = () => {
    const current = slide.bullets || [];
    updateField('bullets', [...current, 'New key takeaway or bullet point']);
  };

  // Helper to remove bullet point
  const handleRemoveBullet = (index: number) => {
    const current = slide.bullets || [];
    updateField('bullets', current.filter((_, i) => i !== index));
  };

  // Helper to edit bullet point
  const handleEditBullet = (index: number, text: string) => {
    const current = [...(slide.bullets || [])];
    current[index] = text;
    updateField('bullets', current);
  };

  return (
    <main className="flex-1 bg-slate-100/80 p-4 sm:p-8 flex items-center justify-center overflow-auto relative">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />

      {/* 16:9 Widescreen Slide Container */}
      <div
        className="w-full max-w-5xl aspect-[16/9] rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between p-8 sm:p-12 relative transition-all border border-slate-200/80 z-10"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        {/* Top Header Row (Eyebrow & Accent Badge) */}
        <div className="flex items-center justify-between shrink-0 mb-4">
          {/* Eyebrow */}
          <input
            type="text"
            value={slide.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="EYEBROW / CATEGORY"
            className="text-xs font-bold uppercase tracking-widest bg-transparent focus:outline-none border-b border-transparent hover:border-slate-500/50 w-2/3"
            style={{ color: theme.accentColor }}
          />

          {/* Accent Badge */}
          {slide.accentBadge && (
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
              style={{
                borderColor: theme.accentColor,
                color: theme.accentColor,
                backgroundColor: `${theme.accentColor}15`,
              }}
            >
              {slide.accentBadge}
            </span>
          )}
        </div>

        {/* Main Content Area by Layout */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden my-2">
          {/* Slide Main Title */}
          <textarea
            value={slide.title}
            onChange={(e) => updateField('title', e.target.value)}
            rows={2}
            placeholder="Slide Main Title..."
            className="w-full font-bold text-2xl sm:text-4xl tracking-tight bg-transparent focus:outline-none resize-none leading-tight border-b border-transparent hover:border-slate-500/30 mb-2"
            style={{ color: theme.textColor }}
          />

          {/* Subtitle */}
          <input
            type="text"
            value={slide.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Add descriptive subtitle or core premise..."
            className="w-full text-sm sm:text-lg opacity-80 bg-transparent focus:outline-none border-b border-transparent hover:border-slate-500/30 mb-6"
            style={{ color: theme.secondaryColor }}
          />

          {/* LAYOUT: Title Cover */}
          {slide.layout === 'title' && (
            <div className="mt-4 space-y-3">
              {(slide.bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: theme.accentColor }} />
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleEditBullet(idx, e.target.value)}
                    className="w-full text-base sm:text-lg bg-transparent focus:outline-none border-b border-transparent hover:border-slate-500/30"
                  />
                  <button
                    onClick={() => handleRemoveBullet(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddBullet}
                className="flex items-center gap-1.5 text-xs font-semibold hover:underline opacity-80 mt-2"
                style={{ color: theme.accentColor }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Key Takeaway
              </button>
            </div>
          )}

          {/* LAYOUT: Stats & Metrics Grid */}
          {slide.layout === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(slide.stats || [
                  { value: '90', label: 'Pages Scope', sublabel: 'Complete UI map' },
                  { value: '6', label: 'Design Pillars', sublabel: 'Deaf-first rules' },
                  { value: '8', label: 'Patterns', sublabel: 'Reusable components' },
                  { value: '2', label: 'Visual Systems', sublabel: 'CMS & Calm Shell' },
                ]).map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border flex flex-col justify-between transition"
                    style={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.accentColor,
                    }}
                  >
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...(slide.stats || [])];
                        newStats[idx] = { ...newStats[idx], value: e.target.value };
                        updateField('stats', newStats);
                      }}
                      className="text-2xl sm:text-3xl font-extrabold bg-transparent focus:outline-none"
                      style={{ color: theme.accentColor }}
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...(slide.stats || [])];
                        newStats[idx] = { ...newStats[idx], label: e.target.value };
                        updateField('stats', newStats);
                      }}
                      className="text-xs sm:text-sm font-bold bg-transparent focus:outline-none mt-1"
                      style={{ color: theme.textColor }}
                    />
                    {stat.sublabel && (
                      <input
                        type="text"
                        value={stat.sublabel}
                        onChange={(e) => {
                          const newStats = [...(slide.stats || [])];
                          newStats[idx] = { ...newStats[idx], sublabel: e.target.value };
                          updateField('stats', newStats);
                        }}
                        className="text-[11px] opacity-70 bg-transparent focus:outline-none mt-0.5"
                        style={{ color: theme.secondaryColor }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Supporting bullets under stats */}
              {(slide.bullets || []).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-700/30">
                  {slide.bullets?.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: theme.accentColor }} />
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => handleEditBullet(idx, e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LAYOUT: Pillars & Cards Grid */}
          {(slide.layout === 'pillars' || slide.layout === 'cards') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {(slide.cards || [
                { tag: 'PILLAR 1', title: 'See First, Hear Never Required', description: 'Visual alerts, captions, ISL video clips, and vibration replace audio.' },
                { tag: 'PILLAR 2', title: 'Prove Identity in One Glance', description: 'Digital wallet pass with active color status, expiry date, and secure verification QR.' },
                { tag: 'PILLAR 3', title: 'Role Chooses the Door', description: 'Portal chooser splits Members, Admins, CAs, and Interpreters cleanly.' },
              ]).map((card, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border flex flex-col justify-between transition relative group"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: card.highlight ? theme.accentColor : theme.cardBorder,
                  }}
                >
                  <div>
                    {card.tag && (
                      <input
                        type="text"
                        value={card.tag}
                        onChange={(e) => {
                          const newCards = [...(slide.cards || [])];
                          newCards[idx] = { ...newCards[idx], tag: e.target.value };
                          updateField('cards', newCards);
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider bg-transparent focus:outline-none mb-1"
                        style={{ color: theme.accentColor }}
                      />
                    )}
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const newCards = [...(slide.cards || [])];
                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                        updateField('cards', newCards);
                      }}
                      className="text-xs sm:text-sm font-bold bg-transparent focus:outline-none w-full"
                      style={{ color: theme.textColor }}
                    />
                    <textarea
                      value={card.description}
                      onChange={(e) => {
                        const newCards = [...(slide.cards || [])];
                        newCards[idx] = { ...newCards[idx], description: e.target.value };
                        updateField('cards', newCards);
                      }}
                      rows={2}
                      className="text-[11px] opacity-80 bg-transparent focus:outline-none w-full mt-1.5 resize-none leading-relaxed"
                      style={{ color: theme.secondaryColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LAYOUT: Problem vs Solution */}
          {slide.layout === 'problem_solution' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Problem Column */}
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  The Problem / Challenge
                </div>
                {(slide.bullets || []).filter((_, idx) => idx % 2 === 0).map((b, idx) => (
                  <div key={idx} className="text-xs sm:text-sm leading-relaxed p-2 bg-slate-900/30 rounded border border-slate-800">
                    {b}
                  </div>
                ))}
              </div>

              {/* Solution Column */}
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.accentColor }}
              >
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider" style={{ color: theme.accentColor }}>
                  <CheckCircle2 className="w-4 h-4" />
                  Our Solution
                </div>
                {(slide.bullets || []).filter((_, idx) => idx % 2 === 1).map((b, idx) => (
                  <div key={idx} className="text-xs sm:text-sm leading-relaxed p-2 bg-slate-900/30 rounded border border-slate-800 font-medium">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LAYOUT: Table Comparison */}
          {slide.layout === 'table' && (
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: theme.cardBorder }}>
              <table className="w-full text-xs text-left">
                <thead style={{ backgroundColor: theme.cardBg }}>
                  <tr>
                    {(slide.tableColumns || [
                      { key: 'feature', label: 'Pattern Name' },
                      { key: 'concept', label: 'Design Specs' },
                      { key: 'usage', label: 'Primary Scope' },
                    ]).map((col) => (
                      <th key={col.key} className="p-2.5 font-bold border-b" style={{ borderColor: theme.cardBorder, color: theme.textColor }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(slide.tableRows || [
                    { feature: 'Progress Wizard', concept: 'Step-by-step progress, sticky CTA', usage: 'Register, Renew' },
                    { feature: 'Wallet Card', concept: 'Phone pass, status badge, QR', usage: 'Member ID, Interpreter' },
                    { feature: 'Ops Console', concept: 'KPI strip → filterable table', usage: 'Admin, CA Workspace' },
                  ]).map((row, idx) => (
                    <tr key={idx} className="border-b" style={{ borderColor: theme.cardBorder }}>
                      {slide.tableColumns?.map((col) => (
                        <td key={col.key} className="p-2.5" style={{ color: theme.secondaryColor }}>
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* LAYOUT: Roadmap / Timeline */}
          {slide.layout === 'timeline' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {(slide.timelineSteps || [
                { period: 'STEP 01', title: 'Member SOS', description: 'One tap triggers GPS alert.' },
                { period: 'STEP 02', title: 'Interpreter Match', description: 'Auto-routes to nearest ISL interpreter.' },
                { period: 'STEP 03', title: 'VRS Call Live', description: '2-way video relay stream.' },
                { period: 'STEP 04', title: 'Audit Logged', description: 'Incident archived securely.' },
              ]).map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border flex flex-col justify-between"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.accentColor }}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: theme.accentColor }}>
                    {step.period}
                  </span>
                  <div className="font-bold text-xs sm:text-sm mt-1" style={{ color: theme.textColor }}>
                    {step.title}
                  </div>
                  <div className="text-[11px] opacity-80 mt-1" style={{ color: theme.secondaryColor }}>
                    {step.description}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LAYOUT: Call to Action / Default */}
          {slide.layout === 'cta' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border text-center space-y-3" style={{ backgroundColor: theme.cardBg, borderColor: theme.accentColor }}>
                <h3 className="font-extrabold text-xl sm:text-2xl" style={{ color: theme.textColor }}>
                  Download & Export Pitch Presentation
                </h3>
                <p className="text-sm opacity-80 max-w-xl mx-auto" style={{ color: theme.secondaryColor }}>
                  Get native PowerPoint (.pptx) presentation files with full editable text, tables, and slide cards formatted for executive review.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Row */}
        <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between text-[11px] shrink-0 opacity-70">
          <span>Pitch Deck Studio • PowerPoint (.pptx) Ready</span>
          <span className="font-mono">16 : 9 Widescreen</span>
        </div>
      </div>
    </main>
  );
};
