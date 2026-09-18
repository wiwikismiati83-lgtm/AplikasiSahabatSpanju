import React, { useState } from 'react';
import { Download, X, Smartphone, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
      >
        <Download className="w-4 h-4" />
        Install Aplikasi
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-xl bg-white border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-50 transition-all active:scale-95"
        >
          <Smartphone className="w-4 h-4" />
          Install di iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-sm rounded-[2.5rem] bg-white p-8 shadow-2xl border border-white/20 space-y-6 relative overflow-hidden">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner mx-auto">
                <Info className="w-8 h-8" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Install di iPhone / iPad</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Ikuti langkah mudah berikut:
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">1</div>
                  <p className="text-sm text-slate-600">Tekan tombol <strong>Bagikan (Share)</strong> di bilah bawah browser Safari.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">2</div>
                  <p className="text-sm text-slate-600">Gulir ke bawah dan pilih menu <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition shadow-xl active:scale-95"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
