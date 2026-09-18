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
    let currentBody = Array.isArray(body) ? [...body] : { ...body };
    while (attempts < 5) {
      const { data, error } = await supabase.from(table).upsert(currentBody);
      if (error) {
        const msg = error.message || '';
        const match = msg.match(/Could not find the '([^']+)' column/i) || msg.match(/column "([^"]+)"/i);
        if (match && match[1]) {
          const missingCol = match[1].toLowerCase();
          console.warn(`[Self-Healing] Removing missing column "${missingCol}" from "${table}"`);
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
          continue;
        }
        throw error;
      }
      return data;
    }
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
      let currentItems = toLowerKeys(items);
      let attempts = 0;
      while (attempts < 5) {
        const { data, error } = await supabase.from(table).upsert(currentItems);
        if (error) {
          const msg = error.message || '';
          const match = msg.match(/Could not find the '([^']+)' column/i) || msg.match(/column "([^"]+)"/i);
          if (match && match[1]) {
            const missingCol = match[1].toLowerCase();
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
        return toCamelKeys(data);
      }
    } catch (err: any) {
      console.error(`Failed bulk upsert ${table}:`, err);
      throw new Error(err.message || `Failed bulk upsert ${table}`);
    }
  }
};
