Bu POS komisyon hesaplama sayfası; komisyon oranı (%) ve varsa işlem başı sabit ücret (TL) üzerinden, brüt tahsilattan hesabınıza net kaç TL geçeceğini hesaplar. Ayrıca “hesabıma net şu kadar geçsin” hedefi verildiğinde, müşteriden kaç TL çekmeniz gerektiğini geri hesaplar.

2) Hangi verilerle hesaplanır?
Hesaplama modu: Brüt → Net / Net → Brüt
Tutar (TL): moda göre brüt veya net hedef
Komisyon oranı (%)
Sabit ücret (TL) (opsiyonel, yoksa 0)
(Opsiyonel) Minimum komisyon (TL)
(Opsiyonel) Komisyon tavanı (TL)
Bu sürümde yuvarlama ayarı yoktur. 

3) Nasıl hesaplanır? (adım adım algoritma – kod yok)
A) Mod 1: “Ödeme aldım (Brüt → Net)”
Brüt tutarı al.
Komisyon = Brüt × KomisyonOranı
(Varsa) limitleri uygula:
Komisyon = max(Komisyon, MinKomisyon)
Komisyon = min(Komisyon, TavanKomisyon)
ToplamKesinti = Komisyon + SabitÜcret
Net = Brüt − ToplamKesinti
Sonuçları hesaplandığı haliyle göster (yuvarlama kuralı uygulanmaz).
B) Mod 2: “Hesabıma net geçsin (Net → Brüt)”
NetHedef tutarını al.
Komisyon oranını r kabul et (örn. %2,5 → 0,025).
Sabit ücreti f kabul et.
Denklem: NetHedef = Brüt × (1 − r) − f
Buradan: Brüt = (NetHedef + f) / (1 − r)
(Varsa) minimum/tavan komisyon devreye giriyorsa bu ters formül sapabilir:
Ön brütü formülle bul,
Brüt→Net ile kontrol et,
Net hedefin altındaysa brütü artırarak hedefi yakala (üründe “yaklaşık/iteratif” notu).
4) Form alanları (label + açıklama + örnek değer)
Basit Mod
Hesaplama modu — “Ödeme aldım (Brüt→Net)” / “Hesabıma net geçsin (Net→Brüt)”
Örnek: Net→Brüt
Tutar (TL) — Moda göre brüt veya net hedef
Örnek: 5000
Komisyon oranı (%) — POS oranınız
Örnek: 3,10
Sabit ücret (TL) — İşlem başı ücret (yoksa 0)
Örnek: 1,25
Gelişmiş Mod (opsiyonel)
Minimum komisyon (TL)
Örnek: 2
Komisyon tavanı (TL)
Örnek: 500
“Yuvarlama” alanı yok. 

5) Örnek hesaplamalar (en az 2 senaryo)
Senaryo 1 — Brüt → Net
Brüt: 10.000
Komisyon: %2,5
Sabit ücret: 0
Hesap:

Komisyon = 10.000 × 0,025 = 250
Net = 10.000 − 250 − 0 = 9.750
Senaryo 2 — Net → Brüt
Net hedef: 5.000
Komisyon: %3,10 (r=0,031)
Sabit ücret: 1,25 (f=1,25)
Hesap:

Brüt = (5.000 + 1,25) / (1 − 0,031)
Brüt = 5.001,25 / 0,969 = 5161,351909…
Bu sayfa yuvarlama uygulamadığı için sonucu bu şekilde üretir; bankanız tahsilatta/ekstrede kuruş seviyesinde farklı gösterebilir. 

Senaryo 3 — Minimum komisyon varsa
Brüt: 30
Komisyon: %2,5 → 0,75
Min komisyon: 2
Sabit ücret: 0
Hesap:

