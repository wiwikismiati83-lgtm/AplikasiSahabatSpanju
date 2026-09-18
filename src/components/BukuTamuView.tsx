import React, { useState } from 'react';
import {
  BookOpenCheck,
  Plus,
  Clock,
  User,
  Building,
  Briefcase,
  IdCard,
  PenTool,
  Trash2,
  Printer,
  X,
  CheckCircle,
  FileSignature,
  FileText,
  Layers,
} from 'lucide-react';
import { BukuTamuRecord } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';
import { CalendarDatePicker, RealTimeTimePicker } from './DateTimeWidgets';

interface Props {
  records: BukuTamuRecord[];
  onAddRecord: (record: BukuTamuRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: BukuTamuRecord) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const BukuTamuView: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
  onOpenMenu,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<BukuTamuRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<BukuTamuRecord | null>(null);

  // Form states
  const [hariTanggal, setHariTanggal] = useState('');
  const [jamKedatangan, setJamKedatangan] = useState('08:30 WIB');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nipNik, setNipNik] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [instansiAsal, setInstansiAsal] = useState('');
  const [tujuanKunjungan, setTujuanKunjungan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [formSignature, setFormSignature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hariTanggal.trim() || !namaLengkap.trim() || !tujuanKunjungan.trim()) return;

    const newRecord: BukuTamuRecord = {
      id: `tamu-${Date.now()}`,
      hariTanggal: hariTanggal.trim(),
      jamKedatangan: jamKedatangan.trim() || '08:30 WIB',
      namaLengkap: namaLengkap.trim(),
      nipNik: nipNik.trim(),
      jabatan: jabatan.trim(),
      instansiAsal: instansiAsal.trim(),
      tujuanKunjungan: tujuanKunjungan.trim(),
      tandaTanganUrl: formSignature || undefined,
      tindakLanjut: tindakLanjut.trim(),
      keterangan: keterangan.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowModal(false);
    // Reset
    setHariTanggal('');
    setNamaLengkap('');
    setNipNik('');
    setJabatan('');
    setInstansiAsal('');
    setTujuanKunjungan('');
    setTindakLanjut('');
    setKeterangan('');
    setFormSignature('');
  };

  const handleCardSignatureSave = (signatureUrl: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: BukuTamuRecord = {
      ...signingRecord,
      tandaTanganUrl: signatureUrl,
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  return (
    <div id="view-buku-tamu" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-100/80 via-blue-50/70 to-white border border-sky-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300 mb-2 shadow-2xs">
            <BookOpenCheck className="w-4 h-4 text-sky-700" />
            REGISTER KEDATANGAN RESMI SPANJU
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            BUKU TAMU DIGITAL
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Pencatatan identitas tamu, maksud kedatangan, tanda tangan digital langsung di layar sentuh HP & laptop, dan laporan resmi Kop Surat
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
            onClick={() => {
              setSelectedForPrint(null);
              setShowPrintModal(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-sky-600" />
            Cetak Kop Surat Resmi
          </button>
          <button
            id="btn-tambah-tamu"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-500 hover:to-blue-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Isi Buku Tamu
          </button>
        </div>
      </div>

      {/* Modal Add Guest */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/70 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Buku Tamu Digital SMPN 7 Pasuruan</h2>
                  <p className="text-xs text-slate-500">Silakan lengkapi identitas dan bubuhkan tanda tangan di layar</p>
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
              {/* WAKTU KUNJUNGAN */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                  WAKTU KUNJUNGAN:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CalendarDatePicker
                    value={hariTanggal}
                    onChange={setHariTanggal}
                    required
                  />
                  <RealTimeTimePicker
                    value={jamKedatangan}
                    onChange={setJamKedatangan}
                    label="JAM KEDATANGAN"
                  />
                </div>
              </div>

              {/* IDENTITAS TAMU */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                  IDENTITAS TAMU:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NAMA LENGKAP <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Nama lengkap beserta gelar"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIP / NIK
                    </label>
                    <input
                      type="text"
                      value={nipNik}
                      onChange={(e) => setNipNik(e.target.value)}
                      placeholder="Nomor identitas pegawai / KTP"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      JABATAN
                    </label>
                    <input
                      type="text"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      placeholder="Misal: Pengawas Sekolah / Narasumber"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      INSTANSI / LEMBAGA ASAL
                    </label>
                    <input
                      type="text"
                      value={instansiAsal}
                      onChange={(e) => setInstansiAsal(e.target.value)}
                      placeholder="Dinas Pendidikan / Yayasan / Komite"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* TUJUAN / MAKSUD KUNJUNGAN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TUJUAN / MAKSUD KUNJUNGAN <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={tujuanKunjungan}
                  onChange={(e) => setTujuanKunjungan(e.target.value)}
                  placeholder="Deskripsikan maksud kedatangan ke SMPN 7 Pasuruan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Touchscreen Signature Pad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TANDA TANGAN TAMU (LAYAR SENTUH HP / MOUSE LAPTOP)
                </label>
                <TouchSignaturePad
                  initialSignature={formSignature}
                  signerName={namaLengkap || 'Tamu Terhormat'}
                  signerTitle={jabatan || instansiAsal || 'Tamu Kedinasan'}
                  compact={true}
                  onSave={(dataUrl) => {
                    setFormSignature(dataUrl);
                    alert('Tanda tangan tamu berhasil direkam!');
                  }}
                  title="Tanda Tangan Kehadiran Tamu"
                  promptText="Sentuh layar HP dengan jari atau gerakkan mouse laptop:"
                />
              </div>

              {/* TINDAK LANJUT & KETERANGAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    TINDAK LANJUT (Follow-up)
                  </label>
                  <input
                    type="text"
                    value={tindakLanjut}
                    onChange={(e) => setTindakLanjut(e.target.value)}
                    placeholder="Hasil koordinasi / kesepakatan tindak lanjut"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    KETERANGAN
                  </label>
                  <input
                    type="text"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Diterima oleh Kepala Sekolah / Humas"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-sky-500 focus:outline-none"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md btn-3d"
                >
                  Simpan Buku Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signature Modal for Existing Guest Card */}
      {signingRecord && (
        <TouchSignatureModal
          isOpen={true}
          onClose={() => setSigningRecord(null)}
          title={`Tanda Tangan Tamu - ${signingRecord.namaLengkap}`}
          subtitle="Sentuh layar HP dengan jari atau gerakkan mouse laptop"
          initialSignature={signingRecord.tandaTanganUrl}
          signerName={signingRecord.namaLengkap}
          signerTitle={signingRecord.jabatan || signingRecord.instansiAsal || 'Tamu Kedinasan'}
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
              ? 'LEMBAR KUNJUNGAN TAMU RESMI'
              : 'REKAPITULASI BUKU TAMU & KUNJUNGAN KEDINASAN'
          }
          nomorSurat={`421.3 / TAMU-${Math.floor(100 + Math.random() * 900)} / 101.4.7 / 2026`}
          firstSignerRole={selectedForPrint?.jabatan || 'Tamu / Pejabat Terkait'}
          firstSignerName={selectedForPrint?.namaLengkap || 'Perwakilan Tamu'}
          firstSignerNip={selectedForPrint?.nipNik}
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
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-sky-50/50 w-1/3">Hari / Tanggal & Jam</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.hariTanggal} (Pukul {selectedForPrint.jamKedatangan})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-sky-50/50">Nama Lengkap Tamu</td>
                    <td className="p-2.5 font-bold text-slate-900">{selectedForPrint.namaLengkap}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-sky-50/50">NIP / NIK</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.nipNik || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-sky-50/50">Jabatan & Instansi Asal</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.jabatan || '-'} &bull; {selectedForPrint.instansiAsal}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-sky-50/50 align-top">Tujuan / Maksud Kunjungan</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed">{selectedForPrint.tujuanKunjungan}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-sky-50/50">Tindak Lanjut (Follow-up)</td>
                    <td className="p-2.5 text-slate-800 font-semibold text-teal-800">{selectedForPrint.tindakLanjut || 'Telah diterima dengan baik.'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-sky-50/50">Keterangan Penerimaan</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.keterangan || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Rekapitulasi kunjungan kedinasan dan tamu di lingkungan UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-sky-100/70 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hari / Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-left">Nama Tamu & Instansi</th>
                    <th className="p-2 border-r border-slate-300 text-left">Maksud Kunjungan</th>
                    <th className="p-2 text-center w-20">TTD Tamu</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">
                        {item.hariTanggal}
                        <span className="block text-[10px] text-slate-500">{item.jamKedatangan}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-800">
                        <span className="font-bold block">{item.namaLengkap}</span>
                        <span className="text-[10px] text-slate-500">{item.jabatan} - {item.instansiAsal}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{item.tujuanKunjungan}</td>
                      <td className="p-2 text-center">
                        {item.tandaTanganUrl ? (
                          <img
                            src={item.tandaTanganUrl}
                            alt="TTD"
                            className="h-7 mx-auto object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Arsip</span>
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

      {/* Guest Log Cards */}
      <div className="space-y-4">
        {records.map((item) => (
          <div
            key={item.id}
            id={`card-tamu-${item.id}`}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/60 to-white border border-slate-200 hover:border-sky-300 shadow-xs card-3d space-y-4"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                  REGISTRASI KUNJUNGAN TAMU
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">{item.namaLengkap}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                  <span className="font-semibold text-sky-700">{item.jabatan || 'Tamu Kedinasan'}</span>
                  <span>&bull;</span>
                  <span className="text-slate-700">{item.instansiAsal}</span>
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedForPrint(item);
                    setShowPrintModal(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition"
                  title="Cetak Kop Surat Lembar Ini"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  WAKTU KUNJUNGAN:
                </span>
                <p className="text-slate-800 font-bold">{item.hariTanggal}</p>
                <p className="text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                  <Clock className="w-3 h-3 text-sky-600" /> Pukul {item.jamKedatangan}
                </p>
                {item.nipNik && (
                  <p className="text-slate-600 mt-1">
                    <span className="text-slate-400">NIP/NIK:</span> {item.nipNik}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  TUJUAN / MAKSUD KUNJUNGAN:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.tujuanKunjungan}</p>
              </div>
            </div>

            {/* Signature and Follow-up Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-600 block text-[11px] mb-1">
                  TINDAK LANJUT (Follow-up):
                </span>
                <span className="text-teal-700 font-semibold">{item.tindakLanjut || 'Telah diterima dengan baik.'}</span>
                {item.keterangan && (
                  <p className="text-slate-600 mt-1.5 text-[11px]">
                    <span className="text-slate-400">Keterangan:</span> {item.keterangan}
                  </p>
                )}
              </div>

              {/* Digital Signature Display & Touchscreen Sign Button */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-600 block text-[11px]">
                    TANDA TANGAN TAMU:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSigningRecord(item)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 flex items-center gap-1 transition"
                  >
                    <FileSignature className="w-3 h-3" />
                    {item.tandaTanganUrl ? 'Ubah TTD' : 'TTD Layar'}
                  </button>
                </div>

                {item.tandaTanganUrl ? (
                  <div className="h-14 bg-white rounded-lg p-1.5 flex items-center justify-center border border-slate-200 shadow-2xs">
                    <img
                      src={item.tandaTanganUrl}
                      alt={`Tanda tangan ${item.namaLengkap}`}
                      className="max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-14 flex items-center justify-center text-[11px] text-slate-400 italic">
                    (Belum ada tanda tangan)
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
