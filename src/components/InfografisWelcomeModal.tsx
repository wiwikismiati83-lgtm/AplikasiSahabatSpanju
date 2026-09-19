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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Award,
  ChevronRight,
} from 'lucide-react';

interface InfografisWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToLogin?: () => void;
  onOpenManualBook?: () => void;
  onOpenHotline?: () => void;
}

export const INFOGRAFIS_SPANJU_URL = 'https://i.ibb.co.com/n8tswpfq/INFOGRAFIS-APLIKASI-SAHABAT-SPANJU.jpg';
export const LOGO_PASS_TEMENAN_URL = 'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
    >
      {/* Single Master Unified Frame Showcase */}
      <div
        id="modal-infografis-unified-frame"
        className={`w-full ${
          isFullscreen ? 'max-w-7xl h-[96vh]' : 'max-w-4xl max-h-[94vh]'
        } bg-gradient-to-b from-white via-slate-50/90 to-emerald-50/40 rounded-3xl shadow-[0_25px_60px_-15px_rgba(6,78,59,0.35)] border-2 border-emerald-500/40 ring-1 ring-emerald-300/30 overflow-hidden flex flex-col transition-all duration-300 relative`}
      >
        {/* Subtle Decorative Ambient Glow Highlights */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-teal-400/15 rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* Top Master Header Bar with Elegant Floating Controls */}
        <div className="relative z-10 px-4 sm:px-6 pt-3.5 pb-2 flex items-center justify-between border-b border-emerald-100/80 bg-white/70 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 font-sans">
              UPTD SMP NEGERI 7 PASURUAN
            </span>
            <span className="hidden sm:inline text-slate-300">&bull;</span>
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-500">
              Dokumen Resmi Alur & Layanan Terpadu
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Floating Controls */}
            <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200/80 shadow-2xs mr-1">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 px-2 text-[11px] font-bold text-slate-700 hover:bg-white hover:text-emerald-700 rounded-lg transition"
                title="Perkecil Tampilan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold font-mono text-slate-600 px-1.5 min-w-[36px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 px-2 text-[11px] font-bold text-slate-700 hover:bg-white hover:text-emerald-700 rounded-lg transition"
                title="Perbesar Tampilan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition"
                  title="Reset Ukuran 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/70 transition cursor-pointer"
              title={isFullscreen ? 'Perkecil Layar' : 'Layar Penuh'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <a
              href={INFOGRAFIS_SPANJU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/70 transition cursor-pointer hidden xs:flex items-center"
              title="Buka Gambar Asli Resolusi HD"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              id="btn-close-infografis-header"
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer ml-1"
              title="Tutup Jendela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Frame Interior: Header Branding + Poster Unified Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 custom-scrollbar relative z-10 flex flex-col items-center">
          
          {/* Unified Frame Brand Header */}
          <div className="w-full max-w-3xl flex flex-col items-center text-center pt-1 pb-4 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Circular Pass Temenan Logo with Elegant Triple-Ring Glow */}
            <div className="relative group cursor-pointer mb-3">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-60 blur-xs group-hover:opacity-100 transition duration-300"></div>
              <div className="relative p-1.5 bg-white rounded-full shadow-md border-2 border-emerald-300/80 ring-4 ring-emerald-100/90">
                <img
                  src={LOGO_PASS_TEMENAN_URL}
                  alt="Logo Pass Temenan Sahabat SPANJU"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-white"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&q=80';
                  }}
                />
              </div>
            </div>

            {/* Seamless Pill Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400/90 text-emerald-950 shadow-sm mb-2.5 transition-all hover:border-emerald-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase">
                APLIKASI SAHABAT SPANJU
              </span>
            </div>

            {/* Clean Subtitle */}
            <p className="text-xs sm:text-sm font-bold text-slate-600 italic max-w-xl leading-relaxed">
              (Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan)
            </p>
          </div>

          {/* Unified Frame Inner Poster Display */}
          <div className="w-full flex justify-center pb-2">
            <div
              className="transition-transform duration-150 ease-out origin-top flex justify-center max-w-full"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <div className="relative rounded-2xl shadow-xl overflow-hidden border-2 border-emerald-200/90 bg-white ring-8 ring-emerald-50/60 max-w-full">
                {!imageLoaded && (
                  <div className="flex flex-col items-center justify-center bg-slate-50 p-12 min-h-[360px] w-full min-w-[280px] sm:min-w-[480px]">
                    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-xs font-bold text-slate-600">Memuat Gambar Infografis Sahabat SPANJU...</p>
                  </div>
                )}
                
                <img
                  src={INFOGRAFIS_SPANJU_URL}
                  alt="Infografis Resmi Aplikasi Sahabat SPANJU - SMP Negeri 7 Pasuruan"
                  className={`max-w-full h-auto object-contain max-h-[60vh] sm:max-h-[65vh] transition-opacity duration-300 block ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Inner Frame Watermark Badge */}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200/80 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-emerald-900 pointer-events-none">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Infografis Resmi SPANJU</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="relative z-10 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-600 text-xs text-center sm:text-left">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-600 font-medium">
              Inovasi Penguatan Karakter &amp; Sekolah Ramah Anak UPT SMPN 7 Pasuruan
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
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Manual Book</span>
              </button>
            )}

            {onOpenHotline && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHotline();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Hotline</span>
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
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-700/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer btn-3d"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Login Aplikasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buka Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
