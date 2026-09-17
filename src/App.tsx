import React, { useState, useEffect } from 'react';
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
import { WebFrameViewer } from './components/WebFrameViewer';

export default function App() {
  // Role-Based Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('spanju_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation State
  const [activeApp, setActiveApp] = useState<ActiveAppId>('zona_analitik');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('spanju_auth_user', JSON.stringify(user));
    setIsLoginModalOpen(false);
    showToast(`Selamat datang, ${user.displayName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('spanju_auth_user');
    setIsLoginModalOpen(true);
    showToast('Anda telah keluar dari sesi.');
  };

  const userRole: UserRole = currentUser?.role || 'siswa';
  const canDelete = currentUser?.role === 'admin';

  // Persistent Custom Links
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_custom_links');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOM_LINKS;
    } catch {
      return INITIAL_CUSTOM_LINKS;
    }
  });

  // Persistent Module Records
  const [piketRecords, setPiketRecords] = useState<PiketHarianRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_piket');
      return saved ? JSON.parse(saved) : INITIAL_PIKET_HARIAN;
    } catch {
      return INITIAL_PIKET_HARIAN;
    }
  });

  const [ceriRecords, setCeriRecords] = useState<SabtuBeliTehCeriRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_ceri');
      return saved ? JSON.parse(saved) : INITIAL_SABTU_BELI_TEH_CERI;
    } catch {
      return INITIAL_SABTU_BELI_TEH_CERI;
    }
  });

  const [kebunRecords, setKebunRecords] = useState<KebunLuasBerseriRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_kebun');
      return saved ? JSON.parse(saved) : INITIAL_KEBUN_LUAS_BERSERI;
    } catch {
      return INITIAL_KEBUN_LUAS_BERSERI;
    }
  });

  const [serasiRecords, setSerasiRecords] = useState<SenandungSerasiRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_serasi');
      return saved ? JSON.parse(saved) : INITIAL_SENANDUNG_SERASI;
    } catch {
      return INITIAL_SENANDUNG_SERASI;
    }
  });

  const [eLaporRecords, setELaporRecords] = useState<ELaporRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_elapor');
      return saved ? JSON.parse(saved) : INITIAL_E_LAPOR;
    } catch {
      return INITIAL_E_LAPOR;
    }
  });

  const [bukuTamuRecords, setBukuTamuRecords] = useState<BukuTamuRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_tamu');
      return saved ? JSON.parse(saved) : INITIAL_BUKU_TAMU;
    } catch {
      return INITIAL_BUKU_TAMU;
    }
  });

  const [mediaEdukasiItems, setMediaEdukasiItems] = useState<MediaEdukasiItem[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_media');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_EDUKASI;
    } catch {
      return INITIAL_MEDIA_EDUKASI;
    }
  });

  const [kelasList, setKelasList] = useState<KelasZonaStatus[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_kelas_zona');
      return saved ? JSON.parse(saved) : INITIAL_KELAS_ZONA;
    } catch {
      return INITIAL_KELAS_ZONA;
    }
  });

  const [spDamaiRecords, setSpDamaiRecords] = useState<SPDamaiRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_sp_damai');
      return saved ? JSON.parse(saved) : INITIAL_SP_DAMAI;
    } catch {
      return INITIAL_SP_DAMAI;
    }
  });

  const [arsipKegiatanRecords, setArsipKegiatanRecords] = useState<ArsipKegiatanRecord[]>(() => {
    try {
      const saved = localStorage.getItem('spanju_arsip_kegiatan');
      return saved ? JSON.parse(saved) : INITIAL_ARSIP_KEGIATAN;
    } catch {
      return INITIAL_ARSIP_KEGIATAN;
    }
  });

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem('spanju_custom_links', JSON.stringify(customLinks));
  }, [customLinks]);
  useEffect(() => {
    localStorage.setItem('spanju_piket', JSON.stringify(piketRecords));
  }, [piketRecords]);
  useEffect(() => {
    localStorage.setItem('spanju_ceri', JSON.stringify(ceriRecords));
  }, [ceriRecords]);
  useEffect(() => {
    localStorage.setItem('spanju_kebun', JSON.stringify(kebunRecords));
  }, [kebunRecords]);
  useEffect(() => {
    localStorage.setItem('spanju_serasi', JSON.stringify(serasiRecords));
  }, [serasiRecords]);
  useEffect(() => {
    localStorage.setItem('spanju_elapor', JSON.stringify(eLaporRecords));
  }, [eLaporRecords]);
  useEffect(() => {
    localStorage.setItem('spanju_tamu', JSON.stringify(bukuTamuRecords));
  }, [bukuTamuRecords]);
  useEffect(() => {
    localStorage.setItem('spanju_media', JSON.stringify(mediaEdukasiItems));
  }, [mediaEdukasiItems]);
  useEffect(() => {
    localStorage.setItem('spanju_kelas_zona', JSON.stringify(kelasList));
  }, [kelasList]);
  useEffect(() => {
    localStorage.setItem('spanju_sp_damai', JSON.stringify(spDamaiRecords));
  }, [spDamaiRecords]);
  useEffect(() => {
    localStorage.setItem('spanju_arsip_kegiatan', JSON.stringify(arsipKegiatanRecords));
  }, [arsipKegiatanRecords]);

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
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Content Area: Active Application */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50/80 to-emerald-50/20">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 border-b border-slate-200/80 bg-white/85 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between z-10 shadow-xs">
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Tahun Ajaran 2026/2027</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zona Hijau Aman</span>
            </div>

            {/* Active User Info & Logout Button */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border font-medium transition text-left cursor-pointer hover:shadow-xs ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                  }`}
                  title="Klik untuk ganti akun / login ulang"
                >
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  )}
                  <span className="font-bold hidden md:inline">{currentUser.displayName}</span>
                  <span className="text-[10px] opacity-75 font-mono">(@{currentUser.username})</span>
                </button>
                <button
                  id="btn-header-logout"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition flex items-center gap-1 shadow-2xs"
                  title="Logout / Ganti Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Main Body (Scrollable Right View) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {/* 1. Zona Hijau & Analitik */}
            {activeApp === 'zona_analitik' && (
              <ZonaHijauAnalyticsView
                kelasList={kelasList}
                onUpdateKelas={(updated) => setKelasList(updated)}
              />
            )}

            {/* 2. Piket Harian */}
            {activeApp === 'piket_harian' && (
              <PiketHarianView
                records={piketRecords}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setPiketRecords([rec, ...piketRecords]);
                  showToast('Laporan piket harian tersimpan!');
                }}
                onDeleteRecord={(id) => {
                  setPiketRecords(piketRecords.filter((r) => r.id !== id));
                  showToast('Laporan piket dihapus.');
                }}
                onUpdateRecord={(updated) => {
                  setPiketRecords(piketRecords.map((r) => (r.id === updated.id ? updated : r)));
                  showToast('Tanda tangan laporan piket diperbarui.');
                }}
              />
            )}

            {/* 3. Sabtu Beli Teh Ceri */}
            {activeApp === 'sabtu_beli_teh_ceri' && (
              <SabtuBeliTehCeriView
                records={ceriRecords}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setCeriRecords([rec, ...ceriRecords]);
                  showToast('Sesi Sabtu Beli Teh Ceri tersimpan!');
                }}
                onDeleteRecord={(id) => {
                  setCeriRecords(ceriRecords.filter((r) => r.id !== id));
                  showToast('Catatan dihapus.');
                }}
                onUpdateRecord={(updated) => {
                  setCeriRecords(ceriRecords.map((r) => (r.id === updated.id ? updated : r)));
                  showToast('Tanda tangan sesi ceri diperbarui.');
                }}
              />
            )}

            {/* 4. Kebun Luas Berseri */}
            {activeApp === 'kebun_luas_berseri' && (
              <KebunLuasBerseriView
                records={kebunRecords}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setKebunRecords([rec, ...kebunRecords]);
                  showToast('Rapat Kebun Luas Berseri tersimpan!');
                }}
                onDeleteRecord={(id) => {
                  setKebunRecords(kebunRecords.filter((r) => r.id !== id));
                  showToast('Catatan dihapus.');
                }}
                onUpdateRecord={(updated) => {
                  setKebunRecords(kebunRecords.map((r) => (r.id === updated.id ? updated : r)));
                  showToast('Tanda tangan notulen Kebun Luas diperbarui.');
                }}
              />
            )}

            {/* 5. Senandung Serasi */}
            {activeApp === 'senandung_serasi' && (
              <SenandungSerasiView
                records={serasiRecords}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setSerasiRecords([rec, ...serasiRecords]);
                  showToast('Pesan Senandung Serasi berhasil ditambahkan!');
                }}
                onDeleteRecord={(id) => {
                  setSerasiRecords(serasiRecords.filter((r) => r.id !== id));
                  showToast('Pesan dihapus.');
                }}
                onUpdateRecord={(updated) => {
                  setSerasiRecords(serasiRecords.map((r) => (r.id === updated.id ? updated : r)));
                  showToast('Tanda tangan pesan serasi diperbarui.');
                }}
              />
            )}

            {/* 6. E-Lapor Perundungan */}
            {activeApp === 'e_lapor' && (
              <ELaporView
                records={eLaporRecords}
                userRole={userRole}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setELaporRecords([rec, ...eLaporRecords]);
                  showToast('Laporan aduan perundungan berhasil didaftarkan!');
                }}
                onDeleteRecord={(id) => {
                  setELaporRecords(eLaporRecords.filter((r) => r.id !== id));
                  showToast('Laporan dihapus.');
                }}
                onUpdateStatus={(id, status) => {
                  setELaporRecords(
                    eLaporRecords.map((r) => (r.id === id ? { ...r, status } : r))
                  );
                  showToast(`Status laporan diperbarui: ${status}`);
                }}
                onUpdateRecord={(updated) => {
                  setELaporRecords(eLaporRecords.map((r) => (r.id === updated.id ? updated : r)));
                  showToast('Tanda tangan berita acara diperbarui.');
                }}
              />
            )}

            {/* 7. SP Damai Siswa (Surat Kesepakatan Perdamaian) */}
            {activeApp === 'sp_damai' && (
              <SPDamaiView
                records={spDamaiRecords}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setSpDamaiRecords([rec, ...spDamaiRecords]);
                  showToast('Surat kesepakatan damai berhasil diterbitkan!');
                }}
                onDeleteRecord={(id) => {
                  setSpDamaiRecords(spDamaiRecords.filter((r) => r.id !== id));
                  showToast('Surat damai dihapus.');
                }}
                onUpdateRecord={(updated) => {
                  setSpDamaiRecords(spDamaiRecords.map((r) => (r.id === updated.id ? updated : r)));
                  showToast('Tanda tangan surat damai diperbarui.');
                }}
              />
            )}

            {/* 8. Arsip Kegiatan Sahabat SPANJU */}
            {activeApp === 'arsip_kegiatan' && (
              <ArsipKegiatanView
                records={arsipKegiatanRecords}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setArsipKegiatanRecords([rec, ...arsipKegiatanRecords]);
                  showToast('Arsip kegiatan berhasil didokumentasikan!');
                }}
                onDeleteRecord={(id) => {
                  setArsipKegiatanRecords(arsipKegiatanRecords.filter((r) => r.id !== id));
                  showToast('Arsip kegiatan dihapus.');
                }}
                onUpdateRecord={(updated) => {
                  setArsipKegiatanRecords(
                    arsipKegiatanRecords.map((r) => (r.id === updated.id ? updated : r))
                  );
                  showToast('Tanda tangan koordinator arsip diperbarui.');
                }}
              />
            )}

            {/* 9. Buku Tamu Digital */}
            {activeApp === 'buku_tamu' && (
              <BukuTamuView
                records={bukuTamuRecords}
                canDelete={canDelete}
                onAddRecord={(rec) => {
                  setBukuTamuRecords([rec, ...bukuTamuRecords]);
                  showToast('Buku tamu digital tersimpan dengan tanda tangan!');
                }}
                onDeleteRecord={(id) => {
                  setBukuTamuRecords(bukuTamuRecords.filter((r) => r.id !== id));
                  showToast('Catatan tamu dihapus.');
                }}
                onUpdateRecord={(updated) => {
                  setBukuTamuRecords(bukuTamuRecords.map((r) => (r.id === updated.id ? updated : r)));
                  showToast('Tanda tangan buku tamu diperbarui.');
                }}
              />
            )}

            {/* 8. Media Edukasi Digital */}
            {activeApp === 'media_edukasi' && (
              <MediaEdukasiView
                items={mediaEdukasiItems}
                canDelete={canDelete}
                onAddItem={(item) => {
                  setMediaEdukasiItems([item, ...mediaEdukasiItems]);
                  showToast('Media edukasi digital berhasil ditambahkan!');
                }}
                onDeleteItem={(id) => {
                  setMediaEdukasiItems(mediaEdukasiItems.filter((m) => m.id !== id));
                  showToast('Media edukasi dihapus.');
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
    </div>
  );
}
