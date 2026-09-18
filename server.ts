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
      let currentBody = Array.isArray(body) ? [...body] : { ...body };
      
      while (attempts < 5) {
        try {
          const { data, error } = await query.upsert(currentBody);
          if (error) throw error;
          return data;
        } catch (err: any) {
          const msg = err.message || '';
          const match = msg.match(/Could not find the '([^']+)' column/i) || msg.match(/column "([^"]+)"/i);
          if (match && match[1]) {
            const missingCol = match[1].toLowerCase();
            console.warn(`[Self-Healing] Removing missing column "${missingCol}" from "${table}" insert and retrying.`);
            if (Array.isArray(currentBody)) {
              currentBody = currentBody.map(item => {
                const newItem = { ...item };
                delete newItem[missingCol];
                return newItem;
              });
            } else {
              delete currentBody[missingCol];
            }
            attempts++;
            query = getSupabase().from(table);
            continue;
          }
          throw err;
        }
      }
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
  'guru_master'
];

tables.forEach(table => {
  app.get(`/api/${table}`, async (req, res) => {
    try {
      const data = await handleSupabase(table, 'select');
      res.json(toCamelKeys(data));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post(`/api/${table}`, async (req, res) => {
    try {
      const lowerBody = toLowerKeys(req.body);
      const data = await handleSupabase(table, 'upsert', lowerBody);
      res.json(toCamelKeys(data));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete(`/api/${table}`, async (req, res) => {
    try {
      const lowerBody = toLowerKeys(req.body);
      const data = await handleSupabase(table, 'delete', lowerBody);
      res.json(toCamelKeys(data));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Special endpoint for bulk update (e.g. initial setup or sync)
app.post('/api/bulk-upsert', async (req, res) => {
  const { table, items } = req.body;
  try {
    const client = getSupabase();
    let currentItems = toLowerKeys(items);
    let attempts = 0;
    
    while (attempts < 5) {
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
              return newItem;
            });
          }
          attempts++;
          continue;
        }
        throw error;
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
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
