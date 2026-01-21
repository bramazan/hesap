Aşağıdaki içerik, tek sayfada hem Doğum Haritası (natal), hem Yükselen (ASC), hem de Uyum Haritası / Sinastri üreten bir hesaplayıcının girdi–çıktı–kural seti spesifikasyonudur (UI yerleşimi değil). Tek sayfada “Kişi A” her zaman zorunlu; “Kişi B” doldurulursa sinastri bölümü de hesaplanır.

Not: Astroloji bilimsel değildir; sayfada “eğlence/kişisel ilgi amaçlıdır” ve “eski yıllarda saat dilimi/DST belirsizliği olabilir” uyarıları yer almalı. 

0) Sayfa akışı (tek sayfada mantık)
Genel Ayarlar (zodyak, ev sistemi, açı/orb vb.)
Kişi A Bilgileri (doğum haritası + yükselen)
(Opsiyonel) Kişi B Bilgileri (uyum/sinastri açılır)
Sonuçlar
A’nın doğum haritası özeti + tablolar + açı listesi
A’nın ASC/MC + evler
B girilmişse: sinastri özet + açılar + skorlar + yorum kartları
1) Genel Ayarlar (tek kere seçilir, A ve B’ye uygulanır)
1.1 Zodyak ve efemeris ayarları
Zodyak türü: Tropikal (varsayılan) / Sidereal
Sidereal seçilirse: Ayanamsa (Lahiri vb.)
Hesaplama yaklaşımı: Geosentrik (varsayılan)
1.2 Ev sistemi (A ve B natal için)
Placidus (varsayılan)
Whole Sign (opsiyonel)
Diğerleri (Koch, Regiomontanus…) opsiyonel
1.3 Hesaplanacak noktalar
Varsayılan:

Gezegenler: Güneş, Ay, Merkür, Venüs, Mars, Jüpiter, Satürn, Uranüs, Neptün, Plüton
Noktalar: True Node (opsiyonel: Mean Node), Chiron (opsiyonel)
Açı noktaları: ASC, MC (doğum saati varsa)
1.4 Açı (aspect) seti ve orb
Majör açılar (varsayılan): 0, 60, 90, 120, 180
(Opsiyonel) Minör: 30, 45, 72, 135, 150
Orb kuralları (varsayılan öneri):
Güneş/Ay: 8°
Diğer gezegenler: 6°
ASC/MC ile açılar: 5°
(Opsiyonel) Kullanıcı orb’u “Sıkı / Normal / Geniş” seçebilir:
Sıkı: 4–6°
Normal: 6–8°
Geniş: 8–10°
2) Kişi A Girdileri (natal + yükselen burada)
2.1 Zorunlu alanlar
Doğum tarihi (gg.aa.yyyy)
Doğum saati (ss:dd)
“Saatim bilinmiyor” seçeneği
Doğum yeri (şehir arama)
çıktı olarak: enlem, boylam, ülke/il
Zaman dilimi / DST
otomatik: IANA timezone (örn. Europe/Istanbul)
otomatik DST uygulanır
gelişmiş: manuel override
2.2 “Saat bilinmiyor” modu davranışı (kural)
Saat yoksa:
ASC/MC/evler hesaplanmaz (veya “12:00 varsay” seçeneğiyle “yaklaşık” olarak hesaplanır)
Güneş ve çoğu gezegen burç konumu genelde değişmez; Ay için “gün içinde burç değişebilir” uyarısı verilir
“Yaklaşık ASC aralığı” opsiyonu:
Kullanıcı “tahmini saat aralığı (örn. 10:00–14:00)” girerse ASC’nin olası burç/derece aralığı hesaplanır.
3) Kişi B Girdileri (Uyum/Sinastri için)
Aynı alanlar Kişi A ile birebir:

Doğum tarihi
Doğum saati (bilinmiyorsa sinastri sınırlı)
Doğum yeri
timezone/DST
Sinastri kuralı (saat bilinmiyorsa):

