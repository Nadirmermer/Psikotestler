// src/features/scid/data/module-g.data.ts

import { ScidQuestion } from "./scid5cv.data";

export const moduleG_data: ScidQuestion[] = [
  // --- BÖLÜM G: TZB ve ÖSGB ---
  {
    id: 'G_START',
    module: 'G',
    type: 'instruction',
    text: '## G. TAKINTI-ZORLANTI BOZUKLUĞU ve ÖRSELENME SONRASI GERGİNLİK BOZUKLUĞU'
  },

  // --- TAKINTI-ZORLANTI BOZUKLUĞU (G1-G8) ---
  {
    id: 'G1_INSTRUCTION',
    module: 'G',
    section: 'TAKINTI-ZORLANTI BOZUKLUĞU',
    type: 'instruction',
    text: 'Şimdi size, istemediğiniz halde aklınıza gelen düşünceler veya yapmak zorunda hissettiğiniz davranışlarla ilgili bazı sorular soracağım.'
  },
  {
    id: 'G1_G2',
    module: 'G',
    type: 'question',
    text: `İstemediğiniz halde gelip duran düşüncelerden, dürtülerden veya imgelerden (görüntülerden) rahatsız olduğunuz oldu mu? (Örn: mikrop bulaşması, sevdiğiniz birine zarar verme dürtüsü, şiddet veya cinsel içerikli görüntüler) \n\n**YANIT EVETSE:** Bu düşüncelere aldırmamaya, bunları baskılamaya ya da başka bir düşünce/eylemle etkisizleştirmeye çalıştınız mı?`,
    criteria: '**Takıntılar (Obsesyonlar):** \n1. Kimi zaman zorla ve istenmeden geliyor gibi yaşanan, belirgin bir kaygı ya da sıkıntıya neden olan, yineleyici ve sürekli düşünceler, itkiler ya da imgeler. \n2. Kişi, bu düşüncelere, itkilere ya da imgelere aldırmamaya ya da bunları baskılamaya çalışır...',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
  },
  {
    id: 'G3_G4',
    module: 'G',
    type: 'question',
    text: `Yeniden yeniden yapmak durumunda kaldığınız ve yapmaya karşı koymakta güçlük çektiğiniz eylemler (el yıkama, denetleme) veya zihinsel eylemler (sayı sayma, dua etme) var mı? \n\n**YANIT EVETSE:** Bu davranışları, bir sıkıntıdan korunma, sıkıntıyı azaltma veya korkulan bir olaydan sakınma amacıyla mı yapıyorsunuz?`,
    criteria: '**Zorlantılar (Kompulsiyonlar):** \n1. Kişinin ... yapmaya zorlanmış gibi hissettiği yinelemeli davranışlar ya da zihinsel eylemler. \n2. Bu davranışlar ... yaşanan kaygı ya da sıkıntıdan korunma ya da bunları azaltma ... amacıyla yapılır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
  },
  {
    id: 'G5',
    module: 'G',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Takıntıların (G1_G2) veya Zorlantıların (G3_G4) varlığı saptandı mı?',
    criteria: 'A. Takıntıların (obsesyonların), zorlantıların (kompulsiyonların) ya da her ikisinin birlikte varlığı.',
    calculation: { sources: ['G1_G2', 'G3_G4'], condition: 'any_positive' },
    skipLogic: { 'HAYIR': 'G9' }
  },
  {
    id: 'G6',
    module: 'G',
    type: 'question',
    text: 'Bu takıntılar ya da zorlantılar zamanınızı alıyor mu (örn. günde bir saatten çok) ya da klinik açıdan belirgin bir sıkıntıya veya işlevsellikte (toplumsal, işle ilgili) düşmeye neden oluyor mu?',
    criteria: 'B. Takıntılar ya da zorlantılar kişinin zamanını alır ... ya da klinik açıdan belirgin bir sıkıntıya ... neden olur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { 'HAYIR': 'G9' }
  },
  {
    id: 'G7',
    module: 'G',
    type: 'question',
    text: 'Bu belirtiler, bir maddenin veya başka bir sağlık durumunun fizyolojik etkilerine bağlanabilir mi?',
    criteria: 'C. Takıntı-zorlantı belirtileri, bir maddenin ... ya da başka bir sağlık durumunun ... etkilerine bağlanamaz.',
    options: [{ label: 'Evet (Bağlanabilir)', value: '-' }, { label: 'Hayır (Bağlanamaz)', value: '+' }],
  },
  {
    id: 'G8',
    module: 'G',
    type: 'question',
    text: 'Bu bozukluk, başka bir ruhsal bozukluğun (örn. YKB, Beden Algısı B., Biriktiricilik B.) belirtileriyle daha iyi açıklanabilir mi?',
    criteria: 'D. Bu bozukluk, başka bir ruhsal bozukluğun belirtileriyle daha iyi açıklanamaz.',
    options: [{ label: 'Evet (Açıklanır)', value: '-' }, { label: 'Hayır (Açıklanamaz)', value: '+' }],
    skipLogic: { '*': 'G9' }
  },

  // --- ÖRSELENME SONRASI GERGİNLİK BOZUKLUĞU (G9-G41) ---
  {
    id: 'G9',
    module: 'G',
    section: 'ÖRSELENME SONRASI GERGİNLİK BOZUKLUĞU',
    type: 'instruction',
    text: `**YAŞAM BOYU ÖRSELENME ÖYKÜSÜ** \n\n Şimdi, başınıza gelmiş ve sizi son derece altüst etmiş olabilecek birtakım konularla ilgili sorular sormak istiyorum. \n\n *(Aşağıdaki sorularla her bir tür örselenmeyi tarayın):* \n - Büyük bir doğa olayı ya da yangın, savaş ya da önemli bir kaza gibi, ölebileceğiniz bir durumda kaldığınız oldu mu? \n - Bedensel ya da cinsel olarak saldırıya uğradığınız ya da sömürüldüğünüz oldu mu? \n - Bir başkasının öldürüldüğünü ya da ağır yaralandığını gördüğünüz oldu mu? \n - Size yakın birinin başına bu olaylardan birinin geldiğini öğrendiniz mi?`
  },
  {
    id: 'G10',
    module: 'G',
    type: 'trauma_event_input',
    text: '**GEÇMİŞTE YAŞANMIŞ OLAY #1:** \n\n *(En kötü veya en etkili olduğunu düşündüğünüz olayı tanımlayın)*'
  },
  {
    id: 'G11',
    module: 'G',
    type: 'trauma_event_input',
    text: '**GEÇMİŞTE YAŞANMIŞ OLAY #2:**'
  },
  {
    id: 'G12',
    module: 'G',
    type: 'trauma_event_input',
    text: '**GEÇMİŞTE YAŞANMIŞ OLAY #3:**'
  },
  {
    id: 'G13',
    module: 'G',
    type: 'instruction', // Uygulamada bu bir 'trauma_selection' bileşeni olacak
    text: 'DEĞERLENDİRME: Bu olaylardan hangisi sizi en çok etkiledi? \n\n *(Aşağıdaki soruları bu seçilen olay üzerinden değerlendirin)*'
  },
// --- KRİTER B: İSTENÇDIŞI GELEN BELİRTİLER (G14-G19) ---
// --- ÖSGB KRİTERLERİ (G14-G41) ---
// Bu bloğu G13'ten sonra ekleyin

// --- KRİTER B: İSTENÇDIŞI GELEN BELİRTİLER (G14-G19) ---
{
  id: 'G14',
  module: 'G',
  type: 'question',
  text: 'Seçtiğiniz (ÖRSELEYİCİ OLAY)\'dan beri, bekleniyor ve istemiyorken, duygular, bedensel duyumlar, sesler, kokular ya da imgeler de içinde olmak üzere, olayın birtakım anılarını yaşadınız mı? (Ne sıklıkta oldu?)',
  criteria: 'B. Örseleyici olay(lar)dan sonra başlayan, istençdışı gelen aşağıdaki belirtilerin birinin (ya da daha çoğunun) varlığı:\n\n1. Örseleyici olay(lar)ın yineleyici, istemsiz ve istençdışı gelen, sıkıntı veren anıları.',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
  id: 'G15',
  module: 'G',
  type: 'question',
  text: '(ÖRSELEYİCİ OLAY)\'ı anımsatan, sizi altüst eden düşler yeniden yeniden ortaya çıkıyor mu?',
  criteria: '2. İçeriği ve/ya da duygulanımı örseleyici olay(lar)la ilişkili, yineleyici, sıkıntı veren düşler.',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
  id: 'G16',
  module: 'G',
  type: 'question',
  text: 'Kendinizi, sanki (ÖRSELEYİCİ OLAY) yeniden oluyormuş gibi davranırken ya da hissederken bulduğunuz oldu mu? (Geçmişe dönüşler yaşadınız mı?)',
  criteria: '3. Kişinin, örseleyici olay(lar) yeniden oluyormuş gibi hissettiği ya da davrandığı çözülme tepkileri (örn. geçmişe dönüşler).',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
  id: 'G17',
  module: 'G',
  type: 'question',
  text: '(ÖRSELEYİCİ OLAY)\'ı simgeleyen ya da çağrıştıran iç ya da dış uyaranlarla karşılaşınca yoğun ya da uzun süreli bir ruhsal sıkıntı yaşıyor musunuz?',
  criteria: '4. ...karşılaşınca yoğun ya da uzun süreli bir ruhsal sıkıntı yaşama.',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
  id: 'G18',
  module: 'G',
  type: 'question',
  text: '(ÖRSELEYİCİ OLAY)\'ı anımsatan bir konu olduğunda, ter boşanması, kalp çarpıntısı gibi birtakım bedensel belirtileriniz oluyor mu?',
  criteria: '5. ...karşı fizyolojiyle ilgili belirgin tepkiler gösterme.',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
  id: 'G19',
  module: 'G',
  type: 'calculation',
  text: 'DEĞERLENDİRME: B tanı ölçütü (istençdışı gelen belirtiler) karşılandı mı? (G14-G18 arası en az BİRİ "+")',
  criteria: 'B Kriteri: En az bir belirti gereklidir.',
  calculation: { sources: ['G14', 'G15', 'G16', 'G17', 'G18'], condition: 'any_positive' },
  skipLogic: { 'HAYIR': 'H1' }
},

// --- KRİTER C: KAÇINMA (G20-G22) ---
{
  id: 'G20',
  module: 'G',
  type: 'question',
  text: '(ÖRSELEYİCİ OLAY)\'la ilgili ya da yakından ilişkili, sıkıntı veren anılar, düşünceler ya da duygulardan kaçınmak için bir şeyler yaptınız mı?',
  criteria: 'C. ...uyaranlardan sürekli bir biçimde kaçınma:\n\n1. ...sıkıntı veren anılar, düşünceler ya da duygulardan kaçınma...',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
  id: 'G21',
  module: 'G',
  type: 'question',
  text: '(ÖRSELEYİCİ OLAY)\'la ilgili sıkıntı veren anıları, düşünceleri ya da duyguları uyandıran dış anımsatıcılardan (insanlar, yerler, konuşmalar) kaçındınız mı?',
  criteria: '2. ...sıkıntı veren anıları, düşünceleri ya da duyguları uyandıran dış anımsatıcılardan kaçınma...',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
  id: 'G22',
  module: 'G',
  type: 'calculation',
  text: 'DEĞERLENDİRME: C tanı ölçütü (kaçınma) karşılandı mı? (G20-G21\'den en az BİRİ "+")',
  criteria: 'C Kriteri: Bir ya da her iki belirtinin de olması gereklidir.',
  calculation: { sources: ['G20', 'G21'], condition: 'any_positive' },
  skipLogic: { 'HAYIR': 'H1' }
},

// --- KRİTER D: BİLİŞLERDE VE DUYGUDURUMDA OLUMSUZ DEĞİŞİKLİKLER (G23-G30) ---
{ id: 'G23', module: 'G', type: 'question', text: 'Olayın önemli bir yönünü anımsayamadığınız oluyor mu?', criteria: '1. Önemli bir yönünü anımsayamama.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G24', module: 'G', type: 'question', text: 'Kendiniz, başkaları ya da dünya ile ilgili olarak, sürekli ve abartılı olumsuz inançlarınız var mı?', criteria: '2. Sürekli ve abartılı olumsuz inançlar.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G25', module: 'G', type: 'question', text: 'Olayın nedenleri ya da sonuçlarıyla ilgili olarak, kendinizi ya da başkalarını suçlamanıza yol açan, çarpık bilişleriniz var mı?', criteria: '3. Olay hakkında çarpık bilişler.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G26', module: 'G', type: 'question', text: 'Sürekli bir biçimde olumsuz bir duygusal durum (korku, öfke, suçluluk, utanç) içinde misiniz?', criteria: '4. Süreklilik gösteren olumsuz duygusal durum.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G27', module: 'G', type: 'question', text: 'Önemli etkinliklere karşı ilginizde belirgin bir azalma oldu mu?', criteria: '5. Önemli etkinliklere karşı ilgide belirgin azalma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G28', module: 'G', type: 'question', text: 'Başkalarından uzaklaşma ya da yabancılaşma duyguları yaşıyor musunuz?', criteria: '6. Başkalarından uzaklaşma ya da yabancılaşma duyguları.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G29', module: 'G', type: 'question', text: 'Sürekli bir biçimde, olumlu duygular (mutluluk, sevgi) yaşayamadığınız oluyor mu?', criteria: '7. Sürekli bir biçimde, olumlu duygular yaşayamama.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{
  id: 'G30',
  module: 'G',
  type: 'calculation',
  text: 'DEĞERLENDİRME: D tanı ölçütü (biliş/duygudurum) karşılandı mı? (G23-G29 arası en az İKİSİ "+")',
  criteria: 'D Kriteri: En az iki belirti gereklidir.',
  calculation: { sources: ['G23', 'G24', 'G25', 'G26', 'G27', 'G28', 'G29'], condition: 'count_positive', threshold: 2 },
  skipLogic: { 'HAYIR': 'H1' }
},

// --- KRİTER E: UYARILMA VE TEPKİ GÖSTERMEDE DEĞİŞİKLİKLER (G31-G37) ---
{ id: 'G31', module: 'G', type: 'question', text: 'Kızgın davranışlar ve öfke patlamaları oluyor mu?', criteria: '1. Kızgın davranışlar ve öfke patlamaları.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G32', module: 'G', type: 'question', text: 'Sakınmaksızın davranma ya da kendine zarar veren davranışlarda bulunma oluyor mu?', criteria: '2. Sakınmaksızın davranma ya da kendine zarar veren davranış.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G33', module: 'G', type: 'question', text: 'Her an tetikte olma (aşırı sakınganlık) durumunuz var mı?', criteria: '3. Her an tetikte olma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G34', module: 'G', type: 'question', text: 'Abartılı bir irkilme tepkiniz oluyor mu?', criteria: '4. Abartılı irkilme tepkileri gösterme.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G35', module: 'G', type: 'question', text: 'Odaklanma güçlükleri yaşıyor musunuz?', criteria: '5. Odaklanma güçlükleri.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{ id: 'G36', module: 'G', type: 'question', text: 'Uyku bozukluğunuz var mı?', criteria: '6. Uyku bozukluğu.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
{
  id: 'G37',
  module: 'G',
  type: 'calculation',
  text: 'DEĞERLENDİRME: E tanı ölçütü (uyarılma) karşılandı mı? (G31-G36 arası en az İKİSİ "+")',
  criteria: 'E Kriteri: En az iki belirti gereklidir.',
  calculation: { sources: ['G31', 'G32', 'G33', 'G34', 'G35', 'G36'], condition: 'count_positive', threshold: 2 },
  skipLogic: { 'HAYIR': 'H1' }
},

// --- SON KRİTERLER (G38-G41) ---
{
  id: 'G38',
  module: 'G',
  type: 'question',
  text: 'Bu bozukluğun (B, C, D ve E tanı ölçütlerindeki belirtiler) süresi bir aydan daha uzun mudur?',
  criteria: 'F. Süre: Bir aydan daha uzun.',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
  skipLogic: { 'HAYIR': 'H1' }
},
{
  id: 'G39',
  module: 'G',
  type: 'question',
  text: 'Bu bozukluk, klinik açıdan belirgin bir sıkıntıya ya da işlevsellikte düşmeye neden oluyor mu?',
  criteria: 'G. Klinik Açıdan Belirgin Sıkıntı ya da İşlevsellikte Düşme.',
  options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
  skipLogic: { 'HAYIR': 'H1' }
},
{
  id: 'G40',
  module: 'G',
  type: 'question',
  text: 'Bu bozukluk, bir maddenin ya da başka bir sağlık durumunun fizyolojik etkilerine bağlanabilir mi?',
  criteria: 'H. Madde/Sağlık Durumu Dışlaması.',
  options: [{ label: 'Evet (Bağlanabilir)', value: '-' }, { label: 'Hayır (Bağlanamaz)', value: '+' }],
},
{
  id: 'G41',
  module: 'G',
  type: 'summary',
  text: '## TANI: ÖRSELENME SONRASI GERGİNLİK BOZUKLUĞU',
  skipLogic: { '*': 'H1' }
},
{
  id: 'MODUL_G_SONU',
  module: 'G',
  type: 'instruction',
  text: "## Modül G: TZB ve ÖSGB Tamamlandı.",
  skipLogic: { '*': 'H1' }
}

];