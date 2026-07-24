import React from 'react';
import {
  Pencil,
  Highlighter,
  ArrowUpRight,
  Square,
  Zap,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Minimize2,
  Maximize2,
  Move,
  Check,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';

export type AnnotationTool = 'pen' | 'highlighter' | 'arrow' | 'rectangle' | 'laser' | 'text' | 'eraser';

export interface DrawPoint {
  x: number;
  y: number;
}

export interface DrawStroke {
  id: string;
  tool: AnnotationTool;
  color: string;
  size: number;
  points: DrawPoint[];
  text?: string;
}

interface AnnotationCanvasProps {
  slideId: string;
  isActive: boolean;
  onToggleActive?: (active: boolean) => void;
  className?: string;
}

const COLOR_PALETTE = [
  { label: 'Vivid Red', value: '#ef4444' },
  { label: 'Highlighter Yellow', value: '#facc15' },
  { label: 'Electric Blue', value: '#3b82f6' },
  { label: 'Emerald Green', value: '#10b981' },
  { label: 'Neon Pink', value: '#ec4899' },
  { label: 'Crisp White', value: '#ffffff' },
  { label: 'Slate Black', value: '#0f172a' },
];

const STROKE_SIZES = [
  { label: 'Fine', value: 3 },
  { label: 'Medium', value: 6 },
  { label: 'Bold', value: 12 },
  { label: 'Highlighter', value: 24 },
];

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  slideId,
  isActive,
  onToggleActive,
  className = '',
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Per-slide stroke store: slideId -> DrawStroke[]
  const [slideAnnotations, setSlideAnnotations] = React.useState<Record<string, DrawStroke[]>>({});
  const [slideRedoStack, setSlideRedoStack] = React.useState<Record<string, DrawStroke[]>>({});
  const [activeTool, setActiveTool] = React.useState<AnnotationTool>('pen');
  const [activeColor, setActiveColor] = React.useState<string>('#facc15');
  const [activeSize, setActiveSize] = React.useState<number>(5);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentPoints, setCurrentPoints] = React.useState<DrawPoint[]>([]);
  const [laserPoint, setLaserPoint] = React.useState<DrawPoint | null>(null);
  
  // Text Tool State
  const [textInputPos, setTextInputPos] = React.useState<{ x: number; y: number } | null>(null);
  const [textInputValue, setTextInputValue] = React.useState('');

  // Toolbar UI State
  const [isToolbarCollapsed, setIsToolbarCollapsed] = React.useState(false);
  const [showAnnotations, setShowAnnotations] = React.useState(true);

  const strokes = slideAnnotations[slideId] || [];
  const redoStrokes = slideRedoStack[slideId] || [];

  // Helper to add a stroke to current slide (and clear redo history)
  const addStroke = React.useCallback((stroke: DrawStroke) => {
    setSlideAnnotations((prev) => ({
      ...prev,
      [slideId]: [...(prev[slideId] || []), stroke],
    }));
    setSlideRedoStack((prev) => ({
      ...prev,
      [slideId]: [],
    }));
  }, [slideId]);

  // Undo last stroke for current slide
  const handleUndo = React.useCallback(() => {
    setSlideAnnotations((prev) => {
      const current = prev[slideId] || [];
      if (current.length === 0) return prev;
      const lastStroke = current[current.length - 1];
      
      setSlideRedoStack((rPrev) => ({
        ...rPrev,
        [slideId]: [...(rPrev[slideId] || []), lastStroke],
      }));

      return {
        ...prev,
        [slideId]: current.slice(0, -1),
      };
    });
  }, [slideId]);

  // Redo stroke for current slide
  const handleRedo = React.useCallback(() => {
    setSlideRedoStack((rPrev) => {
      const redos = rPrev[slideId] || [];
      if (redos.length === 0) return rPrev;
      const nextStroke = redos[redos.length - 1];

      setSlideAnnotations((prev) => ({
        ...prev,
        [slideId]: [...(prev[slideId] || []), nextStroke],
      }));

      return {
        ...rPrev,
        [slideId]: redos.slice(0, -1),
      };
    });
  }, [slideId]);

  // Clear all annotations on current slide
  const handleClear = () => {
    if (strokes.length === 0) return;
    setSlideAnnotations((prev) => ({
      ...prev,
      [slideId]: [],
    }));
    setSlideRedoStack((prev) => ({
      ...prev,
      [slideId]: [],
    }));
  };

  // Canvas redraw effect
  const redrawCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear viewport
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showAnnotations) return;

    // Helper function to scale normalized points (0 to 1) to actual pixels
    const toPx = (point: DrawPoint) => ({
      x: point.x * canvas.width,
      y: point.y * canvas.height,
    });

    // Render saved strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;

      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'highlighter') {
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size * (canvas.width / 1000);
      } else if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = stroke.size * 2 * (canvas.width / 1000);
      } else {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size * (canvas.width / 1000);
      }

      if (stroke.tool === 'arrow' && stroke.points.length >= 2) {
        const start = toPx(stroke.points[0]);
        const end = toPx(stroke.points[stroke.points.length - 1]);
        
        // Line
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = Math.max(12, stroke.size * 2.5);
        ctx.fillStyle = stroke.color;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - headLen * Math.cos(angle - Math.PI / 6),
          end.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          end.x - headLen * Math.cos(angle + Math.PI / 6),
          end.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

      } else if (stroke.tool === 'rectangle' && stroke.points.length >= 2) {
        const start = toPx(stroke.points[0]);
        const end = toPx(stroke.points[stroke.points.length - 1]);
        const w = end.x - start.x;
        const h = end.y - start.y;
        
        ctx.strokeRect(start.x, start.y, w, h);

      } else if (stroke.tool === 'text' && stroke.text) {
        const pos = toPx(stroke.points[0]);
        const fontSize = Math.max(14, stroke.size * 3);
        ctx.fillStyle = stroke.color;
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(stroke.text, pos.x, pos.y);

      } else {
        // Freehand Pen / Highlighter / Eraser path
        const first = toPx(stroke.points[0]);
        ctx.moveTo(first.x, first.y);

        for (let i = 1; i < stroke.points.length; i++) {
          const pt = toPx(stroke.points[i]);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      ctx.restore();
    });

    // Render current active drawing stroke in progress
    if (isDrawing && currentPoints.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const scale = canvas.width / 1000;

      if (activeTool === 'highlighter') {
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = activeSize * scale;
      } else if (activeTool === 'eraser') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = activeSize * 2 * scale;
      } else {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = activeSize * scale;
      }

      const toPxCurr = (p: DrawPoint) => ({ x: p.x * canvas.width, y: p.y * canvas.height });

      if (activeTool === 'arrow' && currentPoints.length >= 2) {
        const start = toPxCurr(currentPoints[0]);
        const end = toPxCurr(currentPoints[currentPoints.length - 1]);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = Math.max(12, activeSize * 2.5);
        ctx.fillStyle = activeColor;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - headLen * Math.cos(angle - Math.PI / 6),
          end.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          end.x - headLen * Math.cos(angle + Math.PI / 6),
          end.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

      } else if (activeTool === 'rectangle' && currentPoints.length >= 2) {
        const start = toPxCurr(currentPoints[0]);
        const end = toPxCurr(currentPoints[currentPoints.length - 1]);
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);

      } else {
        const first = toPxCurr(currentPoints[0]);
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < currentPoints.length; i++) {
          const pt = toPxCurr(currentPoints[i]);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      ctx.restore();
    }

    // Render Laser Pointer Glowing Cursor Dot
    if (activeTool === 'laser' && laserPoint) {
      ctx.save();
      const lx = laserPoint.x * canvas.width;
      const ly = laserPoint.y * canvas.height;

      // Glow halo
      const grad = ctx.createRadialGradient(lx, ly, 2, lx, ly, 18);
      grad.addColorStop(0, 'rgba(239, 68, 68, 1)');
      grad.addColorStop(0.4, 'rgba(239, 68, 68, 0.6)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, 20, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }, [strokes, isDrawing, currentPoints, activeTool, activeColor, activeSize, laserPoint, showAnnotations]);

  // Keep Canvas resolution matched to container aspect ratio
  const handleResize = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      redrawCanvas();
    }
  }, [redrawCanvas]);

  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, slideId]);

  React.useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Global drawing hotkeys for Undo/Redo (⌘Z / ⌘Y) when active
  React.useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field or textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleUndo, handleRedo]);

  // Normalize Mouse/Touch Coordinates (0.0 to 1.0) relative to Canvas
  const getNormalizedPoint = (e: React.MouseEvent | React.TouchEvent): DrawPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    };
  };

  // Pointer Handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;
    e.stopPropagation();

    const pt = getNormalizedPoint(e);
    if (!pt) return;

    if (activeTool === 'laser') {
      setLaserPoint(pt);
      return;
    }

    if (activeTool === 'text') {
      setTextInputPos(pt);
      setTextInputValue('');
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([pt]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;

    const pt = getNormalizedPoint(e);
    if (!pt) return;

    if (activeTool === 'laser') {
      setLaserPoint(pt);
      redrawCanvas();
      return;
    }

    if (!isDrawing) return;
    e.stopPropagation();

    if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser') {
      setCurrentPoints((prev) => [...prev, pt]);
    } else if (activeTool === 'arrow' || activeTool === 'rectangle') {
      setCurrentPoints((prev) => [prev[0], pt]);
    }
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;

    if (activeTool === 'laser') {
      setLaserPoint(null);
      redrawCanvas();
      return;
    }

    if (!isDrawing) return;
    e.stopPropagation();

    if (currentPoints.length > 0) {
      const newStroke: DrawStroke = {
        id: `stroke-${Date.now()}-${Math.random()}`,
        tool: activeTool,
        color: activeColor,
        size: activeSize,
        points: currentPoints,
      };
      addStroke(newStroke);
    }

    setIsDrawing(false);
    setCurrentPoints([]);
  };

  // Confirm Text Annotation
  const handleConfirmText = () => {
    if (textInputPos && textInputValue.trim()) {
      addStroke({
        id: `text-${Date.now()}`,
        tool: 'text',
        color: activeColor,
        size: activeSize,
        points: [textInputPos],
        text: textInputValue.trim(),
      });
    }
    setTextInputPos(null);
    setTextInputValue('');
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none z-30 overflow-hidden ${className}`}
    >
      {/* HTML5 Canvas Surface */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        className={`w-full h-full ${
          isActive
            ? activeTool === 'laser'
              ? 'cursor-crosshair pointer-events-auto'
              : activeTool === 'text'
              ? 'cursor-text pointer-events-auto'
              : 'cursor-crosshair pointer-events-auto'
            : 'pointer-events-none'
        }`}
      />

      {/* Text Annotation Input Popup Overlay */}
      {textInputPos && (
        <div
          className="absolute z-40 bg-slate-900 border-2 border-amber-400 p-2.5 rounded-xl shadow-2xl flex items-center gap-2 pointer-events-auto animate-scale-in"
          style={{
            left: `${textInputPos.x * 100}%`,
            top: `${textInputPos.y * 100}%`,
            transform: 'translate(-10%, -110%)',
          }}
        >
          <input
            type="text"
            autoFocus
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmText();
              if (e.key === 'Escape') setTextInputPos(null);
            }}
            placeholder="Type slide note..."
            className="bg-slate-950 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-48"
          />
          <button
            onClick={handleConfirmText}
            className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition cursor-pointer"
            title="Add Text Note"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Presentation Annotation Control Toolbar */}
      {isActive && (
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 ${
            isToolbarCollapsed ? 'opacity-90 hover:opacity-100' : ''
          }`}
        >
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl p-2 flex items-center gap-1.5 text-slate-200">
            {/* Collapse Toggle Handle */}
            <button
              onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title={isToolbarCollapsed ? 'Expand Annotation Toolbar' : 'Minimize Toolbar'}
            >
              {isToolbarCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>

            {!isToolbarCollapsed && (
              <>
                <div className="w-px h-5 bg-slate-800 mx-0.5" />

                {/* Drawing Tools Selector */}
                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveTool('pen')}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      activeTool === 'pen'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Pen / Freehand Marker"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTool('highlighter')}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      activeTool === 'highlighter'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Translucent Highlighter"
                  >
                    <Highlighter className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTool('arrow')}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      activeTool === 'arrow'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Draw Pointer Arrow"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTool('rectangle')}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      activeTool === 'rectangle'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Highlight Box"
                  >
                    <Square className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTool('laser')}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      activeTool === 'laser'
                        ? 'bg-red-500 text-white shadow-md font-extrabold ring-2 ring-red-400/50'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Live Laser Pointer"
                  >
                    <Zap className="w-4 h-4 text-red-400" />
                  </button>

                  <button
                    onClick={() => setActiveTool('text')}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      activeTool === 'text'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Slide Text Note"
                  >
                    <Type className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTool('eraser')}
                    className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      activeTool === 'eraser'
                        ? 'bg-rose-600 text-white shadow-md font-extrabold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Erase Mode"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-5 bg-slate-800 mx-0.5" />

                {/* Color Palette Picker */}
                <div className="flex items-center gap-1">
                  {COLOR_PALETTE.map((col) => (
                    <button
                      key={col.value}
                      onClick={() => setActiveColor(col.value)}
                      style={{ backgroundColor: col.value }}
                      className={`w-5 h-5 rounded-full transition transform cursor-pointer border ${
                        activeColor === col.value
                          ? 'scale-125 ring-2 ring-amber-400 border-white shadow-lg'
                          : 'border-slate-700 opacity-80 hover:opacity-100 hover:scale-110'
                      }`}
                      title={col.label}
                    />
                  ))}
                </div>

                <div className="w-px h-5 bg-slate-800 mx-0.5" />

                {/* Stroke Thickness Selector */}
                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  {STROKE_SIZES.map((sz) => (
                    <button
                      key={sz.value}
                      onClick={() => setActiveSize(sz.value)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                        activeSize === sz.value
                          ? 'bg-slate-800 text-amber-400 font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title={`${sz.label} (${sz.value}px)`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>

                <div className="w-px h-5 bg-slate-800 mx-0.5" />

                {/* Action Controls: Visibility, Undo, Clear All */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      showAnnotations
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-500 bg-slate-950'
                    }`}
                    title={showAnnotations ? 'Hide Slide Annotations' : 'Show Annotations'}
                  >
                    {showAnnotations ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleUndo}
                    disabled={strokes.length === 0}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition cursor-pointer"
                    title="Undo Stroke (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleRedo}
                    disabled={redoStrokes.length === 0}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition cursor-pointer"
                    title="Redo Stroke (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClear}
                    disabled={strokes.length === 0}
                    className="p-2 rounded-lg hover:bg-red-950/80 text-red-400 disabled:opacity-30 transition cursor-pointer"
                    title="Clear Slide Drawings"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* Turn Off / Exit Annotation Mode Button */}
            {onToggleActive && (
              <button
                onClick={() => onToggleActive(false)}
                className="ml-1 px-2.5 py-1.5 bg-red-950/80 border border-red-800/80 text-red-300 hover:bg-red-900 font-extrabold text-xs rounded-xl transition cursor-pointer shrink-0"
                title="Done Annotating"
              >
                Close Draw
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
