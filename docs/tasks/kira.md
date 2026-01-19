Hesaplama Kimliği
Hesaplama adı: Kira artış oranı hesaplama (TÜFE 12 aylık ortalama ile)
Hedef kitle:
Bireysel kiracı/ev sahibi (konut)
KOBİ kiracı/işyeri sahibi (çatılı işyeri)
(İkincil) emlak danışmanları, muhasebeciler
Kullanıcı amacı:
Mevcut kiraya göre yeni kira tutarını görmek
Artış oranına göre artış tutarını ve toplam farkı netleştirmek
(Opsiyonel) “Yasal sınır uygulanarak mı hesaplandı?” bilgisini görmek
2) Kapsam (MVP sınırı)
Kapsanan senaryolar
Mevcut kira → yeni kira hesaplama (tek dönem)
Artış oranı olarak:
TÜFE 12 aylık ortalama (ilgili ay için)
Kullanıcının girdiği oran (ör. sözleşmede farklı oran yazıyor olabilir)
Konut / çatılı işyeri seçimine göre bilgilendirme metni
(Opsiyonel) Belirli tarih aralıkları için “%25 konut tavanı” bilgilendirmesi ve karşılaştırma (tarih seçilirse)
Hariç tutulanlar
Geriye dönük birden fazla yılın zincirleme artışı (çok dönemli tablo)
Depozito güncellemesi
Yan giderler (aidat, stopaj, KDV, faturalar)
ÜFE’ye göre artış (bazı eski sözleşme alışkanlıkları) – sadece açıklama olarak not düşülebilir
Mahkeme/uyarlama davaları, rayiç bedel tespiti (hukuki süreç)
Eksik ay / gün bazlı (kısmi dönem) kira hesapları
Varsayımlar
Kullanıcı “artış tarihi” olarak kira döneminin yenilendiği ayı seçer.
TÜFE oranı, TÜİK’in ilan ettiği “12 aylık ortalamalara göre değişim” değeridir.
Hesaplama, “mevcut kira” üzerinden tek seferlik artışı hedefler.
3) Girdiler (Kullanıcıdan istenecekler)
Zorunlu alanlar
Mevcut kira tutarı (TL)
Açıklama: Şu an ödediğiniz/aldığınız aylık kira
Örnek: 15.000
Artışın uygulanacağı ay/yıl
Açıklama: Kira döneminin yenilendiği ay (ör. sözleşme yenileme ayı)
Örnek: Ocak 2026
Artış oranı kaynağı (seçim)
Seçenekler:
TÜFE (12 aylık ortalama)
Oranı kendim gireceğim
Açıklama: Yasal üst sınır genelde TÜFE 12 aylık ortalamadır (konut/çatılı işyeri için genel kural).
Opsiyonel alanlar
Konut / Çatılı işyeri seçimi
Açıklama: Sadece içerik ve uyarıları doğru göstermek için
Örnek: Konut
Kullanıcı oranı (%) (sadece “kendim gireceğim” seçilirse)
Açıklama: Sözleşmede anlaşılan ya da hesaplamak istediğiniz oran
Örnek: %35
“Karşılaştırma göster” (TÜFE vs kullanıcı oranı)
Açıklama: Aynı kira için iki farklı senaryoyu yan yana görme
Geçmiş dönem için %25 tavanını da göster (bilgilendirme)
Açıklama: Tarih seçimine göre geçerli olabilecek dönemlerde karşılaştırma amaçlı
Varsayılanlar
Artış oranı kaynağı: TÜFE (12 aylık ortalama)
Konut/işyeri: Konut
Karşılaştırma: Kapalı
Format/birim
Tutarlar: TL (binlik ayırıcı destekli)
Oranlar: %
Tarih: Ay/Yıl (gün seçtirmeden)
4) Hesaplama Mantığı (teknik/formülsüz anlat)
Formül yok; kullanıcı dilinde mantık. 

