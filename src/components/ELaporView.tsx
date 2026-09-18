import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Clock,
  User,
  School,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Users,
  Printer,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Eye,
  FileSignature,
  FileText,
  Lock,
  ShieldCheck,
  Layers,
  Pencil,
} from 'lucide-react';
import { ELaporRecord, UserRole, Siswa } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';
import { StudentPickerModal } from './StudentPickerModal';
import { CalendarDatePicker, RealTimeTimePicker } from './DateTimeWidgets';

interface Props {
  records: ELaporRecord[];
  siswaList?: Siswa[];
  onAddRecord: (record: ELaporRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateStatus: (id: string, status: ELaporRecord['status']) => void;
  onUpdateRecord?: (record: ELaporRecord) => void;
  userRole?: UserRole;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const ELaporView: React.FC<Props> = ({
  records,
  siswaList = [],
  onAddRecord,
  onDeleteRecord,
  onUpdateStatus,
  onUpdateRecord,
  userRole = 'admin',
  canDelete = true,
  onOpenMenu,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ELaporRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recentlySubmittedCode, setRecentlySubmittedCode] = useState<string | null>(null);

  const isRestrictedFromViewingReports = userRole === 'siswa' || userRole === 'orang_tua';

  // Printing & Signature
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<ELaporRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<ELaporRecord | null>(null);

  // Form states
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktuKejadian, setWaktuKejadian] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('');
  const [nisnSiswa, setNisnSiswa] = useState('');
  const [namaSiswa2, setNamaSiswa2] = useState('');
  const [kelas2, setKelas2] = useState('');
  const [nisnSiswa2, setNisnSiswa2] = useState('');
  const [namaPenandatangan, setNamaPenandatangan] = useState('Wiwik Ismiati, S.Pd');
  const [nipPenandatangan, setNipPenandatangan] = useState('198311162009042003');
  const [kronologiKejadian, setKronologiKejadian] = useState('');
  const [kegiatanPenyadaran, setKegiatanPenyadaran] = useState('');
  const [kegiatanPencegahan, setKegiatanPencegahan] = useState('');
  const [kegiatanPenangananRespon, setKegiatanPenangananRespon] = useState('');
  const [kegiatanPelaporan, setKegiatanPelaporan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [status, setStatus] = useState<ELaporRecord['status']>('Mediasi');
  const [kategoriKasus, setKategoriKasus] = useState<ELaporRecord['kategoriKasus']>('Verbal');
  const [formSignature, setFormSignature] = useState('');
  const [activePicker, setActivePicker] = useState<'siswa1' | 'siswa2' | null>(null);

  const resetForm = () => {
    setEditingRecord(null);
    setHariTanggal('');
    setWaktuKejadian('');
    setNamaSiswa('');
    setKelas('');
    setNisnSiswa('');
    setNamaSiswa2('');
    setKelas2('');
    setNisnSiswa2('');
    setNamaPenandatangan('Wiwik Ismiati, S.Pd');
    setNipPenandatangan('198311162009042003');
    setKronologiKejadian('');
    setKegiatanPenyadaran('');
    setKegiatanPencegahan('');
    setKegiatanPenangananRespon('');
    setKegiatanPelaporan('');
    setTindakLanjut('');
    setKeterangan('');
    setStatus('Mediasi');
    setKategoriKasus('Verbal');
    setFormSignature('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (rec: ELaporRecord) => {
    setEditingRecord(rec);
    setHariTanggal(rec.hariTanggal);
    setWaktuKejadian(rec.waktuKejadian || '');
    setNamaSiswa(rec.namaSiswa);
    setKelas(rec.kelas);
    setNisnSiswa(rec.nisnSiswa || '');
    setNamaSiswa2(rec.namaSiswa2 || '');
    setKelas2(rec.kelas2 || '');
    setNisnSiswa2(rec.nisnSiswa2 || '');
    setNamaPenandatangan(rec.namaPenandatangan || 'Wiwik Ismiati, S.Pd');
    setNipPenandatangan(rec.nipPenandatangan || '198311162009042003');
    setKronologiKejadian(rec.kronologiKejadian);
    setKegiatanPenyadaran(rec.kegiatanPenyadaran || '');
    setKegiatanPencegahan(rec.kegiatanPencegahan || '');
    setKegiatanPenangananRespon(rec.kegiatanPenangananRespon || '');
    setKegiatanPelaporan(rec.kegiatanPelaporan || '');
    setTindakLanjut(rec.tindakLanjut || '');
    setKeterangan(rec.keterangan || '');
    setStatus(rec.status);
    setKategoriKasus(rec.kategoriKasus);
    setFormSignature(rec.tandaTanganUrl || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hariTanggal.trim() || !namaSiswa.trim() || !kronologiKejadian.trim()) return;

    if (editingRecord) {
      const updatedRecord: ELaporRecord = {
        ...editingRecord,
        hariTanggal: hariTanggal.trim(),
        waktuKejadian: waktuKejadian.trim(),
        namaSiswa: namaSiswa.trim(),
        kelas: kelas.trim() || 'Siswa SPANJU',
        nisnSiswa: nisnSiswa.trim(),
        namaSiswa2: namaSiswa2.trim(),
        kelas2: kelas2.trim(),
        nisnSiswa2: nisnSiswa2.trim(),
        kronologiKejadian: kronologiKejadian.trim(),
        kegiatanPenyadaran: kegiatanPenyadaran.trim() || 'Pemberian pemahaman dampak psikologis dan empati kawan.',
        kegiatanPencegahan: kegiatanPencegahan.trim() || 'Penguatan norma kelas ramah anak & komitmen anti-bullying.',
        kegiatanPenangananRespon: kegiatanPenangananRespon.trim() || 'Mediasi tatap muka damai didampingi konselor BK.',
        kegiatanPelaporan: kegiatanPelaporan.trim() || 'Pencatatan berita acara resmi di sistem register sekolah.',
        tindakLanjut: tindakLanjut.trim() || 'Pemantauan berkala oleh Duta Sahabat SPANJU.',
        keterangan: keterangan.trim(),
        status,
        kategoriKasus,
        tandaTanganUrl: formSignature || editingRecord.tandaTanganUrl,
        namaPenandatangan: namaPenandatangan.trim(),
        nipPenandatangan: nipPenandatangan.trim(),
      };

      if (onUpdateRecord) {
        onUpdateRecord(updatedRecord);
      }
      setShowModal(false);
      resetForm();
      return;
    }

    const count = records.length + 1;
    const kodeLaporan = `SPJ-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;

    const newRecord: ELaporRecord = {
      id: `lapor-${Date.now()}`,
      kodeLaporan,
      hariTanggal: hariTanggal.trim(),
      waktuKejadian: waktuKejadian.trim(),
      namaSiswa: namaSiswa.trim(),
      kelas: kelas.trim() || 'Siswa SPANJU',
      nisnSiswa: nisnSiswa.trim(),
      namaSiswa2: namaSiswa2.trim(),
      kelas2: kelas2.trim(),
      nisnSiswa2: nisnSiswa2.trim(),
      kronologiKejadian: kronologiKejadian.trim(),
      kegiatanPenyadaran: kegiatanPenyadaran.trim() || 'Pemberian pemahaman dampak psikologis dan empati kawan.',
      kegiatanPencegahan: kegiatanPencegahan.trim() || 'Penguatan norma kelas ramah anak & komitmen anti-bullying.',
      kegiatanPenangananRespon: kegiatanPenangananRespon.trim() || 'Mediasi tatap muka damai didampingi konselor BK.',
      kegiatanPelaporan: kegiatanPelaporan.trim() || 'Pencatatan berita acara resmi di sistem register sekolah.',
      tindakLanjut: tindakLanjut.trim() || 'Pemantauan berkala oleh Duta Sahabat SPANJU.',
      keterangan: keterangan.trim(),
      status,
      kategoriKasus,
      tandaTanganUrl: formSignature || undefined,
      namaPenandatangan: namaPenandatangan.trim(),
      nipPenandatangan: nipPenandatangan.trim(),
      jabatanPenandatangan: 'Konselor Tim Pencegahan & Penanganan Kekerasan (TPPK)',
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setRecentlySubmittedCode(newRecord.kodeLaporan);
    setShowModal(false);
    resetForm();
  };

  const handleCardSignatureSave = (signatureUrl: string, name?: string, title?: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: ELaporRecord = {
      ...signingRecord,
      tandaTanganUrl: signatureUrl,
      namaPenandatangan: name || signingRecord.namaPenandatangan || 'Petugas Penanganan Kasus',
      nipPenandatangan: signingRecord.nipPenandatangan,
      jabatanPenandatangan: title || signingRecord.jabatanPenandatangan || 'Konselor TPPK SPANJU',
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kodeLaporan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kronologiKejadian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'semua' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (st: ELaporRecord['status']) => {
    switch (st) {
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Terpantau Aman':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Mediasi':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div id="view-e-lapor" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-100/80 via-red-50/70 to-white border border-rose-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 mb-2 shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            SISTEM ADUAN & MEKANISME PENANGANAN SPANJU
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            E-Lapor Perundungan dan Kekerasan SPANJU
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Kanal resmi penanganan kekerasan dan perundungan: Penyadaran, Pencegahan, Penanganan Respon, Pelaporan & Tindak Lanjut
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
          {!isRestrictedFromViewingReports && (
            <button
              onClick={() => {
                setSelectedForPrint(null);
                setShowPrintModal(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-rose-600" />
              Cetak Berita Acara Resmi
            </button>
          )}
          <button
            id="btn-tambah-lapor"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/20 hover:from-rose-500 hover:to-red-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Buat Laporan Baru
          </button>
        </div>
      </div>

      {/* Confirmation of submission */}
      {recentlySubmittedCode && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Laporan Aduan Berhasil Terkirim!</span> Kode Aduan Anda:{' '}
              <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                {recentlySubmittedCode}
              </strong>
              . Tim TPPK SMPN 7 Pasuruan akan segera menindaklanjuti secara damai dan terjaga kerahasiaannya.
            </div>
          </div>
          <button
            onClick={() => setRecentlySubmittedCode(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-100/60 transition shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Add / Edit Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
                  {editingRecord ? <Pencil className="w-5 h-5 text-amber-700" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span>{editingRecord ? 'Edit Data Laporan Aduan' : 'Form E-Lapor & Mekanisme Penanganan'}</span>
                    {editingRecord && (
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-300">
                        {editingRecord.kodeLaporan}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingRecord
                      ? 'Perbarui data identitas siswa, kronologi peristiwa, atau alur penanganan kasus'
                      : 'Pencatatan insiden perundungan & tahapan penanganan terpadu'}
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
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <CalendarDatePicker
                    value={hariTanggal}
                    onChange={setHariTanggal}
                    required
                  />
                </div>

                <div>
                  <RealTimeTimePicker
                    value={waktuKejadian}
                    onChange={setWaktuKejadian}
                    label="WAKTU KEJADIAN"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    KATEGORI KASUS
                  </label>
                  <select
                    value={kategoriKasus}
                    onChange={(e) => setKategoriKasus(e.target.value as ELaporRecord['kategoriKasus'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Verbal">Verbal (Ejekan/Hinaan)</option>
                    <option value="Fisik">Fisik (Gesekan/Dorongan)</option>
                    <option value="Siber">Siber (Medsos/Grup Chat)</option>
                    <option value="Sosial/Relasional">Sosial / Pengucilan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    STATUS PENANGANAN
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ELaporRecord['status'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none font-semibold"
                  >
                    <option value="Investigasi">Investigasi</option>
                    <option value="Mediasi">Mediasi</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Terpantau Aman">Terpantau Aman</option>
                  </select>
                </div>
              </div>

              {/* Dual Identity Panels (Siswa I & Siswa II) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Siswa I - Pihak Pertama (Blue Theme) */}
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-sky-200/60">
                    <div className="p-1.5 rounded-lg bg-white text-sky-600 shadow-sm border border-sky-100">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black text-sky-900 uppercase tracking-tight">
                      IDENTITAS PIHAK PERTAMA (SISWA I):
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setActivePicker('siswa1')}
                      className="w-full text-left group"
                    >
                      <label className="block text-[10px] font-black text-sky-800 mb-1 uppercase">Nama Siswa <span className="text-rose-500">*</span></label>
                      <div className="w-full px-3 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-800 group-hover:border-sky-500 transition flex items-center justify-between">
                        <span className={namaSiswa ? 'text-slate-800' : 'text-slate-400 italic'}>
                          {namaSiswa || 'Klik untuk pilih siswa...'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-sky-400" />
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActivePicker('siswa1')}
                      className="w-full text-left group"
                    >
                      <label className="block text-[10px] font-black text-sky-800 mb-1 uppercase">Kelas</label>
                      <div className="w-full px-3 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-800 group-hover:border-sky-500 transition flex items-center justify-between">
                        <span className={kelas ? 'text-slate-800' : 'text-slate-400 italic'}>
                          {kelas ? `KELAS ${kelas}` : 'Contoh: 8E'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-sky-400" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Siswa II - Pihak Kedua (Slate Theme) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <div className="p-1.5 rounded-lg bg-white text-slate-600 shadow-sm border border-slate-100">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                      IDENTITAS PIHAK KEDUA (SISWA II):
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setActivePicker('siswa2')}
                      className="w-full text-left group"
                    >
                      <label className="block text-[10px] font-black text-slate-800 mb-1 uppercase">Nama Siswa <span className="text-red-500">*</span></label>
                      <div className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 group-hover:border-slate-500 transition flex items-center justify-between">
                        <span className={namaSiswa2 ? 'text-slate-800' : 'text-slate-400 italic'}>
                          {namaSiswa2 || 'Klik untuk pilih siswa...'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePicker('siswa2')}
                      className="w-full text-left group"
                    >
                      <label className="block text-[10px] font-black text-slate-800 mb-1 uppercase">Kelas</label>
                      <div className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 group-hover:border-slate-500 transition flex items-center justify-between">
                        <span className={kelas2 ? 'text-slate-800' : 'text-slate-400 italic'}>
                          {kelas2 ? `KELAS ${kelas2}` : 'Contoh: 8E'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Kronologi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KRONOLOGI KEJADIAN / URAIAN PERISTIWA <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={kronologiKejadian}
                  onChange={(e) => setKronologiKejadian(e.target.value)}
                  placeholder="Jelaskan secara objektif apa yang terjadi, tempat kejadian, saksi yang melihat, dan dampak yang dialami siswa..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* 4 Mekanisme Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">
                  4 PILAR MEKANISME KEGIATAN PENANGANAN SAHABAT SPANJU:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-sky-800 mb-1">
                      1. KEGIATAN PENYADARAN
                    </label>
                    <input
                      type="text"
                      value={kegiatanPenyadaran}
                      onChange={(e) => setKegiatanPenyadaran(e.target.value)}
                      placeholder="Edukasi bahaya verbal / bimbingan empati..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-800 mb-1">
                      2. KEGIATAN PENCEGAHAN
                    </label>
                    <input
                      type="text"
                      value={kegiatanPencegahan}
                      onChange={(e) => setKegiatanPencegahan(e.target.value)}
                      placeholder="Penguatan ikrar damai kelas / pemantauan titik rawan..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                      3. KEGIATAN PENANGANAN RESPON
                    </label>
                    <input
                      type="text"
                      value={kegiatanPenangananRespon}
                      onChange={(e) => setKegiatanPenangananRespon(e.target.value)}
                      placeholder="Mediasi kedua belah pihak dengan konselor BK..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-indigo-800 mb-1">
                      4. KEGIATAN PELAPORAN
                    </label>
                    <input
                      type="text"
                      value={kegiatanPelaporan}
                      onChange={(e) => setKegiatanPelaporan(e.target.value)}
                      placeholder="Pencatatan register resmi BK dan laporan berkala tim SPANJU..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* TINDAK LANJUT & STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    TINDAK LANJUT
                  </label>
                  <input
                    type="text"
                    value={tindakLanjut}
                    onChange={(e) => setTindakLanjut(e.target.value)}
                    placeholder="Contoh: Pemantauan konselor sebaya selama 2 pekan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    STATUS PENANGANAN
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ELaporRecord['status'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Investigasi">Investigasi</option>
                    <option value="Mediasi">Mediasi</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Terpantau Aman">Terpantau Aman</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KETERANGAN
                </label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Catatan tambahan hasil kesepakatan damai..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Touchscreen Signature Pad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PILIH PENANDA TANGAN (PETUGAS BK/TPPK)
                  </label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNamaPenandatangan('Wiwik Ismiati, S.Pd');
                        setNipPenandatangan('198311162009042003');
                      }}
                      className={`px-3 py-2 rounded-xl border text-left transition flex flex-col ${
                        namaPenandatangan === 'Wiwik Ismiati, S.Pd'
                          ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800">Wiwik Ismiati, S.Pd</span>
                      <span className="text-[10px] text-slate-500">Nip. 198311162009042003</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNamaPenandatangan('Eki Febriani, S.Pd');
                        setNipPenandatangan('19940214 202221 2 014');
                      }}
                      className={`px-3 py-2 rounded-xl border text-left transition flex flex-col ${
                        namaPenandatangan === 'Eki Febriani, S.Pd'
                          ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800">Eki Febriani, S.Pd</span>
                      <span className="text-[10px] text-slate-500">Nip. 19940214 202221 2 014</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    TANDA TANGAN (LAYAR SENTUH / MOUSE)
                  </label>
                  <TouchSignaturePad
                    initialSignature={formSignature}
                    signerName={namaPenandatangan}
                    signerTitle="Tim TPPK UPTD SMPN 7 Pasuruan"
                    compact={true}
                    onSave={(dataUrl) => {
                      setFormSignature(dataUrl);
                      alert('Tanda tangan berhasil direkam!');
                    }}
                    title="Tanda Tangan Berita Acara Kasus"
                    promptText="Goreskan jari di layar sentuh HP atau gunakan mouse laptop:"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md btn-3d flex items-center gap-1.5"
                >
                  {editingRecord ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Simpan Perubahan Laporan
                    </>
                  ) : (
                    'Simpan Laporan E-Lapor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signature Modal for Existing Card */}
      {signingRecord && (
        <TouchSignatureModal
          isOpen={true}
          onClose={() => setSigningRecord(null)}
          title={`Tanda Tangan Berita Acara - ${signingRecord.kodeLaporan}`}
          subtitle="Goreskan jari di HP atau gerakkan mouse laptop"
          initialSignature={signingRecord.tandaTanganUrl}
          signerName={signingRecord.namaPenandatangan || 'Konselor Kasus'}
          signerTitle={signingRecord.jabatanPenandatangan || 'Tim TPPK SPANJU'}
          onSave={handleCardSignatureSave}
        />
      )}

      {/* Official Report Modal with Kop Surat */}
      {showPrintModal && (
        <OfficialReportModal
          isOpen={true}
          onClose={() => setShowPrintModal(false)}
          title={
            selectedForPrint
              ? `BERITA ACARA RESMI PENANGANAN ADUAN - ${selectedForPrint.kodeLaporan}`
              : 'REKAPITULASI RESMI PENANGANAN ADUAN & PERUNDUNGAN SISWA'
          }
          nomorSurat={
            selectedForPrint
              ? `421.3 / LAPOR-${selectedForPrint.kodeLaporan} / 101.4.7 / 2026`
              : `421.3 / LAPOR-REKAP / 101.4.7 / 2026`
          }
          firstSignerRole="Petugas Konselor / TPPK SPANJU"
          firstSignerName={selectedForPrint?.namaPenandatangan || 'Tim Konseling & Penanganan Ramah'}
          firstSignerNip={selectedForPrint?.nipPenandatangan}
          firstSignerSignature={selectedForPrint?.tandaTanganUrl || records[0]?.tandaTanganUrl}
          onFirstSignerUpdate={(sig) => {
            if (selectedForPrint && onUpdateRecord) {
              onUpdateRecord({ ...selectedForPrint, tandaTanganUrl: sig });
            }
          }}
          secondSignerRole="Kepala UPTD SMP Negeri 7 Pasuruan"
          secondSignerName="Nur Fadilah, S.Pd., M.Pd"
          secondSignerNip="19860410 201001 2 030"
        >
          {selectedForPrint ? (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">KODE LAPORAN: {selectedForPrint.kodeLaporan}</span>
                  <span className="text-slate-600">Kategori Kasus: <strong>{selectedForPrint.kategoriKasus}</strong></span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-800">
                    Status: {selectedForPrint.status}
                  </span>
                </div>
              </div>

              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 w-1/3">Hari / Tanggal Kejadian</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.hariTanggal} ({selectedForPrint.waktuKejadian})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-sky-50 text-sky-900">Pihak Pertama (Siswa I)</td>
                    <td className="p-2.5 font-bold text-slate-900">
                      {selectedForPrint.namaSiswa} &bull; Kelas {selectedForPrint.kelas}
                      {selectedForPrint.nisnSiswa && <span className="block text-[10px] text-sky-700 font-medium">NISN: {selectedForPrint.nisnSiswa}</span>}
                    </td>
                  </tr>
                  {selectedForPrint.namaSiswa2 && (
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-rose-50 text-rose-900">Pihak Kedua (Siswa II)</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        {selectedForPrint.namaSiswa2} &bull; Kelas {selectedForPrint.kelas2 || '-'}
                        {selectedForPrint.nisnSiswa2 && <span className="block text-[10px] text-rose-700 font-medium">NISN: {selectedForPrint.nisnSiswa2}</span>}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50/40 align-top">Kronologi Kejadian</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed">{selectedForPrint.kronologiKejadian}</td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Empat Pilar Mekanisme Penanganan yang Diterapkan:
                </h4>
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold bg-sky-50 text-sky-900 w-1/3">1. Kegiatan Penyadaran</td>
                      <td className="p-2 text-slate-800">{selectedForPrint.kegiatanPenyadaran || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold bg-amber-50 text-amber-900">2. Kegiatan Pencegahan</td>
                      <td className="p-2 text-slate-800">{selectedForPrint.kegiatanPencegahan || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold bg-emerald-50 text-emerald-900">3. Kegiatan Penanganan Respon</td>
                      <td className="p-2 text-slate-800">{selectedForPrint.kegiatanPenangananRespon || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold bg-indigo-50 text-indigo-900">4. Kegiatan Pelaporan</td>
                      <td className="p-2 text-slate-800">{selectedForPrint.kegiatanPelaporan || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold bg-slate-100 text-slate-800">Tindak Lanjut & Kesepakatan</td>
                      <td className="p-2 text-slate-800 font-medium">{selectedForPrint.tindakLanjut || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Rekapitulasi berkas aduan dan penanganan perundungan / kekerasan siswa di UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-rose-100/70 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Kode & Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-left">Nama Siswa / Kelas</th>
                    <th className="p-2 border-r border-slate-300 text-left">Kronologi Singkat</th>
                    <th className="p-2 border-r border-slate-300 text-center">Status</th>
                    <th className="p-2 text-center w-20">TTD</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-[10px]">
                        <span className="font-bold block text-rose-800">{item.kodeLaporan}</span>
                        <span>{item.hariTanggal}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <div className="space-y-1">
                          <div className="bg-sky-50/50 p-1 rounded border border-sky-100">
                            <span className="font-bold block text-[10px] text-sky-900 leading-tight">{item.namaSiswa}</span>
                            <span className="text-[9px] text-sky-700">Kelas {item.kelas}</span>
                          </div>
                          {item.namaSiswa2 && (
                            <div className="bg-rose-50/50 p-1 rounded border border-rose-100">
                              <span className="font-bold block text-[10px] text-rose-900 leading-tight">{item.namaSiswa2}</span>
                              <span className="text-[9px] text-rose-700">Kelas {item.kelas2}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-700 max-w-xs truncate">
                        {item.kronologiKejadian}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-300">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {item.tandaTanganUrl ? (
                          <img
                            src={item.tandaTanganUrl}
                            alt="TTD"
                            className="h-7 mx-auto object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold">Resmi</span>
                        )}
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
        title={activePicker === 'siswa1' ? 'Pilih Identitas Siswa I' : 'Pilih Identitas Siswa II'}
        onSelect={(siswa) => {
          if (activePicker === 'siswa1') {
            setNamaSiswa(siswa.nama);
            setKelas(siswa.kelas);
            setNisnSiswa(siswa.nisn);
          } else {
            setNamaSiswa2(siswa.nama);
            setKelas2(siswa.kelas);
            setNisnSiswa2(siswa.nisn);
          }
        }}
      />

      {/* Confidential Notice for Siswa and Orang Tua */}
      {isRestrictedFromViewingReports ? null : (
        /* Filter and Search Bar + Admin Reports List */
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode laporan, nama siswa, kronologi..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="semua">Semua Status ({records.length})</option>
              <option value="Selesai">Selesai</option>
              <option value="Terpantau Aman">Terpantau Aman</option>
              <option value="Mediasi">Mediasi</option>
              <option value="Investigasi">Investigasi</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                id={`card-lapor-${item.id}`}
                className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/60 to-white border border-slate-200 hover:border-rose-300 shadow-xs card-3d space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {item.kodeLaporan}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        Kategori: {item.kategoriKasus}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-800 mt-1.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      {item.namaSiswa} &bull; <span className="text-teal-700 font-bold">Kelas {item.kelas}</span>
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                      <span>{item.hariTanggal}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-rose-500" /> {item.waktuKejadian}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateStatus(item.id, e.target.value as ELaporRecord['status'])}
                      className="px-2 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:border-rose-500 cursor-pointer"
                      title="Ubah status penanganan"
                    >
                      <option value="Investigasi">Investigasi</option>
                      <option value="Mediasi">Mediasi</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Terpantau Aman">Terpantau Aman</option>
                    </select>

                    <button
                      id={`btn-edit-lapor-${item.id}`}
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                      title="Edit / Perbarui Data Laporan Aduan Ini"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-cetak-lapor-${item.id}`}
                      onClick={() => {
                        setSelectedForPrint(item);
                        setShowPrintModal(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition"
                      title="Cetak Berita Acara Kop Surat Kasus Ini"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => onDeleteRecord(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus laporan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Kronologi */}
                <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/60 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-1">
                    KRONOLOGI KEJADIAN / KONFLIK:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.kronologiKejadian}</p>
                </div>

                {/* 4 Mekanisme Toggle */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100/70 transition"
                  >
                    <span className="flex items-center gap-1.5 text-teal-800">
                      <FileCheck className="w-4 h-4 text-teal-600" />
                      4 Mekanisme Kegiatan Penanganan Sahabat SPANJU
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-100 bg-slate-50/50">
                      <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200/60">
                        <span className="text-[10px] font-bold text-sky-800 block mb-0.5">
                          1. Kegiatan Penyadaran
                        </span>
                        <p className="text-slate-700">{item.kegiatanPenyadaran || '-'}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60">
                        <span className="text-[10px] font-bold text-amber-800 block mb-0.5">
                          2. Kegiatan Pencegahan
                        </span>
                        <p className="text-slate-700">{item.kegiatanPencegahan || '-'}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/60">
                        <span className="text-[10px] font-bold text-emerald-800 block mb-0.5">
                          3. Kegiatan Penanganan Respon
                        </span>
                        <p className="text-slate-700">{item.kegiatanPenangananRespon || '-'}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200/60">
                        <span className="text-[10px] font-bold text-indigo-800 block mb-0.5">
                          4. Kegiatan Pelaporan
                        </span>
                        <p className="text-slate-700">{item.kegiatanPelaporan || '-'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tindak Lanjut & Keterangan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-600 block text-[11px]">TINDAK LANJUT:</span>
                    <span className="text-teal-700 font-semibold">{item.tindakLanjut || '-'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-600 block text-[11px]">KETERANGAN:</span>
                    <span className="text-slate-700 font-medium">{item.keterangan || '-'}</span>
                  </div>
                </div>

                {/* Touchscreen Signature Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.tandaTanganUrl ? (
                      <div className="flex items-center gap-2">
                        <div className="h-9 px-2 bg-white rounded-lg border border-slate-200 flex items-center shadow-2xs">
                          <img
                            src={item.tandaTanganUrl}
                            alt="TTD"
                            className="h-7 max-w-[90px] object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> TTD Berita Acara Sah
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Belum ada tanda tangan berita acara
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSigningRecord(item)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 transition active:scale-95 shadow-2xs"
                  >
                    <FileSignature className="w-3.5 h-3.5 text-rose-700" />
                    {item.tandaTanganUrl ? 'Ubah TTD' : 'TTD Touchscreen'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
};
