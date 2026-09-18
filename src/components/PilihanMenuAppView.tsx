import React, { useState } from 'react';
import {
  BookOpen,
  PhoneCall,
  ShieldAlert,
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  Coffee,
  Sparkles,
  Music2,
  HeartHandshake,
  FolderArchive,
  Tv,
  ExternalLink,
  Layers,
  CheckCircle2,
  Search,
  Users,
  GraduationCap
} from 'lucide-react';
import { ActiveAppId } from '../types';

interface PilihanMenuAppViewProps {
  setActiveApp: (id: ActiveAppId) => void;
  totalLaporan: number;
}

export const PilihanMenuAppView: React.FC<PilihanMenuAppViewProps> = ({ setActiveApp, totalLaporan }) => {
  const [activeTab, setActiveTab] = useState<'semua' | 'prioritas' | 'karakter' | 'master'>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    {
      id: 'tutorial_flipbook',
      title: 'TUTORIAL MANUAL BOOK',
      subtitle: 'BUKU PANDUAN FLIPBOOK HEYZINE',
      icon: BookOpen,
      category: 'prioritas',
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      action: () => setActiveApp('tutorial_flipbook')
    },
    {
      id: 'hotline_bantuan',
      title: 'HOTLINE',
      subtitle: 'LAYANAN BANTUAN & PENGADUAN',
      icon: PhoneCall,
      category: 'prioritas',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      action: () => setActiveApp('hotline_bantuan')
    },
    {
      id: 'e_lapor',
      title: 'E-LAPOR',
      subtitle: 'PENGADUAN SATGAS BK & BULLYING',
      icon: ShieldAlert,
      category: 'prioritas',
      color: 'from-rose-600 to-red-700',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badge: totalLaporan > 0 ? `${totalLaporan} Aduan` : undefined,
      action: () => setActiveApp('e_lapor')
    },
    {
      id: 'zona_analitik',
      title: 'DASHBOARD',
      subtitle: 'HUB STATISTIK & MATRIKS KELAS',
      icon: BarChart3,
      category: 'prioritas',
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => setActiveApp('zona_analitik')
    },
    {
      id: 'buku_tamu',
      title: 'BUKU TAMU',
      subtitle: 'REGISTRASI KUNJUNGAN & TTD DIGITAL',
      icon: BookOpenCheck,
      category: 'karakter',
      color: 'from-teal-600 to-emerald-700',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      action: () => setActiveApp('buku_tamu')
    },
    {
      id: 'piket_harian',
      title: 'PIKET HARIAN',
      subtitle: 'PENCATATAN KETERTIBAN & TEMUAN',
      icon: CalendarCheck2,
      category: 'karakter',
      color: 'from-sky-600 to-blue-700',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      action: () => setActiveApp('piket_harian')
    },
    {
      id: 'sabtu_beli_teh_ceri',
      title: 'SABTU BELI TEH CERI',
      subtitle: 'CERITA, IDE & TEMUAN 1 MINGGU',
      icon: Coffee,
      category: 'karakter',
      color: 'from-amber-600 to-yellow-700',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      action: () => setActiveApp('sabtu_beli_teh_ceri')
    },
    {
      id: 'kebun_luas_berseri',
      title: 'KEBUN LUAS BERSERI',
      subtitle: 'EVALUASI BULANAN & INOVASI',
      icon: Sparkles,
      category: 'karakter',
      color: 'from-emerald-600 to-green-700',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: () => setActiveApp('kebun_luas_berseri')
    },
    {
      id: 'senandung_serasi',
      title: 'SENANDUNG SERASI',
      subtitle: 'SALAM & PESAN RAMAH BERLITERASI',
      icon: Music2,
      category: 'karakter',
      color: 'from-purple-600 to-indigo-700',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => setActiveApp('senandung_serasi')
    },
    {
      id: 'sp_damai',
      title: 'SP DAMAI SISWA',
      subtitle: 'SURAT KESEPAKATAN & TTD LAYAR',
      icon: HeartHandshake,
      category: 'master',
      color: 'from-emerald-700 to-teal-800',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      action: () => setActiveApp('sp_damai')
    },
    {
      id: 'arsip_kegiatan',
      title: 'ARSIP KEGIATAN',
      subtitle: 'DOKUMENTASI GOOGLE SITES',
      icon: FolderArchive,
      category: 'master',
      color: 'from-amber-700 to-orange-800',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      action: () => setActiveApp('arsip_kegiatan')
    },
    {
      id: 'media_edukasi',
      title: 'MEDIA EDUKASI',
      subtitle: 'MATERI REGULASI & VIDEO',
      icon: Tv,
      category: 'master',
      color: 'from-violet-600 to-purple-700',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      action: () => setActiveApp('media_edukasi')
    },
    {
      id: 'master_siswa',
      title: 'MASTER DATA SISWA',
      subtitle: 'DATABASE SISWA & UPLOAD EXCEL',
      icon: Users,
      category: 'master',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: () => setActiveApp('master_siswa')
    },
    {
      id: 'master_guru',
      title: 'MASTER DATA GURU',
      subtitle: 'DATABASE GURU & UPLOAD EXCEL',
      icon: GraduationCap,
      category: 'master',
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => setActiveApp('master_guru')
    }
  ];

  const filtered = menuItems.filter(item => {
    const matchesTab = 
      activeTab === 'semua' || 
      (activeTab === 'prioritas' && item.category === 'prioritas') ||
      (activeTab === 'karakter' && item.category === 'karakter') ||
      (activeTab === 'master' && item.category === 'master');
    
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-rose-600 text-white tracking-wider">
              MENU APLIKASI
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              SIAP SPANJU &bull; SMPN 7 PASURUAN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Daftar Semua Menu Aplikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pilih modul atau inovasi di bawah ini dengan mengklik tombol <strong className="text-slate-800">Buka Aplikasi</strong> pada kartu yang diinginkan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveApp('zona_analitik')}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-2 border border-slate-200 shadow-2xs"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            Bagan & Tolak Ukur
          </button>
          <button
            onClick={() => setActiveApp('zona_analitik')}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition flex items-center gap-2 shadow-md shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Dashboard Utama
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('semua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'semua'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Aplikasi ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('prioritas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'prioritas'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Layanan Prioritas
          </button>
          <button
            onClick={() => setActiveTab('karakter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'karakter'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Inovasi Karakter
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'master'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Master & Setup
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aplikasi..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
            >
              {item.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  {item.badge}
                </span>
              )}

              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition duration-300`}>
                <Icon className="w-10 h-10" />
              </div>

              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1 group-hover:text-rose-600 transition">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-6 leading-relaxed">
                {item.subtitle}
              </p>

              <button
                type="button"
                className="mt-auto w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Buka Aplikasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
