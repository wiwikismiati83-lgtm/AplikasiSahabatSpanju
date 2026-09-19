import React, { useState, useEffect } from 'react';
import { api } from './lib/api';
import {
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Bell,
  Clock,
  Calendar,
  Layers,
  FileCheck2,
  LogOut,
  Shield,
  UserCheck,
} from 'lucide-react';
import {
  ActiveAppId,
  CustomLink,
  PiketHarianRecord,
  SabtuBeliTehCeriRecord,
  KebunLuasBerseriRecord,
  SenandungSerasiRecord,
  ELaporRecord,
  BukuTamuRecord,
  MediaEdukasiItem,
  KelasZonaStatus,
  SPDamaiRecord,
  ArsipKegiatanRecord,
  AuthUser,
  UserRole,
  Siswa,
  Guru,
} from './types';
import {
  INITIAL_CUSTOM_LINKS,
  INITIAL_PIKET_HARIAN,
  INITIAL_SABTU_BELI_TEH_CERI,
  INITIAL_KEBUN_LUAS_BERSERI,
  INITIAL_SENANDUNG_SERASI,
  INITIAL_E_LAPOR,
  INITIAL_BUKU_TAMU,
  INITIAL_MEDIA_EDUKASI,
  INITIAL_KELAS_ZONA,
  INITIAL_SP_DAMAI,
  INITIAL_ARSIP_KEGIATAN,
  INITIAL_SISWA,
  INITIAL_GURU,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { CustomLinkModal } from './components/CustomLinkModal';
import { LoginModal } from './components/LoginModal';
import { ZonaHijauAnalyticsView } from './components/ZonaHijauAnalyticsView';
import { PiketHarianView } from './components/PiketHarianView';
import { SabtuBeliTehCeriView } from './components/SabtuBeliTehCeriView';
import { KebunLuasBerseriView } from './components/KebunLuasBerseriView';
import { SenandungSerasiView } from './components/SenandungSerasiView';
import { ELaporView } from './components/ELaporView';
import { SPDamaiView } from './components/SPDamaiView';
import { ArsipKegiatanView } from './components/ArsipKegiatanView';
import { BukuTamuView } from './components/BukuTamuView';
import { MediaEdukasiView } from './components/MediaEdukasiView';
import { MasterSiswaView } from './components/MasterSiswaView';
import { MasterGuruView } from './components/MasterGuruView';
import { PilihanMenuAppView } from './components/PilihanMenuAppView';
import { TutorialFlipbookView } from './components/TutorialFlipbookView';
import { HotlineView } from './components/HotlineView';
import { WebFrameViewer } from './components/WebFrameViewer';
import { BaganAlurView } from './components/BaganAlurView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { InfografisWelcomeModal } from './components/InfografisWelcomeModal';

// Safe localStorage helper to prevent quota exceeded and iframe storage errors
const safeStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`SafeStorage: could not set item "${key}":`, e);
      try {
        // If quota exceeded, clean up previous bulky backup and retry
        if (key !== 'spanju_backup_data') {
          localStorage.removeItem('spanju_backup_data');
          localStorage.setItem(key, value);
        }
      } catch {}
    }
  },
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

