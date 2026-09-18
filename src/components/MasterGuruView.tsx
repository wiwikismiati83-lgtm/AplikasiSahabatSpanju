import React, { useState } from 'react';
import { 
  GraduationCap, 
  Upload, 
  Download,
  Trash2, 
  Search, 
  FileSpreadsheet, 
  Plus, 
  X,
  CheckCircle,
  Layers,
  UserCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Guru } from '../types';

interface Props {
  records: Guru[];
  onAddRecords: (records: Guru[]) => void;
  onDeleteRecord: (id: string) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const MasterGuruView: React.FC<Props> = ({
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

  const downloadTemplate = () => {
    const templateData = [
      {
        'NIP': '198501012010011001',
        'Nama Lengkap': 'Budi Santoso, S.Pd',
        'Jabatan': 'Guru Matematika',
        'Status': 'PNS'
      },
      {
        'NIP': '-',
        'Nama Lengkap': 'Ani Wijaya, S.Si',
        'Jabatan': 'Guru Biologi',
        'Status': 'GTT'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Guru");
    XLSX.writeFile(wb, "Template_Master_Guru_SPANJU.xlsx");
  };

  // Single record form state
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [status, setStatus] = useState('PNS');

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

        const newGuru: Guru[] = data.map((item, idx) => {
          // Flexible column detection
          const findVal = (keys: string[]) => {
            const key = Object.keys(item).find(k => keys.includes(k.toLowerCase().trim()));
            return key ? item[key] : null;
          };

          const rawNama = findVal(['nama', 'nama lengkap', 'teacher name', 'name']);
          const rawNip = findVal(['nip', 'nomor induk pegawai', 'id', 'nik']);
          const rawJabatan = findVal(['jabatan', 'mata pelajaran', 'position', 'role', 'mapel']);
          const rawStatus = findVal(['status', 'kepegawaian', 'status pegawai', 'type']);

          return {
            id: `guru-${Date.now()}-${idx}`,
            nama: String(rawNama || '').trim(),
            nip: String(rawNip || '-').trim(),
            jabatan: String(rawJabatan || 'Guru Mata Pelajaran').trim(),
            status: String(rawStatus || 'PNS').trim().toUpperCase(),
            createdAt: new Date().toISOString(),
          };
        }).filter(g => g.nama);

        if (newGuru.length > 0) {
          await onAddRecords(newGuru);
          setUploadStats({ total: newGuru.length });
          setShowSuccessModal(true);
        } else {
          alert('Tidak ada data valid yang ditemukan dalam file Excel. Pastikan header kolom adalah: Nama, NIP, Jabatan, Status.');
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
    if (!nama.trim()) return;

    const newRecord: Guru = {
      id: `guru-${Date.now()}`,
      nama: nama.trim(),
      nip: nip.trim() || '-',
      jabatan: jabatan.trim() || 'Guru Mata Pelajaran',
      status: status,
      createdAt: new Date().toISOString(),
    };

    onAddRecords([newRecord]);
    setShowAddForm(false);
    setNama('');
    setNip('');
    setJabatan('');
  };

  const filtered = records.filter(
    (g) =>
      g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="view-master-guru" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-100/80 via-indigo-50/70 to-white border border-blue-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 mb-2 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            DATABASE MASTER GURU & TENAGA KEPENDIDIKAN
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Data Pendidik Sahabat SPANJU
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manajemen data NIP, jabatan, dan status kepegawaian guru/staf. Terintegrasi dengan database pusat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Menu Utama
            </button>
          )}
          {canDelete && (
            <>
              <button
                onClick={downloadTemplate}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Template
              </button>
              <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-500/20 active:scale-95">
                <Upload className="w-3.5 h-3.5" />
                Upload Excel
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Manual
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pendidik/Staf</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800">{records.length}</h3>
            <UserCheck className="w-6 h-6 text-blue-500/30" />
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center px-4">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, atau jabatan..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">NIP</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jabatan</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((guru, idx) => (
                <tr key={guru.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-xs text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-blue-700">{guru.nip}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800">{guru.nama}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{guru.jabatan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      guru.status === 'PNS' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {guru.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canDelete && (
                      <button
                        onClick={() => onDeleteRecord(guru.id)}
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
                      <p className="text-sm text-slate-500">Belum ada data guru. Gunakan fitur "Upload Excel" atau "Tambah Manual".</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black">Tambah Guru Manual</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-white/20 rounded-full transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-blue-50 text-xs opacity-90">Masukkan data identitas guru/pendidik secara akurat.</p>
            </div>

            <form onSubmit={handleAddSingle} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  placeholder="Contoh: Drs. Bambang Santoso, M.Pd"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">NIP (Opsional)</label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition font-mono"
                  placeholder="Isi '-' jika tidak ada NIP"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Jabatan / Mata Pelajaran</label>
                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  placeholder="Contoh: Guru Matematika / Wali Kelas 7A"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Status Kepegawaian</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition bg-white"
                >
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="GTT">GTT</option>
                  <option value="Honorer">Honorer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Simpan Data Guru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden border border-white/20 p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Berhasil Diunggah!</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                <span className="font-bold text-blue-600">{uploadStats.total} data guru/staf</span> telah berhasil diimpor dan disinkronkan ke database pusat Sahabat SPANJU.
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
