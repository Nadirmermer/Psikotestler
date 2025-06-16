// src/features/scid/data/module-a.data.ts

import { ScidQuestion } from "./scid5cv.data"; // Ana tiplerimizi import edelim

export const moduleA_data: ScidQuestion[] = [
  // --- O SIRADAKİ YEĞİN DEPRESYON DÖNEMİ ---
  {
    id: 'A_START_INSTRUCTION',
    module: 'A',
    type: 'instruction',
    text: '## A. DUYGUDURUM DÖNEMLERİ \n\n ### O Sıradaki Yeğin Depresyon Dönemi \n\n Şimdi, duygusal durumunuzla ilgili olarak birtakım sorular daha soracağım.',
  },
  {
    id: 'A1',
    module: 'A',
    type: 'question',
    text: `Geçen ay, (BİR AY ÖNCESİ)'nden beri, neredeyse her gün, günün büyük bir bölümünde, kendinizi çökkün ya da çok üzgün hissettiğiniz bir zaman dilimi oldu mu? (Üzgün, üzüntülü ya da çökkün göründüğünüzü söyleyen oldu mu?)
    \n**YANIT HAYIRSA:** Neredeyse her gün, günün büyük bir bölümünde, kendinizi üzüntülü, boşlukta ya da umutsuz hissettiğiniz?`,
    criteria: `**A. Ölçütü (1): Çökkün duygudurum**\n\nÇökkün duygudurum, neredeyse her gün, günün büyük bir bölümünde bulunur ve bu durumu ya kişinin kendisi bildirir (öm. üzüntülüdür, kendini boşlukta hisseder ya da umutsuzdur) ya da bu durum başkalarınca gözlenir (örn, ağlamaklı görünür).`,
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'Nasıl bir durumdu? Ne denli uzun sürdü? (2 hafta gibi bir süre?)',
  },
  {
    id: 'A2',
    module: 'A',
    type: 'question',
    text: `Bu zaman diliminde, genellikle hoşlandığınız etkinliklere karşı daha az mı ilgi duydunuz ya da bunlardan daha az mı zevk aldınız? (Nasıl bir durumdu?)
    \n**ÖNCEKİ MADDE "-" DEĞERLENDİRİLDİYSE:** Genellikle hoşlandığınız etkinliklere karşı daha az ilgi duyduğunuz ya da bunlardan daha az zevk aldığınız?`,
    criteria: `**A. Ölçütü (2): İlgi/zevk kaybı (Anhedoni)**\n\nBütün ya da neredeyse bütün etkinliklere karşı ilgide belirgin azalma ya da bunlardan zevk almama durumu, neredeyse her gün, günün büyük bir bölümünde bulunur.`,
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { check: 'A1_A2_HAYIR', target: 'A15' }, // Özel kontrol: A1 ve A2 hayırsa A15'e git
    notePlaceholder: 'Neredeyse her gün müydü? Ne denli uzun sürdü? (2 hafta gibi bir süre?)',
  },
  {
    id: 'A_FOCUS_INSTRUCTION',
    module: 'A',
    type: 'instruction',
    text: '### AŞAĞIDAKİ SORULAR İÇİN, GEÇEN AYIN EN KÖTÜ 2 HAFTASINA ODAKLANIN:',
  },
  {
    id: 'A3',
    module: 'A',
    type: 'question',
    text: `Bu 2 haftalık süreçte yeme isteğiniz nasıldı? (Her zamankiyle karşılaştırınca? Yemek için kendinizi zorlamak durumunda kaldınız mı? Her zamankinden (daha az/daha çok) mu yediniz? Neredeyse her gün mü böyle oldu? Kilo verdiniz ya da aldınız mı?)`,
    criteria: `**A. Ölçütü (3): Kilo/Yeme İsteği Değişikliği**\n\nKilo vermeye çalışmıyorken çok kilo verme ya da kilo alma (örn: bir ay içinde ağırlığının % 5'inden daha çok) ya da neredeyse her gün, yeme isteğinde azalma ya da artma.`,
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'Ne denli? ((Kilo vermeye/almaya) çalışıyor muydunuz?)',
  },
  {
    id: 'A4',
    module: 'A',
    type: 'question',
    text: 'Uykunuz nasıldı? (Uykuya dalmakta güçlük, sık sık uyanma, uykuyu sürdürmekte güçlük, çok erken kalkma YA DA çok uyuma?)',
    criteria: `**A. Ölçütü (4): Uyku bozukluğu**\n\nNeredeyse her gün, uykusuzluk çekme ya da aşırı uyuma.`,
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'Kaç saat uyuyordunuz (kestirmeler de içinde olmak üzere)? Çökkün olmadan önce genelde kaç saat uyurdunuz? Neredeyse her gece mi böyle oluyordu?',
  },
  // ... PDF'teki A5'ten A77'ye kadar olan tüm sorular buraya aynı formatta eklenecek.
  // Bu, projenin en önemli veri giriş kısmıdır. Her sorunun metni, kriteri, not istemi
  // ve özellikle atlama mantığı (skipLogic) doğru bir şekilde girilmelidir.
];