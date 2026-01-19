BRÜTTEN NETE / NETTEN BRÜTE MAAŞ HESAPLAMA (2026) — TANIMLAR VE HESAPLAMA İÇERİĞİ
Kapsam
Bu içerik 01.01.2026–31.12.2026 dönemi için Türkiye’de 4/a (SSK) kapsamında çalışan ücretliler için brüt maaştan net maaşa ve net maaştan brüt maaşa dönüşüm mantığını açıklar.

Hesaplamada kullanılan 2026 verileri (bu dokümana göre)
Gelir Vergisi Tarifesi (Ücretliler, GVK 103 — kümülatif vergi matrahı)
0 – 190.000 TL: %15
190.000 – 400.000 TL: %20
400.000 – 1.500.000 TL: %27
1.500.000 – 5.300.000 TL: %35
5.300.000 TL üzeri: %40
Damga vergisi (ücret ödemeleri için)
Oran: binde 7,59 (0,00759)
SGK prim oranları (4/a, sigortalı payları)
SGK sigortalı payı: %14
İşsizlik sigortası sigortalı payı: %1
SGK Prime Esas Kazanç (PEK) alt/üst sınır (aylık)
Alt sınır: 33.030,00 TL
Üst sınır (tavan): 297.270,00 TL
2026 asgari ücret (bilgi/örnek doğrulama)
Brüt asgari ücret: 33.030,00 TL
Net asgari ücret: 28.075,50 TL
Not: Bu doküman, yaygın bordro hesaplama mantığını esas alır. Özel kesintiler (icra, BES, avans, sendika aidatı vb.), istisnalar (teknopark/Ar-Ge), engellilik indirimi gibi özel durumlar bu temel hesaplamaya dahil değildir.

Temel tanımlar
Brüt Ücret (Brüt Maaş):

Çalışanın sözleşmesindeki, kesintiler yapılmadan önceki aylık ücret.
Net Ücret (Net Maaş):

Brüt ücretten çalışana ait kesintiler ve vergiler düşüldükten sonra çalışanın eline geçen tutar.
Prime Esas Kazanç (PEK):

SGK primlerinin hesaplandığı kazanç tutarı.
Hesaplamada genellikle “brüt ücret” üzerinden yürünür ancak PEK tavanı nedeniyle üst limit uygulanır.
PEK Tavanı (Üst Sınır):

SGK ve işsizlik primi hesaplarında dikkate alınacak en yüksek kazanç tutarıdır.
2026 aylık tavan: 297.270,00 TL
Brüt ücret bu tutarın üzerindeyse, SGK ve işsizlik kesintileri bu tavan üzerinden hesaplanır.
SGK Sigortalı Payı:

Çalışanın maaşından kesilen SGK primidir.
2026 oran: %14
İşsizlik Sigortası Sigortalı Payı:

Çalışanın maaşından kesilen işsizlik sigortası primidir.
2026 oran: %1
Gelir Vergisi Matrahı (Aylık):

Gelir vergisinin hesaplandığı aylık tutardır.
Yaygın hesap: Gelir Vergisi Matrahı = Brüt Ücret − SGK Sigortalı Payı − İşsizlik Sigortalı Payı
Kümülatif Vergi Matrahı (Yıl İçinde Biriken Matrah):

Gelir vergisi dilimleri yıllık ve kümülatif çalışır.
Bu ayki gelir vergisi, “bu aydan önce birikmiş matrah” + “bu ayın matrahı” toplamına göre hangi vergi dilimine girildiğine bağlıdır.
Bu yüzden aynı brüt ücret, yılın başında ve sonunda farklı net sonuçlar üretebilir.
Damga Vergisi:

Ücret ödemesi üzerinden hesaplanan vergi.
2026 oran: 0,00759 (binde 7,59)
Temel hesap: Damga Vergisi = Brüt Ücret × 0,00759
Asgari Ücret Vergi İstisnası (GV + Damga):

Uygulama varsa, asgari ücret tutarına isabet eden gelir vergisi ve damga vergisi kadar tutar, hesaplanan vergilerden düşülür.
Bu nedenle asgari ücret seviyesinde gelir vergisi ve damga vergisi çoğu hesaplamada “0” görünür ve net ücret, brütten sadece SGK + işsizlik kesintisi düşülerek bulunur.
Bu dokümandaki asgari ücret neti (28.075,50) bu mantıkla uyumludur.
Brütten nete maaş hesaplama (2026) — adım adım
Girdi (kullanıcıdan):

