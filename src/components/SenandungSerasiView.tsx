import React, { useState } from 'react';
import {
  Music2,
  Plus,
  Clock,
  Quote,
  Trash2,
  Copy,
  Check,
  Volume2,
  Sparkles,
  BookOpen,
  Printer,
  X,
  FileSignature,
  FileText,
  CheckCircle,
  Layers,
  Pencil,
  CheckCircle2,
} from 'lucide-react';
import { SenandungSerasiRecord } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';
import { CalendarDatePicker, RealTimeTimePicker } from './DateTimeWidgets';

interface Props {
  records: SenandungSerasiRecord[];
  onAddRecord: (record: SenandungSerasiRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: SenandungSerasiRecord) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const SenandungSerasiView: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
  onOpenMenu,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SenandungSerasiRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<SenandungSerasiRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<SenandungSerasiRecord | null>(null);

  // Form states
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktu, setWaktu] = useState('07:00 - 07:30 WIB');
  const [pesanDisampaikan, setPesanDisampaikan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [kategoriLiterasi, setKategoriLiterasi] = useState('Kata Mutiara & Budi Pekerti');
  const [isManualKategori, setIsManualKategori] = useState(false);
  const [manualKategoriText, setManualKategoriText] = useState('');
  const [penulis, setPenulis] = useState('Duta Literasi Sahabat SPANJU');
  const [formSignature, setFormSignature] = useState('');
  const [namaPenandatangan, setNamaPenandatangan] = useState('Wiwik Ismiati, S.Pd');
  const [nipPenandatangan, setNipPenandatangan] = useState('198311162009042003');

  const defaultKategoriOptions = [
    'Kata Mutiara & Budi Pekerti',
    'Salam Persahabatan & Empati',
    'Adab Bertutur & Santun Digital',
    'Puisi & Sastra Sahabat',
  ];

  const resetForm = () => {
    setEditingRecord(null);
    setHariTanggal('');
    setWaktu('07:00 - 07:30 WIB');
    setPesanDisampaikan('');
    setKeterangan('');
    setKategoriLiterasi('Kata Mutiara & Budi Pekerti');
    setIsManualKategori(false);
    setManualKategoriText('');
    setPenulis('Duta Literasi Sahabat SPANJU');
    setFormSignature('');
    setNamaPenandatangan('Wiwik Ismiati, S.Pd');
    setNipPenandatangan('198311162009042003');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (rec: SenandungSerasiRecord) => {
    setEditingRecord(rec);
    setHariTanggal(rec.hariTanggal);
    setWaktu(rec.waktu || '07:00 - 07:30 WIB');
    setPesanDisampaikan(rec.pesanDisampaikan);
    setKeterangan(rec.keterangan || '');
    const currentKategori = rec.kategoriLiterasi || 'Kata Mutiara & Budi Pekerti';
    if (defaultKategoriOptions.includes(currentKategori)) {
      setKategoriLiterasi(currentKategori);
      setIsManualKategori(false);
      setManualKategoriText('');
    } else {
      setKategoriLiterasi('Kata Mutiara & Budi Pekerti');
      setIsManualKategori(true);
      setManualKategoriText(currentKategori);
    }
    setPenulis(rec.penulis || 'Duta Literasi Sahabat SPANJU');
    setFormSignature(rec.tandaTanganUrl || '');
    setNamaPenandatangan(rec.namaPenandatangan || 'Wiwik Ismiati, S.Pd');
    setNipPenandatangan(rec.nipPenandatangan || '198311162009042003');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hariTanggal.trim() || !pesanDisampaikan.trim()) return;

    const finalKategori = isManualKategori
      ? (manualKategoriText.trim() || 'Literasi & Karakter')
      : kategoriLiterasi;

    if (editingRecord) {
      const updated: SenandungSerasiRecord = {
        ...editingRecord,
        hariTanggal: hariTanggal.trim(),
        waktu: waktu.trim() || '07:00 - 07:30 WIB',
        pesanDisampaikan: pesanDisampaikan.trim(),
        keterangan: keterangan.trim(),
        kategoriLiterasi: finalKategori,
        penulis: penulis.trim() || 'Sahabat SPANJU',
        tandaTanganUrl: formSignature || editingRecord.tandaTanganUrl,
        namaPenandatangan: namaPenandatangan.trim(),
        nipPenandatangan: nipPenandatangan.trim(),
      };

      if (onUpdateRecord) {
        onUpdateRecord(updated);
      }
      setShowModal(false);
      resetForm();
      return;
    }

    const newRecord: SenandungSerasiRecord = {
      id: `serasi-${Date.now()}`,
      hariTanggal: hariTanggal.trim(),
      waktu: waktu.trim() || '07:00 - 07:30 WIB',
      pesanDisampaikan: pesanDisampaikan.trim(),
      keterangan: keterangan.trim(),
      kategoriLiterasi: finalKategori,
      penulis: penulis.trim() || 'Sahabat SPANJU',
      tandaTanganUrl: formSignature || undefined,
      namaPenandatangan: namaPenandatangan.trim(),
      nipPenandatangan: nipPenandatangan.trim(),
      jabatanPenandatangan: 'Duta Literasi & Karakter',
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowModal(false);
    resetForm();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCardSignatureSave = (signatureUrl: string, name?: string, title?: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: SenandungSerasiRecord = {
      ...signingRecord,
      tandaTanganUrl: signatureUrl,
      namaPenandatangan: name || signingRecord.namaPenandatangan || 'Duta Literasi',
      nipPenandatangan: signingRecord.nipPenandatangan,
      jabatanPenandatangan: title || signingRecord.jabatanPenandatangan || 'Pembawa Pesan Karakter',
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Fallback
    }
  };

  return (
    <div id="view-senandung-serasi" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-100/80 via-purple-50/70 to-white border border-indigo-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 mb-2 shadow-2xs">
            <Music2 className="w-4 h-4 text-indigo-700" />
            PROGRAM LITERASI & PENGUATAN KARAKTER RAMAH
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            SENANDUNG SERASI
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            (Salam dan Pesan Mendukung Ramah dan Berliterasi) — Pembiasaan pesan inspiratif, salam persahabatan, dan adab bertutur santun di SMPN 7 Pasuruan
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
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            Cetak Kop Surat Resmi
          </button>
          <button
            onClick={playChime}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            title="Bunyikan Nada Harmoni Apel Pagi"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            Lonceng Ramah
          </button>
          <button
            id="btn-tambah-serasi"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Tambah Pesan Serasi
          </button>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {editingRecord ? <Pencil className="w-5 h-5 text-indigo-700" /> : <Music2 className="w-5 h-5 text-indigo-700" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span>{editingRecord ? 'Edit Data Senandung Serasi' : 'Form Senandung Serasi'}</span>
                    {editingRecord && (
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-300">
                        {editingRecord.hariTanggal}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingRecord
                      ? 'Perbarui pesan inspiratif, kategori literasi, atau pembawa pesan'
                      : 'Salam dan Pesan Mendukung Ramah dan Berliterasi'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CalendarDatePicker
                  value={hariTanggal}
                  onChange={setHariTanggal}
                  required
                />
                <RealTimeTimePicker
                  value={waktu}
                  onChange={setWaktu}
                  label="WAKTU SIARAN / APEL"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      KATEGORI LITERASI
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isManualKategori;
                        setIsManualKategori(next);
                        if (next && !manualKategoriText) {
                          setManualKategoriText('');
                        }
                      }}
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition flex items-center gap-1 cursor-pointer"
                    >
                      {isManualKategori ? '← Pilih dari Daftar' : '✍️ Isi Manual'}
                    </button>
                  </div>

                  {isManualKategori ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={manualKategoriText}
                        onChange={(e) => setManualKategoriText(e.target.value)}
                        placeholder="Ketik kategori literasi manual (contoh: Pantun Sahabat, Dongeng Ceria)..."
                        className="w-full px-3 py-2 bg-white border-2 border-indigo-400 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-200 focus:outline-none font-medium placeholder:text-slate-400"
                        autoFocus
                      />
                      <p className="text-[10px] text-indigo-600 font-medium">
                        Mode isi manual aktif. Ketikkan kategori bebas atau klik "Pilih dari Daftar".
                      </p>
                    </div>
                  ) : (
                    <select
                      value={kategoriLiterasi}
                      onChange={(e) => {
                        if (e.target.value === '__manual__') {
                          setIsManualKategori(true);
                          setManualKategoriText('');
                        } else {
                          setKategoriLiterasi(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="Kata Mutiara & Budi Pekerti">Kata Mutiara & Budi Pekerti</option>
                      <option value="Salam Persahabatan & Empati">Salam Persahabatan & Empati</option>
                      <option value="Adab Bertutur & Santun Digital">Adab Bertutur & Santun Digital</option>
                      <option value="Puisi & Sastra Sahabat">Puisi & Sastra Sahabat</option>
                      <option value="__manual__">✍️ Isi Manual (Ketik Sendiri)...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PEMBAWA PESAN / PENULIS
                  </label>
                  <input
                    type="text"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    placeholder="Contoh: Duta Literasi Kelas 8 / Guru BK"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PESAN YANG DISAMPAIKAN <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={pesanDisampaikan}
                  onChange={(e) => setPesanDisampaikan(e.target.value)}
                  placeholder="Ketik kalimat motivasi, kutipan bijak, atau seruan kebaikan untuk diumumkan lewat pengeras suara/mading..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KETERANGAN / MEDIA PENYAMPAIAN
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Disampaikan saat apel pagi / siaran radio sekolah / mading digital"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Touchscreen Signature Pad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PILIH PENANDA TANGAN (KOORDINATOR)
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
                          ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
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
                          ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
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
                    signerTitle="Duta Literasi Sahabat SPANJU"
                    compact={true}
                    onSave={(dataUrl) => {
                      setFormSignature(dataUrl);
                      alert('Tanda tangan berhasil direkam!');
                    }}
                    title="Tanda Tangan Duta Literasi"
                    promptText="Sentuh layar HP dengan jari atau gunakan mouse laptop:"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md btn-3d flex items-center gap-1.5"
                >
                  {editingRecord ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Simpan Perubahan Pesan
                    </>
                  ) : (
                    'Simpan Pesan Serasi'
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
          title={`Tanda Tangan Pesan Serasi - ${signingRecord.hariTanggal}`}
          subtitle="Goreskan jari di HP atau gerakkan mouse laptop"
          initialSignature={signingRecord.tandaTanganUrl}
          signerName={signingRecord.namaPenandatangan || signingRecord.penulis || 'Duta Literasi'}
          signerTitle={signingRecord.jabatanPenandatangan || 'Duta Literasi Ramah Anak'}
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
              ? `LEMBAR PUBLIKASI SENANDUNG SERASI - ${selectedForPrint.hariTanggal.toUpperCase()}`
              : 'DOKUMENTASI PUBLIKASI PESAN INSPIRATIF SENANDUNG SERASI'
          }
          nomorSurat={`421.3 / SRS-${Math.floor(100 + Math.random() * 900)} / 101.4.7 / 2026`}
          firstSignerRole="Duta Literasi Ramah Anak"
          firstSignerName={selectedForPrint?.namaPenandatangan || 'Tim Literasi Sahabat SPANJU'}
          firstSignerNip={selectedForPrint?.nipPenandatangan}
          firstSignerSignature={selectedForPrint?.tandaTanganUrl || records[0]?.tandaTanganUrl}
          onFirstSignerUpdate={(sig) => {
            if (selectedForPrint && onUpdateRecord) {
              onUpdateRecord({ ...selectedForPrint, tandaTanganUrl: sig });
            }
          }}
          secondSignerRole="Kepala UPTD SMP Negeri 7 Pasuruan"
          secondSignerName="NUR FADILAH, S.Pd., M.Pd"
          secondSignerNip="19860410 201001 2 030"
        >
          {selectedForPrint ? (
            <div className="space-y-4">
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-indigo-50/50 w-1/3">Hari / Tanggal & Waktu</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.hariTanggal} ({selectedForPrint.waktu})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-indigo-50/50">Kategori Literasi</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.kategoriLiterasi || 'Kata Mutiara & Budi Pekerti'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-indigo-50/50">Penulis / Pembawa Pesan</td>
                    <td className="p-2.5 font-bold text-indigo-900">{selectedForPrint.penulis || 'Sahabat SPANJU'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 font-bold bg-indigo-50/50 align-top">Isi Pesan Disampaikan</td>
                    <td className="p-2.5 text-slate-800 leading-relaxed font-serif text-sm italic">
                      "{selectedForPrint.pesanDisampaikan}"
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-indigo-50/50">Keterangan Media</td>
                    <td className="p-2.5 text-slate-800">{selectedForPrint.keterangan || 'Disiarkan saat pembiasaan pagi'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-700">
                Rekapitulasi publikasi pesan penguatan karakter dan pembiasaan bertutur santun <strong>Senandung Serasi</strong> di lingkungan UPTD SMP Negeri 7 Pasuruan:
              </p>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-indigo-100/70 border-b border-slate-300 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Hari / Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-left">Kategori & Pembawa Pesan</th>
                    <th className="p-2 border-r border-slate-300 text-left">Pesan Inspiratif</th>
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
                      <td className="p-2 border-r border-slate-200 text-slate-800">
                        <span className="font-bold block">{item.penulis}</span>
                        <span className="text-[10px] text-indigo-700">{item.kategoriLiterasi}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-700 italic font-serif">
                        "{item.pesanDisampaikan}"
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

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((item) => (
          <div
            key={item.id}
            id={`card-serasi-${item.id}`}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/50 to-white border border-slate-200 hover:border-indigo-300 shadow-xs card-3d flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                    {item.kategoriLiterasi || 'KATA MUTIARA & BUDI PEKERTI'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-0.5">{item.hariTanggal}</h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-indigo-600" /> {item.waktu}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    id={`btn-edit-serasi-${item.id}`}
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                    title="Edit / Perbarui Pesan Ini"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-cetak-serasi-${item.id}`}
                    onClick={() => {
                      setSelectedForPrint(item);
                      setShowPrintModal(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Cetak Kop Surat Lembar Ini"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.id, item.pesanDisampaikan)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Salin teks pesan"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => onDeleteRecord(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus pesan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quote Block */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-purple-50/70 border border-indigo-200/60 relative my-3">
                <Quote className="w-5 h-5 text-indigo-400 absolute top-2.5 left-2.5 opacity-40" />
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed italic pl-5 font-serif">
                  "{item.pesanDisampaikan}"
                </p>
                <div className="mt-2 text-right">
                  <span className="text-[11px] font-bold text-indigo-800">
                    &mdash; {item.penulis || 'Sahabat SPANJU'}
                  </span>
                </div>
              </div>

              {item.keterangan && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">Keterangan:</span> {item.keterangan}
                </div>
              )}
            </div>

            {/* Touchscreen Signature Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {item.tandaTanganUrl ? (
                  <div className="flex items-center gap-2">
                    <div className="h-8 px-2 bg-white rounded-lg border border-slate-200 flex items-center shadow-2xs">
                      <img
                        src={item.tandaTanganUrl}
                        alt="TTD"
                        className="h-6 max-w-[85px] object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> TTD Resmi
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
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1 transition active:scale-95 shadow-2xs"
              >
                <FileSignature className="w-3.5 h-3.5 text-indigo-700" />
                {item.tandaTanganUrl ? 'Ubah TTD' : 'TTD Touchscreen'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
