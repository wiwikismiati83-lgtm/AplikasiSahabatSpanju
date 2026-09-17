import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  Trash2,
  Calendar,
  CheckCircle,
  Table,
  Lightbulb,
  Palette,
  AlertCircle,
  X,
  Printer,
  FileSignature,
  FileText,
} from 'lucide-react';
import { KebunLuasBerseriRecord, RtlItem } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';

interface Props {
  records: KebunLuasBerseriRecord[];
  onAddRecord: (record: KebunLuasBerseriRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: KebunLuasBerseriRecord) => void;
  canDelete?: boolean;
}

export const KebunLuasBerseriView: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<KebunLuasBerseriRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<KebunLuasBerseriRecord | null>(null);

  // Form states
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktu, setWaktu] = useState('13:00 - 15:30 WIB');
  const [evaluasiProgramTerlaksana, setEvaluasiProgramTerlaksana] = useState('');
  const [evaluasiKendalaSolusi, setEvaluasiKendalaSolusi] = useState('');
  const [hasilInovasi, setHasilInovasi] = useState('');
  const [produkKreatif, setProdukKreatif] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [formSignature, setFormSignature] = useState('');

  // RTL table items
  const [rtlList, setRtlList] = useState<RtlItem[]>([
    { id: '1', pic: '', targetPelaksanaan: '', deadline: '' },
  ]);

  const addRtlRow = () => {
    setRtlList([...rtlList, { id: `${Date.now()}`, pic: '', targetPelaksanaan: '', deadline: '' }]);
  };

  const removeRtlRow = (id: string) => {
    if (rtlList.length > 1) {
      setRtlList(rtlList.filter((item) => item.id !== id));
    }
  };

  const updateRtl = (id: string, field: keyof RtlItem, value: string) => {
    setRtlList(rtlList.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hariTanggal.trim() || !evaluasiProgramTerlaksana.trim()) return;

    const newRecord: KebunLuasBerseriRecord = {
      id: `kebun-${Date.now()}`,
      hariTanggal: hariTanggal.trim(),
      waktu: waktu.trim() || '13:00 - 15:30 WIB',
      evaluasiProgramTerlaksana: evaluasiProgramTerlaksana.trim(),
      evaluasiKendalaSolusi: evaluasiKendalaSolusi.trim(),
      hasilInovasi: hasilInovasi.trim(),
      produkKreatif: produkKreatif.trim(),
      rencanaTindakLanjut: rtlList.filter((r) => r.pic.trim() || r.targetPelaksanaan.trim()),
      keterangan: keterangan.trim(),
      tandaTanganUrl: formSignature || undefined,
      namaPenandatangan: 'Ketua Tim Inovasi Ramah Anak',
      jabatanPenandatangan: 'Koordinator Kebun Luas Berseri',
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowModal(false);
    // Reset
    setHariTanggal('');
    setEvaluasiProgramTerlaksana('');
    setEvaluasiKendalaSolusi('');
    setHasilInovasi('');
    setProdukKreatif('');
    setKeterangan('');
    setFormSignature('');
    setRtlList([{ id: '1', pic: '', targetPelaksanaan: '', deadline: '' }]);
  };

  const handleCardSignatureSave = (signatureUrl: string, name?: string, title?: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: KebunLuasBerseriRecord = {
      ...signingRecord,
      tandaTanganUrl: signatureUrl,
      namaPenandatangan: name || signingRecord.namaPenandatangan || 'Ketua Tim Inovasi',
      jabatanPenandatangan: title || signingRecord.jabatanPenandatangan || 'Koordinator Program Bulanan',
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  return (
    <div id="view-kebun-luas-berseri" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-100/80 via-emerald-50/70 to-white border border-teal-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300 mb-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-teal-700" />
            KEGIATAN BULANAN SAHABAT SPANJU
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            KEBUN LUAS BERSERI
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            (Kegiatan Bulanan Evaluasi, Berinovasi dan Kreatif) — Forum evaluasi mutu program ramah anak, penetapan inovasi bulanan, produk kreatif & Rencana Tindak Lanjut (RTL)
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
            <Printer className="w-3.5 h-3.5 text-teal-600" />
            Cetak Kop Surat Resmi
          </button>
          <button
            id="btn-tambah-kebun"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 hover:from-teal-500 hover:to-emerald-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Input Rapat Kebun Luas
          </button>
        </div>
      </div>

      {/* Modal Add Kebun Luas Berseri */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/70 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800 border border-teal-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Formulir KEBUN LUAS BERSERI</h2>
                  <p className="text-xs text-slate-500">Evaluasi, Berinovasi dan Kreatif (Bulanan)</p>
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
                    placeholder="Contoh: Rabu, 30 September 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WAKTU PELAKSANAAN
                  </label>
                  <input
                    type="text"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    placeholder="13:00 - 15:30 WIB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. EVALUASI PROGRAM YANG TELAH TERLAKSANA <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={evaluasiProgramTerlaksana}
                  onChange={(e) => setEvaluasiProgramTerlaksana(e.target.value)}
                  placeholder="Ketercapaian program piket, sesi ceri, dan respon warga sekolah selama sebulan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. KENDALA YANG DIHADAPI DAN SOLUSINYA
                </label>
                <textarea
                  rows={2}
                  value={evaluasiKendalaSolusi}
                  onChange={(e) => setEvaluasiKendalaSolusi(e.target.value)}
                  placeholder="Hambatan operasional dan alternatif penyelesaian yang disepakati..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. HASIL INOVASI BULANAN
                  </label>
                  <textarea
                    rows={2}
                    value={hasilInovasi}
                    onChange={(e) => setHasilInovasi(e.target.value)}
                    placeholder="Inovasi model edukasi, metode pendampingan teman sebaya..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4. PRODUK KREATIF YANG DIHASILKAN
                  </label>
                  <textarea
                    rows={2}
                    value={produkKreatif}
                    onChange={(e) => setProdukKreatif(e.target.value)}
                    placeholder="Poster infografis, video kampanye, mading karakter, dsb..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* RTL Table */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-teal-600" />
                    5. RENCANA TINDAK LANJUT (RTL)
                  </span>
                  <button
                    type="button"
                    onClick={addRtlRow}
                    className="px-2.5 py-1 text-[11px] font-bold bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200 transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah Baris RTL
                  </button>
                </div>

                <div className="space-y-2">
                  {rtlList.map((row, idx) => (
                    <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="PIC / Penanggung Jawab"
                          value={row.pic}
                          onChange={(e) => updateRtl(row.id, 'pic', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Target Pelaksanaan / Aksi"
                          value={row.targetPelaksanaan}
                          onChange={(e) => updateRtl(row.id, 'targetPelaksanaan', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Deadline"
                          value={row.deadline}
                          onChange={(e) => updateRtl(row.id, 'deadline', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeRtlRow(row.id)}
                          disabled={rtlList.length <= 1}
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KETERANGAN / PESERTA RAPAT
                </label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Daftar guru pembina & perwakilan siswa yang hadir..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Tanda Tangan Touchscreen Langsung */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TANDA TANGAN KETUA TIM INOVASI (LAYAR SENTUH / LAPTOP)
                </label>
                <TouchSignaturePad
                  initialSignature={formSignature}
                  signerName="Ketua Tim Kebun Luas Berseri"
                  signerTitle="Koordinator Inovasi Sekolah"
                  compact={true}
                  onSave={(dataUrl) => {
                    setFormSignature(dataUrl);
                    alert('Tanda tangan berhasil direkam!');
                  }}
                  title="Tanda Tangan Pengesahan Rapat Bulanan"
                  promptText="Sentuh layar HP dengan jari atau gerakkan mouse laptop:"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md btn-3d"
                >
                  Simpan Notulen Kebun Luas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Touchscreen Signature Modal for Existing Card */}
      {signingRecord && (
        <TouchSignatureModal
          isOpen={true}
          onClose={() => setSigningRecord(null)}
          title={`Tanda Tangan Rapat Kebun Luas - ${signingRecord.hariTanggal}`}
          subtitle="Goreskan jari di HP atau gerakkan mouse laptop"
          initialSignature={signingRecord.tandaTanganUrl}
          signerName={signingRecord.namaPenandatangan || 'Ketua Tim Inovasi'}
          signerTitle={signingRecord.jabatanPenandatangan || 'Koordinator Program Bulanan'}
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
              ? `NOTULEN & EVALUASI KEBUN LUAS BERSERI - ${selectedForPrint.hariTanggal.toUpperCase()}`
              : 'REKAPITULASI PROGRAM EVALUASI & INOVASI KEBUN LUAS BERSERI'
          }
          nomorSurat={`421.3 / KBN-${Math.floor(100 + Math.random() * 900)} / 101.4.7 / 2026`}
          firstSignerRole="Ketua Tim Kebun Luas Berseri"
          firstSignerName={selectedForPrint?.namaPenandatangan || 'Koordinator Evaluasi & RTL'}
          firstSignerSignature={selectedForPrint?.tandaTanganUrl || records[0]?.tandaTanganUrl}
          onFirstSignerUpdate={(sig) => {
            if (selectedForPrint && onUpdateRecord) {
              onUpdateRecord({ ...selectedForPrint, tandaTanganUrl: sig });
            }
          }}
          secondSignerRole="Kepala UPTD SMP Negeri 7 Pasuruan"
          secondSignerName="Drs. Akhmad Fauzi, M.Pd."
        >
          {selectedForPrint ? (
            <div className="space-y-4">
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-teal-50/60 w-1/3">Hari / Tanggal & Waktu</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.hariTanggal} ({selectedForPrint.waktu})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-teal-50/60 align-top">Evaluasi Program Terlaksana</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed">{selectedForPrint.evaluasiProgramTerlaksana}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-teal-50/60 align-top">Kendala & Alternatif Solusi</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed">{selectedForPrint.evaluasiKendalaSolusi || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-teal-50/60 align-top">Hasil Inovasi Bulanan</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed">{selectedForPrint.hasilInovasi || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-teal-50/60 align-top">Produk Kreatif Dihasilkan</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.produkKreatif || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-teal-50/60">Keterangan / Kehadiran</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.keterangan || '-'}</td>
                  </tr>
                </tbody>
              </table>

              {selectedForPrint.rencanaTindakLanjut && selectedForPrint.rencanaTindakLanjut.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Matriks Rencana Tindak Lanjut (RTL):
                  </h4>
                  <table className="w-full text-xs border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-teal-100/70 border-b border-slate-300 font-bold text-slate-900">
                        <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                        <th className="p-2 border-r border-slate-300 text-left">PIC (Penanggung Jawab)</th>
                        <th className="p-2 border-r border-slate-300 text-left">Target Pelaksanaan</th>
                        <th className="p-2 text-center w-28">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedForPrint.rencanaTindakLanjut.map((rtl, i) => (
                        <tr key={rtl.id || i} className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200 text-center">{i + 1}</td>
                          <td className="p-2 border-r border-slate-200 font-semibold text-teal-900">{rtl.pic}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-800">{rtl.targetPelaksanaan}</td>
                          <td className="p-2 text-center text-slate-600 font-medium">{rtl.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Rekapitulasi pelaksanaan rapat evaluasi bulanan <strong>Kebun Luas Berseri</strong> (Kegiatan Bulanan Evaluasi, Berinovasi dan Kreatif) UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-teal-100/70 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hari / Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-left">Evaluasi Program</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hasil Inovasi</th>
                    <th className="p-2 border-r border-slate-300 text-left">Produk Kreatif</th>
                    <th className="p-2 text-center w-20">TTD</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">{item.hariTanggal}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{item.evaluasiProgramTerlaksana}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{item.hasilInovasi}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{item.produkKreatif}</td>
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

      {/* Cards List */}
      <div className="space-y-4">
        {records.map((item) => (
          <div
            key={item.id}
            id={`card-kebun-${item.id}`}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/50 to-white border border-slate-200 hover:border-teal-300 shadow-xs card-3d space-y-4"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                  RAPAT EVALUASI BULANAN KEBUN LUAS
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">{item.hariTanggal}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> {item.waktu}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedForPrint(item);
                    setShowPrintModal(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition"
                  title="Cetak Kop Surat Notulen Ini"
                >
                  <Printer className="w-4 h-4" />
                </button>
                {canDelete && (
                  <button
                    onClick={() => onDeleteRecord(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Hapus rekaman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  EVALUASI PROGRAM TERLAKSANA:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.evaluasiProgramTerlaksana}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> KENDALA & SOLUSI:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.evaluasiKendalaSolusi || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-teal-700" /> HASIL INOVASI:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.hasilInovasi || '-'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block mb-1 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-purple-700" /> PRODUK KREATIF:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.produkKreatif || '-'}</p>
              </div>
            </div>

            {/* RTL List Rendering */}
            {item.rencanaTindakLanjut && item.rencanaTindakLanjut.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block flex items-center gap-1">
                  <Table className="w-3.5 h-3.5 text-teal-600" /> RENCANA TINDAK LANJUT (RTL):
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-1">PIC</th>
                        <th className="pb-1">Target Pelaksanaan</th>
                        <th className="pb-1">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {item.rencanaTindakLanjut.map((rtl) => (
                        <tr key={rtl.id}>
                          <td className="py-1 font-bold text-teal-800">{rtl.pic}</td>
                          <td className="py-1 text-slate-700">{rtl.targetPelaksanaan}</td>
                          <td className="py-1 text-slate-500">{rtl.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> TTD Pengesahan Resmi
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">
                    Belum ada tanda tangan pengesahan
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSigningRecord(item)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center gap-1 transition active:scale-95 shadow-2xs"
              >
                <FileSignature className="w-3.5 h-3.5 text-teal-700" />
                {item.tandaTanganUrl ? 'Ubah TTD' : 'TTD Touchscreen'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
