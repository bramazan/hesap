Aşağıdaki kurguda tek sayfa var; sayfada “mod seçimi” bulunur ve aynı veri modelini kullanır:

Mod 1: Hızlı Plan (Benim için planla) → minimum veriyle otomatik bütçe önerisi üretir
Mod 2: Detaylı Plan (Kendi bütçemi giriyorum) → kullanıcı kalem kalem girer, sistem analiz + düzeltme önerisi verir
İki mod birbirine dönüşebilir: Hızlı Plan çıktısı “Detaylı Plan’a aktar” ile kalemlere dağıtılır.
Ortak kavramlar (iki modda da kullanılan)
Kategori grupları
Konut: kira/kredi + aidat
Faturalar & iletişim: elektrik/su/doğalgaz + internet/telefon
Gıda: market + dışarıda yeme (ister iki alt kalem)
Ulaşım
Sağlık/Eğitim/Zorunlu diğer
Borç ödemeleri (minimum): kredi taksitleri + kart asgarisi
Birikim/Yatırım
Keyfi/Esnek harcama: eğlence, hobi, giyim vb. (kısıtlanabilir alan)
Oran sınırları (öneri motorunun “guardrail”leri)
Bunlar “tavsiye” amaçlıdır; çıktıda uyarı üretmek için kullanılır:

Konut oranı (K):
İdeal aralık: %25–%35
Yüksek ama tolere: %35–%40
Riskli: >%40 (uyarı + alternatif kira hedefi üret)
Birikim oranı (S):
Minimum: %10 (altına düşerse “birikim çok düşük” uyarısı)
Dengeli hedef: %20–%25
Hızlı birikim hedefi: %30
Borç yükü oranı (D) = (aylık minimum borç ödemeleri) / gelir
Uyarı eşiği: %40+ (nakit akışı riski)
Gelir dalgalıysa “plan geliri” kuralı
Girdi: son 3 ay net gelir (G1,G2,G3)

Muhafazakâr plan geliri = min(G1,G2,G3)
veya “Dengeli” için ortalama(G)*0.9
Kullanıcı “sabit gelir” derse direkt net gelir kullanılır.
MOD 1 — Hızlı Plan (“Benim için planla”)
1) Girdiler (minimum)
Zorunlu:

Aylık net gelir (TL)
İsteğe bağlı ama planı çok iyileştirir:
2) Gelir tipi: Sabit / Dalgalı (dalgalıysa son 3 ay gelir)
3) Konut durumu:

“Kira ödüyorum” → kira+aidat toplamı (TL)
“Konut kredisi ödüyorum” → taksit+aidat toplamı
“Ev sahibiyim” → 0 veya sadece aidat
“Henüz belli değil, öner” (sistem kira hedefi verir)
Aylık minimum borç ödemeleri toplamı (kredi + kart asgari) (TL)
Hedef/profil:
Temkinli (daha yüksek birikim, daha düşük esnek harcama)
Dengeli
Hızlı birikim
2) Çıktılar
Önerilen aylık bütçe dağılımı (TL ve %):
Konut
Faturalar & iletişim
Gıda
Ulaşım
Sağlık/Eğitim/Zorunlu diğer
Borç minimum
Birikim/Yatırım
Keyfi/Esnek
Önerilen kira aralığı (kira girilmediyse): “ideal kira: X–Y, üst sınır: Z”
Uyarılar:
“Konut oranı çok yüksek”, “Birikim minimumun altında”, “Borç yükü yüksek” vb.
Günlük esnek harcama limiti:
gunluk_esnek = Keyfi/Esnek / 30 (veya ay gün sayısı)
3) Hesap kural seti (öneri motoru)
Adım 1 — Plan gelirini belirle
I = plan_geliri (yukarıdaki kurala göre)

Adım 2 — Profil parametreleri (hedef oranlar)
Örnek set (sen admin panelden değiştirilebilir tut):

Temkinli: birikim hedefi S* = 0.30, esnek hedefi W* = 0.10
Dengeli: S* = 0.25, W* = 0.15
Hızlı birikim: S* = 0.35, W* = 0.10
Not: “Borç minimum” (B) kullanıcı girdisidir ve önceliklidir.

