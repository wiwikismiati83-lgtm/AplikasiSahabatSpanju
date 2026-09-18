import React, { useState } from 'react';
import { X, Search, Users, User, CheckCircle2 } from 'lucide-react';
import { Siswa } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  onSelect: (siswa: Siswa) => void;
  title: string;
}

export const StudentPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  siswaList,
  onSelect,
  title,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('7A');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const classes = ['7A','7B','7C','7D','7E','7F','7G','7H','8A','8B','8C','8D','8E','8F','8G','8H','9A','9B','9C','9D','9E','9F','9G','9H'];

  const filteredSiswa = siswaList.filter(s => {
    const matchesClass = s.kelas === selectedClass;
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight">{title}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pilih Kelas lalu Pilih Nama Siswa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Class Filter */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {classes.map(c => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition ${
                  selectedClass === c 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa di kelas ini..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          {filteredSiswa.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredSiswa.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelect(s);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition group text-left"
                >
                  <div className="p-2 bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-lg transition">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-slate-800 group-hover:text-blue-900 transition uppercase">{s.nama}</span>
                    <span className="text-[10px] text-slate-500 font-bold">KELAS {s.kelas}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 ml-auto text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
              <User className="w-12 h-12 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">Tidak ada siswa ditemukan</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pusat Data Siswa UPTD SMP Negeri 7 Pasuruan</p>
        </div>
      </div>
    </div>
  );
};
