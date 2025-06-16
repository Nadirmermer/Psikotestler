
# PsikoTest

Ruh sağlığı profesyonelleri için modern, güvenli ve kullanıcı dostu bir danışan ve not yönetimi uygulaması.

## Teknoloji Yığını

- **Vite**
- **React**
- **TypeScript**
- **Supabase** (Backend & Veritabanı)
- **Tailwind CSS** (Styling)
- **React Router** (Yönlendirme)
- **Lucide Icons** (İkonlar)
- **React Hot Toast** (Bildirimler)

## Kurulum ve Çalıştırma

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Ortam Değişkenlerini Ayarlayın:**
    Proje ana dizininde `.env.example` dosyasını kopyalayıp `.env` adında yeni bir dosya oluşturun. Kendi Supabase bilgilerinizi bu dosyaya girin.
    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```

Uygul şimdi `http://localhost:5173` adresinde çalışıyor olacaktır.

## Özellikler

- ✅ Güvenli kimlik doğrulama (giriş/kayıt)
- ✅ Karanlık/Aydınlık tema desteği
- ✅ Danışan profil yönetimi
- ✅ Responsive tasarım
- ✅ Profil ve ayarlar yönetimi
- 🔄 Seans notları (geliştirme aşamasında)
- 🔄 Markdown desteği (geliştirme aşamasında)

## Veritabanı

Bu uygulama Supabase veritabanı kullanır. Migration dosyası `supabase/migrations/` dizininde bulunmaktadır.

## Katkıda Bulunma

Bu proje açık kaynaklıdır ve katkılarınızı memnuniyetle karşılarız.
