import React, { useState } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit3,
  BookOpen,
  Calendar,
  X,
  Layers,
  Database,
  RefreshCw,
  Copy,
  Check,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { MediaEdukasiItem } from '../types';

interface Props {
  items: MediaEdukasiItem[];
  canDelete?: boolean;
  onAddItem: (item: MediaEdukasiItem) => Promise<void> | void;
  onDeleteItem: (id: string) => Promise<void> | void;
  onOpenMenu?: () => void;
  onRefresh?: () => Promise<void> | void;
}

const SQL_SCHEMA_STRING = `-- ==============================================================================
-- SKRIP PEMBUATAN TABEL MEDIA EDUKASI DIGITAL SPANJU DI SUPABASE
-- UPT SMP NEGERI 7 PASURUAN
-- ==============================================================================

-- 1. Buat Tabel media_edukasi_items
CREATE TABLE IF NOT EXISTS public.media_edukasi_items (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    dokumentasimateriurl TEXT,
    tanggal TEXT NOT NULL,
    tipe TEXT DEFAULT 'modul',
    kategori TEXT DEFAULT 'Materi Edukasi',
    pesanedukatif TEXT DEFAULT '',
    thumbnailurl TEXT,
    sumber TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    createdat TIMESTAMPTZ DEFAULT now()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.media_edukasi_items ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Keamanan (Policies) untuk Akses Anonim / Publik
DROP POLICY IF EXISTS "Allow select on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow select on media_edukasi_items" 
    ON public.media_edukasi_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow insert on media_edukasi_items" 
    ON public.media_edukasi_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow update on media_edukasi_items" 
    ON public.media_edukasi_items FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow delete on media_edukasi_items" 
    ON public.media_edukasi_items FOR DELETE USING (true);`;

export const MediaEdukasiView: React.FC<Props> = ({
  items,
  canDelete = true,
  onAddItem,
  onDeleteItem,
  onOpenMenu,
  onRefresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState<MediaEdukasiItem | null>(null);
  const [editingItem, setEditingItem] = useState<MediaEdukasiItem | null>(null);

  // Form states - Judul Materi dan Tautan Dokumentasi
  const [judul, setJudul] = useState('');
  const [dokumentasiMateriUrl, setDokumentasiMateriUrl] = useState('');

  const resetForm = () => {
    setJudul('');
    setDokumentasiMateriUrl('');
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: MediaEdukasiItem) => {
    setEditingItem(item);
    setJudul(item.judul);
    setDokumentasiMateriUrl(item.dokumentasiMateriUrl || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || isSaving) return;

    try {
      setIsSaving(true);
      const todayStr = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());

      const newItem: MediaEdukasiItem = {
        id: editingItem ? editingItem.id : `med-${Date.now()}`,
        judul: judul.trim(),
        dokumentasiMateriUrl: dokumentasiMateriUrl.trim() || undefined,
        tanggal: editingItem ? editingItem.tanggal : todayStr,
        tipe: editingItem?.tipe || 'modul',
        kategori: editingItem?.kategori || 'Materi Edukasi',
        pesanEdukatif: editingItem?.pesanEdukatif || '',
      };

      await onAddItem(newItem);
      resetForm();
      setShowModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCHEMA_STRING);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  const handleManualRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    try {
      setIsRefreshing(true);
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sahabat SPANJU Digital Repository</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Supabase Aktif</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            MEDIA EDUKASI DIGITAL SPANJU
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Pusat repositori digital materi pencegahan perundungan, video pembelajaran, dan modul literasi karakter ramah anak tersimpan aman di Supabase.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Sinkronkan data dengan Supabase"
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sinkron</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
            title="Lihat Skrip SQL Tabel Supabase"
          >
            <Database className="w-3.5 h-3.5 text-violet-600" />
            <span>Skrip Tabel Supabase</span>
          </button>

          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Pilihan Menu
            </button>
          )}

          <button
            id="btn-tambah-media"
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-violet-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Media Baru
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul materi edukasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium px-2">
          Total: <span className="font-bold text-slate-800">{filteredItems.length}</span> Materi
        </div>
      </div>

      {/* Media Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Materi Edukasi</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Materi edukasi digital ramah anak belum ditemukan. Klik tombol Tambah Media Baru untuk menambahkan materi langsung ke database Supabase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-white border border-slate-200 hover:border-violet-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.tanggal}
                  </span>
                  <div className="flex items-center gap-1">
                    {canDelete && (
                      <button
                        type="button"
                        title="Edit Materi"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        title="Hapus Materi"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 group-hover:text-violet-700 transition leading-snug line-clamp-3">
                  {item.judul}
                </h3>
              </div>

              {/* Bottom Action */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                {item.dokumentasiMateriUrl ? (
                  <a
                    href={item.dokumentasiMateriUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition active:scale-95"
                  >
                    <span>Buka Materi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="w-full text-center text-[11px] text-slate-400 italic py-1">
                    Tautan materi tidak tersedia
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit Media Edukasi Digital */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {editingItem ? 'Edit Media Edukasi Digital' : 'Tambah Media Edukasi Digital'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingItem ? 'Perbarui data materi edukasi di Supabase' : 'Data otomatis disimpan ke Supabase Cloud'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Judul Materi / Kampanye */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Judul Materi / Kampanye <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isSaving}
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Modul Bijak Bermedia Sosial Tanpa Perundungan"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition disabled:opacity-50"
                />
              </div>

              {/* Dokumentasi Materi (URL Link / Dokumen / Video) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Dokumentasi Materi (URL Link / Dokumen / Video)
                </label>
                <input
                  type="url"
                  disabled={isSaving}
                  value={dokumentasiMateriUrl}
                  onChange={(e) => setDokumentasiMateriUrl(e.target.value)}
                  placeholder="https://... tautan file google drive, youtube, atau artikel"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition disabled:opacity-50"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Masukkan tautan Google Drive dokumen PDF, video YouTube, modul literasi, atau situs panduan resmi.
                </p>
              </div>

              {/* Database notice */}
              <div className="p-3 rounded-xl bg-violet-50/60 border border-violet-100 flex items-center gap-2.5 text-xs text-violet-800">
                <Database className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Perubahan akan disinkronkan otomatis ke server database Supabase SPANJU.</span>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition active:scale-95 shadow-md shadow-violet-500/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Media'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Materi */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                Hapus Media Edukasi?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus materi <span className="font-semibold text-slate-700">"{itemToDelete.judul}"</span>? Data akan dihapus dari Supabase.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  const targetId = itemToDelete.id;
                  setItemToDelete(null);
                  await onDeleteItem(targetId);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition active:scale-95 shadow-md shadow-red-600/20 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Skrip SQL Tabel Supabase */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center border border-violet-200">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Skrip SQL Tabel Supabase (media_edukasi_items)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jalankan skrip ini di SQL Editor Supabase untuk membuat atau memperbarui tabel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-violet-600" />
                  Berkas: <code className="bg-slate-100 px-2 py-0.5 rounded-sm font-mono text-slate-800">supabase_schema_media_edukasi.sql</code>
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition active:scale-95 shadow-xs cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Skrip SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">
                  {SQL_SCHEMA_STRING}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Status Tabel Saat Ini:</p>
                  <p className="text-emerald-700 mt-0.5">
                    Tabel <code className="font-mono font-bold">media_edukasi_items</code> telah aktif di database Supabase dan siap menerima input data baru serta penyuntingan secara langsung.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
