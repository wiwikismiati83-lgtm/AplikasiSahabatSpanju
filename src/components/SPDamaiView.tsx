import React, { useState } from 'react';
import {
  Handshake,
  Plus,
  Search,
  Printer,
  X,
  User,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  Pencil,
  FileSignature,
  FileText,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { SPDamaiRecord, Siswa, UserRole } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';
import { StudentPickerModal } from './StudentPickerModal';
import { CalendarDatePicker } from './DateTimeWidgets';

interface Props {
  records: SPDamaiRecord[];
  siswaList?: Siswa[];
  onAddRecord: (record: SPDamaiRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: SPDamaiRecord) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
  userRole?: UserRole;
}

export const SPDamaiView: React.FC<Props> = ({
  records,
  siswaList = [],
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
  onOpenMenu,
  userRole = 'admin',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SPDamaiRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Only admin and operator can view full report data and incident records
  const isAdminOrOperator = userRole === 'admin' || userRole === 'operator';
  const isRestrictedFromViewingReports = !isAdminOrOperator;

  // Printing & Signature
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<SPDamaiRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<{
    record: SPDamaiRecord;
    targetParty: 'pihak1' | 'pihak2' | 'saksi';
  } | null>(null);

  // Form states
  const [hariTanggal, setHariTanggal] = useState('');
  const [tempatMediasi, setTempatMediasi] = useState('Ruang Konseling Ramah Sahabat SPANJU / BK');
  const [namaPihak1, setNamaPihak1] = useState('');
  const [kelasPihak1, setKelasPihak1] = useState('');
  const [peranPihak1, setPeranPihak1] = useState('Pihak Pertama (Siswa I)');
  const [tandaTanganPihak1, setTandaTanganPihak1] = useState('');

  const [namaPihak2, setNamaPihak2] = useState('');
  const [kelasPihak2, setKelasPihak2] = useState('');
  const [peranPihak2, setPeranPihak2] = useState('Pihak Kedua (Siswa II)');
  const [tandaTanganPihak2, setTandaTanganPihak2] = useState('');

  const [activePicker, setActivePicker] = useState<'pihak1' | 'pihak2' | null>(null);

  const [ringkasanMasalah, setRingkasanMasalah] = useState('');
  const [klausul1, setKlausul1] = useState(
    'Kedua belah pihak dengan tulus hati saling memaafkan dan berjanji tidak memendam rasa dendam atau permusuhan.'
  );
  const [klausul2, setKlausul2] = useState(
    'Berjanji tidak akan mengulangi perbuatan mengejek, mendorong, menyindir, atau memprovokasi baik secara lisan, fisik, maupun media sosial.'
  );
  const [klausul3, setKlausul3] = useState(
    'Saling berkomitmen menjaga persahabatan serta mendukung terciptanya iklim belajar kondusif di lingkungan SMP Negeri 7 Pasuruan.'
  );
  const [klausul4, setKlausul4] = useState(
    'Apabila di kemudian hari melanggar kesepakatan damai ini, bersedia menerima sanksi edukatif sesuai Tata Tertib Sekolah dan rekomendasi TPPK.'
  );

  const [sanksiEdukasi, setSanksiEdukasi] = useState(
    'Kedua siswa sepakat bersama-sama merawat taman literasi kelas dan membuat poster persahabatan.'
  );
  const [namaSaksiGuru, setNamaSaksiGuru] = useState('Wiwik Ismiati, S.Pd');
  const [nipSaksiGuru, setNipSaksiGuru] = useState('198311162009042003');
  const [jabatanSaksiGuru, setJabatanSaksiGuru] = useState('Guru Bimbingan Konseling & Fasilitator Mediasi');
  const [namaKonselorSebaya, setNamaKonselorSebaya] = useState('Duta Sahabat SPANJU');
  const [status, setStatus] = useState<SPDamaiRecord['status']>('Damai Permanen');

  const resetForm = () => {
    setEditingRecord(null);
    setHariTanggal('');
    setTempatMediasi('Ruang Konseling Ramah Sahabat SPANJU / BK');
    setNamaPihak1('');
    setKelasPihak1('');
    setPeranPihak1('Pihak Pertama (Siswa I)');
    setTandaTanganPihak1('');
    setNamaPihak2('');
    setKelasPihak2('');
    setPeranPihak2('Pihak Kedua (Siswa II)');
    setTandaTanganPihak2('');
    setRingkasanMasalah('');
    setKlausul1(
      'Kedua belah pihak dengan tulus hati saling memaafkan dan berjanji tidak memendam rasa dendam atau permusuhan.'
    );
    setKlausul2(
      'Berjanji tidak akan mengulangi perbuatan mengejek, mendorong, menyindir, atau memprovokasi baik secara lisan, fisik, maupun media sosial.'
    );
    setKlausul3(
      'Saling berkomitmen menjaga persahabatan serta mendukung terciptanya iklim belajar kondusif di lingkungan SMP Negeri 7 Pasuruan.'
    );
    setKlausul4(
      'Apabila di kemudian hari melanggar kesepakatan damai ini, bersedia menerima sanksi edukatif sesuai Tata Tertib Sekolah dan rekomendasi TPPK.'
    );
    setSanksiEdukasi('Kedua siswa sepakat bersama-sama merawat taman literasi kelas dan membuat poster persahabatan.');
    setNamaSaksiGuru('Wiwik Ismiati, S.Pd');
    setNipSaksiGuru('198311162009042003');
    setJabatanSaksiGuru('Guru Bimbingan Konseling & Fasilitator Mediasi');
    setNamaKonselorSebaya('Duta Sahabat SPANJU');
    setStatus('Damai Permanen');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (rec: SPDamaiRecord) => {
    setEditingRecord(rec);
    setHariTanggal(rec.hariTanggal);
    setTempatMediasi(rec.tempatMediasi || 'Ruang Konseling Ramah Sahabat SPANJU / BK');
    setNamaPihak1(rec.namaPihak1);
    setKelasPihak1(rec.kelasPihak1);
    setPeranPihak1(rec.peranPihak1 || 'Pihak Pertama (Siswa I)');
    setTandaTanganPihak1(rec.tandaTanganPihak1 || '');
    setNamaPihak2(rec.namaPihak2);
    setKelasPihak2(rec.kelasPihak2);
    setPeranPihak2(rec.peranPihak2 || 'Pihak Kedua (Siswa II)');
    setTandaTanganPihak2(rec.tandaTanganPihak2 || '');
    setRingkasanMasalah(rec.ringkasanMasalah);
    setKlausul1(
      rec.butirKesepakatan?.[0] ??
        'Kedua belah pihak dengan tulus hati saling memaafkan dan berjanji tidak memendam rasa dendam atau permusuhan.'
    );
    setKlausul2(
      rec.butirKesepakatan?.[1] ??
        'Berjanji tidak akan mengulangi perbuatan mengejek, mendorong, menyindir, atau memprovokasi baik secara lisan, fisik, maupun media sosial.'
    );
    setKlausul3(
      rec.butirKesepakatan?.[2] ??
        'Saling berkomitmen menjaga persahabatan serta mendukung terciptanya iklim belajar kondusif di lingkungan SMP Negeri 7 Pasuruan.'
    );
    setKlausul4(
      rec.butirKesepakatan?.[3] ??
        'Apabila di kemudian hari melanggar kesepakatan damai ini, bersedia menerima sanksi edukatif sesuai Tata Tertib Sekolah dan rekomendasi TPPK.'
    );
    setSanksiEdukasi(rec.sanksiEdukasi || '');
    setNamaSaksiGuru(rec.namaSaksiGuru || 'Wiwik Ismiati, S.Pd');
    setNipSaksiGuru(rec.nipSaksiGuru || '198311162009042003');
    setJabatanSaksiGuru(rec.jabatanSaksiGuru || 'Guru Bimbingan Konseling & Fasilitator Mediasi');
    setNamaKonselorSebaya(rec.namaKonselorSebaya || 'Duta Sahabat SPANJU');
    setStatus(rec.status);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPihak1.trim() || !namaPihak2.trim() || !ringkasanMasalah.trim()) return;

    if (editingRecord) {
      const updatedRecord: SPDamaiRecord = {
        ...editingRecord,
        hariTanggal: hariTanggal.trim() || editingRecord.hariTanggal,
        tempatMediasi: tempatMediasi.trim() || 'Ruang Konseling Ramah Sahabat SPANJU / BK',
        namaPihak1: namaPihak1.trim(),
        kelasPihak1: kelasPihak1.trim() || 'Kelas 8',
        peranPihak1: peranPihak1.trim(),
        tandaTanganPihak1: tandaTanganPihak1 || undefined,
        namaPihak2: namaPihak2.trim(),
        kelasPihak2: kelasPihak2.trim() || 'Kelas 8',
        peranPihak2: peranPihak2.trim(),
        tandaTanganPihak2: tandaTanganPihak2 || undefined,
        ringkasanMasalah: ringkasanMasalah.trim(),
        butirKesepakatan: [klausul1, klausul2, klausul3, klausul4].filter((k) => k.trim() !== ''),
        sanksiEdukasi: sanksiEdukasi.trim(),
        namaSaksiGuru: namaSaksiGuru.trim(),
        nipSaksiGuru: nipSaksiGuru.trim(),
        jabatanSaksiGuru: jabatanSaksiGuru.trim(),
        namaKonselorSebaya: namaKonselorSebaya.trim(),
        status,
      };

      if (onUpdateRecord) {
        onUpdateRecord(updatedRecord);
      }
      if (selectedForPrint && selectedForPrint.id === updatedRecord.id) {
        setSelectedForPrint(updatedRecord);
      }
      setShowModal(false);
      resetForm();
      return;
    }

    const count = records.length + 1;
    const nomorSurat = `${String(count).padStart(3, '0')}/SP-DAMAI/SPANJU/IX/${new Date().getFullYear()}`;

    const newRecord: SPDamaiRecord = {
      id: `sp-damai-${Date.now()}`,
      nomorSurat,
      hariTanggal: hariTanggal.trim() || 'Senin, 14 September 2026',
      tempatMediasi: tempatMediasi.trim() || 'Ruang Konseling Ramah Sahabat SPANJU / BK',
      namaPihak1: namaPihak1.trim(),
      kelasPihak1: kelasPihak1.trim() || 'Kelas 8',
      peranPihak1: peranPihak1.trim(),
      tandaTanganPihak1: tandaTanganPihak1 || undefined,
      namaPihak2: namaPihak2.trim(),
      kelasPihak2: kelasPihak2.trim() || 'Kelas 8',
      peranPihak2: peranPihak2.trim(),
      tandaTanganPihak2: tandaTanganPihak2 || undefined,
      ringkasanMasalah: ringkasanMasalah.trim(),
      butirKesepakatan: [klausul1, klausul2, klausul3, klausul4].filter((k) => k.trim() !== ''),
      sanksiEdukasi: sanksiEdukasi.trim(),
      namaSaksiGuru: namaSaksiGuru.trim(),
      nipSaksiGuru: nipSaksiGuru.trim(),
      jabatanSaksiGuru: jabatanSaksiGuru.trim(),
      namaKonselorSebaya: namaKonselorSebaya.trim(),
      status,
      hasilPemantauan: 'Kedua pihak telah saling bersalaman damai and berkomitmen menjaga keharmonisan pertemanan.',
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowModal(false);
    resetForm();
  };

  const handleSignatureSave = (signatureUrl: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const { record, targetParty } = signingRecord;

    const updated: SPDamaiRecord = {
      ...record,
      ...(targetParty === 'pihak1' && { tandaTanganPihak1: signatureUrl }),
      ...(targetParty === 'pihak2' && { tandaTanganPihak2: signatureUrl }),
      ...(targetParty === 'saksi' && { tandaTanganSaksiGuru: signatureUrl }),
    };

    onUpdateRecord(updated);
    if (selectedForPrint && selectedForPrint.id === updated.id) {
      setSelectedForPrint(updated);
    }
    setSigningRecord(null);
  };

  const handleClearSignature = (record: SPDamaiRecord, targetParty: 'pihak1' | 'pihak2') => {
    if (!isAdminOrOperator || !onUpdateRecord) return;
    const updated: SPDamaiRecord = {
      ...record,
      ...(targetParty === 'pihak1' && { tandaTanganPihak1: undefined }),
      ...(targetParty === 'pihak2' && { tandaTanganPihak2: undefined }),
    };
    onUpdateRecord(updated);
    if (selectedForPrint && selectedForPrint.id === updated.id) {
      setSelectedForPrint(updated);
    }
  };

  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      r.namaPihak1.toLowerCase().includes(term) ||
      r.namaPihak2.toLowerCase().includes(term) ||
      r.nomorSurat.toLowerCase().includes(term) ||
      r.kelasPihak1.toLowerCase().includes(term) ||
      r.kelasPihak2.toLowerCase().includes(term) ||
      r.ringkasanMasalah.toLowerCase().includes(term);
    const matchStatus = filterStatus === 'semua' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const damaiPermanenCount = records.filter((r) => r.status === 'Damai Permanen').length;
  const aktifTerpantauCount = records.filter((r) => r.status === 'Aktif Terpantau').length;
  const evaluasiCount = records.filter((r) => r.status === 'Evaluasi Lanjutan').length;

  return (
    <div id="view-sp-damai" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-100/80 via-teal-50/70 to-white border border-emerald-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2 shadow-2xs">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            RESTORATIVE JUSTICE & KESEPAKATAN PERSAHABATAN
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            SP Damai Siswa (Surat Kesepakatan Perdamaian)
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Penyelesaian perselisihan siswa berbasis musyawarah kekeluargaan, rekonsiliasi damai, komitmen tanpa dendam, dan tanda tangan digital di layar HP & laptop.
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
          {isAdminOrOperator && (
            <button
              onClick={() => {
                setSelectedForPrint(null);
                setShowPrintModal(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              Cetak Kop Surat Resmi
            </button>
          )}
          <button
            id="btn-tambah-sp-damai"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Buat Surat Damai Baru
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total SP Damai
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">{records.length} Berkas</div>
          <span className="text-[10px] text-slate-500">Tercatat di sistem BK</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Damai Permanen
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{damaiPermanenCount} Kasus</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Tuntas 100% rukun</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 shadow-xs">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
            Aktif Terpantau
          </span>
          <div className="text-2xl font-black text-sky-700 mt-1">{aktifTerpantauCount} Kasus</div>
          <span className="text-[10px] text-sky-600 font-semibold">Monitoring Duta SPANJU</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Evaluasi Lanjutan
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1">{evaluasiCount} Kasus</div>
          <span className="text-[10px] text-amber-600 font-semibold">Bimbingan konselor BK</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {editingRecord ? <Pencil className="w-5 h-5" /> : <Handshake className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {editingRecord
                      ? 'Edit Surat Kesepakatan Damai Siswa'
                      : 'Formulir Surat Kesepakatan Damai Siswa (Restorative Justice)'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingRecord
                      ? `Memperbarui berkas mediasi: ${editingRecord.nomorSurat}`
                      : 'UPTD SMP Negeri 7 Pasuruan • Rekonsiliasi & Penandatanganan Layar Sentuh'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Mediasi Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <CalendarDatePicker
                    value={hariTanggal}
                    onChange={setHariTanggal}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    TEMPAT MEDIASI KONSILIASI
                  </label>
                  <input
                    type="text"
                    value={tempatMediasi}
                    onChange={(e) => setTempatMediasi(e.target.value)}
                    placeholder="Ruang Konseling Sahabat SPANJU / BK"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pihak Pertama & Kedua */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pihak 1 */}
                <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl space-y-2.5">
                  <span className="font-bold text-sky-900 block text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-700" />
                    IDENTITAS PIHAK PERTAMA (SISWA I):
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setActivePicker('pihak1')}
                    className="w-full text-left group"
                  >
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Nama Siswa <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 group-hover:border-sky-500 transition flex items-center justify-between">
                      <span className={namaPihak1 ? 'text-slate-800' : 'text-slate-400 italic text-[11px]'}>
                        {namaPihak1 || 'Klik untuk pilih siswa...'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-sky-400" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePicker('pihak1')}
                    className="w-full text-left group"
                  >
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Kelas</label>
                    <div className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 group-hover:border-sky-500 transition flex items-center justify-between">
                      <span className={kelasPihak1 ? 'text-slate-800' : 'text-slate-400 italic text-[11px]'}>
                        {kelasPihak1 ? `KELAS ${kelasPihak1}` : 'Klik untuk pilih...'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-sky-400" />
                    </div>
                  </button>

                  {/* TTD Pihak 1 */}
                  <div className="pt-1">
                    <label className="block text-[10px] font-bold text-sky-800 mb-1">
                      TTD LAYAR SENTUH PIHAK PERTAMA:
                    </label>
                    <TouchSignaturePad
                      initialSignature={tandaTanganPihak1}
                      signerName={namaPihak1 || 'Pihak Pertama'}
                      signerTitle="Siswa SMPN 7 Pasuruan"
                      compact={true}
                      onSave={(url) => setTandaTanganPihak1(url)}
                      title="TTD Siswa I"
                    />
                  </div>
                </div>

                {/* Pihak 2 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-700" />
                    IDENTITAS PIHAK KEDUA (SISWA II):
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setActivePicker('pihak2')}
                    className="w-full text-left group"
                  >
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Nama Siswa <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 group-hover:border-slate-500 transition flex items-center justify-between">
                      <span className={namaPihak2 ? 'text-slate-800' : 'text-slate-400 italic text-[11px]'}>
                        {namaPihak2 || 'Klik untuk pilih siswa...'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePicker('pihak2')}
                    className="w-full text-left group"
                  >
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Kelas</label>
                    <div className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 group-hover:border-slate-500 transition flex items-center justify-between">
                      <span className={kelasPihak2 ? 'text-slate-800' : 'text-slate-400 italic text-[11px]'}>
                        {kelasPihak2 ? `KELAS ${kelasPihak2}` : 'Klik untuk pilih...'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>

                  {/* TTD Pihak 2 */}
                  <div className="pt-1">
                    <label className="block text-[10px] font-bold text-slate-800 mb-1">
                      TTD LAYAR SENTUH PIHAK KEDUA:
                    </label>
                    <TouchSignaturePad
                      initialSignature={tandaTanganPihak2}
                      signerName={namaPihak2 || 'Pihak Kedua'}
                      signerTitle="Siswa SMPN 7 Pasuruan"
                      compact={true}
                      onSave={(url) => setTandaTanganPihak2(url)}
                      title="TTD Siswa II"
                    />
                  </div>
                </div>
              </div>

              {/* Pokok Permasalahan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  POKOK PERMASALAHAN / KRONOLOGI AWAL PERSELISIHAN <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={ringkasanMasalah}
                  onChange={(e) => setRingkasanMasalah(e.target.value)}
                  placeholder="Uraikan singkat apa yang menjadi sebab perselisihan / salah paham antara kedua belah pihak..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* 4 Klausul Kesepakatan */}
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                <span className="font-bold text-emerald-900 block text-xs">
                  BUTIR-BUTIR KESEPAKATAN PERDAMAIAN BERSAMA:
                </span>
                <input
                  type="text"
                  value={klausul1}
                  onChange={(e) => setKlausul1(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                />
                <input
                  type="text"
                  value={klausul2}
                  onChange={(e) => setKlausul2(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                />
                <input
                  type="text"
                  value={klausul3}
                  onChange={(e) => setKlausul3(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                />
                <input
                  type="text"
                  value={klausul4}
                  onChange={(e) => setKlausul4(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                />
              </div>

              {/* Sanksi Edukatif & Pendamping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SANKSI EDUKATIF / TUGAS KARAKTER POSITIF
                  </label>
                  <input
                    type="text"
                    value={sanksiEdukasi}
                    onChange={(e) => setSanksiEdukasi(e.target.value)}
                    placeholder="Contoh: Merawat tanaman literasi sekolah / merangkum buku persahabatan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    STATUS PENANGANAN MEDIASI
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as SPDamaiRecord['status'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Damai Permanen">Damai Permanen</option>
                    <option value="Aktif Terpantau">Aktif Terpantau</option>
                    <option value="Evaluasi Lanjutan">Evaluasi Lanjutan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  DUTA SAHABAT SPANJU / KONSELOR SEBAYA
                </label>
                <input
                  type="text"
                  value={namaKonselorSebaya}
                  onChange={(e) => setNamaKonselorSebaya(e.target.value)}
                  placeholder="Nama siswa duta sahabat konselor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md btn-3d flex items-center gap-1.5"
                >
                  {editingRecord ? <Pencil className="w-3.5 h-3.5" /> : <Handshake className="w-3.5 h-3.5" />}
                  {editingRecord ? 'Simpan Perubahan Surat Damai' : 'Terbitkan Surat Kesepakatan Damai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Touchscreen Signature Modal for Cards */}
      {signingRecord && (
        <TouchSignatureModal
          isOpen={true}
          onClose={() => setSigningRecord(null)}
          title={`Tanda Tangan Surat Damai - ${signingRecord.record.nomorSurat}`}
          subtitle={
            signingRecord.targetParty === 'pihak1'
              ? `Tanda Tangan Pihak I: ${signingRecord.record.namaPihak1} (Kelas ${signingRecord.record.kelasPihak1})`
              : signingRecord.targetParty === 'pihak2'
              ? `Tanda Tangan Pihak II: ${signingRecord.record.namaPihak2} (Kelas ${signingRecord.record.kelasPihak2})`
              : `Tanda Tangan Saksi Guru BK: ${signingRecord.record.namaSaksiGuru}`
          }
          initialSignature={
            signingRecord.targetParty === 'pihak1'
              ? signingRecord.record.tandaTanganPihak1
              : signingRecord.targetParty === 'pihak2'
              ? signingRecord.record.tandaTanganPihak2
              : signingRecord.record.tandaTanganSaksiGuru
          }
          signerName={
            signingRecord.targetParty === 'pihak1'
              ? signingRecord.record.namaPihak1
              : signingRecord.targetParty === 'pihak2'
              ? signingRecord.record.namaPihak2
              : signingRecord.record.namaSaksiGuru || 'Guru BK'
          }
          signerTitle={
            signingRecord.targetParty === 'pihak1'
              ? `Pihak I - Kelas ${signingRecord.record.kelasPihak1}`
              : signingRecord.targetParty === 'pihak2'
              ? `Pihak II - Kelas ${signingRecord.record.kelasPihak2}`
              : 'Saksi Guru BK / TPPK SPANJU'
          }
          onSave={handleSignatureSave}
        />
      )}

      {/* Official Report Modal with Kop Surat */}
      {showPrintModal && (
        <OfficialReportModal
          isOpen={true}
          onClose={() => setShowPrintModal(false)}
          title={
            selectedForPrint
              ? `SURAT PERJANJIAN DAN KESEPAKATAN DAMAI SISWA`
              : 'REKAPITULASI BERKAS SURAT PERJANJIAN DAMAI SISWA'
          }
          nomorSurat={
            selectedForPrint
              ? selectedForPrint.nomorSurat
              : `421.3 / SP-DAMAI-REKAP / 101.4.7 / 2026`
          }
          hideSignaturesBlock={Boolean(selectedForPrint)}
          hideFirstSigner={Boolean(selectedForPrint)}
          firstSignerRole={selectedForPrint ? `Pihak Pertama (${selectedForPrint.namaPihak1})` : 'Perwakilan Siswa'}
          firstSignerName={selectedForPrint?.namaPihak1 || 'Siswa Pihak I'}
          firstSignerSignature={selectedForPrint?.tandaTanganPihak1 || records[0]?.tandaTanganPihak1}
          onFirstSignerUpdate={(sig) => {
            if (selectedForPrint && onUpdateRecord) {
              const upd = { ...selectedForPrint, tandaTanganPihak1: sig };
              onUpdateRecord(upd);
              setSelectedForPrint(upd);
            }
          }}
          secondSignerRole="Kepala UPTD SMP Negeri 7 Pasuruan"
          secondSignerName="NUR FADILAH, S.Pd., M.Pd"
          secondSignerNip="19860410 201001 2 030"
        >
          {selectedForPrint ? (
            <div className="space-y-4 text-xs text-slate-800">
              <p className="text-justify leading-relaxed">
                Pada hari ini, <strong>{selectedForPrint.hariTanggal}</strong>, bertempat di{' '}
                <strong>{selectedForPrint.tempatMediasi}</strong>, telah dilakukan proses mediasi
                rekonsiliasi kekeluargaan (<em>Restorative Justice</em>) yang dihadiri oleh kedua belah
                pihak siswa berikut:
              </p>

              {/* Table of Both Parties */}
              <div className="grid grid-cols-2 gap-3 border border-slate-300 rounded-lg p-3 bg-slate-50/50">
                <div className="space-y-1 border-r border-slate-200 pr-2">
                  <span className="font-bold text-sky-900 block text-[11px]">PIHAK PERTAMA (I):</span>
                  <p><strong>Nama:</strong> {selectedForPrint.namaPihak1}</p>
                  <p><strong>Kelas:</strong> {selectedForPrint.kelasPihak1}</p>
                  {selectedForPrint.nisnPihak1 && <p><strong>NISN:</strong> {selectedForPrint.nisnPihak1}</p>}
                </div>
                <div className="space-y-1 pl-2">
                  <span className="font-bold text-rose-900 block text-[11px]">PIHAK KEDUA (II):</span>
                  <p><strong>Nama:</strong> {selectedForPrint.namaPihak2}</p>
                  <p><strong>Kelas:</strong> {selectedForPrint.kelasPihak2}</p>
                  {selectedForPrint.nisnPihak2 && <p><strong>NISN:</strong> {selectedForPrint.nisnPihak2}</p>}
                </div>
              </div>

              {/* Ringkasan Pokok Permasalahan */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1">
                <span className="font-bold text-amber-900 block text-[11px]">POKOK MASALAH & KRONOLOGI:</span>
                <p className="leading-relaxed text-slate-700">{selectedForPrint.ringkasanMasalah}</p>
              </div>

              {/* Butir-butir kesepakatan */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                  KEDUA BELAH PIHAK DENGAN INI MENYEPAKATI HAL-HAL SEBAGAI BERIKUT:
                </span>
                <ol className="list-decimal pl-5 space-y-1 leading-relaxed">
                  {selectedForPrint.butirKesepakatan.map((butir, bIdx) => (
                    <li key={bIdx}>{butir}</li>
                  ))}
                </ol>
              </div>

              {/* Sanksi Edukatif */}
              {selectedForPrint.sanksiEdukasi && (
                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                  <span className="font-bold text-emerald-900 block text-[11px]">
                    TUGAS EDUKATIF & PENGUATAN KARAKTER BERSAMA:
                  </span>
                  <p className="text-slate-700 mt-0.5">{selectedForPrint.sanksiEdukasi}</p>
                </div>
              )}

              {/* Quad Signature Display (Pihak 1, Pihak 2, Guru Saksi) */}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-center font-bold text-slate-700 text-[11px] mb-3">
                  Tanda Tangan Para Pihak Mediasi:
                </p>
                <div className="grid grid-cols-2 gap-4 text-center text-[10px] max-w-md mx-auto">
                  {/* Pihak 1 */}
                  <div className="p-2 border border-slate-200 rounded-lg bg-white relative group">
                    <span className="text-slate-500 block">Pihak Pertama,</span>
                    <div className="h-14 flex items-center justify-center my-1">
                      {selectedForPrint.tandaTanganPihak1 ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={selectedForPrint.tandaTanganPihak1}
                            alt="TTD 1"
                            className="max-h-10 object-contain"
                          />
                          <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                            <Lock className="w-2.5 h-2.5" /> Terkunci (Sah)
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSigningRecord({ record: selectedForPrint, targetParty: 'pihak1' })}
                          className="print:hidden text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded font-bold transition"
                        >
                          ✍️ TTD Pihak 1
                        </button>
                      )}
                      <span className="print:block hidden text-slate-300 italic text-[10px]">(Belum TTD)</span>
                    </div>
                    <span className="font-bold text-slate-800 underline block">
                      {selectedForPrint.namaPihak1}
                    </span>
                    <span className="text-slate-500">Kelas {selectedForPrint.kelasPihak1}</span>
                    {selectedForPrint.tandaTanganPihak1 && isAdminOrOperator && (
                      <div className="print:hidden flex items-center justify-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setSigningRecord({ record: selectedForPrint, targetParty: 'pihak1' })}
                          className="text-[9px] text-blue-600 underline font-semibold"
                        >
                          Ubah
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleClearSignature(selectedForPrint, 'pihak1')}
                          className="text-[9px] text-rose-600 underline font-semibold"
                        >
                          Hapus TTD
                        </button>
                      </div>
                    )}
                    {selectedForPrint.tandaTanganPihak1 && !isAdminOrOperator && (
                      <span className="print:hidden text-[9px] text-slate-400 block mt-1">
                        🔒 Dilindungi (Hanya Admin)
                      </span>
                    )}
                  </div>

                  {/* Pihak 2 */}
                  <div className="p-2 border border-slate-200 rounded-lg bg-white relative group">
                    <span className="text-slate-500 block">Pihak Kedua,</span>
                    <div className="h-14 flex items-center justify-center my-1">
                      {selectedForPrint.tandaTanganPihak2 ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={selectedForPrint.tandaTanganPihak2}
                            alt="TTD 2"
                            className="max-h-10 object-contain"
                          />
                          <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                            <Lock className="w-2.5 h-2.5" /> Terkunci (Sah)
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSigningRecord({ record: selectedForPrint, targetParty: 'pihak2' })}
                          className="print:hidden text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded font-bold transition"
                        >
                          ✍️ TTD Pihak 2
                        </button>
                      )}
                      <span className="print:block hidden text-slate-300 italic text-[10px]">(Belum TTD)</span>
                    </div>
                    <span className="font-bold text-slate-800 underline block">
                      {selectedForPrint.namaPihak2}
                    </span>
                    <span className="text-slate-500">Kelas {selectedForPrint.kelasPihak2}</span>
                    {selectedForPrint.tandaTanganPihak2 && isAdminOrOperator && (
                      <div className="print:hidden flex items-center justify-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setSigningRecord({ record: selectedForPrint, targetParty: 'pihak2' })}
                          className="text-[9px] text-blue-600 underline font-semibold"
                        >
                          Ubah
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleClearSignature(selectedForPrint, 'pihak2')}
                          className="text-[9px] text-rose-600 underline font-semibold"
                        >
                          Hapus TTD
                        </button>
                      </div>
                    )}
                    {selectedForPrint.tandaTanganPihak2 && !isAdminOrOperator && (
                      <span className="print:hidden text-[9px] text-slate-400 block mt-1">
                        🔒 Dilindungi (Hanya Admin)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Rekapitulasi berkas Surat Perjanjian Damai Siswa (SP Damai) di lingkungan UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-emerald-100/70 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Nomor & Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-left">Pihak I (Siswa 1)</th>
                    <th className="p-2 border-r border-slate-300 text-left">Pihak II (Siswa 2)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Status</th>
                    <th className="p-2 text-center w-20">Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-[10px]">
                        <span className="font-bold block text-emerald-800">{item.nomorSurat}</span>
                        <span>{item.hariTanggal}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <span className="font-semibold block">{item.namaPihak1}</span>
                        <span className="text-[10px] text-slate-500">Kelas {item.kelasPihak1}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <span className="font-semibold block">{item.namaPihak2}</span>
                        <span className="text-[10px] text-slate-500">Kelas {item.kelasPihak2}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span className="text-[10px] text-emerald-700 font-bold">Resmi</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </OfficialReportModal>
      )}

      {/* Student Picker Popup */}
      <StudentPickerModal
        isOpen={activePicker !== null}
        onClose={() => setActivePicker(null)}
        siswaList={siswaList}
        title={activePicker === 'pihak1' ? 'Pilih Pihak Pertama' : 'Pilih Pihak Kedua'}
        onSelect={(siswa) => {
          if (activePicker === 'pihak1') {
            setNamaPihak1(siswa.nama);
            setKelasPihak1(siswa.kelas);
          } else {
            setNamaPihak2(siswa.nama);
            setKelasPihak2(siswa.kelas);
          }
        }}
      />

      {/* Confidentiality View for Siswa, Guru, Orang Tua / Non-Admin */}
      {isRestrictedFromViewingReports ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Lock className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Kerahasiaan Dokumen Restorative Justice Dilindungi</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                Hasil Data SP Damai Bersifat Rahasia
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Untuk menjunjung kode etik konseling, asas praduga, dan perlindungan privasi anak dari stigma, riwayat berkas dan hasil input data <strong>Surat Kesepakatan Perdamaian (SP Damai Siswa)</strong> hanya dapat diakses oleh <strong>Administrator &amp; Operator Sekolah (Konselor BK &amp; Tim TPPK SPANJU)</strong>.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-3">
              <p className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Ingin Membuat atau Mengajukan Mediasi Damai Baru?</span>
              </p>
              <p className="leading-relaxed">
                Jika terdapat perselisihan siswa yang memerlukan rekonsiliasi, musyawarah kekeluargaan, atau penerbitan surat kesepakatan damai baru, silakan klik tombol di bawah untuk membuka formulir kesepakatan damai resmi.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  id="btn-tambah-sp-damai-confidential"
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Surat Damai Baru Sekarang</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <span className="text-[11px] font-bold text-emerald-900 block mb-0.5">1. Rekonsiliasi Damai</span>
                <p className="text-[10px] text-emerald-800 leading-relaxed">Penyelesaian perselisihan tanpa dendam dan saling memaafkan.</p>
              </div>
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80">
                <span className="text-[11px] font-bold text-teal-900 block mb-0.5">2. Bimbingan Konselor</span>
                <p className="text-[10px] text-teal-800 leading-relaxed">Didampingi Guru BK dan TPPK secara objektif &amp; kekeluargaan.</p>
              </div>
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80">
                <span className="text-[11px] font-bold text-sky-900 block mb-0.5">3. Hotline Layanan BK</span>
                <p className="text-[10px] text-sky-800 leading-relaxed">(0343) 426845 &bull; 0851-6870-0953</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Filter and Search Bar */
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa, nomor SP damai, kelas, masalah..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="semua">Semua Status ({records.length})</option>
              <option value="Damai Permanen">Damai Permanen</option>
              <option value="Aktif Terpantau">Aktif Terpantau</option>
              <option value="Evaluasi Lanjutan">Evaluasi Lanjutan</option>
            </select>
          </div>
        </div>

        {/* Cards List */}
        <div className="space-y-4">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                id={`card-sp-${item.id}`}
                className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/60 to-white border border-slate-200 hover:border-emerald-300 shadow-xs card-3d space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {item.nomorSurat}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          item.status === 'Damai Permanen'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : item.status === 'Aktif Terpantau'
                            ? 'bg-sky-100 text-sky-800 border-sky-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Both Students Big Badge */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="px-3 py-1 bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-1.5 text-xs font-bold text-sky-900">
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        {item.namaPihak1} &bull; <span className="text-sky-700">Kelas {item.kelasPihak1}</span>
                      </div>
                      <Handshake className="w-5 h-5 text-emerald-600" />
                      <div className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1.5 text-xs font-bold text-rose-900">
                        <User className="w-3.5 h-3.5 text-rose-600" />
                        {item.namaPihak2} &bull; <span className="text-rose-700">Kelas {item.kelasPihak2}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-1.5 font-medium">
                      <span>{item.hariTanggal}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" /> {item.tempatMediasi}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition"
                      title="Edit Laporan SP Damai Siswa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedForPrint(item);
                        setShowPrintModal(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      title="Cetak Surat Damai Kop Surat"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => onDeleteRecord(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Pokok Masalah */}
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                    POKOK PERMASALAHAN AWAL:
                  </span>
                  <p className="text-slate-700 font-medium leading-relaxed">{item.ringkasanMasalah}</p>
                </div>

                {/* Accordion Butir Kesepakatan */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full px-4 py-2 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100/70 transition"
                  >
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Lihat {item.butirKesepakatan.length} Butir Komitmen Perdamaian & Sanksi Edukatif
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 space-y-3 text-xs border-t border-slate-100 bg-emerald-50/20">
                      <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 font-medium">
                        {item.butirKesepakatan.map((butir, bIdx) => (
                          <li key={bIdx}>{butir}</li>
                        ))}
                      </ol>

                      {item.sanksiEdukasi && (
                        <div className="p-2.5 bg-white border border-emerald-200 rounded-lg">
                          <span className="text-[10px] font-bold text-emerald-800 block mb-0.5">
                            Sanksi Edukatif & Pembinaan Karakter:
                          </span>
                          <p className="text-slate-700">{item.sanksiEdukasi}</p>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-end">
                        <span><strong>Konselor Sebaya:</strong> {item.namaKonselorSebaya}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dual Touchscreen Signatures Display & Buttons */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* TTD Siswa I */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.tandaTanganPihak1 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-10 px-2 bg-white rounded-lg border border-slate-200 flex items-center shadow-2xs">
                            <img
                              src={item.tandaTanganPihak1}
                              alt={`TTD ${item.namaPihak1}`}
                              className="h-8 max-w-[80px] object-contain"
                            />
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <Lock className="w-3 h-3" /> Terkunci
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Belum TTD</span>
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-800 block">{item.namaPihak1}</span>
                        <span className="text-[10px] text-sky-700 font-medium">Pihak I (Kelas {item.kelasPihak1})</span>
                      </div>
                    </div>

                    {!item.tandaTanganPihak1 && (
                      <button
                        type="button"
                        onClick={() => setSigningRecord({ record: item, targetParty: 'pihak1' })}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 border border-sky-300 flex items-center gap-1 transition"
                      >
                        <FileSignature className="w-3 h-3" />
                        TTD HP
                      </button>
                    )}

                    {item.tandaTanganPihak1 && isAdminOrOperator && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSigningRecord({ record: item, targetParty: 'pihak1' })}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 border border-sky-300 transition"
                          title="Ubah TTD"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClearSignature(item, 'pihak1')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                          title="Hapus TTD (Admin)"
                        >
                          Hapus
                        </button>
                      </div>
                    )}

                    {item.tandaTanganPihak1 && !isAdminOrOperator && (
                      <span className="text-[10px] text-slate-400 italic font-medium px-2 py-1 bg-slate-100 rounded-lg">
                        🔒 Dilindungi
                      </span>
                    )}
                  </div>

                  {/* TTD Siswa II */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.tandaTanganPihak2 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-10 px-2 bg-white rounded-lg border border-slate-200 flex items-center shadow-2xs">
                            <img
                              src={item.tandaTanganPihak2}
                              alt={`TTD ${item.namaPihak2}`}
                              className="h-8 max-w-[80px] object-contain"
                            />
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <Lock className="w-3 h-3" /> Terkunci
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Belum TTD</span>
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-800 block">{item.namaPihak2}</span>
                        <span className="text-[10px] text-slate-700 font-medium">Pihak II (Kelas {item.kelasPihak2})</span>
                      </div>
                    </div>

                    {!item.tandaTanganPihak2 && (
                      <button
                        type="button"
                        onClick={() => setSigningRecord({ record: item, targetParty: 'pihak2' })}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1 transition"
                      >
                        <FileSignature className="w-3 h-3" />
                        TTD HP
                      </button>
                    )}

                    {item.tandaTanganPihak2 && isAdminOrOperator && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSigningRecord({ record: item, targetParty: 'pihak2' })}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
                          title="Ubah TTD"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClearSignature(item, 'pihak2')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                          title="Hapus TTD (Admin)"
                        >
                          Hapus
                        </button>
                      </div>
                    )}

                    {item.tandaTanganPihak2 && !isAdminOrOperator && (
                      <span className="text-[10px] text-slate-400 italic font-medium px-2 py-1 bg-slate-100 rounded-lg">
                        🔒 Dilindungi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Student Picker Modal */}
      {activePicker && (
        <StudentPickerModal
          isOpen={true}
          onClose={() => setActivePicker(null)}
          siswaList={siswaList}
          title={activePicker === 'pihak1' ? 'Pilih Identitas Pihak I (Siswa)' : 'Pilih Identitas Pihak II (Siswa)'}
          onSelect={(siswa) => {
            if (activePicker === 'pihak1') {
              setNamaPihak1(siswa.nama);
              setKelasPihak1(siswa.kelas);
            } else {
              setNamaPihak2(siswa.nama);
              setKelasPihak2(siswa.kelas);
            }
            setActivePicker(null);
          }}
        />
      )}
    </div>
  );
};
