MTV HESAPLAMA DOKÜMANI (2026) — MODEL, TANIMLAR, GİRDİLER, KARAR AĞACI
Amaç
Bu doküman; 1/1/2026 itibarıyla yürürlüğe giren MTV tutarlarını esas alarak, bir hesaplayıcıda (web formu) MTV’nin nasıl hesaplanacağını standartlaştırır 
20251231M5-23.pdf
. Hesaplama mantığı “formül üretmek” değil; aracın özelliklerine göre doğru tarifeyi ve doğru satır/sütunu seçip yıllık MTV tutarını bulmaktır.

[x] 2026 MTV Oranlarının Araştırılması
[x] Veri Modelinin Oluşturulması (mtv-data.ts)
[x] Hesaplama Sayfasının Kodlanması (mtv-hesaplama/page.tsx)
[x] Araç Değeri, Yıl ve Motor Hacmi için Premium UI (PremiumSelect)
[x] Test ve Build Doğrulaması

Kapsam (tarifeler)
Tebliğe göre MTV hesaplamasında şu tarife setleri kullanılır:

(I) sayılı tarife: 1/1/2018 (dahil) sonrası ilk kayıt/tescilli otomobil, kaptıkaçtı, arazi taşıtları ve benzeri taşıtlar ile motosikletler 
20251231M5-23.pdf
(II) sayılı tarife: (I) ve (I/A) dışındaki motorlu kara taşıtları (minibüs, panelvan/karavan, otobüs, kamyonet/kamyon/çekici vb.) 
20251231M5-23.pdf
(IV) sayılı tarife: uçak ve helikopterler 
20251231M5-23.pdf
(I/A) sayılı tarife: 31/12/2017 (dahil) ve öncesi tescilli bazı taşıtlar (geçici 8 kapsamı) — pratikte 2017 ve öncesi tescilli otomobil grubu 
20251231M5-23.pdf
Çıktılar
Yıllık MTV (TL)
taksit (Ocak) = yıllık MTV / 2
taksit (Temmuz) = yıllık MTV / 2
Seçilen tarife: I / I-A / II / IV
Seçilen kırılımlar: yaş grubu + (motor hacmi / taşıt değeri / koltuk sayısı / ağırlık vb.)
Temel tanımlar
İlk kayıt ve tescil tarihi:
Aracın ilk defa trafiğe tescil edildiği tarih. (I) ile (I/A) ayrımında kritiktir 
20251231M5-23.pdf
.
Araç yaşı ve yaş grubu:
MTV tabloları yaş grupları üzerinden çalışır.
Hesaplayıcı, kullanıcının “model yılı” veya “ilk tescil yılı” bilgisinden 2026 yılı için yaş grubunu belirler.
Not: Üründe tek bir standardı seçin (öneri: “ilk tescil yılı”); sayfada açıkça belirtin.
Motor silindir hacmi (cm³):
Otomobil, motosiklet, panelvan/karavan gibi bazı taşıt türlerinde tarife kırılımıdır.
Taşıt değeri (TL) / satın alma değeri (2018+ otomobiller):
2018 ve sonrası tescilli otomobillerde MTV, motor hacmi ve yaşa ek olarak “taşıt değeri” dilimine göre de değişir (tarife I’de değer dilimleri vardır).
Uygulama: Kullanıcıdan “vergiler hariç satın alma değeri / taşıt değeri” alınır ve ilgili değer dilimine yerleştirilir.
(Bu değer tanımını sayfada aynen açıklayın; siz zaten metni temin ettiniz.)
“%100 elektrikli”:
Tam elektrikli otomobil ise hesaplayıcı EV’ye özel MTV tablosunu kullanır (varsa).
EV tablosu, tebliğde yer alan resmi rakamlarla sisteme tanımlanmalıdır. (Elinizde resmi EV tablosu yoksa sonuç “hesaplanamadı” olarak dönmelidir.)
Kullanıcıdan alınacak alanlar (dinamik form)
A) Her araç için ortak

