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
  FileSignature,
  FileText,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { SPDamaiRecord } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';

interface Props {
  records: SPDamaiRecord[];
  onAddRecord: (record: SPDamaiRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: SPDamaiRecord) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const SPDamaiView: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
  onOpenMenu,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
  const [nisnPihak1, setNisnPihak1] = useState('');
  const [peranPihak1, setPeranPihak1] = useState('Pihak Pertama (Siswa I)');
  const [tandaTanganPihak1, setTandaTanganPihak1] = useState('');

  const [namaPihak2, setNamaPihak2] = useState('');
  const [kelasPihak2, setKelasPihak2] = useState('');
  const [nisnPihak2, setNisnPihak2] = useState('');
  const [peranPihak2, setPeranPihak2] = useState('Pihak Kedua (Siswa II)');
  const [tandaTanganPihak2, setTandaTanganPihak2] = useState('');

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
  const [namaSaksiGuru, setNamaSaksiGuru] = useState('Drs. Supriyadi / Guru BK');
  const [jabatanSaksiGuru, setJabatanSaksiGuru] = useState('Guru Bimbingan Konseling & Fasilitator Mediasi');
  const [namaKonselorSebaya, setNamaKonselorSebaya] = useState('Duta Sahabat SPANJU');
  const [status, setStatus] = useState<SPDamaiRecord['status']>('Damai Permanen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPihak1.trim() || !namaPihak2.trim() || !ringkasanMasalah.trim()) return;

    const count = records.length + 1;
    const nomorSurat = `${String(count).padStart(3, '0')}/SP-DAMAI/SPANJU/IX/${new Date().getFullYear()}`;

    const newRecord: SPDamaiRecord = {
      id: `sp-damai-${Date.now()}`,
      nomorSurat,
      hariTanggal: hariTanggal.trim() || 'Senin, 14 September 2026',
      tempatMediasi: tempatMediasi.trim() || 'Ruang Konseling Ramah Sahabat SPANJU / BK',
      namaPihak1: namaPihak1.trim(),
      kelasPihak1: kelasPihak1.trim() || 'Kelas 8',
      nisnPihak1: nisnPihak1.trim(),
      peranPihak1: peranPihak1.trim(),
      tandaTanganPihak1: tandaTanganPihak1 || undefined,
      namaPihak2: namaPihak2.trim(),
      kelasPihak2: kelasPihak2.trim() || 'Kelas 8',
      nisnPihak2: nisnPihak2.trim(),
      peranPihak2: peranPihak2.trim(),
      tandaTanganPihak2: tandaTanganPihak2 || undefined,
      ringkasanMasalah: ringkasanMasalah.trim(),
      butirKesepakatan: [klausul1, klausul2, klausul3, klausul4].filter((k) => k.trim() !== ''),
      sanksiEdukasi: sanksiEdukasi.trim(),
      namaSaksiGuru: namaSaksiGuru.trim(),
      jabatanSaksiGuru: jabatanSaksiGuru.trim(),
      namaKonselorSebaya: namaKonselorSebaya.trim(),
      status,
      hasilPemantauan: 'Kedua pihak telah saling bersalaman damai dan berkomitmen menjaga keharmonisan pertemanan.',
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowModal(false);

    // Reset
    setNamaPihak1('');
    setKelasPihak1('');
    setNisnPihak1('');
    setTandaTanganPihak1('');
    setNamaPihak2('');
    setKelasPihak2('');
    setNisnPihak2('');
    setTandaTanganPihak2('');
    setRingkasanMasalah('');
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
    setSigningRecord(null);
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
              <Layers className="w-3.5 h-3.5 text-rose-600" />
              Pilihan Menu Aplikasi
            </button>
          )}
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
          <button
            id="btn-tambah-sp-damai"
            onClick={() => setShowModal(true)}
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Formulir Surat Kesepakatan Damai Siswa (Restorative Justice)
                  </h2>
                  <p className="text-xs text-slate-500">
                    UPTD SMP Negeri 7 Pasuruan &bull; Rekonsiliasi & Penandatanganan Layar Sentuh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Mediasi Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    HARI / TANGGAL MEDIASI <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hariTanggal}
                    onChange={(e) => setHariTanggal(e.target.value)}
                    placeholder="Contoh: Senin, 14 September 2026"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:outline-none"
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
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Nama Siswa <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPihak1}
                      onChange={(e) => setNamaPihak1(e.target.value)}
                      placeholder="Nama lengkap siswa I"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Kelas</label>
                      <input
                        type="text"
                        value={kelasPihak1}
                        onChange={(e) => setKelasPihak1(e.target.value)}
                        placeholder="Contoh: 8E"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NISN / NIS</label>
                      <input
                        type="text"
                        value={nisnPihak1}
                        onChange={(e) => setNisnPihak1(e.target.value)}
                        placeholder="00982..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-sky-500"
                      />
                    </div>
                  </div>

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
                <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2.5">
                  <span className="font-bold text-rose-900 block text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-700" />
                    IDENTITAS PIHAK KEDUA (SISWA II):
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Nama Siswa <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPihak2}
                      onChange={(e) => setNamaPihak2(e.target.value)}
                      placeholder="Nama lengkap siswa II"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-rose-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Kelas</label>
                      <input
                        type="text"
                        value={kelasPihak2}
                        onChange={(e) => setKelasPihak2(e.target.value)}
                        placeholder="Contoh: 8E"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NISN / NIS</label>
                      <input
                        type="text"
                        value={nisnPihak2}
                        onChange={(e) => setNisnPihak2(e.target.value)}
                        placeholder="00982..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* TTD Pihak 2 */}
                  <div className="pt-1">
                    <label className="block text-[10px] font-bold text-rose-800 mb-1">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    GURU BK / WALI KELAS SAKSI MEDIASI
                  </label>
                  <input
                    type="text"
                    value={namaSaksiGuru}
                    onChange={(e) => setNamaSaksiGuru(e.target.value)}
                    placeholder="Nama guru saksi & pendamping"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
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
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md btn-3d"
                >
                  Terbitkan Surat Kesepakatan Damai
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
          firstSignerRole={selectedForPrint ? `Pihak Pertama (${selectedForPrint.namaPihak1})` : 'Perwakilan Siswa'}
          firstSignerName={selectedForPrint?.namaPihak1 || 'Siswa Pihak I'}
          firstSignerSignature={selectedForPrint?.tandaTanganPihak1 || records[0]?.tandaTanganPihak1}
          onFirstSignerUpdate={(sig) => {
            if (selectedForPrint && onUpdateRecord) {
              onUpdateRecord({ ...selectedForPrint, tandaTanganPihak1: sig });
            }
          }}
          secondSignerRole="Kepala UPTD SMP Negeri 7 Pasuruan"
          secondSignerName="Drs. Akhmad Fauzi, M.Pd."
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
                  Tanda Tangan Para Pihak dan Saksi-Saksi Mediasi:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  {/* Pihak 1 */}
                  <div className="p-2 border border-slate-200 rounded-lg bg-white">
                    <span className="text-slate-500 block">Pihak Pertama,</span>
                    <div className="h-12 flex items-center justify-center my-1">
                      {selectedForPrint.tandaTanganPihak1 ? (
                        <img
                          src={selectedForPrint.tandaTanganPihak1}
                          alt="TTD 1"
                          className="max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-300 italic">(Belum TTD)</span>
                      )}
                    </div>
                    <span className="font-bold text-slate-800 underline block">
                      {selectedForPrint.namaPihak1}
                    </span>
                    <span className="text-slate-500">Kelas {selectedForPrint.kelasPihak1}</span>
                  </div>

                  {/* Pihak 2 */}
                  <div className="p-2 border border-slate-200 rounded-lg bg-white">
                    <span className="text-slate-500 block">Pihak Kedua,</span>
                    <div className="h-12 flex items-center justify-center my-1">
                      {selectedForPrint.tandaTanganPihak2 ? (
                        <img
                          src={selectedForPrint.tandaTanganPihak2}
                          alt="TTD 2"
                          className="max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-300 italic">(Belum TTD)</span>
                      )}
                    </div>
                    <span className="font-bold text-slate-800 underline block">
                      {selectedForPrint.namaPihak2}
                    </span>
                    <span className="text-slate-500">Kelas {selectedForPrint.kelasPihak2}</span>
                  </div>

                  {/* Saksi Guru */}
                  <div className="p-2 border border-slate-200 rounded-lg bg-white">
                    <span className="text-slate-500 block">Saksi Guru BK / TPPK,</span>
                    <div className="h-12 flex items-center justify-center my-1">
                      {selectedForPrint.tandaTanganSaksiGuru ? (
                        <img
                          src={selectedForPrint.tandaTanganSaksiGuru}
                          alt="TTD Guru"
                          className="max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-emerald-700 font-bold">Sah Terdata</span>
                      )}
                    </div>
                    <span className="font-bold text-slate-800 underline block">
                      {selectedForPrint.namaSaksiGuru || 'Guru BK'}
                    </span>
                    <span className="text-slate-500">Fasilitator Mediasi</span>
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

      {/* Filter and Search Bar */}
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

                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span><strong>Saksi Guru:</strong> {item.namaSaksiGuru}</span>
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
                        <div className="h-10 px-2 bg-white rounded-lg border border-slate-200 flex items-center shadow-2xs">
                          <img
                            src={item.tandaTanganPihak1}
                            alt={`TTD ${item.namaPihak1}`}
                            className="h-8 max-w-[80px] object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Belum TTD</span>
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-800 block">{item.namaPihak1}</span>
                        <span className="text-[10px] text-sky-700 font-medium">Pihak I (Kelas {item.kelasPihak1})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSigningRecord({ record: item, targetParty: 'pihak1' })}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 border border-sky-300 flex items-center gap-1 transition"
                    >
                      <FileSignature className="w-3 h-3" />
                      {item.tandaTanganPihak1 ? 'Ubah TTD' : 'TTD HP'}
                    </button>
                  </div>

                  {/* TTD Siswa II */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.tandaTanganPihak2 ? (
                        <div className="h-10 px-2 bg-white rounded-lg border border-slate-200 flex items-center shadow-2xs">
                          <img
                            src={item.tandaTanganPihak2}
                            alt={`TTD ${item.namaPihak2}`}
                            className="h-8 max-w-[80px] object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Belum TTD</span>
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-800 block">{item.namaPihak2}</span>
                        <span className="text-[10px] text-rose-700 font-medium">Pihak II (Kelas {item.kelasPihak2})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSigningRecord({ record: item, targetParty: 'pihak2' })}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 flex items-center gap-1 transition"
                    >
                      <FileSignature className="w-3 h-3" />
                      {item.tandaTanganPihak2 ? 'Ubah TTD' : 'TTD HP'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
