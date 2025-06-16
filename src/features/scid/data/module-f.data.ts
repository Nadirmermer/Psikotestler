// src/features/scid/data/module-f.data.ts (Tamamlanmış Hali)

import { ScidQuestion } from "./scid5cv.data";

export const moduleF_data: ScidQuestion[] = [
  // --- BÖLÜM F: KAYGI BOZUKLUKLARI ---
  {
    id: 'F_START',
    module: 'F',
    type: 'instruction',
    text: '## F. KAYGI BOZUKLUKLARI'
  },

  // --- PANİK BOZUKLUĞU (F1-F22) ---
  {
    id: 'F1',
    module: 'F',
    section: 'YAŞAM BOYU PANİK BOZUKLUĞU',
    type: 'question',
    text: 'Birden çok korktuğunuz ya da kaygıya kapıldığınız ya da birçok bedensel belirtinizin ortaya çıktığı, yoğun bir bunaltı duygusunun bastırdığı ya da bir "panik atağı" olarak adlandırılabilecek bir durum hiç oldu mu? \n\n(Biraz açar mısınız? En kötüsü ne zaman oldu? Neye benziyordu?)',
    criteria: '**PANİK ATAĞI:** Dakikalar içinde doruğa ulaşan ... yoğun bir korku ya da yoğun bir içsel sıkıntının bastırdığı bir durumdur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F23' }
  },
  { id: 'F2', module: 'F', type: 'question', text: 'Bu atak sırasında... çarpıntınız oldu mu, kalbiniz küt küt attı mı ya da kalp hızınızın arttığını hissettiniz mi?', criteria: '1. Çarpıntı, kalbin küt küt atması ya da kalp hızının artması.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F3', module: 'F', type: 'question', text: '...terlediniz mi?', criteria: '2. Terleme.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F4', module: 'F', type: 'question', text: '...titremeniz ya da sarsılmanız oldu mu?', criteria: '3. Titreme ya da sarsılma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F5', module: 'F', type: 'question', text: '...soluk darlığı oldu mu? (Solumakta güçlük çektiniz mi? Boğuluyormuş gibi olduğunuz oldu mu?)', criteria: '4. Soluğun daraldığı ya da boğuluyor gibi olma duyumu.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F6', module: 'F', type: 'question', text: '...soluğunuz tıkanmış gibi oldu mu?', criteria: '5. Soluğun tıkandığı duyumu.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F7', module: 'F', type: 'question', text: '...göğüs ağrısı ya da göğsünüzde sıkışma oldu mu?', criteria: '6. Göğüs ağrısı ya da göğüste sıkışma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F8', module: 'F', type: 'question', text: '...bulantınız ya da karın ağrınız oldu mu?', criteria: '7. Bulantı ya da karın ağrısı.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F9', module: 'F', type: 'question', text: '...baş dönmesi, ayakta duramama ya da bayılacak gibi olma gibi bir durum oldu mu?', criteria: '8. Baş dönmesi, ayakta duramama, sersemlik ya da bayılacak gibi olma duyumu.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F10', module: 'F', type: 'question', text: '...üşümeniz, ürpermeniz oldu mu ya da ateş basması duyumu oldu mu?', criteria: '9. Üşüme, ürperme ya da ateş basması duyumu.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F11', module: 'F', type: 'question', text: '...vücudunuzda uyuşma ya da karıncalanma oldu mu?', criteria: '10. Uyuşmalar (duyumsuzluk ya da karıncalanma duyumları).', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F12', module: 'F', type: 'question', text: `...vücudunuzdan ya da zihninizden kopmuş gibi olduğunuz (kendine yabancılaşma) ya da çevrenizdeki her şeyin gerçekdışı olduğu (gerçekdışılaşma) bir yaşantınız oldu mu?`, criteria: '11. Gerçekdışılık (derealizasyon) ya da kendine yabancılaşma (depersonalizasyon).', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F13', module: 'F', type: 'question', text: '...çıldırıyor olmaktan ya da denetimini yitirecek gibi olmaktan korktunuz mu?', criteria: '12. Denetimini yitirme ya da "çıldırma" korkusu.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F14', module: 'F', type: 'question', text: '...ölüyor olmaktan korktunuz mu?', criteria: '13. Ölüm korkusu.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  {
    id: 'F15',
    module: 'F',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Panik atağı belirtilerinden (F2-F14) en az 4 tanesi karşılandı mı?',
    criteria: "YUKARIDAKİ A TANI ÖLÇÜTÜ BELİRTİLERİNDEN (F2-F14) EN AZ DÖRDÜ '+' OLARAK DEĞERLENDİRİLİR.",
    calculation: {
        sources: ['F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14'],
        condition: 'count_positive',
        threshold: 4,
    },
    skipLogic: { 'HAYIR': 'F23' }
  },
  {
    id: 'F16',
    module: 'F',
    type: 'question',
    text: 'Bu ataklardan herhangi birinin, ortada hiçbir neden yokken, beklenmedik bir şekilde ortaya çıktığı oldu mu? (En az iki beklenmedik atak oldu mu?)',
    criteria: 'A. Yineleyen beklenmedik panik atakları.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F23' }
  },
  {
    id: 'F17_F18',
    module: 'F',
    type: 'question',
    text: 'Ataklardan en az birinden sonra, 1 ay veya daha uzun süreyle, aşağıdaki durumlardan biri ya da her ikisi oldu mu?\n1. Başka panik ataklarının olacağı ya da bunların olası sonuçlarıyla (örn. denetimimi yitirme, kalp krizi geçirme) ilgili olarak sürekli bir kaygı duyma.\n2. Ataklarla ilgili olarak, uyum bozukluğuyla giden davranış değişiklikleri (örn. spor yapmaktan ya da tanıdık olmayan durumlardan kaçınma).',
    criteria: 'B. Ataklardan en az birinden sonra, aşağıdakilerden biri ya da her ikisi de bir ay (ya da daha uzun bir) süreyle olur...',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F23' }
  },
  {
    id: 'F19_F20',
    module: 'F',
    type: 'question',
    text: 'Bu bozukluk, bir maddenin (ilaç, kafein vb.) ya da başka bir sağlık durumunun (hipertiroidi vb.) fizyolojik etkilerine bağlanabilir mi?',
    criteria: 'C. Bu bozukluk, bir maddenin ... ya da başka bir sağlık durumunun ... etkilerine bağlanamaz.',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
  },
  {
    id: 'F21',
    module: 'F',
    type: 'question',
    text: 'Bu bozukluk, başka bir ruhsal bozuklukla (örn. Toplumsal Kaygı Bozukluğu, Özgül Fobi) daha iyi açıklanamaz mı?',
    criteria: 'D. Bu bozukluk, başka bir ruhsal bozuklukla daha iyi açıklanamaz.',
    options: [{ label: 'Evet (Açıklanamaz)', value: '+' }, { label: 'Hayır (Açıklanır)', value: '-' }],
    skipLogic: { '-': 'F23' }
  },
  {
    id: 'F22',
    module: 'F',
    type: 'summary',
    text: '## TANI: PANİK BOZUKLUĞU',
    skipLogic: { '*': 'F23' }
  },

  // --- AGORAFOBİ (F23-F31) ---
  {
    id: 'F23_INSTRUCTION',
    module: 'F',
    section: 'AGORAFOBİ',
    type: 'instruction',
    text: 'Şimdi size bazı durumlarla ilgili korku ve kaygılarınızı soracağım.'
  },
  { id: 'F23a', module: 'F', type: 'question', text: 'Son 6 aydır, toplu taşıma araçlarını kullanmaktan (otomobil, otobüs, tren, uçak vb.) belirgin bir korku ya da kaygı duyuyor musunuz?', criteria: 'A. ...beş durumdan ikisi (ya da daha çoğu) ile ilgili olarak belirgin korku ya da kaygı duyma.\n1. Toplu taşıma araçlarını kullanma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F23b', module: 'F', type: 'question', text: 'Açık yerlerde bulunmaktan (otoparklar, alışveriş merkezleri, köprüler vb.) belirgin bir korku ya da kaygı duyuyor musunuz?', criteria: '2. Açık yerlerde bulunma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F23c', module: 'F', type: 'question', text: 'Kapalı yerlerde bulunmaktan (mağazalar, tiyatrolar, sinemalar vb.) belirgin bir korku ya da kaygı duyuyor musunuz?', criteria: '3. Kapalı yerlerde bulunma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F23d', module: 'F', type: 'question', text: 'Sırada beklemekten ya da kalabalık bir yerde bulunmaktan belirgin bir korku ya da kaygı duyuyor musunuz?', criteria: '4. Sırada bekleme ya da kalabalık bir yerde bulunma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F23e', module: 'F', type: 'question', text: 'Tek başına evin dışında olmaktan belirgin bir korku ya da kaygı duyuyor musunuz?', criteria: '5. Tek başına evin dışında olma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  {
    id: 'F23_SUMMARY',
    module: 'F',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Yukarıdaki 5 durumdan en az 2 tanesi için korku/kaygı var mı?',
    criteria: 'A. Aşağıdaki beş durumdan ikisi (ya da daha çoğu) ile ilgili olarak belirgin korku ya da kaygı duyma.',
    calculation: { sources: ['F23a', 'F23b', 'F23c', 'F23d', 'F23e'], condition: 'count_positive', threshold: 2 },
    skipLogic: { 'HAYIR': 'F32' }
  },
 // --- AGORAFOBİ (F25-F31) ---

