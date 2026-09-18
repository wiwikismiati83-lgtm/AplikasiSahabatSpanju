import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 'https://puxdfawtyeedcpqoench.supabase.co';
const supabaseKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_c289xcQ6X5XlSpfuquVNDg_q0dDWXrH';

const supabase = createClient(supabaseUrl, supabaseKey);

const camelToLowerMap: Record<string, string> = {
  createdat: 'createdAt',
  openmode: 'openMode',
  iconname: 'iconName',
  haritanggal: 'hariTanggal',
  namaanggota: 'namaAnggota',
  hasiltemuan: 'hasilTemuan',
  linkfoto: 'linkFoto',
  tandatanganurl: 'tandaTanganUrl',
  namapenandatangan: 'namaPenandatangan',
  nippenandatangan: 'nipPenandatangan',
  jabatanpenandatangan: 'jabatanPenandatangan',
  hasiltemuansatuminggu: 'hasilTemuanSatuMinggu',
  evaluasikegiatan: 'evaluasiKegiatan',
  rencanainovasi: 'rencanaInovasi',
  targetpelaksanaan: 'targetPelaksanaan',
  evaluasiprogramterlaksana: 'evaluasiProgramTerlaksana',
  evaluasikendalasolusi: 'evaluasiKendalaSolusi',
  hasilinovasi: 'hasilInovasi',
  produkkreatif: 'produkKreatif',
  rencanatindaklanjut: 'rencanaTindakLanjut',
  pesandisampaikan: 'pesanDisampaikan',
  kategoriliterasi: 'kategoriLiterasi',
  kodelaporan: 'kodeLaporan',
  waktukejadian: 'waktuKejadian',
  namasiswa: 'namaSiswa',
  nisnsiswa: 'nisnSiswa',
  namasiswa2: 'namaSiswa2',
  kelas2: 'kelas2',
  nisnsiswa2: 'nisnSiswa2',
  kronologikejadian: 'kronologiKejadian',
  kegiatanpenyadaran: 'kegiatanPenyadaran',
  kegiatanpencegahan: 'kegiatanPencegahan',
  kegiatanpenangananrespon: 'kegiatanPenangananRespon',
  kegiatanpelaporan: 'kegiatanPelaporan',
  tindaklanjut: 'tindakLanjut',
  kategorikasus: 'kategoriKasus',
  tandatanganpetugasurl: 'tandaTanganPetugasUrl',
  namapetugas: 'namaPetugas',
  jamkedatangan: 'jamKedatangan',
  namalengkap: 'namaLengkap',
  nipnik: 'nipNik',
  instansiasal: 'instansiAsal',
  tujuankunjungan: 'tujuanKunjungan',
  thumbnailurl: 'thumbnailUrl',
  dokumentasimateriurl: 'dokumentasiMateriUrl',
  pesanedukatif: 'pesanEdukatif',
  jumlahsiswa: 'jumlahSiswa',
  totalkasustahunini: 'totalKasusTahunIni',
  kasusterselesaikan: 'kasusTerselesaikan',
  skorkeramahan: 'skorKeramahan',
  statuszona: 'statusZona',
  walikelas: 'waliKelas',
  dutaantibullying: 'dutaAntiBullying',
  terakhirdiperiksa: 'terakhirDiperiksa',
  nomorsurat: 'nomorSurat',
  tempatmediasi: 'tempatMediasi',
  namapihak1: 'namaPihak1',
  kelaspihak1: 'kelasPihak1',
  nisnpihak1: 'nisnPihak1',
  peranpihak1: 'peranPihak1',
  tandatanganpihak1: 'tandaTanganPihak1',
  namapihak2: 'namaPihak2',
  kelaspihak2: 'kelasPihak2',
  nisnpihak2: 'nisnPihak2',
  peranpihak2: 'peranPihak2',
  tandatanganpihak2: 'tandaTanganPihak2',
  ringkasanmasalah: 'ringkasanMasalah',
  butirkesepakatan: 'butirKesepakatan',
  sanksiedukasi: 'sanksiEdukasi',
  namasaksiguru: 'namaSaksiGuru',
  nipsaksiguru: 'nipSaksiGuru',
  jabatansaksiguru: 'jabatanSaksiGuru',
  tandatangansaksiguru: 'tandaTanganSaksiGuru',
  namakonselorsebaya: 'namaKonselorSebaya',
  tandatangankonselorsebaya: 'tandaTanganKonselorSebaya',
  hasilpemantauan: 'hasilPemantauan',
  kodearsip: 'kodeArsip',
  namakegiatan: 'namaKegiatan',
};

const toLowerKeys = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toLowerKeys);
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key.toLowerCase()] = toLowerKeys(obj[key]);
    }
    return newObj;
  }
  return obj;
};

const toCamelKeys = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelKeys);
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      const camelKey = camelToLowerMap[key.toLowerCase()] || key;
      newObj[camelKey] = toCamelKeys(obj[key]);
    }
    return newObj;
  }
  return obj;
};

