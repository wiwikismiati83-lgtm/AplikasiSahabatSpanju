import React, { useState } from 'react';
import {
  Tv,
  Plus,
  BookOpen,
  Video,
  FileText,
  Sparkles,
  ExternalLink,
  Trash2,
  Calendar,
  X,
  Printer,
  Share2,
  Layers,
} from 'lucide-react';
import { MediaEdukasiItem } from '../types';

interface Props {
  items: MediaEdukasiItem[];
  onAddItem: (item: MediaEdukasiItem) => void;
  onDeleteItem: (id: string) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const MediaEdukasiView: React.FC<Props> = ({
  items,
  onAddItem,
  onDeleteItem,
  canDelete = true,
  onOpenMenu,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('semua');

  // Form states
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState<MediaEdukasiItem['tipe']>('modul');
  const [kategori, setKategori] = useState('Pencegahan Perundungan');
  const [dokumentasiMateriUrl, setDokumentasiMateriUrl] = useState('');
  const [pesanEdukatif, setPesanEdukatif] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [sumber, setSumber] = useState('Tim Sahabat SPANJU');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !pesanEdukatif.trim()) return;

    const newItem: MediaEdukasiItem = {
      id: `med-${Date.now()}`,
      judul: judul.trim(),
      tipe,
      kategori: kategori.trim(),
      dokumentasiMateriUrl: dokumentasiMateriUrl.trim(),
      pesanEdukatif: pesanEdukatif.trim(),
      thumbnailUrl:
        thumbnailUrl.trim() ||
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      sumber: sumber.trim() || 'Sahabat SPANJU',
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    onAddItem(newItem);
    setShowModal(false);
    // Reset
    setJudul('');
    setDokumentasiMateriUrl('');
    setPesanEdukatif('');
    setThumbnailUrl('');
  };

  const filtered = items.filter(
    (item) => filterType === 'semua' || item.tipe === filterType
  );

  return (
    <div id="view-media-edukasi" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-100/80 via-purple-50/70 to-white border border-violet-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-900 border border-violet-300 mb-2 shadow-2xs">
            <Tv className="w-4 h-4 text-violet-700" />
            SUMBER BELAJAR KARAKTER DIGITAL
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            MEDIA EDUKASI DIGITAL SPANJU
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Pusat dokumentasi materi pencegahan perundungan, video penguatan karakter, modul literasi, dan pesan edukatif harian
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-violet-600" />
              Pilihan Menu Aplikasi
            </button>
          )}
          <button
            id="btn-tambah-media"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20 hover:from-violet-500 hover:to-fuchsia-500 transition active:scale-95 flex items-center gap-1.5 btn-3d"
          >
            <Plus className="w-4 h-4" />
            Unggah Materi Baru
          </button>
        </div>
      </div>

      {/* Modal Add Media */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden card-3d">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50/50 to-white">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-100 text-violet-800 border border-violet-200">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Tambah Media Edukasi Digital</h2>
                  <p className="text-xs text-slate-500">Dokumentasi materi & pesan edukatif ramah anak</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  JUDUL MATERI / KAMPANYE <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Modul Bijak Bermedia Sosial Tanpa Perundungan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Media
                  </label>
                  <select
                    value={tipe}
                    onChange={(e) => setTipe(e.target.value as MediaEdukasiItem['tipe'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-violet-500"
                  >
                    <option value="modul">Modul / Panduan</option>
                    <option value="video">Video Edukasi</option>
                    <option value="infografis">Infografis / Poster</option>
                    <option value="pesan_bijak">Pesan Bijak / Mutiara</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    placeholder="Pencegahan Bullying"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  DOKUMENTASI MATERI (URL Link / Dokumen / Video)
                </label>
                <input
                  type="text"
                  value={dokumentasiMateriUrl}
                  onChange={(e) => setDokumentasiMateriUrl(e.target.value)}
                  placeholder="https://... tautan file google drive, youtube, atau artikel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PESAN EDUKATIF (Intisari Pembelajaran) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={pesanEdukatif}
                  onChange={(e) => setPesanEdukatif(e.target.value)}
                  placeholder="Intisari pesan nilai budi pekerti atau himbauan karakter ramah yang ingin disampaikan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link Gambar Thumbnail
                  </label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://... (Opsional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sumber Materi
                  </label>
                  <input
                    type="text"
                    value={sumber}
                    onChange={(e) => setSumber(e.target.value)}
                    placeholder="Tim BK / PUSPEKA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md btn-3d"
                >
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit text-xs shadow-xs">
        {[
          { id: 'semua', label: 'Semua Media' },
          { id: 'modul', label: 'Modul & Panduan' },
          { id: 'video', label: 'Video Pembelajaran' },
          { id: 'infografis', label: 'Infografis' },
          { id: 'pesan_bijak', label: 'Pesan Mutiara' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterType === tab.id
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            id={`card-media-${item.id}`}
            className="rounded-2xl bg-gradient-to-b from-slate-50/60 to-white border border-slate-200 hover:border-violet-300 shadow-xs overflow-hidden card-3d flex flex-col justify-between"
          >
            {item.thumbnailUrl && (
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden group">
                <img
                  src={item.thumbnailUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs border border-slate-200 uppercase tracking-wider shadow-xs">
                  {item.tipe.replace('_', ' ')}
                </span>
                {item.dokumentasiMateriUrl && (
                  <a
                    href={item.dokumentasiMateriUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Materi
                  </a>
                )}
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="text-violet-700 font-bold">{item.kategori}</span>
                  <span>{item.tanggal}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-1 leading-snug">{item.judul}</h3>

                {/* Pesan Edukatif */}
                <div className="mt-3 p-3.5 rounded-xl bg-violet-50/50 border border-violet-200/60 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800 block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-violet-600" /> PESAN EDUKATIF:
                  </span>
                  <p className="text-slate-700 leading-relaxed italic font-medium">
                    "{item.pesanEdukatif}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">Sumber: <strong className="text-slate-700">{item.sumber || 'SMPN 7 Pasuruan'}</strong></span>
                {canDelete && (
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