{
    id: 'F24',
    module: 'F',
    type: 'question',
    text: 'Bu durumlardan, kaçmanın güç olabileceğini ya da panik benzeri belirtiler yaşarsanız yardım alamayabileceğinizi düşündüğünüz için mi korkar ya da kaçınırsınız?',
    criteria: 'B. Kişi, kaçmanın güç olabileceğini ya da ... yardım alamayabileceğini düşündüğü için bu tür durumlardan korkar ya da kaçınır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F32' }
},
{
    id: 'F25',
    module: 'F',
    type: 'question',
    text: 'Korktuğunuz veya kaçındığınız bu durumlar, neredeyse her zaman, korku ya da kaygı doğurur mu?',
    criteria: 'C. Agorafobi kaynağı durumlar, neredeyse her zaman, korku ya da kaygı doğurur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F32' }
},
{
    id: 'F26',
    module: 'F',
    type: 'question',
    text: 'Bu gibi durumlardan etkin bir biçimde kaçınır mısınız, bir eşlikçiye gereksinim duyar mısınız ya da yoğun bir korku/kaygı ile mi katlanırsınız?',
    criteria: 'D. Agorafobi kaynağı durumlardan etkin bir biçimde kaçınılır, bir eşlikçiye gereksinilir ya da yoğun bir korku ya da kaygı ile buna katlanılır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F32' }
},
{
    id: 'F27',
    module: 'F',
    type: 'question',
    text: 'Duyduğunuz korku ya da kaygı, bu durumların yarattığı gerçek tehlikeye göre ve toplumsal-kültürel bağlamda orantısız mıdır?',
    criteria: 'E. Duyulan korku ya da kaygı, agorafobi kaynağı durumların yarattığı gerçek tehlikeye göre ve toplumsal-kültürel bağlamda orantısızdır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
    id: 'F28',
    module: 'F',
    type: 'question',
    text: 'Bu korku, kaygı ya da kaçınma sürekli bir durum mudur, yani altı ay ya da daha uzun sürer mi?',
    criteria: 'F. Korku, kaygı ya da kaçınma sürekli bir durumdur, altı ay ya da daha uzun sürer.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F32' }
},
{
    id: 'F29',
    module: 'F',
    type: 'question',
    text: 'Bu korku, kaygı ya da kaçınma, klinik açıdan belirgin bir sıkıntıya ya da toplumsal, işle ilgili veya diğer önemli işlevsellik alanlarında düşmeye neden oluyor mu?',
    criteria: 'G. Korku, kaygı ya da kaçınma, klinik açıdan belirgin bir sıkıntıya ya da ... işlevsellikte düşmeye neden olur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F32' }
},
{
    id: 'F30',
    module: 'F',
    type: 'question',
    text: 'Eğer başka bir sağlık durumunuz varsa (örn. inflamatuvar bağırsak hastalığı, Parkinson hastalığı), bu korku, kaygı ya da kaçınma açıkça aşırı bir düzeyde midir?',
    criteria: 'H. Sağlığı ilgilendiren başka bir durum varsa ... korku, kaygı ya da kaçınma açıkça aşırı bir düzeydedir.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
    id: 'F31',
    module: 'F',
    type: 'question',
    text: 'Bu korku, kaygı ya da kaçınma, başka bir ruhsal bozukluğun (örn. özgül fobi, toplumsal kaygı bozukluğu, TZB) belirtileriyle daha iyi açıklanabilir mi?',
    criteria: 'I. Korku, kaygı ya da kaçınma, başka bir ruhsal bozukluğun belirtileriyle daha iyi açıklanamaz.',
    options: [{ label: 'Evet (Açıklanır)', value: '-' }, { label: 'Hayır (Açıklanamaz)', value: '+' }],
    skipLogic: { '+': 'F32' } // '+' ise Agorafobi tanısı konur ve devam edilir.
},
  // --- TOPLUMSAL KAYGI BOZUKLUĞU (F32-F41) ---
  {
    id: 'F32',
    module: 'F',
    section: 'TOPLUMSAL KAYGI BOZUKLUĞU',
    type: 'question',
    text: 'Son 6 aydır, başkalarınca değerlendirilebilecek olduğunuz bir ya da birden çok toplumsal durumda (karşılıklı konuşma, tanımadık insanlarla karşılaşma, başkalarının önünde bir eylem gerçekleştirme vb.) belirgin bir korku ya da kaygı duyuyor musunuz?',
    criteria: 'A. Kişinin, başkalarınca değerlendirilebilecek olduğu bir ya da birden çok toplumsal durumda belirgin bir korku ya da kaygı duyması.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F42' }
  },
  {
    id: 'F33',
    module: 'F',
    type: 'question',
    text: 'Bu durumlarda, olumsuz olarak değerlendirilecek bir biçimde davranmaktan ya da kaygı duyduğunuza ilişkin belirtiler göstermekten mi korkarsınız? (Küçük düşeceğinizden, utanç duyacağınızdan?)',
    criteria: 'B. Kişi, olumsuz olarak değerlendirilecek bir biçimde davranmaktan ya da kaygı duyduğuna ilişkin belirtiler göstermekten korkar.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F42' }
  },
  // --- TOPLUMSAL KAYGI BOZUKLUĞU (F34-F41) ---