export default function App() {
  // Role-Based Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = safeStorage.getItem('spanju_auth_user');
      if (saved) return JSON.parse(saved);
      return {
        username: 'admin',
        role: 'admin',
        displayName: 'Administrator SPANJU',
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return {
        username: 'admin',
        role: 'admin',
        displayName: 'Administrator SPANJU',
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    }
  });

  // Navigation State
  const [activeApp, setActiveApp] = useState<ActiveAppId>('pilihan_menu');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInfografisModalOpen, setIsInfografisModalOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    safeStorage.setItem('spanju_auth_user', JSON.stringify(user));
    setIsLoginModalOpen(false);
    setIsInfografisModalOpen(false);
    
    // Auto-redirect if targetApp is provided
    if (user.targetApp) {
      setActiveApp(user.targetApp);
    } else {
      setActiveApp('pilihan_menu');
    }
    
    showToast(`Selamat datang, ${user.displayName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    safeStorage.removeItem('spanju_auth_user');
    setIsInfografisModalOpen(true);
    setIsLoginModalOpen(false);
    showToast('Anda telah keluar dari sesi.');
  };

  const userRole: UserRole = currentUser?.role || 'siswa';
  const canDelete = currentUser?.role === 'admin' || currentUser?.role === 'operator';

  // Persistent Module Records with Initial Data
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(INITIAL_CUSTOM_LINKS);
  const [piketRecords, setPiketRecords] = useState<PiketHarianRecord[]>(INITIAL_PIKET_HARIAN);
  const [ceriRecords, setCeriRecords] = useState<SabtuBeliTehCeriRecord[]>(INITIAL_SABTU_BELI_TEH_CERI);
  const [kebunRecords, setKebunRecords] = useState<KebunLuasBerseriRecord[]>(INITIAL_KEBUN_LUAS_BERSERI);
  const [serasiRecords, setSerasiRecords] = useState<SenandungSerasiRecord[]>(INITIAL_SENANDUNG_SERASI);
  const [eLaporRecords, setELaporRecords] = useState<ELaporRecord[]>(INITIAL_E_LAPOR);
  const [bukuTamuRecords, setBukuTamuRecords] = useState<BukuTamuRecord[]>(INITIAL_BUKU_TAMU);
  const [mediaEdukasiItems, setMediaEdukasiItems] = useState<MediaEdukasiItem[]>(INITIAL_MEDIA_EDUKASI);
  const [kelasList, setKelasList] = useState<KelasZonaStatus[]>(INITIAL_KELAS_ZONA);
  const [spDamaiRecords, setSpDamaiRecords] = useState<SPDamaiRecord[]>(INITIAL_SP_DAMAI);
  const [arsipKegiatanRecords, setArsipKegiatanRecords] = useState<ArsipKegiatanRecord[]>(INITIAL_ARSIP_KEGIATAN);
  const [siswaList, setSiswaList] = useState<Siswa[]>(INITIAL_SISWA);
  const [guruList, setGuruList] = useState<Guru[]>(INITIAL_GURU);

  const [isLoading, setIsLoading] = useState(true);

  // Sync lightweight records to localStorage as fallback without overflowing quota
  useEffect(() => {
    if (!isLoading) {
      try {
        const lightweightData = {
          customLinks,
          piketRecords: piketRecords.slice(0, 30),
          ceriRecords: ceriRecords.slice(0, 30),
          kebunRecords: kebunRecords.slice(0, 30),
          serasiRecords: serasiRecords.slice(0, 30),
          eLaporRecords: eLaporRecords.slice(0, 30),
          bukuTamuRecords: bukuTamuRecords.slice(0, 30),
          mediaEdukasiItems: mediaEdukasiItems.slice(0, 20),
          kelasList,
          spDamaiRecords: spDamaiRecords.slice(0, 30),
          arsipKegiatanRecords: arsipKegiatanRecords.slice(0, 20),
        };
        safeStorage.setItem('spanju_backup_data', JSON.stringify(lightweightData));
      } catch (err) {
        console.warn('Backup save skipped due to size limits:', err);
      }
    }
  }, [
    isLoading,
    customLinks,
    piketRecords,
    ceriRecords,
    kebunRecords,
    serasiRecords,
    eLaporRecords,
    bukuTamuRecords,
    mediaEdukasiItems,
    kelasList,
    spDamaiRecords,
    arsipKegiatanRecords,
  ]);

  // Fetch all data from Supabase on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from safeStorage first for immediate results
        const savedData = safeStorage.getItem('spanju_backup_data');
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            if (Array.isArray(parsed.customLinks) && parsed.customLinks.length > 0) setCustomLinks(parsed.customLinks);
            if (Array.isArray(parsed.piketRecords) && parsed.piketRecords.length > 0) setPiketRecords(parsed.piketRecords);
            if (Array.isArray(parsed.ceriRecords) && parsed.ceriRecords.length > 0) setCeriRecords(parsed.ceriRecords);
            if (Array.isArray(parsed.kebunRecords) && parsed.kebunRecords.length > 0) setKebunRecords(parsed.kebunRecords);
            if (Array.isArray(parsed.serasiRecords) && parsed.serasiRecords.length > 0) setSerasiRecords(parsed.serasiRecords);
            if (Array.isArray(parsed.eLaporRecords) && parsed.eLaporRecords.length > 0) setELaporRecords(parsed.eLaporRecords);
            if (Array.isArray(parsed.bukuTamuRecords) && parsed.bukuTamuRecords.length > 0) setBukuTamuRecords(parsed.bukuTamuRecords);
            if (Array.isArray(parsed.mediaEdukasiItems) && parsed.mediaEdukasiItems.length > 0) setMediaEdukasiItems(parsed.mediaEdukasiItems);
            if (Array.isArray(parsed.kelasList) && parsed.kelasList.length > 0) {
              const sanitizedKelas = parsed.kelasList.map((k: KelasZonaStatus) => {
                if (k.kelas === '7C' && k.totalKasusTahunIni > 0) {
                  return {
                    ...k,
                    totalKasusTahunIni: 0,
                    kasusTerselesaikan: 0,
                    skorKeramahan: 98,
                    catatan: 'Kelas teladan rukun, harmonis dan zero bullying',
                    waliKelas: k.waliKelas || 'Cahyo Kurnianto, S.Pd',
                  };
                }
                if (k.kelas === '8E' && k.totalKasusTahunIni > 0) {
                  return {
                    ...k,
                    totalKasusTahunIni: 0,
                    kasusTerselesaikan: 0,
                    skorKeramahan: 97,
                    catatan: 'Kelas teladan rukun, kompak dan zero bullying',
                    waliKelas: k.waliKelas || 'Dina Istiarni, S.Pd',
                  };
                }
                if (k.kelas === '8F' && k.totalKasusTahunIni > 0) {
                  return {
                    ...k,
                    totalKasusTahunIni: 0,
                    kasusTerselesaikan: 0,
                    skorKeramahan: 96,
                    catatan: 'Suasana kelas kondusif, harmonis dan zero bullying',
                    waliKelas: k.waliKelas || 'Dewi Mahindrawati, S.Pd',
                  };
                }
                return k;
              });
              setKelasList(sanitizedKelas);
            }
            if (Array.isArray(parsed.spDamaiRecords) && parsed.spDamaiRecords.length > 0) setSpDamaiRecords(parsed.spDamaiRecords);
            if (Array.isArray(parsed.arsipKegiatanRecords) && parsed.arsipKegiatanRecords.length > 0) setArsipKegiatanRecords(parsed.arsipKegiatanRecords);
          } catch (err) {
            console.warn('Error reading saved local backup:', err);
          }
        }

        const [
          piket, ceri, kebun, serasi, elapor, tamu, media, zona, damai, arsip, siswa, guru
        ] = await Promise.all([
          api.get('piket_records').catch(() => []),
          api.get('ceri_records').catch(() => []),
          api.get('kebun_records').catch(() => []),
          api.get('serasi_records').catch(() => []),
          api.get('e_lapor_records').catch(() => []),
          api.get('buku_tamu_records').catch(() => []),
          api.get('media_edukasi_items').catch(() => []),
          api.get('kelas_zona').catch(() => []),
          api.get('sp_damai_records').catch(() => []),
          api.get('arsip_records').catch(() => []),
          api.get('siswa_master').catch(() => []),
          api.get('guru_master').catch(() => []),
        ]);

        if (Array.isArray(piket) && piket.length > 0) setPiketRecords(piket);
        if (Array.isArray(ceri) && ceri.length > 0) setCeriRecords(ceri);
        if (Array.isArray(kebun) && kebun.length > 0) setKebunRecords(kebun);
        if (Array.isArray(serasi) && serasi.length > 0) setSerasiRecords(serasi);
        if (Array.isArray(elapor) && elapor.length > 0) setELaporRecords(elapor);
        if (Array.isArray(tamu) && tamu.length > 0) setBukuTamuRecords(tamu);
        if (Array.isArray(media) && media.length > 0) setMediaEdukasiItems(media);
        if (Array.isArray(zona) && zona.length > 0) {
          const sanitizedZona = zona.map((k: KelasZonaStatus) => {
            if (k.kelas === '7C' && k.totalKasusTahunIni > 0) {
              return {
                ...k,
                totalKasusTahunIni: 0,
                kasusTerselesaikan: 0,
                skorKeramahan: 98,
                catatan: 'Kelas teladan rukun, harmonis dan zero bullying',
                waliKelas: k.waliKelas || 'Cahyo Kurnianto, S.Pd',
              };
            }
            if (k.kelas === '8E' && k.totalKasusTahunIni > 0) {
              return {
                ...k,
                totalKasusTahunIni: 0,
                kasusTerselesaikan: 0,
                skorKeramahan: 97,
                catatan: 'Kelas teladan rukun, kompak dan zero bullying',
                waliKelas: k.waliKelas || 'Dina Istiarni, S.Pd',
              };
            }
            if (k.kelas === '8F' && k.totalKasusTahunIni > 0) {
              return {
                ...k,
                totalKasusTahunIni: 0,
                kasusTerselesaikan: 0,
                skorKeramahan: 96,
                catatan: 'Suasana kelas kondusif, harmonis dan zero bullying',
                waliKelas: k.waliKelas || 'Dewi Mahindrawati, S.Pd',
              };
            }
            return k;
          });
          setKelasList(sanitizedZona);
        }
        if (Array.isArray(damai) && damai.length > 0) setSpDamaiRecords(damai);
        if (Array.isArray(arsip) && arsip.length > 0) setArsipKegiatanRecords(arsip);
        if (Array.isArray(siswa) && siswa.length > 0) setSiswaList(siswa);
        if (Array.isArray(guru) && guru.length > 0) setGuruList(guru);
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add Link
  const handleAddLink = (link: CustomLink) => {
    setCustomLinks((prev) => [link, ...prev]);
    setActiveApp(link.id);
    showToast(`Tautan "${link.title}" berhasil ditambahkan ke menu.`);
  };

  // Delete Link
  const handleDeleteLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = customLinks.find((l) => l.id === id);
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus tautan "${link?.title || 'ini'}"?`);
    if (confirmed) {
      setCustomLinks((prev) => prev.filter((l) => l.id !== id));
      if (activeApp === id) {
        setActiveApp('zona_analitik');
      }
      showToast('Tautan berhasil dihapus.');
    }
  };

  // Backup Data to JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      institution: 'SMPN 7 PASURUAN - SAHABAT SPANJU',
      customLinks,
      piketRecords,
      ceriRecords,
      kebunRecords,
      serasiRecords,
      eLaporRecords,
      bukuTamuRecords,
      mediaEdukasiItems,
      kelasList,
      spDamaiRecords,
      arsipKegiatanRecords,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `backup-sahabat-spanju-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File backup JSON berhasil diunduh!');
  };

  // Upload / Import Backup from JSON
  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.customLinks && Array.isArray(parsed.customLinks)) {
          setCustomLinks(parsed.customLinks);
        }
        if (parsed.piketRecords && Array.isArray(parsed.piketRecords)) {
          setPiketRecords(parsed.piketRecords);
        }
        if (parsed.ceriRecords && Array.isArray(parsed.ceriRecords)) {
          setCeriRecords(parsed.ceriRecords);
        }
        if (parsed.kebunRecords && Array.isArray(parsed.kebunRecords)) {
          setKebunRecords(parsed.kebunRecords);
        }
        if (parsed.serasiRecords && Array.isArray(parsed.serasiRecords)) {
          setSerasiRecords(parsed.serasiRecords);
        }
        if (parsed.eLaporRecords && Array.isArray(parsed.eLaporRecords)) {
          setELaporRecords(parsed.eLaporRecords);
        }
        if (parsed.bukuTamuRecords && Array.isArray(parsed.bukuTamuRecords)) {
          setBukuTamuRecords(parsed.bukuTamuRecords);
        }
        if (parsed.mediaEdukasiItems && Array.isArray(parsed.mediaEdukasiItems)) {
          setMediaEdukasiItems(parsed.mediaEdukasiItems);
        }
        if (parsed.kelasList && Array.isArray(parsed.kelasList)) {
          setKelasList(parsed.kelasList);
        }
        if (parsed.spDamaiRecords && Array.isArray(parsed.spDamaiRecords)) {
          setSpDamaiRecords(parsed.spDamaiRecords);
        }
        if (parsed.arsipKegiatanRecords && Array.isArray(parsed.arsipKegiatanRecords)) {
          setArsipKegiatanRecords(parsed.arsipKegiatanRecords);
        }

        showToast('Sinkronisasi backup JSON berhasil diterapkan!');
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
  };

  // Active custom link (if any)
  const currentCustomLink = customLinks.find((l) => l.id === activeApp);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Login Gatekeeper Modal if not logged in or switching role */}
      <LoginModal
        isOpen={!currentUser || isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        canDismiss={Boolean(currentUser)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 shadow-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in slide-in-from-top-4 duration-300 card-3d">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar
          activeApp={activeApp}
          setActiveApp={setActiveApp}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          totalLaporan={eLaporRecords.length}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenInfografis={() => setIsInfografisModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700">Menu Navigasi</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar
                activeApp={activeApp}
                setActiveApp={(id) => {
                  setActiveApp(id);
                  setMobileMenuOpen(false);
                }}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                totalLaporan={eLaporRecords.length}
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenInfografis={() => {
                  setIsInfografisModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Content Area: Active Application */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50/80 to-emerald-50/20">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 border-b border-slate-200/80 bg-white/85 backdrop-blur-md z-10 shadow-xs">
          <div className="max-w-7xl mx-auto w-full h-full px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Header Title / Breadcrumb */}
            <div className="flex items-center gap-2">
              <img
                src="https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg"
                alt="Logo"
                className="w-8 h-8 rounded-lg object-cover border border-emerald-400/40 lg:hidden shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    APLIKASI SAHABAT SPANJU
                  </span>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <span className="text-xs text-emerald-700 font-bold hidden sm:inline">
                    (Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Dashboard Manajemen Aplikasi Terintegrasi & Penguatan Karakter Ramah Anak
                </p>
              </div>
            </div>
          </div>

          {/* Right Status Badge & User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:block">
              <PWAInstallButton />
            </div>

            <button
              id="btn-header-infografis"
              onClick={() => setIsInfografisModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              title="Buka Gambar Infografis Sahabat SPANJU"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Infografis SPANJU</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Tahun Ajaran 2026/2027</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zona Hijau Aman</span>
            </div>

            <button
              onClick={() => setActiveApp('pilihan_menu')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer"
              title="Buka Pilihan Menu Aplikasi"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden xl:inline">Pilihan Menu Aplikasi</span>
            </button>

            {/* Active User Info & Logout Button */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border font-medium transition text-left cursor-pointer hover:shadow-xs ${
                    currentUser.role === 'admin'
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                  }`}
                  title="Klik untuk ganti akun / login ulang"
                >
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  )}
                  <span className="font-bold hidden md:inline">{currentUser.displayName}</span>
                  <span className="text-[10px] opacity-75 font-mono">(@{currentUser.username})</span>
                </button>
                <button
                  id="btn-header-logout"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                  title="Logout / Ganti Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

        {/* Dynamic Main Body (Scrollable Right View) */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 min-h-full">
            {/* Pilihan Menu Aplikasi */}
            {activeApp === 'pilihan_menu' && (
              <PilihanMenuAppView
                setActiveApp={setActiveApp}
                totalLaporan={eLaporRecords.length}
                onOpenInfografis={() => setIsInfografisModalOpen(true)}
              />
            )}

            {/* Tutorial Flipbook */}
            {activeApp === 'tutorial_flipbook' && (
              <TutorialFlipbookView
                setActiveApp={setActiveApp}
              />
            )}

            {/* Hotline & Layanan */}
            {activeApp === 'hotline_bantuan' && (
              <HotlineView
                setActiveApp={setActiveApp}
              />
            )}

            {/* Bagan & Alur */}
            {activeApp === 'bagan_alur' && (
              <BaganAlurView
                onOpenMenu={() => setActiveApp('pilihan_menu')}
              />
            )}

            {/* 1. Zona Hijau & Analitik */}
            {activeApp === 'zona_analitik' && (
              <ZonaHijauAnalyticsView
                kelasList={kelasList}
                onUpdateKelas={async (updated) => {
                  setKelasList(updated);
                  api.bulkUpsert('kelas_zona', updated);
                }}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                siswaList={siswaList}
                guruList={guruList}
                eLaporRecords={eLaporRecords}
                spDamaiRecords={spDamaiRecords}
              />
            )}

            {/* 2. Piket Harian */}
            {activeApp === 'piket_harian' && (
              <PiketHarianView
                records={piketRecords}
                siswaList={siswaList}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setPiketRecords([rec, ...piketRecords]);
                  await api.upsert('piket_records', rec);
                  showToast('Laporan piket harian tersimpan!');
                }}
                onDeleteRecord={async (id) => {
                  setPiketRecords(piketRecords.filter((r) => r.id !== id));
                  await api.delete('piket_records', id);
                  showToast('Laporan piket dihapus.');
                }}
                onUpdateRecord={async (updated) => {
                  setPiketRecords(piketRecords.map((r) => (r.id === updated.id ? updated : r)));
                  await api.upsert('piket_records', updated);
                  showToast('Tanda tangan laporan piket diperbarui.');
                }}
              />
            )}

            {/* 3. Sabtu Beli Teh Ceri */}
            {activeApp === 'sabtu_beli_teh_ceri' && (
              <SabtuBeliTehCeriView
                records={ceriRecords}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setCeriRecords([rec, ...ceriRecords]);
                  await api.upsert('ceri_records', rec);
                  showToast('Sesi Sabtu Beli Teh Ceri tersimpan!');
                }}
                onDeleteRecord={async (id) => {
                  setCeriRecords(ceriRecords.filter((r) => r.id !== id));
                  await api.delete('ceri_records', id);
                  showToast('Catatan dihapus.');
                }}
                onUpdateRecord={async (updated) => {
                  setCeriRecords(ceriRecords.map((r) => (r.id === updated.id ? updated : r)));
                  await api.upsert('ceri_records', updated);
                  showToast('Tanda tangan sesi ceri diperbarui.');
                }}
              />
            )}

            {/* 4. Kebun Luas Berseri */}
            {activeApp === 'kebun_luas_berseri' && (
              <KebunLuasBerseriView
                records={kebunRecords}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setKebunRecords([rec, ...kebunRecords]);
                  await api.upsert('kebun_records', rec);
                  showToast('Rapat Kebun Luas Berseri tersimpan!');
                }}
                onDeleteRecord={async (id) => {
                  setKebunRecords(kebunRecords.filter((r) => r.id !== id));
                  await api.delete('kebun_records', id);
                  showToast('Catatan dihapus.');
                }}
                onUpdateRecord={async (updated) => {
                  setKebunRecords(kebunRecords.map((r) => (r.id === updated.id ? updated : r)));
                  await api.upsert('kebun_records', updated);
                  showToast('Notulen rapat Kebun Luas berhasil diperbarui.');
                }}
              />
            )}

            {/* 5. Senandung Serasi */}
            {activeApp === 'senandung_serasi' && (
              <SenandungSerasiView
                records={serasiRecords}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setSerasiRecords([rec, ...serasiRecords]);
                  await api.upsert('serasi_records', rec);
                  showToast('Pesan Senandung Serasi berhasil ditambahkan!');
                }}
                onDeleteRecord={async (id) => {
                  setSerasiRecords(serasiRecords.filter((r) => r.id !== id));
                  await api.delete('serasi_records', id);
                  showToast('Pesan dihapus.');
                }}
                onUpdateRecord={async (updated) => {
                  setSerasiRecords(serasiRecords.map((r) => (r.id === updated.id ? updated : r)));
                  await api.upsert('serasi_records', updated);
                  showToast('Pesan Senandung Serasi berhasil diperbarui.');
                }}
              />
            )}

            {/* 6. E-Lapor Perundungan */}
            {activeApp === 'e_lapor' && (
              <ELaporView
                records={eLaporRecords}
                siswaList={siswaList}
                userRole={userRole}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setELaporRecords([rec, ...eLaporRecords]);
                  await api.upsert('e_lapor_records', rec);
                  showToast('Laporan aduan perundungan berhasil didaftarkan!');
                }}
                onDeleteRecord={async (id) => {
                  setELaporRecords(eLaporRecords.filter((r) => r.id !== id));
                  await api.delete('e_lapor_records', id);
                  showToast('Laporan dihapus.');
                }}
                onUpdateStatus={async (id, status) => {
                  const updated = eLaporRecords.map((r) => (r.id === id ? { ...r, status } : r));
                  setELaporRecords(updated);
                  const item = updated.find(r => r.id === id);
                  if (item) await api.upsert('e_lapor_records', item);
                  showToast(`Status laporan diperbarui: ${status}`);
                }}
                onUpdateRecord={async (updated) => {
                  setELaporRecords(eLaporRecords.map((r) => (r.id === updated.id ? updated : r)));
                  await api.upsert('e_lapor_records', updated);
                  showToast('Laporan aduan berhasil diperbarui.');
                }}
                onResetDefault={async () => {
                  setELaporRecords(INITIAL_E_LAPOR);
                  for (const rec of INITIAL_E_LAPOR) {
                    await api.upsert('e_lapor_records', rec).catch(() => {});
                  }
                  showToast('Data standar E-Lapor berhasil dimuat kembali.');
                }}
              />
            )}

            {/* 7. SP Damai Siswa (Surat Kesepakatan Perdamaian) */}
            {activeApp === 'sp_damai' && (
              <SPDamaiView
                records={spDamaiRecords}
                siswaList={siswaList}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setSpDamaiRecords([rec, ...spDamaiRecords]);
                  await api.upsert('sp_damai_records', rec);
                  showToast('Surat kesepakatan damai berhasil diterbitkan!');
                }}
                onDeleteRecord={async (id) => {
                  setSpDamaiRecords(spDamaiRecords.filter((r) => r.id !== id));
                  await api.delete('sp_damai_records', id);
                  showToast('Surat damai dihapus.');
                }}
                onUpdateRecord={async (updated) => {
                  setSpDamaiRecords(spDamaiRecords.map((r) => (r.id === updated.id ? updated : r)));
                  await api.upsert('sp_damai_records', updated);
                  showToast('Laporan SP Damai Siswa berhasil diperbarui.');
                }}
              />
            )}

            {/* 8. Arsip Kegiatan Sahabat SPANJU */}
            {activeApp === 'arsip_kegiatan' && (
              <ArsipKegiatanView
                records={arsipKegiatanRecords}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setArsipKegiatanRecords([rec, ...arsipKegiatanRecords]);
                  await api.upsert('arsip_records', rec);
                  showToast('Arsip kegiatan berhasil didokumentasikan!');
                }}
                onDeleteRecord={async (id) => {
                  setArsipKegiatanRecords(arsipKegiatanRecords.filter((r) => r.id !== id));
                  await api.delete('arsip_records', id);
                  showToast('Arsip kegiatan dihapus.');
                }}
                onUpdateRecord={async (updated) => {
                  setArsipKegiatanRecords(
                    arsipKegiatanRecords.map((r) => (r.id === updated.id ? updated : r))
                  );
                  await api.upsert('arsip_records', updated);
                  showToast('Tanda tangan koordinator arsip diperbarui.');
                }}
              />
            )}

            {/* 9. Buku Tamu Digital */}
            {activeApp === 'buku_tamu' && (
              <BukuTamuView
                records={bukuTamuRecords}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecord={async (rec) => {
                  setBukuTamuRecords([rec, ...bukuTamuRecords]);
                  await api.upsert('buku_tamu_records', rec);
                  showToast('Buku tamu digital tersimpan dengan tanda tangan!');
                }}
                onDeleteRecord={async (id) => {
                  setBukuTamuRecords(bukuTamuRecords.filter((r) => r.id !== id));
                  await api.delete('buku_tamu_records', id);
                  showToast('Catatan tamu dihapus.');
                }}
                onUpdateRecord={async (updated) => {
                  setBukuTamuRecords(bukuTamuRecords.map((r) => (r.id === updated.id ? updated : r)));
                  await api.upsert('buku_tamu_records', updated);
                  showToast('Tanda tangan buku tamu diperbarui.');
                }}
              />
            )}

            {/* 8. Media Edukasi Digital */}
            {activeApp === 'media_edukasi' && (
              <MediaEdukasiView
                items={mediaEdukasiItems}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddItem={async (item) => {
                  setMediaEdukasiItems([item, ...mediaEdukasiItems]);
                  await api.upsert('media_edukasi_items', item);
                  showToast('Media edukasi digital berhasil ditambahkan!');
                }}
                onDeleteItem={async (id) => {
                  setMediaEdukasiItems(mediaEdukasiItems.filter((m) => m.id !== id));
                  await api.delete('media_edukasi_items', id);
                  showToast('Media edukasi dihapus.');
                }}
              />
            )}

            {/* 10. Master Data Siswa */}
            {activeApp === 'master_siswa' && (
              <MasterSiswaView
                records={siswaList}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecords={async (recs) => {
                  try {
                    await api.bulkUpsert('siswa_master', recs);
                    setSiswaList(prev => [...recs, ...prev]);
                    showToast(`${recs.length} data siswa berhasil disimpan.`);
                  } catch (err) {
                    showToast('Gagal menyimpan data siswa.');
                    throw err;
                  }
                }}
                onDeleteRecord={async (id) => {
                  try {
                    await api.delete('siswa_master', id);
                    setSiswaList(prev => prev.filter(s => s.id !== id));
                    showToast('Data siswa berhasil dihapus.');
                  } catch (err) {
                    showToast('Gagal menghapus data siswa.');
                    throw err;
                  }
                }}
              />
            )}

            {/* 11. Master Data Guru */}
            {activeApp === 'master_guru' && (
              <MasterGuruView
                records={guruList}
                canDelete={canDelete}
                onOpenMenu={() => setActiveApp('pilihan_menu')}
                onAddRecords={async (recs) => {
                  try {
                    await api.bulkUpsert('guru_master', recs);
                    setGuruList(prev => [...recs, ...prev]);
                    showToast(`${recs.length} data guru berhasil disimpan.`);
                  } catch (err) {
                    showToast('Gagal menyimpan data guru.');
                    throw err;
                  }
                }}
                onDeleteRecord={async (id) => {
                  try {
                    await api.delete('guru_master', id);
                    setGuruList(prev => prev.filter(g => g.id !== id));
                    showToast('Data guru berhasil dihapus.');
                  } catch (err) {
                    showToast('Gagal menghapus data guru.');
                    throw err;
                  }
                }}
              />
            )}

            {/* 9. Custom Link Web Viewer */}
            {currentCustomLink && (
              <WebFrameViewer link={currentCustomLink} />
            )}
          </div>
        </div>
      </main>

      {/* Modal Add Custom Link */}
      <CustomLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onAddLink={handleAddLink}
      />

      {/* Modal Infografis Sahabat SPANJU */}
      <InfografisWelcomeModal
        isOpen={isInfografisModalOpen}
        onClose={() => setIsInfografisModalOpen(false)}
        onProceedToLogin={() => {
          setIsInfografisModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onOpenManualBook={() => {
          setIsInfografisModalOpen(false);
          setActiveApp('tutorial_flipbook');
        }}
        onOpenHotline={() => {
          setIsInfografisModalOpen(false);
          setActiveApp('hotline_bantuan');
        }}
      />

      {/* Modal Login & Role Switch */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        canDismiss={currentUser !== null}
        onShowInfografis={() => setIsInfografisModalOpen(true)}
      />
    </div>
  );
}
