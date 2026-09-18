import React from 'react';
import { Download } from 'lucide-react';

interface Props {
  onOpenMenu?: () => void;
}

interface ImageItem {
  id: string;
  title: string;
  description: string;
  url: string;
}

const IMAGES: ImageItem[] = [
  {
    id: 'alur_penanganan',
    title: 'Alur Penanganan Kekerasan dan Perundungan',
    description: 'Bagan standar operasional (SOP) untuk penanganan kasus kekerasan dan perundungan di sekolah.',
    url: 'https://i.ibb.co.com/4ntsk04H/ALUR-PENANGANAN-PASS-TEMENAN.png'
  },
  {
    id: 'struktur_tolak_ukur',
    title: 'Bagan Struktur Tolak Ukur E-Pass Temenan',
    description: 'Struktur indikator dan tolak ukur keberhasilan program E-Pass Temenan.',
    url: 'https://i.ibb.co.com/S4FX6Djd/Bagan-Struktur-Tolak-Ukur-E-Pass-Temenan-Spanju.png'
  },
  {
    id: 'alur_penilaian',
    title: 'Alur Penilaian Tolak Ukur & Bagan Keputusan',
    description: 'Prosedur penilaian tolak ukur dan pengambilan keputusan.',
    url: 'https://i.ibb.co.com/XHSRvkR/Alur-Penilaian-Tolak-Ukur-Bagan-Keputusan.png'
  },
  {
    id: 'respon_tindak_lanjut',
    title: 'Diagram Alur Respon Tindak Lanjut Laporan',
    description: 'Proses tindak lanjut untuk setiap laporan yang masuk melalui sistem E-Lapor.',
    url: 'https://i.ibb.co.com/spq7dvH0/Diagram-Alur-Penilaian-Respon-Laporan.png'
  }
];

export const BaganAlurView: React.FC<Props> = ({ onOpenMenu }) => {
  const handleDownload = async (item: ImageItem) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/30 text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-4 backdrop-blur-sm border border-indigo-400/20">
                Dokumentasi SOP & Bagan
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Bagan & Alur Penanganan
              </h1>
              <p className="text-indigo-100 mt-3 text-base max-w-xl leading-relaxed">
                Kumpulan Standar Operasional Prosedur (SOP), diagram alur, dan struktur tolak ukur program Sahabat SPANJU.
              </p>
            </div>
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold backdrop-blur-sm transition-all border border-white/10 shadow-sm self-start sm:self-center"
              >
                Kembali ke Menu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Flow */}
      <div className="space-y-16">
        {IMAGES.map((item, index) => (
          <div key={item.id} className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 px-2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-xl shrink-0 shadow-sm border border-indigo-100/50">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{item.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(item)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2 transition shadow-sm shrink-0"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                Simpan Gambar
              </button>
            </div>
            
            {/* Native Full-Width Image Container */}
            <div className="w-full bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden p-2 sm:p-4">
              <img 
                src={item.url} 
                alt={item.title}
                className="w-full h-auto object-contain rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