Mevcut kira → Yeni kira mantığı (kısa)
Kullanıcının girdiği mevcut kira, seçilen artış oranı kadar yükseltilir.
Sonuç olarak:
Yeni kira tutarı (artış sonrası aylık kira)
Artış tutarı (aylık ne kadar yükseldiği)
(Varsa) kullanılan oran ve kaynağı (TÜFE veya kullanıcı oranı)
Oran kaynağı mantığı (kavramsal)
Kullanıcı “TÜFE” seçerse, sistem seçilen ay/yıl için TÜİK’in 12 aylık ortalama TÜFE değişim oranını kullanır.
Kullanıcı “kendim gireceğim” seçerse, sistem o oranla hesaplar ve “yasal sınır farklı olabilir” uyarısını gösterir.
Kesintilerin/ek kalemlerin sırası
Bu hesaplamada kesinti yoktur. Sadece:
önce oran belirlenir (TÜFE ya da kullanıcı oranı),
sonra mevcut kira artışlandırılır,
en sonda yeni kira ve fark gösterilir.
5) Çıktılar (Sonuç ekranı)
Ana sonuç
Yeni aylık kira (TL)
Detay döküm
Mevcut kira (TL)
Uygulanan artış oranı (%)
Aylık artış tutarı (TL)
(Opsiyonel) Yıllık fark (TL): Aylık artış × 12 olarak bilgilendirme amaçlı
Kısa açıklamalar / uyarılar
“TÜFE oranı, TÜİK tarafından ilan edilen 12 aylık ortalama değişim değeridir.”
“Sözleşmede farklı bir oran yazsa bile, konut/çatılı işyeri kiralarında yasal üst sınır uygulaması gündeme gelebilir.”
“Bu sayfa bilgilendirme amaçlıdır; uyuşmazlık halinde profesyonel destek alın.”
6) Örnekler (en az 2 senaryo)
Senaryo 1 (TÜFE ile – Mevcut kira → Yeni kira)
Mevcut kira: 20.000 TL
Artış ayı: Ocak 2026
Oran kaynağı: TÜFE (12 aylık ortalama) (örnek olarak %58 varsayalım)
Sonuç:
Kira, TÜFE oranı kadar artırılır.
Yeni kira ve aylık artış tutarı ekranda ayrı ayrı gösterilir.
Ayrıca “Bu oran TÜİK 12 aylık ortalama TÜFE verisine dayanır” notu yer alır.
Senaryo 2 (Kullanıcı oranı ile – Mevcut kira → Yeni kira)
Mevcut kira: 12.500 TL
Artış ayı: Ocak 2026
Oran kaynağı: Kendim gireceğim
Girilen oran: %40
Sonuç:
Kira, kullanıcının girdiği oran kadar artırılır.
Ekranda “Girilen oran yasal üst sınırdan farklı olabilir” uyarısı görünür.
(Opsiyonel) Senaryo 3 (Karşılaştırma: TÜFE vs girilen oran)
Mevcut kira: 18.000 TL
Kullanıcı oranı: %70
TÜFE: (örnek) %58
Sonuç:
Yan yana iki satır:
“TÜFE’ye göre yeni kira”
“%70’e göre yeni kira”
Aradaki fark ayrıca belirtilir.
7) SSS (en az 8 soru)
Kira artış oranını nereden bulacağım?
TÜFE seçerseniz sistem ilgili ay için TÜİK’in “12 aylık ortalamalara göre değişim” oranını kullanır. Manuel seçerseniz oranı siz girersiniz.
Hangi TÜFE değeri esas alınır: aylık mı, yıllık mı, 12 aylık ortalama mı?
Kira artışında pratikte kullanılan ve mevzuatta atıf yapılan metinlerle uyumlu olan değer genellikle 12 aylık ortalama TÜFE değişimidir.
Artış ayı hangi ay olmalı?
Genellikle sözleşmenin yenilendiği ay (kira döneminin başladığı ay). Emin değilseniz sözleşmedeki başlangıç tarihine bakın.
Konut ve işyeri için hesap farklı mı?
Hesap adımı aynı (oran kadar artırma). Fark, uygulanacak yasal çerçeve ve istisnalar tarafında olabilir; sayfa bunu açıklama/uyarı metinleriyle destekler.
Sözleşmede TÜFE yerine başka bir oran yazıyorsa ne olacak?
Siz o oranla hesap yapabilirsiniz; ancak yasal sınırlar/uygulamalar devreye girebilir. Bu yüzden sayfa “yasal sınır farklı olabilir” uyarısı gösterir.
%25 kira artış sınırı hâlâ geçerli mi?
Bu tür geçici düzenlemeler belirli dönemlerle sınırlı olabilir. Sayfa, seçtiğiniz tarihe göre bilgilendirme amaçlı “%25 tavanı karşılaştırması” gösterecek şekilde tasarlanabilir.
Kira artışı brüt mü net mi hesaplanır?
Kira için genelde “ödenen aylık kira” üzerinden artış konuşulur. Stopaj/KDV gibi vergisel unsurlar ayrıca olabilir (bu MVP kapsamı dışında).
Sonuç neden ev sahibi/kiracının söylediğiyle farklı çıktı?
En sık nedenler: yanlış ay seçimi, yanlış TÜFE türü (yıllık yerine 12 aylık ortalama), sözleşmede farklı hüküm, veya yuvarlama/kuralların farklı yorumlanması.
Yuvarlama nasıl yapılacak?
Sayfa, TL tutarını genelde tam TL gösterebilir; istenirse “kuruş göster” seçeneği eklenebilir. Yuvarlamanın bilgilendirme amaçlı olduğu not düşülür.
8) Dikkat/Edge-case Listesi (en az 10 madde)
Aşağıdakiler “teknik çözüm” değil, kullanıcıya gösterilecek uyarı/davranış önerileridir:

