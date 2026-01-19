1) Hesaplama Kimliği
Hesaplama adı: IBAN validasyonu (TR odaklı)
Hedef kitle:
Bireysel kullanıcı (havale/EFT yapacak)
KOBİ / e-ticaret (ödeme toplama, iade, tedarikçi ödemeleri)
Muhasebe/finans ekipleri (toplu ödeme ön kontrolü)
Kullanıcı amacı:
IBAN’ın geçerli/geçersiz olduğunu hızlıca görmek
Kopyalanan IBAN’ı temizleyip standart formatta elde etmek
(Opsiyonel) Hatanın nedenini öğrenmek (uzunluk, ülke kodu, kontrol basamağı vb.)
2) Kapsam (MVP sınırı)
Kapsanan senaryolar (madde madde)
TR IBAN için doğrulama
Karakter seti kontrolü (harf/rakam dışı)
Ülke kodu kontrolü (TR)
Uzunluk kontrolü (TR IBAN sabit uzunluktadır)
Kontrol basamağı (checksum) doğrulaması (ISO standardına göre)
Girdi içindeki boşluk/tire gibi ayırıcıları yok sayma (normalize etme)
Sonuçta “Geçerli / Geçersiz” + kısa neden mesajı
Hariç tutulanlar (madde madde)
IBAN’ın hesap sahibine ait olduğunu doğrulama (isim eşleştirme)
Banka sistemine bağlanıp hesabın aktif/pasif kontrolü
SWIFT/BIC doğrulama
Çoklu ülke IBAN doğrulaması (MVP’de TR-only; opsiyon olarak eklenebilir)
Toplu liste yükleyip toplu doğrulama (CSV) (sonraki faz)
Varsayımlar
Validasyon sadece IBAN’ın standartlara uygun yazılıp yazılmadığını ve kontrol basamağının doğru olduğunu gösterir.
Kullanıcı IBAN’ı kopyala-yapıştır yapabilir; sistem görünmez karakterleri ayıklamaya çalışır.
3) Girdiler (Kullanıcıdan istenecekler)
Zorunlu alanlar
IBAN (metin alanı)
Açıklama: Kontrol etmek istediğiniz IBAN’ı yazın/yapıştırın
Örnek: TR12 3456 7890 1234 5678 9012 34
Opsiyonel alanlar
Ülke seçimi (TR varsayılan)
Açıklama: Sadece Türkiye mi doğrulanacak, yoksa ülke otomatik mi algılansın?
Örnek: Türkiye (TR) / Otomatik algıla
“Sonucu maskele” (gizlilik)
Açıklama: Ekranda IBAN’ın tamamı yerine kısmi gösterim (örn. ilk 6 / son 4)
Örnek: Açık/Kapalı
“Kopyalanabilir temiz IBAN üret”
Açıklama: Boşluksuz/büyük harf normalize edilmiş IBAN’ı kopyalamak için
Varsayılanlar
Ülke: TR
Maskeleme: Kapalı
Normalize edilmiş çıktı: Açık (kopyala butonu ile)
Format/birim
Girdi: Metin (harf + rakam)
Çıktı: Geçerli/Geçersiz, açıklama ve normalize IBAN
4) Hesaplama Mantığı (teknik/formülsüz anlat)
Formül/hesap adımı vermeden, kullanıcı dilinde. 

