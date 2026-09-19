-- ==============================================================================
-- SKRIP PEMBUATAN TABEL MEDIA EDUKASI DIGITAL SPANJU DI SUPABASE
-- UPT SMP NEGERI 7 PASURUAN
-- ==============================================================================

-- 1. Buat Tabel media_edukasi_items
CREATE TABLE IF NOT EXISTS public.media_edukasi_items (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    dokumentasimateriurl TEXT,
    tanggal TEXT NOT NULL,
    tipe TEXT DEFAULT 'modul',
    kategori TEXT DEFAULT 'Materi Edukasi',
    pesanedukatif TEXT DEFAULT '',
    thumbnailurl TEXT,
    sumber TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    createdat TIMESTAMPTZ DEFAULT now()
);

-- 2. Beri Komentar Deskripsi Kolom untuk Dokumentasi
COMMENT ON TABLE public.media_edukasi_items IS 'Tabel repositori materi edukasi, modul anti-perundungan, dan materi literasi ramah anak Sahabat SPANJU SMPN 7 Pasuruan';
COMMENT ON COLUMN public.media_edukasi_items.id IS 'ID Unik materi (cth: med-1789827243089)';
COMMENT ON COLUMN public.media_edukasi_items.judul IS 'Judul materi pembelajaran atau kampanye edukasi ramah anak';
COMMENT ON COLUMN public.media_edukasi_items.dokumentasimateriurl IS 'Tautan / link ke Google Drive, modul PDF, video YouTube, atau artikel edukasi';
COMMENT ON COLUMN public.media_edukasi_items.tanggal IS 'Tanggal pencatatan atau publikasi materi edukasi';
COMMENT ON COLUMN public.media_edukasi_items.tipe IS 'Format media (modul, video, infografis, pesan_bijak)';
COMMENT ON COLUMN public.media_edukasi_items.kategori IS 'Kategori topik edukasi karakter';
COMMENT ON COLUMN public.media_edukasi_items.pesanedukatif IS 'Pesan nilai edukatif pendukung';
COMMENT ON COLUMN public.media_edukasi_items.thumbnailurl IS 'Tautan gambar thumbnail (opsional)';
COMMENT ON COLUMN public.media_edukasi_items.sumber IS 'Penyusun / sumber materi';
COMMENT ON COLUMN public.media_edukasi_items."createdAt" IS 'Waktu pencatatan di sistem (timestamp)';

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.media_edukasi_items ENABLE ROW LEVEL SECURITY;

-- 4. Buat Kebijakan Keamanan (Policies) untuk Akses Publik / Anonim
DROP POLICY IF EXISTS "Allow select on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow select on media_edukasi_items" 
    ON public.media_edukasi_items 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow insert on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow insert on media_edukasi_items" 
    ON public.media_edukasi_items 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow update on media_edukasi_items" 
    ON public.media_edukasi_items 
    FOR UPDATE 
    USING (true);

DROP POLICY IF EXISTS "Allow delete on media_edukasi_items" ON public.media_edukasi_items;
CREATE POLICY "Allow delete on media_edukasi_items" 
    ON public.media_edukasi_items 
    FOR DELETE 
    USING (true);

-- 5. Data Awal / Seed Data Sahabat SPANJU
INSERT INTO public.media_edukasi_items (id, judul, dokumentasimateriurl, tanggal, tipe, kategori, pesanedukatif)
VALUES
('med-1', 'Panduan Praktis Mengenali & Menghentikan Perundungan di Sekolah', 'https://cerdasberkarakter.kemdikbud.go.id/perundungan', '10 September 2026', 'modul', 'Materi Edukasi', 'Bersama kita jaga SPANJU tetap nyaman dan membanggakan!')
ON CONFLICT (id) DO NOTHING;
