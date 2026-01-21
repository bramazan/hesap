Kullanıcının verdiği bilgilerle en erken emeklilik türünü (EYT / normal) belirleyip:

Emekliliğe hak kazanacağı en erken tarih
Gerekli şartlar (yaş, prim günü, sigortalılık süresi)
Eksik gün/yıl ve tamamlama tarihi (bugünden itibaren projeksiyon)
çıktılarını vermek.
2) Girdiler (Form alanları)
A) Kimlik/temel bilgiler
Cinsiyet (Kadın / Erkek)
Doğum tarihi (gg.aa.yyyy)
İlk sigortalı işe giriş (SGK tescil) tarihi
4A/4B/4C fark etmeksizin “ilk defa uzun vadeli sigorta” başlangıcı olarak kullanılmalı.
Hizmet statüsü (seçim)
4A (SSK)
4B (Bağ-Kur)
4C (Emekli Sandığı)
(Opsiyonel) “Birden fazla statüde çalıştım” → Detay mod açılır.
B) Prim ve hizmet bilgileri
Toplam uzun vadeli prim gün sayısı (şu ana kadar)
e-Devlet “SGK Tescil ve Hizmet Dökümü”nden girilebilir.
(Opsiyonel ama çok değerli) Bugünden sonra çalışma planı
“Ayda ortalama kaç gün prim yatacak?” (0–30)
“Çalışmaya devam edeceğim tarih” (veya “belirsiz”)
C) Detay mod (çok statü / kritik kural alanları)
“Birden fazla statüde çalıştım” seçilirse:
Son 2520 gün dağılımı: 4A gün / 4B gün / 4C gün
(Alternatif) “Son 7 yıl içinde hangi statü daha fazla?” seçeneği (kullanıcı bilmiyorsa basit mod)
Neden: Emeklilik statüsü çoğu durumda son 2520 gün (yaklaşık 7 yıl) içinde en fazla hangi statü varsa ona göre belirlenir. (Eşitse genelde en son tabi olunan statü pratikte belirleyici olur; bunu kural olarak yazıp açıklamada belirt.) 

D) Borçlanma/indirime etki eden opsiyonlar (isteğe bağlı)
Askerlik borçlanması (Erkek)
“Askerlik süresi (gün)”
“Askerlik tarihi ilk sigorta girişinden önce mi?” (Evet/Hayır)
Bu alan kritik çünkü giriş tarihini geriye çekebilme etkisi olabilir (kural ayrı bir hesaplayıcıda derinleşebilir). 
Doğum borçlanması (Kadın)
Çocuk sayısı, her çocuk için borçlanılacak gün (max sınırlar ayrı kural)
(Ayrı ürün olarak daha iyi ama burada “bilgi amaçlı”)
Engellilik / Malulen: “Hesaba dahil et” → ayrı sayfaya yönlendirme (çünkü şartlar çok farklı)
3) Üretilecek çıktılar (Sonuç kartları)
Sonuç 1 — “En erken emeklilik senaryosu”
Emeklilik türü:
“EYT (yaş şartı yok)” veya
“Normal emeklilik (yaş + gün)”
En erken emeklilik tarihi (gg.aa.yyyy)
Emeklilik yaşı (kaç yaşında emekli olabileceği)
Emeklilik statüsü (4A/4B/4C – 2520 gün kuralına göre)
Sonuç 2 — “Şartlar ve eksikler”
Gerekli prim gün sayısı / mevcut / eksik
Gerekli sigortalılık süresi (yıl) / mevcut / eksik (özellikle EYT için)
Gerekli yaş / mevcut / eksik (normal emeklilikte)
Sonuç 3 — “Tamamlama projeksiyonu”
Kullanıcı “aylık prim” girdiyse:
Eksik günün kaç ayda biteceği
“Prim günü şu tarihte tamamlanır”
Birden fazla senaryo:
“Ayda 30 gün ödenirse”
“Ayda 20 gün ödenirse”
“Çalışmayı bırakırsanız sadece yaş beklenir” gibi
Sonuç 4 — “Mevzuat açıklaması / kaynak”
Hangi mevzuat segmenti uygulandı:
“İlk giriş: … olduğundan EYT kontrolü yapıldı”
“5510 sonrası normal emeklilik şartları uygulandı” gibi
Kaynak linkleri (SGK / Resmî Gazete / ilgili kanun maddesi referansı)
4) Hesap mantığı (kurallar)
Adım 0 — “Uygulanacak statüyü” belirle
Tek statü seçildiyse onu kullan.
Çok statü varsa:
Son 2520 gün içinde en fazla hangi statü → emeklilik statüsü o
Eşitse → “en son tabi olunan statü” (kullanıcıdan sorulabilir)
Adım 1 — EYT kontrolü (kritik eşik)
İlk sigortalı giriş tarihi < 09.09.1999 ise:
EYT olası: yaş şartı aranmaz.
Ama prim gün ve sigortalılık süresi şartları devam eder.
Sigortalılık süresi (genel kabul edilen çerçeve):
Kadın: 20 yıl
Erkek: 25 yıl
Prim gün şartı: İlk giriş tarihine göre kademeli tablolar (SSK/diğer) vardır.
Ürün açısından doğru yaklaşım: Bu tabloyu “data” olarak sakla. (Uzun ve hata riski yüksek olduğu için burada satır satır yazmak yerine, uygulama içinde 506/1479/5434 geçiş tablolarını kaynak gösterip yönetilebilir veri olarak tutmanı öneririm.) 
EYT için en erken emeklilik tarihi:

