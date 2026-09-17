import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Maximize2,
  RefreshCw,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Printer
} from 'lucide-react';
import { ActiveAppId } from '../types';

interface TutorialFlipbookViewProps {
  setActiveApp: (id: ActiveAppId) => void;
}

export const TutorialFlipbookView: React.FC<TutorialFlipbookViewProps> = ({ setActiveApp }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flipbookUrl = 'https://heyzine.com/flip-book/45802adfc1.html';

  const handleRefresh = () => {
    const iframe = document.getElementById('heyzine-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-rose-600 text-white tracking-wider">
              TUTORIAL MANUAL BOOK
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              FLIPBOOK HEYZINE &bull; SMPN 7 PASURUAN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Panduan Interaktif & Manual Book
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Buku panduan digital resmi Sahabat SPANJU (Sekolah Aman, Harmonis, Anti Bullying). Baca halaman demi halaman langsung di bawah ini.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveApp('pilihan_menu')}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-2 border border-slate-200 shadow-2xs"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            Pilihan Menu
          </button>
          <a
            href={flipbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500 transition flex items-center gap-2 shadow-md shadow-rose-500/20"
          >
            <ExternalLink className="w-4 h-4" />
            Buka di Tab Baru
          </a>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">Heyzine Flipbook Reader Active</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
            title="Muat Ulang Halaman"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <a
            href={flipbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Full Link
          </a>
        </div>
      </div>

      {/* Flipbook Iframe Viewer Container */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative">
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Manual Book Sahabat SPANJU - Heyzine Flipbook</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            URL: {flipbookUrl}
          </div>
        </div>

        <div className="w-full aspect-[16/10] sm:aspect-[16/9] min-h-[550px] bg-slate-950 relative">
          <iframe
            id="heyzine-iframe"
            src={flipbookUrl}
            title="Tutorial Manual Book - Heyzine Flipbook"
            className="w-full h-full border-0"
            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
