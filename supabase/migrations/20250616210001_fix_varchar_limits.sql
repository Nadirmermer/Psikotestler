-- =============================================================================
-- KARAKTER LIMITI DÜZELTME MIGRATION
-- VARCHAR sınırlarını artırarak kullanıcı dostu hale getirme
-- =============================================================================

-- question_code alanını genişlet (20 -> 100)
ALTER TABLE public.scid_answers ALTER COLUMN question_code TYPE VARCHAR(100);

-- answer alanı zaten TEXT ama emin olmak için
ALTER TABLE public.scid_answers ALTER COLUMN answer TYPE TEXT;

-- question_specific_note alanı zaten TEXT ama emin olmak için
ALTER TABLE public.scid_answers ALTER COLUMN question_specific_note TYPE TEXT;

-- session_wide_note alanını da kontrol edelim
ALTER TABLE public.scid_sessions ALTER COLUMN session_wide_note TYPE TEXT;

-- current_question alanını da genişletelim (20 -> 100)
ALTER TABLE public.scid_sessions ALTER COLUMN current_question TYPE VARCHAR(100);

-- Diğer potansiyel problemli alanlar
ALTER TABLE public.clients ALTER COLUMN phone TYPE VARCHAR(50);
ALTER TABLE public.clients ALTER COLUMN gender TYPE VARCHAR(50);

-- =============================================================================
-- Bu migration karakter limit sorunlarını çözer
-- ============================================================================= 