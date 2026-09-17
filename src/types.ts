export interface CustomLink {
  id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
  iconName?: string;
  color?: string;
  openMode: 'embed' | 'new_tab';
  createdAt: string;
}

export interface PiketHarianRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  namaAnggota: string;
  kelas: string;
  hasilTemuan: string;
  linkFoto: string;
  keterangan: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface SabtuBeliTehCeriRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  hasilTemuanSatuMinggu: string;
  evaluasiKegiatan: string;
  rencanaInovasi: string;
  linkFoto: string;
  keterangan: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface RtlItem {
  id: string;
  pic: string;
  targetPelaksanaan: string;
  deadline: string;
}

export interface KebunLuasBerseriRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  evaluasiProgramTerlaksana: string;
  evaluasiKendalaSolusi: string;
  hasilInovasi: string;
  produkKreatif: string;
  rencanaTindakLanjut: RtlItem[];
  keterangan: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface SenandungSerasiRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  pesanDisampaikan: string;
  keterangan: string;
  kategoriLiterasi?: string;
  penulis?: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface ELaporRecord {
  id: string;
  kodeLaporan: string;
  hariTanggal: string;
  waktuKejadian: string;
  namaSiswa: string;
  kelas: string;
  kronologiKejadian: string;
  // Mekanisme Penanganan
  kegiatanPenyadaran: string;
  kegiatanPencegahan: string;
  kegiatanPenangananRespon: string;
  kegiatanPelaporan: string;
  tindakLanjut: string;
  keterangan: string;
  status: 'Investigasi' | 'Mediasi' | 'Selesai' | 'Terpantau Aman';
  kategoriKasus: 'Verbal' | 'Fisik' | 'Siber' | 'Sosial/Relasional' | 'Lainnya';
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  tandaTanganPetugasUrl?: string;
  namaPetugas?: string;
  createdAt: string;
}

export interface BukuTamuRecord {
  id: string;
  hariTanggal: string;
  jamKedatangan: string;
  namaLengkap: string;
  nipNik: string;
  jabatan: string;
  instansiAsal: string;
  tujuanKunjungan: string;
  tandaTanganUrl?: string; // base64 or photo URL
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  tindakLanjut: string;
  keterangan: string;
  createdAt: string;
}

export interface MediaEdukasiItem {
  id: string;
  judul: string;
  tipe: 'video' | 'modul' | 'infografis' | 'pesan_bijak';
  kategori: string;
  dokumentasiMateriUrl?: string;
  pesanEdukatif: string;
  thumbnailUrl?: string;
  sumber?: string;
  tanggal: string;
}

export interface KelasZonaStatus {
  kelas: string; // e.g. "7A", "8C", "9H"
  tingkat: '7' | '8' | '9';
  jumlahSiswa: number;
  totalKasusTahunIni: number;
  kasusTerselesaikan: number;
  skorKeramahan: number; // 0 - 100
  statusZona: 'Hijau' | 'Kuning' | 'Merah';
  waliKelas: string;
  dutaAntiBullying: string;
  catatan: string;
  terakhirDiperiksa: string;
}

export interface SPDamaiRecord {
  id: string;
  nomorSurat: string;
  hariTanggal: string;
  tempatMediasi: string;
  // Pihak Pertama (Siswa I)
  namaPihak1: string;
  kelasPihak1: string;
  nisnPihak1?: string;
  peranPihak1?: string;
  tandaTanganPihak1?: string;
  // Pihak Kedua (Siswa II)
  namaPihak2: string;
  kelasPihak2: string;
  nisnPihak2?: string;
  peranPihak2?: string;
  tandaTanganPihak2?: string;
  // Perkara & Kesepakatan
  ringkasanMasalah: string;
  butirKesepakatan: string[];
  sanksiEdukasi?: string;
  // Mediator & Saksi
  namaSaksiGuru?: string;
  jabatanSaksiGuru?: string;
  tandaTanganSaksiGuru?: string;
  namaKonselorSebaya?: string;
  tandaTanganKonselorSebaya?: string;
  // Status
  status: 'Damai Permanen' | 'Aktif Terpantau' | 'Evaluasi Lanjutan';
  hasilPemantauan?: string;
  createdAt: string;
}

export interface ArsipKegiatanRecord {
  id: string;
  kodeArsip: string;
  namaKegiatan: string;
  kategori:
    | 'Sosialisasi Anti-Bullying'
    | 'Pelatihan Duta Sahabat'
    | 'Deklarasi Damai'
    | 'Workshop Literasi Positif'
    | 'Ice Breaking & Senam Ramah'
    | 'Monitoring & Evaluasi';
  hariTanggal: string;
  waktu: string;
  tempat: string;
  penyelenggara: string;
  sasaranPeserta: string;
  jumlahPeserta: number;
  deskripsiKegiatan: string;
  hasilNotulensi: string;
  linkFoto: string;
  linkDokumen?: string;
  tandaTanganKoordinator?: string;
  namaKoordinator?: string;
  jabatanKoordinator?: string;
  createdAt: string;
}

export type ActiveAppId =
  | 'zona_analitik'
  | 'piket_harian'
  | 'sabtu_beli_teh_ceri'
  | 'kebun_luas_berseri'
  | 'senandung_serasi'
  | 'e_lapor'
  | 'sp_damai'
  | 'arsip_kegiatan'
  | 'buku_tamu'
  | 'media_edukasi'
  | 'tutorial_flipbook'
  | 'hotline_bantuan'
  | string; // for custom link IDs

export type UserRole = 'admin' | 'siswa' | 'orang_tua' | 'guru';

export interface AuthUser {
  username: string;
  role: UserRole;
  displayName: string;
  loginTime: string;
}