tarih1 = ilk_giris + gerekli_sigortalilik_suresi
tarih2 = prim_gun_tamamlama_tarihi (kullanıcı plan verdiyse hesaplanır, vermediyse “tamamladığınız gün”)
emeklilik_tarihi = max(tarih1, tarih2)
Adım 2 — EYT değilse “5510 sonrası/öncesi normal emeklilik”
Pratik ürünleştirme için 2 ana blok öner:

Blok A — İlk giriş 09.09.1999 – 30.09.2008 arası (yaygın kural seti)
4A (SSK) için yaygın “tam emeklilik” koşulu:
Prim: 7000 gün
Yaş: Kadın 58, Erkek 60
Alternatif yol (kısmi/karma şartlar) gibi seçenekler mevzuatta var; bunu ayrı “Yaştan emeklilik” hesaplayıcısına bölmek daha sağlıklı.
Blok B — İlk giriş ≥ 01.10.2008 (5510 dönemi)
“Tam emeklilik” temel çerçeve:
4A: 7200 gün
4B/4C: çoğunlukla 9000 gün
Yaş şartı: Sabit 58/60 olarak kalmayıp ilerleyen yıllarda 65’e kademeli çıkar.
Uygulamada en doğru yöntem:
Kullanıcının prim gününü hangi tarihte tamamlayacağını bul (plan yoksa “bugün itibariyle tamamladı mı?” sadece kontrol edersin).
“Prim gününü tamamlama yılına göre” yaş tablosunu uygula.
Bu yaş kademesini de tablo-data olarak tut (yıl aralıkları → kadın/erkek yaş). 
Normal emeklilikte en erken tarih:

tarih_prim = prim_gun_tamamlama_tarihi
yas_gereken = tabloya_gore_yas(tarih_prim_yili, cinsiyet, statu)
tarih_yas = dogum_tarihi + yas_gereken
emeklilik_tarihi = max(tarih_prim, tarih_yas)
5) Validasyon / gerçek hayattaki kritik uyarılar (ekrana koy)
“İlk giriş tarihi” ile “toplam prim günü” tutarsız olabilir → kullanıcıya uyarı.
“Borçlanma” girişini burada hesaplamaya katarsan:
Bazı borçlanmalar giriş tarihini geriye çekebilir, bazıları sadece gün ekler. Bunu açıkça ayır.
“Fiilî hizmet zammı, malulen, engelli, yıpranma” gibi durumlar ayrı hesaplayıcı olmalı (bu sayfada sadece yönlendir).