const KNOWN_TABLE_COLUMNS: Record<string, string[]> = {
  e_lapor_records: [
    'id', 'kodelaporan', 'haritanggal', 'waktukejadian', 'namasiswa', 'kelas',
    'kronologikejadian', 'kegiatanpenyadaran', 'kegiatanpencegahan',
    'kegiatanpenangananrespon', 'kegiatanpelaporan', 'tindaklanjut',
    'keterangan', 'status', 'kategorikasus', 'tandatanganurl',
    'namapenandatangan', 'jabatanpenandatangan', 'tandatanganpetugasurl',
    'namapetugas', 'createdat', 'createdAt'
  ],
  sp_damai_records: [
    'id', 'nomorsurat', 'haritanggal', 'tempatmediasi', 'namapihak1',
    'kelaspihak1', 'nisnpihak1', 'peranpihak1', 'tandatanganpihak1',
    'namapihak2', 'kelaspihak2', 'nisnpihak2', 'peranpihak2',
    'tandatanganpihak2', 'ringkasanmasalah', 'butirkesepakatan',
    'sanksiedukasi', 'namasaksiguru', 'jabatansaksiguru',
    'tandatangansaksiguru', 'namakonselorsebaya',
    'tandatangankonselorsebaya', 'status', 'hasilpemantauan', 'createdat', 'createdAt'
  ],
  buku_tamu_records: [
    'id', 'haritanggal', 'jamkedatangan', 'namalengkap', 'nipnik',
    'jabatan', 'instansiasal', 'tujuankunjungan', 'tandatanganurl',
    'namapenandatangan', 'jabatanpenandatangan', 'tindaklanjut',
    'keterangan', 'createdat', 'createdAt'
  ],
  piket_records: [
    'id', 'haritanggal', 'waktu', 'namaanggota', 'kelas', 'hasiltemuan',
    'linkfoto', 'keterangan', 'tandatanganurl', 'namapenandatangan',
    'jabatanpenandatangan', 'createdat', 'createdAt'
  ],
  ceri_records: [
    'id', 'haritanggal', 'waktu', 'hasiltemuansatuminggu',
    'evaluasikegiatan', 'rencanainovasi', 'linkfoto', 'keterangan',
    'tandatanganurl', 'namapenandatangan', 'jabatanpenandatangan', 'createdat', 'createdAt'
  ],
  kebun_records: [
    'id', 'haritanggal', 'waktu', 'evaluasiprogramterlaksana',
    'evaluasikendalasolusi', 'hasilinovasi', 'produkkreatif',
    'rencanatindaklanjut', 'keterangan', 'tandatanganurl',
    'namapenandatangan', 'jabatanpenandatangan', 'createdat', 'createdAt'
  ],
  serasi_records: [
    'id', 'haritanggal', 'waktu', 'pesandisampaikan', 'keterangan',
    'kategoriliterasi', 'penulis', 'tandatanganurl', 'namapenandatangan',
    'jabatanpenandatangan', 'createdat', 'createdAt'
  ],
  arsip_records: [
    'id', 'kodearsip', 'namakegiatan', 'kategori', 'haritanggal', 'waktu',
    'tempat', 'penyelenggara', 'sasaranpeserta', 'jumlahpeserta',
    'deskripsikegiatan', 'hasilnotulensi', 'linkfoto', 'linkdokumen',
    'tandatangankoordinator', 'namakoordinator', 'jabatankoordinator',
    'createdat', 'createdAt'
  ],
  media_edukasi_items: [
    'id', 'judul', 'tipe', 'kategori', 'dokumentasimateriurl',
    'pesanedukatif', 'thumbnailurl', 'sumber', 'tanggal', 'createdAt'
  ],
  kelas_zona: [
    'kelas', 'tingkat', 'jumlahsiswa', 'totalkasustahunini',
    'kasusterselesaikan', 'skorkeramahan', 'statuszona', 'walikelas',
    'dutaantibullying', 'catatan', 'terakhirdiperiksa', 'createdAt'
  ],
  siswa_master: [
    'id', 'nisn', 'nama', 'kelas', 'jeniskelamin', 'createdat', 'jenisKelamin', 'createdAt'
  ],
  guru_master: [
    'id', 'nip', 'nama', 'jabatan', 'status', 'createdat', 'createdAt'
  ]
};

