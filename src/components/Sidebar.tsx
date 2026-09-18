import React, { useRef } from 'react';
import {
  FileSpreadsheet,
  Tv,
  Download,
  Upload,
  FolderSync,
  Layers,
  ChevronRight,
  HeartHandshake,
  FolderArchive,
  BookOpenCheck,
  CalendarCheck2,
  Coffee,
  Sparkles,
  Music2,
  ShieldAlert,
  UserCheck,
  LogOut,
  Shield,
  BookOpen,
  PhoneCall,
  Users,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { ActiveAppId, AuthUser } from '../types';

import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  activeApp: ActiveAppId;
  setActiveApp: (id: ActiveAppId) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  totalLaporan: number;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeApp,
  setActiveApp,
  onExportBackup,
  onImportBackup,
  totalLaporan,
  currentUser,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mainApps = [
    {
      id: 'pilihan_menu',
      title: 'Pilihan Menu Aplikasi',
      subtitle: 'Akses 1-Klik Seluruh Modul',
      icon: Layers,
      accentColor: 'from-emerald-600 to-teal-700',
      badge: 'Semua',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'hotline_bantuan',
      title: 'Hotline & Layanan',
      subtitle: '(0343) 426845 / 085168700953',
      icon: PhoneCall,
      accentColor: 'from-amber-500 to-orange-600',
      badge: 'Hotline',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'zona_analitik',
      title: 'Zona Hijau & Analitik',
      subtitle: 'Grafik Kasus & Pivot 24 Kelas (7A-9H)',
      icon: FileSpreadsheet,
      accentColor: 'from-emerald-500 to-teal-600',
      badge: '24 Kelas',
      badgeColor: 'bg-emerald-100 text-emerald-850 border-emerald-300',
    },
    {
      id: 'piket_harian',
      title: 'Piket Harian',
      subtitle: 'Temuan Harian & Foto Kegiatan',
      icon: CalendarCheck2,
      accentColor: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'sabtu_beli_teh_ceri',
      title: 'Sabtu Beli Teh Ceri',
      subtitle: 'Cerita, Ide & Temuan 1 Minggu',
      icon: Coffee,
      accentColor: 'from-amber-500 to-orange-600',
    },
    {
      id: 'kebun_luas_berseri',
      title: 'Kebun Luas Berseri',
      subtitle: 'Evaluasi Bulanan, Inovasi & RTL',
      icon: Sparkles,
      accentColor: 'from-teal-500 to-emerald-700',
    },
    {
      id: 'senandung_serasi',
      title: 'Senandung Serasi',
      subtitle: 'Salam & Pesan Ramah Berliterasi',
      icon: Music2,
      accentColor: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'e_lapor',
      title: 'E-Lapor Perundungan',
      subtitle: 'Pelaporan & 4 Mekanisme Penanganan',
      icon: ShieldAlert,
      accentColor: 'from-rose-500 to-red-600',
      badge: totalLaporan > 0 ? `${totalLaporan} Rekap` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'sp_damai',
      title: 'SP Damai Siswa',
      subtitle: 'Surat Kesepakatan & TTD Layar',
      icon: HeartHandshake,
      accentColor: 'from-emerald-600 to-teal-700',
      badge: 'Restorasi',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'arsip_kegiatan',
      title: 'Arsip Kegiatan',
      subtitle: 'Dokumentasi Google Sites',
      icon: FolderArchive,
      accentColor: 'from-amber-500 to-orange-600',
      badge: 'Buka Web',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      externalUrl: 'https://sites.google.com/view/berandapasstemenanspanju/home',
    },
    {
      id: 'buku_tamu',
      title: 'Buku Tamu Digital',
      subtitle: 'Registrasi Kunjungan & TTD Digital',
      icon: BookOpenCheck,
      accentColor: 'from-sky-500 to-blue-600',
    },
    {
      id: 'media_edukasi',
      title: 'Media Edukasi Digital',
      subtitle: 'Dokumentasi Materi & Pesan Edukatif',
      icon: Tv,
      accentColor: 'from-violet-500 to-fuchsia-600',
    },
    {
      id: 'master_siswa',
      title: 'Master Data Siswa',
      subtitle: 'Database Siswa & Upload Excel',
      icon: Users,
      accentColor: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'master_guru',
      title: 'Master Data Guru',
      subtitle: 'Database Guru & Upload Excel',
      icon: GraduationCap,
      accentColor: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'tutorial_flipbook',
      title: 'Tutorial / Manual Book',
      subtitle: 'Buku Panduan Flipbook Heyzine',
      icon: BookOpen,
      accentColor: 'from-rose-500 to-pink-600',
      badge: 'Panduan',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'bagan_alur',
      title: 'Bagan & Alur SOP',
      subtitle: 'Dokumentasi Alur Sahabat SPANJU',
      icon: Layers,
      accentColor: 'from-indigo-500 to-purple-600',
      badge: 'Baru',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <aside
      id="sidebar-container"
      className="w-full lg:w-84 xl:w-92 shrink-0 bg-white/95 border-r border-slate-200/90 flex flex-col h-full overflow-hidden select-none shadow-sm"
    >
      {/* Top Header with Logo */}
      <div id="sidebar-header" className="p-4 border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/60 via-slate-50/40 to-white">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur-xs opacity-40 group-hover:opacity-80 transition duration-300"></div>
            <img
              id="sidebar-school-logo"
              src="https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg"
              alt="Logo Pass Temenan Sahabat SPANJU"
              className="relative w-14 h-14 rounded-xl object-cover border-2 border-emerald-400/50 shadow-md bg-white"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&q=80';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                APLIKASI SAHABAT SPANJU
              </span>
            </div>
            <h1 className="text-xs font-extrabold text-slate-800 tracking-tight mt-0.5 leading-snug">
              Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan
            </h1>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Dashboard Sahabat SPANJU
            </p>
          </div>
        </div>
      </div>

      {/* User Session Bar */}
      {currentUser && (
        <div id="sidebar-user-session" className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${currentUser.role === 'admin' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-teal-100 text-teal-700 border border-teal-300'}`}>
              {currentUser.role === 'admin' ? <Shield className="w-4 h-4 text-blue-600" /> : <UserCheck className="w-4 h-4 text-teal-600" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 truncate font-mono">@{currentUser.username}</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${currentUser.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-teal-600 text-white'}`}>
                  {currentUser.role === 'admin' ? 'Admin' : 'Tamu / Warga'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{currentUser.displayName}</p>
            </div>
          </div>
          {onLogout && (
            <button
              id="btn-sidebar-logout"
              onClick={onLogout}
              title="Keluar / Ganti Akun"
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Menu Utama Sahabat SPANJU */}
        <div id="section-menu-aplikasi">
          <div className="px-2 mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Menu Sahabat SPANJU
            </span>
            <span className="text-[10px] font-semibold text-slate-400">{mainApps.length} Modul</span>
          </div>

          <div className="space-y-1.5">
            {mainApps.map((item) => {
              const Icon = item.icon;
              const isActive = activeApp === item.id;
              return (
                <button
                  key={item.id}
                  id={`btn-nav-${item.id}`}
                  onClick={() => {
                    if (item.externalUrl) {
                      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      setActiveApp(item.id);
                    }
                  }}
                  className={`w-full group text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-300 shadow-xs translate-x-0.5 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent hover:border-slate-200/80'
                  }`}
                >
                  {/* Left Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600 rounded-r"></div>
                  )}

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs ${
                      isActive
                        ? `bg-gradient-to-br ${item.accentColor} text-white shadow-emerald-500/20`
                        : 'bg-slate-100 text-slate-600 group-hover:text-emerald-700 group-hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-bold truncate leading-snug">
                        {item.title}
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${item.badgeColor} shrink-0`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  {item.externalUrl ? (
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-amber-600 group-hover:text-amber-700" />
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? 'text-emerald-700 translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer: Backup & Upload / Restore */}
      <div id="sidebar-footer" className="p-3 border-t border-slate-200/90 bg-slate-50/80 space-y-2">
        <div className="lg:hidden pb-1">
          <PWAInstallButton />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <FolderSync className="w-3 h-3 text-emerald-600" />
            Backup & Sinkronisasi
          </div>
          {onLogout && (
            <button
              id="btn-sidebar-footer-logout"
              onClick={onLogout}
              className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded flex items-center gap-1 transition"
              title="Keluar / Ganti Akun"
            >
              <LogOut className="w-2.5 h-2.5" />
              Keluar
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-backup-json"
            onClick={onExportBackup}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
            title="Download file backup JSON konfigurasi link & data"
          >
            <Download className="w-3 h-3 text-emerald-600" />
            Backup JSON
          </button>

          <button
            id="btn-upload-json"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:text-sky-800 hover:bg-sky-50 border border-slate-200 flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
            title="Upload file backup JSON untuk restore link & data"
          >
            <Upload className="w-3 h-3 text-sky-600" />
            Upload JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <div className="text-[9px] text-center text-slate-500 pt-0.5">
          SMPN 7 Pasuruan &bull; E-Governance Sekolah Ramah
        </div>
      </div>
    </aside>
  );
};
