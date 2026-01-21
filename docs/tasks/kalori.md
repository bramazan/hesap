Aşağıdaki tasarım “kalori hesaplayıcı”nı detaylı, gerçek dünyada kullanılan formüllerle (Mifflin–St Jeor, Katch–McArdle, PAL/aktivite çarpanları) kurar. UI değil; girdiler, çıktılar ve kural seti.

Tıbbi not: Bu hesaplar tahmindir. Hamilelik/emzirme, ergenlik, diyabet/tiroit vb. durumlarda hekim/diyetisyen gerekir. “Güvenli minimum kalori” gibi eşikler uyarı olarak verilmeli. 

1) Girdiler
A) Zorunlu temel bilgiler
Cinsiyet: Kadın / Erkek
Yaş (yıl)
Boy (cm)
Kilo (kg)
B) Vücut kompozisyonu (opsiyonel ama “detaylı” için değerli)
Vücut yağ oranı (%) (bilmiyorsa boş)
Yağ oranı girilmediyse: “Bel çevresi (cm)” opsiyonel (ileride ek analiz/riske yarar; kalori hesabına direkt şart değil)
C) Aktivite (iki katmanlı öneri)
Günlük hareket seviyesi (NEAT):
Masa başı / az hareket
Orta (gün içinde yürüyüş, ayakta iş)
Yüksek (aktif iş)
Antrenman sıklığı:
0 gün
1–2 gün/hafta
3–4 gün/hafta
5–6 gün/hafta
7 gün/hafta
(Detay modu) Antrenman türü:
Ağırlık
Kardiyo
Karışık
(Opsiyonel) Antrenman süresi (dk) ve yoğunluk (hafif/orta/sert)
Basit sürümde 7+8’den tek “aktivite çarpanı” üretmek yeterli; detay sürümde NEAT + egzersiz ayrı hesaplanabilir. 

D) Hedef
Hedef tipi:
Kilo vermek (cut)
Kilo korumak
Kilo almak (bulk)
“Performans / recomposition” (korumaya yakın, yüksek protein)
Hedef hızı (kilo değişimi):
%0.25 / %0.5 / %0.75 / %1.0 vücut ağırlığı / hafta
(Alternatif) kg/hafta girişi
E) Diyet tercihleri (makro önerisi için)
Protein tercihi: Standart / Yüksek
Yağ tercihi: Düşük / Orta / Yüksek
(Opsiyonel) Vejetaryen/vegan (sadece makro/öneri metnini etkiler)
2) Çıktılar
Sonuç 1 — Metabolizma ve harcama
BMR (Bazal metabolizma) (kcal/gün)
TDEE (Günlük toplam enerji harcaması) (kcal/gün)
Aktivite özetiniz: “PAL/aktivite katsayısı: X” veya “NEAT + egzersiz + TEF” kırılımı
Sonuç 2 — Hedef kalori
Hedefe göre önerilen günlük kalori (kcal/gün)
Hedef hızına göre günlük kalori açığı/fazlası (kcal/gün)
Uyarı: Çok agresif hedef seçildiyse (ör. >%1/hafta), “yüksek risk” uyarısı
Sonuç 3 — Makro dağılımı (gram ve kcal)
Protein (g/gün)
Yağ (g/gün)
Karbonhidrat (g/gün)
İsteğe bağlı: “Antrenman günleri vs dinlenme günleri” (kalori/makro döngüsü)
Sonuç 4 — Zaman tahmini (opsiyonel ama çok seviliyor)
Seçilen hızla 4 hafta / 8 hafta projeksiyon (tahmini kilo aralığı)
“Plateau olursa ayar önerisi” (örn. 2 hafta değişim yoksa -100 kcal)
3) Hesaplama kural seti
3.1 BMR hesaplama (seçmeli)
Seçenek A (varsayılan): Mifflin–St Jeor
Erkek: BMR = 10*kg + 6.25*cm - 5*yaş + 5
Kadın: BMR = 10*kg + 6.25*cm - 5*yaş - 161
Seçenek B (yağ oranı varsa): Katch–McArdle
Yağsız kütle: LBM = kg * (1 - yağ_oranı/100)
BMR = 370 + 21.6 * LBM
Kural: Yağ oranı girilmişse Katch–McArdle’ı “daha kişisel” diye öne çıkar; ama iki sonucu da gösterip kullanıcıya seçtirebilirsin.

