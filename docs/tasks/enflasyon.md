esaplayıcı adı / kapsam
“Paranın Güncel Değeri (Enflasyonla Güncelle)”

Varsayılan endeks: TÜİK TÜFE (2003=100)
Opsiyonel endeks seçimi: Yİ-ÜFE, (istersen “alternatif veri” olarak ENAG gibi)
Tarih çözünürlüğü: Ay/Yıl (TÜFE aylık yayımlandığı için en doğru bu)
2) Girdiler (Inputs)
Zorunlu
Tutar (örn. 10.000)
Para birimi: TRY (TL) / (opsiyonel) USD-EUR (aşağıda)
Başlangıç tarihi: Ay + Yıl (örn. 2013-01)
Bitiş tarihi: Ay + Yıl (varsayılan: “son açıklanan ay”)
Önerilen (buton/ayar)
Endeks türü
TÜFE (TÜİK) – varsayılan
Yİ-ÜFE (TÜİK)
(Opsiyonel) “Alternatif ölçüm” (ENAG vb.) → bunu açıkça “resmî değil” diye etiketle
Opsiyonel (gelişmiş)
Hesap yöntemi
“Ay endeksi” (default, en doğru)
“Yıl ortalaması” (kullanıcı “2013 parası” deyince bazen yıllık daha anlaşılır)
Yuvarlama: 1 TL / 10 TL / 100 TL
(Opsiyonel) 2005 öncesi TL dönüşümü
Eğer 2005’ten önce tarih seçimine izin vereceksen:
“Tutar Eski TL (TRL) mi?” seçeneği (2005’te 1.000.000 TRL = 1 TRY)
Pratik öneri: İlk sürümde kapsamı 2003 ve sonrası ile sınırla (TÜFE 2003=100 serisiyle tertemiz). 2003 öncesi için seri birleştirme (splicing) gerekir. 

3) Çıktılar (Outputs)
Ana sonuç
Seçilen endekse göre eşdeğer tutar:
“2013 Ocak’ta 10.000 TL, 2026 Aralık’ta (son açıklanan ay) yaklaşık X TL satın alma gücüne eşdeğerdir.”
İkincil metrikler
Kümülatif enflasyon (%): ((Endeks2 / Endeks1) - 1) * 100
Yıllıklandırılmış ortalama enflasyon (CAGR):
((Endeks2/Endeks1)^(12/ay_farki) - 1) * 100
Satın alma gücü kaybı (ters yorum):
“2013’teki 1 TL’nin bugünkü alım gücü ≈ 1 / (Endeks2/Endeks1) TL”
Görselleştirme/Tablo (SEO için çok iyi)
Seçilen dönem boyunca endeks grafiği
“Yıl yıl / ay ay” dönüşüm tablosu (kullanıcı paylaşabilir)
Kaynak kutusu
“Veri kaynağı: TÜİK TÜFE (2003=100) aylık endeks serisi” + link
4) Hesap kural seti (Core formula)
4.1 Aylık endeks yöntemi (önerilen default)
Elinde bir endeks serisi olsun:

I(t) = seçilen endeksin t ayındaki endeks değeri (ör. 2013-01)
A0 = başlangıç tutarı
t0 = başlangıç ayı
t1 = bitiş ayı
Güncellenmiş değer:

A1=A0× 
I(t0)
I(t1)
​
 
Kümülatif enflasyon:

infl%=( 
I(t0)
I(t1)
​
 −1)×100
Aylık fark:

n = months_between(t0, t1) (örn. 2013-01 → 2014-01 = 12)
Yıllıklandırılmış ortalama:

cagr%=(( 
I(t0)
I(t1)
​
 ) 
n
12
​
 
 −1)×100
4.2 Yıl ortalaması yöntemi (opsiyon)
I_year_avg(y) = ilgili yılın 12 ay endeksinin ortalaması
Aynı formül, sadece ay yerine yıl ortalaması kullanılır.
5) Veri (gerçek hayatta nasıl beslenir?)
Kaynak
TÜİK aylık TÜFE endeks serisi (genellikle 2003=100 bazlı).
Bunu:
TÜİK’in veri portalından indirilebilir dosyalarla (CSV/Excel),
veya varsa API/servis uçlarıyla alıp
uygulamanda saklayabilirsin.
Güncelleme kuralı
TÜİK her ay açıklandığında (genelde ayın başında) cron job:
yeni ay endeksini çek
veritabanına ekle
“son açıklanan ay” meta bilgisini güncelle
Veri modeli (basit)
inflation_index tablosu:

index_type (CPI_TUFE, PPI_YI_UFE, …)
period (YYYY-MM)
value (decimal)
source_version / retrieved_at