import React, { useState } from 'react';
import { X, Plus, Link2, Sparkles, Globe, Database, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';
import { CustomLink } from '../types';

interface CustomLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (link: CustomLink) => void;
}

export const CustomLinkModal: React.FC<CustomLinkModalProps> = ({
  isOpen,
  onClose,
  onAddLink,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Aplikasi Penunjang');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Globe');
  const [color, setColor] = useState('from-cyan-500 to-blue-600');
  const [openMode, setOpenMode] = useState<'embed' | 'new_tab'>('embed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newLink: CustomLink = {
      id: `link-${Date.now()}`,
      title: title.trim(),
      url: formattedUrl,
      category: category.trim() || 'Aplikasi Penunjang',
      description: description.trim(),
      iconName,
      color,
      openMode,
      createdAt: new Date().toISOString(),
    };

    onAddLink(newLink);
    onClose();
    // Reset form
    setTitle('');
    setUrl('');
    setDescription('');
  };

  const icons = [
    { name: 'Globe', label: 'Web', icon: Globe },
    { name: 'GraduationCap', label: 'Edukasi', icon: GraduationCap },
    { name: 'BookOpen', label: 'Buku', icon: BookOpen },
    { name: 'ShieldCheck', label: 'Aman', icon: ShieldCheck },
    { name: 'Database', label: 'Data', icon: Database },
  ];

  const colorOptions = [
    { label: 'Cyan Blue', value: 'from-cyan-500 to-blue-600' },
    { label: 'Emerald Teal', value: 'from-emerald-500 to-teal-600' },
    { label: 'Purple Pink', value: 'from-purple-500 to-pink-600' },
    { label: 'Amber Orange', value: 'from-amber-500 to-orange-600' },
    { label: 'Rose Red', value: 'from-rose-500 to-red-600' },
    { label: 'Indigo Violet', value: 'from-indigo-600 to-violet-700' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-add-link"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden card-3d"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/80 via-slate-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-200">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Tambah Tautan / Menu Aplikasi</h2>
              <p className="text-xs text-slate-500">Tautan akan ditambahkan ke bilah menu sebelah kiri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Menu / Aplikasi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: E-Rapor SPANJU / Google Drive Materi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat URL Website / File <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://contoh-link-sekolah.id"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Misal: Kurikulum / Ekstrakurikuler"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mode Pembukaan
              </label>
              <select
                value={openMode}
                onChange={(e) => setOpenMode(e.target.value as 'embed' | 'new_tab')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="embed">Panel Kanan (Tersemat)</option>
                <option value="new_tab">Tab Baru Browser</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Singkat (Opsional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan singkat fungsi aplikasi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>

          {/* Icon and Color Selection */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ikon Tombol
              </label>
              <div className="flex gap-1.5">
                {icons.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setIconName(item.name)}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-center transition ${
                        iconName === item.name
                          ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Aksen Warna 3D
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${c.value} transition shadow-xs ${
                      color === c.value
                        ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-white scale-110'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 hover:from-sky-600 hover:to-blue-700 transition active:scale-95 flex items-center gap-1.5 btn-3d btn-3d-blue"
            >
              <Plus className="w-4 h-4" />
              Simpan Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
