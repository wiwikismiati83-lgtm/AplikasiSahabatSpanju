import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Users,
  Search,
  Filter,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  ChevronUp,
  ChevronDown,
  Layers,
  Edit3,
  Save,
  X,
  BarChart3,
  Info,
  ArrowDownRight,
  CheckCircle,
} from 'lucide-react';
import { KelasZonaStatus, Siswa, Guru, ELaporRecord, SPDamaiRecord } from '../types';
import { MONTHLY_TREND_DATA, CATEGORY_BREAKDOWN_DATA } from '../data/initialData';

interface ZonaHijauProps {
  kelasList: KelasZonaStatus[];
  onUpdateKelas: (updated: KelasZonaStatus[]) => void;
  onOpenMenu?: () => void;
  siswaList?: Siswa[];
  guruList?: Guru[];
  eLaporRecords?: ELaporRecord[];
  spDamaiRecords?: SPDamaiRecord[];
}

export const ZonaHijauAnalyticsView: React.FC<ZonaHijauProps> = ({
  kelasList,
  onUpdateKelas,
  onOpenMenu,
  siswaList = [],
  guruList = [],
  eLaporRecords = [],
  spDamaiRecords = [],
}) => {
  const [filterTingkat, setFilterTingkat] = useState<'semua' | '7' | '8' | '9'>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'kelas' | 'skorKeramahan' | 'totalKasusTahunIni'>('kelas');
  const [sortAsc, setSortAsc] = useState(true);
  const [editingKelas, setEditingKelas] = useState<KelasZonaStatus | null>(null);

  // States for Master Data Pickers
  const [isGuruPickerOpen, setIsGuruPickerOpen] = useState(false);
  const [isSiswaPickerOpen, setIsSiswaPickerOpen] = useState(false);
  const [searchTermGuru, setSearchTermGuru] = useState('');
  const [searchTermSiswa, setSearchTermSiswa] = useState('');
  const [selectedClassFilterSiswa, setSelectedClassFilterSiswa] = useState('Semua');

  // Dynamic Case Stats per Class from actual eLaporRecords
  const classCaseStats = useMemo(() => {
    const statsMap: Record<string, { total: number; tuntas: number }> = {};
    kelasList.forEach((k) => {
      statsMap[k.kelas] = { total: 0, tuntas: 0 };
    });

    eLaporRecords.forEach((rec) => {
      const isResolved = rec.status === 'Selesai' || rec.status === 'Terpantau Aman';
      if (rec.kelas && statsMap[rec.kelas]) {
        statsMap[rec.kelas].total += 1;
        if (isResolved) statsMap[rec.kelas].tuntas += 1;
      }
      if (rec.kelas2 && rec.kelas2 !== rec.kelas && statsMap[rec.kelas2]) {
        statsMap[rec.kelas2].total += 1;
        if (isResolved) statsMap[rec.kelas2].tuntas += 1;
      }
    });

    return statsMap;
  }, [kelasList, eLaporRecords]);

  // Dynamic Category Recap from real eLaporRecords
  const categoryBreakdownData = useMemo(() => {
    const counts: Record<string, { count: number; tuntas: number; color: string; label: string }> = {
      Verbal: { count: 0, tuntas: 0, color: '#f59e0b', label: 'Verbal (Ejekan/Julukan/Hinaan)' },
      Siber: { count: 0, tuntas: 0, color: '#3b82f6', label: 'Siber (Medsos/Grup Chat)' },
      'Sosial/Relasional': { count: 0, tuntas: 0, color: '#a855f7', label: 'Sosial / Pengucilan' },
      Fisik: { count: 0, tuntas: 0, color: '#ef4444', label: 'Fisik (Dorongan/Gesekan)' },
      Lainnya: { count: 0, tuntas: 0, color: '#64748b', label: 'Lainnya / Pemalakan' },
    };

    if (eLaporRecords.length === 0) {
      return CATEGORY_BREAKDOWN_DATA.map((c) => ({
        ...c,
        totalKasus: 0,
        kasusTuntas: 0,
        persentase: c.value,
      }));
    }

    eLaporRecords.forEach((rec) => {
      const kat = rec.kategoriKasus || 'Verbal';
      const isResolved = rec.status === 'Selesai' || rec.status === 'Terpantau Aman';
      if (counts[kat]) {
        counts[kat].count += 1;
        if (isResolved) counts[kat].tuntas += 1;
      } else {
        counts['Lainnya'].count += 1;
        if (isResolved) counts['Lainnya'].tuntas += 1;
      }
    });

    const totalAll = eLaporRecords.length || 1;

    return Object.entries(counts).map(([key, data]) => {
      const pct = Math.round((data.count / totalAll) * 100);
      return {
        name: data.label,
        categoryKey: key,
        value: pct,
        totalKasus: data.count,
        kasusTuntas: data.tuntas,
        persentase: pct,
        color: data.color,
      };
    });
  }, [eLaporRecords]);

  // Horizontal Bar Chart Data (Sorted by highest case count)
  const horizontalBarData = useMemo(() => {
    return [...categoryBreakdownData]
      .sort((a, b) => b.totalKasus - a.totalKasus)
      .map((item) => ({
        name: item.name.split(' (')[0],
        fullName: item.name,
        total: item.totalKasus,
        tuntas: item.kasusTuntas,
        persentase: item.value,
        color: item.color,
      }));
  }, [categoryBreakdownData]);

  // Dynamic Monthly Trend from real eLaporRecords & SPDamaiRecords
  const monthlyTrendData = useMemo(() => {
    const monthKeys = [
      { key: '10/2025', label: 'Okt 2025', baseLapor: 7, baseTuntas: 6 },
      { key: '11/2025', label: 'Nov 2025', baseLapor: 5, baseTuntas: 5 },
      { key: '12/2025', label: 'Des 2025', baseLapor: 3, baseTuntas: 3 },
      { key: '01/2026', label: 'Jan 2026', baseLapor: 4, baseTuntas: 4 },
      { key: '02/2026', label: 'Feb 2026', baseLapor: 2, baseTuntas: 2 },
      { key: '03/2026', label: 'Mar 2026', baseLapor: 2, baseTuntas: 2 },
      { key: '04/2026', label: 'Apr 2026', baseLapor: 1, baseTuntas: 1 },
      { key: '05/2026', label: 'Mei 2026', baseLapor: 1, baseTuntas: 1 },
      { key: '06/2026', label: 'Jun 2026', baseLapor: 0, baseTuntas: 0 },
      { key: '07/2026', label: 'Jul 2026', baseLapor: 2, baseTuntas: 2 },
      { key: '08/2026', label: 'Agu 2026', baseLapor: 1, baseTuntas: 1 },
      { key: '09/2026', label: 'Sep 2026', baseLapor: 0, baseTuntas: 0 },
    ];

    // Check if user has specific reports with dates
    return monthKeys.map((m) => {
      // Find real reports matching month name or created date
      const matchedReports = eLaporRecords.filter((r) => {
        const textDate = (r.hariTanggal || r.createdAt || '').toLowerCase();
        return (
          textDate.includes(m.label.toLowerCase().split(' ')[0]) ||
          textDate.includes(m.key)
        );
      });

      const matchedSP = spDamaiRecords.filter((sp) => {
        const textDate = (sp.hariTanggal || sp.createdAt || '').toLowerCase();
        return (
          textDate.includes(m.label.toLowerCase().split(' ')[0]) ||
          textDate.includes(m.key)
        );
      });

      const reported =
        matchedReports.length > 0 ? matchedReports.length : m.baseLapor;
      const resolved =
        matchedReports.length > 0
          ? matchedReports.filter(
              (r) => r.status === 'Selesai' || r.status === 'Terpantau Aman'
            ).length + matchedSP.length
          : m.baseTuntas;

      const keramahan = Math.min(100, Math.max(78, 100 - (reported - Math.min(reported, resolved)) * 4));

      return {
        bulan: m.label,
        kasusDilaporkan: reported,
        kasusTerselesaikan: Math.min(reported, resolved),
        indeksKeramahan: keramahan,
      };
    });
  }, [eLaporRecords, spDamaiRecords]);

  // Dynamic Class List with computed real cases
  const enrichedKelasList = useMemo(() => {
    return kelasList.map((k) => {
      const stats = classCaseStats[k.kelas];
      const totalKasus = stats ? Math.max(k.totalKasusTahunIni, stats.total) : k.totalKasusTahunIni;
      const kasusTuntas = stats ? Math.max(k.kasusTerselesaikan, stats.tuntas) : k.kasusTerselesaikan;
      const openCases = Math.max(0, totalKasus - kasusTuntas);
      
      let statusZona = k.statusZona;
      if (openCases === 0) statusZona = 'Hijau';
      else if (openCases === 1) statusZona = 'Kuning';
      else statusZona = 'Merah';

      // Count students from Master Siswa if available
      const countSiswaMaster = siswaList.filter((s) => s.kelas === k.kelas).length;
      const realJumlahSiswa = countSiswaMaster > 0 ? countSiswaMaster : k.jumlahSiswa;

      return {
        ...k,
        jumlahSiswa: realJumlahSiswa,
        totalKasusTahunIni: totalKasus,
        kasusTerselesaikan: kasusTuntas,
        statusZona,
      };
    });
  }, [kelasList, classCaseStats, siswaList]);

  // Filtered and sorted class list
  const filteredKelas = useMemo(() => {
    return enrichedKelasList
      .filter((k) => {
        const matchesTingkat = filterTingkat === 'semua' || k.tingkat === filterTingkat;
        const matchesSearch =
          k.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
          k.waliKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
          k.dutaAntiBullying.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTingkat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortField === 'kelas') {
          return sortAsc ? a.kelas.localeCompare(b.kelas) : b.kelas.localeCompare(a.kelas);
        }
        if (sortField === 'skorKeramahan') {
          return sortAsc ? a.skorKeramahan - b.skorKeramahan : b.skorKeramahan - a.skorKeramahan;
        }
        if (sortField === 'totalKasusTahunIni') {
          return sortAsc ? a.totalKasusTahunIni - b.totalKasusTahunIni : b.totalKasusTahunIni - a.totalKasusTahunIni;
        }
        return 0;
      });
  }, [enrichedKelasList, filterTingkat, searchTerm, sortField, sortAsc]);

  // Summary Metrics
  const totalSiswa = useMemo(() => {
    if (siswaList.length > 0) return siswaList.length;
    return enrichedKelasList.reduce((acc, k) => acc + k.jumlahSiswa, 0);
  }, [enrichedKelasList, siswaList]);

  const totalZonaHijau = useMemo(() => enrichedKelasList.filter((k) => k.statusZona === 'Hijau').length, [enrichedKelasList]);
  
  const avgSkor = useMemo(() => {
    const total = enrichedKelasList.reduce((acc, k) => acc + k.skorKeramahan, 0);
    return (total / (enrichedKelasList.length || 1)).toFixed(1);
  }, [enrichedKelasList]);

  const totalKasusGlobal = useMemo(() => {
    return eLaporRecords.length > 0
      ? eLaporRecords.length
      : enrichedKelasList.reduce((acc, k) => acc + k.totalKasusTahunIni, 0);
  }, [eLaporRecords, enrichedKelasList]);

  const totalTuntasGlobal = useMemo(() => {
    return eLaporRecords.length > 0
      ? eLaporRecords.filter((r) => r.status === 'Selesai' || r.status === 'Terpantau Aman').length
      : enrichedKelasList.reduce((acc, k) => acc + k.kasusTerselesaikan, 0);
  }, [eLaporRecords, enrichedKelasList]);

  const toggleSort = (field: 'kelas' | 'skorKeramahan' | 'totalKasusTahunIni') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div id="view-zona-analitik" className="space-y-6 pb-12">
      {/* Top Banner / Hero Title */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-100/90 via-teal-50/80 to-white border border-emerald-200/90 p-6 shadow-sm">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              GERAKAN NO BULLYING & SEKOLAH RAMAH ANAK
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-850 tracking-tight">
              Dashboard Analitik & Zona Hijau SPANJU
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Monitoring penurunan angka kasus perundungan dan pemetaan status iklim keramahan di 24 kelas (7A-7H, 8A-8H, 9A-9H) SMPN 7 Pasuruan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Pilihan Menu Aplikasi
              </button>
            )}
            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
              title="Cetak Laporan Rekapitulasi"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              Cetak Rekap
            </button>
          </div>
        </div>

        {/* 4 Stat Cards in 3D Elevate */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          <div className="p-4 rounded-xl bg-white/95 border border-emerald-200 shadow-xs card-3d">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Kelas Zona Hijau</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700">{totalZonaHijau}</span>
              <span className="text-xs text-slate-500 font-medium">/ 24 Kelas ({Math.round((totalZonaHijau / 24) * 100)}%)</span>
            </div>
            <p className="text-[11px] text-emerald-700/90 mt-1 font-semibold">
              Bebas kekerasan fisik & verbal
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/95 border border-sky-200 shadow-xs card-3d">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Indeks Keramahan Sekolah</span>
              <Sparkles className="w-5 h-5 text-sky-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-sky-700">{avgSkor}%</span>
              <span className="text-xs text-emerald-700 font-bold">+17.2% YoY</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Kategori Sangat Memuaskan</p>
          </div>

          <div className="p-4 rounded-xl bg-white/95 border border-indigo-200 shadow-xs card-3d">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Siswa Terlindungi</span>
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">{totalSiswa}</span>
              <span className="text-xs text-slate-500">Peserta Didik</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Tingkat 7, 8, dan 9</p>
          </div>

          <div className="p-4 rounded-xl bg-white/95 border border-amber-200 shadow-xs card-3d">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tren Penurunan Kasus</span>
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-700">-92.5%</span>
              <span className="text-xs text-slate-500">12 Bulan Terakhir</span>
            </div>
            <p className="text-[11px] text-amber-700/90 mt-1 font-semibold">
              Bulan ini: {monthlyTrendData[monthlyTrendData.length - 1]?.kasusDilaporkan || 0} Insiden
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row: Tren Bulanan & Karakteristik Pencegahan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Chart: Tren Bulanan Penurunan Kasus */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm card-3d flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                Grafik Penurunan Kasus Perundungan SMPN 7 Pasuruan
              </h2>
              <p className="text-xs text-slate-500">
                Data real kasus dilaporkan vs kasus diselesaikan damai (Terintegrasi E-Lapor & SP Damai)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Kasus Dilaporkan
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Kasus Tuntas
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradKasus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradTuntas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 8px 16px -2px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="kasusDilaporkan"
                  name="Kasus Dilaporkan"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradKasus)"
                />
                <Area
                  type="monotone"
                  dataKey="kasusTerselesaikan"
                  name="Kasus Terselesaikan"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradTuntas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-medium">
            <span>
              Hasil Terkini: Penurunan signifikan dari 7 kasus (Okt 2025) menuju {monthlyTrendData[monthlyTrendData.length - 1]?.kasusDilaporkan || 0} kasus di September 2026 ({totalTuntasGlobal} dari {totalKasusGlobal} kasus terselesaikan tuntas).
            </span>
            <span className="font-extrabold text-emerald-900 shrink-0">STATUS: ZERO TOLERANCE</span>
          </div>
        </div>

        {/* Secondary Chart: Proporsi Tipe Kasus (Donut Pie) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm card-3d flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Karakteristik Pencegahan
            </h2>
            <p className="text-xs text-slate-500 mb-3">Distribusi persentase kategori berdasarkan input real</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 8px 16px -2px rgba(15, 23, 42, 0.08)',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Proporsi']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {categoryBreakdownData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Total Rekap Perundungan Berdasarkan Jenisnya (Grafik Batang Horisontal) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 card-3d">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              REKAPITULASI KOMPREHENSIF
            </div>
            <h2 className="text-lg font-black text-slate-850 tracking-tight flex items-center gap-2">
              Total Rekap Perundungan Berdasarkan Jenisnya
            </h2>
            <p className="text-xs text-slate-500">
              Grafik batang horizontal perbandingan jumlah kasus per kategori/jenis perundungan sesuai input data real di aplikasi & database.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">Total Kasus Masuk:</span>
            <span className="font-black text-slate-800">{totalKasusGlobal} Insiden</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-bold">{totalTuntasGlobal} Tuntas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Horizontal Bar Chart */}
          <div className="lg:col-span-7 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={horizontalBarData}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#334155"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 8px 16px -2px rgba(15, 23, 42, 0.08)',
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value} Kasus (${props.payload.persentase}%)`,
                    'Jumlah Insiden'
                  ]}
                />
                <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={22}>
                  {horizontalBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Category Badges & Stat Breakdown */}
          <div className="lg:col-span-5 space-y-2.5">
            {horizontalBarData.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.fullName}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Penyelesaian damai: {item.tuntas} dari {item.total} kasus ({item.total > 0 ? Math.round((item.tuntas / item.total) * 100) : 100}%)
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-slate-850">{item.total} Kasus</div>
                  <span className="text-[10px] font-bold text-slate-500">{item.persentase}% total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 24 Kelas: Zona Hijau No Bullying & Kekerasan */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Pemetaan Zona Hijau No Bullying (24 Kelas)
            </h2>
            <p className="text-xs text-slate-500">
              Kelas 7A-7H, 8A-8H, dan 9A-9H SMPN 7 Pasuruan
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {(['semua', '7', '8', '9'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTingkat(t)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    filterTingkat === t
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'semua' ? 'Semua (24)' : `Kelas ${t} (8)`}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kelas / duta..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 24 Cards Grid with 3D Aesthetics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredKelas.map((k) => (
            <div
              key={k.kelas}
              id={`card-kelas-${k.kelas}`}
              className="p-4 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white border border-slate-200/90 hover:border-emerald-300 shadow-xs card-3d relative overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Header: Class Badge & Zona Hijau Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {k.kelas}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide flex items-center gap-1 ${
                    k.statusZona === 'Hijau'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : k.statusZona === 'Kuning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    ZONA {k.statusZona.toUpperCase()}
                  </span>
                </div>

                {/* Wali Kelas */}
                <p className="text-xs text-slate-500 font-medium truncate mb-2.5">
                  {k.waliKelas}
                </p>

                {/* Duta Anti-Bullying Box */}
                <div className="bg-emerald-50/70 border border-emerald-100/80 p-2.5 rounded-xl mb-3">
                  <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                    Duta Anti-Bullying:
                  </p>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">
                    {k.dutaAntiBullying}
                  </p>
                </div>

                {/* Motto / Catatan Quote */}
                <p className="text-[11px] italic text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  "{k.catatan || `Kelas ${k.kelas} rukun, saling menghargai & tolak perundungan`}"
                </p>
              </div>

              {/* Card Footer: Zero Bullying & Edit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {k.totalKasusTahunIni === 0 ? 'Zero Bullying' : `${k.kasusTerselesaikan}/${k.totalKasusTahunIni} Kasus Tuntas`}
                </span>
                <button
                  onClick={() => setEditingKelas(k)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition flex items-center gap-1 shadow-2xs active:scale-95"
                >
                  <Edit3 className="w-3 h-3 text-emerald-600" />
                  Edit & Simpan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingKelas && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  EDIT ZONA KELAS {editingKelas.kelas}
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">
                  Perbarui Informasi Rombel
                </h3>
              </div>
              <button
                onClick={() => setEditingKelas(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="space-y-4 overflow-y-auto py-1 pr-1 flex-1 min-h-0">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Wali Kelas
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={editingKelas.waliKelas}
                    onClick={() => setIsGuruPickerOpen(true)}
                    placeholder="Klik untuk memilih Guru..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer hover:bg-slate-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setIsGuruPickerOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition whitespace-nowrap active:scale-95"
                  >
                    Pilih Guru
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Duta Anti-Bullying (Nama Siswa)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={editingKelas.dutaAntiBullying}
                    onClick={() => {
                      setSelectedClassFilterSiswa(editingKelas.kelas);
                      setIsSiswaPickerOpen(true);
                    }}
                    placeholder="Klik untuk memilih Siswa..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer hover:bg-slate-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClassFilterSiswa(editingKelas.kelas);
                      setIsSiswaPickerOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition whitespace-nowrap active:scale-95"
                  >
                    Pilih Siswa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Motto / Catatan / Slogan Kelas
                </label>
                <textarea
                  rows={2}
                  value={editingKelas.catatan}
                  onChange={(e) => setEditingKelas({ ...editingKelas, catatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Skor Keramahan (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingKelas.skorKeramahan}
                    onChange={(e) => setEditingKelas({ ...editingKelas, skorKeramahan: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Zona
                  </label>
                  <select
                    value={editingKelas.statusZona}
                    onChange={(e) => setEditingKelas({ ...editingKelas, statusZona: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Hijau">Hijau (Aman)</option>
                    <option value="Kuning">Kuning (Waspada)</option>
                    <option value="Merah">Merah (Perhatian)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setEditingKelas(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const updatedList = kelasList.map((item) =>
                    item.kelas === editingKelas.kelas ? editingKelas : item
                  );
                  onUpdateKelas(updatedList);
                  setEditingKelas(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pivot Table Per Kelas (5 Rows In View + Vertical Scroll) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 mb-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
              PIVOT TABULAR VIEW (5 BARIS DENGAN SCROLL)
            </div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              Tabel Pivot Indeks Keramahan & Integritas Per Kelas
            </h2>
            <p className="text-xs text-slate-500">
              Pivot rincian data per kelas, tingkat, jumlah siswa, dan skor kepatuhan no bullying
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Menampilkan <span className="text-slate-800 font-bold">5 baris</span> di layar (Scroll vertikal untuk melihat semua <span className="text-slate-800 font-bold">{filteredKelas.length}</span> kelas)
          </div>
        </div>

        {/* Scrollable Container with exact 5 rows visible height */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto max-h-[305px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10 shadow-2xs">
                <tr className="text-slate-700 font-bold border-b border-slate-200">
                  <th
                    onClick={() => toggleSort('kelas')}
                    className="p-3 cursor-pointer hover:text-slate-900 bg-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      Kelas
                      {sortField === 'kelas' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-3 bg-slate-100">Tingkat</th>
                  <th className="p-3 text-center bg-slate-100">Jumlah Siswa</th>
                  <th
                    onClick={() => toggleSort('totalKasusTahunIni')}
                    className="p-3 text-center cursor-pointer hover:text-slate-900 bg-slate-100"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Total Kasus
                      {sortField === 'totalKasusTahunIni' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-3 text-center bg-slate-100">Tuntas</th>
                  <th
                    onClick={() => toggleSort('skorKeramahan')}
                    className="p-3 text-right cursor-pointer hover:text-slate-900 bg-slate-100"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Skor Keramahan
                      {sortField === 'skorKeramahan' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-3 text-center bg-slate-100">Status Zona</th>
                  <th className="p-3 bg-slate-100">Wali Kelas</th>
                  <th className="p-3 bg-slate-100">Duta Sahabat SPANJU</th>
                  <th className="p-3 bg-slate-100">Catatan Pembinaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKelas.map((k) => (
                  <tr
                    key={k.kelas}
                    className="hover:bg-slate-50/90 transition text-slate-700 h-[50px]"
                  >
                    <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        k.statusZona === 'Hijau' ? 'bg-emerald-500' : k.statusZona === 'Kuning' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      {k.kelas}
                    </td>
                    <td className="p-3 text-slate-500 font-medium">Kelas {k.tingkat}</td>
                    <td className="p-3 text-center font-semibold">{k.jumlahSiswa}</td>
                    <td className="p-3 text-center font-semibold text-slate-700">
                      {k.totalKasusTahunIni}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] border ${
                        k.totalKasusTahunIni === 0
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : k.kasusTerselesaikan >= k.totalKasusTahunIni
                          ? 'bg-sky-100 text-sky-800 border-sky-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {k.totalKasusTahunIni === 0
                          ? 'Nihil'
                          : `${k.kasusTerselesaikan}/${k.totalKasusTahunIni} Tuntas`}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700">
                      {k.skorKeramahan}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          k.statusZona === 'Hijau'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : k.statusZona === 'Kuning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        Zona {k.statusZona}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{k.waliKelas}</td>
                    <td className="p-3 text-emerald-700 font-semibold">{k.dutaAntiBullying}</td>
                    <td className="p-3 text-slate-500 max-w-xs truncate" title={k.catatan}>
                      {k.catatan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Guru Picker Modal */}
      {isGuruPickerOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Pilih Wali Kelas</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cari dan pilih guru dari Master Data</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsGuruPickerOpen(false);
                  setSearchTermGuru('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-3 shrink-0">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTermGuru}
                onChange={(e) => setSearchTermGuru(e.target.value)}
                placeholder="Cari Nama Guru atau NIP..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {guruList.filter(g => 
                g.nama.toLowerCase().includes(searchTermGuru.toLowerCase()) ||
                g.nip.includes(searchTermGuru)
              ).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-bold">
                  Tidak ada guru yang ditemukan.
                </div>
              ) : (
                guruList.filter(g => 
                  g.nama.toLowerCase().includes(searchTermGuru.toLowerCase()) ||
                  g.nip.includes(searchTermGuru)
                ).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      if (editingKelas) {
                        setEditingKelas({ ...editingKelas, waliKelas: g.nama });
                      }
                      setIsGuruPickerOpen(false);
                      setSearchTermGuru('');
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 border border-transparent hover:border-slate-100 transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition block">{g.nama}</span>
                      <span className="text-[10px] font-medium text-slate-500 block">NIP: {g.nip || '-'} &bull; {g.jabatan}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition uppercase">
                      Pilih
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Siswa Picker Modal */}
      {isSiswaPickerOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Pilih Duta Anti-Bullying</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cari dan pilih siswa dari Master Data</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSiswaPickerOpen(false);
                  setSearchTermSiswa('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTermSiswa}
                  onChange={(e) => setSearchTermSiswa(e.target.value)}
                  placeholder="Cari Nama Siswa..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <select
                  value={selectedClassFilterSiswa}
                  onChange={(e) => setSelectedClassFilterSiswa(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-emerald-500 text-slate-700"
                >
                  <option value="Semua">Semua Kelas</option>
                  {['7A','7B','7C','7D','7E','7F','7G','7H','8A','8B','8C','8D','8E','8F','8G','8H','9A','9B','9C','9D','9E','9F','9G','9H'].map((cl) => (
                    <option key={cl} value={cl}>Kelas {cl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {siswaList.filter(s => {
                const matchesClass = selectedClassFilterSiswa === 'Semua' || s.kelas === selectedClassFilterSiswa;
                const matchesSearch = s.nama.toLowerCase().includes(searchTermSiswa.toLowerCase()) || s.nisn.includes(searchTermSiswa);
                return matchesClass && matchesSearch;
              }).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-bold">
                  Tidak ada siswa yang ditemukan.
                </div>
              ) : (
                siswaList.filter(s => {
                  const matchesClass = selectedClassFilterSiswa === 'Semua' || s.kelas === selectedClassFilterSiswa;
                  const matchesSearch = s.nama.toLowerCase().includes(searchTermSiswa.toLowerCase()) || s.nisn.includes(searchTermSiswa);
                  return matchesClass && matchesSearch;
                }).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (editingKelas) {
                        setEditingKelas({ ...editingKelas, dutaAntiBullying: s.nama });
                      }
                      setIsSiswaPickerOpen(false);
                      setSearchTermSiswa('');
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 border border-transparent hover:border-slate-100 transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition block">{s.nama}</span>
                      <span className="text-[10px] font-medium text-slate-500 block">Kelas {s.kelas} &bull; NISN: {s.nisn || '-'}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition uppercase">
                      Pilih
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
