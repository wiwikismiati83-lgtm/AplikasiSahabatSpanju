import React, { useState } from 'react';
import {
  CalendarCheck2,
  Plus,
  Clock,
  User,
  School,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Search,
  Printer,
  Trash2,
  ExternalLink,
  X,
  FileSignature,
  Download,
  Layers,
} from 'lucide-react';
import { PiketHarianRecord, Siswa } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';
import { StudentPickerModal } from './StudentPickerModal';

interface PiketHarianViewProps {
  records: PiketHarianRecord[];
  siswaList?: Siswa[];
  onAddRecord: (record: PiketHarianRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: PiketHarianRecord) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const PiketHarianView: React.FC<PiketHarianViewProps> = ({
  records,
  siswaList = [],
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
  onOpenMenu,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Official Report Modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState<PiketHarianRecord | null>(null);

  // Active Signer Modal for existing cards
  const [signingRecord, setSigningRecord] = useState<PiketHarianRecord | null>(null);

  // Form State
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktu, setWaktu] = useState('06:45 - 13:30 WIB');
  const [namaAnggota, setNamaAnggota] = useState('');
  const [kelas, setKelas] = useState('');
  const [hasilTemuan, setHasilTemuan] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [formSignature, setFormSignature] = useState<string>('');
  const [showPicker, setShowPicker] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hariTanggal.trim() || !namaAnggota.trim() || !hasilTemuan.trim()) return;

    const newRecord: PiketHarianRecord = {
      id: `piket-${Date.now()}`,
      hariTanggal: hariTanggal.trim(),
      waktu: waktu.trim() || '06:45 - 13:30 WIB',
      namaAnggota: namaAnggota.trim(),
      kelas: kelas.trim() || 'Semua Kelas',
      hasilTemuan: hasilTemuan.trim(),
      linkFoto: linkFoto.trim() || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      keterangan: keterangan.trim(),
      tandaTanganUrl: formSignature || undefined,
      namaPenandatangan: namaAnggota.trim(),
      nipPenandatangan: undefined, // Piket members are usually students or don't have NIP in this context
      jabatanPenandatangan: 'Petugas Piket Harian',
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowAddForm(false);
    // Reset
    setHariTanggal('');
    setNamaAnggota('');
    setHasilTemuan('');
    setLinkFoto('');
    setKeterangan('');
    setFormSignature('');
  };