const sanitizeForTable = (table: string, rawItem: any): any => {
  if (!rawItem || typeof rawItem !== 'object') return rawItem;
  const item = { ...rawItem };

  // For e_lapor_records: preserve Siswa 2 and NISN in keterangan if not standard columns
  if (table === 'e_lapor_records') {
    const extraNotes: string[] = [];
    if (item.namasiswa2) {
      extraNotes.push(`Pihak 2: ${item.namasiswa2}${item.kelas2 ? ' (' + item.kelas2 + ')' : ''}${item.nisnsiswa2 ? ' NISN: ' + item.nisnsiswa2 : ''}`);
    }
    if (item.nisnsiswa && !item.keterangan?.includes(item.nisnsiswa)) {
      extraNotes.push(`NISN Pelapor/Pihak 1: ${item.nisnsiswa}`);
    }
    if (extraNotes.length > 0) {
      const existing = item.keterangan && item.keterangan !== '-' ? item.keterangan + ' | ' : '';
      item.keterangan = existing + extraNotes.join('; ');
    }
  }

  const allowed = KNOWN_TABLE_COLUMNS[table];
  if (!allowed) return item;

  const sanitized: any = {};
  for (const col of allowed) {
    const lowerCol = col.toLowerCase();
    if (item[col] !== undefined) {
      sanitized[col] = item[col];
    } else if (item[lowerCol] !== undefined) {
      sanitized[lowerCol] = item[lowerCol];
    }
  }
  return sanitized;
};

const handleSupabase = async (table: string, method: 'select' | 'upsert' | 'delete', body: any = null) => {
  let query = supabase.from(table);
  
  if (method === 'select') {
    let q = query.select('*');
    if (table !== 'kelas_zona' && table !== 'media_edukasi_items') {
      q = q.order('createdat', { ascending: false });
    } else if (table === 'media_edukasi_items') {
      q = q.order('tanggal', { ascending: false });
    } else {
      q = q.order('kelas', { ascending: true });
    }
    const { data, error } = await q;
    if (error) throw error;
    return data;
  }
  
  if (method === 'upsert') {
    let attempts = 0;
    let currentBody = Array.isArray(body)
      ? body.map(b => sanitizeForTable(table, b))
      : sanitizeForTable(table, body);

    let lastError: any = null;
    while (attempts < 30) {
      const { data, error } = await supabase.from(table).upsert(currentBody);
      if (error) {
        lastError = error;
        const msg = error.message || '';
        const match = msg.match(/Could not find the '([^']+)' column/i) || msg.match(/column "([^"]+)"/i);
        if (match && match[1]) {
          const missingCol = match[1].toLowerCase();
          console.warn(`[Self-Healing] Removing missing column "${missingCol}" from "${table}"`);
          if (Array.isArray(currentBody)) {
            currentBody = currentBody.map(item => {
              const newItem = { ...item };
              delete newItem[missingCol];
              delete newItem[match[1]];
              return newItem;
            });
          } else {
            delete currentBody[missingCol];
            delete currentBody[match[1]];
          }
          attempts++;
          continue;
        }
        throw error;
      }
      return data;
    }
    if (lastError) throw lastError;
    throw new Error(`Failed to upsert to ${table} after ${attempts} attempts`);
  }

  if (method === 'delete') {
    const { error } = await query.delete().match({ id: body.id });
    if (error) throw error;
    return { success: true };
  }
};

export const api = {
  get: async (table: string) => {
    try {
      const data = await handleSupabase(table, 'select');
      return toCamelKeys(data);
    } catch (err: any) {
      console.error(`Failed to fetch ${table}:`, err);
      throw new Error(err.message || `Failed to fetch ${table}`);
    }
  },
  upsert: async (table: string, body: any) => {
    try {
      const lowerBody = toLowerKeys(body);
      const data = await handleSupabase(table, 'upsert', lowerBody);
      return toCamelKeys(data);
    } catch (err: any) {
      console.error(`Failed to upsert ${table}:`, err);
      throw new Error(err.message || `Failed to upsert ${table}`);
    }
  },
  delete: async (table: string, id: string) => {
    try {
      const data = await handleSupabase(table, 'delete', { id });
      return toCamelKeys(data);
    } catch (err: any) {
      console.error(`Failed to delete ${table}:`, err);
      throw new Error(err.message || `Failed to delete from ${table}`);
    }
  },
  bulkUpsert: async (table: string, items: any[]) => {
    try {
      const lowerItems = toLowerKeys(items);
      let currentItems = Array.isArray(lowerItems)
        ? lowerItems.map(item => sanitizeForTable(table, item))
        : sanitizeForTable(table, lowerItems);
      let attempts = 0;
      let lastError: any = null;
      while (attempts < 30) {
        const { data, error } = await supabase.from(table).upsert(currentItems);
        if (error) {
          lastError = error;
          const msg = error.message || '';
          const match = msg.match(/Could not find the '([^']+)' column/i) || msg.match(/column "([^"]+)"/i);
          if (match && match[1]) {
            const missingCol = match[1].toLowerCase();
            if (Array.isArray(currentItems)) {
              currentItems = currentItems.map((item: any) => {
                const newItem = { ...item };
                delete newItem[missingCol];
                delete newItem[match[1]];
                return newItem;
              });
            }
            attempts++;
            continue;
          }
          throw error;
        }
        return toCamelKeys(data);
      }
      if (lastError) throw lastError;
      throw new Error(`Failed to bulk upsert to ${table}`);
    } catch (err: any) {
      console.error(`Failed bulk upsert ${table}:`, err);
      throw new Error(err.message || `Failed bulk upsert ${table}`);
    }
  }
};
