import {
  CustomLink,
  PiketHarianRecord,
  SabtuBeliTehCeriRecord,
  KebunLuasBerseriRecord,
  SenandungSerasiRecord,
  ELaporRecord,
  BukuTamuRecord,
  MediaEdukasiItem,
  KelasZonaStatus,
  SPDamaiRecord,
  ArsipKegiatanRecord,
  Siswa,
  Guru,
} from '../types';

export const INITIAL_CUSTOM_LINKS: CustomLink[] = [
  {
    id: 'link-portal-dikdas',
    title: 'Portal Merdeka Mengajar (PMM)',
    url: 'https://guru.kemdikbud.go.id',
    category: 'Akademik & Guru',
    description: 'Akses modul ajar, perangkat kurikulum merdeka & pelatihan mandiri.',
    iconName: 'GraduationCap',
    color: 'from-blue-600 to-indigo-600',
    openMode: 'embed',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'link-kemdikbud-ristek',
    title: 'Dapodik Kemendikbud',
    url: 'https://dapo.kemdikbud.go.id',
    category: 'Manajemen Sekolah',
    description: 'Sistem pendataan terpadu satuan pendidikan nasional.',
    iconName: 'Database',
    color: 'from-amber-500 to-orange-600',
    openMode: 'embed',
    createdAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'link-perpusda-pasuruan',
    title: 'Perpustakaan Digital Kota Pasuruan',
    url: 'https://perpusda.pasuruankota.go.id',
    category: 'Literasi',
    description: 'Koleksi e-book literasi siswa & referensi penguatan karakter.',
    iconName: 'BookOpen',
    color: 'from-emerald-500 to-teal-600',
    openMode: 'embed',
    createdAt: '2026-01-15T10:30:00.000Z',
  },
  {
    id: 'link-puspeka-kemdikbud',
    title: 'Pusat Penguatan Karakter (PUSPEKA)',
    url: 'https://cerdasberkarakter.kemdikbud.go.id',
    category: 'Anti-Perundungan',
    description: 'Panduan pencegahan perundungan, kekerasan seksual & intoleransi di sekolah.',
    iconName: 'ShieldCheck',
    color: 'from-purple-600 to-pink-600',
    openMode: 'embed',
    createdAt: '2026-01-20T11:00:00.000Z',
  }
];

export const INITIAL_PIKET_HARIAN: PiketHarianRecord[] = [
  {
    id: 'piket-1',
    hariTanggal: 'Senin, 15 September 2026',
    waktu: '06:45 - 13:30 WIB',
    namaAnggota: 'Ahmad Rizal, S.Pd & Siti Nurlaila, S.Pd',
    kelas: 'Semua Kelas (7A - 9H)',
    hasilTemuan: 'Seluruh kelas tertib saat doa bersama dan pembiasaan 5S di gerbang utama. Terdapat 2 siswa 8C datang terlambat 5 menit karena kendala rantai sepeda, telah diberikan edukasi disiplin ramah.',
    linkFoto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    keterangan: 'Kondisi lingkungan sekolah bersih, area kantin kejujuran higienis, situasi kelas kondusif.',
    createdAt: '2026-09-15T13:30:00.000Z',
  },
  {
    id: 'piket-2',
    hariTanggal: 'Selasa, 16 September 2026',
    waktu: '06:45 - 13:30 WIB',
    namaAnggota: 'Bambang Sudarmono, M.Pd & Dra. Endang Wahyuni',
    kelas: 'Zona Koridor Lantai 2 (Kelas 8)',
    hasilTemuan: 'Pemeriksaan kebersihan kelas selesai tepat waktu. Gerakan literasi 15 menit sebelum KBM berjalan aktif di setiap kelas 8A hingga 8H.',
    linkFoto: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    keterangan: 'Tidak ada indikasi perkelahian atau perselisihan antarsiswa. Terpantau Zona Hijau aman.',
    createdAt: '2026-09-16T13:30:00.000Z',
  },
];

export const INITIAL_SABTU_BELI_TEH_CERI: SabtuBeliTehCeriRecord[] = [
  {
    id: 'ceri-1',
    hariTanggal: 'Sabtu, 13 September 2026',
    waktu: '09:00 - 11:30 WIB',
    hasilTemuanSatuMinggu: 'Teridentifikasi 3 potensi kesalahpahaman antarsiswa di grup chatting ekstrakurikuler, berhasil diredam melalui bimbingan konseling sebaya Sahabat SPANJU sebelum meluas.',
    evaluasiKegiatan: 'Forum curhat mingguan berjalan sangat terbuka. Siswa merasa nyaman bercerita tanpa takut dihakimi atau di-bully.',
    rencanaInovasi: 'Meluncurkan kotak digital aspirasi rahasia "Bisik SPANJU" serta kampanye poster digital ramah jempol (etika bermedia sosial).',
    linkFoto: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    keterangan: 'Dihadiri oleh 16 perwakilan Duta Ramah Siswa Sahabat SPANJU dan 4 guru BK.',
    createdAt: '2026-09-13T12:00:00.000Z',
  }
];

