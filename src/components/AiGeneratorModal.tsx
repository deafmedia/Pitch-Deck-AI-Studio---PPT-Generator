import React from 'react';
import { Sparkles, X, Loader2, ArrowRight, Wand2, FileText, CheckCircle } from 'lucide-react';
import { PitchDeck, ThemePresetId } from '../types';
import { THEME_PRESETS } from '../data/templates';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckGenerated: (deck: PitchDeck) => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onDeckGenerated,
}) => {
  const [prompt, setPrompt] = React.useState('');
  const [selectedTheme, setSelectedTheme] = React.useState<ThemePresetId>('corporate_blue');
  const [category, setCategory] = React.useState('Tech Startup');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a business prompt or paste your text brief.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          theme: selectedTheme,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate deck. Please try again.');
      }

      const data = await response.json();
      if (data.deck) {
        onDeckGenerated(data.deck);
        onClose();
      } else {
        throw new Error('No valid deck returned.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong while generating slides.');
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'DEF Demo — Deaf-First Digital Identity & Emergency VRS Network across India with 90 pages and 6 design pillars',
    'AI-powered legal contract review SaaS for law firms seeking $3M Seed funding',
    'Non-profit ocean plastic cleanup foundation requesting $1.5M grant for autonomous skimmer fleet',
    'EV charging network subscription platform with 10,000 active drivers and 250 kW fast hubs',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-800">
        {/* Top Bar */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200 font-bold">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">AI Pitch Deck Builder</h2>
              <p className="text-xs text-slate-500 font-medium">Powered by Gemini AI • Generates full slide deck in seconds</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Prompt Area */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Describe your Pitch, Business Idea, or Paste Design Brief
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. DEF Demo UX pitch deck for deaf-first digital identity, membership cards, and emergency VRS video relay service..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 resize-none leading-relaxed placeholder:text-slate-400 transition"
            />
          </div>

          {/* Preset Prompts Chips */}
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
              Sample Prompts to Try:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sp)}
                  className="text-left text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-semibold transition line-clamp-1 cursor-pointer"
                >
                  "{sp.substring(0, 55)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Visual Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as ThemePresetId)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {Object.values(THEME_PRESETS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deck Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. AI / SaaS, Non-Profit, Fintech"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">Generates 8-12 editable widescreen slides</span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Structuring Slides...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-amber-300" />
                  <span>Generate Full Pitch Deck</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
