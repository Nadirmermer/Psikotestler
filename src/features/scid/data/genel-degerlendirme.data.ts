// src/features/scid/data/genel-degerlendirme.data.ts

export interface AssessmentQuestion {
    id: string;
    section: 'Giriş' | 'Kişisel Bilgiler' | 'İş Durumu' | 'Tedavi Öyküsü' | 'Sağlık Sorunları' | 'Kendini Öldürme Düşünceleri' | 'O Sıradaki Diğer Sorunlar';
    type: 'instruction' | 'text' | 'textarea';
    text: string;
  }
  
  export const genelDegerlendirme_data: AssessmentQuestion[] = [
    {
      id: 'gen_giris',
      section: 'Giriş',
      type: 'instruction',
      text: 'Yaşadığınız sorunlar ya da güçlüklerle ilgili sorular soracağım ve bu sırada birtakım notlar alacağım. Başlamadan önce bir sorunuz var mı? '
    },
    {
      id: 'gen_yas',
      section: 'Kişisel Bilgiler',
      type: 'text',
      text: 'Kaç yaşındasınız? '
    },
    {
      id: 'gen_yasam_durumu',
      section: 'Kişisel Bilgiler',
      type: 'text',
      text: 'Kimle yaşıyorsunuz? (Ne gibi bir yerde yaşıyorsunuz?) '
    },
    {
      id: 'gen_is_durumu_1',
      section: 'İş Durumu',
      type: 'text',
      text: 'Ne iş yapıyorsunuz? Her zaman bu tür bir iş mi yaptınız? '
    },
    {
      id: 'gen_is_durumu_2',
      section: 'İş Durumu',
      type: 'textarea',
      text: 'Şu sıralar bir işiniz var mı (size ödeme yapılıyor mu)? Yan zamanlı mı, yoksa tam zamanlı mı çalışıyorsunuz?  YANIT HAYIRSA: Neden? En son ne zaman çalıştınız? Şimdi nasıl geçiniyorsunuz? '
    },
    {
      id: 'gen_tedavi_oykusu_1',
      section: 'Tedavi Öyküsü',
      type: 'instruction',
      text: 'TEDAVİ ÖYKÜSÜ: Geçmiş yeğin dönemler icin belirtileri, kullanılan ilaçları, uygulanan diğer tedavileri ve yaklaşık başlangıç ve bitiş zamanlarını belirleyin. '
    },
    {
      id: 'gen_tedavi_oykusu_2',
      section: 'Tedavi Öyküsü',
      type: 'textarea',
      text: 'Ruhsal sorunlarınız için ilk kez ne zaman başvuruda bulundunuz? (Ne içindi? Ne gibi tedavi[ler] aldınız? Hangi ilaçları?) '
    },
    {
      id: 'gen_tedavi_oykusu_3',
      section: 'Tedavi Öyküsü',
      type: 'textarea',
      text: 'Psikiyatri hastanesine yattığınız oldu mu? (Ne için yattınız? Kaç kez?) '
    },
      {
      id: 'gen_tedavi_oykusu_4',
      section: 'Tedavi Öyküsü',
      type: 'textarea',
      text: 'Alkol ya da madde tedavisi gördünüz mü? '
    },
    {
      id: 'gen_saglik_sorunlari_1',
      section: 'Sağlık Sorunları',
      type: 'textarea',
      text: 'Genel sağlık durumunuz nasıldır? (Herhangi bir sağlık sorununuz var mı?) '
    },
    {
      id: 'gen_saglik_sorunlari_2',
      section: 'Sağlık Sorunları',
      type: 'textarea',
      text: 'Herhangi bir ilaç, vitamin ya da başka bir besin destekçisi (söylediklerinizin dışında) kullanıyor musunuz? (Ne alıyorsunuz ve hangi dozda?) '
    },
    {
      id: 'gen_intihar_1',
      section: 'Kendini Öldürme Düşünceleri',
      type: 'textarea',
      text: 'Ölmüş olmayı istediğiniz ya da uyuyup da uyanmak istemediğiniz oldu mu? (Bunu biraz açar mısınız?) '
    },
    {
      id: 'gen_intihar_2',
      section: 'Kendini Öldürme Düşünceleri',
      type: 'textarea',
      text: 'Hiç kendinizi öldürmeye kalkıştığınız oldu mu?  YANIT EVETSE: Ne yaptınız? Yaşamınızı sonlandırmaya mı çalıştınız? '
    },
    {
      id: 'gen_diger_sorunlar',
      section: 'O Sıradaki Diğer Sorunlar',
      type: 'textarea',
      text: 'Geçen ay herhangi başka bir sorununuz oldu mu? (İşyerinde, evde işler ve diğer insanlarla olan ilişkiler nasıl gidiyor?) '
    },
  ];