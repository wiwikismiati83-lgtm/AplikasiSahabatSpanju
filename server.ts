import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Supabase Client (Lazy initialization)
let supabaseClient: any = null;

const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://puxdfawtyeedcpqoench.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_c289xcQ6X5XlSpfuquVNDg_q0dDWXrH';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required in environment variables');
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Lookup map for mapping database lowercase keys back to React camelCase properties
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
  saranperbaikan: 'saranPerbaikan',
};

const toLowerKeys = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(toLowerKeys);
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      newObj[lowerKey] = toLowerKeys(obj[key]);
    }
    return newObj;
  }
  return obj;
};

const toCamelKeys = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(toCamelKeys);
  }
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
  ],
  survei_kepuasan_records: [
    'id', 'namalengkap', 'status', 'jawaban', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'saranperbaikan', 'createdat', 'namaLengkap', 'saranPerbaikan', 'createdAt'
  ]
};

const sanitizeForTable = (table: string, rawItem: any): any => {
  if (!rawItem || typeof rawItem !== 'object') return rawItem;
  const item = { ...rawItem };

  if (table === 'survei_kepuasan_records') {
    if (item.jawaban && typeof item.jawaban === 'object') {
      item.q1 = item.jawaban[1] || item.jawaban['1'] || item.q1 || 'setuju';
      item.q2 = item.jawaban[2] || item.jawaban['2'] || item.q2 || 'setuju';
      item.q3 = item.jawaban[3] || item.jawaban['3'] || item.q3 || 'setuju';
      item.q4 = item.jawaban[4] || item.jawaban['4'] || item.q4 || 'setuju';
      item.q5 = item.jawaban[5] || item.jawaban['5'] || item.q5 || 'setuju';
      item.q6 = item.jawaban[6] || item.jawaban['6'] || item.q6 || 'setuju';
      item.q7 = item.jawaban[7] || item.jawaban['7'] || item.q7 || 'setuju';
      item.q8 = item.jawaban[8] || item.jawaban['8'] || item.q8 || 'setuju';
    }
  }

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

// Helper for Supabase CRUD
const handleSupabase = async (table: string, method: 'select' | 'upsert' | 'delete', body: any = null) => {
  try {
    const client = getSupabase();
    let query = client.from(table);
    
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
        try {
          const { data, error } = await query.upsert(currentBody);
          if (error) throw error;
          return data;
        } catch (err: any) {
          lastError = err;
          const msg = err.message || '';
          const match = msg.match(/Could not find the '([^']+)' column/i) || msg.match(/column "([^"]+)"/i);
          if (match && match[1]) {
            const missingCol = match[1].toLowerCase();
            console.warn(`[Self-Healing] Removing missing column "${missingCol}" from "${table}" insert and retrying.`);
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
            query = getSupabase().from(table);
            continue;
          }
          throw err;
        }
      }
      if (lastError) throw lastError;
      throw new Error(`Failed to upsert to ${table} after ${attempts} attempts`);
    }

    if (method === 'delete') {
      const { error } = await query.delete().match({ id: body.id });
      if (error) throw error;
      return { success: true };
    }
  } catch (error: any) {
    console.error(`Supabase error on table ${table}:`, error.message);
    throw error;
  }
};

// Generic API Routes for all data types
const tables = [
  'piket_records',
  'ceri_records',
  'kebun_records',
  'serasi_records',
  'e_lapor_records',
  'sp_damai_records',
  'arsip_records',
  'buku_tamu_records',
  'media_edukasi_items',
  'kelas_zona',
  'siswa_master',
  'guru_master',
  'survei_kepuasan_records'
];

tables.forEach(table => {
  app.get(`/api/${table}`, async (req, res) => {
    try {
      const data = await handleSupabase(table, 'select');
      res.json(toCamelKeys(data));
    } catch (error: any) {
      console.warn(`[WARN] /api/${table} fetch fallback (table may not exist yet):`, error.message);
      res.json([]);
    }
  });

  app.post(`/api/${table}`, async (req, res) => {
    try {
      const lowerBody = toLowerKeys(req.body);
      const data = await handleSupabase(table, 'upsert', lowerBody);
      res.json(toCamelKeys(data));
    } catch (error: any) {
      console.warn(`[WARN] /api/${table} upsert fallback:`, error.message);
      res.json({ success: true, localOnly: true, data: req.body });
    }
  });

  app.delete(`/api/${table}`, async (req, res) => {
    try {
      const lowerBody = toLowerKeys(req.body || {});
      const idVal = req.query.id as string || lowerBody.id || lowerBody.kelas;
      const data = await handleSupabase(table, 'delete', { id: idVal, kelas: idVal });
      res.json(toCamelKeys(data));
    } catch (error: any) {
      console.warn(`[WARN] /api/${table} delete fallback:`, error.message);
      res.json({ success: true, localOnly: true });
    }
  });

  app.delete(`/api/${table}/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      const data = await handleSupabase(table, 'delete', { id, kelas: id });
      res.json(toCamelKeys(data));
    } catch (error: any) {
      console.warn(`[WARN] /api/${table}/:id delete fallback:`, error.message);
      res.json({ success: true, localOnly: true });
    }
  });
});

// Special endpoint for bulk update (e.g. initial setup or sync)
app.post('/api/bulk-upsert', async (req, res) => {
  const { table, items } = req.body;
  try {
    const client = getSupabase();
    const lowerItems = toLowerKeys(items);
    let currentItems = Array.isArray(lowerItems)
      ? lowerItems.map((item: any) => sanitizeForTable(table, item))
      : sanitizeForTable(table, lowerItems);
    let attempts = 0;
    
    while (attempts < 30) {
      try {
        const { data, error } = await client.from(table).upsert(currentItems);
        if (error) throw error;
        res.json(toCamelKeys(data));
        return;
      } catch (error: any) {
        const msg = error.message || '';
        const match = msg.match(/Could not find the '([^']+)' column/i) || msg.match(/column "([^"]+)"/i);
        if (match && match[1]) {
          const missingCol = match[1].toLowerCase();
          console.warn(`[Self-Healing-Bulk] Removing missing column "${missingCol}" from bulk insert.`);
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
    }
    throw new Error(`Failed to bulk upsert to ${table} after ${attempts} attempts`);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    delete (globalThis as any).__dirname;
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
