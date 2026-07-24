import React from 'react';
import { Download, X, FileText, Code, Check, Printer, Presentation } from 'lucide-react';
import { PitchDeck } from '../types';
import { exportDeckToPptx } from '../lib/pptxExport';

interface ExportModalProps {
  isOpen: boolean;
  deck: PitchDeck;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  deck,
  onClose,
}) => {
  const [copiedJson, setCopiedJson] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(deck, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-800">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Presentation className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900 tracking-tight">Export & Download Options</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Option 1: Native PPTX */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between gap-4">
            <div>
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                PowerPoint Presentation (.pptx)
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Download fully editable 16:9 widescreen slides for Microsoft PowerPoint, Keynote, or Google Slides.
              </p>
            </div>
            <button
              onClick={() => {
                exportDeckToPptx(deck);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-sm shadow-blue-200 transition cursor-pointer"
            >
              Download PPTX
            </button>
          </div>

          {/* Option 2: Print PDF */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-emerald-600" />
                Print / Save as PDF
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Open print preview to save as landscape PDF or print physical handout decks.
              </p>
            </div>
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 shrink-0 border border-slate-300 transition cursor-pointer"
            >
              Print / PDF
            </button>
          </div>

          {/* Option 3: Copy JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-purple-600" />
                Copy Deck JSON Schema
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Copy raw structured JSON for developer backup or import into other tools.
              </p>
            </div>
            <button
              onClick={handleCopyJson}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 shrink-0 border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <span>Copy JSON</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