{
    id: 'F34',
    module: 'F',
    type: 'question',
    text: 'Söz konusu toplumsal durumlar, neredeyse her zaman, korku ya da kaygı doğurur mu?',
    criteria: 'C. Söz konusu toplumsal durumlar, neredeyse her zaman, korku ya da kaygı doğurur. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F42' }
},
{
    id: 'F35',
    module: 'F',
    type: 'question',
    text: 'Söz konusu toplumsal durumlardan kaçınır mısınız ya da yoğun bir korku veya kaygı ile bunlara katlanır mısınız?',
    criteria: 'D. Söz konusu toplumsal durumlardan kaçınılır ya da yoğun bir korku ya da kaygı ile bunlara katlanılır. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F42' }
},
{
    id: 'F36',
    module: 'F',
    type: 'question',
    text: 'Duyduğunuz korku ya da kaygı, söz konusu toplumsal ortamda çekinilecek duruma göre ve toplumsal-kültürel bağlamda orantısız mıdır?',
    criteria: 'E. Duyulan korku ya da kaygı, söz konusu toplumsal ortamda çekinilecek duruma göre ... orantısızdır. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }]
},
{
    id: 'F37',
    module: 'F',
    type: 'question',
    text: 'Bu korku, kaygı ya da kaçınma sürekli bir durum mudur, yani altı ay ya da daha uzun sürer mi?',
    criteria: 'F. Korku, kaygı ya da kaçınma sürekli bir durumdur, altı ay ya da daha uzun sürer. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F42' }
},
{
    id: 'F38',
    module: 'F',
    type: 'question',
    text: 'Bu korku, kaygı ya da kaçınma, klinik açıdan belirgin bir sıkıntıya ya da toplumsal, işle ilgili veya diğer önemli işlevsellik alanlarında düşmeye neden oluyor mu?',
    criteria: 'G. Korku, kaygı ya da kaçınma, klinik açıdan belirgin bir sıkıntıya ya da ... işlevsellikte düşmeye neden olur. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'F42' }
},
{
    id: 'F39',
    module: 'F',
    type: 'question',
    text: 'Bu korku, kaygı ya da kaçınma, bir maddenin (örn. kötüye kullanılabilen bir ilaç, bir ilaç) ya da başka bir sağlık durumunun fizyolojiyle ilgili etkilerine bağlanabilir mi?',
    criteria: 'H. Korku, kaygı ya da kaçınma, bir maddenin ... ya da başka bir sağlık durumunun fizyolojiyle ilgili etkilerine bağlanamaz. ',
    options: [{ label: 'Evet (Bağlanabilir)', value: '-' }, { label: 'Hayır (Bağlanamaz)', value: '+' }]
},
{
    id: 'F40',
    module: 'F',
    type: 'question',
    text: 'Bu korku, kaygı ya da kaçınma, Panik Bozukluğu, Beden Algısı Bozukluğu ya da Otizm Kapsamında Bozukluk gibi başka bir ruhsal bozuklukla daha iyi açıklanabilir mi?',
    criteria: 'I. Korku, kaygı ya da kaçınma, ... başka bir ruhsal bozuklukla daha iyi açıklanamaz. ',
    options: [{ label: 'Evet (Açıklanır)', value: '-' }, { label: 'Hayır (Açıklanamaz)', value: '+' }],
    skipLogic: { '-': 'F42' }
},
{
    id: 'F41',
    module: 'F',
    type: 'question',
    text: 'Sağlığı ilgilendiren başka bir durumunuz (örn. Parkinson hastalığı, şişmanlık, yanık ya da yaralanmadan kaynaklanan biçimsel bozukluk) varsa, korku, kaygı ya da kaçınma bu durumla açıkça ilişkisiz midir ya da aşırı bir düzeyde midir?',
    criteria: 'J. Sağlığı ilgilendiren başka bir durum varsa, ... korku, kaygı ya da kaçınma bu durumla açıkça ilişkisizdir ya da aşırı bir düzeydedir. ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '*': 'F42' }
},
  
  // --- YAYGIN KAYGI BOZUKLUĞU (F42-F54) ---
  {
    id: 'F42',
    module: 'F',
    section: 'YAYGIN KAYGI BOZUKLUĞU',
    type: 'question',
    text: 'Son 6 aydır, birçok zaman kendinizi birtakım olaylar ya da etkinliklerle (işte/okulda başarı gibi) ilgili olarak aşırı kaygılı ya da kuruntulu hissediyor musunuz? (Çoğu gün, günün büyük bir bölümünde?)',
    criteria: 'A. En az altı aylık bir sürenin çoğu gününde, birtakım olaylar ya da etkinliklerle ilgili olarak, aşırı bir kaygı ve kuruntu (kaygılı beklenti) vardır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'G1' }
  },
  { id: 'F43', module: 'F', type: 'question', text: 'Kuruntularınızı denetim altına almakta güçlük çekiyor musunuz?', criteria: 'B. Kişi, kuruntularını denetim altına almakta güçlük çeker.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }], skipLogic: { '-': 'G1' } },
  { id: 'F44', module: 'F', type: 'instruction', text: 'Son 6 aydır kendinizi sinirli, kaygılı ya da kuruntulu hissettiğiniz zamanları düşününce...' },
  { id: 'F45', module: 'F', type: 'question', text: '...dinginleşememe (huzursuzluk) ya da gergin ya da sürekli diken üzerinde olma durumunuz sık sık oluyor muydu?', criteria: '1. Dinginleşememe (huzursuzluk)...', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F46', module: 'F', type: 'question', text: '...sıklıkla kolay yoruluyor muydunuz?', criteria: '2. Kolay yorulma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F47', module: 'F', type: 'question', text: '...sık sık, odaklanmakta güçlük çekiyor muydunuz ya da zihniniz boşalmış gibi oluyor muydu?', criteria: '3. Odaklanmakta güçlük çekme ya da zihnin boşalması.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F48', module: 'F', type: 'question', text: '...sıklıkla kolay kızıyor muydunuz?', criteria: '4. Kolay kızma.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F49', module: 'F', type: 'question', text: '...çoğu zaman bir kas gerginliğiniz oluyor muydu?', criteria: '5. Kas gerginliği.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'F50', module: 'F', type: 'question', text: '...sık sık uykuya dalmakta ya da uykunuzu sürdürmekte güçlük çekiyor muydunuz?', criteria: '6. Uyku bozukluğu...', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  {
    id: 'F51',
    module: 'F',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Yukarıdaki 6 belirtiden (F45-F50) en az 3 tanesi karşılandı mı?',
    criteria: 'C. Bu kaygı ve kuruntuya, aşağıdaki altı belirtiden üçü (ya da daha çoğu) eşlik eder.',
    calculation: { sources: ['F45', 'F46', 'F47', 'F48', 'F49', 'F50'], condition: 'count_positive', threshold: 3 },
    skipLogic: { 'HAYIR': 'G1' }
  },
  {
    id: 'F52',
    module: 'F',
    type: 'question',
    text: 'Kaygı, kuruntu ya da bedensel belirtiler, klinik açıdan belirgin bir sıkıntıya ya da toplumsal, işle ilgili alanlarda işlevsellikte düşmeye neden oluyor mu?',
    criteria: 'D. Kaygı, kuruntu ya da bedensel belirtiler, klinik açıdan belirgin bir sıkıntıya ... neden olur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'G1' }
  },
  {
    id: 'F53',
    module: 'F',
    type: 'question',
    text: 'Bu bozukluk bir maddenin veya sağlık durumunun etkilerine bağlanabilir mi?',
    criteria: 'E. Bu bozukluk, bir maddenin ... etkilerine bağlanamaz.',
    options: [{ label: 'Hayır (Birincil)', value: '+' }, { label: 'Evet (İkincil)', value: '-' }],
  },
  {
    id: 'F54',
    module: 'F',
    type: 'question',
    text: 'Bu bozukluk, başka bir ruhsal bozuklukla (örn. panik bozukluğu, toplumsal kaygı) daha iyi açıklanamaz mı?',
    criteria: 'F. Bu bozukluk, başka bir ruhsal bozuklukla daha iyi açıklanamaz.',
    options: [{ label: 'Evet (Açıklanamaz)', value: '+' }, { label: 'Hayır (Açıklanır)', value: '-' }],
    skipLogic: { '-': 'G1' }
  },
  {
    id: 'MODUL_F_SONU',
    module: 'F',
    type: 'instruction',
    text: '## Modül F: Kaygı Bozuklukları Tamamlandı.',
    skipLogic: { '*': 'G1' }
  }
];