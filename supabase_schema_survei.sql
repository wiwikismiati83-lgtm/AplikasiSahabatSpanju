-- ==============================================================================
-- SKRIP PEMBUATAN TABEL SURVEI KEPUASAN PENGGUNA SPANJU DI SUPABASE
-- UPT SMP NEGERI 7 PASURUAN
-- ==============================================================================

-- 1. Buat Tabel survei_kepuasan_records
CREATE TABLE IF NOT EXISTS public.survei_kepuasan_records (
    id TEXT PRIMARY KEY,
    namalengkap TEXT NOT NULL,
    status TEXT NOT NULL,
    jawaban JSONB NOT NULL DEFAULT '{}'::jsonb,
    q1 TEXT DEFAULT 'setuju',
    q2 TEXT DEFAULT 'setuju',
    q3 TEXT DEFAULT 'setuju',
    q4 TEXT DEFAULT 'setuju',
    q5 TEXT DEFAULT 'setuju',
    q6 TEXT DEFAULT 'setuju',
    q7 TEXT DEFAULT 'setuju',
    q8 TEXT DEFAULT 'setuju',
    saranperbaikan TEXT,
    createdat TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI')
);

-- 2. Beri Komentar Deskripsi Kolom untuk Dokumentasi
COMMENT ON TABLE public.survei_kepuasan_records IS 'Tabel rekapitulasi data hasil pengisian survei kepuasan layanan laporan perundungan / TPPK SMPN 7 Pasuruan';
COMMENT ON COLUMN public.survei_kepuasan_records.id IS 'ID Unik respons survei (cth: survei-1726738910000)';
COMMENT ON COLUMN public.survei_kepuasan_records.namalengkap IS 'Nama lengkap responden yang mengisi survei';
COMMENT ON COLUMN public.survei_kepuasan_records.status IS 'Status/Peran responden: Siswa, Guru, atau Orang tua';
COMMENT ON COLUMN public.survei_kepuasan_records.jawaban IS 'Objek JSON berisi rincian pilihan jawaban butir 1 s.d 8';
COMMENT ON COLUMN public.survei_kepuasan_records.q1 IS 'Jawaban Butir 1: Kemudahan Akses';
COMMENT ON COLUMN public.survei_kepuasan_records.q2 IS 'Jawaban Butir 2: Kejelasan Alur';
COMMENT ON COLUMN public.survei_kepuasan_records.q3 IS 'Jawaban Butir 3: Kerahasiaan Identitas';
COMMENT ON COLUMN public.survei_kepuasan_records.q4 IS 'Jawaban Butir 4: Keamanan Data & Bukti';
COMMENT ON COLUMN public.survei_kepuasan_records.q5 IS 'Jawaban Butir 5: Respon Cepat (1x24 Jam)';
COMMENT ON COLUMN public.survei_kepuasan_records.q6 IS 'Jawaban Butir 6: Transparansi Status Penanganan';
COMMENT ON COLUMN public.survei_kepuasan_records.q7 IS 'Jawaban Butir 7: Keadilan Tindak Lanjut Mediasi';
COMMENT ON COLUMN public.survei_kepuasan_records.q8 IS 'Jawaban Butir 8: Peningkatan Rasa Aman Sekolah';
COMMENT ON COLUMN public.survei_kepuasan_records.saranperbaikan IS 'Masukan, aspirasi, atau saran perbaikan dari responden';
COMMENT ON COLUMN public.survei_kepuasan_records.createdat IS 'Waktu pencatatan survei';

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.survei_kepuasan_records ENABLE ROW LEVEL SECURITY;

-- 4. Buat Kebijakan Keamanan (Policies) untuk Akses Publik / Anonim
DROP POLICY IF EXISTS "Allow select on survei_kepuasan_records" ON public.survei_kepuasan_records;
CREATE POLICY "Allow select on survei_kepuasan_records" 
    ON public.survei_kepuasan_records 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow insert on survei_kepuasan_records" ON public.survei_kepuasan_records;
CREATE POLICY "Allow insert on survei_kepuasan_records" 
    ON public.survei_kepuasan_records 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on survei_kepuasan_records" ON public.survei_kepuasan_records;
CREATE POLICY "Allow update on survei_kepuasan_records" 
    ON public.survei_kepuasan_records 
    FOR UPDATE 
    USING (true);

DROP POLICY IF EXISTS "Allow delete on survei_kepuasan_records" ON public.survei_kepuasan_records;
CREATE POLICY "Allow delete on survei_kepuasan_records" 
    ON public.survei_kepuasan_records 
    FOR DELETE 
    USING (true);

-- 5. Contoh Data Awal (Opsional - Seed Data Realistis)
INSERT INTO public.survei_kepuasan_records (id, namalengkap, status, jawaban, q1, q2, q3, q4, q5, q6, q7, q8, saranperbaikan, createdat)
VALUES
('survei-seed-1', 'Ahmad Dani Pratama', 'Siswa', '{"1":"setuju","2":"setuju","3":"setuju","4":"setuju","5":"setuju","6":"setuju","7":"setuju","8":"setuju"}'::jsonb, 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'Fitur sangat membantu siswa merasa aman melapor tanpa takut diintimidasi.', '2026-09-18 09:30'),
('survei-seed-2', 'Siti Rahmawati, S.Pd', 'Guru', '{"1":"setuju","2":"setuju","3":"setuju","4":"setuju","5":"setuju","6":"netral","7":"setuju","8":"setuju"}'::jsonb, 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'netral', 'setuju', 'setuju', 'Alur pengarsipan sangat rapi dan memudahkan koordinasi tim TPPK bersama Guru BK.', '2026-09-18 10:15'),
('survei-seed-3', 'Bambang Sutrisno', 'Orang tua', '{"1":"setuju","2":"setuju","3":"setuju","4":"setuju","5":"setuju","6":"setuju","7":"setuju","8":"setuju"}'::jsonb, 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'setuju', 'Terus tingkatkan sosialisasi di kelas agar siswa tidak ragu menggunakan form ini.', '2026-09-18 11:20')
ON CONFLICT (id) DO NOTHING;