Kullanıcı IBAN’ı girer; sistem önce metni temizler: boşluk, tire gibi ayırıcıları kaldırır; harfleri büyük harfe çevirir.
Ardından şu kontroller sırayla yapılır:
Ülke kodu uygun mu? (TR seçildiyse TR ile başlamalı)
Uzunluk doğru mu? (TR IBAN sabit karakter uzunluğundadır)
Sadece izinli karakterler var mı? (A–Z ve 0–9; Türkçe karakter vb. olmamalı)
Son olarak IBAN’ın içindeki kontrol basamağı uluslararası standarda göre doğrulanır. Bu kontrol, yazım hatalarının büyük kısmını yakalar.
5) Çıktılar (Sonuç ekranı)
Ana sonuç
IBAN geçerli / IBAN geçersiz
Detay döküm
Normalize edilmiş IBAN (boşluksuz, büyük harf) + Kopyala butonu
Hata nedeni (geçersizse tek ve net bir neden)
Örn: “Ülke kodu TR değil”, “Uzunluk hatalı”, “Geçersiz karakter var”, “Kontrol basamağı doğrulanamadı”
(Opsiyonel) Formatlı gösterim: Okunabilir bloklara bölünmüş IBAN
Kısa açıklamalar / uyarılar
“Bu kontrol, IBAN’ın standart format ve kontrol basamağı açısından doğru olup olmadığını gösterir; hesabın gerçekten var olduğunu garanti etmez.”
“IBAN’ı paylaşmadan önce her zaman alıcı bilgilerini ayrıca doğrulayın.”
6) Örnekler (en az 2 senaryo)
Senaryo 1: Boşluklu girilen IBAN (Geçerli)
Kullanıcı girişi: TR12 3456 7890 1234 5678 9012 34
Sistem davranışı: Boşlukları kaldırır, büyük harfe çevirir, TR yapısını/uzunluğu/karakterleri ve kontrol basamağını doğrular.
Sonuç: Geçerli
Gösterim: TR123456789012345678901234 (kopyalanabilir)
Senaryo 2: Yanlış karakter (Geçersiz)
Kullanıcı girişi: TR12 3456 789O 1234 5678 9012 34 (burada “O” harfi var)
Sistem davranışı: İzinli karakter kontrolünde hata yakalar (rakam olması gereken yerde harf).
Sonuç: Geçersiz
Mesaj: “Geçersiz karakter tespit edildi (0/O karışmış olabilir).”
(Opsiyonel) Senaryo 3: Kontrol basamağı hatası (Geçersiz)
Kullanıcı girişi: Doğru görünen ama iki hanesi değiştirilmiş bir IBAN
Sistem davranışı: Format doğru olsa bile kontrol basamağı doğrulamasında başarısız olur.
Sonuç: Geçersiz
Mesaj: “Kontrol basamağı doğrulanamadı (IBAN’da yazım hatası olabilir).”
7) SSS (en az 8 soru)
IBAN validasyonu neyi garanti eder?
IBAN’ın yazım/format ve kontrol basamağı açısından doğru olduğunu. Hesabın gerçekten var olduğunu veya doğru kişiye ait olduğunu garanti etmez.
TR IBAN kaç karakter olmalı?
Türkiye IBAN’ı sabit uzunluktadır. (Sayfa bunu otomatik kontrol eder; kullanıcıya “uzunluk hatalı” şeklinde döner.)
Boşluklarla yazsam sorun olur mu?
Hayır. Sistem boşluk/tire gibi ayırıcıları temizleyerek doğrular.
Küçük harf yazarsam geçersiz mi sayılır?
Hayır. Sistem büyük harfe çevirip kontrol eder.
Neden “kontrol basamağı doğrulanamadı” diyor?
Genellikle bir veya iki karakter hatalı girilmiştir (rakam atlama, yer değiştirme, 0/O – 1/I karışması vb.).
IBAN doğruysa para kesin doğru hesaba gider mi?
Hayır. IBAN geçerli olsa bile yanlış alıcıya ait olabilir. Alıcı adı/hesap bilgilerini ayrıca teyit etmek gerekir.
Yurtdışı IBAN’ları da doğrular mı?
MVP’de TR odaklıdır. İstenirse “ülke otomatik algılama + ülkeye göre uzunluk/kurallar” genişletmesi yapılabilir.
Bu sistem IBAN’ımı kaydediyor mu?
Ürün politikası olarak ekranda net belirtilmeli: “Kayıt tutulmuyor” veya “loglanıyor” gibi. (Öneri: varsayılan olarak kaydetmemek.)
Mobil bankacılıkta kopyaladığım IBAN neden hata veriyor?
Bazı kopyalamalarda görünmez karakter, satır sonu veya noktalama gelebilir. Sistem temizlemeye çalışır; yine de hata varsa tekrar kopyalayın.
8) Dikkat/Edge-case Listesi (en az 10 madde)
Aşağıdakiler için kullanıcıya gösterilecek uyarı/davranışlar:

Baş/son boşluk ve satır sonu: “Girdi temizlendi, tekrar kontrol edildi” notu.
Tire, nokta, virgül gibi ayırıcılar: Otomatik temizle; “Sadece harf/rakam kullanılmalı” açıklaması.
Türkçe karakter (İ, Ş, Ğ) içerirse: “Geçersiz karakter” uyarısı.
0/O veya 1/I karışıklığı: “Benzer karakter hatası olabilir” ipucu.
TR yerine başka ülke kodu: TR modundaysa “Ülke kodu TR olmalı” uyarısı; otomatik modda ülkeye göre devam.
Çok kısa/çok uzun IBAN: “Karakter sayısı hatalı” uyarısı (beklenen uzunluğu belirt).
Sadece rakam girilmesi: “IBAN ülke kodu harflerle başlamalı” uyarısı.
Tamamı büyük harf olmayan giriş: Hata verme yerine normalize et; “Büyük harfe çevrildi” bilgisi.
Görünmez karakterler (zero-width space vb.): Temizle; “Görünmez karakterler kaldırıldı” bilgisi.
Kopyala-yapıştırda birden fazla IBAN gelmesi: “Lütfen tek bir IBAN girin” uyarısı.
Maskeleme açıkken kopyalama: Kopyalanan değer her zaman tam normalize IBAN olmalı; ekranda maske gösterildiğine dair net ibare.
Gizlilik endişesi: Sonuç altında “IBAN tarayıcıda işlenir / sunucuya gönderilmez” gibi politika metni (ürün kararına göre) göster.