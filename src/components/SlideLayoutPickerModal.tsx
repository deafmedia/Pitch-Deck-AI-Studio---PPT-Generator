import React, { useState } from 'react';
import {
  X,
  Layout,
  Grid,
  List,
  BarChart3,
  Columns,
  Layers,
  Table as TableIcon,
  Clock,
  Users,
  Target,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { SlideLayoutType } from '../types';

export interface LayoutOption {
  id: SlideLayoutType;
  label: string;
  category: 'overview' | 'data' | 'structure' | 'comparison';
  description: string;
  recommendedFor: string;
  icon: React.ReactNode;
  previewGraphic: React.ReactNode;
}

export const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: 'title',
    label: 'Title / Cover',
    category: 'overview',
    description: 'High-impact title card with subtitle, category badge, and key takeaway bullet points.',
    recommendedFor: 'Opening slide, section dividers, project pitches',
    icon: <Layout className="w-4 h-4 text-blue-500" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2.5 flex flex-col justify-between border border-slate-700/80">
        <div className="flex justify-between items-center">
          <div className="h-1.5 w-12 bg-blue-500 rounded" />
          <div className="h-1.5 w-8 bg-slate-700 rounded-full" />
        </div>
        <div className="space-y-1 my-auto">
          <div className="h-3 w-3/4 bg-white rounded font-bold" />
          <div className="h-1.5 w-1/2 bg-slate-400 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 w-1/3 bg-slate-700 rounded" />
          <div className="h-1.5 w-1/3 bg-slate-700 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'stats',
    label: 'Key Stats & Metrics',
    category: 'data',
    description: 'Highlight performance numbers, financial traction, and key data metrics.',
    recommendedFor: 'Investor stats, growth figures, metrics summary',
    icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="grid grid-cols-2 gap-1.5 my-auto">
          <div className="p-1.5 bg-slate-800 rounded border border-emerald-500/40">
            <div className="h-2.5 w-8 bg-emerald-400 rounded font-black" />
            <div className="h-1 w-10 bg-slate-400 rounded mt-1" />
          </div>
          <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
            <div className="h-2.5 w-8 bg-blue-400 rounded font-black" />
            <div className="h-1 w-10 bg-slate-400 rounded mt-1" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'pillars',
    label: '6 Pillars / Value Grid',
    category: 'structure',
    description: 'Six structured value cards or architectural design pillars with top accents.',
    recommendedFor: 'Product strategy, design principles, framework pillars',
    icon: <Layers className="w-4 h-4 text-purple-500" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="grid grid-cols-3 gap-1 my-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-1 bg-slate-800 rounded border border-slate-700 flex flex-col justify-between">
              <div className="h-0.5 w-3 bg-purple-400 rounded" />
              <div className="h-1.5 w-full bg-slate-300 rounded mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'cards',
    label: 'Feature Cards Grid',
    category: 'structure',
    description: 'Modular feature cards with category pills, title headers, and description copy.',
    recommendedFor: 'Feature tours, service lists, product highlights',
    icon: <Columns className="w-4 h-4 text-indigo-500" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="grid grid-cols-3 gap-1.5 my-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`p-1.5 bg-slate-800 rounded border ${i === 0 ? 'border-indigo-500/60' : 'border-slate-700'}`}>
              <div className="h-1 w-6 bg-indigo-400 rounded mb-1" />
              <div className="h-2 w-full bg-slate-200 rounded" />
              <div className="h-1 w-3/4 bg-slate-500 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'problem_solution',
    label: 'Problem vs Solution',
    category: 'comparison',
    description: 'Side-by-side comparison separating the core problem from the engineered solution.',
    recommendedFor: 'Pitch decks, market pain points, product launch',
    icon: <Grid className="w-4 h-4 text-rose-500" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="grid grid-cols-2 gap-1.5 my-auto">
          <div className="p-1.5 bg-rose-950/40 rounded border border-rose-500/40">
            <div className="h-1.5 w-10 bg-rose-400 rounded mb-1" />
            <div className="h-1 w-full bg-slate-400 rounded" />
          </div>
          <div className="p-1.5 bg-emerald-950/40 rounded border border-emerald-500/40">
            <div className="h-1.5 w-10 bg-emerald-400 rounded mb-1" />
            <div className="h-1 w-full bg-slate-300 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'table',
    label: 'Comparison Table',
    category: 'comparison',
    description: 'Structured data matrix for comparing features, competitors, or specs.',
    recommendedFor: 'Pricing tiers, competitor matrices, technical specs',
    icon: <TableIcon className="w-4 h-4 text-cyan-500" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="bg-slate-800 rounded border border-slate-700 p-1 space-y-1 my-auto">
          <div className="flex gap-1 border-b border-slate-700 pb-1">
            <div className="h-1.5 w-1/3 bg-cyan-400 rounded" />
            <div className="h-1.5 w-1/3 bg-slate-400 rounded" />
            <div className="h-1.5 w-1/3 bg-slate-400 rounded" />
          </div>
          <div className="flex gap-1">
            <div className="h-1 w-1/3 bg-slate-300 rounded" />
            <div className="h-1 w-1/3 bg-slate-500 rounded" />
            <div className="h-1 w-1/3 bg-slate-500 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'timeline',
    label: 'Roadmap & Timeline',
    category: 'structure',
    description: 'Sequential step-by-step roadmap or release schedule with milestones.',
    recommendedFor: 'Product roadmaps, rollout phases, journey mapping',
    icon: <Clock className="w-4 h-4 text-amber-500" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="grid grid-cols-4 gap-1 my-auto">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="p-1 bg-slate-800 rounded border border-amber-500/30 flex flex-col justify-between">
              <div className="text-[8px] font-bold text-amber-400">0{step}</div>
              <div className="h-1.5 w-full bg-slate-200 rounded my-0.5" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'market',
    label: 'Market & Opportunity',
    category: 'data',
    description: 'TAM, SAM, SOM market sizing cards with target demographics and visual rings.',
    recommendedFor: 'Market sizing, investor pitches, TAM analysis',
    icon: <Target className="w-4 h-4 text-amber-400" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="flex items-center justify-around my-auto">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border border-blue-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-12 bg-amber-400 rounded" />
            <div className="h-1.5 w-16 bg-blue-400 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'team',
    label: 'Team & Contributors',
    category: 'overview',
    description: 'Showcase leadership team, founders, key advisors, or interpreter staff.',
    recommendedFor: 'Company overview, team slides, advisor boards',
    icon: <Users className="w-4 h-4 text-teal-400" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="grid grid-cols-3 gap-1 my-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-1 bg-slate-800 rounded border border-slate-700 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-teal-500/30 border border-teal-400 mb-0.5" />
              <div className="h-1 w-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'cta',
    label: 'Call to Action / Next',
    category: 'overview',
    description: 'Closing pitch summary card, download action prompt, or contact info.',
    recommendedFor: 'Closing slide, contact information, export prompt',
    icon: <Sparkles className="w-4 h-4 text-blue-400" />,
    previewGraphic: (
      <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between border border-slate-700/80">
        <div className="h-2 w-1/3 bg-slate-400 rounded mb-1" />
        <div className="p-2 bg-blue-950/50 border border-blue-500/40 rounded flex flex-col items-center justify-center my-auto space-y-1">
          <div className="h-2 w-20 bg-white rounded font-bold" />
          <div className="h-3 w-12 bg-blue-600 rounded" />
        </div>
      </div>
    ),
  },
];

