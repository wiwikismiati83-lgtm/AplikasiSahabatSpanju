import React, { useState } from 'react';
import {
  FolderArchive,
  Plus,
  Search,
  Printer,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  ExternalLink,
  FileText,
  FileSignature,
  Trash2,
  Tag,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { ArsipKegiatanRecord } from '../types';
import { TouchSignaturePad } from './TouchSignaturePad';
import { TouchSignatureModal } from './TouchSignatureModal';
import { OfficialReportModal } from './OfficialReportModal';

interface Props {
  records: ArsipKegiatanRecord[];
  onAddRecord: (record: ArsipKegiatanRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: ArsipKegiatanRecord) => void;
  canDelete?: boolean;
  onOpenMenu?: () => void;
}

export const ArsipKegiatanView: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  canDelete = true,
  onOpenMenu,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Printing & Signature
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<ArsipKegiatanRecord | null>(null);
  const [signingRecord, setSigningRecord] = useState<ArsipKegiatanRecord | null>(null);

  // Form states
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [kategori, setKategori] = useState<ArsipKegiatanRecord['kategori']>('Sosialisasi Anti-Bullying');
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktu, setWaktu] = useState('08:00 - 10:00 WIB');
  const [tempat, setTempat] = useState('Aula Terbuka Graha Adiwiyata SMPN 7 Pasuruan');
  const [penyelenggara, setPenyelenggara] = useState('Tim TPPK, OSIS & Duta Sahabat SPANJU');
  const [sasaranPeserta, setSasaranPeserta] = useState('Perwakilan Siswa Kelas 7, 8, dan 9');
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(64);
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState('');
  const [hasilNotulensi, setHasilNotulensi] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [linkDokumen, setLinkDokumen] = useState('');
  const [namaKoordinator, setNamaKoordinator] = useState('Hj. Siti Aminah, S.Pd');
  const [jabatanKoordinator, setJabatanKoordinator] = useState('Koordinator Program Sahabat SPANJU');
  const [formSignature, setFormSignature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKegiatan.trim() || !hariTanggal.trim() || !deskripsiKegiatan.trim()) return;

    const count = records.length + 1;
    const kodeArsip = `ARSIP-SPJ-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;

    const newRecord: ArsipKegiatanRecord = {
      id: `arsip-${Date.now()}`,
      kodeArsip,
      namaKegiatan: namaKegiatan.trim(),
      kategori,
      hariTanggal: hariTanggal.trim(),
      waktu: waktu.trim() || '08:00 - 10:00 WIB',
      tempat: tempat.trim() || 'SMP Negeri 7 Pasuruan',
      penyelenggara: penyelenggara.trim(),
      sasaranPeserta: sasaranPeserta.trim(),
      jumlahPeserta: Number(jumlahPeserta) || 50,
      deskripsiKegiatan: deskripsiKegiatan.trim(),
      hasilNotulensi: hasilNotulensi.trim() || 'Kegiatan berjalan tertib, partisipatif, dan kondusif.',
      linkFoto:
        linkFoto.trim() ||
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      linkDokumen: linkDokumen.trim() || undefined,
      tandaTanganKoordinator: formSignature || undefined,
      namaKoordinator: namaKoordinator.trim(),
      jabatanKoordinator: jabatanKoordinator.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setShowModal(false);

    // Reset
    setNamaKegiatan('');
    setHariTanggal('');
    setDeskripsiKegiatan('');
    setHasilNotulensi('');
    setLinkFoto('');
    setLinkDokumen('');
    setFormSignature('');
  };

  const handleSignatureSave = (signatureUrl: string) => {
    if (!signingRecord || !onUpdateRecord) return;
    const updated: ArsipKegiatanRecord = {
      ...signingRecord,
      tandaTanganKoordinator: signatureUrl,
    };
    onUpdateRecord(updated);
    setSigningRecord(null);
  };

  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      r.namaKegiatan.toLowerCase().includes(term) ||
      r.kodeArsip.toLowerCase().includes(term) ||
      r.tempat.toLowerCase().includes(term) ||
      r.penyelenggara.toLowerCase().includes(term) ||
      r.deskripsiKegiatan.toLowerCase().includes(term);
    const matchCategory = selectedCategory === 'semua' || r.kategori === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalPesertaAll = records.reduce((acc, curr) => acc + (curr.jumlahPeserta || 0), 0);

  return (
    <div id="view-arsip-kegiatan" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-100/80 via-orange-50/70 to-white border border-amber-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2 shadow-2xs">
            <FolderArchive className="w-4 h-4 text-amber-700" />
            REPOSITORI & ARSIP DOKUMENTASI SPANJU
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Arsip Kegiatan Sahabat SPANJU
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Pusat penyimpanan berkas, galeri foto dokumentasi kegiatan sosialisasi ramah anak, pelatihan duta konselor, dan lembar laporan resmi berkop surat.
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
          <a
            href="https://sites.google.com/view/berandapasstemenanspanju/home"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20 hover:from-amber-500 hover:to-orange-500 transition active:scale-95 flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            Buka Google Sites Penuh
          </a>
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
        </div>
      </div>

      {/* Embedded Google Sites Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-xs font-bold text-slate-700 ml-2 font-mono">
              https://sites.google.com/view/berandapasstemenanspanju/home
            </span>
          </div>
          <a
            href="https://sites.google.com/view/berandapasstemenanspanju/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Buka di Tab Baru <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="w-full h-[900px] bg-slate-100 relative">
          <iframe
            src="https://sites.google.com/view/berandapasstemenanspanju/home"
            title="Arsip Kegiatan Sahabat SPANJU - Google Sites"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
