// src/features/scid/data/genel-degerlendirme.data.ts (Düzeltilmiş Hali)

import { ScidQuestion } from "./scid5cv.data"; // Merkezi tipten import ediyoruz

// Artık AssessmentQuestion arayüzüne ihtiyacımız yok.
// Direkt olarak ScidQuestion tipinde bir dizi oluşturuyoruz.
export const genelDegerlendirme_data: ScidQuestion[] = [
  // GİRİŞ
  {
    id: 'gen_giris',
    module: 'Genel',
    section: 'Giriş',
    type: 'instruction',
    text: 'Yaşadığınız sorunlar ya da güçlüklerle ilgili sorular soracağım ve bu sırada birtakım notlar alacağım. Başlamadan önce bir sorunuz var mı?'
  },

  // KİŞİSEL BİLGİLER
  {
    id: 'gen_yas',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'text',
    text: 'Kaç yaşındasınız?'
  },
  {
    id: 'gen_yasam_durumu',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'text',
    text: 'Kimle yaşıyorsunuz? (Ne gibi bir yerde yaşıyorsunuz?)'
  },
  {
    id: 'gen_is_nedir',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'text',
    text: 'Ne iş yapıyorsunuz?'
  },
  {
    id: 'gen_is_surekli',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'text',
    text: 'Her zaman bu tür bir iş mi yaptınız?'
  },
  {
    id: 'gen_is_var_mi',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'question',
    text: 'Şu sıralar bir işiniz var mı (size ödeme yapılıyor mu)?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ]
  },
  {
    id: 'gen_is_evet_zaman',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'question',
    text: 'YANIT EVETSE: Yan zamanlı mı, yoksa tam zamanlı mı çalışıyorsunuz?',
    options: [
      { label: 'Yan zamanlı', value: 'yan_zamanli' },
      { label: 'Tam zamanlı', value: 'tam_zamanli' }
    ],
    skipLogic: { 'gen_is_var_mi': 'evet' }
  },
  {
    id: 'gen_is_yari_zamanli_detay',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'textarea',
    text: 'YARI ZAMANLI İSE: Genelde haftada kaç saat çalışıyorsunuz? (Tam zamanlı çalışmak yerine neden yarı zamanlı çalışıyorsunuz?)',
    skipLogic: { 'gen_is_evet_zaman': 'yan_zamanli' }
  },
  {
    id: 'gen_is_hayir_neden',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'textarea',
    text: 'YANIT HAYIRSA: Neden? En son ne zaman çalıştınız? Şimdi nasıl geçiniyorsunuz?',
    skipLogic: { 'gen_is_var_mi': 'hayir' }
  },
  {
    id: 'gen_engelli_odeme',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'textarea',
    text: 'ENGELLİ İSE: Bu sıralar engelli ödeneği (özürlü maaşı) alıyor musunuz? Neden engelli olarak tanımlanıyorsunuz?'
  },
  {
    id: 'gen_calismama_donemi',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'question',
    text: 'BİLİNMİYORSA: Çalışamadığınız ya da okula gidemediğiniz bir zaman dilimi oldu mu?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ]
  },
  {
    id: 'gen_calismama_neden',
    module: 'Genel',
    section: 'Kişisel Bilgiler',
    type: 'textarea',
    text: 'YANIT EVETSE: Neden?',
    skipLogic: { 'gen_calismama_donemi': 'evet' }
  },

  // O SIRADAKİ HASTALIĞIN ÖYKÜSÜ
  {
    id: 'gen_gelme_nedeni',
    module: 'Genel',
    section: 'O Sıradaki Hastalığın Öyküsü',
    type: 'textarea',
    text: '(Bu kez) buraya gelmenizin nedeni ne? (Yaşadığınız başlıca sorun ne?)'
  },
  {
    id: 'gen_sorun_ortaya_cikis',
    module: 'Genel',
    section: 'O Sıradaki Hastalığın Öyküsü',
    type: 'textarea',
    text: 'Bu sorununuz ortaya çıktığında yaşamınızda neler olup bitiyordu?'
  },
  {
    id: 'gen_son_iyi_hissetme',
    module: 'Genel',
    section: 'O Sıradaki Hastalığın Öyküsü',
    type: 'textarea',
    text: 'En son ne zaman kendinizi (her zamanki gibi) iyi hissediyordunuz?'
  },

  // TEDAVİ ÖYKÜSÜ
  {
    id: 'gen_tedavi_aciklama',
    module: 'Genel',
    section: 'Tedavi Öyküsü',
    type: 'instruction',
    text: 'Not: Genel değerlendirmenin bu bölümünün amacı, kişinin yaşam boyu psikopatolojisinin genel bir görünümünü belirlemektir. Aşırı ayrıntılara girmekten kaçının. Geçmiş önemli dönemler için belirtileri, kullanılan ilaçları, uygulanan diğer tedavileri ("Bunu için ne gibi bir tedavi uygulandı?") ve yaklaşık başlangıç ve bitiş zamanlarını ("Ne zaman başladı? Ne zaman kendinizi daha iyi hissediyordunuz?") belirleyin.'
  },
  {
    id: 'gen_ilk_basvuru',
    module: 'Genel',
    section: 'Tedavi Öyküsü',
    type: 'textarea',
    text: 'Ruhsal sorunlarınız için ilk kez ne zaman başvuruda bulundunuz? (Ne içindi? Ne gibi tedavi[ler] aldınız? Hangi ilaçları?)'
  },
  {
    id: 'gen_hastane_yatis',
    module: 'Genel',
    section: 'Tedavi Öyküsü',
    type: 'question',
    text: 'Psikiyatri hastanesine yattığınız oldu mu?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ]
  },
  {
    id: 'gen_hastane_neden',
    module: 'Genel',
    section: 'Tedavi Öyküsü',
    type: 'textarea',
    text: 'YANIT EVETSE: Ne için yattınız? (Kaç kez?)',
    skipLogic: { 'gen_hastane_yatis': 'evet' }
  },
  {
    id: 'gen_hastane_diger_nedenler',
    module: 'Genel',
    section: 'Tedavi Öyküsü',
    type: 'instruction',
    text: 'YETERSİZ BİR YANIT VERİLDİYSE, İNCELİKLE ÜZERİNE GİDİN-örn. Başka bir şey olmasın? İnsanlar, psikiyatri hastanelerine, yalnızca (yorgun/gergin/KENDİ SÖZCÜKLERİ) oldukları için gitmezler.'
  },
  {
    id: 'gen_madde_tedavisi',
    module: 'Genel',
    section: 'Tedavi Öyküsü',
    type: 'textarea',
    text: 'Alkol ya da madde tedavisi gördünüz mü?'
  },

  // SAĞLIK SORUNLARI
  {
    id: 'gen_saglik_durumu',
    module: 'Genel',
    section: 'Sağlık Sorunları',
    type: 'textarea',
    text: 'Genel sağlık durumunuz nasıldır? (Herhangi bir sağlık sorununuz var mı?)'
  },
  {
    id: 'gen_hastane_yatis_saglik',
    module: 'Genel',
    section: 'Sağlık Sorunları',
    type: 'textarea',
    text: 'Herhangi bir sağlık sorununuz için hastaneye yattığınız oldu mu? (Ne için yattınız?)'
  },
  {
    id: 'gen_ilac_kullanimi',
    module: 'Genel',
    section: 'Sağlık Sorunları',
    type: 'question',
    text: 'Herhangi bir ilaç, vitamin ya da başka bir besin destekçisi (söylediklerinizin dışında) kullanıyor musunuz?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ]
  },
  {
    id: 'gen_ilac_detay',
    module: 'Genel',
    section: 'Sağlık Sorunları',
    type: 'textarea',
    text: 'YANIT EVETSE: Ne alıyorsunuz ve hangi dozda?',
    skipLogic: { 'gen_ilac_kullanimi': 'evet' }
  },

  // KENDİNİ ÖLDÜRME DÜŞÜNCELERİ VE DAVRANIŞLARI
  {
    id: 'gen_olme_dusuncesi',
    module: 'Genel',
    section: 'Kendini Öldürme Düşünceleri ve Davranışları',
    type: 'question',
    text: 'DÜŞÜNCELERİ DEĞERLENDİRİN: Ölmüş olmayı istediğiniz ya da uyuyup da uyanmak istemediğiniz oldu mu? (Bunu biraz açar mısınız?)',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ]
  },
  {
    id: 'gen_gecen_hafta_dusunce',
    module: 'Genel',
    section: 'Kendini Öldürme Düşünceleri ve Davranışları',
    type: 'question',
    text: 'YANIT EVETSE: (Bugün de içinde olmak üzere) geçen hafta böyle bir düşünceniz oldu mu?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ],
    skipLogic: { 'gen_olme_dusuncesi': 'evet' }
  },
  {
    id: 'gen_yogun_istek',
    module: 'Genel',
    section: 'Kendini Öldürme Düşünceleri ve Davranışları',
    type: 'textarea',
    text: 'YANIT EVETSE: TASARLAYIP TASARLAMADIĞINI DEĞERLENDİRİN: Geçen hafta herhangi bir zaman, kendinizi öldürmek için yoğun bir istek duyduğunuz oldu mu? (Bunu biraz açar mısınız?)',
    skipLogic: { 'gen_gecen_hafta_dusunce': 'evet' }
  },
  {
    id: 'gen_tasari_yontem',
    module: 'Genel',
    section: 'Kendini Öldürme Düşünceleri ve Davranışları',
    type: 'textarea',
    text: 'TASARI VE YÖNTEMİ DEĞERLENDİRİN: Geçen hafta, gerçekten bunu nasıl yapabileceğinizi düşündünüz mü? (Ne yapmayı düşündüğünüzü biraz açar mısınız?) Bunu yerine getirebilmek için neye gerek duyacağınızı düşündünüz mü? (Bunu biraz açar mısınız? Bunu yapmak için araç ve gereçleriniz var mı?)',
    skipLogic: { 'gen_gecen_hafta_dusunce': 'evet' }
  },

  // KENDİNİ ÖLDÜRME GİRİŞİMİ
  {
    id: 'gen_oldurme_girisimi',
    module: 'Genel',
    section: 'Kendini Öldürme Girişimi',
    type: 'question',
    text: 'GİRİŞİMİ DEĞERLENDİRİN: Hiç kendinizi öldürmeye kalkıştığınız oldu mu?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ]
  },
  {
    id: 'gen_yaralama_girisimi',
    module: 'Genel',
    section: 'Kendini Öldürme Girişimi',
    type: 'question',
    text: 'YANIT HAYIRSA: Hiç kendinizi yaralama girişiminde bulunduğunuz oldu mu?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ],
    skipLogic: { 'gen_oldurme_girisimi': 'hayir' }
  },
  {
    id: 'gen_girisim_detay',
    module: 'Genel',
    section: 'Kendini Öldürme Girişimi',
    type: 'textarea',
    text: 'YANIT EVETSE: Ne yaptınız? (Ne olduğunu anlatır mısınız?) Yaşamınızı sonlandırmaya mı çalıştınız?',
    skipLogic: { 'gen_oldurme_girisimi': 'evet' }
  },
  {
    id: 'gen_en_agir_girisim',
    module: 'Genel',
    section: 'Kendini Öldürme Girişimi',
    type: 'instruction',
    text: 'BİRDEN ÇOK GİRİŞİM VARSA: Hangi girişiminiz en ağır sağlık sorunlarına yol açtı (acil servise gitme, hastaneye yatırılmayı gerektirme, yoğun bakım tedavisine gerek olması)?'
  },
  {
    id: 'gen_gecen_hafta_girisim',
    module: 'Genel',
    section: 'Kendini Öldürme Girişimi',
    type: 'question',
    text: '(Bugün de içinde olmak üzere) geçen hafta kendinizi öldürme girişiminiz oldu mu?',
    options: [
      { label: 'Evet', value: 'evet' },
      { label: 'Hayır', value: 'hayir' }
    ]
  },

  // O SIRADAKİ DİĞER SORUNLAR
  {
    id: 'gen_diger_sorunlar',
    module: 'Genel',
    section: 'O Sıradaki Diğer Sorunlar',
    type: 'textarea',
    text: 'Geçen ay herhangi başka bir sorununuz oldu mu? (İşyerinde, evde işler ve diğer insanlarla olan ilişkiler nasıl gidiyor?)'
  },
  {
    id: 'gen_duygusal_durum',
    module: 'Genel',
    section: 'O Sıradaki Diğer Sorunlar',
    type: 'textarea',
    text: 'Duygusal durumunuz nasıl?'
  },
  {
    id: 'gen_alkol_kullanimi',
    module: 'Genel',
    section: 'O Sıradaki Diğer Sorunlar',
    type: 'textarea',
    text: 'Geçen ay ne denli içki içtiniz?'
  },
  {
    id: 'gen_alkol_sosyal',
    module: 'Genel',
    section: 'O Sıradaki Diğer Sorunlar',
    type: 'textarea',
    text: 'İçerken, genellikle kimle birlikte oluyorsunuz? (Genellikle tek başına mı, yoksa diğer insanlarla birlikte mi oluyorsunuz?)'
  },
  {
    id: 'gen_madde_kullanimi',
    module: 'Genel',
    section: 'O Sıradaki Diğer Sorunlar',
    type: 'textarea',
    text: 'Geçen ay herhangi bir yasadışı madde kullandınız mı? Size verilen ilaçları önerildiğinden daha çok kullandınız mı ya da ilaçlarının zamanından önce bitmesi söz konusu oldu mu?'
  }
];