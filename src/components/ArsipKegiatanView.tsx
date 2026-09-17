import React, { useState } from 'react';
import {
  FolderArchive,
  Plus,
  Search,
  Printer,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  ExternalLink,
  FileText,
  FileSignature,
  Trash2,
  Tag,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ArsipKegiatanRecord } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';

interface Props {
  records: ArsipKegiatanRecord[];
  onAddRecord: (record: ArsipKegiatanRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: ArsipKegiatanRecord) => void;
  canDelete?: boolean;
}

export const ArsipKegiatanView: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Printing & Signature
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<ArsipKegiatanRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<ArsipKegiatanRecord | null>(null);

  // Form states
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [kategori, setKategori] = useState<ArsipKegiatanRecord['kategori']>('Sosialisasi Anti-Bullying');
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktu, setWaktu] = useState('08:00 - 10:00 WIB');
  const [tempat, setTempat] = useState('Aula Terbuka Graha Adiwiyata SMPN 7 Pasuruan');
  const [penyelenggara, setPenyelenggara] = useState('Tim TPPK, OSIS & Duta Sahabat SPANJU');
  const [sasaranPeserta, setSasaranPeserta] = useState('Perwakilan Siswa Kelas 7, 8, dan 9');
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(64);
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState('');
  const [hasilNotulensi, setHasilNotulensi] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [linkDokumen, setLinkDokumen] = useState('');
  const [namaKoordinator, setNamaKoordinator] = useState('Hj. Siti Aminah, S.Pd');
  const [jabatanKoordinator, setJabatanKoordinator] = useState('Koordinator Program Sahabat SPANJU');
  const [formSignature, setFormSignature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKegiatan.trim() || !hariTanggal.trim() || !deskripsiKegiatan.trim()) return;

    const count = records.length + 1;
    const kodeArsip = `ARSIP-SPJ-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;

    const newRecord: ArsipKegiatanRecord = {
      id: `arsip-${Date.now()}`,
      kodeArsip,
      namaKegiatan: namaKegiatan.trim(),
      kategori,
      hariTanggal: hariTanggal.trim(),
      waktu: waktu.trim() || '08:00 - 10:00 WIB',
      tempat: tempat.trim() || 'SMP Negeri 7 Pasuruan',
      penyelenggara: penyelenggara.trim(),
      sasaranPeserta: sasaranPeserta.trim(),
      jumlahPeserta: Number(jumlahPeserta) || 50,
      deskripsiKegiatan: deskripsiKegiatan.trim(),
      hasilNotulensi: hasilNotulensi.trim() || 'Kegiatan berjalan tertib, partisipatif, dan kondusif.',
      linkFoto:
        linkFoto.trim() ||
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      linkDokumen: linkDokumen.trim() || undefined,
      tandaTanganKoordinator: formSignature || undefined,
      namaKoordinator: namaKoordinator.trim(),
      jabatanKoordinator: jabatanKoordinator.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowModal(false);

    // Reset
    setNamaKegiatan('');
    setHariTanggal('');
    setDeskripsiKegiatan('');
    setHasilNotulensi('');
    setLinkFoto('');
    setLinkDokumen('');
    setFormSignature('');
  };

  const handleSignatureSave = (signatureUrl: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: ArsipKegiatanRecord = {
      ...signingRecord,
      tandaTanganKoordinator: signatureUrl,
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      r.namaKegiatan.toLowerCase().includes(term) ||
      r.kodeArsip.toLowerCase().includes(term) ||
      r.tempat.toLowerCase().includes(term) ||
      r.penyelenggara.toLowerCase().includes(term) ||
      r.deskripsiKegiatan.toLowerCase().includes(term);
    const matchCategory = selectedCategory === 'semua' || r.kategori === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalPesertaAll = records.reduce((acc, curr) => acc + (curr.jumlahPeserta || 0), 0);

  return (
    <div id="view-arsip-kegiatan" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-100/80 via-orange-50/70 to-white border border-amber-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2 shadow-2xs">
            <FolderArchive className="w-4 h-4 text-amber-700" />
            REPOSITORI & ARSIP DOKUMENTASI SPANJU
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Arsip Kegiatan Sahabat SPANJU
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Pusat penyimpanan berkas, galeri foto dokumentasi kegiatan sosialisasi ramah anak, pelatihan duta konselor, dan lembar laporan resmi berkop surat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedForPrint(null);
              setShowPrintModal(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            Cetak Kop Surat Resmi
          </button>
          <button
            id="btn-tambah-arsip"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20 hover:from-amber-500 hover:to-orange-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Tambah Arsip Kegiatan
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Arsip Kegiatan
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">{records.length} Berkas</div>
          <span className="text-[10px] text-slate-500">Terdokumentasi lengkap</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Total Siswa Terlibat
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1">{totalPesertaAll} Peserta</div>
          <span className="text-[10px] text-amber-600 font-semibold">Warga SMPN 7 Pasuruan</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Kategori Terbanyak
          </span>
          <div className="text-sm font-black text-emerald-800 mt-2 truncate">
            Sosialisasi & Workshop
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Pencegahan aktif</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 shadow-xs">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
            Status Validasi
          </span>
          <div className="text-sm font-black text-sky-800 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-sky-600" /> 100% Terverifikasi
          </div>
          <span className="text-[10px] text-sky-600 font-semibold">Kop Surat Dinas & TTD</span>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Tambah Arsip Dokumentasi Kegiatan
                  </h2>
                  <p className="text-xs text-slate-500">
                    UPTD SMP Negeri 7 Pasuruan &bull; Agenda Sahabat SPANJU
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
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  NAMA / JUDUL KEGIATAN <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaKegiatan}
                  onChange={(e) => setNamaKegiatan(e.target.value)}
                  placeholder="Contoh: Sosialisasi Anti Perundungan & Deklarasi Damai 2026"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    KATEGORI KEGIATAN
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as ArsipKegiatanRecord['kategori'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Sosialisasi Anti-Bullying">Sosialisasi Anti-Bullying</option>
                    <option value="Pelatihan Duta Sahabat">Pelatihan Duta Sahabat</option>
                    <option value="Deklarasi Damai">Deklarasi Damai</option>
                    <option value="Workshop Literasi Positif">Workshop Literasi Positif</option>
                    <option value="Ice Breaking & Senam Ramah">Ice Breaking & Senam Ramah</option>
                    <option value="Monitoring & Evaluasi">Monitoring & Evaluasi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    HARI / TANGGAL PELAKSANAAN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hariTanggal}
                    onChange={(e) => setHariTanggal(e.target.value)}
                    placeholder="Contoh: Rabu, 16 September 2026"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WAKTU</label>
                  <input
                    type="text"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    placeholder="08:00 - 10:30 WIB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TEMPAT / LOKASI</label>
                  <input
                    type="text"
                    value={tempat}
                    onChange={(e) => setTempat(e.target.value)}
                    placeholder="Aula Terbuka Graha Adiwiyata"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    SASARAN PESERTA
                  </label>
                  <input
                    type="text"
                    value={sasaranPeserta}
                    onChange={(e) => setSasaranPeserta(e.target.value)}
                    placeholder="Seluruh Siswa Kelas 7 / Perwakilan Kelas 7-9"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    JUMLAH PESERTA (ORANG)
                  </label>
                  <input
                    type="number"
                    value={jumlahPeserta}
                    onChange={(e) => setJumlahPeserta(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  DESKRIPSI & RANGKAIAN AGENDA KEGIATAN <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={deskripsiKegiatan}
                  onChange={(e) => setDeskripsiKegiatan(e.target.value)}
                  placeholder="Uraikan jalannya kegiatan dan agenda utama yang dilaksanakan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  HASIL NOTULENSI / KESIMPULAN DAMPAK KEGIATAN
                </label>
                <textarea
                  rows={2}
                  value={hasilNotulensi}
                  onChange={(e) => setHasilNotulensi(e.target.value)}
                  placeholder="Ringkasan hasil kegiatan, kesepakatan tindak lanjut, dan evaluasi respon siswa..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    LINK FOTO KEGIATAN (URL GAMBAR)
                  </label>
                  <input
                    type="text"
                    value={linkFoto}
                    onChange={(e) => setLinkFoto(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau link foto online"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    LINK BERKAS / GOOGLE DRIVE MATERI
                  </label>
                  <input
                    type="text"
                    value={linkDokumen}
                    onChange={(e) => setLinkDokumen(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Touchscreen Signature Pad */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  TANDA TANGAN KOORDINATOR KEGIATAN (TOUCHSCREEN HP / LAPTOP)
                </label>
                <TouchSignaturePad
                  initialSignature={formSignature}
                  signerName={namaKoordinator || 'Koordinator'}
                  signerTitle={jabatanKoordinator || 'Tim Sahabat SPANJU'}
                  compact={true}
                  onSave={(dataUrl) => setFormSignature(dataUrl)}
                  title="TTD Koordinator Kegiatan"
                />
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md btn-3d"
                >
                  Simpan Arsip Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signature Modal for Cards */}
      {signingRecord && (
        <TouchSignatureModal
          isOpen={true}
          onClose={() => setSigningRecord(null)}
          title={`Tanda Tangan Arsip - ${signingRecord.kodeArsip}`}
          subtitle={`Koordinator: ${signingRecord.namaKoordinator || 'Tim Sahabat SPANJU'}`}
          initialSignature={signingRecord.tandaTanganKoordinator}
          signerName={signingRecord.namaKoordinator || 'Koordinator Pelaksana'}
          signerTitle={signingRecord.jabatanKoordinator || 'Tim SPANJU'}
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
              ? `LEMBAR LAPORAN DOKUMENTASI KEGIATAN RESMI`
              : 'REKAPITULASI DOKUMENTASI ARSIP KEGIATAN SAHABAT SPANJU'
          }
          nomorSurat={
            selectedForPrint
              ? `421.3 / ${selectedForPrint.kodeArsip} / 101.4.7 / 2026`
              : '421.3 / REKAP-ARSIP-SPANJU / 101.4.7 / 2026'
          }
          firstSignerRole={selectedForPrint?.jabatanKoordinator || 'Koordinator Pelaksana Kegiatan'}
          firstSignerName={selectedForPrint?.namaKoordinator || 'Koordinator SPANJU'}
          firstSignerSignature={
            selectedForPrint?.tandaTanganKoordinator || records[0]?.tandaTanganKoordinator
          }
          onFirstSignerUpdate={(sig) => {
            if (selectedForPrint && onUpdateRecord) {
              onUpdateRecord({ ...selectedForPrint, tandaTanganKoordinator: sig });
            }
          }}
          secondSignerRole="Kepala UPTD SMP Negeri 7 Pasuruan"
          secondSignerName="Drs. Akhmad Fauzi, M.Pd."
        >
          {selectedForPrint ? (
            <div className="space-y-4 text-xs text-slate-800">
              <table className="w-full border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50 w-1/3">Kode Berkas Arsip</td>
                    <td className="p-2.5 font-mono font-bold text-amber-900">{selectedForPrint.kodeArsip}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50">Nama Kegiatan</td>
                    <td className="p-2.5 font-bold text-slate-900">{selectedForPrint.namaKegiatan}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50">Kategori & Sasaran</td>
                    <td className="p-2.5">{selectedForPrint.kategori} &bull; {selectedForPrint.sasaranPeserta} ({selectedForPrint.jumlahPeserta} Peserta)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50">Waktu & Lokasi</td>
                    <td className="p-2.5">{selectedForPrint.hariTanggal} ({selectedForPrint.waktu}) &bull; {selectedForPrint.tempat}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50 align-top">Deskripsi Kegiatan</td>
                    <td className="p-2.5 leading-relaxed text-slate-700">{selectedForPrint.deskripsiKegiatan}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50 align-top">Hasil Notulensi</td>
                    <td className="p-2.5 leading-relaxed text-slate-700">{selectedForPrint.hasilNotulensi}</td>
                  </tr>
                </tbody>
              </table>

              {/* Foto Dokumentasi Cetak */}
              {selectedForPrint.linkFoto && (
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
                  <span className="font-bold text-slate-700 block text-[11px] mb-2">
                    DOKUMENTASI FOTO PELAKSANAAN KEGIATAN:
                  </span>
                  <img
                    src={selectedForPrint.linkFoto}
                    alt={selectedForPrint.namaKegiatan}
                    className="max-h-56 mx-auto rounded-lg object-cover shadow-xs border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    Dokumentasi resmi tersimpan di repositori Sahabat SPANJU UPTD SMP Negeri 7 Pasuruan.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Rekapitulasi seluruh arsip kegiatan program Sahabat SPANJU di lingkungan UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-amber-100/70 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Kode & Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-left">Nama Kegiatan</th>
                    <th className="p-2 border-r border-slate-300 text-left">Kategori & Lokasi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Peserta</th>
                    <th className="p-2 text-center w-20">Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-[10px]">
                        <span className="font-bold block text-amber-800">{item.kodeArsip}</span>
                        <span>{item.hariTanggal}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 font-medium text-slate-800">
                        {item.namaKegiatan}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">
                        <span className="block font-semibold text-slate-700">{item.kategori}</span>
                        <span className="text-[10px] text-slate-500">{item.tempat}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-amber-800">
                        {item.jumlahPeserta}
                      </td>
                      <td className="p-2 text-center text-[10px] text-emerald-700 font-bold">
                        Tervalidasi
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
              placeholder="Cari judul kegiatan, kode arsip, tempat..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="semua">Semua Kategori ({records.length})</option>
              <option value="Sosialisasi Anti-Bullying">Sosialisasi Anti-Bullying</option>
              <option value="Pelatihan Duta Sahabat">Pelatihan Duta Sahabat</option>
              <option value="Deklarasi Damai">Deklarasi Damai</option>
              <option value="Workshop Literasi Positif">Workshop Literasi Positif</option>
              <option value="Ice Breaking & Senam Ramah">Ice Breaking & Senam Ramah</option>
              <option value="Monitoring & Evaluasi">Monitoring & Evaluasi</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                id={`card-arsip-${item.id}`}
                className="rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-xs card-3d overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Thumbnail */}
                  {item.linkFoto && (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 border-b border-slate-100 group">
                      <img
                        src={item.linkFoto}
                        alt={item.namaKegiatan}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-end p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                          {item.kategori}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {item.kodeArsip}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-800 mt-1.5 leading-snug">
                          {item.namaKegiatan}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedForPrint(item);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition"
                          title="Cetak Berkas Kop Surat"
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

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item.hariTanggal}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item.waktu}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item.tempat}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {item.jumlahPeserta} Peserta ({item.sasaranPeserta})
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {item.deskripsiKegiatan}
                    </p>

                    {/* Accordion Detail Notulensi */}
                    <div className="border-t border-slate-100 pt-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-between text-[11px] font-bold text-amber-800 hover:text-amber-900"
                      >
                        <span>Lihat Notulensi & Dampak Kegiatan</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                          <div>
                            <span className="font-bold text-slate-700 block text-[10px] uppercase">
                              Hasil Notulensi:
                            </span>
                            <p className="text-slate-600 mt-0.5 leading-relaxed">{item.hasilNotulensi}</p>
                          </div>
                          <div className="pt-1 border-t border-slate-200 flex flex-wrap gap-2">
                            {item.linkDokumen && (
                              <a
                                href={item.linkDokumen}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> Berkas Drive Materi
                              </a>
                            )}
                            <span className="text-[10px] text-slate-500">
                              Penyelenggara: {item.penyelenggara}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Signature Box */}
                <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.tandaTanganKoordinator ? (
                      <div className="h-9 px-2 bg-white rounded border border-slate-200 flex items-center shadow-2xs">
                        <img
                          src={item.tandaTanganKoordinator}
                          alt="TTD"
                          className="h-7 max-w-[70px] object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Belum TTD</span>
                    )}
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 block leading-tight">
                        {item.namaKoordinator || 'Koordinator'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.jabatanKoordinator || 'Tim SPANJU'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSigningRecord(item)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center gap-1 transition"
                  >
                    <FileSignature className="w-3 h-3" />
                    {item.tandaTanganKoordinator ? 'Ubah TTD' : 'TTD Layar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
