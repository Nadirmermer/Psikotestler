// src/features/scid/data/module-c.data.ts

import { ScidQuestion } from "./scid5cv.data";

export const moduleC_data: ScidQuestion[] = [
  // --- BÖLÜM C: PSİKOZLA GİDEN BOZUKLUKLARIN AYIRICI TANISI ---
  {
    id: 'C_START',
    module: 'C',
    type: 'instruction',
    text: '## C. PSİKOZLA GİDEN BOZUKLUKLARIN AYIRICI TANISI'
  },
  {
    id: 'C1',
    module: 'C',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Modül B\'de herhangi bir psikoz belirtisi saptandı mı?',
    criteria: 'Modül B\'deki psikoz maddeleri hiç bulunmamışsa, D1\'e geçin (Duygudurum Bozukluklarının Ayırıcı Tanısı).',
    calculation: {
        // B1'den B24'e kadar olan tüm psikoz belirtisi sorularını kaynak alır
        sources: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20', 'B21', 'B22', 'B23_B24'],
        condition: 'any_positive', // Herhangi bir '+' varsa EVET döner
    },
    skipLogic: { 'HAYIR': 'D1' } // Psikoz yoksa direkt Modül D'ye atla
  },
  {
    id: 'C2',
    module: 'C',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Şizofreni A tanı ölçütü karşılanıyor mu?',
    criteria: '**Şizofreni A Tanı Ölçütü:** Aşağıdaki belirtilerden ikisi (ya da daha çoğu) bulunur ve bunlardan en az biri (1), (2) ya da (3) olmalıdır:\n1. Sanrılar (B1-B13)\n2. Varsanılar (B14-B19)\n3. Darmadağın konuşma (B20)\n4. İleri derecede dağınık davranış ya da katatoni (B21-B22)\n5. Silik (negatif) belirtiler (B23-B24)',
    calculation: {
        sources: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20', 'B21', 'B22', 'B23_B24'],
        condition: 'schizophrenia_A', // Özel bir hesaplama mantığı gerektirir
    },
    skipLogic: { 'HAYIR': 'C13' } // Şizofreni A ölçütü karşılanmıyorsa Sanrılı Bozukluk'a git
  },
  {
    id: 'C3',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Şizoduygulanımsal Bozukluk ve Psikoz Özellikli Duygudurum Bozukluğu dışlanabildi mi? \n\n(Yani, ya hiç duygudurum dönemi olmadı ya da duygudurum dönemleri, hastalığın toplam süresinin azınlığında [%50\'den az] bulundu mu?)',
    criteria: '**Şizofreni D Tanı Ölçütü:** Şizoduygulanımsal Bozukluk ve Psikoz Özellikleri Gösteren Depresyon Bozukluğu ya da İkiuçlu Bozukluk dışlanmıştır.',
    options: [{ label: 'Evet (Dışlandı)', value: '+' }, { label: 'Hayır (Dışlanamadı)', value: '-' }],
    skipLogic: { '-': 'C9' } // Dışlanamadıysa Şizoduygulanımsal Bozukluk'a git
  },
  {
    id: 'C4',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bozukluğun süregiden bulguları en az 6 ay sürdü mü? (Bu 6 aylık evre, en az 1 aylık aktif belirti dönemi içermelidir)',
    criteria: '**Şizofreni C Tanı Ölçütü:** Bu bozukluğun süregiden bulguları en az 6 ay sürer.',
    options: [{ label: 'Evet (6+ ay)', value: '+' }, { label: 'Hayır (<6 ay)', value: '-' }],
    skipLogic: { '-': 'C7' } // 6 aydan kısa ise Şizofrenimsi Bozukluk'a git
  },
  {
    id: 'C5',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bozukluğun başlangıcından beri iş, kişilerarası ilişkiler ya da kendine bakım gibi alanlarda işlevsellik düzeyi belirgin olarak düştü mü?',
    criteria: '**Şizofreni B Tanı Ölçütü:** Başlıca bir ya da birden çok alanda işlevsellik düzeyi, bu bozukluğun başlangıcından önce erişilen düzeyin belirgin olarak altındadır.',
    options: [{ label: 'Evet (Düşüş Var)', value: '+' }, { label: 'Hayır (Düşüş Yok)', value: '-' }],
    skipLogic: { '-': 'C22' } // İşlevsellik düşüşü yoksa Tanımlanmamış'a git
  },
  {
    id: 'C6',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk, bir maddenin veya başka bir sağlık durumunun fizyolojik etkilerine bağlanabilir mi?',
    criteria: '**Şizofreni E Tanı Ölçütü:** Bu bozukluk, bir maddenin... etkilerine bağlanamaz.',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
    // Bu adımdan sonra Şizofreni tanısı konur ve zaman dizinine geçilir.
    skipLogic: { '+': 'C25' } 
  },
  // --- ŞİZOFRENİMSİ BOZUKLUK (C7-C8) ---
{
    id: 'C7',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Belirtiler en az 1 ay, ancak 6 aydan daha kısa mı sürdü?',
    criteria: 'ŞİZOFRENİMSİ BOZUKLUK İÇİN TANI ÖLÇÜTLERİ\nB. ...en az 1 ay, ancak 6 aydan daha kısa sürer.',
    options: [{ label: 'Evet (1-6 ay)', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C19' } // Kısa Psikoz Bozukluğu'na git
},
{
    id: 'C8',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk, bir maddenin veya başka bir sağlık durumunun fizyolojik etkilerine bağlanabilir mi?',
    criteria: 'D. Bu bozukluk bir maddenin ... etkilerine bağlanamaz.',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
    skipLogic: { '+': 'C26' } // Şizofrenimsi Tanısı için Zamandizinine git
},

// --- ŞİZODUYGULANIMSAL BOZUKLUK (C9-C12) ---
{
    id: 'C9',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Yeğin bir duygudurum dönemiyle (Mani veya Depresyon) eşzamanlı olarak Şizofreninin A tanı ölçütünü tam karşılayan kesintisiz bir hastalık süreci oldu mu?',
    criteria: 'ŞİZODUYGULANIMSAL BOZUKLUK İÇİN TANI ÖLÇÜTLERİ\nA. ...kesintisiz bir hastalık sürecinin olması.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C10',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Hastalığın yaşam boyu süresince, yeğin bir duygudurum döneminin olmadığı 2 hafta ya da daha uzun bir süre sanrılar ya da varsanılar bulundu mu?',
    criteria: 'B. Hastalığın yasamboyu süresince, yeğin bir duygudurum döneminin olmadığı 2 hafta ya da daha uzun bir süre sanrılar ya da varsanılar bulunur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C11',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Yeğin duygudurum dönemi belirtileri, hastalığın açık ve artakalan kesimlerinin toplam süresinin çoğunluğunda (%50 veya daha çoğu) mı bulundu?',
    criteria: 'C. Yeğin bir duygudurum dönemi için tanı ölçütlerini karşılayan belirtiler, hastalığın ... toplam süresinin çoğunluğunda bulunur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C12',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk, bir maddenin veya başka bir sağlık durumunun etkilerine bağlanabilir mi?',
    criteria: 'D. Bu bozukluk bir maddenin ... etkilerine bağlanamaz.',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
    skipLogic: { '+': 'C27' } // Şizoduygulanımsal Tanısı için Zamandizinine git
},

// --- SANRILI BOZUKLUK (C13-C18) ---
{
    id: 'C13',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bir ay ya da daha uzun süren bir (ya da daha çok) sanrının varlığı söz konusu mu?',
    criteria: 'SANRILI BOZUKLUK\nA. Bir ay ya da daha uzun süren, bir (ya da daha çok) sanrının varlığı.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C19' }
},
{
    id: 'C14',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Şizofreninin A tanı ölçütü HİÇBİR ZAMAN karşılanmadı mı?',
    criteria: 'B. Şizofreninin A tanı ölçütü hiçbir zaman karşılanmamıştır.',
    options: [{ label: 'Evet (Karşılanmadı)', value: '+' }, { label: 'Hayır (Karşılandı)', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C15',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Sanrının etkileri dışında, işlevsellik belirgin olarak bozulmamış ve davranışlar açıkça yadırganacak denli olağana aykırı değil mi?',
    criteria: 'C. Sanrının ... dışında ... işlevsellik belirgin olarak bozulmamıştır ve davranışlar, açıkça, yadırganacak denli olağana aykırı değildir.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C16',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Mani ya da Yeğin Depresyon dönemleri olduysa, bunların süresi sanrılı dönemlerin süresine göre daha mı kısa oldu?',
    criteria: 'D. Mani ya da Yeğin Depresyon Dönemleri ortaya çıkmışsa, bunların süresi, sanrılı dönemlerin süresine göre daha kısa olmuştur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C17',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk, bir maddenin veya başka bir sağlık durumunun etkilerine bağlanabilir mi?',
    criteria: 'E. Bu bozukluk bir maddenin ... etkilerine bağlanamaz.',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
    skipLogic: { '+': 'C18' }
},
{
    id: 'C18',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk Beden Algısı Bozukluğu ya da Takıntı-Zorlantı Bozukluğu gibi başka bir ruhsal bozuklukla daha iyi açıklanamaz mı?',
    criteria: '(E tanı ölçütünün gerisi)',
    options: [{ label: 'Evet (Açıklanamaz)', value: '+' }, { label: 'Hayır (Açıklanır)', value: '-' }],
    skipLogic: { '+': 'C28', '-': 'C22' }
},

// --- KISA PSİKOZ BOZUKLUĞU (C19-C21) ---
{
    id: 'C19',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Aşağıdaki belirtilerden birinin (ya da daha çoğunun) varlığı söz konusu mu? \n1. Sanrılar (B1-13)\n2. Varsanılar (B14-19)\n3. Darmadağın konuşma (B20)\n4. İleri derecede dağınık davranış ya da katatoni (B21-22)',
    criteria: 'KISA PSİKOZ BOZUKLUĞU\nA. ...birinin (ya da daha çoğunun) varlığı.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C20',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluğun bir dönemi, en az 1 gün, ancak 1 aydan daha kısa sürdü ve en sonunda hastalık öncesi işlevsellik düzeyine tam geri dönüldü mü?',
    criteria: 'B. Bu bozukluğun bir dönemi, en az 1 gün, ancak 1 aydan daha kısa sürer ve en sonunda hastalık öncesi işlevsellik düzeyine tam geri dönülür.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'C22' }
},
{
    id: 'C21',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk, başka bir bozuklukla daha iyi açıklanamaz ve bir maddenin/sağlık durumunun etkilerine bağlanamaz mı?',
    criteria: 'C. Bu bozukluk ... daha iyi açıklanamaz ve bir maddenin ... etkilerine bağlanamaz.',
    options: [{ label: 'Evet (Açıklanamaz)', value: '+' }, { label: 'Hayır (Açıklanır)', value: '-' }],
    skipLogic: { '+': 'C29' }
},

// --- DİĞER TANILAR VE ZAMAN DİZİNİ (C22-C30) ---
{
    id: 'C22',
    module: 'C',
    type: 'instruction',
    text: 'TANI: Tanımlanmış Diğer Bir Psikozla Giden Bozukluk (veya Tanımlanmamış).\n\nBelirtiler, Sizofreni Kapsamında ve Psikozla Giden Diğer Bozukluklar tanı kümesindeki herhangi birinin tanısı için tanı ölçütlerini tam karşılamıyor.',
    skipLogic: { '*': 'C23' }
},
{
    id: 'C23',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Belirtiler klinik açıdan belirgin bir sıkıntıya ya da işlevsellikte düşmeye neden oluyor mu?',
    criteria: '(Belirtiler) klinik açıdan belirgin bir sıkıntıya ya da ... işlevsellikte düşmeye neden olur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'D1' }
},
{
    id: 'C24',
    module: 'C',
    type: 'question',
    text: 'DEĞERLENDİRME: Madde/sağlık durumu dışlanabildi mi?',
    criteria: 'Bu bozukluk ... bir maddenin ... etkilerine bağlanamaz.',
    options: [{ label: 'Evet (Birincil)', value: '+' }, { label: 'Hayır (İkincil)', value: '-' }],
    skipLogic: { '+': 'C30' }
},
{
    id: 'C25',
    module: 'C',
    type: 'instruction',
    text: '## TANI: ŞİZOFRENİ',
    skipLogic: { '*': 'D1' }
},
{
    id: 'C26',
    module: 'C',
    type: 'instruction',
    text: '## TANI: ŞİZOFRENİMSİ BOZUKLUK',
    skipLogic: { '*': 'D1' }
},
{
    id: 'C27',
    module: 'C',
    type: 'instruction',
    text: '## TANI: ŞİZODUYGULANIMSAL BOZUKLUK',
    skipLogic: { '*': 'D1' }
},
{
    id: 'C28',
    module: 'C',
    type: 'instruction',
    text: '## TANI: SANRILI BOZUKLUK',
    skipLogic: { '*': 'D1' }
},
{
    id: 'C29',
    module: 'C',
    type: 'instruction',
    text: '## TANI: KISA PSİKOZ BOZUKLUĞU',
    skipLogic: { '*': 'D1' }
},
{
    id: 'C30',
    module: 'C',
    type: 'instruction',
    text: '## TANI: TANIMLANMIŞ DİĞER BİR PSİKOZLA GİDEN BOZUKLUK',
    skipLogic: { '*': 'D1' }
},
  {
    id: 'MODUL_C_SONU',
    module: 'C',
    type: 'instruction',
    text: "## Modül C: Psikozla Giden Bozuklukların Ayırıcı Tanısı Tamamlandı.",
    skipLogic: { '*': 'D1' } // Her durumda Modül D'ye geçiş
  }
];