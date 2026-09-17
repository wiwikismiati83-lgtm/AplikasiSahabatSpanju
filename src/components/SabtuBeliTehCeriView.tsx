import React, { useState } from 'react';
import {
  Coffee,
  Plus,
  Clock,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Printer,
  X,
  Lightbulb,
  FileSignature,
  FileText,
  Layers,
} from 'lucide-react';
import { SabtuBeliTehCeriRecord } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';

interface Props {
  records: SabtuBeliTehCeriRecord[];
  onAddRecord: (record: SabtuBeliTehCeriRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: SabtuBeliTehCeriRecord) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const SabtuBeliTehCeriView: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
  onOpenMenu,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<SabtuBeliTehCeriRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<SabtuBeliTehCeriRecord | null>(null);

  // Form states
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktu, setWaktu] = useState('09:00 - 11:30 WIB');
  const [hasilTemuanSatuMinggu, setHasilTemuanSatuMinggu] = useState('');
  const [evaluasiKegiatan, setEvaluasiKegiatan] = useState('');
  const [rencanaInovasi, setRencanaInovasi] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [formSignature, setFormSignature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hariTanggal.trim() || !hasilTemuanSatuMinggu.trim()) return;

    const newRecord: SabtuBeliTehCeriRecord = {
      id: `ceri-${Date.now()}`,
      hariTanggal: hariTanggal.trim(),
      waktu: waktu.trim() || '09:00 - 11:30 WIB',
      hasilTemuanSatuMinggu: hasilTemuanSatuMinggu.trim(),
      evaluasiKegiatan: evaluasiKegiatan.trim(),
      rencanaInovasi: rencanaInovasi.trim(),
      linkFoto: linkFoto.trim() || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      keterangan: keterangan.trim(),
      tandaTanganUrl: formSignature || undefined,
      namaPenandatangan: 'Koordinator Sabtu Beli Teh Ceri',
      jabatanPenandatangan: 'Tim Pengembang Karakter Siswa',
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowAddModal(false);
    // Reset
    setHariTanggal('');
    setHasilTemuanSatuMinggu('');
    setEvaluasiKegiatan('');
    setRencanaInovasi('');
    setLinkFoto('');
    setKeterangan('');
    setFormSignature('');
  };

  const handleCardSignatureSave = (signatureUrl: string, name?: string, title?: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: SabtuBeliTehCeriRecord = {
      ...signingRecord,
      tandaTanganUrl: signatureUrl,
      namaPenandatangan: name || signingRecord.namaPenandatangan || 'Koordinator Sesi Ceri',
      jabatanPenandatangan: title || signingRecord.jabatanPenandatangan || 'Penanggung Jawab Mingguan',
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  return (
    <div id="view-sabtu-beli-teh-ceri" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-100/80 via-orange-50/70 to-white border border-amber-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2 shadow-2xs">
            <Coffee className="w-4 h-4 text-amber-700" />
            PROGRAM UNGGULAN MINGGUAN SAHABAT SPANJU
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            SABTU BELI TEH CERI
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            (Sabtu Bersama Mengulik Temuan Harian Cerita dan Ide) — Refleksi mingguan konseling sebaya, aspirasi siswa, dan ide kreatif ramah anak
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
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            Cetak Kop Surat Resmi
          </button>
          <button
            id="btn-tambah-ceri"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20 hover:from-amber-500 hover:to-orange-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Input Temuan & Ide Ceri
          </button>
        </div>
      </div>

      {/* Modal Add */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Form Sabtu Beli Teh Ceri</h2>
                  <p className="text-xs text-slate-500">Sabtu Bersama Mengulik Temuan Harian Cerita dan Ide</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
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
                    placeholder="Contoh: Sabtu, 19 September 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
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
                    placeholder="09:00 - 11:30 WIB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  HASIL TEMUAN 1 MINGGU <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={hasilTemuanSatuMinggu}
                  onChange={(e) => setHasilTemuanSatuMinggu(e.target.value)}
                  placeholder="Rangkuman curhat siswa, dinamika pertemanan antarkelas, atau potensi perselisihan selama satu pekan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  EVALUASI KEGIATAN
                </label>
                <textarea
                  rows={2}
                  value={evaluasiKegiatan}
                  onChange={(e) => setEvaluasiKegiatan(e.target.value)}
                  placeholder="Efektivitas diskusi konseling sebaya & respons siswa..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  RENCANA INOVASI / KEGIATAN
                </label>
                <textarea
                  rows={2}
                  value={rencanaInovasi}
                  onChange={(e) => setRencanaInovasi(e.target.value)}
                  placeholder="Gagasan baru atau program intervensi kreatif pekan depan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
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
                  placeholder="https://... foto sesi diskusi atau kegiatan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
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
                  placeholder="Daftar peserta yang hadir / catatan khusus..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Tanda Tangan Touchscreen Langsung */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TANDA TANGAN KOORDINATOR (LAYAR SENTUH / LAPTOP)
                </label>
                <TouchSignaturePad
                  initialSignature={formSignature}
                  signerName="Koordinator Sesi Ceri"
                  signerTitle="Tim Pengembang Karakter"
                  compact={true}
                  onSave={(dataUrl) => {
                    setFormSignature(dataUrl);
                    alert('Tanda tangan berhasil direkam!');
                  }}
                  title="Tanda Tangan Penanggung Jawab Mingguan"
                  promptText="Goreskan tanda tangan menggunakan sentuhan jari HP atau mouse laptop:"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md btn-3d"
                >
                  Simpan Sesi Ceri
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
          title={`Tanda Tangan Sesi Ceri - ${signingRecord.hariTanggal}`}
          subtitle="Goreskan jari di HP atau gerakkan mouse laptop"
          initialSignature={signingRecord.tandaTanganUrl}
          signerName={signingRecord.namaPenandatangan || 'Koordinator Sesi Ceri'}
          signerTitle={signingRecord.jabatanPenandatangan || 'Penanggung Jawab Mingguan'}
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
              ? `LAPORAN MINGGUAN SABTU BELI TEH CERI - ${selectedForPrint.hariTanggal.toUpperCase()}`
              : 'REKAPITULASI PROGRAM MINGGUAN SABTU BELI TEH CERI'
          }
          nomorSurat={`421.3 / CERI-${Math.floor(100 + Math.random() * 900)} / 101.4.7 / 2026`}
          firstSignerRole="Koordinator Program Sesi Ceri"
          firstSignerName={selectedForPrint?.namaPenandatangan || 'Tim Konseling Sebaya SPANJU'}
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
                    <td className="p-2.5 font-bold bg-amber-50/50 w-1/3">Hari / Tanggal & Waktu</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.hariTanggal} ({selectedForPrint.waktu})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50 align-top">Hasil Temuan 1 Minggu</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed">{selectedForPrint.hasilTemuanSatuMinggu}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50 align-top">Evaluasi Kegiatan</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.evaluasiKegiatan || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-amber-50/50 align-top">Rencana Inovasi / Kegiatan</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.rencanaInovasi || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-amber-50/50">Keterangan / Peserta</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.keterangan || '-'}</td>
                  </tr>
                </tbody>
              </table>

              {selectedForPrint.linkFoto && (
                <div className="mt-4 border border-slate-200 rounded-lg p-2 text-center bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-600 mb-2 uppercase">Dokumentasi Foto Sesi Ceri:</p>
                  <img
                    src={selectedForPrint.linkFoto}
                    alt="Foto Dokumentasi"
                    className="max-h-52 mx-auto object-cover rounded-md border border-slate-300"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Laporan pelaksanaan agenda refleksi mingguan <strong>Sabtu Beli Teh Ceri</strong> (Sabtu Bersama Mengulik Temuan Harian Cerita dan Ide) di UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-amber-100/70 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hari / Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hasil Temuan 1 Minggu</th>
                    <th className="p-2 border-r border-slate-300 text-left">Evaluasi</th>
                    <th className="p-2 border-r border-slate-300 text-left">Rencana Inovasi</th>
                    <th className="p-2 text-center w-20">TTD</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">
                        {item.hariTanggal}
                        <span className="block text-[10px] text-slate-500">{item.waktu}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{item.hasilTemuanSatuMinggu}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{item.evaluasiKegiatan}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{item.rencanaInovasi}</td>
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
            id={`card-ceri-${item.id}`}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/50 to-white border border-slate-200 hover:border-amber-300 shadow-xs card-3d space-y-4"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  SESI MINGGUAN CERI SPANJU
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">{item.hariTanggal}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> {item.waktu}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedForPrint(item);
                    setShowPrintModal(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition"
                  title="Cetak Kop Surat Lembar Ini"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  HASIL TEMUAN 1 MINGGU:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.hasilTemuanSatuMinggu}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-1">
                  EVALUASI KEGIATAN:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.evaluasiKegiatan || '-'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-emerald-700" /> RENCANA INOVASI / KEGIATAN:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{item.rencanaInovasi || '-'}</p>
              </div>
            </div>

            {item.linkFoto && (
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-amber-600" /> LINK FOTO KEGIATAN:
                </span>
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 max-h-48 bg-slate-100">
                  <img
                    src={item.linkFoto}
                    alt="Foto Sesi Teh Ceri"
                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <a
                    href={item.linkFoto}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] flex items-center gap-1 hover:bg-slate-900 font-semibold backdrop-blur-xs"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Gambar Asli
                  </a>
                </div>
              </div>
            )}

            {item.keterangan && (
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800">Keterangan:</span> {item.keterangan}
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
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> TTD Terverifikasi
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">
                    Belum ada tanda tangan
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSigningRecord(item)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1 transition active:scale-95 shadow-2xs"
              >
                <FileSignature className="w-3.5 h-3.5 text-amber-700" />
                {item.tandaTanganUrl ? 'Ubah TTD' : 'TTD Touchscreen'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