  const handleCardSignatureSave = (signatureUrl: string, name?: string, title?: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: PiketHarianRecord = {
      ...signingRecord,
      tandaTanganUrl: signatureUrl,
      namaPenandatangan: name || signingRecord.namaAnggota,
      jabatanPenandatangan: title || signingRecord.jabatanPenandatangan || 'Petugas Piket',
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  const filtered = records.filter(
    (r) =>
      r.hariTanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hasilTemuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="view-piket-harian" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-100/80 via-sky-50/70 to-white border border-blue-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 mb-2 shadow-2xs">
            <CalendarCheck2 className="w-4 h-4 text-blue-700" />
            APLIKASI SAHABAT SPANJU
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Piket Harian Sahabat SPANJU
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Pencatatan rekapitulasi piket ketertiban, pembiasaan 5S, hasil temuan harian, dan tanda tangan touchscreen
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
              setSelectedRecordForPrint(null);
              setShowPrintModal(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Cetak Kop Surat Resmi
          </button>
          <button
            id="btn-tambah-piket"
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition active:scale-95 flex items-center gap-1.5 btn-3d btn-3d-blue"
          >
            <Plus className="w-4 h-4" />
            Input Piket Harian
          </button>
        </div>
      </div>

      {/* Modal Add Piket */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/60 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Form Input Piket Harian</h2>
                  <p className="text-xs text-slate-500">Lengkapi data piket dan bubuhkan tanda tangan langsung di layar</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    HARI / TANGGAL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hariTanggal}
                    onChange={(e) => setHariTanggal(e.target.value)}
                    placeholder="Contoh: Kamis, 17 September 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WAKTU
                  </label>
                  <input
                    type="text"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    placeholder="06:45 - 13:30 WIB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="w-full text-left group"
                >
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NAMA ANGGOTA HARIAN <span className="text-rose-500">*</span>
                  </label>
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold flex items-center justify-between group-hover:border-blue-500 transition">
                    <span className={namaAnggota ? 'text-slate-800' : 'text-slate-400 italic font-normal'}>
                      {namaAnggota || 'Klik untuk pilih petugas/siswa...'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="w-full text-left group"
                >
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    KELAS / LOKASI
                  </label>
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold flex items-center justify-between group-hover:border-blue-500 transition">
                    <span className={kelas ? 'text-slate-800' : 'text-slate-400 italic font-normal'}>
                      {kelas ? `KELAS ${kelas}` : 'Contoh: 8E / Area Kantin'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                  </div>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  HASIL TEMUAN HARIAN <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={hasilTemuan}
                  onChange={(e) => setHasilTemuan(e.target.value)}
                  placeholder="Catatan kedisiplinan, situasi kelas, interaksi siswa, atau pembiasaan ramah anak..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  LINK FOTO KEGIATAN (URL)
                </label>
                <input
                  type="text"
                  value={linkFoto}
                  onChange={(e) => setLinkFoto(e.target.value)}
                  placeholder="https://... (Foto pembiasaan piket atau aktivitas)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KETERANGAN
                </label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Catatan tambahan / rekomendasi tindak lanjut..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Tanda Tangan Touchscreen Langsung di Layar HP / Laptop */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TANDA TANGAN PETUGAS PIKET (LAYAR SENTUH / LAPTOP)
                </label>
                <TouchSignaturePad
                  initialSignature={formSignature}
                  signerName={namaAnggota}
                  signerTitle="Petugas Piket Harian"
                  compact={true}
                  onSave={(dataUrl) => {
                    setFormSignature(dataUrl);
                    alert('Tanda tangan berhasil direkam!');
                  }}
                  title="Tanda Tangan Petugas Piket"
                  promptText="Sentuh layar HP dengan jari atau gunakan mouse laptop:"
                />
                {formSignature && (
                  <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Tanda tangan digital telah terpasang untuk laporan ini.</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-3d btn-3d-blue"
                >
                  Simpan Laporan Piket
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
          title={`Tanda Tangan Piket - ${signingRecord.hariTanggal}`}
          subtitle={`Petugas: ${signingRecord.namaAnggota}`}
          initialSignature={signingRecord.tandaTanganUrl}
          signerName={signingRecord.namaAnggota}
          signerTitle="Petugas Piket Harian"
          onSave={handleCardSignatureSave}
        />
      )}

      {/* Official Print Modal with Kop Surat */}
      {showPrintModal && (
        <OfficialReportModal
          isOpen={true}
          onClose={() => setShowPrintModal(false)}
          title={
            selectedRecordForPrint
              ? `LAPORAN PIKET HARIAN - ${selectedRecordForPrint.hariTanggal.toUpperCase()}`
              : 'REKAPITULASI LAPORAN PIKET HARIAN TIM SAHABAT SPANJU'
          }
          nomorSurat={`421.3 / PKT-${Math.floor(100 + Math.random() * 900)} / 101.4.7 / 2026`}
          firstSignerRole="Koordinator Piket Sahabat SPANJU"
          firstSignerName={selectedRecordForPrint?.namaAnggota || 'Tim Piket Harian'}
          firstSignerNip={selectedRecordForPrint?.nipPenandatangan}
          firstSignerSignature={selectedRecordForPrint?.tandaTanganUrl || records[0]?.tandaTanganUrl}
          onFirstSignerUpdate={(sig) => {
            if (selectedRecordForPrint && onUpdateRecord) {
              onUpdateRecord({ ...selectedRecordForPrint, tandaTanganUrl: sig });
            }
          }}
          secondSignerRole="Kepala UPTD SMP Negeri 7 Pasuruan"
          secondSignerName="Nur Fadilah, S.Pd., M.Pd"
          secondSignerNip="19860410 201001 2 030"
        >
          {selectedRecordForPrint ? (
            /* Single record official document */
            <div className="space-y-4">
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 w-1/3">Hari / Tanggal</td>
                    <td className="p-2.5 text-slate-800">{selectedRecordForPrint.hariTanggal}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50">Waktu Pelaksanaan</td>
                    <td className="p-2.5 text-slate-800">{selectedRecordForPrint.waktu}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50">Petugas / Anggota Harian</td>
                    <td className="p-2.5 font-bold text-blue-900">{selectedRecordForPrint.namaAnggota}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50">Area / Sasaran Kelas</td>
                    <td className="p-2.5 text-slate-800">{selectedRecordForPrint.kelas}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 align-top">Hasil Temuan Harian</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed whitespace-pre-line">
                      {selectedRecordForPrint.hasilTemuan}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 align-top">Keterangan / Evaluasi</td>
                    <td className="p-2.5 text-slate-800">
                      {selectedRecordForPrint.keterangan || 'Situasi sekolah terpantau kondusif dan ramah anak.'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {selectedRecordForPrint.linkFoto && (
                <div className="mt-4 border border-slate-200 rounded-lg p-2 text-center bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-600 mb-2 uppercase">Dokumentasi Foto Kegiatan:</p>
                  <img
                    src={selectedRecordForPrint.linkFoto}
                    alt="Foto Dokumentasi"
                    className="max-h-52 mx-auto object-cover rounded-md border border-slate-300"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Rekapitulasi Table */
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Berikut adalah rekapitulasi data pelaksanaan piket harian ketertiban dan penguatan karakter ramah anak oleh Tim Sahabat SPANJU UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hari / Tanggal & Waktu</th>
                    <th className="p-2 border-r border-slate-300 text-left">Petugas Piket</th>
                    <th className="p-2 border-r border-slate-300 text-left">Kelas / Lokasi</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hasil Temuan Harian</th>
                    <th className="p-2 text-center w-20">Status TTD</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{i + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">
                        {r.hariTanggal}
                        <span className="block text-[10px] text-slate-500">{r.waktu}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-800">{r.namaAnggota}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{r.kelas}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{r.hasilTemuan}</td>
                      <td className="p-2 text-center">
                        {r.tandaTanganUrl ? (
                          <img
                            src={r.tandaTanganUrl}
                            alt="TTD"
                            className="h-7 mx-auto object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold">Terverifikasi</span>
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
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        siswaList={siswaList}
        title="Pilih Petugas Piket / Duta Siswa"
        onSelect={(siswa) => {
          setNamaAnggota(siswa.nama);
          setKelas(siswa.kelas);
        }}
      />

      {/* Search and List */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari tanggal, nama anggota piket, kelas..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-3">
            <span>Total Laporan: <strong className="text-slate-800">{filtered.length}</strong></span>
            <button
              onClick={() => {
                setSelectedRecordForPrint(null);
                setShowPrintModal(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> Pratinjau Rekap Kop Surat
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Belum ada data piket yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                id={`card-piket-${item.id}`}
                className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/50 to-white border border-slate-200 hover:border-blue-300 shadow-xs card-3d flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                        LAPORAN PIKET HARIAN
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mt-0.5">{item.hariTanggal}</h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-sky-600" /> {item.waktu}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 font-medium">
                          <School className="w-3 h-3 text-emerald-600" /> {item.kelas}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedRecordForPrint(item);
                          setShowPrintModal(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition"
                        title="Cetak Kop Surat Resmi Lembar Ini"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => onDeleteRecord(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-medium">
                        Nama Anggota Harian:
                      </span>
                      <span className="text-slate-800 font-bold flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {item.namaAnggota}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                        HASIL TEMUAN HARIAN:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">{item.hasilTemuan}</p>
                    </div>

                    {item.linkFoto && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block mb-1.5 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> FOTO DOKUMENTASI KEGIATAN
                        </span>
                        <div className="relative group overflow-hidden rounded-xl border border-slate-200 max-h-40 bg-slate-100">
                          <img
                            src={item.linkFoto}
                            alt="Foto kegiatan piket"
                            className="w-full h-32 object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <a
                            href={item.linkFoto}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-2 right-2 px-2 py-1 rounded bg-slate-900/80 text-white text-[10px] flex items-center gap-1 hover:bg-slate-900 backdrop-blur-xs font-semibold"
                          >
                            <ExternalLink className="w-2.5 h-2.5" /> Buka Foto
                          </a>
                        </div>
                      </div>
                    )}

                    {item.keterangan && (
                      <div className="pt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Keterangan:</span> {item.keterangan}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tanda Tangan Touchscreen Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
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
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> TTD Resmi
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Belum ada tanda tangan digital
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSigningRecord(item)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center gap-1 transition active:scale-95 shadow-2xs"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    {item.tandaTanganUrl ? 'Ubah TTD' : 'TTD Touchscreen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
