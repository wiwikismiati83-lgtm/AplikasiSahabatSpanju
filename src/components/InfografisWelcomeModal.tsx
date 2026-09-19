import React, { useState } from 'react';
import {
  X,
  LogIn,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  PhoneCall,
  Sparkles,
  Info,
  Layers,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface InfografisWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToLogin?: () => void;
  onOpenManualBook?: () => void;
  onOpenHotline?: () => void;
}

export const INFOGRAFIS_SPANJU_URL = 'https://i.ibb.co.com/n8tswpfq/INFOGRAFIS-APLIKASI-SAHABAT-SPANJU.jpg';

export const InfografisWelcomeModal: React.FC<InfografisWelcomeModalProps> = ({
  isOpen,
  onClose,
  onProceedToLogin,
  onOpenManualBook,
  onOpenHotline,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      id="modal-infografis-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="modal-infografis-card"
        className={`w-full ${
          isFullscreen ? 'max-w-6xl h-[94vh]' : 'max-w-4xl max-h-[92vh]'
        } bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 relative`}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/30 text-emerald-100">
                  Infografis Resmi
                </span>
                <span className="text-[11px] font-bold text-emerald-200 hidden sm:inline">
                  UPTD SMPN 7 Pasuruan
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white mt-0.5">
                INFOGRAFIS APLIKASI SAHABAT SPANJU
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition cursor-pointer"
              title={isFullscreen ? 'Perkecil Tampilan' : 'Perbesar Tampilan'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              id="btn-close-infografis-header"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-rose-600/80 transition cursor-pointer"
              title="Tutup Infografis"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Subheader Description */}
        <div className="bg-emerald-50/80 px-4 sm:px-6 py-2.5 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Sekolah Ramah Anak:</strong> Pedoman Alur, Fitur Layanan, Pencegahan & Penanganan Kekerasan SPANJU.
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              className="p-1 px-2 text-[11px] font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
              title="Perkecil Gambar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-600 px-1 font-mono">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 px-2 text-[11px] font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
              title="Perbesar Gambar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1 px-2 text-[11px] font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
            <a
              href={INFOGRAFIS_SPANJU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 px-2.5 text-[11px] font-bold rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 shadow-2xs transition"
              title="Buka Gambar Asli Resolusi Penuh"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Tab Baru</span>
            </a>
          </div>
        </div>

        {/* Image Container with Scroll & Zoom */}
        <div className="flex-1 overflow-auto bg-slate-900/5 p-3 sm:p-6 flex items-center justify-center min-h-[320px] custom-scrollbar">
          <div
            className="transition-transform duration-150 ease-out origin-top flex justify-center max-w-full"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="relative group rounded-xl shadow-xl overflow-hidden border border-slate-300/80 bg-white">
              {!imageLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 p-8 min-h-[350px]">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-xs font-bold text-slate-600">Memuat Infografis Sahabat SPANJU...</p>
                </div>
              )}
              <img
                src={INFOGRAFIS_SPANJU_URL}
                alt="Infografis Aplikasi Sahabat SPANJU - Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan"
                className={`max-w-full h-auto object-contain max-h-[65vh] sm:max-h-[70vh] transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Footer Action Controls */}
        <div className="bg-white px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-slate-500">
              SMP Negeri 7 Pasuruan &bull; Inovasi Penguatan Karakter & Anti Perundungan
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenManualBook && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenManualBook();
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition flex items-center gap-1.5 shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manual Book Flipbook</span>
              </button>
            )}

            {onProceedToLogin ? (
              <button
                id="btn-infografis-masuk-login"
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToLogin();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer btn-3d"
              >
                <LogIn className="w-4 h-4" />
                <span>Lanjut ke Akses Masuk / Login</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Dashboard Aplikasi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