export const INITIAL_KEBUN_LUAS_BERSERI: KebunLuasBerseriRecord[] = [
  {
    id: 'kebun-1',
    hariTanggal: 'Kamis, 28 Agustus 2026',
    waktu: '13:00 - 15:30 WIB',
    evaluasiProgramTerlaksana: 'Program Duta Sahabat SPANJU di 24 kelas telah aktif 100%. Pelaksanaan sapa pagi ramah anak dan sosialisasi pencegahan kekerasan perundungan mencapai 95% kepuasan peserta didik.',
    evaluasiKendalaSolusi: 'Kendala: Masih ada beberapa siswa yang belum paham batas antara bercanda dan micro-bullying. Solusi: Pembuatan infografis visual "Bercanda vs Membully" yang ditempel di mading digital kelas.',
    hasilInovasi: 'Mengintegrasikan QR Code aduan instan Sahabat SPANJU di setiap meja kelas yang langsung terhubung ke dashboard tim penanganan.',
    produkKreatif: 'Video pendek animasi anti-cyberbullying karya tim Multimedia SMPN 7 Pasuruan & E-Booklet Panduan Sekolah Ramah Anak SPANJU.',
    rencanaTindakLanjut: [
      { id: 'rtl-1', pic: 'Tim Kesiswaan & Guru BK', targetPelaksanaan: 'Pemasangan Barcode Aduan di 24 Kelas', deadline: '5 September 2026' },
      { id: 'rtl-2', pic: 'Duta Sahabat SPANJU', targetPelaksanaan: 'Workshop Peer Mentoring Siswa', deadline: '19 September 2026' },
      { id: 'rtl-3', pic: 'Koordinator Literasi', targetPelaksanaan: 'Penerbitan Majalah Dinding Digital No Bullying', deadline: '26 September 2026' },
    ],
    keterangan: 'Rapat evaluasi bulanan dipimpin langsung oleh Kepala SMPN 7 Pasuruan beserta Tim Pengembang Sekolah.',
    createdAt: '2026-08-28T16:00:00.000Z',
  }
];

export const INITIAL_SENANDUNG_SERASI: SenandungSerasiRecord[] = [
  {
    id: 'serasi-1',
    hariTanggal: 'Rabu, 17 September 2026',
    waktu: '07:00 - 07:30 WIB',
    pesanDisampaikan: '“Kekuatan kata-kata kita bisa menjadi lentera yang menerangi, atau bara yang melukai. Pilihlah kata yang menenangkan kawanmu hari ini. SMPN 7 Pasuruan rumah bersama yang aman dan membahagiakan.”',
    keterangan: 'Dibacakan melalui sistem audio sentral sekolah saat apel pagi pembiasaan karakter ramah anak.',
    kategoriLiterasi: 'Kata Mutiara & Penguatan Budi Pekerti',
    penulis: 'Duta Literasi SPANJU',
    createdAt: '2026-09-17T07:30:00.000Z',
  },
  {
    id: 'serasi-2',
    hariTanggal: 'Jumat, 12 September 2026',
    waktu: '07:00 - 07:30 WIB',
    pesanDisampaikan: '“Sahabat sejati bukan yang menguji kelemahanmu, melainkan yang merangkul dan melindungi kehormatanmu. Berani bicara, hentikan perundungan di sekitar kita!”',
    keterangan: 'Refleksi Jumat Berkah & Ramah Anak di aula terbuka SMPN 7 Pasuruan.',
    kategoriLiterasi: 'Solidaritas & Keberanian Melindungi Teman',
    penulis: 'Tim BK & Sahabat SPANJU',
    createdAt: '2026-09-12T07:30:00.000Z',
  }
];

