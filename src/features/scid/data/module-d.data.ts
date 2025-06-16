// src/features/scid/data/module-d.data.ts (Tamamlanmış Hali)

import { ScidQuestion } from "./scid5cv.data";

export const moduleD_data: ScidQuestion[] = [
  // --- BÖLÜM D: DUYGUDURUM BOZUKLUKLARININ AYIRICI TANISI ---
  {
    id: 'D_START',
    module: 'D',
    type: 'instruction',
    text: '## D. DUYGUDURUM BOZUKLUKLARININ AYIRICI TANISI'
  },
  {
    id: 'D1',
    module: 'D',
    type: 'instruction',
    text: '**DEĞERLENDİRME:** Klinik açıdan belirgin duygudurum belirtileri hiç olmamışsa ya da bütün duygudurum belirtileri Şizoduygulanımsal Bozukluk tanısı ile açıklanabiliyorsa, bu modülü atlayın ve Modül E\'ye geçin. Yoksa D2 ile sürdürün.',
  },

  // --- İKİUÇLU I BOZUKLUĞU (D2-D3) ---
  {
    id: 'D2',
    module: 'D',
    type: 'calculation',
    text: 'DEĞERLENDİRME: En az bir Mani Dönemi (A40/A65) için tanı ölçütleri karşılandı mı?',
    criteria: '**İKİUÇLU I BOZUKLUĞU TANI ÖLÇÜTLERİ\nA. En az bir Mani Dönemi için tanı ölçütleri karşılanmıştır.** ',
    calculation: {
        sources: ['A40', 'A65'],
        condition: 'any_positive',
    },
    skipLogic: { 'HAYIR': 'D4' }
  },
  {
    id: 'D3',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Mani ve Yeğin Depresyon Dönem(ler)inin ortaya çıkışı Şizoduygulanımsal Bozukluk, Şizofreni, vb. psikozla giden bozukluklarla daha iyi açıklanamaz mı?',
    criteria: 'B. Mani ve Yeğin Depresyon Dönem(ler)inin ortaya çıkışı ... daha iyi açıklanamaz. ',
    options: [{ label: 'Evet (Daha İyi Açıklanamaz)', value: '+' }, { label: 'Hayır (Daha İyi Açıklanır)', value: '-' }],
    skipLogic: { '+': 'D17', '-': 'D4' }
  },

  // --- İKİUÇLU II BOZUKLUĞU (D4-D7) ---
  {
    id: 'D4',
    module: 'D',
    type: 'calculation',
    text: 'DEĞERLENDİRME: En az bir Hipomani Dönemi (A53/A77) VE en az bir Yeğin Depresyon Dönemi (A12/A26) için tanı ölçütleri karşılandı mı?',
    criteria: '**İKİUÇLU II BOZUKLUĞU TANI ÖLÇÜTLERİ\nA. En az bir Hipomani Dönemi ve en az bir Yeğin Depresyon Dönemi için tanı ölçütleri karşılanmıştır.** ',
    calculation: {
        sources: ['A53', 'A77', 'A12', 'A26'],
        condition: 'bipolar_II_check',
    },
    skipLogic: { 'HAYIR': 'D8' }
  },
  {
    id: 'D5',
    module: 'D',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Hiçbir zaman bir Mani Dönemi oldu mu?',
    criteria: 'B. Hiçbir zaman bir Mani Dönemi olmamıştır. ',
    calculation: {
        sources: ['A40', 'A65'],
        condition: 'any_positive',
    },
    skipLogic: { 'EVET': 'D2' } // EVET ise Bipolar I'dir, D2'ye geri dönülmeli
  },
  {
    id: 'D6',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Hipomani ve Yeğin Depresyon Dönem(ler)inin ortaya çıkışı Şizoduygulanımsal Bozukluk vb. ile daha iyi açıklanamaz mı?',
    criteria: 'C. Hipomani Dönem(ler)inin ve Yeğin Depresyon Dönem(ler)inin ortaya çıkışı ... daha iyi açıklanamaz. ',
    options: [{ label: 'Evet (Açıklanamaz)', value: '+' }, { label: 'Hayır (Açıklanır)', value: '-' }],
    skipLogic: { '-': 'D8' }
  },
  {
    id: 'D7',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Depresyon belirtileri ya da dönemler arası sık gidip gelmeler klinik açıdan belirgin bir sıkıntıya ya da işlevsellikte düşmeye neden oluyor mu?',
    criteria: 'D. Depresyon belirtileri ... klinik açıdan belirgin bir sıkıntıya ya da ... işlevsellikte düşmeye neden olur. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '+': 'D21', '-': 'D8' }
  },

  // --- TANIMLANMIŞ DİĞER BİR İKİUÇLU BOZUKLUK (D8-D10) ---
  {
    id: 'D8',
    module: 'D',
    type: 'instruction',
    text: 'DEĞERLENDİRME: İkiuçlu ve ilişkili Bozukluğa özgü belirtiler baskındır ancak İkiuçlu I ya da İkiuçlu II için tanı ölçütlerini tam karşılamamaktadır.',
    criteria: 'TANIMLANMIŞ DİĞER BİR İKİUÇLU BOZUKLUK ',
    skipLogic: { '*': 'D9' }
  },
  {
    id: 'D9',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Belirtiler klinik açıdan belirgin bir sıkıntıya ya da işlevsellikte düşmeye neden oluyor mu?',
    criteria: '(Belirtiler) klinik açıdan belirgin bir sıkıntıya ya da ... işlevsellikte düşmeye neden olur. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'D11' }
  },
  {
    id: 'D10',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk bir maddenin veya sağlık durumunun etkilerine bağlanabilir mi?',
    criteria: '(Birincil İkiuçlu Bozukluk) Bu bozukluk bir maddenin ... etkilerine bağlanamaz. ',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
    skipLogic: { '+': 'D23' } // Tanı konur, zamandizinine gidilir
  },

  // --- YEĞİN DEPRESYON BOZUKLUĞU (D11-D13) ---
  {
    id: 'D11',
    module: 'D',
    type: 'calculation',
    text: 'DEĞERLENDİRME: En az bir Yeğin Depresyon Dönemi (A12/A26) oldu mu?',
    criteria: '**YEĞİN DEPRESYON BOZUKLUĞU TANI ÖLÇÜTLERİ\nA.-C. En az bir Yeğin Depresyon Dönemi.** ',
    calculation: {
        sources: ['A12', 'A26'],
        condition: 'any_positive'
    },
    skipLogic: { 'HAYIR': 'D14' }
  },
  {
    id: 'D12',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluğun ortaya çıkışı Şizoduygulanımsal Bozukluk vb. ile daha iyi açıklanamaz mı?',
    criteria: 'D. Yeğin Depresyon Bozukluğunun ortaya çıkışı ... daha iyi açıklanamaz. ',
    options: [{ label: 'Evet (Açıklanamaz)', value: '+' }, { label: 'Hayır (Açıklanır)', value: '-' }],
    skipLogic: { '-': 'D14' }
  },
  {
    id: 'D13',
    module: 'D',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Hiçbir zaman Mani ya da Hipomani Dönemi oldu mu?',
    criteria: 'E. Mani Dönemi ya da Hipomani Dönemi hiç olmamıştır. ',
    calculation: {
        sources: ['A40', 'A65', 'A53', 'A77'],
        condition: 'any_positive'
    },
    skipLogic: { 'EVET': 'D2', 'HAYIR': 'D24' }
  },

  // --- TANIMLANMIŞ DİĞER BİR DEPRESYON BOZUKLUĞU (D14-D16) ---
  {
    id: 'D14',
    module: 'D',
    type: 'instruction',
    text: 'DEĞERLENDİRME: Depresyon bozukluğuna özgü belirtiler baskındır ancak Yeğin Depresyon Bozukluğu vb. için tanı ölçütleri tam karşılanmamaktadır.',
    criteria: 'TANIMLANMIŞ DİĞER BİR DEPRESYON BOZUKLUĞU ',
    skipLogic: { '*': 'D15' }
  },
  {
    id: 'D15',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Belirtiler klinik açıdan belirgin bir sıkıntıya ya da işlevsellikte düşmeye neden oluyor mu?',
    criteria: '(Belirtiler) klinik açıdan belirgin bir sıkıntıya ya da ... işlevsellikte düşmeye neden olur. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'E1' } // Modül E'ye geç
  },
  {
    id: 'D16',
    module: 'D',
    type: 'question',
    text: 'DEĞERLENDİRME: Bu bozukluk bir maddenin veya sağlık durumunun etkilerine bağlanabilir mi?',
    criteria: '(Birincil Depresyon Bozukluğu) Bu bozukluk bir maddenin ... etkilerine bağlanamaz.',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
    skipLogic: { '+': 'D25' }
  },

  // --- TANI BELİRTİCİLERİ VE ZAMANDİZİNİ (D17-D25) ---
  {
    id: 'D17',
    module: 'D',
    type: 'summary',
    text: '## TANI: İKİUÇLU I BOZUKLUĞU \n\n O sıradaki ya da en son dönemin türünü belirtin (Mani, Hipomani, Yeğin Depresyon, Belirlenmemiş).',
    skipLogic: { '*': 'E1' }
  },
  {
    id: 'D21',
    module: 'D',
    type: 'summary',
    text: '## TANI: İKİUÇLU II BOZUKLUĞU \n\n O sıradaki ya da en son dönemin türünü belirtin (Hipomani, Yeğin Depresyon). ',
    skipLogic: { '*': 'E1' }
  },
  {
    id: 'D23',
    module: 'D',
    type: 'summary',
    text: '## TANI: TANIMLANMIŞ DİĞER BİR İKİUÇLU BOZUKLUK ',
    skipLogic: { '*': 'E1' }
  },
  {
    id: 'D24',
    module: 'D',
    type: 'summary',
    text: '## TANI: YEĞİN DEPRESYON BOZUKLUĞU \n\n Uygun sayıyı seçin: 1-Tek Dönem, 2-Yineleyici. ',
    skipLogic: { '*': 'E1' }
  },
  {
    id: 'D25',
    module: 'D',
    type: 'summary',
    text: '## TANI: TANIMLANMIŞ DİĞER BİR DEPRESYON BOZUKLUĞU',
    skipLogic: { '*': 'E1' }
  }
];