-- TABLO 1: profiles (Kullanıcı Profilleri)
-- Supabase'in 'auth.users' tablosunu genişletir. Her ruh sağlığı uzmanının
-- adı, unvanı gibi ek bilgilerini burada saklarız.
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    title VARCHAR(100), -- Örn: "Psikolog", "Psikiyatrist"
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLO 2: clients (Danışanlar)
-- Danışanların temel bilgilerini saklar ve hangi kullanıcıya (uzmana) ait olduğunu belirtir.
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLO 3: session_notes (Seans Notları)
-- Her bir danışana ait seans notlarını, markdown formatında saklar.
CREATE TABLE session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    note TEXT NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTOMASYON: Yeni bir kullanıcı (uzman) kayıt olduğunda,
-- onun için otomatik olarak bir 'profiles' satırı oluşturan fonksiyon ve tetikleyici.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- GÜVENLİK BÖLÜMÜ --

-- 1. ADIM: Satır Seviyesi Güvenliği (Row Level Security - RLS) Aktifleştirme
-- Bu, her tablonun kendi güvenlik kurallarına uymasını zorunlu kılar.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;

-- 2. ADIM: RLS Politikaları Oluşturma
-- Bu politikalar, "kimin hangi satırlara erişebileceğini" tanımlar.
-- Örn: "Her kullanıcı sadece kendi profilini görebilir."
CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own clients" ON public.clients
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own session notes" ON public.session_notes
    FOR ALL USING (auth.uid() = user_id);

-- 3. ADIM: Genel Tablo İzinleri (GRANT)
-- RLS politikalarının çalışabilmesi için, kullanıcıların önce tabloya
-- genel bir erişim izni olması gerekir. Bu komutlar, bu genel izni verir.
-- RLS, bu genel iznin üzerine bir filtre gibi çalışarak güvenliği sağlar.

-- ŞEMA ERİŞİM İZİNLERİ - Bu satırları ekleyin
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- 'anon' (ziyaretçi/giriş yapmamış) rolüne, GİRİŞ/KAYIT işlemleri için izinlerr
GRANT INSERT ON TABLE public.profiles TO anon;

-- 'authenticated' (giriş yapmış kullanıcı) rolüne, tüm işlemler için izinler
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.session_notes TO authenticated;

-- TABLO 4: scid_sessions (SCID Seansları)
-- Hangi danışana, hangi uzman tarafından, hangi SCID testinin ne zaman uygulandığını kaydeder.
-- Seans geneli notlar da burada tutulabilir.
CREATE TABLE scid_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'scid-5-cv', 'scid-5-pd' vb.
    status VARCHAR(50) DEFAULT 'in-progress', -- 'in-progress', 'completed'
    session_wide_note TEXT, -- Seans boyunca görülecek genel not alanı
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLO 5: scid_answers (SCID Cevapları)
-- Her bir SCID seansındaki her bir soruya verilen cevabı ve o soruya özel notu saklar.
CREATE TABLE scid_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES scid_sessions(id) ON DELETE CASCADE NOT NULL,
    question_code VARCHAR(20) NOT NULL, -- Örn: 'A5', 'G14', 'F22'
    answer VARCHAR(255), -- '+', '-', 'EVET', 'HAYIR' veya sayısal değer
    question_specific_note TEXT, -- Soru özelindeki not alanı
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- YENİ TABLOLAR İÇİN GÜVENLİK (RLS) POLİTİKALARI
ALTER TABLE public.scid_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scid_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own scid_sessions" ON public.scid_sessions
    FOR ALL USING (auth.uid() = user_id);

-- scid_answers tablosu için politika, kullanıcının ilgili seansın sahibi olup olmadığını kontrol etmelidir.
CREATE POLICY "Users can manage answers for their own sessions" ON public.scid_answers
    FOR ALL USING (
        (SELECT user_id FROM scid_sessions WHERE id = session_id) = auth.uid()
    );

-- YENİ TABLOLAR İÇİN GENEL İZİNLER
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.scid_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.scid_answers TO authenticated;