Araç tipi (enum):
Otomobil / kaptıkaçtı / arazi taşıtı / benzeri
Motosiklet
Minibüs
Panelvan
Motorlu karavan
Otobüs
Kamyonet / kamyon / çekici / benzeri
Uçak / helikopter
İlk tescil tarihi (en az yıl; tercihen gün/ay/yıl) → tarife seçimi için gerekli 
20251231M5-23.pdf
Model yılı veya “yaş” (yaş grubu hesaplamak için)
B) Araç tipine göre ek alanlar

Otomobil grubu
%100 elektrikli mi? (E/H)
Elektrikli değilse:
Motor silindir hacmi (cm³)
Taşıt değeri (TL) (2018+ için tarife I’de zorunlu)
%100 elektrikliyse:
Motor gücü (kW) (EV tablosu buna göre kırılıyorsa)
(Varsa) taşıt değeri (TL) (EV tablosu değer dilimi içeriyorsa)
Motosiklet
Motor silindir hacmi (cm³)
Not: 0–99 cm³ satırı/verisi sistemde yoksa, bu aralığa giren girişlerde “tarife verisi eksik” uyarısı verin.
Panelvan / motorlu karavan
Motor silindir hacmi (cm³)
Otobüs
Oturma yeri (koltuk sayısı)
Kamyonet/kamyon/çekici
Azami toplam ağırlık (kg)
Uçak/helikopter
Azami kalkış ağırlığı (kg)
Tarife seçimi (karar ağacı)
Eğer araç tipi = Uçak/helikopter → Tarife = (IV) 
20251231M5-23.pdf
Eğer araç tipi = Minibüs/Panelvan/Karavan/Otobüs/Kamyonet-Kamyon-Çekici → Tarife = (II) 
20251231M5-23.pdf
Eğer araç tipi = Otomobil grubu:
İlk tescil tarihi ≤ 31.12.2017 → Tarife = (I/A)
İlk tescil tarihi ≥ 01.01.2018 → Tarife = (I) 
20251231M5-23.pdf
Eğer araç tipi = Motosiklet:
İlk tescil tarihi ≥ 01.01.2018 → Tarife = (I) 
20251231M5-23.pdf
İlk tescil tarihi ≤ 31.12.2017 için: (I/A) motosiklet satırı yoksa, resmi metinde motosikletin hangi tarifeye bağlandığını ayrıca doğrulamak gerekir. Ürün olarak iki seçenek:
(Tercih) Resmi tebliğ/kanun metninden bağlayıp uygulayın
MVP geçici kural: “motosikletlerde her tescil yılı için (I) motosiklet tablosu kullanılır” diye SSS’ye açık not düşülür
Yaş grubu belirleme kuralları
Tarifeye göre yaş grupları değişir:

Tarife I ve I/A: 1–3, 4–6, 7–11, 12–15, 16+
Tarife II: 1–6, 7–15, 16+
Tarife IV: 1–3, 4–5, 6–10, 11+
Uygulama adımı:

“Araç yaşı”nı hesapla (2026 esas alınır)
Yaşı ilgili tarifenin yaş grubuna map et
Seçilen yaş grubunu kullanıcıya çıktıda göster (şeffaflık)
Tarife bazında hesaplama (lookup mantığı)
A) Tarife (I) — 2018+ otomobil ve motosiklet 
20251231M5-23.pdf

Otomobil / arazi taşıtı / benzeri (elektrikli değil)
Boyutlar:
Motor hacmi dilimi (cm³ aralığı)
Taşıt değeri dilimi (TL aralığı)
Yaş grubu (1–3 / 4–6 / 7–11 / 12–15 / 16+)
Adımlar:
Motor hacmi dilimini bul
Taşıt değeri dilimini bul
Yaş grubunu bul
Bu üç kırılımın kesişim hücresindeki “yıllık MTV”yi oku
Motosiklet
Boyutlar:
Motor hacmi dilimi (cm³ aralığı)
Yaş grubu
Adımlar:
Motor hacmi dilimini bul
Yaş grubunu bul
Kesişim hücresindeki yıllık MTV’yi oku
%100 elektrikli otomobil
Resmi EV tablosu sistemde varsa:
Boyutlar (tebliğde nasıl tanımlandıysa):
kW dilimi
(varsa) taşıt değeri dilimi
yaş grubu
Adımlar: aynı lookup mantığı (kırılımları bul → hücreyi oku)
Resmi EV tablosu yoksa:
Çıktı: “Elektrikli araç MTV tablosu sisteme tanımlı değil” (hesaplanamadı)
B) Tarife (I/A) — 2017 ve öncesi tescilli otomobil grubu 
20251231M5-23.pdf

