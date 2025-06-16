// src/features/scid/data/genel-degerlendirme.data.ts (Düzeltilmiş Hali)

import { ScidQuestion } from "./scid5cv.data"; // Merkezi tipten import ediyoruz

// Artık AssessmentQuestion arayüzüne ihtiyacımız yok.
// Direkt olarak ScidQuestion tipinde bir dizi oluşturuyoruz.
export const genelDegerlendirme_data: ScidQuestion[] = [
  {
    id: 'gen_giris',
    module: 'Genel', // <-- EKLENDİ
    section: 'Giriş',
    type: 'instruction',
    text: 'Yaşadığınız sorunlar ya da güçlüklerle ilgili sorular soracağım ve bu sırada birtakım notlar alacağım. Başlamadan önce bir sorunuz var mı?'
  },
  {
    id: 'gen_yas',
    module: 'Genel', // <-- EKLENDİ
    section: 'Kişisel Bilgiler',
    type: 'text',
    text: 'Kaç yaşındasınız?'
  },
  {
    id: 'gen_yasam_durumu',
    module: 'Genel', // <-- EKLENDİ
    section: 'Kişisel Bilgiler',
    type: 'text',
    text: 'Kimle yaşıyorsunuz? (Ne gibi bir yerde yaşıyorsunuz?)'
  },
  {
    id: 'gen_is_durumu_1',
    module: 'Genel', // <-- EKLENDİ
    section: 'İş Durumu',
    type: 'text',
    text: 'Ne iş yapıyorsunuz? Her zaman bu tür bir iş mi yaptınız?'
  },
  {
    id: 'gen_is_durumu_2',
    module: 'Genel', // <-- EKLENDİ
    section: 'İş Durumu',
    type: 'textarea',
    text: 'Şu sıralar bir işiniz var mı (size ödeme yapılıyor mu)? Yan zamanlı mı, yoksa tam zamanlı mı çalışıyorsunuz? YANIT HAYIRSA: Neden? En son ne zaman çalıştınız? Şimdi nasıl geçiniyorsunuz?'
  },
  // ... DİĞER TÜM "genelDegerlendirme_data" NESNELERİNE "module: 'Genel'" ÖZELLİĞİ EKLENMELİDİR ...
  {
    id: 'gen_diger_sorunlar',
    module: 'Genel', // <-- EKLENDİ
    section: 'O Sıradaki Diğer Sorunlar',
    type: 'textarea',
    text: 'Geçen ay herhangi başka bir sorununuz oldu mu? (İşyerinde, evde işler ve diğer insanlarla olan ilişkiler nasıl gidiyor?)'
  },
];