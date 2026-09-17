import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Check,
  X,
  PenTool,
  Palette,
  Eraser,
  Undo2,
  Smartphone,
  Laptop,
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface TouchSignaturePadProps {
  initialSignature?: string;
  signerName?: string;
  signerTitle?: string;
  onSave: (signatureDataUrl: string, name?: string, title?: string) => void;
  onCancel?: () => void;
  title?: string;
  promptText?: string;
  compact?: boolean;
}

export const TouchSignaturePad: React.FC<TouchSignaturePadProps> = ({
  initialSignature,
  signerName = '',
  signerTitle = '',
  onSave,
  onCancel,
  title = 'Tanda Tangan Layar Sentuh & Laptop',
  promptText = 'Bubuhkan tanda tangan langsung menggunakan jari (touchscreen), pena stylus, atau mouse laptop:',
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState(signerName);
  const [roleTitle, setRoleTitle] = useState(signerTitle);
  const [strokeColor, setStrokeColor] = useState<string>('#1e3a8a'); // Official Navy Blue
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  // Setup High-DPI canvas & redraw
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render initial signature if no user strokes yet and initialSignature is provided
    if (strokes.length === 0 && !currentStroke && initialSignature && !hasContent) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.drawImage(img, 0, 0, rect.width * dpr, rect.height * dpr);
        ctx.restore();
      };
      img.src = initialSignature;
      return;
    }

    // Draw all completed strokes
    const allStrokes = [...strokes, ...(currentStroke ? [{ points: currentStroke, color: strokeColor, width: strokeWidth }] : [])];

    allStrokes.forEach((strk) => {
      if (strk.points.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = strk.color;
      ctx.lineWidth = strk.width * dpr;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (strk.points.length === 1) {
        const pt = strk.points[0];
        ctx.arc(pt.x * dpr, pt.y * dpr, (strk.width * dpr) / 2, 0, Math.PI * 2);
        ctx.fillStyle = strk.color;
        ctx.fill();
        return;
      }

      ctx.moveTo(strk.points[0].x * dpr, strk.points[0].y * dpr);
      for (let i = 1; i < strk.points.length - 1; i++) {
        const xc = ((strk.points[i].x + strk.points[i + 1].x) / 2) * dpr;
        const yc = ((strk.points[i].y + strk.points[i + 1].y) / 2) * dpr;
        ctx.quadraticCurveTo(strk.points[i].x * dpr, strk.points[i].y * dpr, xc, yc);
      }
      const last = strk.points[strk.points.length - 1];
      ctx.lineTo(last.x * dpr, last.y * dpr);
      ctx.stroke();
    });
  }, [strokes, currentStroke, strokeColor, strokeWidth, initialSignature, hasContent]);

  // Adjust canvas size to container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.max(rect.width, 280);
      const targetHeight = compact ? 140 : 180;

      canvas.width = targetWidth * dpr;
      canvas.height = targetHeight * dpr;
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [redrawCanvas, compact]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Get coordinates relative to canvas
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Pointer Event Handlers (Works for Touch, Stylus, & Mouse identically)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pt = getCanvasPoint(e);
    if (!pt) return;

    // Capture pointer so drawing continues smoothly even if finger/cursor slightly leaves canvas
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDrawing(true);
    setHasContent(true);
    setCurrentStroke([pt]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    if (!pt) return;

    setCurrentStroke((prev) => (prev ? [...prev, pt] : [pt]));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDrawing(false);
    if (currentStroke && currentStroke.length > 0) {
      setStrokes((prev) => [
        ...prev,
        {
          points: currentStroke,
          color: strokeColor,
          width: strokeWidth,
        },
      ]);
      setCurrentStroke(null);
    }
  };

  const handlePointerCancel = () => {
    setIsDrawing(false);
    setCurrentStroke(null);
  };

  // Clear canvas
  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke(null);
    setHasContent(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Undo last stroke
  const handleUndo = () => {
    if (strokes.length === 0) return;
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    if (updated.length === 0) setHasContent(false);
  };

  // Save / Export signature as transparent PNG
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasContent && !initialSignature) {
      alert('Silakan goreskan tanda tangan terlebih dahulu pada kotak tanda tangan.');
      return;
    }

    // Generate high-resolution PNG data URL
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl, name.trim(), roleTitle.trim());
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              {title}
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Smartphone className="w-2.5 h-2.5" /> HP / <Laptop className="w-2.5 h-2.5" /> Laptop
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">{promptText}</p>
          </div>
        </div>

        {/* Action icons: Undo & Clear */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition"
            title="Batal goresan terakhir (Undo)"
          >
            <Undo2 className="w-3 h-3" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 transition"
            title="Bersihkan kanvas tanda tangan"
          >
            <Eraser className="w-3 h-3" />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      {/* Signature Canvas Box with tactile paper feel */}
      <div
        ref={containerRef}
        className="w-full relative rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50/70 to-white shadow-inner overflow-hidden cursor-crosshair touch-none select-none"
        style={{ minHeight: compact ? '140px' : '180px' }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="w-full h-full block touch-none"
        />

        {/* Subtle Watermark Guidelines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
          <div className="flex justify-between items-start text-[9px] text-slate-400 font-mono">
            <span>AREA TANDA TANGAN RESMI</span>
            <span>TOUCHSCREEN / MOUSE</span>
          </div>

          {!hasContent && !initialSignature && (
            <div className="text-center my-auto">
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                Sentuh layar HP dengan jari / geser mouse laptop untuk tanda tangan di sini
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                (Otomatis halus & presisi tinggi)
              </p>
            </div>
          )}

          {/* Dotted base line */}
          <div className="border-b border-dashed border-slate-300 pb-1 text-right">
            <span className="text-[9px] text-slate-400">Tanda Tangan di atas garis ini</span>
          </div>
        </div>
      </div>

      {/* Control bar: Pen Color & Thickness */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        {/* Color choices */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Palette className="w-3 h-3" /> Tinta:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { color: '#1e3a8a', label: 'Biru Resmi' },
              { color: '#0f172a', label: 'Hitam' },
              { color: '#047857', label: 'Hijau' },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setStrokeColor(c.color)}
                style={{ backgroundColor: c.color }}
                className={`w-5 h-5 rounded-full transition-transform border-2 ${
                  strokeColor === c.color ? 'ring-2 ring-blue-400 scale-110 border-white' : 'border-slate-200'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Thickness selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Ketebalan:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {[
              { val: 1.5, label: 'Halus' },
              { val: 2.5, label: 'Sedang' },
              { val: 4.0, label: 'Tebal' },
            ].map((th) => (
              <button
                key={th.val}
                type="button"
                onClick={() => setStrokeWidth(th.val)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                  strokeWidth === th.val
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Name and Role inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
            Nama Terang Penanda Tangan
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Rahmat Santoso, S.Pd. / Siswa Piket"
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
            Jabatan / Peran
          </label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="Contoh: Petugas Piket / Guru Pembina / Konselor"
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Action Footer (Save & Cancel) */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          >
            Batal
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition active:scale-95 btn-3d btn-3d-blue"
        >
          <Check className="w-3.5 h-3.5" />
          Terapkan Tanda Tangan
        </button>
      </div>
    </div>
  );
};
