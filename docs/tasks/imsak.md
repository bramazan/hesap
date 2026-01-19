Hesaplama Kimliği
Hesaplama adı: İl il “İftara ne kadar kaldı / Sahura ne kadar kaldı” (Ramazan geri sayım)
Hedef kitle: Bireysel kullanıcılar (oruç tutanlar), aileler; ikincil: yerel haber siteleri / belediye uygulamaları
Kullanıcı amacı:
Bulunduğu il için iftar vaktine kalan süreyi görmek
Bulunduğu il için imsak (sahurun bitişi) vaktine kalan süreyi görmek
Günün iftar/imsak saatini ve “bugün/yarın” bilgisini hızlıca öğrenmek
2) Kapsam (MVP sınırı)
Kapsanan senaryolar (madde madde)
İl seçimine göre bugünün:
İmsak (sahur bitişi) saati
İftar (akşam ezanı) saati
Her ikisi için kalan süre (geri sayım)
“Şu an”a göre durum:
İftara kaldı / iftar geçti (bir sonraki iftar)
Sahura kaldı / imsak geçti (bir sonraki imsak)
İl bazında listeleme (81 il) + arama
(Opsiyonel) İlçe seçimi (MVP’de kapalı; sonraki faz)
(Opsiyonel) Kullanıcının konumundan ili otomatik önerme (izin verilirse)
Hariç tutulanlar (madde madde)
İlçe/mahalle hassasiyetinde vakit (MVP’de sadece il merkezi)
Namaz vakitlerinin tamamı (sadece imsak + iftar; istenirse “akşam” vb. saatler eklenebilir)
Hicri gün/imsakiyenin tam metin PDF’i
Bildirim/hatırlatma (push/SMS) (sonraki faz)
Takvim entegrasyonu (iCal) (sonraki faz)
Varsayımlar
Vakitler güvenilir bir kaynaktan alınır (Türkiye’de en yaygın referans Diyanet İşleri Başkanlığı verileridir).
Türkiye saat dilimi UTC+3 kabul edilir; kullanıcı cihaz saati yanlışsa sonuç şaşabilir (uyarı gösterilir).
3) Girdiler (Kullanıcıdan istenecekler)
Zorunlu alanlar
İl seçimi
Açıklama: Vakitler il bazında hesaplanır/gösterilir
Örnek: İstanbul
Opsiyonel alanlar
Konumdan otomatik seç (izinli)
Açıklama: Cihaz konumuna göre il önerilir
Örnek: “Konumumu kullan”
Tarih seçimi (bugün / yarın / seç)
Açıklama: Varsayılan “bugün”; istenirse “yarın” veya belirli gün
Örnek: Bugün
Gösterim modu
Açıklama: “Sadece geri sayım” veya “geri sayım + saatler”
Örnek: Detaylı
12/24 saat formatı
Açıklama: Kullanıcı tercihine göre saat yazımı
Örnek: 24 saat
Varsayılanlar
İl: Konum izni yoksa son seçilen il, ilk girişte İstanbul gibi popüler il yerine “İl seçin” daha doğru olur.
Tarih: Bugün
Gösterim: Geri sayım + saat
Format/birim
Saat: HH:MM
Kalan süre: X saat Y dakika (isterse saniye gösterimi)
4) Hesaplama Mantığı (teknik/formülsüz anlat)
Formül/kod yok; kullanıcı diliyle. 