Saat yoksa: ASC/MC ve ev bindirmeleri çıkarılamaz.
Sinastri yalnızca gezegen–gezegen açılarına dayanır; “skor güvenilirliği” düşer → uyarı etiketi.
4) Çıktılar (Sonuç içerikleri)
4.1 Kişi A — Doğum Haritası Çıktıları
(A) Özet kart

Güneş burcu (derece)
Ay burcu (derece) (saat bilinmiyorsa “olası” etiketi)
Yükselen (ASC) burcu + derece (saat varsa)
MC burcu + derece (saat varsa)
(B) Gezegen konumları tablosu
Her satır:

Gezegen/Nokta
Burç + derece/dakika
Ekliptik boylam (0–360°)
Retro mu? (R)
Ev (ev sistemi seçili ve saat biliniyorsa)
(C) Evler tablosu (saat varsa)

1–12 ev başlangıç dereceleri (cusp)
Whole Sign seçilirse: 1. ev = ASC burcu, her ev 30° burç blokları (cusp mantığı açıklanır)
(D) Natal açı listesi

Hangi iki nokta arasında
Açı türü
Orb (°)
Güç (0–100)
(E) Dağılım analizi

Element dağılımı (Ateş/Toprak/Hava/Su)
Nitelik dağılımı (Öncü/Sabit/Değişken)
4.2 Uyum Haritası / Sinastri Çıktıları (B doldurulunca)
(A) Uyum özeti

Genel uyum skoru: 0–100
Alt skorlar:
Duygusal uyum (Moon/Venus)
İletişim (Mercury)
Çekim/kimya (Venus–Mars)
Uzun vadeli/istikrar (Saturn)
“Saat bilinmiyor” varsa: Skor güvenilirliği: Düşük/Orta/Yüksek
(B) En güçlü destekleyici açılar (Top 5)

Örn. “A Venüs – B Mars üçgen (orb 1.2°)”
(C) En zorlayıcı açılar (Top 5)

Örn. “A Ay – B Satürn kare (orb 0.8°)”
(D) Tüm sinastri açı listesi

A nokta – B nokta
Açı türü, orb, skor etkisi (+/-)
Kategori etiketi (duygusal/iletişim/çekim/istikrar)
(E) (Opsiyonel) Ev bindirmeleri
Yalnızca iki kişinin saati varsa:

“B’nin Güneşi A’nın 7. evinde” gibi yerleşimler
Bunları skorlamaya dahil edebilirsin (aşağıda)
5) Hesaplama Yöntemi (Teknik kural seti)
5.1 Temel motor önerisi
Swiss Ephemeris (swisseph) kullan:

Gezegen ekliptik boylamı λ (0–360)
Hız (retro kontrolü)
Evler, ASC/MC
Doğum yeri:

Geocoding: GeoNames / OSM Nominatim (cache şart)
Zaman dilimi:
tz database + DST (IANA timezone)
5.2 Zaman dönüşümü
Her kişi için:

Local datetime + timezone/DST → UTC
UTC → Julian Day (JD)
5.3 Gezegen konumları
Her gezegen için:

Boylam λ
Retro: hız < 0 ise R
Burç/derece:

sign = floor(λ / 30)
deg_in_sign = λ % 30
5.4 Evler / ASC / MC
Saat varsa:

Seçilen house system ile cusp’lar + ASC/MC hesaplanır.
Gezegenin evi:
Placidus vb.: λ hangi cusp aralığına düşüyor (wrap-around dikkat)
Whole Sign: ev = gezegenin burcu ile ASC burcunun göreli farkına göre
5.5 Aspect (açı) tespiti (natal ve sinastri aynı mantık)
İki nokta arası:

diff = abs(λ1 - λ2)
diff = min(diff, 360 - diff) (0–180’e indir)
Her hedef açı A için:

orb = abs(diff - A)
orb <= orb_limit(point1, point2, A) ise aspect var
Güç puanı (0–100):