Brüt ücret (aylık)
Kümülatif vergi matrahı (opsiyonel; girilmezse 0 kabul edilebilir)
Adım 1 — Prim hesabına esas tutarı belirle

Prim Esas Tutar = min(Brüt Ücret, PEK Tavanı)
2026 PEK tavanı: 297.270,00 TL
Adım 2 — SGK ve işsizlik kesintilerini hesapla (sigortalı payı)

SGK Kesintisi = Prim Esas Tutar × 0,14
İşsizlik Kesintisi = Prim Esas Tutar × 0,01
Adım 3 — Gelir vergisi matrahını bul (aylık)

Aylık GV Matrahı = Brüt Ücret − SGK Kesintisi − İşsizlik Kesintisi
Matrah negatif çıkarsa 0 kabul edilir.
Adım 4 — Gelir vergisini hesapla (kümülatif tarifeye göre)

Önce “bu aydan önceki kümülatif matrah” belirlenir:
Kümülatif Matrah (Önce) = kullanıcının girdiği değer (yoksa 0)
Sonra “bu ayın matrahı” kümülatife eklenir:
Kümülatif Matrah (Sonra) = Kümülatif Matrah (Önce) + Aylık GV Matrahı
Bu ayın matrahı, ilgili vergi dilimlerine parça parça dağıtılarak vergilendirilir.
Örnek mantık:
Kümülatif (Önce) 185.000 TL ise, bu ay 20.000 TL matrahın
5.000 TL’lik kısmı %15,
15.000 TL’lik kısmı %20 ile vergilenir.
Adım 5 — Damga vergisini hesapla

Damga Vergisi = Brüt Ücret × 0,00759
Adım 6 — Asgari ücret istisnası varsa uygula (opsiyonel kural)

İstisna aktifse, hesaplanan Gelir Vergisi ve Damga Vergisinden “asgari ücrete isabet eden” kısım düşülür.
Sonuç:
Brüt asgari ücret seviyesinde gelir vergisi ve damga vergisi 0’a düşebilir.
Brüt asgari ücret üstünde ise, vergiler tam çıkmak yerine istisna kadar azaltılmış olur.
Adım 7 — Net ücreti hesapla

Net Ücret = Brüt Ücret − SGK Kesintisi − İşsizlik Kesintisi − Gelir Vergisi − Damga Vergisi
İstisna uygulanıyorsa, Gelir Vergisi ve Damga Vergisi “istisna sonrası” değerlerdir.
Asgari ücret örneği (2026) — kontrol hesabı
Brüt: 33.030,00 TL

Çalışan SGK (%14):

33.030,00 × 0,14 = 4.624,20 TL
Çalışan işsizlik (%1):

33.030,00 × 0,01 = 330,30 TL
Toplam kesinti:

4.624,20 + 330,30 = 4.954,50 TL
Net:

33.030,00 − 4.954,50 = 28.075,50 TL
Not:

Bu sonuçta gelir vergisi ve damga vergisi “0” varsayımı vardır (asgari ücret GV+DV istisnası nedeniyle).
Netten brüte maaş hesaplama (2026) — yöntem
Netten brüte dönüşüm, gelir vergisinin artan oranlı (kümülatif) olması ve istisna/peyk tavanı gibi kurallar nedeniyle tek bir basit formülle her zaman doğrudan bulunamaz.

Bu nedenle pratik yöntem şöyledir:

Bir “brüt tahmini” seçilir.
Bu brüt tahmini için “Brütten Nete” adımları çalıştırılarak net hesaplanır.
Hesaplanan net:
Hedef netten küçükse brüt tahmini artırılır.
Hedef netten büyükse brüt tahmini azaltılır.
Net hedefe yeterince yaklaşana kadar bu işlem tekrarlanır.
Bu yaklaşım, hesap makinelerinde yaygın kullanılan iteratif (tekrarlı) çözümdür.

Kullanıcı arayüzü için önerilen alanlar (minimum)
Brütten nete:

Brüt ücret
(Opsiyonel) Kümülatif vergi matrahı
Çıktı: Net ücret + kesinti dökümü (SGK, işsizlik, gelir vergisi, damga)
Netten brüte:

Net ücret
(Opsiyonel) Kümülatif vergi matrahı
Çıktı: Brüt ücret + kesinti dökümü
Güven notu (sayfada yer alması önerilir)
Gelir vergisi yıl içinde kümülatif matraha göre değiştiği için sonuçlar aylar arasında farklılaşabilir.
Bu hesaplama 2026 parametreleriyle yapılır; özel kesinti/istisna durumları ayrıca değerlendirilmelidir.