3.2 TDEE (toplam harcama) hesaplama
Basit yaklaşım (çok sağlam): PAL çarpanı
TDEE = BMR * AktiviteKatsayısı

Katsayı örnek seti (yaygın kullanım):

Sedanter: 1.2
Hafif aktif: 1.375
Orta aktif: 1.55
Çok aktif: 1.725
Aşırı aktif: 1.9
Kural: NEAT + antrenman sıklığı seçimine göre bu katsayıyı otomatik eşle:

Masa başı + 0 gün → 1.2
Masa başı + 3–4 gün → 1.55
Aktif iş + 3–4 gün → 1.725
vb. (bu eşlemeyi tablolu tut)
Detay yaklaşım (istersen): NEAT + Egzersiz + TEF
TDEE = BMR + NEAT + Egzersiz + TEF
TEF (termik etki) için pratik: TEF ≈ 0.1 * (BMR + NEAT + Egzersiz)
Bu yaklaşım daha “detaylı görünür”, ama doğru veri girişi zor olduğundan varsayılanı PAL yapmak daha iyi.
3.3 Hedef kalori (cut/bulk)
Hedef hızını %/hafta veriyorsan:

Haftalık hedef kilo değişimi: Δkg_hafta = kg * hedef_oran
Enerji dönüşümü yaklaşık: 1 kg yağ ≈ 7700 kcal
Günlük kalori farkı:
Δkcal_gun = (Δkg_hafta * 7700) / 7
Sonra:

Korumak: Kalori = TDEE
Vermek: Kalori = TDEE - Δkcal_gun
Almak: Kalori = TDEE + Δkcal_gun
Guardrail (uyarı kuralları):

Eğer Kalori < BMR → “çok düşük, sürdürülemez olabilir” uyarısı
Çok genel güvenlik uyarısı eşikleri (tıbbi değil, bilgilendirme):
Kadın için ~1200 kcal altı, erkek için ~1500 kcal altı → “uzman görüşü önerilir” (opsiyonel göster)
3.4 Makro hesaplama (gram)
Makro kuralları hedefe ve tercihe göre değişebilir; burada uygulanabilir bir set:

Protein (en önemli)
“Standart”: 1.6 g/kg
“Yüksek”: 2.0–2.2 g/kg
Eğer yağ oranı girildiyse protein hesabını LBM bazlı yapma seçeneği ekle:
Protein = 2.2 g * LBM
Protein kalorisi: P_kcal = Protein_g * 4

Yağ
Minimum sağlık eşiği gibi kullan:
“Düşük yağ”: 0.6 g/kg
“Orta”: 0.8 g/kg
“Yüksek”: 1.0 g/kg
Yağ kalorisi: F_kcal = Yağ_g * 9
Karbonhidrat
Kalan kaloriyi doldur:

Carb_kcal = Kalori - (P_kcal + F_kcal)
Carb_g = Carb_kcal / 4
Kural: Karb negatif çıkarsa (kalori çok düşük / protein+yağ çok yüksek), otomatik olarak önce yağı, sonra proteini alt sınırlarına çekip yeniden hesapla ve uyarı ver.

4) Validasyonlar / hata yakalama
Boy: 120–230 cm, kilo: 30–250 kg, yaş: 14–90 gibi aralıklar (dışındaysa uyarı)
Yağ oranı: 3–60% aralığı (dışındaysa uyarı)
Aktivite “aşırı” seçip çok düşük kalori hedeflemek gibi çelişkilere uyarı
5) Aynı sayfada “ekstra” dikkat çeken mini çıktılar (trafik için iyi)
“Kilonu koruma kalorisi” + “kilo verme kalorisi” + “kilo alma kalorisi” üçlü kart (tek hesapla üç sonuç)
Adım sayısı hedefi (aktiviteye göre 6k/8k/10k önerisi; sadece öneri metni)
Protein hedefi tek başına (çok aranır): “Günde kaç gram protein?”