Adım 3 — Konut bütçesi (kira belli mi?)
Kira/kredi girildiyse: K = girilen_konut
Girilmediyse öner:
İdeal kira: I * 0.30 (orta nokta)
İdeal aralık: I*0.25 ile I*0.35
Üst sınır: I*0.40
Plan içinde konut bütçesi varsayılan: K = I*0.30 (kullanıcı sonra değiştirir)
Adım 4 — Zorunlu temel kalemleri hesapla (konut hariç)
Bu kalemleri gelir yüzdesiyle öner (kullanıcı bilmiyorsa):

Faturalar & iletişim: U = I * 0.06
Gıda: F = I * 0.15
Ulaşım: T = I * 0.06
Sağlık/Eğitim/Zorunlu diğer: M = I * 0.03
Bu oranları tek tek “min/max” aralıklarla da tutabilirsin (örn. gıda %12–18). Basit sürümde tek oran yeterli. 

Adım 5 — Borç minimumu ekle
B = kullanici_borc_min (yoksa 0)

Adım 6 — Birikim hedefini uygula
S = max(I*S*, I*0.10) (minimum %10)

Adım 7 — Kalanı esnek/keyfi harcamaya ayır
W = I - (K + U + F + T + M + B + S)

Adım 8 — Negatif/gerçekçilik düzeltmesi (en önemli kısım)
Eğer W < 0 ise açık var demektir. Düzeltme sırası:

Esnek harcamayı sıfıra kadar düşür: W = 0
Hâlâ açık varsa birikimi minimuma kadar düşür: S = max(I*0.10, S + W) (W negatifken azaltma)
Hâlâ açık varsa: “Bütçe açığı” üret:
acik = (K+U+F+T+M+B+S) - I
Çıktı: “Bu gelirle mevcut zorunlular sürdürülemez; gelir +X olmalı veya konut/borç azaltılmalı”
Ayrıca “Hedef kira” öner: hedef_konut_max = I*0.40 ve “şu anki konut: … > max” gibi.
Adım 9 — Uyarı üretme kuralları
K/I > 0.40 → “Konut yükü riskli”
B/I > 0.40 → “Borç yükü riskli”
S/I < 0.10 → “Birikim minimumun altında”
W/I < 0.05 → “Esnek alan çok düşük (beklenmedik gider riski)”
MOD 2 — Detaylı Plan (“Kendi bütçemi giriyorum”)
1) Girdiler
Zorunlu:

Aylık net gelir (veya dalgalıysa plan geliri)
Kullanıcı kalem kalem girer (aylık TL):

Konut: kira/kredi, aidat
Faturalar (elektrik/su/doğalgaz), internet/telefon
Market, dışarıda yeme
Ulaşım
Sağlık, eğitim, sigorta vb.
Abonelikler
Borç: kredi taksitleri, kart asgari/toplam
Birikim hedefi (TL veya %)
Opsiyonel:

Yıllık/3 aylık ödemeler (vergiler, bakım, tatil) → sistem aya böler:
yıllık: /12, 3 aylık: /3
2) Çıktılar
Toplam gider, toplam zorunlu, toplam esnek
Ay sonu net: I - toplam_gider
Hangi kalem “oran sınırlarını” aşıyor (konut %, borç %, vb.)
Kullanıcının seçtiği birikim hedefi tutuyor mu?
“Hedefe ulaşmak için şu kalemlerden toplam X TL azaltmalısın” önerisi
İsterse “Benim için planla ile karşılaştır” (aynı sayfada)
3) Hesap kural seti (analiz + öneri)
toplam_gider = tüm_kalemler + birikim
net_kalan = I - toplam_gider
Oranlar:
konut_oran = konut/I
borc_oran = borc_min/I
birikim_oran = birikim/I
Eğer net_kalan < 0 (açık):
Önce “esnek” kategorilerden azaltım öner (dışarıda yeme, eğlence, giyim)
Sonra opsiyonel giderlerden (abonelikler)
Son çare: birikim hedefini aşağı çek (ama %10 altına iniyorsa uyar)
Eğer konut_oran > 0.40:
“Bu gelirle sürdürülebilir konut üst sınırı ≈ I*0.40” hesapla
Aradaki farkı (konut - I*0.40) kullanıcıya net göster
Günlük limit (isteğe bağlı):
Esnek kategoriler toplamı / 30
Önerilen sayfa davranışı (tek sayfada iki mod)
Mod 1 “Benim için planla” çalışınca: kalemler otomatik dolar, kullanıcı Mod 2’ye geçip düzenler.
Mod 2’de kullanıcı “Sıfırla / Benim için tekrar planla” diyebilir (aynı sayfa).