export const INITIAL_E_LAPOR: ELaporRecord[] = [
  {
    id: 'lapor-001',
    kodeLaporan: 'SPJ-2026-09-001',
    hariTanggal: 'Senin, 08 September 2026',
    waktuKejadian: '10:15 WIB (Jam Istirahat Pertama)',
    namaSiswa: 'Siswa Inisial AR & DF',
    kelas: '8E & 8F',
    kronologiKejadian: 'Terjadi ejekan verbal terkait fisik saat bermain sepak bola di lapangan tengah sekolah yang hampir memicu adu fisik antar kelompok bermain.',
    kegiatanPenyadaran: 'Pemanggilan kedua pihak ke ruang mediasi damai; refleksi dampak psikologis kata-kata ejekan terhadap rasa percaya diri kawan.',
    kegiatanPencegahan: 'Pemberian edukasi sportivitas bermain di lapangan oleh guru Penjasorkes dan Duta Sahabat SPANJU.',
    kegiatanPenangananRespon: 'Mediasi tatap muka didampingi wali kelas dan guru BK; kedua siswa saling memaafkan dan menandatangani komitmen damai tanpa kekerasan.',
    kegiatanPelaporan: 'Pencatatan rekapitulasi penanganan dalam buku register BK dan konfirmasi lisan kepada orang tua masing-masing.',
    tindakLanjut: 'Pemantauan berkala selama 2 minggu oleh Duta Sahabat SPANJU kelas 8E & 8F. Hubungan kedua siswa kini kembali rukun.',
    keterangan: 'Kasus selesai 100% dan kelas 8E serta 8F kembali berstatus Zona Hijau Aman.',
    status: 'Selesai',
    kategoriKasus: 'Verbal',
    createdAt: '2026-09-08T11:00:00.000Z',
  },
  {
    id: 'lapor-002',
    kodeLaporan: 'SPJ-2026-09-002',
    hariTanggal: 'Rabu, 10 September 2026',
    waktuKejadian: '14:00 WIB (Sepulang Sekolah)',
    namaSiswa: 'Siswa Inisial MN',
    kelas: '7C',
    kronologiKejadian: 'Menerima pesan bernada mengejek di komentar media sosial Instagram dari akun anonim teman sebaya.',
    kegiatanPenyadaran: 'Edukasi literasi digital ramah: jejak digital dan etika bermedia sosial.',
    kegiatanPencegahan: 'Sosialisasi "Internet Sehat Tanpa Cyberbullying" pada sesi pembiasaan kelas.',
    kegiatanPenangananRespon: 'Pendampingan psikososial oleh guru BK; pemblokiran akun pengganggu dan klarifikasi damai antar orang tua.',
    kegiatanPelaporan: 'Laporan tercatat dalam rekapitulasi tim E-Lapor SPANJU.',
    tindakLanjut: 'Siswa MN didampingi oleh konselor sebaya untuk mengembalikan rasa percaya diri.',
    keterangan: 'Status terpantau aman tanpa trauma berlanjut.',
    status: 'Terpantau Aman',
    kategoriKasus: 'Siber',
    createdAt: '2026-09-10T14:30:00.000Z',
  }
];

export const INITIAL_BUKU_TAMU: BukuTamuRecord[] = [
  {
    id: 'tamu-1',
    hariTanggal: 'Selasa, 16 September 2026',
    jamKedatangan: '08:30 WIB',
    namaLengkap: 'Drs. H. Mulyadi, M.Pd',
    nipNik: '197104151998021004',
    jabatan: 'Pengawas Sekolah Madya',
    instansiAsal: 'Dinas Pendidikan dan Kebudayaan Kota Pasuruan',
    tujuanKunjungan: 'Supervisi dan Monev Implementasi Program Sekolah Ramah Anak & No Bullying di SMPN 7 Pasuruan',
    tandaTanganUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10,40 Q50,5 90,35 T170,25" stroke="%2310b981" stroke-width="3" fill="none"/></svg>',
    tindakLanjut: 'Apresiasi sistem dashboard digital Sahabat SPANJU; direkomendasikan menjadi percontohan bagi SMP se-Kota Pasuruan.',
    keterangan: 'Kunjungan berjalan tertib, diterima oleh Kepala Sekolah dan Tim Pengembang SPANJU.',
    createdAt: '2026-09-16T08:30:00.000Z',
  },
  {
    id: 'tamu-2',
    hariTanggal: 'Jumat, 12 September 2026',
    jamKedatangan: '09:15 WIB',
    namaLengkap: 'Dr. Retno Sulistyowati, M.Psi',
    nipNik: '3575025501860002',
    jabatan: 'Psikolog Anak & Konsultan Karakter',
    instansiAsal: 'Yayasan Lentera Jiwa Anak Jawa Timur',
    tujuanKunjungan: 'Koordinasi Pelatihan Peer Counselor Sahabat SPANJU untuk Duta Anti-Perundungan',
    tandaTanganUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M15,35 Q60,10 110,45 T180,20" stroke="%233b82f6" stroke-width="3" fill="none"/></svg>',
    tindakLanjut: 'Pemberian materi modul workshop digital untuk 48 duta siswa di akhir bulan.',
    keterangan: 'Kerjasama resmi tindak lanjut perlindungan anak di satuan pendidikan.',
    createdAt: '2026-09-12T09:15:00.000Z',
  }
];

