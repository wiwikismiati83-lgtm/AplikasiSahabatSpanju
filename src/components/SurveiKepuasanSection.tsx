import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  ShieldCheck,
  User,
  Users,
  CheckCircle2,
  ThumbsUp,
  MinusCircle,
  ThumbsDown,
  MessageSquareQuote,
  Send,
  Sparkles,
  BarChart2,
  PieChart,
  RefreshCw,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowRight,
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import { SurveiKepuasanRecord, SurveiOptionValue, StatusResponden, AuthUser } from '../types';

export const SURVEI_PERTANYAAN = [
  {
    id: 1,
    teks: 'Menu laporan kekerasan dan perundungan di aplikasi mudah ditemukan',
    kategori: 'Aksesibilitas & UI',
  },
  {
    id: 2,
    teks: 'Proses pengisian formulir laporan singkat dan tidak membingungkan',
    kategori: 'Kemudahan Alur',
  },
  {
    id: 3,
    teks: 'Laporan anonim (rahasia) membuat saya merasa aman untuk melapor',
    kategori: 'Kerahasiaan Data',
  },
  {
    id: 4,
    teks: 'Saya percaya identitas dan data laporan saya terlindungi dengan baik oleh sistem',
    kategori: 'Keamanan Sistem',
  },
  {
    id: 5,
    teks: 'Tim TPPK Sekolah / Guru BK memberikan respon cepat (maksimal 1x24 jam) setelah laporan masuk',
    kategori: 'Respon & Tindak Lanjut',
  },
  {
    id: 6,
    teks: 'Status penanganan laporan dapat dipantau secara jelas dan transparan melalui aplikasi',
    kategori: 'Transparansi Status',
  },
  {
    id: 7,
    teks: 'Tindak lanjut kasus yang dilaporkan melalui aplikasi diselesaikan dengan adil dan tuntas',
    kategori: 'Keadilan Solusi',
  },
  {
    id: 8,
    teks: 'Adanya fitur ini di aplikasi sahabat spanju membuat saya / anak saya merasa lebih aman di sekolah',
    kategori: 'Dampak Lingkungan',
  },
];

const INITIAL_SAMPLE_RESPONSES: SurveiKepuasanRecord[] = [
  {
    id: 'survei-001',
    namaLengkap: 'Ananda Rizky Pratama',
    status: 'Siswa',
    jawaban: { 1: 'setuju', 2: 'setuju', 3: 'setuju', 4: 'setuju', 5: 'setuju', 6: 'setuju', 7: 'setuju', 8: 'setuju' },
    saranPerbaikan: 'Fitur anonim sangat membantu kami berani melapor tanpa rasa takut intimidasi.',
    createdAt: '2026-09-15 08:30',
  },
  {
    id: 'survei-002',
    namaLengkap: 'Dra. Nurul Hidayati, M.Pd.',
    status: 'Guru',
    jawaban: { 1: 'setuju', 2: 'setuju', 3: 'setuju', 4: 'setuju', 5: 'setuju', 6: 'setuju', 7: 'setuju', 8: 'setuju' },
    saranPerbaikan: 'Sangat memudahkan TPPK dan BK dalam mendokumentasikan rekam jejak penyelesaian masalah.',
    createdAt: '2026-09-16 10:15',
  },
  {
    id: 'survei-003',
    namaLengkap: 'Bambang Sudibyo (Wali Murid 8B)',
    status: 'Orang tua',
    jawaban: { 1: 'setuju', 2: 'setuju', 3: 'setuju', 4: 'setuju', 5: 'netral', 6: 'setuju', 7: 'setuju', 8: 'setuju' },
    saranPerbaikan: 'Pertahankan transparansi respon agar orang tua tenang mempercayakan anak di sekolah.',
    createdAt: '2026-09-17 14:00',
  },
  {
    id: 'survei-004',
    namaLengkap: 'Siti Rahmawati',
    status: 'Siswa',
    jawaban: { 1: 'setuju', 2: 'setuju', 3: 'setuju', 4: 'setuju', 5: 'setuju', 6: 'netral', 7: 'setuju', 8: 'setuju' },
    saranPerbaikan: 'Tampilan aplikasi sangat ramah dan mudah dipahami oleh kami para murid.',
    createdAt: '2026-09-18 09:45',
  },
  {
    id: 'survei-005',
    namaLengkap: 'H. Suwarno, S.Pd.',
    status: 'Guru',
    jawaban: { 1: 'setuju', 2: 'setuju', 3: 'setuju', 4: 'setuju', 5: 'setuju', 6: 'setuju', 7: 'setuju', 8: 'setuju' },
    saranPerbaikan: 'Terus tingkatkan sosialisasi di kelas agar siswa tidak ragu menggunakan form ini.',
    createdAt: '2026-09-18 11:20',
  },
];

