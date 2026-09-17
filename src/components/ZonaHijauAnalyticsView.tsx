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
} from 'lucide-react';
import { KelasZonaStatus } from '../types';
import { MONTHLY_TREND_DATA, CATEGORY_BREAKDOWN_DATA } from '../data/initialData';

interface ZonaHijauProps {
  kelasList: KelasZonaStatus[];
  onUpdateKelas: (updated: KelasZonaStatus[]) => void;
}

export const ZonaHijauAnalyticsView: React.FC<ZonaHijauProps> = ({
  kelasList,
  onUpdateKelas,
}) => {
  const [filterTingkat, setFilterTingkat] = useState<'semua' | '7' | '8' | '9'>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'kelas' | 'skorKeramahan' | 'totalKasusTahunIni'>('kelas');
  const [sortAsc, setSortAsc] = useState(true);

  // Filtered and sorted class list
  const filteredKelas = useMemo(() => {
    return kelasList
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
  }, [kelasList, filterTingkat, searchTerm, sortField, sortAsc]);

  // Summary Metrics
  const totalSiswa = useMemo(() => kelasList.reduce((acc, k) => acc + k.jumlahSiswa, 0), [kelasList]);
  const totalZonaHijau = useMemo(() => kelasList.filter((k) => k.statusZona === 'Hijau').length, [kelasList]);
  const avgSkor = useMemo(() => {
    const total = kelasList.reduce((acc, k) => acc + k.skorKeramahan, 0);
    return (total / (kelasList.length || 1)).toFixed(1);
  }, [kelasList]);

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-100/80 via-teal-50/70 to-white border border-emerald-200/90 p-6 shadow-sm">
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
              <span className="text-xs text-slate-500 font-medium">/ 24 Kelas (100%)</span>
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
            <p className="text-[11px] text-amber-700/90 mt-1 font-semibold">Bulan ini: 0 Insiden</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
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
                Data historis kasus dilaporkan vs kasus diselesaikan damai (100% tuntas)
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
              <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-medium">
            <span>Hasil Terkini: Penurunan signifikan dari 7 kasus (Okt 2025) menuju 0 kasus di September 2026.</span>
            <span className="font-extrabold text-emerald-900">STATUS: ZERO TOLERANCE</span>
          </div>
        </div>

        {/* Secondary Chart: Proporsi Tipe Kasus */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm card-3d flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Karakteristik Pencegahan
            </h2>
            <p className="text-xs text-slate-500 mb-3">Distribusi fokus pembinaan karakter siswa</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_BREAKDOWN_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_BREAKDOWN_DATA.map((entry, index) => (
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
            {CATEGORY_BREAKDOWN_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredKelas.map((k) => (
            <div
              key={k.kelas}
              id={`card-kelas-${k.kelas}`}
              className="p-4 rounded-xl bg-gradient-to-b from-slate-50/60 to-white border border-slate-200/90 hover:border-emerald-300 shadow-xs card-3d relative overflow-hidden group"
            >
              {/* Corner Glow based on status */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-3xl flex items-start justify-end p-2 ${
                  k.statusZona === 'Hijau'
                    ? 'bg-emerald-100/80 text-emerald-700'
                    : k.statusZona === 'Kuning'
                    ? 'bg-amber-100/80 text-amber-700'
                    : 'bg-rose-100/80 text-rose-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-800 tracking-wide">{k.kelas}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    k.statusZona === 'Hijau'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                >
                  Zona {k.statusZona}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Skor Keramahan</span>
                  <span className="font-extrabold text-emerald-700">{k.skorKeramahan}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${k.skorKeramahan}%` }}
                  ></div>
                </div>

                <div className="pt-1 text-[11px] space-y-0.5">
                  <p className="text-slate-600 truncate">
                    <span className="text-slate-400">Wali:</span> {k.waliKelas}
                  </p>
                  <p className="text-emerald-700 truncate font-semibold">
                    <span className="text-slate-400 font-normal">Duta:</span> {k.dutaAntiBullying}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>{k.jumlahSiswa} Siswa</span>
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 0 Kasus Aktif
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pivot Table Per Kelas */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              Tabel Pivot Indeks Keramahan & Integritas Per Kelas
            </h2>
            <p className="text-xs text-slate-500">
              Pivot rincian data per kelas, tingkat, jumlah siswa, dan skor kepatuhan no bullying
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="text-slate-800 font-bold">{filteredKelas.length}</span> dari 24 kelas
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th
                  onClick={() => toggleSort('kelas')}
                  className="p-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    Kelas
                    {sortField === 'kelas' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-3">Tingkat</th>
                <th className="p-3 text-center">Jumlah Siswa</th>
                <th
                  onClick={() => toggleSort('totalKasusTahunIni')}
                  className="p-3 text-center cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-center gap-1">
                    Total Kasus
                    {sortField === 'totalKasusTahunIni' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-3 text-center">Tuntas</th>
                <th
                  onClick={() => toggleSort('skorKeramahan')}
                  className="p-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    Skor Keramahan
                    {sortField === 'skorKeramahan' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-3 text-center">Status Zona</th>
                <th className="p-3">Wali Kelas</th>
                <th className="p-3">Duta Sahabat SPANJU</th>
                <th className="p-3">Catatan Pembinaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKelas.map((k) => (
                <tr
                  key={k.kelas}
                  className="hover:bg-slate-50/70 transition text-slate-700"
                >
                  <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {k.kelas}
                  </td>
                  <td className="p-3 text-slate-500 font-medium">Kelas {k.tingkat}</td>
                  <td className="p-3 text-center">{k.jumlahSiswa}</td>
                  <td className="p-3 text-center font-semibold text-slate-700">
                    {k.totalKasusTahunIni}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      {k.totalKasusTahunIni === 0 ? 'Nihil' : '100%'}
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
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
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
  );
};
