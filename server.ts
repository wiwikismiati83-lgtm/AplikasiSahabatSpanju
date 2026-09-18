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

// Helper for Supabase CRUD
const handleSupabase = async (table: string, method: 'select' | 'upsert' | 'delete', body: any = null) => {
  try {
    const client = getSupabase();
    let query = client.from(table);
    
    if (method === 'select') {
      const { data, error } = await query.select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      return data;
    }
    
    if (method === 'upsert') {
      const { data, error } = await query.upsert(body);
      if (error) throw error;
      return data;
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
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post(`/api/${table}`, async (req, res) => {
    try {
      const data = await handleSupabase(table, 'upsert', req.body);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete(`/api/${table}`, async (req, res) => {
    try {
      const data = await handleSupabase(table, 'delete', req.body);
      res.json(data);
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
    const { data, error } = await client.from(table).upsert(items);
    if (error) throw error;
    res.json(data);
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
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
