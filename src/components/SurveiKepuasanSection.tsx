import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { api } from '../lib/api';
import {
  ClipboardCheck,
  ShieldCheck,
  User,
  Users,
  CheckCircle2,
  CheckCircle,
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
  FileText,
  Award,
  X,
  Check,
  Settings2,
  PenTool,
  SlidersHorizontal,
  Database,
  Copy,
  Code,
  Cloud,
  Pencil,
  Trash2,
  Lock,
} from 'lucide-react';
import { SurveiKepuasanRecord, SurveiOptionValue, StatusResponden, AuthUser } from '../types';

export type SignerOptionKey = 'wiwik' | 'eki' | 'both';

export const SIGNER_PROFILES: Record<
  SignerOptionKey,
  { label: string; nip: string; jabatan: string; desc: string }
> = {
  wiwik: {
    label: 'WIWIK ISMIATI, S.Pd',
    nip: '19831116 200904 2 003',
    jabatan: 'Koordinator TPPK / Guru BK',
    desc: 'Koordinator Utama TPPK / Guru BK UPT SMPN 7 Pasuruan',
  },
  eki: {
    label: 'EKI FEBRIANI, S.Pd',
    nip: '19940214 202221 2 014',
    jabatan: 'Koordinator TPPK / Guru BK',
    desc: 'Guru BK / Tim Pencegahan dan Penanganan Kekerasan',
  },
  both: {
    label: 'Keduanya (1. Wiwik Ismiati & 2. Eki Febriani)',
    nip: 'Format Bertingkat Nomor 1 & 2',
    jabatan: 'Koordinator TPPK & Guru BK',
    desc: 'Menampilkan kedua penandatangan secara bertingkat dan berurutan',
  },
};