Sayfa, seçtiğiniz il ve tarih için iki temel vakti alır:
İmsak: Sahurun bittiği, orucun başladığı vakit
İftar: Akşam ezanıyla orucun açıldığı vakit
Sistem, cihazınızın “şu an” saatini bu vakitlerle karşılaştırır:
Şu an iftardan önceyse “İftara ne kadar kaldı” sayar.
İftar geçtiyse bir sonraki iftara kalan süreyi gösterir (genelde “yarın iftara…”).
Şu an imsaktan önceyse “Sahura ne kadar kaldı” (yani imsak vaktine) sayar.
İmsak geçtiyse bir sonraki imsaka kalan süreyi gösterir.
Aynı ekranda hem kalan süre hem de bugünkü net saatler (imsak/iftar) kullanıcıya sunulur.
5) Çıktılar (Sonuç ekranı)
Ana sonuç
İftara kalan süre (veya “İftar geçti, yarın iftara kalan süre”)
Sahura kalan süre (veya “İmsak geçti, yarın imsaka kalan süre”)
Detay döküm
Seçilen il ve tarih
Bugünün imsak saati
Bugünün iftar saati
(Opsiyonel) “Sonraki vakit” etiketi: Bugün / Yarın
(Opsiyonel) Günün diğer vakitleri linki: “Tüm vakitleri gör” (MVP’de basit bir liste olabilir)
Kullanıcıya gösterilecek kısa açıklamalar / uyarılar
“Vakitler Diyanet (veya seçilen veri kaynağı) verilerine göre gösterilir.”
“İl merkezine göre hesaplanır; ilçenize göre birkaç dakikalık fark olabilir.”
“Cihaz saatiniz yanlışsa geri sayım hatalı görünebilir.”
6) Örnekler (en az 2 senaryo)
Senaryo 1: İftardan önce (bugün)
İl: Ankara
Şu an: (örnek) 17:30
Bugünkü iftar: 18:45
Ekranda:
“İftara 1 saat 15 dakika kaldı”
“Bugün iftar: 18:45”
Sahur tarafında ise imsak geçmiş olabilir; geçtiyse “Yarın imsaka … kaldı” gösterilir.
Senaryo 2: İftardan sonra (bir sonraki iftara geri sayım)
İl: İzmir
Şu an: (örnek) 21:10
Bugünkü iftar: 19:05 (geçti)
Ekranda:
“İftar geçti. Yarın iftara 21 saat 55 dakika kaldı” (süre örnektir)
“Bugün iftar: 19:05 | Yarın iftar: (opsiyonel gösterim)”
(Opsiyonel) Senaryo 3: Sahur öncesi
İl: Bursa
Şu an: (örnek) 04:10
Bugünkü imsak: 05:32
Ekranda:
“Sahura 1 saat 22 dakika kaldı” (bu ifade aslında “imsaka kalan süre”; metinde netleştirilir)
“Bugün imsak: 05:32”
7) SSS (en az 8 soru)
“Sahura ne kadar kaldı” ne demek, imsak mı?
Geri sayım pratikte imsak vaktine (sahurun bitişine) göre yapılır. İsterseniz metinde “Sahur bitimine” olarak da gösterilebilir.
İftar vakti tam olarak hangi vakit?
Türkiye’de yaygın kullanımda iftar, akşam ezanı (akşam namazı vakti) ile başlar.
Vakitler nereden geliyor?
Sayfa, Türkiye için en yaygın referans olan Diyanet verileri (veya seçtiğiniz resmi kaynak) ile çalışır; kaynak ekran altında belirtilir.
İlçemde farklı çıkıyor, neden?
Bu sayfa il merkezi bazlıdır. İlçelere göre birkaç dakikalık fark normaldir. (İlçe desteği sonraki sürüm olabilir.)
Telefon saatim yanlışsa ne olur?
Geri sayım cihaz saatine göre çalıştığı için yanlış olabilir. Sayfa “cihaz saatini kontrol edin” uyarısı gösterebilir.
Yurt dışındayım, Türkiye ili seçince doğru mu?
Türkiye ili seçerseniz Türkiye vakitleri gösterilir; bulunduğunuz yerin vaktiyle karıştırmayın. (İleri sürümde ülke/şehir eklenebilir.)
Ramazan dışında da çalışır mı?
İmsak ve akşam vakitleri yıl boyu vardır; ancak sayfa Ramazan temalı tasarlanabilir. Ramazan dışında “Günlük vakitler” olarak devam edebilir.
Geri sayım saniye saniye mi güncellenir?
İster saniyelik ister dakikalık güncelleme gösterilebilir. Pil/tarayıcı performansı için genelde dakikalık yeterlidir.
“Bugün/Yarın” etiketi neye göre değişiyor?
Seçili vakit geçince sistem otomatik olarak bir sonraki günün vakti için geri sayım gösterir.
8) Dikkat/Edge-case Listesi (en az 10 madde)
Aşağıdakiler için kullanıcıya gösterilecek uyarı/davranışlar:

İl seçilmeden sayfa açılırsa: “Devam etmek için il seçin” boş durum ekranı.
Konum izni reddedilirse: “İsterseniz ili manuel seçin” yönlendirmesi; ısrarcı izin pop-up’ı yapılmamalı.
Cihaz saati ileri/geri ise: “Cihaz saatiniz doğru görünmüyor olabilir” uyarısı + “Saatimi kontrol edeceğim” CTA.
İnternet yoksa / veri alınamazsa: “Vakit verilerine ulaşılamadı; son güncellenen veriler gösteriliyor olabilir” veya “Tekrar deneyin” mesajı.
Kaynak veride ilgili gün eksikse: “Seçtiğiniz tarih için veri bulunamadı, bugünün verisi gösteriliyor” gibi net bilgilendirme.
Gece yarısı geçişi (23:59–00:01): Ekranda “tarih değişti” hissi için “Bugün/Yarın” etiketleri açık gösterilmeli.
İmsak ile sahur ifadesi kafa karıştırırsa: Metin seçeneği sun: “Sahur bitimine (İmsak)” şeklinde ikili gösterim.
Kullanıcı farklı il seçip geri sayımı açık bırakırsa: Üstte sabit “Seçili il: …” etiketi göstererek yanlış şehir riskini azalt.
İlçe farkı nedeniyle kullanıcı “yanlış” sanırsa: “İl merkezine göre ± birkaç dakika fark olabilir” uyarısını görünür yap.
Saat formatı beklentisi (12/24) karışırsa: Ayarlardan değiştirilebilir yap; ilk açılışta cihaz dil/saat tercihine uy.
Ramazan başlangıcı/bitimi günlerinde beklenti: “Bugün Ramazan’ın X. günü” gibi bilgi istenebilir; yoksa “Bu sayfa vakit gösterir, gün sayacı değildir” açıklaması.
Ekran görüntüsü paylaşımı: Paylaşım kartında il + tarih + kaynak bilgisini otomatik yaz (kullanıcının yanlış anlaşılmasını azaltır).