-- =============================================================================
-- PSIKOLOGLAR İÇİN DANIŞAN YÖNETİM SİSTEMİ
-- İlk veritabanı schema'sı - SCID-5-CV desteği ile
-- Oluşturulma: 16.06.2025
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TEMEL KULLANICI VE DANIŞAN TABLOLARI
-- -----------------------------------------------------------------------------

-- TABLO: profiles
-- Açıklama: Supabase auth.users tablosunu genişletir
-- Amaç: Ruh sağlığı uzmanlarının meslek bilgilerini saklar
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    title VARCHAR(100), -- "Psikolog", "Psikiyatrist", "Klinik Psikolog"
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLO: clients  
-- Açıklama: Danışan bilgilerini saklar
-- Amaç: Her uzmanın kendi danışanlarını yönetmesi
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    birth_date DATE,
    gender VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLO: session_notes
-- Açıklama: Geleneksel seans notları
-- Amaç: Danışanlarla yapılan görüşmelerin notlarını saklar
CREATE TABLE public.session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255),
    note TEXT NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. SCID-5-CV TEST SİSTEMİ TABLOLARI
-- -----------------------------------------------------------------------------

-- TABLO: scid_sessions
-- Açıklama: SCID test seanslarını yönetir
-- Amaç: Her danışana uygulanan SCID testlerinin ana kayıtları
CREATE TABLE public.scid_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    test_type VARCHAR(50) NOT NULL DEFAULT 'scid-5-cv',
    status VARCHAR(50) NOT NULL DEFAULT 'in-progress', -- 'in-progress', 'completed', 'paused'
    current_module VARCHAR(10), -- 'genel', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'
    current_question VARCHAR(20), -- 'A1', 'B5', 'H12' vb.
    trauma_events JSONB, -- Travma modülü için özel veri
    substance_list JSONB, -- Madde modülü için özel veri
    session_wide_note TEXT, -- Seans boyunca görünen genel not
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLO: scid_answers
-- Açıklama: Her soraya verilen cevapları saklar
-- Amaç: SCID testindeki her sorunun cevabını ve notunu kaydeder
CREATE TABLE public.scid_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES scid_sessions(id) ON DELETE CASCADE NOT NULL,
    question_code VARCHAR(20) NOT NULL, -- 'A1', 'G14', 'F22', 'GENEL_1'
    answer TEXT, -- '+', '-', 'EVET', 'HAYIR', sayısal değer veya JSON
    question_specific_note TEXT, -- Her soru için özel not alanı
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Aynı soraya birden fazla cevap verilmesini engeller
    UNIQUE(session_id, question_code)
);

-- -----------------------------------------------------------------------------
-- 3. OTOMASYON FONKSİYONLARI
-- -----------------------------------------------------------------------------

-- Yeni kullanıcı kaydında otomatik profil oluşturma
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Yeni kullanıcı oluşturulduğunda profil tablosuna ekle
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SCID session güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION public.update_scid_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: SCID session güncellendiğinde timestamp'i otomatik güncelle
CREATE TRIGGER update_scid_sessions_updated_at
    BEFORE UPDATE ON public.scid_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_scid_session_timestamp();

-- -----------------------------------------------------------------------------
-- 4. GÜVENLİK POLİTİKALARI (ROW LEVEL SECURITY)
-- -----------------------------------------------------------------------------

-- RLS'yi tüm tablolar için aktifleştir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scid_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scid_answers ENABLE ROW LEVEL SECURITY;

-- PROFILES tablosu güvenlik politikaları
CREATE POLICY "users_can_view_own_profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- CLIENTS tablosu güvenlik politikaları
CREATE POLICY "users_can_manage_own_clients" ON public.clients
    FOR ALL USING (auth.uid() = user_id);

-- SESSION_NOTES tablosu güvenlik politikaları
CREATE POLICY "users_can_manage_own_session_notes" ON public.session_notes
    FOR ALL USING (auth.uid() = user_id);

-- SCID_SESSIONS tablosu güvenlik politikaları
CREATE POLICY "users_can_manage_own_scid_sessions" ON public.scid_sessions
    FOR ALL USING (auth.uid() = user_id);

-- SCID_ANSWERS tablosu güvenlik politikaları
CREATE POLICY "users_can_manage_own_scid_answers" ON public.scid_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.scid_sessions 
            WHERE id = session_id AND user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- 5. ERİŞİM İZİNLERİ (GRANTS)
-- -----------------------------------------------------------------------------

-- Schema erişim izinleri
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Misafir kullanıcılar (kayıt/giriş için)
GRANT INSERT ON public.profiles TO anon;

-- Kimlik doğrulanmış kullanıcılar (tüm işlemler)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scid_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scid_answers TO authenticated;

-- -----------------------------------------------------------------------------
-- 6. İNDEKSLER (PERFORMANS İÇİN)
-- -----------------------------------------------------------------------------

-- Sık kullanılan sorgular için indeksler
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_session_notes_client_id ON public.session_notes(client_id);
CREATE INDEX idx_session_notes_user_id ON public.session_notes(user_id);
CREATE INDEX idx_scid_sessions_client_id ON public.scid_sessions(client_id);
CREATE INDEX idx_scid_sessions_user_id ON public.scid_sessions(user_id);
CREATE INDEX idx_scid_sessions_status ON public.scid_sessions(status);
CREATE INDEX idx_scid_answers_session_id ON public.scid_answers(session_id);
CREATE INDEX idx_scid_answers_question_code ON public.scid_answers(question_code);

-- -----------------------------------------------------------------------------
-- 7. VERİ DOĞRULAMA KURALLARI
-- -----------------------------------------------------------------------------

-- SCID session status sadece belirli değerleri alabilir
ALTER TABLE public.scid_sessions ADD CONSTRAINT check_session_status 
CHECK (status IN ('in-progress', 'completed', 'paused', 'cancelled'));

-- Test tipi sadece belirli değerleri alabilir
ALTER TABLE public.scid_sessions ADD CONSTRAINT check_test_type 
CHECK (test_type IN ('scid-5-cv', 'scid-5-pd', 'scid-ii'));

-- Cinsiyet sadece belirli değerleri alabilir (opsiyonel)
ALTER TABLE public.clients ADD CONSTRAINT check_gender 
CHECK (gender IS NULL OR gender IN ('Erkek', 'Kadın', 'Diğer', 'Belirtmek istemiyorum'));

-- =============================================================================
-- SCHEMA BAŞARIYLA OLUŞTURULDU
-- Bu dosya PsikoTest uygulaması için tüm gerekli tabloları,
-- güvenlik politikalarını ve fonksiyonları içermektedir.
-- =============================================================================