export const KEPALA_SEKOLAH_PROFILE = {
  label: 'NUR FADILAH, S.Pd., M.Pd',
  nip: '19860410 201001 2 030',
  jabatan: 'Kepala UPT SMP Negeri 7 Pasuruan',
};

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
  {
    id: 'survei-006',
    namaLengkap: 'Drs. Hendro Wibowo (Pengawas Dispendik / Tamu)',
    status: 'Tamu',
    jawaban: { 1: 'setuju', 2: 'setuju', 3: 'setuju', 4: 'setuju', 5: 'setuju', 6: 'setuju', 7: 'setuju', 8: 'setuju' },
    saranPerbaikan: 'Inovasi digital sekolah ramah anak yang patut diapresiasi dan direplikasi.',
    createdAt: '2026-09-18 13:30',
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
      : currentUser?.displayName?.toLowerCase().includes('tamu') || (currentUser?.role as string) === 'tamu'
      ? 'Tamu'
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

  // Supabase Sync & SQL Modal states
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Popup & Signer Choice state
  const [isSignerModalOpen, setIsSignerModalOpen] = useState<boolean>(false);
  const [selectedSigner, setSelectedSigner] = useState<SignerOptionKey>('wiwik');

  // Edit & Delete Responden state
  const [editingItem, setEditingItem] = useState<SurveiKepuasanRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editNama, setEditNama] = useState<string>('');
  const [editStatus, setEditStatus] = useState<StatusResponden>('Siswa');
  const [editSaran, setEditSaran] = useState<string>('');
  const [editJawaban, setEditJawaban] = useState<Record<number, SurveiOptionValue>>({});

  const [deleteConfirmItem, setDeleteConfirmItem] = useState<SurveiKepuasanRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Load responses from Supabase (with fallback to local storage / seed)
  const loadResponsesFromSupabase = async (forceRefresh: boolean = false) => {
    setIsSyncing(true);
    try {
      // 1. Try fetching from Supabase
      const cloudData = await api.get('survei_kepuasan_records');
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        const normalized: SurveiKepuasanRecord[] = cloudData.map((item: any) => {
          let jwb = item.jawaban;
          if (typeof jwb === 'string') {
            try {
              jwb = JSON.parse(jwb);
            } catch {}
          }
          if (!jwb || typeof jwb !== 'object') {
            jwb = {
              1: item.q1 || 'setuju',
              2: item.q2 || 'setuju',
              3: item.q3 || 'setuju',
              4: item.q4 || 'setuju',
              5: item.q5 || 'setuju',
              6: item.q6 || 'setuju',
              7: item.q7 || 'setuju',
              8: item.q8 || 'setuju',
            };
          }
          return {
            id: String(item.id || `survei-${Date.now()}`),
            namaLengkap: String(item.namaLengkap || item.namalengkap || 'Responden'),
            status: (item.status as StatusResponden) || 'Siswa',
            jawaban: jwb,
            saranPerbaikan: String(item.saranPerbaikan || item.saranperbaikan || '-'),
            createdAt: String(item.createdAt || item.createdat || new Date().toISOString().slice(0, 16)),
          };
        });

        setResponses(normalized);
        try {
          localStorage.setItem('spanju_survei_kepuasan_responses', JSON.stringify(normalized));
        } catch {}
        setIsSyncing(false);
        return;
      }
    } catch (err) {
      console.warn('Supabase fetch note (using local cache):', err);
    }

    // 2. Fallback to localStorage or seed data
    try {
      const stored = localStorage.getItem('spanju_survei_kepuasan_responses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResponses(parsed);
          setIsSyncing(false);
          return;
        }
      }
    } catch {}

    // 3. Default to Initial Seed data
    setResponses(INITIAL_SAMPLE_RESPONSES);
    try {
      localStorage.setItem(
        'spanju_survei_kepuasan_responses',
        JSON.stringify(INITIAL_SAMPLE_RESPONSES)
      );
      // Attempt to seed Supabase quietly
      api.bulkUpsert('survei_kepuasan_records', INITIAL_SAMPLE_RESPONSES).catch(() => {});
    } catch {}
    setIsSyncing(false);
  };

  useEffect(() => {
    loadResponsesFromSupabase();
  }, []);

  const handleSelectAnswer = (pertanyaanId: number, value: SurveiOptionValue) => {
    setJawaban((prev) => ({
      ...prev,
      [pertanyaanId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      alert('Mohon isi nama lengkap responden terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    const newRecord: SurveiKepuasanRecord = {
      id: `survei-${Date.now()}`,
      namaLengkap: namaLengkap.trim(),
      status: statusResponden,
      jawaban,
      saranPerbaikan: saranPerbaikan.trim() || 'Tidak ada catatan tambahan.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    // Update state immediately for instant feedback
    const updatedList = [newRecord, ...responses];
    setResponses(updatedList);

    // Save to local storage as offline cache
    try {
      localStorage.setItem('spanju_survei_kepuasan_responses', JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Storage save note:', err);
    }

    // Save to Supabase Cloud Database
    try {
      await api.upsert('survei_kepuasan_records', newRecord);
    } catch (err) {
      console.warn('Supabase upsert note:', err);
    }

    setIsSubmitting(false);
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

  // Role authorization: only admin or operator can delete / edit responses
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'operator';

  // Edit Responden Handlers
  const handleOpenEdit = (item: SurveiKepuasanRecord) => {
    if (!isAdmin) {
      alert('Akses Ditolak: Hanya Administrator yang memiliki hak akses untuk mengubah data responden.');
      return;
    }
    setEditingItem(item);
    setEditNama(item.namaLengkap);
    setEditStatus(item.status);
    setEditSaran(item.saranPerbaikan || '');
    setEditJawaban({ ...item.jawaban });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingItem) return;
    const updatedRecord: SurveiKepuasanRecord = {
      ...editingItem,
      namaLengkap: editNama.trim() || 'Responden',
      status: editStatus,
      saranPerbaikan: editSaran.trim(),
      jawaban: editJawaban,
    };

    const updatedResponses = responses.map((r) =>
      r.id === editingItem.id ? updatedRecord : r
    );
    setResponses(updatedResponses);
    try {
      localStorage.setItem('spanju_survei_kepuasan_responses', JSON.stringify(updatedResponses));
    } catch {}

    try {
      await api.upsert('survei_kepuasan_records', {
        id: updatedRecord.id,
        namaLengkap: updatedRecord.namaLengkap,
        status: updatedRecord.status,
        jawaban: JSON.stringify(updatedRecord.jawaban),
        saranPerbaikan: updatedRecord.saranPerbaikan,
        createdAt: updatedRecord.createdAt,
      });
    } catch (err) {
      console.warn('Sync edit fallback:', err);
    }

    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Delete Responden Handlers
  const handleOpenDelete = (item: SurveiKepuasanRecord) => {
    if (!isAdmin) {
      alert('Akses Ditolak: Hanya Administrator yang memiliki izin untuk menghapus masukan responden.');
      return;
    }
    setDeleteConfirmItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin || !deleteConfirmItem) return;
    const targetId = deleteConfirmItem.id;
    const remaining = responses.filter((r) => r.id !== targetId);
    setResponses(remaining);
    try {
      localStorage.setItem('spanju_survei_kepuasan_responses', JSON.stringify(remaining));
    } catch {}

    try {
      await api.delete('survei_kepuasan_records', targetId);
    } catch (err) {
      console.warn('Delete cloud fallback:', err);
    }

    setIsDeleteModalOpen(false);
    setDeleteConfirmItem(null);
  };

  // Indonesian date formatter for official documents
  const formatIndonesianDate = (date: Date = new Date()) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Calculations for Rekap
  const filteredResponses =
    filterRole === 'Semua'
      ? responses
      : responses.filter((r) => r.status === filterRole);

  const totalRespondenCount = responses.length;

  const calculateQuestionStats = (qId: number) => {
    const list = filteredResponses;
    if (list.length === 0) return { setuju: 0, netral: 0, tidak_setuju: 0, setujuPct: 0, netralPct: 0, tidakSetujuPct: 0 };
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

  // EXPORT EXCEL (.xlsx) WITH OFFICIAL KOP SURAT
  const handleExportExcel = (signerKey: SignerOptionKey = selectedSigner) => {
    if (responses.length === 0) {
      alert('Belum ada data respons survey untuk diekspor.');
      return;
    }

    const currentDateStr = formatIndonesianDate();
    const overallIndex = calculateOverallIndex();
    const listToExport = filteredResponses;

    const aoaData: any[][] = [];

    // Kop Surat Resmi Sekolah
    aoaData.push(['PEMERINTAH KOTA PASURUAN']);
    aoaData.push(['DINAS PENDIDIKAN DAN KEBUDAYAAN']);
    aoaData.push(['UPT SMP NEGERI 7 PASURUAN']);
    aoaData.push(['Jl. Simpang Slamet Riadi Nomor 2, Kota Pasuruan, Jawa Timur 67139 | Telp: (0343) 426845 | Pos-el: smp7pas@yahoo.co.id | Laman: www.smpn7pasuruan.sch.id']);
    aoaData.push(['====================================================================================================================================================']);
    aoaData.push([]);
    aoaData.push(['LAPORAN REKAPITULASI HASIL SURVEY KEPUASAN PENGGUNA']);
    aoaData.push(['FITUR LAYANAN LAPORAN KEKERASAN & PERUNDUNGAN (BULLYING) - APLIKASI SAHABAT SPANJU']);
    aoaData.push([]);

    // Bagian I: Ringkasan Metadata
    aoaData.push(['I. INFORMASI UMUM & STATISTIK REKAPITULASI']);
    aoaData.push(['Tanggal Unduh Dokumen', currentDateStr]);
    aoaData.push(['Filter Kategori Responden', filterRole === 'Semua' ? 'Semua Peran (Siswa, Guru, Orang Tua, Tamu)' : filterRole]);
    aoaData.push(['Total Responden Tercatat', `${listToExport.length} Orang (Siswa: ${listToExport.filter(r => r.status === 'Siswa').length}, Guru: ${listToExport.filter(r => r.status === 'Guru').length}, Orang Tua: ${listToExport.filter(r => r.status === 'Orang tua').length}, Tamu: ${listToExport.filter(r => r.status === 'Tamu').length})`]);
    aoaData.push(['Indeks Kepuasan Rata-Rata', `${overallIndex}% (Menyatakan Setuju / Puas)`]);
    aoaData.push([]);

    // Bagian II: Ringkasan per Butir Pertanyaan
    aoaData.push(['II. DISTRIBUSI EVALUASI PER BUTIR PERTANYAAN (Q1 - Q8)']);
    aoaData.push([
      'No',
      'Butir Indikator Evaluasi Survey',
      'Kategori',
      'Jml Setuju',
      '% Setuju',
      'Jml Netral',
      '% Netral',
      'Jml Tdk Setuju',
      '% Tdk Setuju'
    ]);

    SURVEI_PERTANYAAN.forEach((item, idx) => {
      const s = calculateQuestionStats(item.id);
      aoaData.push([
        idx + 1,
        item.teks,
        item.kategori,
        s.setuju,
        `${s.setujuPct}%`,
        s.netral,
        `${s.netralPct}%`,
        s.tidak_setuju,
        `${s.tidakSetujuPct}%`
      ]);
    });

    aoaData.push([]);

    // Bagian III: Rincian Data Responden
    aoaData.push(['III. RINCIAN DATA JAWABAN & MASUKAN RESPONDEN']);
    aoaData.push([
      'No',
      'ID Respon',
      'Waktu Pengisian',
      'Nama Lengkap Responden',
      'Status Responden',
      'Q1 (Akses)',
      'Q2 (Alur Form)',
      'Q3 (Kerahasiaan)',
      'Q4 (Keamanan Data)',
      'Q5 (Respon 1x24 Jam)',
      'Q6 (Transparansi Status)',
      'Q7 (Keadilan Tindak Lanjut)',
      'Q8 (Rasa Aman Sekolah)',
      'Masukan & Saran Perbaikan'
    ]);

    listToExport.forEach((r, idx) => {
      const formatAns = (val: string | undefined) => {
        if (val === 'setuju') return 'Setuju';
        if (val === 'netral') return 'Netral';
        if (val === 'tidak_setuju') return 'Tidak Setuju';
        return '-';
      };
      aoaData.push([
        idx + 1,
        r.id,
        r.createdAt,
        r.namaLengkap,
        r.status,
        formatAns(r.jawaban[1]),
        formatAns(r.jawaban[2]),
        formatAns(r.jawaban[3]),
        formatAns(r.jawaban[4]),
        formatAns(r.jawaban[5]),
        formatAns(r.jawaban[6]),
        formatAns(r.jawaban[7]),
        formatAns(r.jawaban[8]),
        r.saranPerbaikan || '-'
      ]);
    });

    aoaData.push([]);
    aoaData.push([]);

    // Lembar Tanda Tangan Resmi sesuai Pilihan
    aoaData.push(['', '', '', '', '', '', '', 'Pasuruan, ' + currentDateStr]);
    aoaData.push(['', 'Koordinator TPPK / Guru BK', '', '', '', '', '', 'Mengetahui,']);
    aoaData.push(['', 'UPT SMP Negeri 7 Pasuruan', '', '', '', '', '', 'Kepala UPT SMP Negeri 7 Pasuruan']);
    aoaData.push([]);
    aoaData.push([]);

    if (signerKey === 'wiwik') {
      aoaData.push(['', 'WIWIK ISMIATI, S.Pd', '', '', '', '', '', KEPALA_SEKOLAH_PROFILE.label]);
      aoaData.push(['', 'NIP. 19831116 200904 2 003', '', '', '', '', '', `NIP. ${KEPALA_SEKOLAH_PROFILE.nip}`]);
    } else if (signerKey === 'eki') {
      aoaData.push(['', 'EKI FEBRIANI, S.Pd', '', '', '', '', '', KEPALA_SEKOLAH_PROFILE.label]);
      aoaData.push(['', 'NIP. 19940214 202221 2 014', '', '', '', '', '', `NIP. ${KEPALA_SEKOLAH_PROFILE.nip}`]);
    } else {
      // 'both'
      aoaData.push(['', '1. WIWIK ISMIATI, S.Pd', '', '', '', '', '', KEPALA_SEKOLAH_PROFILE.label]);
      aoaData.push(['', '   NIP. 19831116 200904 2 003', '', '', '', '', '', `NIP. ${KEPALA_SEKOLAH_PROFILE.nip}`]);
      aoaData.push([]);
      aoaData.push(['', '2. EKI FEBRIANI, S.Pd']);
      aoaData.push(['', '   NIP. 19940214 202221 2 014']);
    }

    const ws = XLSX.utils.aoa_to_sheet(aoaData);

    // Set Column Widths for clean viewing
    ws['!cols'] = [
      { wch: 6 },   // No
      { wch: 18 },  // ID
      { wch: 20 },  // Waktu
      { wch: 28 },  // Nama
      { wch: 16 },  // Status
      { wch: 15 },  // Q1
      { wch: 15 },  // Q2
      { wch: 15 },  // Q3
      { wch: 15 },  // Q4
      { wch: 16 },  // Q5
      { wch: 16 },  // Q6
      { wch: 16 },  // Q7
      { wch: 16 },  // Q8
      { wch: 45 },  // Saran
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekapitulasi Survey');
    XLSX.writeFile(wb, `Laporan_Survey_Kepuasan_SPANJU_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // EXPORT WORD (.doc) WITH OFFICIAL SCHOOL LETTERHEAD & FORMATTING
  const handleExportWord = (signerKey: SignerOptionKey = selectedSigner) => {
    if (responses.length === 0) {
      alert('Belum ada data respons survey untuk diekspor.');
      return;
    }

    const currentDateStr = formatIndonesianDate();
    const overallIndex = calculateOverallIndex();
    const listToExport = filteredResponses;

    let signerBlockHtml = '';
    if (signerKey === 'wiwik') {
      signerBlockHtml = `
        <table class="ttd-table">
          <tr>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              <br/>
              <strong>Koordinator TPPK / Guru BK</strong><br/>
              UPT SMP Negeri 7 Pasuruan
              <br/><br/><br/><br/><br/>
              <strong><u>WIWIK ISMIATI, S.Pd</u></strong><br/>
              NIP. 19831116 200904 2 003
            </td>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              Pasuruan, ${currentDateStr}<br/>
              <strong>Mengetahui,</strong><br/>
              <strong>Kepala UPT SMP Negeri 7 Pasuruan</strong>
              <br/><br/><br/><br/><br/>
              <strong><u>${KEPALA_SEKOLAH_PROFILE.label}</u></strong><br/>
              NIP. ${KEPALA_SEKOLAH_PROFILE.nip}
            </td>
          </tr>
        </table>
      `;
    } else if (signerKey === 'eki') {
      signerBlockHtml = `
        <table class="ttd-table">
          <tr>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              <br/>
              <strong>Koordinator TPPK / Guru BK</strong><br/>
              UPT SMP Negeri 7 Pasuruan
              <br/><br/><br/><br/><br/>
              <strong><u>EKI FEBRIANI, S.Pd</u></strong><br/>
              NIP. 19940214 202221 2 014
            </td>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              Pasuruan, ${currentDateStr}<br/>
              <strong>Mengetahui,</strong><br/>
              <strong>Kepala UPT SMP Negeri 7 Pasuruan</strong>
              <br/><br/><br/><br/><br/>
              <strong><u>${KEPALA_SEKOLAH_PROFILE.label}</u></strong><br/>
              NIP. ${KEPALA_SEKOLAH_PROFILE.nip}
            </td>
          </tr>
        </table>
      `;
    } else {
      // 'both'
      signerBlockHtml = `
        <table class="ttd-table">
          <tr>
            <td style="width: 55%; text-align: left; padding-left: 15px; vertical-align: top;">
              <br/>
              <strong>Koordinator TPPK / Guru BK</strong><br/>
              UPT SMP Negeri 7 Pasuruan
              <br/><br/><br/>
              <strong>1. <u>WIWIK ISMIATI, S.Pd</u></strong><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;NIP. 19831116 200904 2 003
              <br/><br/>
              <strong>2. <u>EKI FEBRIANI, S.Pd</u></strong><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;NIP. 19940214 202221 2 014
            </td>
            <td style="width: 45%; text-align: center; vertical-align: top;">
              Pasuruan, ${currentDateStr}<br/>
              <strong>Mengetahui,</strong><br/>
              <strong>Kepala UPT SMP Negeri 7 Pasuruan</strong>
              <br/><br/><br/><br/><br/>
              <strong><u>${KEPALA_SEKOLAH_PROFILE.label}</u></strong><br/>
              NIP. ${KEPALA_SEKOLAH_PROFILE.nip}
            </td>
          </tr>
        </table>
      `;
    }

    const htmlDocContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Laporan Survey Kepuasan - UPT SMPN 7 Pasuruan</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 2cm 2cm 2cm 2cm;
            mso-page-orientation: portrait;
          }
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 11pt;
            line-height: 1.35;
            color: #000;
          }
          .kop-table {
            width: 100%;
            border-collapse: collapse;
            border: none;
            margin-bottom: 2px;
          }
          .kop-table td {
            border: none;
            padding: 2px;
            vertical-align: middle;
          }
          .kop-title-sub {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
            margin: 0;
          }
          .kop-title-main {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
            margin: 2px 0 0 0;
          }
          .kop-address {
            font-size: 9pt;
            text-align: center;
            margin: 2px 0 0 0;
            font-family: Arial, sans-serif;
          }
          .double-line {
            border-top: 3px double #000;
            margin-top: 4px;
            margin-bottom: 16px;
          }
          .doc-title {
            text-align: center;
            font-weight: bold;
            font-size: 12pt;
            text-transform: uppercase;
            text-decoration: underline;
            margin-top: 10px;
            margin-bottom: 4px;
          }
          .doc-subtitle {
            text-align: center;
            font-weight: bold;
            font-size: 10.5pt;
            margin-bottom: 18px;
          }
          .section-header {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 14px;
            margin-bottom: 6px;
          }
          table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            font-size: 9.5pt;
          }
          table.data-table th, table.data-table td {
            border: 1px solid #000;
            padding: 5px 6px;
          }
          table.data-table th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .ttd-table {
            width: 100%;
            border-collapse: collapse;
            border: none;
            margin-top: 30px;
          }
          .ttd-table td {
            border: none;
            padding: 4px;
            vertical-align: top;
            font-size: 11pt;
          }
        </style>
      </head>
      <body>
        <!-- KOP SURAT KEDINASAN RESMI -->
        <table class="kop-table">
          <tr>
            <td style="width: 15%; text-align: center;">
              <img src="https://i.ibb.co.com/C3Y7JXkN/logo-dinas.png" width="65" height="65" alt="Logo Pemkot Pasuruan" />
            </td>
            <td style="width: 70%; text-align: center;">
              <div class="kop-title-sub">PEMERINTAH KOTA PASURUAN</div>
              <div class="kop-title-sub">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
              <div class="kop-title-main">UPT SMP NEGERI 7 PASURUAN</div>
              <div class="kop-address">
                Jalan Simpang Slamet Riadi Nomor 2, Kota Pasuruan, Jawa Timur 67139<br/>
                Telepon (0343) 426845 &bull; Pos-el: smp7pas@yahoo.co.id &bull; Laman: www.smpn7pasuruan.sch.id
              </div>
            </td>
            <td style="width: 15%; text-align: center;">
              <img src="https://iili.io/KDFk4fI.png" width="65" height="65" alt="Logo SMPN 7 Pasuruan" />
            </td>
          </tr>
        </table>
        <div class="double-line"></div>

        <!-- JUDUL DOKUMEN -->
        <div class="doc-title">LAPORAN REKAPITULASI HASIL SURVEY KEPUASAN PENGGUNA</div>
        <div class="doc-subtitle">FITUR LAYANAN LAPORAN KEKERASAN &amp; PERUNDUNGAN (BULLYING)<br/>APLIKASI SAHABAT SPANJU &bull; TAHUN AJARAN 2026/2027</div>

        <!-- I. INFORMASI UMUM & STATISTIK -->
        <div class="section-header">I. RINGKASAN DATA STATISTIK</div>
        <table class="data-table" style="width: 100%;">
          <tr>
            <td style="width: 32%; font-weight: bold; background-color: #f2f2f2;">Tanggal Dokumen Cetak</td>
            <td style="width: 68%;">${currentDateStr}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f2f2f2;">Kategori Filter Responden</td>
            <td>${filterRole === 'Semua' ? 'Semua Peran (Siswa, Guru, Orang Tua, Tamu)' : filterRole}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f2f2f2;">Jumlah Total Responden</td>
            <td><strong>${listToExport.length} Responden</strong> (Siswa: ${listToExport.filter(r => r.status === 'Siswa').length}, Guru: ${listToExport.filter(r => r.status === 'Guru').length}, Orang Tua: ${listToExport.filter(r => r.status === 'Orang tua').length}, Tamu: ${listToExport.filter(r => r.status === 'Tamu').length})</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f2f2f2;">Indeks Kepuasan Rata-Rata</td>
            <td><strong style="color: #047857; font-size: 11pt;">${overallIndex}% (Menyatakan Setuju / Sangat Puas)</strong></td>
          </tr>
        </table>

        <!-- II. TABEL DISTRIBUSI JAWABAN PER BUTIR PERTANYAAN -->
        <div class="section-header">II. DISTRIBUSI EVALUASI PER BUTIR PERTANYAAN (Q1 - Q8)</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 45%;">Butir Indikator Evaluasi</th>
              <th style="width: 20%;">Kategori</th>
              <th style="width: 10%;">Setuju</th>
              <th style="width: 10%;">Netral</th>
              <th style="width: 10%;">Tdk Setuju</th>
            </tr>
          </thead>
          <tbody>
            ${SURVEI_PERTANYAAN.map((item, idx) => {
              const stats = calculateQuestionStats(item.id);
              return `
                <tr>
                  <td class="text-center">${idx + 1}</td>
                  <td>${item.teks}</td>
                  <td>${item.kategori}</td>
                  <td class="text-center"><strong>${stats.setuju}</strong> (${stats.setujuPct}%)</td>
                  <td class="text-center">${stats.netral} (${stats.netralPct}%)</td>
                  <td class="text-center">${stats.tidak_setuju} (${stats.tidakSetujuPct}%)</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- III. TABEL RINCIAN RESPONDEN & MASUKAN -->
        <div class="section-header">III. RINCIAN DATA RESPONDEN &amp; SARAN PERBAIKAN</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 4%;">No</th>
              <th style="width: 13%;">Waktu</th>
              <th style="width: 20%;">Nama Responden</th>
              <th style="width: 10%;">Status</th>
              <th style="width: 18%;">Jawaban (Q1-Q8)</th>
              <th style="width: 35%;">Masukan &amp; Saran Perbaikan</th>
            </tr>
          </thead>
          <tbody>
            ${listToExport.map((r, i) => {
              const answerSummary = SURVEI_PERTANYAAN.map(q => {
                const val = r.jawaban[q.id];
                return `Q${q.id}:${val === 'setuju' ? 'S' : val === 'netral' ? 'N' : 'TS'}`;
              }).join(' ');
              return `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td class="text-center" style="font-size: 8.5pt;">${r.createdAt}</td>
                  <td><strong>${r.namaLengkap}</strong></td>
                  <td class="text-center">${r.status}</td>
                  <td style="font-size: 8pt; font-family: monospace;">${answerSummary}</td>
                  <td style="font-style: italic;">"${r.saranPerbaikan || '-'}"</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="font-size: 8.5pt; font-style: italic; margin-bottom: 15px;">
          *Keterangan Singkatan Jawaban: S = Setuju, N = Netral, TS = Tidak Setuju.
        </div>

        <!-- LEMBAR TANDA TANGAN RESMI -->
        ${signerBlockHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlDocContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Survey_Kepuasan_SPANJU_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      `Survey_Kepuasan_Sahabat_SPANJU_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                SURVEY KEPUASAN PENGGUNA
              </span>
              <span className="text-[11px] font-semibold text-emerald-100/90">
                Aplikasi Sahabat SPANJU &bull; SMPN 7 Pasuruan
              </span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white leading-snug">
              SURVEY KEPUASAN LAPORAN KEKERASAN &amp; PERUNDUNGAN (BULLYING)
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
              Isi Survey
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
                Tujuan Survey Sahabat SPANJU:
              </p>
              <p className="text-emerald-800 font-medium">
                Survey ini bertujuan untuk mengukur <strong>efektivitas</strong>,{' '}
                <strong>kemudahan</strong>, dan <strong>rasa aman pengguna</strong> dalam memanfaatkan
                fitur Laporan Kekerasan &amp; Perundungan di aplikasi Sahabat SPANJU. Masukan Anda
                sangat penting untuk menciptakan lingkungan sekolah yang lebih aman, harmonis, dan
                ramah anak.
              </p>
            </div>
          </div>

          {/* VIEW 1: FORM PENGISIAN SURVEY */}
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
                      <span>Lihat Rekapitulasi Survey</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Isi Survey Lagi</span>
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
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(['Siswa', 'Guru', 'Orang tua', 'Tamu'] as StatusResponden[]).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setStatusResponden(status)}
                              className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                                statusResponden === status
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {status === 'Siswa' && '🎓'}
                              {status === 'Guru' && '🧑‍🏫'}
                              {status === 'Orang tua' && '👨‍👩‍👧'}
                              {status === 'Tamu' && '🤝'}
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

                  {/* Pertanyaan Survey (8 Butir) */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide">
                          Pertanyaan Survey (8 Butir)
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Cloud className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <span>Data otomatis tersimpan aman di Database Cloud Supabase</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black text-white shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer ${
                        isSubmitting
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-700/20'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Menyimpan ke Cloud Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Jawaban Survey</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* VIEW 2: REKAPITULASI & STATISTIK HASIL */}
          {activeView === 'rekap' && (
            <div className="space-y-6">
              {/* Supabase Cloud Sync & Info Bar (Hanya tampil untuk Admin / Operator) */}
              {isAdmin && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">Database Supabase:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          survei_kepuasan_records
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Tersinkronisasi {responses.length} data respons survey kepuasan secara real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => loadResponsesFromSupabase(true)}
                      disabled={isSyncing}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Muat ulang data terbaru dari Supabase"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                      <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSqlModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5 cursor-pointer"
                      title="Lihat Skrip SQL Pembuatan Tabel di Supabase"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Skrip SQL Tabel</span>
                    </button>
                  </div>
                </div>
              )}

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
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-500">Unduh Laporan Resmi</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 uppercase tracking-wide">
                      Kop Surat UPT
                    </span>
                  </div>

                  {/* Signer choice badge - clickable to open popup */}
                  <button
                    type="button"
                    onClick={() => setIsSignerModalOpen(true)}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors mb-2.5 group cursor-pointer"
                    title="Klik untuk memilih nama penandatangan (Wiwik Ismiati / Eki Febriani / Keduanya)"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-0.5">
                      <span>Penandatangan TPPK/BK:</span>
                      <span className="text-blue-700 flex items-center gap-0.5 group-hover:underline">
                        <PenTool className="w-2.5 h-2.5" /> Pilih TTD
                      </span>
                    </div>
                    <div className="text-xs font-black text-slate-900 truncate">
                      {SIGNER_PROFILES[selectedSigner].label}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSignerModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                    title="Buka pilihan penandatangan dan unduh laporan resmi Word (.doc)"
                  >
                    <FileText className="w-4 h-4 text-blue-200" />
                    <span>Unduh Laporan Word (.doc)</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs for Rekap */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 mr-1">Filter Peran:</span>
                  {(['Semua', 'Siswa', 'Guru', 'Orang tua', 'Tamu'] as ('Semua' | StatusResponden)[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFilterRole(role)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
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
                <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
                      <span>Daftar Masukan &amp; Saran Responden</span>
                    </h3>
                    {isAdmin ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span>Akses Admin</span>
                      </span>
                    ) : (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"
                        title="Hanya Administrator yang memiliki akses untuk menghapus atau mengubah masukan responden"
                      >
                        <Lock className="w-2.5 h-2.5 text-slate-500" />
                        <span>Hapus Khusus Admin</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSignerModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                      title="Buka pilihan penandatangan dan unduh Word (.doc)"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-200" />
                      <span>Pilihan TTD &amp; Unduh Word</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                      title="Unduh data mentah format CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {filteredResponses.map((res) => (
                    <div
                      key={res.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 font-bold text-slate-800 flex-wrap">
                          <span>{res.namaLengkap}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              res.status === 'Siswa'
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.status === 'Guru'
                                ? 'bg-blue-100 text-blue-800'
                                : res.status === 'Orang tua'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono mr-1">{res.createdAt}</span>
                          {isAdmin ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(res)}
                                className="p-1 px-2 rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition shadow-2xs flex items-center gap-1 cursor-pointer text-[10px] font-bold active:scale-95"
                                title="Edit masukan / data responden (Khusus Admin)"
                              >
                                <Pencil className="w-3 h-3 text-amber-600" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDelete(res)}
                                className="p-1 px-2 rounded-md text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition shadow-2xs flex items-center gap-1 cursor-pointer text-[10px] font-bold active:scale-95"
                                title="Hapus data responden ini (Khusus Admin)"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          ) : (
                            <span
                              className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1"
                              title="Terkunci: Hanya akun Administrator yang dapat menghapus atau mengedit masukan responden ini"
                            >
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              <span className="hidden sm:inline">Khusus Admin</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600 italic">"{res.saranPerbaikan || 'Tidak ada catatan tambahan.'}"</p>
                    </div>
                  ))}
                  {filteredResponses.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                      Belum ada data responden untuk filter yang dipilih.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* POPUP MODAL PILIHAN PENANDATANGAN & FORMAT UNDUH */}
      {isSignerModalOpen && (
        <div
          id="modal-pilihan-penandatangan"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSignerModalOpen(false);
          }}
        >
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/15 rounded-xl border border-white/20 ring-2 ring-white/10">
                  <PenTool className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Pilihan Penandatangan Laporan
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Pilih nama pejabat Koordinator TPPK / Guru BK untuk pengesahan dokumen
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSignerModalOpen(false)}
                className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition cursor-pointer"
                title="Tutup Popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pilih Koordinator TPPK / Guru BK:
              </span>

              {/* Selection Cards */}
              <div className="space-y-2.5">
                {(['wiwik', 'eki', 'both'] as SignerOptionKey[]).map((key) => {
                  const profile = SIGNER_PROFILES[key];
                  const isSelected = selectedSigner === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedSigner(key)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="mt-0.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {profile.label}
                          </h4>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${
                              isSelected
                                ? 'bg-emerald-200 text-emerald-900'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {key === 'both' ? 'Format Lengkap' : key === 'wiwik' ? 'Pilihan 1' : 'Pilihan 2'}
                          </span>
                        </div>
                        <p className="text-xs font-mono font-semibold text-slate-600 mt-0.5">
                          {key === 'both' ? 'Format Bertingkat Nomor 1 & 2' : `NIP. ${profile.nip}`}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {profile.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                  Pratinjau Lembar Pengesahan:
                </span>

                <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
                  <div className="text-center border-r border-slate-100 pr-2">
                    <p className="text-[11px] font-bold text-slate-700">Koordinator TPPK / Guru BK</p>
                    <p className="text-[10px] text-slate-500 mb-6">UPT SMP Negeri 7 Pasuruan</p>
                    {selectedSigner === 'both' ? (
                      <div className="text-left space-y-1.5 text-[10px]">
                        <div>
                          <p className="font-black text-slate-900">1. <u>WIWIK ISMIATI, S.Pd</u></p>
                          <p className="text-slate-500 font-mono">NIP. 19831116 200904 2 003</p>
                        </div>
                        <div>
                          <p className="font-black text-slate-900">2. <u>EKI FEBRIANI, S.Pd</u></p>
                          <p className="text-slate-500 font-mono">NIP. 19940214 202221 2 014</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-black text-slate-900 text-[11px]">
                          <u>{SIGNER_PROFILES[selectedSigner].label}</u>
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          NIP. {SIGNER_PROFILES[selectedSigner].nip}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-center pl-2">
                    <p className="text-[10px] text-slate-500">Pasuruan, {formatIndonesianDate()}</p>
                    <p className="text-[11px] font-bold text-slate-700">Mengetahui,</p>
                    <p className="text-[10px] text-slate-500 mb-6">Kepala UPT SMP Negeri 7 Pasuruan</p>
                    <p className="font-black text-slate-900 text-[11px]">
                      <u>{KEPALA_SEKOLAH_PROFILE.label}</u>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      NIP. {KEPALA_SEKOLAH_PROFILE.nip}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Download Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600 font-semibold">
                Penandatangan aktif: <span className="font-bold text-blue-900">{SIGNER_PROFILES[selectedSigner].label}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSignerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleExportWord(selectedSigner);
                    setIsSignerModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-700 hover:bg-blue-800 text-white transition flex items-center gap-2 shadow-md shadow-blue-700/20 cursor-pointer active:scale-95"
                >
                  <FileText className="w-4 h-4 text-blue-200" />
                  <span>Unduh Dokumen Word (.doc)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SKRIP SQL TABEL SUPABASE */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Skrip SQL Tabel Supabase
                  </h3>
                  <p className="text-xs text-slate-300">
                    Tabel <span className="font-mono text-emerald-300">survei_kepuasan_records</span> (PostgreSQL / Supabase)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Struktur Tabel &amp; Keamanan Cloud Supabase</span>
                </p>
                <p className="text-[11px] text-emerald-800">
                  Aplikasi telah dikonfigurasi untuk secara otomatis menyimpan dan membaca hasil survey dari tabel ini. Jika Anda ingin mengeksekusi atau memverifikasi tabel langsung di <strong>Supabase SQL Editor</strong>, silakan salin kode SQL di bawah:
                </p>
              </div>

              {/* SQL Code Box */}
              <div className="relative rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-[11px] overflow-x-auto border border-slate-800">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                  <span>schema_survei_kepuasan.sql</span>
                  <button
                    type="button"
                    onClick={() => {
                      const sqlContent = `-- 1. Buat Tabel survei_kepuasan_records\nCREATE TABLE IF NOT EXISTS public.survei_kepuasan_records (\n    id TEXT PRIMARY KEY,\n    namalengkap TEXT NOT NULL,\n    status TEXT NOT NULL,\n    jawaban JSONB NOT NULL DEFAULT '{}'::jsonb,\n    q1 TEXT DEFAULT 'setuju',\n    q2 TEXT DEFAULT 'setuju',\n    q3 TEXT DEFAULT 'setuju',\n    q4 TEXT DEFAULT 'setuju',\n    q5 TEXT DEFAULT 'setuju',\n    q6 TEXT DEFAULT 'setuju',\n    q7 TEXT DEFAULT 'setuju',\n    q8 TEXT DEFAULT 'setuju',\n    saranperbaikan TEXT,\n    createdat TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI')\n);\n\n-- 2. Aktifkan RLS & Kebijakan Keamanan\nALTER TABLE public.survei_kepuasan_records ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Allow select on survei_kepuasan_records" \n    ON public.survei_kepuasan_records FOR SELECT USING (true);\n\nCREATE POLICY "Allow insert on survei_kepuasan_records" \n    ON public.survei_kepuasan_records FOR INSERT WITH CHECK (true);\n\nCREATE POLICY "Allow update on survei_kepuasan_records" \n    ON public.survei_kepuasan_records FOR UPDATE USING (true);\n\nCREATE POLICY "Allow delete on survei_kepuasan_records" \n    ON public.survei_kepuasan_records FOR DELETE USING (true);`;
                      navigator.clipboard.writeText(sqlContent);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2500);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-emerald-300 leading-relaxed">
{`-- 1. Buat Tabel survei_kepuasan_records
CREATE TABLE IF NOT EXISTS public.survei_kepuasan_records (
    id TEXT PRIMARY KEY,
    namalengkap TEXT NOT NULL,
    status TEXT NOT NULL,
    jawaban JSONB NOT NULL DEFAULT '{}'::jsonb,
    q1 TEXT DEFAULT 'setuju',
    q2 TEXT DEFAULT 'setuju',
    q3 TEXT DEFAULT 'setuju',
    q4 TEXT DEFAULT 'setuju',
    q5 TEXT DEFAULT 'setuju',
    q6 TEXT DEFAULT 'setuju',
    q7 TEXT DEFAULT 'setuju',
    q8 TEXT DEFAULT 'setuju',
    saranperbaikan TEXT,
    createdat TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI')
);

-- 2. Aktifkan RLS & Kebijakan Keamanan
ALTER TABLE public.survei_kepuasan_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select on survei_kepuasan_records" 
    ON public.survei_kepuasan_records FOR SELECT USING (true);

CREATE POLICY "Allow insert on survei_kepuasan_records" 
    ON public.survei_kepuasan_records FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on survei_kepuasan_records" 
    ON public.survei_kepuasan_records FOR UPDATE USING (true);

CREATE POLICY "Allow delete on survei_kepuasan_records" 
    ON public.survei_kepuasan_records FOR DELETE USING (true);`}
                </pre>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Rincian Kolom:</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                  <li><strong className="font-mono text-slate-800">id</strong>: ID Unik respons survey</li>
                  <li><strong className="font-mono text-slate-800">namalengkap</strong>: Nama responden</li>
                  <li><strong className="font-mono text-slate-800">status</strong>: Siswa, Guru, Orang tua, atau Tamu</li>
                  <li><strong className="font-mono text-slate-800">jawaban</strong>: JSON opsi butir 1 s.d 8</li>
                  <li><strong className="font-mono text-slate-800">q1 s.d q8</strong>: Kolom data granular untuk memudahkan query SQL</li>
                  <li><strong className="font-mono text-slate-800">saranperbaikan</strong>: Aspirasi / masukan dari responden</li>
                  <li><strong className="font-mono text-slate-800">createdat</strong>: Waktu pencatatan survey</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL EDIT RESPONDEN */}
      {isEditModalOpen && editingItem && (
        <div
          id="modal-edit-responden"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
              setEditingItem(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                  <Pencil className="w-5 h-5 text-amber-100" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Edit Data & Masukan Responden</h3>
                  <p className="text-xs text-amber-100/90 mt-0.5">Perbarui nama, status responden, masukan, dan jawaban</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap / Inisial
                </label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Responden
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as StatusResponden)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-medium bg-white"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru / Tenaga Pendidik</option>
                  <option value="Orang tua">Orang Tua / Wali Murid</option>
                  <option value="Tamu">Tamu / Warga Masyarakat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masukan &amp; Saran Perbaikan
                </label>
                <textarea
                  rows={3}
                  value={editSaran}
                  onChange={(e) => setEditSaran(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  placeholder="Tuliskan saran atau masukan di sini..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Pilihan Nilai Jawaban Pertanyaan (1 s.d. 8)
                </label>
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-48 overflow-y-auto custom-scrollbar">
                  {SURVEI_PERTANYAAN.map((q) => {
                    const currentVal = editJawaban[q.id] || 'setuju';
                    return (
                      <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                        <span className="text-[11px] text-slate-700 font-medium line-clamp-1" title={q.teks}>
                          {q.id}. {q.teks}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {(['setuju', 'netral', 'tidak_setuju'] as SurveiOptionValue[]).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setEditJawaban((prev) => ({ ...prev, [q.id]: opt }))}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                                currentVal === opt
                                  ? opt === 'setuju'
                                    ? 'bg-emerald-600 text-white'
                                    : opt === 'netral'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-rose-600 text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {opt === 'setuju' ? 'Setuju' : opt === 'netral' ? 'Netral' : 'Tdk Setuju'}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL HAPUS RESPONDEN */}
      {isDeleteModalOpen && deleteConfirmItem && (
        <div
          id="modal-hapus-responden"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDeleteModalOpen(false);
              setDeleteConfirmItem(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-600 to-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                  <Trash2 className="w-5 h-5 text-rose-100" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Hapus Tanggapan Responden</h3>
                  <p className="text-xs text-rose-100/90 mt-0.5">Konfirmasi penghapusan data survey</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmItem(null);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">
                Apakah Anda yakin ingin menghapus data masukan & tanggapan survey dari responden berikut?
              </p>

              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{deleteConfirmItem.namaLengkap}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
                    {deleteConfirmItem.status}
                  </span>
                </div>
                <p className="text-slate-600 italic">"{deleteConfirmItem.saranPerbaikan || 'Tidak ada catatan tambahan.'}"</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Waktu: {deleteConfirmItem.createdAt}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-start gap-2 text-[11px]">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Data yang dihapus akan dihilangkan dari kalkulasi rekapitulasi persentase kepuasan dan daftar saran.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmItem(null);
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus Sekarang</span>
                </button>
              </div>
            </div>
          </div>
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
                SURVEY RESMI &bull; 1-KLIK
              </span>
              <span className="text-[11px] font-semibold text-emerald-200">
                Evaluasi TPPK &bull; Sahabat SPANJU SMPN 7 Pasuruan
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-snug group-hover:text-emerald-100 transition-colors">
              SURVEY KEPUASAN LAPORAN KEKERASAN &amp; PERUNDUNGAN (BULLYING)
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
            <span>Isi Survey Sekarang</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