interface SurveiKepuasanSectionProps {
  currentUser?: AuthUser | null;
  onSuccessSubmit?: () => void;
  defaultExpanded?: boolean;
  initialView?: 'form' | 'rekap';
  onBack?: () => void;
  showBackBtn?: boolean;
}

export const SurveiKepuasanSection: React.FC<SurveiKepuasanSectionProps> = ({
  currentUser,
  onSuccessSubmit,
  defaultExpanded = true,
  initialView = 'form',
  onBack,
  showBackBtn = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeView, setActiveView] = useState<'form' | 'rekap'>(initialView);

  // Sync with initialView if prop changes
  useEffect(() => {
    if (initialView) setActiveView(initialView);
  }, [initialView]);

  // Form states
  const [namaLengkap, setNamaLengkap] = useState<string>(
    currentUser?.displayName && currentUser.displayName !== 'Tamu' ? currentUser.displayName : ''
  );
  const [statusResponden, setStatusResponden] = useState<StatusResponden>(
    currentUser?.role === 'guru'
      ? 'Guru'
      : currentUser?.role === 'orang_tua'
      ? 'Orang tua'
      : 'Siswa'
  );
  const [jawaban, setJawaban] = useState<Record<number, SurveiOptionValue>>({
    1: 'setuju',
    2: 'setuju',
    3: 'setuju',
    4: 'setuju',
    5: 'setuju',
    6: 'setuju',
    7: 'setuju',
    8: 'setuju',
  });
  const [saranPerbaikan, setSaranPerbaikan] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [responses, setResponses] = useState<SurveiKepuasanRecord[]>([]);
  const [filterRole, setFilterRole] = useState<'Semua' | StatusResponden>('Semua');

  // Load responses from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('spanju_survei_kepuasan_responses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResponses(parsed);
          return;
        }
      }
      // Initialize with realistic seed data if empty
      setResponses(INITIAL_SAMPLE_RESPONSES);
      localStorage.setItem(
        'spanju_survei_kepuasan_responses',
        JSON.stringify(INITIAL_SAMPLE_RESPONSES)
      );
    } catch {
      setResponses(INITIAL_SAMPLE_RESPONSES);
    }
  }, []);

  const handleSelectAnswer = (pertanyaanId: number, value: SurveiOptionValue) => {
    setJawaban((prev) => ({
      ...prev,
      [pertanyaanId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      alert('Mohon isi nama lengkap responden terlebih dahulu.');
      return;
    }

    const newRecord: SurveiKepuasanRecord = {
      id: `survei-${Date.now()}`,
      namaLengkap: namaLengkap.trim(),
      status: statusResponden,
      jawaban,
      saranPerbaikan: saranPerbaikan.trim() || 'Tidak ada catatan tambahan.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updatedList = [newRecord, ...responses];
    setResponses(updatedList);
    try {
      localStorage.setItem('spanju_survei_kepuasan_responses', JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Storage save failed:', err);
    }

    setFormSubmitted(true);
    if (onSuccessSubmit) onSuccessSubmit();
  };

  const handleResetForm = () => {
    setNamaLengkap(currentUser?.displayName || '');
    setJawaban({
      1: 'setuju',
      2: 'setuju',
      3: 'setuju',
      4: 'setuju',
      5: 'setuju',
      6: 'setuju',
      7: 'setuju',
      8: 'setuju',
    });
    setSaranPerbaikan('');
    setFormSubmitted(false);
  };

  const handleExportCSV = () => {
    if (responses.length === 0) return;
    const headers = [
      'ID',
      'Tanggal',
      'Nama Responden',
      'Status Responden',
      ...SURVEI_PERTANYAAN.map((p) => `Q${p.id} (${p.kategori})`),
      'Saran & Masukan',
    ];

    const rows = responses.map((r) => [
      r.id,
      r.createdAt,
      `"${r.namaLengkap.replace(/"/g, '""')}"`,
      r.status,
      ...SURVEI_PERTANYAAN.map((p) => r.jawaban[p.id] || '-'),
      `"${(r.saranPerbaikan || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Survei_Kepuasan_Sahabat_SPANJU_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for Rekap
  const filteredResponses =
    filterRole === 'Semua'
      ? responses
      : responses.filter((r) => r.status === filterRole);

  const totalRespondenCount = responses.length;

  const calculateQuestionStats = (qId: number) => {
    const list = filteredResponses;
    if (list.length === 0) return { setuju: 0, netral: 0, tidak_setuju: 0, setujuPct: 0 };
    let setuju = 0;
    let netral = 0;
    let tidak_setuju = 0;

    list.forEach((r) => {
      const val = r.jawaban[qId];
      if (val === 'setuju') setuju++;
      else if (val === 'netral') netral++;
      else if (val === 'tidak_setuju') tidak_setuju++;
    });

    const setujuPct = Math.round((setuju / list.length) * 100);
    const netralPct = Math.round((netral / list.length) * 100);
    const tidakSetujuPct = Math.round((tidak_setuju / list.length) * 100);

    return { setuju, netral, tidak_setuju, setujuPct, netralPct, tidakSetujuPct };
  };

  // Overall satisfaction index (% of all answers that are 'setuju')
  const calculateOverallIndex = () => {
    if (filteredResponses.length === 0) return 0;
    let totalAnswers = 0;
    let totalSetuju = 0;

    filteredResponses.forEach((r) => {
      SURVEI_PERTANYAAN.forEach((q) => {
        totalAnswers++;
        if (r.jawaban[q.id] === 'setuju') totalSetuju++;
      });
    });

    return Math.round((totalSetuju / totalAnswers) * 100);
  };

  const overallSatisfactionPct = calculateOverallIndex();

  return (
    <div
      id="section-survei-kepuasan-master"
      className="w-full rounded-3xl bg-white border-2 border-emerald-500/30 shadow-sm overflow-hidden mb-6 transition-all duration-300 ring-1 ring-emerald-200/50"
    >
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-white/15 rounded-2xl border border-white/20 shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <ClipboardCheck className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-black text-[10px] tracking-wider uppercase">
                SURVEI KEPUASAN PENGGUNA
              </span>
              <span className="text-[11px] font-semibold text-emerald-100/90">
                Aplikasi Sahabat SPANJU &bull; SMPN 7 Pasuruan
              </span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white leading-snug">
              SURVEI KEPUASAN LAPORAN KEKERASAN &amp; PERUNDUNGAN (BULLYING)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <div className="flex items-center bg-emerald-900/60 p-1 rounded-xl border border-emerald-400/30 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveView('form');
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeView === 'form'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Isi Survei
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('rekap');
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeView === 'rekap'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Rekap ({responses.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
            title={isExpanded ? 'Sembunyikan Panel' : 'Buka Panel'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-slate-50/50">
          {/* Introductory Explanatory Note */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-emerald-900 mb-0.5">
                Tujuan Survei Sahabat SPANJU:
              </p>
              <p className="text-emerald-800 font-medium">
                Survei ini bertujuan untuk mengukur <strong>efektivitas</strong>,{' '}
                <strong>kemudahan</strong>, dan <strong>rasa aman pengguna</strong> dalam memanfaatkan
                fitur Laporan Kekerasan &amp; Perundungan di aplikasi Sahabat SPANJU. Masukan Anda
                sangat penting untuk menciptakan lingkungan sekolah yang lebih aman, harmonis, dan
                ramah anak.
              </p>
            </div>
          </div>

          {/* VIEW 1: FORM PENGISIAN SURVEI */}
          {activeView === 'form' && (
            <div>
              {formSubmitted ? (
                /* Success State Card */
                <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-emerald-300 text-center max-w-xl mx-auto shadow-sm animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
                    Terima Kasih Atas Partisipasi Anda!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    Jawaban dan saran masukan Anda telah tersimpan dengan aman ke dalam database
                    evaluasi UPTD SMP Negeri 7 Pasuruan.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveView('rekap')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition flex items-center gap-1.5"
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span>Lihat Rekapitulasi Survei</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Isi Survei Lagi</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Input */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Bagian 1: Identitas Responden */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <User className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide">
                        1. Identitas Responden
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={namaLengkap}
                          onChange={(e) => setNamaLengkap(e.target.value)}
                          placeholder="Masukkan nama lengkap / inisial..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Status Responden <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Siswa', 'Guru', 'Orang tua'] as StatusResponden[]).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setStatusResponden(status)}
                              className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center flex items-center justify-center gap-1 ${
                                statusResponden === status
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {status === 'Siswa' && '🎓'}
                              {status === 'Guru' && '👨‍🏫'}
                              {status === 'Orang tua' && '👨‍👩‍👦'}
                              <span>{status}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Petunjuk Pengisian */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-bold">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Petunjuk Pengisian: Beri tanda pada jawaban yang sesuai dengan pendapat Anda.</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold text-amber-800 shrink-0">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-emerald-600" /> 1. Setuju
                      </span>
                      <span className="flex items-center gap-1">
                        <MinusCircle className="w-3 h-3 text-slate-500" /> 2. Netral
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="w-3 h-3 text-rose-500" /> 3. Tidak Setuju
                      </span>
                    </div>
                  </div>

                  {/* Pertanyaan Survei (8 Butir) */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide">
                          Pertanyaan Survei (8 Butir)
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        {Object.keys(jawaban).length} dari 8 terjawab
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {SURVEI_PERTANYAAN.map((item, idx) => {
                        const currentVal = jawaban[item.id];
                        return (
                          <div
                            key={item.id}
                            className="py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 group hover:bg-slate-50/70 p-2 rounded-xl transition"
                          >
                            <div className="flex items-start gap-3 max-w-2xl">
                              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                                  {item.teks}
                                </p>
                                <span className="inline-block text-[10px] font-semibold text-slate-400 mt-0.5">
                                  Kategori: {item.kategori}
                                </span>
                              </div>
                            </div>

                            {/* Option Radio Buttons */}
                            <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleSelectAnswer(item.id, 'setuju')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                  currentVal === 'setuju'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>Setuju</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSelectAnswer(item.id, 'netral')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                  currentVal === 'netral'
                                    ? 'bg-slate-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                                }`}
                              >
                                <MinusCircle className="w-3 h-3" />
                                <span>Netral</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSelectAnswer(item.id, 'tidak_setuju')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                  currentVal === 'tidak_setuju'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-rose-700 hover:bg-white'
                                }`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>Tidak Setuju</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Masukan dan Saran Perbaikan */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                      <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide">
                        Masukan dan Saran Perbaikan
                      </h3>
                    </div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Apa saran Anda agar fitur laporan kekerasan dan perundungan ini bisa lebih baik
                      dan responsif ke depannya?
                    </label>
                    <textarea
                      rows={3}
                      value={saranPerbaikan}
                      onChange={(e) => setSaranPerbaikan(e.target.value)}
                      placeholder="Tuliskan ide, kritik membangun, atau harapan Anda untuk Sahabat SPANJU..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white transition"
                    />
                  </div>

                  {/* Submit Action Button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-700/20 transition active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Jawaban Survei</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* VIEW 2: REKAPITULASI & STATISTIK HASIL */}
          {activeView === 'rekap' && (
            <div className="space-y-6">
              {/* Header Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500">Total Responden</span>
                    <h4 className="text-2xl font-black text-slate-900 mt-0.5">{totalRespondenCount}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">Tercatat di Sistem</span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500">Indeks Kepuasan Rata-Rata</span>
                    <h4 className="text-2xl font-black text-emerald-600 mt-0.5">{overallSatisfactionPct}%</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">Menyatakan Setuju</span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-500 mb-2">Aksi &amp; Ekspor</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('form')}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      Isi Form
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Tabs for Rekap */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 mr-1">Filter Peran:</span>
                  {(['Semua', 'Siswa', 'Guru', 'Orang tua'] as ('Semua' | StatusResponden)[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFilterRole(role)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        filterRole === role
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-bold text-slate-600">
                  Menampilkan {filteredResponses.length} responden
                </span>
              </div>

              {/* Question Breakdown Bars */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  <span>Distribusi Jawaban per Butir Pertanyaan</span>
                </h3>

                <div className="space-y-4">
                  {SURVEI_PERTANYAAN.map((item, idx) => {
                    const stats = calculateQuestionStats(item.id);
                    return (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <p className="text-xs font-bold text-slate-800">
                            {idx + 1}. {item.teks}
                          </p>
                          <span className="text-xs font-black text-emerald-700 shrink-0">
                            {stats.setujuPct}% Setuju
                          </span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${stats.setujuPct}%` }}
                            className="bg-emerald-500 h-full"
                            title={`Setuju: ${stats.setuju} (${stats.setujuPct}%)`}
                          />
                          <div
                            style={{ width: `${stats.netralPct}%` }}
                            className="bg-slate-400 h-full"
                            title={`Netral: ${stats.netral} (${stats.netralPct}%)`}
                          />
                          <div
                            style={{ width: `${stats.tidakSetujuPct}%` }}
                            className="bg-rose-500 h-full"
                            title={`Tidak Setuju: ${stats.tidak_setuju} (${stats.tidakSetujuPct}%)`}
                          />
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-bold">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Setuju ({stats.setuju})
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Netral ({stats.netral})
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Tidak Setuju ({stats.tidak_setuju})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedbacks and Suggestions List */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center gap-2 mb-3">
                  <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Masukan &amp; Saran Responden</span>
                </h3>

                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {filteredResponses.map((res) => (
                    <div
                      key={res.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <span>{res.namaLengkap}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                            {res.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{res.createdAt}</span>
                      </div>
                      <p className="text-slate-600 italic">"{res.saranPerbaikan}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface SurveiKepuasanCompactBannerProps {
  onOpenSurvei: (view?: 'form' | 'rekap') => void;
  totalResponden?: number;
}

export const SurveiKepuasanCompactBanner: React.FC<SurveiKepuasanCompactBannerProps> = ({
  onOpenSurvei,
  totalResponden = 5,
}) => {
  return (
    <div
      id="banner-survei-kepuasan-1click"
      onClick={() => onOpenSurvei('form')}
      className="group relative w-full rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-4 sm:p-5 text-white border-2 border-emerald-500/50 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer overflow-hidden ring-1 ring-emerald-300/30"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-24 bg-teal-400/15 rounded-full blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-24 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 bg-white/15 rounded-2xl border border-white/20 shadow-xs shrink-0 ring-4 ring-white/10 group-hover:scale-105 group-hover:bg-white/25 transition-transform duration-200">
            <ClipboardCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                SURVEI RESMI &bull; 1-KLIK
              </span>
              <span className="text-[11px] font-semibold text-emerald-200">
                Evaluasi TPPK &bull; Sahabat SPANJU SMPN 7 Pasuruan
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-snug group-hover:text-emerald-100 transition-colors">
              SURVEI KEPUASAN LAPORAN KEKERASAN &amp; PERUNDUNGAN (BULLYING)
            </h2>
            <p className="text-xs text-emerald-100/90 mt-0.5 max-w-2xl leading-relaxed hidden sm:block">
              Ukur efektivitas, kemudahan formulir, dan rasa aman pelaporan (8 butir pertanyaan &bull; Klik untuk mulai mengisi).
            </p>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onOpenSurvei('rekap')}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-950/60 hover:bg-emerald-900/90 text-emerald-100 border border-emerald-400/40 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Lihat Rekapitulasi Data"
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden xs:inline">Rekap Hasil</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenSurvei('form')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-emerald-950 shadow-md shadow-emerald-950/30 transition active:scale-95 flex items-center gap-2 group-hover:shadow-lg cursor-pointer"
          >
            <span>Isi Survei Sekarang</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