Mevcut kira 0 veya negatif girilirse: “Kira tutarı 0’dan büyük olmalı” uyarısı.
Aşırı yüksek kira (ör. 10.000.000 TL): “Tutarı kontrol edin, yanlışlık olabilir” uyarısı.
Artış ayı seçilmeden hesaplama: “Lütfen artışın uygulanacağı ay/yılı seçin” hatası.
Gelecekte çok ileri tarih seçimi: “Bu ay için TÜFE verisi henüz açıklanmamış olabilir” uyarısı.
TÜFE verisi bulunamazsa (servis/veri kesintisi): “TÜFE verisine ulaşılamadı, isterseniz oranı manuel girin” yönlendirmesi.
Kullanıcı oranı %0 girerse: “Artış uygulanmayacak” bilgilendirmesi (sonuç yine gösterilir).
Kullanıcı oranı çok yüksek girerse (ör. %300): “Girilen oran olağandışı yüksek, yasal sınırlar ve sözleşmenizi kontrol edin” uyarısı.
Kullanıcı oranı %100’e yakın/üstü: “Kira 2 katına yaklaşır/artar; sonucu kontrol edin” uyarısı.
Konut/işyeri seçimi yapılmadıysa: Varsayılan seçimi gösterip “Bu seçim sadece bilgilendirme metinlerini etkiler” notu.
Sözleşme yenileme ayı ile TÜFE ayı karıştırılırsa: “Artış, yenilemenin yapıldığı ayın TÜFE (12 aylık ortalama) verisiyle değerlendirilir” açıklaması.
%25 tavan dönemi seçilmiş ama kullanıcı TÜFE ile hesaplıyor: “Seçilen dönemde farklı bir yasal uygulama gündemde olabilir; karşılaştırmayı açın” önerisi.
Yuvarlama kaynaklı 1-2 TL fark: “Yuvarlama farkı olabilir” notu.