export const INITIAL_MEDIA_EDUKASI: MediaEdukasiItem[] = [
  {
    id: 'med-1',
    judul: 'Panduan Praktis Mengenali & Menghentikan Perundungan di Sekolah',
    tipe: 'modul',
    kategori: 'Pencegahan Perundungan',
    dokumentasiMateriUrl: 'https://cerdasberkarakter.kemdikbud.go.id/perundungan',
    pesanEdukatif: 'Perundungan bukan sekadar candaan biasa. Jika salah satu pihak merasa tertekan, sakit hati, atau takut, itu adalah perundungan. Bersama kita jaga SPANJU tetap nyaman dan membanggakan!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    sumber: 'Tim BK & Satgas PUSPEKA SMPN 7 Pasuruan',
    tanggal: '10 September 2026',
  }
];

// 24 Classes: 7A - 7H, 8A - 8H, 9A - 9H
export const INITIAL_KELAS_ZONA: KelasZonaStatus[] = [
  // Tingkat 7
  { kelas: '7A', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Hijau', waliKelas: 'Dra. Sri Wahyuni', dutaAntiBullying: 'Nadhira Putri & Fathan Al-Ghazi', catatan: 'Kelas teladan keharmonisan dan solidaritas', terakhirDiperiksa: '16 September 2026' },
  { kelas: '7B', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Hijau', waliKelas: 'Agus Subekti, S.Pd', dutaAntiBullying: 'Bagas Pratama & Zahra Kirana', catatan: 'Aktif pembiasaan sapa pagi dan pojok baca', terakhirDiperiksa: '16 September 2026' },
  { kelas: '7C', tingkat: '7', jumlahSiswa: 31, totalKasusTahunIni: 1, kasusTerselesaikan: 1, skorKeramahan: 92, statusZona: 'Hijau', waliKelas: 'Nurul Hidayati, M.Pd', dutaAntiBullying: 'Dimas Wicaksono & Salma Alya', catatan: 'Insiden siber terselesaikan cepat lewat mediasi damai', terakhirDiperiksa: '16 September 2026' },
  { kelas: '7D', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Hijau', waliKelas: 'Ahmad Fauzi, S.Pd', dutaAntiBullying: 'Rizky Ramadhan & Dewi Lestari', catatan: 'Suasana kelas kondusif dan saling mendukung', terakhirDiperiksa: '15 September 2026' },
  { kelas: '7E', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Hijau', waliKelas: 'Rina Sulistyaningsih, S.Pd', dutaAntiBullying: 'Kevin Aditia & Melati Sukma', catatan: 'Kompak dalam kegiatan piket dan diskusi kelas', terakhirDiperiksa: '15 September 2026' },
  { kelas: '7F', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Hijau', waliKelas: 'Mohammad Taufik, S.Pd', dutaAntiBullying: 'Aldi Firmansyah & Annisa Rahma', catatan: 'Lingkungan kelas bersih dan anti perundungan', terakhirDiperiksa: '14 September 2026' },
  { kelas: '7G', tingkat: '7', jumlahSiswa: 30, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Hijau', waliKelas: 'Tri Wahyuningrum, M.Pd', dutaAntiBullying: 'Fauzan Hidayat & Intan Permata', catatan: 'Toleransi tinggi antarkeragaman latar belakang', terakhirDiperiksa: '14 September 2026' },
  { kelas: '7H', tingkat: '7', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Hijau', waliKelas: 'Yusuf Wibowo, S.Pd', dutaAntiBullying: 'Rian Syahputra & Citra Cantika', catatan: 'Kelas pelopor bebas kata-kata kasar', terakhirDiperiksa: '14 September 2026' },

  // Tingkat 8
  { kelas: '8A', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 99, statusZona: 'Hijau', waliKelas: 'Drs. Supriyadi', dutaAntiBullying: 'Ilyas Firdaus & Naura Shafa', catatan: 'Juara kelas paling ramah anak semester lalu', terakhirDiperiksa: '16 September 2026' },
  { kelas: '8B', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Hijau', waliKelas: 'Eni Purwanti, S.Pd', dutaAntiBullying: 'Galang Saputra & Tiara Maulida', catatan: 'Saling mengingatkan tatakrama dan sopan santun', terakhirDiperiksa: '16 September 2026' },
  { kelas: '8C', tingkat: '8', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 94, statusZona: 'Hijau', waliKelas: 'Slamet Harianto, S.Pd', dutaAntiBullying: 'Wahyu Nugroho & Cindy Claudia', catatan: 'Kerapatan komunikasi orang tua dan paguyuban kelas tinggi', terakhirDiperiksa: '15 September 2026' },
  { kelas: '8D', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Hijau', waliKelas: 'Indah Kusumawardhani, M.Pd', dutaAntiBullying: 'Rafi Pratama & Aisyah Bella', catatan: 'Duta kelas aktif mengadakan kuis literasi karakter', terakhirDiperiksa: '15 September 2026' },
  { kelas: '8E', tingkat: '8', jumlahSiswa: 31, totalKasusTahunIni: 1, kasusTerselesaikan: 1, skorKeramahan: 93, statusZona: 'Hijau', waliKelas: 'Hadi Siswanto, S.Pd', dutaAntiBullying: 'Farel Danendra & Safira Nur', catatan: 'Kasus gesekan lapangan bola telah diselesaikan damai', terakhirDiperiksa: '15 September 2026' },
  { kelas: '8F', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 1, kasusTerselesaikan: 1, skorKeramahan: 92, statusZona: 'Hijau', waliKelas: 'Lilik Handayani, S.Pd', dutaAntiBullying: 'Gibran Athalla & Nadine Chelsea', catatan: 'Dalam pemantauan positif konselor sebaya SPANJU', terakhirDiperiksa: '15 September 2026' },
  { kelas: '8G', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Hijau', waliKelas: 'Joko Susilo, S.Pd', dutaAntiBullying: 'Fikri Haikal & Kayla Azzahra', catatan: 'Siswa saling menyapa dengan hangat dan tertib', terakhirDiperiksa: '14 September 2026' },
  { kelas: '8H', tingkat: '8', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Hijau', waliKelas: 'Maya Anggraini, M.Pd', dutaAntiBullying: 'Bima Satria & Viona Rahmadani', catatan: 'Sangat peduli kebersihan dan saling membantu tugas', terakhirDiperiksa: '14 September 2026' },

  // Tingkat 9
  { kelas: '9A', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Hijau', waliKelas: 'Dra. Hj. Nur Aini', dutaAntiBullying: 'Zaki Mubarak & Amira Hasna', catatan: 'Keteladanan kepemimpinan siswa tingkat akhir', terakhirDiperiksa: '16 September 2026' },
  { kelas: '9B', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Hijau', waliKelas: 'Kuswanto, M.Pd', dutaAntiBullying: 'Daffa Erlangga & Keysha Aurelia', catatan: 'Fokus persiapan akademik dengan suasana damai', terakhirDiperiksa: '16 September 2026' },
  { kelas: '9C', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Hijau', waliKelas: 'Endah Sulistyowati, S.Pd', dutaAntiBullying: 'Gilang Maulana & Talitha Zahra', catatan: 'Solidaritas kelompok belajar sangat tinggi', terakhirDiperiksa: '15 September 2026' },
  { kelas: '9D', tingkat: '9', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Hijau', waliKelas: 'Drs. Suwarno', dutaAntiBullying: 'Hafizh Akbar & Nayla Putri', catatan: 'Memiliki komitmen zona bebas perundungan 100%', terakhirDiperiksa: '15 September 2026' },
  { kelas: '9E', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Hijau', waliKelas: 'Siti Maryam, S.Pd', dutaAntiBullying: 'Raditya Arya & Chelsea Olivia', catatan: 'Aktif menginisiasi mentoring sebaya untuk adik kelas', terakhirDiperiksa: '14 September 2026' },
  { kelas: '9F', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Hijau', waliKelas: 'Edi Santoso, S.Pd', dutaAntiBullying: 'Vino Bastian & Sherly Novita', catatan: 'Komunikasi antar siswa santun dan saling menghormati', terakhirDiperiksa: '14 September 2026' },
  { kelas: '9G', tingkat: '9', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Hijau', waliKelas: 'Ratna Dwi Astuti, M.Pd', dutaAntiBullying: 'Teguh Prasetyo & Febiola Ananta', catatan: 'Seluruh siswa menandatangani piagam janji ramah kawan', terakhirDiperiksa: '14 September 2026' },
  { kelas: '9H', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Hijau', waliKelas: 'Budi Utomo, S.Pd', dutaAntiBullying: 'Satria Dewa & Clarissa Bella', catatan: 'Kondusif, nol insiden, predikat Zona Hijau Bintang Lima', terakhirDiperiksa: '14 September 2026' },
];

export const MONTHLY_TREND_DATA = [
  { bulan: 'Okt 2025', kasusDilaporkan: 7, kasusTerselesaikan: 6, indeksKeramahan: 81 },
  { bulan: 'Nov 2025', kasusDilaporkan: 5, kasusTerselesaikan: 5, indeksKeramahan: 85 },
  { bulan: 'Des 2025', kasusDilaporkan: 3, kasusTerselesaikan: 3, indeksKeramahan: 89 },
  { bulan: 'Jan 2026', kasusDilaporkan: 4, kasusTerselesaikan: 4, indeksKeramahan: 91 },
  { bulan: 'Feb 2026', kasusDilaporkan: 2, kasusTerselesaikan: 2, indeksKeramahan: 94 },
  { bulan: 'Mar 2026', kasusDilaporkan: 2, kasusTerselesaikan: 2, indeksKeramahan: 95 },
  { bulan: 'Apr 2026', kasusDilaporkan: 1, kasusTerselesaikan: 1, indeksKeramahan: 96 },
  { bulan: 'Mei 2026', kasusDilaporkan: 1, kasusTerselesaikan: 1, indeksKeramahan: 97 },
  { bulan: 'Jun 2026', kasusDilaporkan: 0, kasusTerselesaikan: 0, indeksKeramahan: 98 },
  { bulan: 'Jul 2026', kasusDilaporkan: 2, kasusTerselesaikan: 2, indeksKeramahan: 95 },
  { bulan: 'Agu 2026', kasusDilaporkan: 1, kasusTerselesaikan: 1, indeksKeramahan: 96 },
  { bulan: 'Sep 2026', kasusDilaporkan: 0, kasusTerselesaikan: 0, indeksKeramahan: 98.2 },
];

export const CATEGORY_BREAKDOWN_DATA = [
  { name: 'Verbal (Ejekan/Julukan)', value: 45, color: '#f59e0b' },
  { name: 'Siber (Medsos/Grup Chat)', value: 25, color: '#3b82f6' },
  { name: 'Sosial / Pengucilan', value: 20, color: '#a855f7' },
  { name: 'Fisik (Dorongan/Gesekan)', value: 10, color: '#ef4444' },
];

export const INITIAL_SP_DAMAI: SPDamaiRecord[] = [
  {
    id: 'sp-damai-001',
    nomorSurat: '001/SP-DAMAI/SPANJU/IX/2026',
    hariTanggal: 'Senin, 14 September 2026',
    tempatMediasi: 'Ruang Konseling Ramah Sahabat SPANJU / BK',
    namaPihak1: 'Bintang Ramadhan',
    kelasPihak1: '8E',
    nisnPihak1: '0098231201',
    peranPihak1: 'Pihak Pertama (Siswa I)',
    namaPihak2: 'Dimas Kurniawan',
    kelasPihak2: '8E',
    nisnPihak2: '0098231245',
    peranPihak2: 'Pihak Kedua (Siswa II)',
    ringkasanMasalah: 'Terjadi kesalahpahaman dan adu argumen saat pertandingan futsal antar kelas di lapangan sekolah yang memicu gesekan verbal serta saling dorong.',
    butirKesepakatan: [
      'Kedua belah pihak dengan tulus hati saling memaafkan dan berjanji tidak memendam rasa dendam.',
      'Berjanji tidak akan mengulangi perbuatan mengejek, mendorong, maupun memprovokasi baik di lingkungan sekolah maupun di luar sekolah.',
      'Saling berkomitmen menjaga persahabatan serta mendukung terciptanya Zona Hijau Tanpa Bullying di kelas 8E dan SMPN 7 Pasuruan.',
      'Apabila di kemudian hari salah satu pihak melanggar perjanjian damai ini, bersedia menerima sanksi edukatif sesuai Tata Tertib Sekolah dan rekomendasi TPPK.'
    ],
    sanksiEdukasi: 'Kedua siswa sepakat bersama-sama merawat taman literasi kelas 8E selama 1 pekan dan membuat poster ajakan persahabatan.',
    namaSaksiGuru: 'Drs. Supriyadi / Hadi Siswanto, S.Pd',
    jabatanSaksiGuru: 'Guru BK / Wali Kelas 8E UPTD SMPN 7 Pasuruan',
    namaKonselorSebaya: 'Aulia Rahma (Duta Sahabat SPANJU Kelas 8)',
    status: 'Damai Permanen',
    hasilPemantauan: 'Keduanya sudah duduk berdampingan dan bekerja sama dalam kelompok belajar dengan rukun.',
    createdAt: '2026-09-14T11:30:00.000Z',
  },
  {
    id: 'sp-damai-002',
    nomorSurat: '002/SP-DAMAI/SPANJU/IX/2026',
    hariTanggal: 'Jumat, 11 September 2026',
    tempatMediasi: 'Ruang Layanan Bimbingan Konseling UPTD SMPN 7 Pasuruan',
    namaPihak1: 'Farhan Aditya',
    kelasPihak1: '7C',
    nisnPihak1: '0101923412',
    peranPihak1: 'Pihak Pertama (Siswa I)',
    namaPihak2: 'Rizky Pratama',
    kelasPihak2: '7C',
    nisnPihak2: '0101923890',
    peranPihak2: 'Pihak Kedua (Siswa II)',
    ringkasanMasalah: 'Penggunaan julukan nama orang tua di grup percakapan WhatsApp kelas yang menyinggung perasaan salah satu siswa.',
    butirKesepakatan: [
      'Pihak pertama mengakui kekhilafan dan meminta maaf secara terbuka di hadapan konselor sebaya dan guru BK.',
      'Pihak kedua menerima permohonan maaf dengan ikhlas dan berjanji tidak memperpanjang masalah.',
      'Kedua pihak berikrar menjaga etika berkomunikasi santun di media sosial dan grup chat kelas.',
      'Bersedia menjadi teladan tata krama berbicara sopan di lingkungan UPTD SMP Negeri 7 Pasuruan.'
    ],
    sanksiEdukasi: 'Membaca dan merangkum buku inspirasi persahabatan di perpustakaan digital sekolah.',
    namaSaksiGuru: 'Hj. Siti Aminah, S.Pd',
    jabatanSaksiGuru: 'Koordinator Bimbingan Konseling & TPPK',
    namaKonselorSebaya: 'Kayla Azzahra (Duta Konselor Sebaya SPANJU)',
    status: 'Aktif Terpantau',
    hasilPemantauan: 'Situasi grup kelas kondusif, interaksi tatap muka berjalan wajar dan saling menghormati.',
    createdAt: '2026-09-11T13:45:00.000Z',
  }
];

export const INITIAL_ARSIP_KEGIATAN: ArsipKegiatanRecord[] = [
  {
    id: 'arsip-001',
    kodeArsip: 'ARSIP-SPJ-2026-001',
    namaKegiatan: 'Deklarasi Damai & Penandatanganan Komitmen Bersama Sekolah Ramah Anak',
    kategori: 'Deklarasi Damai',
    hariTanggal: 'Senin, 01 September 2026',
    waktu: '07:00 - 08:30 WIB (Upacara Bendera & Gelar Aksi)',
    tempat: 'Lapangan Utama UPTD SMP Negeri 7 Pasuruan',
    penyelenggara: 'Tim TPPK, OSIS & Duta Sahabat SPANJU',
    sasaranPeserta: 'Seluruh Siswa Kelas 7, 8, 9, Dewan Guru dan Staf Tata Usaha',
    jumlahPeserta: 768,
    deskripsiKegiatan: 'Aksi deklarasi massal ikrar anti-bullying, penyematan pin Sahabat SPANJU pada 24 perwakilan duta kelas, dan pembubuhan cap tangan warna-warni pada kain spanduk komitmen damai sepanjang 20 meter.',
    hasilNotulensi: 'Terwujudnya kesepakatan bersama seluruh warga sekolah untuk mewujudkan Zero Bullying di lingkungan SMPN 7 Pasuruan. Kain komitmen dipajang di selasar depan sekolah sebagai pengingat harian.',
    linkFoto: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    linkDokumen: 'https://drive.google.com/drive/folders/spanju-deklarasi-damai-2026',
    namaKoordinator: 'Drs. Akhmad Fauzi, M.Pd. / Tim TPPK',
    jabatanKoordinator: 'Kepala Sekolah & Tim Pencegahan Penanganan Kekerasan',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'arsip-002',
    kodeArsip: 'ARSIP-SPJ-2026-002',
    namaKegiatan: 'Workshop & Pelatihan Duta Konselor Sebaya Sahabat SPANJU Angkatan 2026',
    kategori: 'Pelatihan Duta Sahabat',
    hariTanggal: 'Sabtu, 06 September 2026',
    waktu: '08:00 - 12:30 WIB',
    tempat: 'Aula Terbuka Graha Adiwiyata SMPN 7 Pasuruan',
    penyelenggara: 'Guru Bimbingan Konseling & Duta Sahabat SPANJU',
    sasaranPeserta: '48 Perwakilan Duta Siswa Putra & Putri dari 24 Kelas (7A-9H)',
    jumlahPeserta: 48,
    deskripsiKegiatan: 'Pelatihan teknik active listening (mendengar aktif), identifikasi dini tanda-tanda stres/perundungan pada kawan sebaya, mekanisme alur eskalasi aduan ke guru BK, dan simulasi penanganan mediasi damai tanpa kekerasan.',
    hasilNotulensi: '48 duta lulus pelatihan dan dibekali buku saku "Duta Sahabat SPANJU Ceria". Jadwal piket konselor sebaya harian diresmikan mulai Senin berikutnya.',
    linkFoto: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    linkDokumen: 'https://drive.google.com/file/d/modul-pelatihan-konselor-sebaya-spanju',
    namaKoordinator: 'Hj. Siti Aminah, S.Pd',
    jabatanKoordinator: 'Koordinator BK & Fasilitator Ramah Anak',
    createdAt: '2026-09-06T13:00:00.000Z',
  },
  {
    id: 'arsip-003',
    kodeArsip: 'ARSIP-SPJ-2026-003',
    namaKegiatan: 'Sosialisasi Cerdas Bermedia Sosial: Lindungi Diri dari Cyberbullying',
    kategori: 'Sosialisasi Anti-Bullying',
    hariTanggal: 'Rabu, 09 September 2026',
    waktu: '09:45 - 11:15 WIB',
    tempat: 'Laboratorium Komputer & Ruang Multimedia SPANJU',
    penyelenggara: 'Tim IT Sekolah & Duta Literasi Digital SPANJU',
    sasaranPeserta: 'Perwakilan Pengurus Kelas & Siswa Kelas 7',
    jumlahPeserta: 96,
    deskripsiKegiatan: 'Pemberian wawasan jejak digital, dampak hukum UU ITE, pencegahan perundungan di platform WhatsApp/Instagram/TikTok, serta demonstrasi pemanfaatan fitur E-Lapor Sahabat SPANJU.',
    hasilNotulensi: 'Siswa memahami pentingnya privasi digital dan berkomitmen menolak konten kebencian atau body shaming di grup kelas masing-masing.',
    linkFoto: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    linkDokumen: 'https://drive.google.com/drive/folders/materi-cyberbullying-spanju',
    namaKoordinator: 'Budi Utomo, S.Pd',
    jabatanKoordinator: 'Pembina OSIS & Tim Literasi Digital',
    createdAt: '2026-09-09T11:45:00.000Z',
  },
  {
    id: 'arsip-004',
    kodeArsip: 'ARSIP-SPJ-2026-004',
    namaKegiatan: 'Giat Senandung Serasi & Senam Sehat Gembira Sahabat SPANJU',
    kategori: 'Ice Breaking & Senam Ramah',
    hariTanggal: 'Jumat, 12 September 2026',
    waktu: '06:30 - 07:45 WIB',
    tempat: 'Halaman Olahraga & Panggung Ekspresi SPANJU',
    penyelenggara: 'Duta Sahabat SPANJU & Guru PJOK',
    sasaranPeserta: 'Seluruh Siswa, Guru & Tenaga Kependidikan',
    jumlahPeserta: 750,
    deskripsiKegiatan: 'Senam kebersamaan bersama musik ceria, pembacaan pantun persahabatan Senandung Serasi oleh perwakilan kelas 8A dan 9C, serta pembagian reward stiker "Kawan Keren Tanpa Bullying".',
    hasilNotulensi: 'Membangun keakraban antar tingkatan kelas (7, 8, dan 9), menurunkan ketegangan fisik menjelang KBM, dan mempererat tali silaturahmi warga sekolah.',
    linkFoto: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    linkDokumen: 'https://drive.google.com/drive/folders/senam-serasi-spanju-2026',
    namaKoordinator: 'Joko Susilo, S.Pd',
    jabatanKoordinator: 'Guru PJOK & Koordinator Giat Siswa',
    createdAt: '2026-09-12T08:30:00.000Z',
  }
];

export const INITIAL_SISWA: Siswa[] = [
  { id: 'sw-1', nisn: '0012345678', nama: 'Ahmad Fauzi', kelas: '7A', jenisKelamin: 'L', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'sw-2', nisn: '0023456789', nama: 'Siti Aminah', kelas: '8B', jenisKelamin: 'P', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'sw-3', nisn: '0034567890', nama: 'Rizky Ramadhan', kelas: '7D', jenisKelamin: 'L', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'sw-4', nisn: '0045678901', nama: 'Nadhira Putri', kelas: '7A', jenisKelamin: 'P', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'sw-5', nisn: '0056789012', nama: 'Ilyas Firdaus', kelas: '8A', jenisKelamin: 'L', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'sw-6', nisn: '0067890123', nama: 'Zaki Mubarak', kelas: '9A', jenisKelamin: 'L', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'sw-7', nisn: '0078901234', nama: 'Mukhammad Nauval Firdaus', kelas: '8D', jenisKelamin: 'L', createdAt: '2026-01-10T08:00:00.000Z' },
];

export const INITIAL_GURU: Guru[] = [
  { id: 'gr-1', nip: '198311162009042003', nama: 'Wiwik Ismiati, S.Pd', jabatan: 'Guru BK & Pembina Sahabat SPANJU', status: 'PNS', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'gr-2', nip: '197508122005011006', nama: 'Drs. Supriyadi', jabatan: 'Wali Kelas 8A', status: 'PNS', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'gr-3', nip: '198003152008012015', nama: 'Nurul Hidayati, M.Pd', jabatan: 'Wali Kelas 7C & Satgas Anti Kekerasan', status: 'PNS', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'gr-4', nip: '199402142022212014', nama: 'Eki Febriani, S.Pd', jabatan: 'Duta Literasi Karakter', status: 'PPPK', createdAt: '2026-01-10T08:00:00.000Z' },
];