interface SlideLayoutPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayout: SlideLayoutType;
  onSelectLayout: (layout: SlideLayoutType) => void;
}

export const SlideLayoutPickerModal: React.FC<SlideLayoutPickerModalProps> = ({
  isOpen,
  onClose,
  currentLayout,
  onSelectLayout,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'overview' | 'data' | 'structure' | 'comparison'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!isOpen) return null;

  const filteredLayouts = LAYOUT_OPTIONS.filter((l) => {
    if (activeCategory === 'all') return true;
    return l.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>SLIDE LAYOUT GALLERY</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  {LAYOUT_OPTIONS.length} Layouts
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Choose a visual slide layout blueprint to reframe your slide content instantly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & View Toggle */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-bold gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Layouts ({LAYOUT_OPTIONS.length})
            </button>
            <button
              onClick={() => setActiveCategory('overview')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeCategory === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cover & Overview
            </button>
            <button
              onClick={() => setActiveCategory('data')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeCategory === 'data'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data & Metrics
            </button>
            <button
              onClick={() => setActiveCategory('structure')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeCategory === 'structure'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cards & Roadmaps
            </button>
            <button
              onClick={() => setActiveCategory('comparison')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeCategory === 'comparison'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comparison & Tables
            </button>
          </div>

          {/* Grid / List View Selector */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Visual Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLayouts.map((option) => {
                const isSelected = currentLayout === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => {
                      onSelectLayout(option.id);
                      onClose();
                    }}
                    className={`group border rounded-2xl p-4 flex flex-col justify-between transition cursor-pointer relative hover:shadow-lg ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      {/* Mini Preview Card */}
                      <div className="mb-3 rounded-xl overflow-hidden shadow-xs">
                        {option.previewGraphic}
                      </div>

                      {/* Header */}
                      <div className="flex items-center gap-2 mb-1">
                        {option.icon}
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition">
                          {option.label}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed mb-3 font-medium">
                        {option.description}
                      </p>
                    </div>

                    {/* Footer Badge */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>{option.recommendedFor}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLayouts.map((option) => {
                const isSelected = currentLayout === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => {
                      onSelectLayout(option.id);
                      onClose();
                    }}
                    className={`p-3.5 border rounded-2xl flex items-center justify-between gap-4 transition cursor-pointer hover:shadow-sm ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {option.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs text-slate-900">{option.label}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-blue-600 transition"
                    >
                      {isSelected ? 'Selected' : 'Apply Layout'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Changing layout preserves your main title & auto-maps slide content.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-xl transition cursor-pointer"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
