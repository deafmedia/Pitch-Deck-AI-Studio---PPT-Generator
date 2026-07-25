import React, { useEffect, useState } from 'react';
import { PitchDeck } from '../types';
import { Award, CheckCircle2, AlertTriangle, Sparkles, X, FileText, BarChart3, ArrowRight, Lightbulb, MessageSquare, ShieldCheck } from 'lucide-react';

interface PitchAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: PitchDeck;
  onOpenAiModal?: () => void;
  onExportPptx?: () => void;
}

interface AnalyticsData {
  score: number;
  grade: string;
  slideCount: number;
  speakerNotesCoverage: string;
  clarityScore: number;
  designDensity: string;
  feedback: string[];
  recommendations: string[];
}

export const PitchAnalyticsModal: React.FC<PitchAnalyticsModalProps> = ({
  isOpen,
  onClose,
  deck,
  onOpenAiModal,
  onExportPptx,
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && deck) {
      setIsLoading(true);
      fetch('/api/deck-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deck }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAnalytics(data);
        })
        .catch((err) => console.error('Analytics Fetch Error:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, deck]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shadow-xs">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight">Pitch Deck Health Score</h2>
              <p className="text-xs text-slate-400 font-medium">AI & Investor Readiness Analysis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {isLoading || !analytics ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <BarChart3 className="w-8 h-8 text-blue-600 animate-bounce" />
              <p className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">
                Analyzing slide layout, clarity, and pacing...
              </p>
            </div>
          ) : (
            <>
              {/* Score Header Hero */}
              <div className="p-5 bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full inline-block">
                    Investor Readiness Grade
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                    <span>{analytics.score}/100</span>
                    <span className="text-lg font-extrabold text-blue-600">({analytics.grade})</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Evaluated across {analytics.slideCount} slides with {analytics.speakerNotesCoverage} presenter notes coverage.
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-blue-600 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                  <span className="text-xs font-black text-amber-400">{analytics.grade}</span>
                  <span className="text-[9px] font-bold text-slate-400">RATING</span>
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Slide Count</div>
                  <div className="text-lg font-black text-slate-900">{analytics.slideCount} Slides</div>
                  <div className="text-[10px] font-bold text-emerald-600 mt-0.5">Optimal Range</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Clarity Rating</div>
                  <div className="text-lg font-black text-slate-900">{analytics.clarityScore}%</div>
                  <div className="text-[10px] font-bold text-blue-600 mt-0.5">High Legibility</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Design Density</div>
                  <div className="text-lg font-black text-slate-900">{analytics.designDensity}</div>
                  <div className="text-[10px] font-bold text-purple-600 mt-0.5">Scannable UX</div>
                </div>
              </div>

              {/* Positive Strengths & Feedback List */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Key Audit Findings
                </h4>
                <div className="space-y-1.5">
                  {analytics.feedback.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs font-medium text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Recommendations */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  Recommended Action Steps
                </h4>
                <ul className="space-y-1 text-xs text-amber-950 font-medium">
                  {analytics.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {onOpenAiModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAiModal();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI Deck Builder</span>
                  </button>
                )}

                {onExportPptx && (
                  <button
                    onClick={() => {
                      onClose();
                      onExportPptx();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs"
                  >
                    <span>Export PPTX</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
