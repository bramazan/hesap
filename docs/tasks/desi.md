DESİ HESAPLAMA FORMÜLÜ (KARGO HACİMSEL AĞIRLIK)
Tanım
Desi, kargolarda paketin “hacimsel ağırlığını” ifade eder. Kargo firmaları ücretlendirmede genellikle “gerçek ağırlık (kg)” ile “desi (hacimsel ağırlık)” arasında yüksek olanı esas alır.

Girdiler
En (cm)
Boy (cm)
Yükseklik (cm)
Temel formül (Türkiye’de yaygın)
Hacim (cm³) = En × Boy × Yükseklik
Desi = Hacim (cm³) / 3000
Yani:
Desi = (En × Boy × Yükseklik) / 3000

Örnek
En: 30 cm, Boy: 20 cm, Yükseklik: 10 cm
Hacim = 30 × 20 × 10 = 6000 cm³
Desi = 6000 / 3000 = 2 desi

Notlar (sayfada açıklama olarak)
Bazı kargo firmaları 3000 yerine farklı bir “bölüm katsayısı” kullanabilir (ör. 4000 veya 5000). Bu nedenle hesaplayıcıda “katsayı” alanını (varsayılan 3000) opsiyonel sunmak faydalıdır.
Ücretlendirme çoğu zaman: Ücretlendirilen ağırlık = max(gerçek ağırlık (kg), desi) şeklinde yapılır.
Desi genellikle ondalıklı çıkabilir; firmalar yukarı yuvarlama (ceil) uygulayabilir. Hesaplayıcıda “yuvarlama yöntemi” (aşağı yuvarla / en yakın / yukarı yuvarla) opsiyonel verilebilir.