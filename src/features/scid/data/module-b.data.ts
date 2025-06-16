// src/features/scid/data/module-b.data.ts

import { ScidQuestion } from "./scid5cv.data";

export const moduleB_data: ScidQuestion[] = [
  // --- BÖLÜM B: PSİKOZ BELİRTİLERİ VE EŞLİK EDEN BELİRTİLER ---
  {
    id: 'B_START',
    module: 'B',
    type: 'instruction',
    text: '## B. PSİKOZ BELİRTİLERİ VE EŞLİK EDEN BELİRTİLER \n\n Şimdi, insanların kimi zaman yaşadıkları olağandışı yaşantılarla ilgili birtakım sorular soracağım. \n\n *(Not: VAR OLAN HERHANGİ BİR PSİKOZ BELİRTİSİ İÇİN, SÖZ KONUSU BELİRTİNİN KESİNLİKLE "BİRİNCİL" YA DA OLASI/KESİN NEDEN OLUCU BİR GSD YA DA MADDE/İLACA BAĞLI OLUP OLMADIĞINI BELİRLEYİN. BU BİLGİ BÖLÜM C\'DE AYIRT EDİCİ TANIDA YARARLI OLACAKTIR.)* '
  },
  {
    id: 'B_SUBSTANCE_CHECK',
    module: 'B',
    type: 'instruction',
    text: '**Aşağıdaki sorular, böyle bir saptama için yararlı olabilir:** \n\n (PSİKOZ BELİRTİLERİ) başlamasının hemen öncesinde, madde kullanıyor muydunuz? \n\n ...İlaç alıyor muydunuz? \n\n ...Her zamankinden daha çok içki içiyor muydunuz ya da bir süre çok içki içtikten sonra içki içmeyi bıraktınız mı? \n\n ...Bedensel bir hastalığınız var mıydı? '
  },

  // --- SANRILAR (B1-B13) ---
  {
    id: 'B1_INSTRUCTION',
    module: 'B',
    type: 'instruction',
    text: '### SANRILAR (HEZEYANLAR) \n\n *Tersine kanıtlar olmasına karşın, dış gerçeklikten doğru olmayan çıkarımlar yapmaya dayalı, sıkı sıkıya tutunulan, yanlış inanç. *'
  },
  {
    id: 'B1',
    module: 'B',
    type: 'question',
    text: `İnsanların sizi konuşuyormuş ya da özellikle sizinle ilgileniyormuş gibi geldiği hiç oldu mu?  \n\n **YANIT EVETSE:** Sizi konuştuklarından hiç kuşkunuz yok muydu, yoksa bunun sizin bir kuruntunuz olabileceğini düşündünüz mü?  \n\n Radyoda, televizyonda ya da sinemada olup bitenlerin, özellikle size yönelik bir anlamının olduğu düşüncesine kapıldığınız oldu mu? `,
    criteria: '**Alınma sanrısı** (olayların, nesnelerin ya da kişinin yakın çevresindeki diğer insanların özel ya da olağandışı bir önemlerinin olduğuna ilişkin inanç). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN:'
  },
  {
    id: 'B2',
    module: 'B',
    type: 'question',
    text: `Özellikle sizi zora sokmaya ya da incitmeye çalışan biri var mı?  \n\n İzlenildiğiniz, gizlice gözetlendiğiniz, size karşı bir oyun oynandığı ya da size bir kötülük yapmak üzere tasarılar kurulduğu izlenimine kapıldığınız oldu mu?  \n\n Zehirlendiğiniz ya da yediklerinize bir şey katıldığı izlenimine kapıldığınız oldu mu? `,
    criteria: '**Kötülük görecek olma sanrısı** (kişiye saldırıda bulunulduğu, usandırıldığı, bezdirildiği, aldatıldığı, kötülük yapılmak istendiği ya da kötülük yapmak için tasarılar kurulduğuna ilişkin inanç). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B3',
    module: 'B',
    type: 'question',
    text: `Bir biçimde, özellikle önemli olduğunuzu ya da özel birtakım güçleriniz ya da bilgileriniz olduğunu düşündüğünüz oldu mu?  \n\n Ünlü ya da çok tanınan biriyle özel ya da yakın bir ilişkinizin olduğuna inandığınız oldu mu? `,
    criteria: '**Büyüklük sanrısı** (abartılı güç, bilgi ya da önem, bir tanrıyla ya da ünlü biriyle özel bir ilişki olmasını kapsar). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B4',
    module: 'B',
    type: 'question',
    text: `Doktorunuzun yolunda gitmeyen bir şey olmadığını söylemesine karşın beden sağlığınızla ilgili önemli bir sorununuz olduğuna inandığınız oldu mu... kanser ya da başka bir hastalığınızın olması gibi? \n\n Vücut bölümlerinizde acayip bir şeyler olduğunu hissettiğiniz oldu mu? `,
    criteria: '**Bedensel sanrı** (vücut görünümünde ya da işlevlerinde bir değişiklik ya da bozukluk olmasını kapsar). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B5',
    module: 'B',
    type: 'question',
    text: `Cezalandırılmanızı gerektiren çok kötü bir şey yaptığınızı ya da bir suç işlediğinizi düşündüğünüz oldu mu? \n\n Yangın, su baskını ya da deprem gibi bir yıkımdan kendinizi sorumlu hissettiğiniz? `,
    criteria: '**Suçluluk sanrısı** (geçmişte yapılan küçük bir yanlışın büyük bir yıkıma yol açacağına ya da korkunç bir suç işlediğine ilişkin inanç). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B6',
    module: 'B',
    type: 'question',
    text: `Eşinizin sizi aldattığına inandığınız oldu mu? \n\n **YANIT EVETSE:** Sizi aldattığına ilişkin kanıya nasıl vardınız? (Ne gibi ipuçlarınız vardı?) `,
    criteria: '**Kıskançlık sanrısı** (eşinin cinsel eşinin onu aldattığına ilişkin inanç). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN:'
  },
  {
    id: 'B7',
    module: 'B',
    type: 'question',
    text: `Dininize çok bağlı ya da manevi değerlere çok önem veren biri misiniz? \n\n **YANIT EVETSE:** Sizinle aynı dinden olan ya da sizinle aynı manevi değerleri paylaşan diğer kişilerin yaşamadığı, dinsel ya da manevi yaşantılarınızın olduğu oldu mu? \n\n **YANIT HAYIRSA:** Tanrı\'nın, şeytanın ya da başka bir manevi varlığın doğrudan sizinle iletişime geçtiğini düşündüğünüz oldu mu? `,
    criteria: '**Dinsel sanrı** (dinsel ya da manevi içeriği olan sanrı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Yaşantılarınızdan biraz söz eder misiniz?'
  },
  {
    id: 'B8',
    module: 'B',
    type: 'question',
    text: `İletişime geçmeye çalıştığınızda, size aşık olduğunu yadsıyan (inkâr eden), "gizli hayranlarınız"ın olduğu oldu mu? Ünlü biriyle sevgili ilişkisine girdiğiniz oldu mu? `,
    criteria: '**Erotomani sanrısı** (genellikle daha yüksek konumda olan bir başkasının kendisine aşık olduğuna ilişkin inanç). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B9',
    module: 'B',
    type: 'question',
    text: 'Birinin ya da bir dış gücün, siz istememenize karşın, sizin düşüncelerinizi ya da eylemlerinizi yönetip yönlendirdiği düşüncesine kapıldığınız oldu mu?',
    criteria: '**Yönetilip yönlendirilme sanrısı** (duygularını, dürtülerini, düşüncelerini ya da eylemlerini, kişinin kendisinden çok, bir dış güç yönetip yönlendiriyor gibi yaşantılanır). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B10',
    module: 'B',
    type: 'question',
    text: 'Sizin olmayan birtakım düşüncelerin zihninize yerleştirildiği düşüncesine kapıldığınız oldu mu?',
    criteria: '**Düşünce yerleştirilmesi (sokulması)** (birtakım düşüncelerin kendi düşünceleri olmadığı, onların zihnine yerleştirildiği (sokulduğu) inancı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B11',
    module: 'B',
    type: 'question',
    text: 'Düşüncelerin zihninizden alınması?',
    criteria: '**Düşünce alınması (çekilmesi)** (kişinin düşüncelerinin bir dış güç tarafından "taşındığı" inancı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B12',
    module: 'B',
    type: 'question',
    text: 'Düşüncelerinizin, ne düşündüğünüzü başkaları gerçekten duyabilecek biçimde, yüksek sesle yayımlandığını düşündüğünüz oldu mu?',
    criteria: '**Düşünce yayımlanması** (kişinin düşüncelerinin, başkaları onları algılayabilecek biçimde, yüksek sesle yayımlandığı sanrısı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B13',
    module: 'B',
    type: 'question',
    text: 'Birinin zihninizi okuyabildiğine inandığınız oldu mu?',
    criteria: '**Diğer sanılar** (başkalarının kişinin zihnini okuduğuna ilişkin inanç, kişinin yıllar önce öldüğüne ilişkin sanrı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },

  // --- VARSANILAR (B14-B19) ---
  {
    id: 'B14_INSTRUCTION',
    module: 'B',
    type: 'instruction',
    text: '### VARSANILAR (HALÜSİNASYONLAR) \n\n *Gerçek bir algı keskinliğinde ve etkisi yaratan algı-benzeri yaşantıdır, ancak ilgili duyu organını uyaran bir dış uyaran yoktur.*'
  },
  {
    id: 'B14',
    module: 'B',
    type: 'question',
    text: 'Sesler ya da insanların fısıltı ya da konuşma sesleri gibi, başka insanların duyamadığı şeyler duyduğunuz oldu mu? (O zaman uyanık mıydınız?) \n\n **YANIT EVETSE:** Ne duydunuz? Ne sıklıkta duydunuz?',
    criteria: '**Duyma (işitme) varsanıları** (kişi uyanıkken, başının içinden ya da dışarıdan duyduğu, büyük bir çoğunlukla konuşma sesi olan, ses algısı içeren varsanı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN:'
  },
  {
    id: 'B15',
    module: 'B',
    type: 'question',
    text: 'Başka insanların görmediği birtakım görüntüler gördüğünüz ya da başka gördükleriniz oldu mu? (O zaman uyanık mıydınız?)',
    criteria: '**Görme varsanıları** (insanlar gibi biçimli ya da ışık çakmaları gibi biçimsiz görüntülerden oluşabilen, görmeyle ilgili varsanı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz? (Not: Yanılsamadan (gerçek bir dış uyaranın yanlış algılanması) ayırt edin.)'
  },
  {
    id: 'B16',
    module: 'B',
    type: 'question',
    text: 'Derinizin altında ya da üstünde bir şey sürünüyormuş gibi, derinizde acayip birtakım duyumlar duyduğunuz? Dokunuluyor ya da vuruluyor olma duyumu?',
    criteria: '**Dokunma varsanıları** (dokunuluyormuş ya da derisinin altında bir şey varmış gibi bir algıyı içeren varsanı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B17',
    module: 'B',
    type: 'question',
    text: 'Elektriklenme duyumu gibi, vücudunuzun bir bölümünün içinde olağandışı birtakım duyumlar olması?',
    criteria: '**Bedensel varsanılar** (vücudun içinde bedensel bir yaşantı algısını içeren varsanı (örn, elektriklenme duyumu)). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B18',
    module: 'B',
    type: 'question',
    text: 'Tadına bakan başka herkesin bir sorun olmadığını düşünmesine karşın, yediğiniz ya da içtiğiniz bir şeyin kötü ya da acayip bir tadının olduğunu hissettiğiniz?',
    criteria: '**Tat varsanıları** (tat algısını içeren varsanı (genellikle hoş olmayan)). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },
  {
    id: 'B19',
    module: 'B',
    type: 'question',
    text: 'Başka insanların böyle bir koku almadığı, çürük yiyecek ya da ölü vücut gibi, hoş olmayan birtakım kokular aldığınız?',
    criteria: '**Koku varsanıları** (koku algısını içeren varsanı). ',
    options: [{ label: 'Evet', value: '+' }, { label: 'Hayır', value: '-' }],
    notePlaceholder: 'TANIMLAYIN: Bundan biraz söz eder misiniz?'
  },

  // --- DARMADAĞINIK KONUŞMA VE DAVRANIŞ (B20-B24) ---
  {
    id: 'B20_INSTRUCTION',
    module: 'B',
    type: 'instruction',
    text: '### DARMADAĞINIK KONUŞMA VE DAVRANIŞ VE KATATONİ \n\n *(Not: İzleyen maddeler gözlem ve öyküye dayandırılarak değerlendirilir.)* '
  },
  {
    id: 'B20',
    module: 'B',
    type: 'question',
    text: '**DEĞERLENDİRME:** Görüşme boyunca veya öyküde darmadağın konuşma gözlemlediniz mi?',
    criteria: '**Darmadağın Konuşma:** Kişi bir konudan diğerine atlayabilir (konuyu saptırma ya da çağrışım dağınıklığı). Sorulara verilen yanıtlar dolaylı ilişkilidir ya da hiç ilişkili değildir (teğetsellik). Konuşma neredeyse hiç anlaşılır değildir (sözcük salatası). Belirti etkili iletişimi büyük ölçüde bozmaya yetecek denli ağır olmalıdır. ',
    options: [{ label: 'Var', value: '+' }, { label: 'Yok', value: '-' }],
    notePlaceholder: 'GÖZLEM VE ÖYKÜYE DAYANARAK DEĞERLENDİRİN. TANIMLAYIN:'
  },
  {
    id: 'B21',
    module: 'B',
    type: 'question',
    text: '**DEĞERLENDİRME:** Görüşme boyunca veya öyküde ileri derecede dağınık davranış gözlemlediniz mi?',
    criteria: '**İleri Derecede Dağınık Davranış:** Çocuksu saçmalıklardan öngörülemeyen kışkırmaya dek değişen bir aralıkta ortaya çıkabilir. Kişi çok dağınık görünebilir, olağandışı bir biçimde giyinmiş olabilir ya da açıkça uygunsuz cinsel davranışlar sergileyebilir. ',
    options: [{ label: 'Var', value: '+' }, { label: 'Yok', value: '-' }],
    notePlaceholder: 'GÖZLEM VE ÖYKÜYE DAYANARAK DEĞERLENDİRİN. TANIMLAYIN:'
  },
  {
    id: 'B22',
    module: 'B',
    type: 'question',
    text: '**DEĞERLENDİRME:** Görüşme boyunca veya öyküde katatoni davranışı gözlemlediniz mi?',
    criteria: '**Katatoni Davranışı:** Stupor, yüz buruşturma (grimas), yapma davranış (mannerizm), konum (postür) alma, kışkırma, basmakalıp davranışlar, konuşmazlık (mutizm), yankılama (ekolali), olumsuzlama (negativizm), yansılama (ekopraksi), katalepsi, balmumu esnekliği. ',
    options: [{ label: 'Var', value: '+' }, { label: 'Yok', value: '-' }],
    notePlaceholder: 'GÖZLEM VE ÖYKÜYE DAYANARAK DEĞERLENDİRİN. TANIMLAYIN:'
  },
  {
    id: 'B23_INSTRUCTION',
    module: 'B',
    type: 'instruction',
    text: '### SİLİK (NEGATİF) BELİRTİLER'
  },
  {
    id: 'B23_B24',
    module: 'B',
    type: 'question',
    text: '**DEĞERLENDİRME:** Görüşme boyunca veya öyküde silik (negatif) belirtiler (duygusal dışavurumda azalma veya kalkışamama/avolisyon) gözlemlediniz mi? \n\n**BİLİNMİYORSA:** Çalışmadığınız, okula gitmediğiniz ya da pek bir şey yapmadığınız, en az birkaç ay süren bir zaman dilimi oldu mu?',
    criteria: '**Kalkışamama (avolisyon):** Amaca yönelik etkinlikleri başlatamama ve sürdürememe.\n\n**Duygusal Dışavurumda Azalma:** Duyguların yüzde dışavurumunda, göz ilişkisi kurmada, konuşmanın titremlemesinde (tonlamasında)... azalma. ',
    options: [{ label: 'Var', value: '+' }, { label: 'Yok', value: '-' }],
    notePlaceholder: 'Bu belirtilerin birincil mi yoksa ikincil mi (depresyon, ilaç vb. bağlı) olduğunu değerlendirin.',
  },
  {
    id: 'MODUL_B_SONU',
    module: 'B',
    type: 'instruction',
    text: "## Modül B: Psikoz Belirtileri Tamamlandı. \n\n*(Sonraki adım Modül C: Psikozla Giden Bozuklukların Ayırıcı Tanısı)*",
    skipLogic: { '*': 'C1' } // Modül C'ye geçiş için hazırlık
  }
];