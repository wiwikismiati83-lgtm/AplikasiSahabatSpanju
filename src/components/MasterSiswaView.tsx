import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  FileSpreadsheet, 
  Plus, 
  X,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowLeft
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Siswa } from '../types';

interface Props {
  records: Siswa[];
  onAddRecords: (records: Siswa[]) => void;
  onDeleteRecord: (id: string) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const MasterSiswaView: React.FC<Props> = ({
  records,
  onAddRecords,
  onDeleteRecord,
  canDelete = true,
  onOpenMenu,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadStats, setUploadStats] = useState({ total: 0 });

  // Single record form state
  const [nama, setNama] = useState('');
  const [nisn, setNisn] = useState('');
  const [kelas, setKelas] = useState('');
  const [jk, setJk] = useState<'L' | 'P'>('L');

  const downloadTemplate = () => {
    const templateData = [
      {
        'NISN': '0012345678',
        'Nama Lengkap': 'Ahmad Fauzi',
        'Kelas': '7A',
        'JK': 'L'
      },
      {
        'NISN': '0023456789',
        'Nama Lengkap': 'Siti Aminah',
        'Kelas': '8B',
        'JK': 'P'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Siswa");
    XLSX.writeFile(wb, "Template_Master_Siswa_SPANJU.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        if (data.length === 0) {
          alert('File Excel kosong atau tidak terbaca.');
          return;
        }

        const newSiswa: Siswa[] = data.map((item, idx) => {
          // Flexible column detection
          const findVal = (keys: string[]) => {
            const key = Object.keys(item).find(k => keys.includes(k.toLowerCase().trim()));
            return key ? item[key] : null;
          };

          const rawNama = findVal(['nama', 'nama lengkap', 'student name', 'name', 'nama_lengkap']);
          const rawNisn = findVal(['nisn', 'nomor induk', 'id', 'nis', 'nomor_induk']);
          const rawKelas = findVal(['kelas', 'rombel', 'class', 'grade']);
          const rawJk = findVal(['jk', 'jenis kelamin', 'gender', 'sex', 'p/l', 'l/p']);

          return {
            id: `siswa-${Date.now()}-${idx}`,
            nama: String(rawNama || '').trim(),
            nisn: String(rawNisn || '').trim(),
            kelas: String(rawKelas || 'Umum').trim(),
            jenisKelamin: (String(rawJk || 'L').toUpperCase().startsWith('P') ? 'P' : 'L') as 'L' | 'P',
            createdAt: new Date().toISOString(),
          };
        }).filter(s => s.nama);

        if (newSiswa.length > 0) {
          await onAddRecords(newSiswa);
          setUploadStats({ total: newSiswa.length });
          setShowSuccessModal(true);
        } else {
          alert('Tidak ada data valid yang ditemukan dalam file Excel. Pastikan header kolom adalah: Nama Lengkap dan NISN.');
        }
      } catch (err: any) {
        console.error('Error uploading data:', err);
        alert(`Gagal mengunggah data: ${err.message || 'Terjadi kesalahan teknis.'}`);
      } finally {
        setIsUploading(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nisn.trim()) return;

    const newRecord: Siswa = {
      id: `siswa-${Date.now()}`,
      nama: nama.trim(),
      nisn: nisn.trim(),
      kelas: kelas.trim() || 'Umum',
      jenisKelamin: jk,
      createdAt: new Date().toISOString(),
    };

    onAddRecords([newRecord]);
    setShowAddForm(false);
    setNama('');
    setNisn('');
    setKelas('');
  };

  const filtered = records.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="view-master-siswa" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-100/80 via-teal-50/70 to-white border border-emerald-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2 shadow-2xs">
            <Users className="w-4 h-4 text-emerald-700" />
            DATABASE MASTER SISWA
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Data Siswa Sahabat SPANJU
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manajemen data siswa, NISN, dan rombel. Mendukung pengunggahan masal via Excel untuk pemutakhiran data cepat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-rose-600" />
              Menu Utama
            </button>
          )}
          <button
            onClick={downloadTemplate}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Download Template
          </button>
          <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            Upload Excel
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Manual
          </button>
        </div>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Siswa Terdata</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800">{records.length}</h3>
            <Users className="w-6 h-6 text-emerald-500/30" />
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center px-4">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NISN, atau kelas..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">NISN</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">JK</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((siswa, idx) => (
                <tr key={siswa.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-xs text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-emerald-700">{siswa.nisn}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800">{siswa.nama}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      {siswa.kelas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{siswa.jenisKelamin}</td>
                  <td className="px-6 py-4 text-right">
                    {canDelete && (
                      <button
                        onClick={() => onDeleteRecord(siswa.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center opacity-50">
                      <FileSpreadsheet className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500">Belum ada data siswa. Gunakan fitur "Upload Excel" atau "Tambah Manual".</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Download Help */}
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-emerald-900">Petunjuk Pengunggahan Excel</h4>
          <p className="text-xs text-emerald-700 leading-relaxed mt-1">
            Pastikan file Excel Anda memiliki kolom header berikut: <b>Nama</b>, <b>NISN</b>, <b>Kelas</b>, dan <b>JK</b> (L/P). 
            Sistem akan secara otomatis mendeteksi baris data dan menambahkannya ke database pusat Sahabat SPANJU.
          </p>
        </div>
      </div>

      {/* Manual Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black">Tambah Siswa Manual</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-white/20 rounded-full transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-emerald-50 text-xs opacity-90">Masukkan data identitas siswa secara akurat.</p>
            </div>

            <form onSubmit={handleAddSingle} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
                  placeholder="Contoh: Ahmad Fauzi"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">NISN</label>
                  <input
                    type="text"
                    required
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition font-mono"
                    placeholder="10 digit NISN"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Kelas</label>
                  <input
                    type="text"
                    required
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
                    placeholder="Contoh: 7A"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Jenis Kelamin</label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition border-slate-200 hover:bg-slate-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <input type="radio" name="jk" className="hidden" checked={jk === 'L'} onChange={() => setJk('L')} />
                    <span className="text-sm font-bold text-slate-700">Laki-laki (L)</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition border-slate-200 hover:bg-slate-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <input type="radio" name="jk" className="hidden" checked={jk === 'P'} onChange={() => setJk('P')} />
                    <span className="text-sm font-bold text-slate-700">Perempuan (P)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                Simpan Data Siswa
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden border border-white/20 p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Berhasil Diunggah!</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                <span className="font-bold text-emerald-600">{uploadStats.total} data siswa</span> telah berhasil diimpor dan disinkronkan ke database pusat Sahabat SPANJU.
              </p>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition shadow-xl active:scale-95"
            >
              Mantap, Mengerti!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