strength = round(100 * (1 - orb/orb_limit)) (min 0)
6) Sinastri Skorlama (0–100) — Önerilen kural seti
Skorlamayı “kesin doğru” diye değil, şeffaf ve ayarlanabilir bir model olarak kurgula (admin’den ağırlıklar değişsin).

6.1 Hangi açılar skorlanacak?
Varsayılan: majör açılar (0/60/90/120/180)

6.2 Hangi noktalar daha önemli?
Sinastri için tipik öncelik:

Kişisel: Güneş, Ay, Merkür, Venüs, Mars
Sosyal: Jüpiter, Satürn (özellikle Satürn)
Dışsal: Uranüs, Neptün, Plüton (etki var ama “gürültü” de olabilir)
Açılar: ASC/MC (saat varsa güçlü)
6.3 Açı türüne göre temel işaret (+/-)
Örnek “base score” (orb’a göre ölçeklenecek):

Kavuşum (0°): +6 (gezegene göre + veya karma olabilir)
Üçgen (120°): +7
Altmışlık (60°): +5
Kare (90°): -6
Karşıt (180°): -4 (bazı kombinasyonlarda çekim de verebilir; istersen -2 yap)
6.4 Gezegen çiftine göre ağırlık (weight)
Örnek ağırlıklar:

Ay–Ay, Ay–Venüs, Venüs–Mars: 1.4
Güneş–Ay: 1.5
Merkür–Merkür / Merkür–Ay: 1.2
Satürn’ün kişisel gezegenlere açısı: 1.3 (olumluysa “bağlayıcı”, olumsuzsa “zorlayıcı”)
Dışsal gezegenlerin kişisele açısı: 0.8
ASC ile kişisel gezegenler (saat varsa): 1.3
6.5 Orb ile etkiyi azaltma
Aspect etkisi:

effect = base_score * weight * (1 - orb/orb_limit)
Bu değer pozitif/negatif olabilir.
6.6 Toplam skoru 0–100’e normalize etme
Tüm sinastri açılarının effect değerlerini topla: E_total
Aşırı uçları sınırlamak için clamp uygula: örn. E_total’ı [-50, +50] aralığına kırp
0–100’e çevir:
score = round(50 + (E_total * 1)) (ölçeği testlerle kalibre et)
clamp: 0–100
6.7 Alt skorlar (kategori bazlı)
Açıları etiketle:

Duygusal: Ay, Venüs (Ay–Ay, Ay–Venüs, Ay–Mars…)
İletişim: Merkür ağırlıklı
Çekim: Venüs–Mars, Mars–Mars, Venüs–Plüton (opsiyonel)
İstikrar: Satürn’ün kişisel gezegenlere açıları, Güneş–Satürn vb.
Her kategori kendi E_cat toplamından 0–100’e normalize edilir.
6.8 Ev bindirmelerini skora dahil etme (opsiyonel)
Saatler varsa:

B’nin Güneşi A’nın 1/5/7. evinde → + puan
B’nin Satürn’ü A’nın 7/8/12. evinde → karma/uyarı
Bu kısmı ilk sürümde “bilgi” olarak gösterip skora sonra dahil etmek daha güvenli.
6.9 Güvenilirlik etiketi
İki kişide de saat var: Yüksek
Birinde saat yok: Orta
İkisinde de saat yok: Düşük
Bu etiket, skorun yanında görünmeli.
7) Validasyon ve edge-case kuralları
Tarih aralığı: Swiss Ephemeris dosyalarının kapsadığı range ile sınırlanır (örn. 1800–2400)
DST belirsiz yıllarda (özellikle eski doğumlar): “timezone kesin olmayabilir” uyarısı
Şehir bulunamazsa: manuel enlem/boylam girişi opsiyonu (gelişmiş)
8) Tek sayfada “çıktı paketleri” (kopyalanabilir)
A’nın özeti: Güneş/Ay/ASC + element dağılımı
Uyum özeti: skor + en iyi 3 destekleyici + en zorlayıcı 3 açı