// src/features/scid/data/module-h.data.ts

import { ScidQuestion } from "./scid5cv.data";

export const moduleH_data: ScidQuestion[] = [
  { id: 'H_START', module: 'H', type: 'instruction', text: '## H. ERİŞKİN DİKKAT EKSİKLİĞİ/AŞIRI HAREKETLİLİK BOZUKLUĞU' },
  {
    id: 'H1',
    module: 'H',
    section: 'O SIRADA DEAHB (SON 6 AY, ERİŞKİNLER)',
    type: 'question',
    text: 'Son birkaç yıldır, dikkatiniz kolaylıkla dağılıyor mu ya da dağınık mısınız? \n\n**YANIT HAYIRSA:** Son birkaç yıldır, dingin bir biçimde yerinizde oturmakta ya da sıranızı beklemekte çok güçlük çektiğiniz oluyor mu?',
    criteria: 'A. İşlevselliği ya da gelişimi bozan, süregiden bir dikkatsizlik ve/veya aşırı hareketlilik-dürtüsellik örüntüsü.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'I1' }
  },
  { id: 'H2', module: 'H', type: 'question', text: 'Son 6 aydır... İşyerinde/okulda ya da ev işlerini yaparken, önemli birtakım ayrıntıları sık sık atlıyor ya da dikkatsizce yanlışlar yapıyor musunuz?', criteria: 'a. Çoğu kez, ayrıntılara özen göstermez ya da dikkatsizce yanlışlar yapar.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H3', module: 'H', type: 'question', text: '...kitap okumak, karşılıklı konuşmayı sürdürmek gibi konularda odağınızı sürdürmekte sık sık güçlük çektiğiniz oluyor mu?', criteria: 'b. Çoğu kez, iş yaparken ya da oyun oynarken dikkatini sürdürmekte güçlük çeker.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H4', module: 'H', type: 'question', text: '...başkaları konuşurken dinlemiyor gibi göründüğünüzü ya da aklınız başka bir yerdeymiş gibi olduğunuzu söyleyen ya da bundan yakınan biri oldu mu?', criteria: 'c. Çoğu kez, doğrudan kendisine doğru konuşulurken, dinlemiyor gibi görünür.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H5', module: 'H', type: 'question', text: '...bir işe başladığınız, ancak odağınızı yitirdiğiniz ya da konuyu saptırdığınız için bitirmeden bıraktığınız sık sık oluyor mu?', criteria: 'd. Çoğu kez, verilen yönergeleri izlemez ve görevleri tamamlayamaz.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H6', module: 'H', type: 'question', text: '...evde ya da işyerinde işleri düzenlemekte ya da işlerin üstesinden gelmekte güçlük çekiyor musunuz? (örn. dağınıklık, zaman yönetimi kötülüğü, son teslim tarihlerine uyamama)', criteria: 'e. Çoğu kez, işleri ve etkinlikleri düzene koymakta güçlük çeker.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H7', module: 'H', type: 'question', text: '...uzun süreli zihinsel çaba gerektiren işlerden (rapor hazırlamak, form doldurmak gibi) özellikle kaçar mısınız ya da bu tür işleri sevmez misiniz?', criteria: 'f. Çoğu kez, sürekli bir zihinsel çaba gerektiren işlerden kaçınır, bu tür işleri sevmez ya da bu tür işlere girmek istemez.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H8', module: 'H', type: 'question', text: '...cüzdanınız, anahtarlarınız ya da cep telefonunuz gibi eşyalarınızı sık sık kaybettiğiniz ya da yanlış yerlere koyduğunuz olur mu?', criteria: 'g. Çoğu kez, işi ya da etkinlikleri için gerekli nesneleri kaybeder.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H9', module: 'H', type: 'question', text: '...dış uyaranlarla (bir arabanın korna çalması gibi) ya da konuyla ilgisiz kendi düşüncelerinizle dikkatiniz kolaylıkla dağılıyor mu?', criteria: 'h. Çoğu kez, dış uyaranlarla dikkati kolaylıkla dağılır.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H10', module: 'H', type: 'question', text: '...günlük etkinliklerinizde unutkan mısınız? (Arayanlara geri dönmeyi, faturaları ödemeyi, randevularınıza uymayı unutmak gibi)', criteria: 'i. Çoğu kez, günlük etkinliklerinde unutkandır.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  {
    id: 'H11',
    module: 'H',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Dikkatsizlik belirtilerinden (H2-H10) en az 5 tanesi karşılandı mı?',
    criteria: '1. Dikkatsizlik: ...aşağıdaki dokuz belirtiden en az beşi en az altı aydır sürmektedir.',
    calculation: { sources: ['H2','H3','H4','H5','H6','H7','H8','H9','H10'], condition: 'count_positive', threshold: 5 }
  },
  { id: 'H12', module: 'H', type: 'question', text: 'Son 6 aydır... Çok kıpırdamadan durmanız gereken durumlarda (toplantı, uçak vb.) çoğu kez kıpırdanır, ellerinizi ayaklarınızı vurur ya da oturduğunuz yerde kıvranır mısınız?', criteria: 'a. Çoğu kez, kıpırdanır ya da ellerini ya da ayaklarını vurur ya da oturduğu yerde kıvranır.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H13', module: 'H', type: 'question', text: '...yerinizde oturmanızın beklendiği durumlarda (sınıf, ofis vb.) sık sık yerinizden kalkar mısınız?', criteria: 'b. Çoğu kez, oturmasının beklendiği durumlarda oturduğu yerden kalkar.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H14', module: 'H', type: 'question', text: '...uygunsuz ortamlarda, ortalıkta koşturur durur ya da bir yerlere tırmanır mısınız? (Not: erişkinlerde, kendini huzursuz hissetmekle sınırlı olabilir.)', criteria: 'c. Çoğu kez, uygunsuz ortamlarda, ortalıkta koşturur durur ya da bir yerlere tırmanır.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H15', module: 'H', type: 'question', text: '...boş zamanlarınızda, dingin bir eylemde bulunamadığınız sık sık oluyor mu?', criteria: 'd. Çoğu kez, boş zaman etkinliklerine sessiz bir biçimde katılamaz ya da sessiz bir biçimde oyun oynayamaz.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H16', module: 'H', type: 'question', text: '...sık sık "her an hareket halinde" misinizdir ya da sanki "içinize bir motor takılmış gibi" mi davranırsınız?', criteria: 'e. Çoğu kez, "her an hareket halindedir", "içine bir motor takılmış gibi" davranır.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H17', module: 'H', type: 'question', text: '...genelde çok konuşur musunuz?', criteria: 'f. Çoğu kez, aşırı konuşur.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H18', module: 'H', type: 'question', text: '...sık sık, karşınızdaki kişi sorusunu tamamlamadan yanıtını yapıştırır mısınız ya da başkalarının cümlelerini tamamlar mısınız?', criteria: 'g. Çoğu kez, sorulan soru tamamlanmadan yanıtını yapıştırır.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H19', module: 'H', type: 'question', text: '...sıranızı beklemekte (örn. kuyrukta) sık sık güçlük çeker misiniz?', criteria: 'h. Çoğu kez, sırasını bekleyemez.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  { id: 'H20', module: 'H', type: 'question', text: '...başkalarının sözünü kestiğiniz ya da konuşmalarının veya etkinliklerinin arasına girdiğiniz sık sık oluyor mu?', criteria: 'i. Çoğu kez, başkalarının sözünü keser ya da araya girer.', options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }] },
  {
    id: 'H21',
    module: 'H',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Aşırı Hareketlilik-Dürtüsellik belirtilerinden (H12-H20) en az 5 tanesi karşılandı mı?',
    criteria: '2. Aşırı Hareketlilik ve Dürtüsellik: ...belirtilerden en az beşi en az altı aydır sürmektedir.',
    calculation: { sources: ['H12','H13','H14','H15','H16','H17','H18','H19','H20'], condition: 'count_positive', threshold: 5 }
  },
  {
    id: 'H22',
    module: 'H',
    type: 'calculation',
    text: 'DEĞERLENDİRME: Dikkatsizlik (H11) VEYA Aşırı Hareketlilik-Dürtüsellik (H21) için tanı ölçütleri karşılandı mı?',
    criteria: 'A. ...süregiden bir dikkatsizlik ve/veya aşırı hareketlilik-dürtüsellik örüntüsü.',
    calculation: { sources: ['H11', 'H21'], condition: 'any_positive' },
    skipLogic: { 'HAYIR': 'I1' }
  },
  {
    id: 'H23',
    module: 'H',
    type: 'question',
    text: 'Bu belirtilerin bir bölümü 12 yaşından önce de var mıydı?',
    criteria: 'B. On iki yaşından önce birkaç dikkatsizlik ya da aşırı hareketlilik-dürtüsellik belirtisi olmuştur.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'I1' }
  },
  {
    id: 'H24',
    module: 'H',
    type: 'question',
    text: 'Bu belirtiler, yaşamınızın birden çok alanında mı oldu? (örn. ev ve işyeri; arkadaşlarla ve aileyle)',
    criteria: 'C. Birkaç belirti iki ya da daha çok ortamda vardır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'I1' }
  },
  {
    id: 'H25',
    module: 'H',
    type: 'question',
    text: 'Bu belirtiler toplumsal, okulla ya da işle ilgili işlevselliğinizi bozuyor ya da niteliğini düşürüyor mu?',
    criteria: 'D. Bu belirtilerin, işlevselliği bozduğuna ya da niteliğini düşürdüğüne ilişkin açık kanıtlar vardır.',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    skipLogic: { '-': 'I1' }
  },
  {
    id: 'H26',
    module: 'H',
    type: 'question',
    text: 'Bu belirtiler, yalnızca, şizofreni ya da psikozla giden başka bir bozukluğun gidişi sırasında ortaya çıkmamaktadır ve başka bir ruhsal bozuklukla daha iyi açıklanamaz mı?',
    criteria: 'E. Bu belirtiler, yalnızca, şizofreni ya da psikozla giden başka bir bozukluğun gidişi sırasında ortaya çıkmamaktadır...',
    options: [{ label: 'Evet (Açıklanamaz)', value: '+' }, { label: 'Hayır (Açıklanır)', value: '-' }],
  },
  {
    id: 'MODUL_H_SONU',
    module: 'H',
    type: 'summary',
    text: '## TANI: DİKKAT EKSİKLİĞİ/AŞIRI HAREKETLİLİK BOZUKLUĞU \n\n (Görünüm tipini belirtin: Bileşik, Dikkatsizliğin Baskın Olduğu, Aşırı Hareketliliğin/Dürtüselliğin Baskın Olduğu)',
    skipLogic: { '*': 'I1' }
  }
];