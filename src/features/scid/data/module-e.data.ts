// src/features/scid/data/module-e.data.ts (Tamamlanmış Hali)

import { ScidQuestion } from "./scid5cv.data";

export const moduleE_data: ScidQuestion[] = [
  // --- BÖLÜM E: MADDE KULLANIM BOZUKLUKLARI ---
  {
    id: 'E_START',
    module: 'E',
    type: 'instruction',
    text: '## E. MADDE KULLANIM BOZUKLUKLARI'
  },
  
  // --- Alkol Kullanım Bozukluğu (E1-E13) ---
  {
    id: 'E1',
    module: 'E',
    section: 'Alkol Kullanım Bozukluğu (Son 12 Ay)',
    type: 'question',
    text: 'İçki içme alışkanlığınız var mı? \n\n(Son 12 ay içinde, yani (BİR YIL ÖNCESİ)\'nden beri, en az altı kez alkol aldığınız oldu mu?)',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'E14' }
  },
  {
    id: 'E1_INSTRUCTION',
    module: 'E',
    type: 'instruction',
    text: 'Şimdi, son 12 ay içinde süren, içki içme alışkanlığınızla ilgili birtakım sorular daha sormak istiyorum...'
  },
  {
    id: 'E2',
    module: 'E',
    type: 'question',
    text: 'Bir kez içmeye başlayınca, kendinizi, sonunda, istediğinizden belirgin olarak daha çok içmiş olarak bulduğunuz ya da istediğinizden çok daha uzun süreli içki içtiğiniz oldu mu?',
    criteria: '1. Çoğu kez, istendiğinden daha büyük ölçüde ya da daha uzun süreli olarak alkol alınır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E3',
    module: 'E',
    type: 'question',
    text: 'İçki içmeyi durdurmayı, bırakmayı ya da denetim altında tutmayı isteyip de başaramadığınız oldu mu?',
    criteria: '2. Alkol kullanmayı bırakmak ya da denetim altında tutmak için sürekli bir istek ya da bir sonuç vermeyen çabalar vardır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E4',
    module: 'E',
    type: 'question',
    text: 'İçki içmek, sarhoş olmak ya da akşamdan kalmış olmak çok zamanınızı alıyor muydu?',
    criteria: '3. Alkol elde etmek, alkol kullanmak ya da yarattığı etkilerden kurtulmak için gerekli etkinliklere çok zaman ayırma.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E5',
    module: 'E',
    type: 'question',
    text: 'İçki içmek için yoğun bir isteğinizin olduğu ya da içinizin gittiği oluyor muydu?',
    criteria: '4. Alkol kullanmaya içinin gitmesi ya da alkol kullanmak için çok büyük bir istek duyma.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E6',
    module: 'E',
    type: 'question',
    text: 'Sarhoş, taşkın ya da akşamdan kalma olduğunuz için işten ya da okuldan kaldığınız ya da evdeki başlıca yükümlülüklerinizi yerine getiremediğiniz oldu mu?',
    criteria: '5. İşte, okulda ya da evdeki konumunun gereği olan başlıca yükümlülüklerini yerine getirememe ile sonuçlanan yineleyici alkol kullanımı.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E7',
    module: 'E',
    type: 'question',
    text: 'İçki içmeniz, aile bireyleri, arkadaşlarınız ya da diğer insanlarla sorunlara yol açmasına karşın içki içmeyi sürdürdünüz mü?',
    criteria: '6. Alkolün etkilerinin neden olduğu ya da alevlendirdiği sürekli ya da yineleyici toplumsal ve kişilerarası sorunlar olmasına karşın alkol kullanımını sürdürme.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E8',
    module: 'E',
    type: 'question',
    text: 'İçki içtiğiniz için sizin için önemli toplumsal, işle ilgili ya da eğlence-dinlenme etkinliklerini bıraktığınız ya da azalttığınız oldu mu?',
    criteria: '7. Alkol kullanımından ötürü önemli birtakım toplumsal, işle ilgili etkinliklerin ya da eğlenme-dinlenme etkinliklerinin bırakılması ya da azaltılması.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E9',
    module: 'E',
    type: 'question',
    text: 'Araba kullanma, makine kullanma gibi tehlikeli olabilecek durumlarda yineleyici bir biçimde alkol kullandığınız oldu mu?',
    criteria: '8. Yineleyici bir biçimde, tehlikeli olabilecek durumlarda alkol kullanma.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E10',
    module: 'E',
    type: 'question',
    text: 'Alkolün neden olduğu ya da alevlendirdiği sürekli ya da yineleyici bedensel ya da ruhsal bir sorununuz olduğunu bilmenize karşın alkol kullanmayı sürdürdünüz mü?',
    criteria: '9. Büyük bir olasılıkla alkolün neden olduğu ya da alevlendirdiği sürekli ya da yineleyici bedensel ya da ruhsal bir sorunu olduğu bilgisine karşın alkol kullanımı sürdürülür.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
  {
    id: 'E11',
    module: 'E',
    type: 'question',
    text: 'Dayanıklılık (tolerans) gelişti mi? Yani, istediğiniz etkiyi sağlamak için belirgin olarak daha çok içmeniz gerektiği ya da aynı ölçüde içmenize karşın belirgin olarak daha az etki sağlandığı oldu mu?',
    criteria: '10. Aşağıdakilerden biriyle tanımlandığı üzere, dayanıklılık (tolerans) gelişmiş olması.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
  },
{
    id: 'E12',
    module: 'E',
    type: 'question',
    text: 'Yoksunluk belirtisi yaşadınız mı? (İçki içmeyince terleme, titreme, uykusuzluk, bulantı gibi). Ya da yoksunluktan kaçınmak için tekrar içki içtiğiniz oldu mu?',
    criteria: `**11. Yoksunluk Gelişmiş Olması:** \n\n Alkol kullanımının bırakılmasından sonra, aşağıdaki belirtilerden en az ikisinin gelişmesi: \n\n1. Otonom aşırı etkinlik (terleme, kalp hızında artış). \n2. El titremesi. \n3. Uykusuzluk. \n4. Bulantı ya da kusma. \n5. Gelip geçici görsel, dokunsal ya da duysal varsanılar/yanılsamalar. \n6. Ruhsal-devinsel kışkırma (psikomotor ajitasyon). \n7. Bunaltı. \n8. Grand mal katılmalar. `,
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
  {
    id: 'E13',
    module: 'E',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Alkol Kullanım Bozukluğu',
    criteria: 'Son 12 ayda, en az 2 belirti ile kendini gösteren sorunlu alkol kullanım örüntüsü.',
    calculation: {
        sources: ['E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12'],
        condition: 'count_positive_severity'
    },
    notePlaceholder: 'Hesaplanan Ciddiyet Düzeyi: (Ağır Olmayan: 2-3, Orta: 4-5, Ağır: 6+ belirti)',
    skipLogic: { '*': 'E14' }
  },

  // --- Alkol Dışı Madde Kullanım Bozukluğu (E14'ten itibaren) ---
  {
    id: 'E14',
    module: 'E',
    section: 'Alkol Dışı Madde Kullanım Bozukluğu (Son 12 Ay)',
    type: 'substance_checklist',
    text: 'Şimdi, son 12 ay içinde, madde ya da ilaç kullanmanızla ilgili birtakım sorular sormak istiyorum. Aşağıdakilerden herhangi birini kullandınız mı?',
    substance_list: [
        { id: 'sedatives', name: 'Dinginleştirici, Uyku Verici ya da Kaygı Gidericiler' },
        { id: 'cannabis', name: 'Kenevir Türevleri (Esrar, "ot")' },
        { id: 'stimulants', name: 'Uyarıcılar (Amfetamin, Kokain, "krek")' },
        { id: 'opiates', name: 'Opiyatlar (Eroin, ağrı kesiciler)' },
        { id: 'pcp', name: 'Fensiklidin (PCP) ve İlişkili Maddeler' },
        { id: 'hallucinogens', name: 'Başka Varsandıranlar (LSD, "asit", mantar)' },
        { id: 'inhalants', name: 'Uçucular (Tutkal, boya, gaz)' },
        { id: 'other', name: 'Diğer (Anabolizan steroidler vb.)' }
    ],
    skipLogic: { 'NO_SUBSTANCE': 'F1' }
  },
  {
    id: 'E23_GENERIC',
    module: 'E',
    type: 'substance_questionnaire',
    text: 'Şimdi, son 12 ay içinde, **(MADDE)** kullanma alışkanlığınızla ilgili birtakım sorular sormak istiyorum...',
    criteria: 'MADDE KULLANIM BOZUKLUĞU TANI ÖLÇÜTLERİ',
    sub_questions: [
        {id: 'E24_GENERIC', text: 'İstediğinizden daha büyük ölçüde ya da daha uzun süreli olarak (MADDE) kullandığınız oldu mu?', criteria: '1. ...'},
        {id: 'E25_GENERIC', text: '(MADDE) kullanmayı bırakmak ya da denetim altında tutmak için başarısız çabalarınız oldu mu?', criteria: '2. ...'},
        {id: 'E26_GENERIC', text: '(MADDE) elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcadığınız oldu mu?', criteria: '3. ...'},
        {id: 'E27_GENERIC', text: '(MADDE) kullanmak için çok büyük bir istek duyduğunuz ya da içinizin gittiği oldu mu?', criteria: '4. ...'},
        {id: 'E28_GENERIC', text: '(MADDE) kullanımı yüzünden iş, okul ya da evdeki başlıca yükümlülüklerinizi yerine getiremediğiniz oldu mu?', criteria: '5. ...'},
        {id: 'E29_GENERIC', text: '(MADDE) kullanımının neden olduğu toplumsal ya da kişilerarası sorunlar olmasına karşın kullanmayı sürdürdünüz mü?', criteria: '6. ...'},
        {id: 'E30_GENERIC', text: '(MADDE) kullanımından ötürü önemli etkinlikleri bıraktığınız ya da azalttığınız oldu mu?', criteria: '7. ...'},
        {id: 'E31_GENERIC', text: 'Tehlikeli olabilecek durumlarda yineleyici bir biçimde (MADDE) kullandığınız oldu mu?', criteria: '8. ...'},
        {id: 'E32_GENERIC', text: '(MADDE) kullanımının neden olduğu bedensel ya da ruhsal bir sorununuz olduğunu bilmenize karşın kullanmayı sürdürdünüz mü?', criteria: '9. ...'},
        {id: 'E33_GENERIC', text: 'Dayanıklılık (tolerans) gelişti mi?', criteria: '10. ...'},
        {id: 'E34_GENERIC', text: 'Yoksunluk belirtileri yaşadınız mı?', criteria: `**11. Yoksunluk Gelişmiş Olması:** (Maddeye özgü sendrom) \n\n*Not: Bu tanı ölçütü PCP, varsandıranlar ya da uçuculara uygulanmaz.* \n\n**KENEVİR TÜREVLERİ (3+ belirti):** \n - Kolay kızma, öfke, saldırganlık \n - Sinirlilik, bunaltı \n - Uyku sorunu \n - Yeme isteğinde azalma/kilo verme \n - Huzursuzluk \n - Çökkün duygudurum \n - Bedensel belirtiler (karın ağrısı, titreme, terleme, ateş, baş ağrısı) \n\n**UYARICILAR/KOKAİN (Disfori + 2+ belirti):** \n - Yorgunluk \n - Canlı, hoş olmayan düşler \n - Uykusuzluk ya da aşırı uyku \n - Yeme isteğinde artma \n - Ruhsal-devinsel yavaşlama ya da kışkırma \n\n**OPİYATLAR (3+ belirti):** \n - Disfori duygudurumu \n - Bulantı ve kusma \n - Kas sızıları \n - Göz yaşı akması ya da burun akıntısı \n - Gözbebeklerinde büyüme, piloereksiyon, terleme \n - İshal \n - Esneme \n - Ateş \n - Uykusuzluk `
        },
    ]
  },
  {
    id: 'E35_GENERIC',
    module: 'E',
    type: 'calculation',
    text: 'DEĞERLENDİRME: **(MADDE)** Kullanım Bozukluğu',
    criteria: 'Son 12 ayda, en az 2 belirti ile kendini gösteren sorunlu madde kullanım örüntüsü.',
    calculation: {
        sources: ['E24_GENERIC', 'E25_GENERIC', 'E26_GENERIC', 'E27_GENERIC', 'E28_GENERIC', 'E29_GENERIC', 'E30_GENERIC', 'E31_GENERIC', 'E32_GENERIC', 'E33_GENERIC', 'E34_GENERIC'],
        condition: 'count_positive_severity'
    },
    notePlaceholder: 'Hesaplanan Ciddiyet Düzeyi: (Ağır Olmayan: 2-3, Orta: 4-5, Ağır: 6+ belirti)',
  },
  {
    id: 'MODUL_E_SONU',
    module: 'E',
    type: 'instruction',
    text: "## Modül E: Madde Kullanım Bozuklukları Tamamlandı.",
    skipLogic: { '*': 'F1' }
  }
];