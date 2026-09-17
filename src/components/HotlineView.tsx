import React from 'react';
import {
  PhoneCall,
  Mail,
  Globe,
  ShieldCheck,
  Layers,
  ExternalLink,
  MessageSquare,
  Building2,
  Clock
} from 'lucide-react';
import { ActiveAppId } from '../types';

interface HotlineViewProps {
  setActiveApp: (id: ActiveAppId) => void;
}

export const HotlineView: React.FC<HotlineViewProps> = ({ setActiveApp }) => {
  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-white/20 text-white tracking-wider backdrop-blur-sm">
              LAYANAN RESMI SEKOLAH
            </span>
            <span className="text-xs font-semibold text-amber-100 uppercase tracking-wide">
              SMP NEGERI 7 PASURUAN
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            HOTLINE & LAYANAN PENGADUAN
          </h1>
          <p className="text-sm sm:text-base text-amber-100 mt-2 max-w-2xl leading-relaxed">
            Saluran komunikasi cepat, bantuan konsultasi, dan pengaduan layanan ramah anak Sahabat SPANJU.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveApp('pilihan_menu')}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-2 border border-white/20 backdrop-blur-sm"
          >
            <Layers className="w-4 h-4" />
            Pilihan Menu
          </button>
          <button
            onClick={() => setActiveApp('e_lapor')}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white text-amber-700 hover:bg-amber-50 transition flex items-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            Buka E-Lapor
          </button>
        </div>
      </div>

      {/* Main Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Telepon / Hotline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 shadow-inner">
              <PhoneCall className="w-7 h-7" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Nomor Telepon / Hotline
            </h3>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              (0343) 426845
            </p>
            <p className="text-base font-bold text-amber-600 tracking-wide mt-0.5">
              085168700953
            </p>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Layanan telepon siaga dan WhatsApp Resmi Satgas Anti Bullying & BK SMP Negeri 7 Pasuruan.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">Jam Kerja 07:00 - 15:00 WIB</span>
            <a
              href="tel:0343426845"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Hubungi
            </a>
          </div>
        </div>

        {/* 2. Pos-el / Email */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 shadow-inner">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Pos-el Resmi (Email)
            </h3>
            <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1 break-all">
              smp7pas@yahoo.co.id
            </p>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Kirimkan surat resmi, laporan tertulis, maupun dokumen pendukung kedinasan melalui email resmi sekolah.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">24/7 Kotak Masuk</span>
            <a
              href="mailto:smp7pas@yahoo.co.id"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              Kirim Email
            </a>
          </div>
        </div>

        {/* 3. Laman / Website */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 shadow-inner">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Laman Web Resmi
            </h3>
            <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 break-all">
              www.smpn7pasuruan.sch.id
            </p>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Portal informasi publik, berita kegiatan sekolah, pengumuman, dan profil resmi SMP Negeri 7 Pasuruan.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">Portal Utama</span>
            <a
              href="https://www.smpn7pasuruan.sch.id"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Kunjungi
            </a>
          </div>
        </div>
      </div>

      {/* Additional Operational Info Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 shrink-0 flex items-center justify-center mt-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Komitmen Sekolah Ramah Anak & Anti Perundungan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Setiap laporan dan konsultasi melalui hotline atau pos-el dijamin kerahasiaannya oleh Tim Satgas Pencegahan dan Penanganan Kekerasan (SPPK) SMP Negeri 7 Pasuruan.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveApp('e_lapor')}
          className="px-6 py-3 rounded-2xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-md shadow-rose-600/20 shrink-0 flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Buat Laporan / Pengaduan Baru
        </button>
      </div>
    </div>
  );
};