Boyutlar:
Motor hacmi dilimi
Yaş grubu
Adımlar:
Motor hacmi dilimini bul
Yaş grubunu bul
Kesişim hücresindeki yıllık MTV’yi oku
C) Tarife (II) — diğer motorlu kara taşıtları 
20251231M5-23.pdf

Alt tür bazında kırılımlar:

Minibüs:
Boyut: yaş grubu (1–6 / 7–15 / 16+)
Kesişim: yıllık MTV
Panelvan ve motorlu karavan:
Boyutlar: motor hacmi (≤1900 / ≥1901) + yaş grubu
Kesişim: yıllık MTV
Otobüs:
Boyutlar: oturma yeri dilimi + yaş grubu
Kesişim: yıllık MTV
Kamyonet/kamyon/çekici:
Boyutlar: azami toplam ağırlık dilimi (kg) + yaş grubu
Kesişim: yıllık MTV
D) Tarife (IV) — uçak ve helikopter 
20251231M5-23.pdf

Boyutlar:
Azami kalkış ağırlığı dilimi (kg)
Yaş grubu (1–3 / 4–5 / 6–10 / 11+)
Kesişim: yıllık MTV
Taksit hesaplama ve yuvarlama
Taksitler: yıllık MTV / 2 ve yıllık MTV / 2.
Yuvarlama kuralı belirleyin (öneri): kuruş oluşursa 1. taksiti aşağı/ yukarı yuvarlayıp 2. taksitte farkı kapatın. Kuralı SSS’de belirtin.
Doğrulamalar (validation)
Motor hacmi, kW, kg, koltuk sayısı negatif olamaz.
Zorunlu alanlar araç tipine göre dinamik olarak istenmeli.
Taşıt değeri:
2018+ otomobilde zorunlu olmalı (elektrikli değilse) çünkü tarife I’de değer dilimleri var.
Kullanıcıya “vergiler hariç” olduğuna dair net açıklama gösterin.
Motosiklette 0–99 cm³ gibi “tabloda olmayan” aralığa girişte uyarı verin.
Veri modelleme (DB olmadan da)
Tarifeleri “hard-code tablo” yerine yapılandırılmış veri olarak tutun:

tariffCode: I / IA / II / IV
vehicleSection: car / motorcycle / minibus / bus / truck / aircraft…
dimensions: (ageGroup, engineCcRange, valueRange, seatRange, weightRange, kwRange)
cells: {dimensionKeySet -> annualTaxAmount}
Bu sayede her yıl (2027 vs.) sadece veri seti değişir, hesap motoru değişmez.

Sayfa metni için zorunlu yasal/güven notu
“Bu hesaplama 2026 MTV tutarlarına göre yapılır; tebliğ 1/1/2026 tarihinde yürürlüğe girmiştir.” 
20251231M5-23.pdf
“Araç 2018+ ilk tescilli ise otomobil ve motosikletler (I) tarifesine göre vergilendirilir.” 
20251231M5-23.pdf
“(I)/(I-A) dışındaki motorlu kara taşıtları (II), uçak/helikopterler (IV) tarifesine göre vergilendirilir.” 
20251231M5-23.pdf
Açık kalan tek nokta (senin sistem kararın)
“Motosiklet 2017 ve öncesi tescil” için resmi metin hangi tarifeyi işaret ediyor? Bu bilgi netleşince karar ağacını tamamen kilitleriz.