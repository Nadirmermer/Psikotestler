

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
    email VARCHAR(255),
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
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email));
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı sil ve yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- GÜVENLİK: Row Level Security (RLS) Politikaları
-- Herkesin sadece kendi verisine erişmesini sağlar.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları sil
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;

DROP POLICY IF EXISTS "Users can view their own session notes" ON session_notes;
DROP POLICY IF EXISTS "Users can insert their own session notes" ON session_notes;
DROP POLICY IF EXISTS "Users can update their own session notes" ON session_notes;
DROP POLICY IF EXISTS "Users can delete their own session notes" ON session_notes;

-- Profiles tablosu için basitleştirilmiş politikalar
CREATE POLICY "Enable all access for authenticated users to own profile" ON profiles 
    FOR ALL USING (auth.uid() = id);

-- Clients tablosu için basitleştirilmiş politikalar  
CREATE POLICY "Enable all access for authenticated users to own clients" ON clients 
    FOR ALL USING (auth.uid() = user_id);

-- Session notes tablosu için basitleştirilmiş politikalar
CREATE POLICY "Enable all access for authenticated users to own session notes" ON session_notes 
    FOR ALL USING (auth.uid() = user_id);

