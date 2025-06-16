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
- ✅ **SCID-5-CV Dijital Test Uygulaması**
- 🔄 Seans notları (geliştirme aşamasında)
- 🔄 Markdown desteği (geliştirme aşamasında)

## SCID-5-CV (Structured Clinical Interview for DSM-5) Modülü

### 📋 **Genel Bakış**
SCID-5-CV, DSM-5 tanı ölçütlerine dayalı yapılandırılmış klinik görüşme aracının dijital implementasyonudur. Bu modül, ruh sağlığı profesyonellerinin sistematik tanı değerlendirmesi yapmasını sağlar.

### 🏗️ **Modül Yapısı**

#### **Ana Bileşenler:**
- **`src/pages/Scid5CvPage.tsx`** - Ana test sayfası ve test akış yöneticisi
- **`src/features/scid/data/scid5cv.data.ts`** - Merkezi veri tipi tanımları ve tüm modül verilerini birleştiren ana dosya

#### **Test Fazları:**
1. **Genel Değerlendirme** (`GeneralAssessment.tsx`) - Ön bilgi toplama
2. **Modül Seçimi** (`ModuleSelector.tsx`) - Uygulanacak modülleri belirleme
3. **Soru-Cevap** (`QuestionRenderer.tsx`, `ScidTestLayout.tsx`) - Sistematik soru yöneltme
4. **Rapor** (`SessionReport.tsx`) - Sonuç değerlendirmesi

#### **SCID Test Modülleri (A-J):**

| Modül | Dosya | İçerik | Satır Sayısı |
|-------|-------|--------|--------------|
| **Genel** | `genel-degerlendirme.data.ts` | Ön değerlendirme soruları | 51 |
| **A** | `module-a.data.ts` | Duygudurum Dönemleri | 725 |
| **B** | `module-b.data.ts` | Psikoz Belirtileri | 263 |
| **C** | `module-c.data.ts` | Psikozla Giden Bozuklukların Ayırıcı Tanısı | 293 |
| **D** | `module-d.data.ts` | Duygudurum Bozukluklarının Ayırıcı Tanısı | 214 |
| **E** | `module-e.data.ts` | Madde Kullanım Bozuklukları | 191 |
| **F** | `module-f.data.ts` | Kaygı Bozuklukları | 342 |
| **G** | `module-g.data.ts` | TZB ve ÖSGB (Takıntı-Zorlantı ve Örselenme Sonrası) | 265 |
| **H** | `module-h.data.ts` | DEAHB (Erişkin Dikkat Eksikliği/Aşırı Hareketlilik) | 102 |
| **I** | `module-i.data.ts` | Tarama (Diğer Bozukluklar) | 22 |
| **J** | `module-j.data.ts` | Uyum Bozukluğu | 12 |

#### **Özelleşmiş Bileşenler:**

- **`SubstanceChecklist.tsx`** - Modül E için madde kullanım kontrolü
- **`SubstanceQuestionnaire.tsx`** - Seçilen maddeler için detaylı sorgulama
- **`TraumaEventInput.tsx`** - Modül G için travma olayı girişi
- **`TraumaSelector.tsx`** - PTSD değerlendirmesi için travma seçimi

### 🧠 **Akıllı Özellikler**

#### **Skip Logic (Atlama Mantığı):**
Her soru için koşullu dallanma sistemi:
```typescript
skipLogic: { 
  'EVET': 'A11',    // EVET ise A11'e git
  'HAYIR': 'A15',   // HAYIR ise A15'e git
  '*': 'NEXT_MODULE' // Her durumda sonraki modüle git
}
```

#### **Otomatik Hesaplama:**
DSM-5 kriterlerine göre otomatik tanı hesaplaması:
```typescript
calculation: {
  sources: ['A1', 'A2', 'A3', 'A4', 'A5'],
  condition: 'count_positive',
  threshold: 5
}
```

#### **Soru Tipleri:**
- `question` - Standart soru (Evet/Hayır, çoktan seçmeli)
- `instruction` - Yönlendirme metni
- `text/textarea` - Serbest metin girişi
- `summary` - Tanı özeti
- `calculation` - Otomatik hesaplama
- `substance_checklist` - Madde kontrol listesi
- `substance_questionnaire` - Madde sorgusu
- `trauma_event_input` - Travma olayı girişi

### 💾 **Veri Yönetimi**

#### **Veritabanı Tabloları:**
- **`scid_sessions`** - Test oturumu bilgileri
- **`scid_answers`** - Soru cevapları ve notları
- **`trauma_events`** - Travma olayları (JSON formatında)

#### **Veri Yapısı:**
```typescript
interface ScidQuestion {
  id: string;                    // Soru ID'si (örn: 'A1', 'B5')
  module: string;               // Modül adı ('A', 'B', vb.)
  type: string;                 // Soru tipi
  text: string;                 // Soru metni
  criteria?: string;            // DSM-5 kriteri
  options?: Array;              // Cevap seçenekleri
  skipLogic?: Object;           // Atlama mantığı
  calculation?: Object;         // Hesaplama kuralları
}
```

### 🔄 **Test Akışı**

1. **Başlangıç:** Danışan seçimi ve yeni test oturumu oluşturma
2. **Genel Değerlendirme:** Demografik bilgiler ve genel durum
3. **Modül Seçimi:** Klinisyen hangi modülleri uygulayacağını seçer
4. **Soru Döngüsü:** 
   - Soru gösterimi
   - Cevap alma
   - Otomatik hesaplamalar
   - Skip logic ile sonraki soruya geçiş
5. **Tamamlama:** Otomatik rapor oluşturma

### 🎨 **Kullanıcı Arayüzü**

#### **Test Layout:**
- **Sol Panel (75%):** Sorular ve soru notları
- **Sağ Panel (25%):** DSM-5 kriterleri ve seans notları
- **Alt Panel:** Navigasyon butonları

#### **Responsive Tasarım:**
- Desktop: 4 sütunlu grid layout
- Mobile: Tek sütun, kaydırmalı tasarım

### 🚀 **Kullanım**

1. Danışan sayfasından "SCID-5-CV Başlat" butonuna tıklayın
2. Genel değerlendirme formunu doldurun (opsiyonel)
3. Uygulamak istediğiniz modülleri seçin
4. Soruları sırayla cevaplayın
5. Test tamamlandığında otomatik rapor oluşur

### 🔧 **Geliştirici Notları**

- Her modül bağımsız olarak test edilebilir
- Skip logic karmaşık durumları destekler
- Hesaplama fonksiyonları genişletilebilir
- Yeni soru tipleri kolayca eklenebilir
- Tüm veriler real-time olarak kaydedilir

## Veritabanı

Bu uygulama Supabase veritabanı kullanır. Migration dosyası `supabase/migrations/` dizininde bulunmaktadır.

## Katkıda Bulunma

Bu proje açık kaynaklıdır ve katkılarınızı memnuniyetle karşılarız.