Komisyon = max(0,75; 2) = 2
Net = 30 − 2 = 28
6) SSS (en az 8 soru)
Yuvarlama neden yok?
İstediğiniz üzere hesaplama “ham” matematikle yapılır; ek bir yuvarlama kuralı uygulanmaz.
Sonuç çok uzun ondalık çıkarsa ne olacak?
Hesaplama yine aynı kalır; sadece ekranda gösterim (format) yapılabilir. (İsterseniz “tam değer” + “gösterim” ayrı gösterilebilir.)
Bankamın yatırdığı net ile neden fark olur?
Bankalar/PSP’ler kuruş bazında yuvarlama, kalem bazlı kesinti hesaplama veya farklı gösterim uygulayabilir. Bu sayfa bunları taklit etmez.
Komisyon oranını nereden bulacağım?
Sözleşme, POS paneli veya ekstre kesinti kalemlerinden.
Sabit ücret nedir?
İşlem başı hizmet/işlem bedeli gibi ek ücretler (yoksa 0 girin).
Taksitli işlemde çalışır mı?
Evet, taksitli işlem oranınızı girerseniz çalışır (oran farklı olabilir).
Net hedef modunda minimum komisyon varsa kesin sonuç verir mi?
Minimum komisyon varsa ters hesap doğrusal olmaktan çıkar; hedefe ulaşmak için iteratif ayarlama gerekebilir.
Komisyon tavanı varsa ne olur?
Brüt arttıkça komisyon artışı durabilir; ters hesapta yine kontrol+ayarlama gerekebilir.
7) Hata/edge-case listesi (en az 10 madde)
Komisyon oranı <0 veya ≥100 girilmesi (1−r sıfır/negatif olur)
Net hedef modunda r≥100% → brüt hesaplanamaz
Negatif brüt/net tutar girilmesi
Sabit ücretin negatif girilmesi
Sabit ücret brüte çok yakın/büyük → netin negatif çıkması
Min komisyon brütten büyük → net negatif olabilir
Tavan komisyon + net→brüt ters hesap sapması (kontrol gerekir)
Ondalık ayıracı (5.000,50 vs 5,000.50) kaynaklı yanlış okuma
Çok büyük sayılarda format/taşma problemleri
Komisyon oranının “3,1” mi “310” mu girildiği kullanıcı hatası (input mask gerekli)
Sağlayıcı birden fazla sabit ücret alıyorsa tek alan yetersiz kalır (MVP sınırı)
Banka/PSP’nin kendi yuvarlama/gösterimi nedeniyle ekstreyle fark görülmesi
8) UX notları (Basit mod / Gelişmiş mod önerisi)
Basit mod: Mod + Tutar + Komisyon % + Sabit ücret
Çıktı: “Hesaba geçecek net” veya “Çekmeniz gereken brüt”, altında “Komisyon” ve “Sabit ücret”.
Gelişmiş mod: Min/Tavan komisyon ekle. Net→Brüt modunda “Hedefe ulaşmak için brütü otomatik artır (iteratif)” seçeneği koy.
Gösterim için (hesaplama değişmeden):
“Tam sonuç” (ör. 5161,351909…)
“Gösterim” (isterseniz sadece görünüm amaçlı 2 hane)
Bu, yuvarlama kuralı değil, sadece görüntüleme filtresi olarak konumlanır.
9) Kaynak/parametre doğrulama notu
Bu hesaplama resmî oranlara değil, sizin banka/ödeme kuruluşu sözleşmenizdeki komisyon oranı ve sabit ücret parametrelerine dayanır. “2026 güncel” tarafı, mevzuat oranı değil; sözleşmesel oranların kullanıcı tarafından güncel girilmesi ile sağlanır.

İsterseniz bir sonraki adımda şu iki kararı netleştirelim (uydurmadan ilerlemek için):

“Sabit ücret” işlem başına mı, yoksa aylık/ciro bazlı mı? (Bu sayfa işlem başı varsayıyor.)
Net→Brüt modunda min/tavan komisyonu destekleyelim mi, yoksa MVP’de sadece “oran + sabit ücret” mi kalsın?