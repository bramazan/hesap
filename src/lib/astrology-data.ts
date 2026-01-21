// Astroloji Temel Verileri ve Hesaplama Fonksiyonları
// Not: Astroloji bilimsel değildir, bu araç eğlence ve kişisel ilgi amaçlıdır.

// Burç bilgileri
export interface ZodiacSign {
    id: number;
    name: string;
    symbol: string;
    element: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
    modality: 'Öncü' | 'Sabit' | 'Değişken';
    rulingPlanet: string;
    startDate: { month: number; day: number };
    endDate: { month: number; day: number };
    traits: string[];
}

// 12 Burç verisi
export const ZODIAC_SIGNS: ZodiacSign[] = [
    {
        id: 1,
        name: 'Koç',
        symbol: '♈',
        element: 'Ateş',
        modality: 'Öncü',
        rulingPlanet: 'Mars',
        startDate: { month: 3, day: 21 },
        endDate: { month: 4, day: 19 },
        traits: ['Cesur', 'Enerjik', 'Girişimci', 'Lider ruhlu'],
    },
    {
        id: 2,
        name: 'Boğa',
        symbol: '♉',
        element: 'Toprak',
        modality: 'Sabit',
        rulingPlanet: 'Venüs',
        startDate: { month: 4, day: 20 },
        endDate: { month: 5, day: 20 },
        traits: ['Kararlı', 'Güvenilir', 'Sabırlı', 'Pratik'],
    },
    {
        id: 3,
        name: 'İkizler',
        symbol: '♊',
        element: 'Hava',
        modality: 'Değişken',
        rulingPlanet: 'Merkür',
        startDate: { month: 5, day: 21 },
        endDate: { month: 6, day: 20 },
        traits: ['Meraklı', 'Uyumlu', 'İletişimci', 'Zeki'],
    },
    {
        id: 4,
        name: 'Yengeç',
        symbol: '♋',
        element: 'Su',
        modality: 'Öncü',
        rulingPlanet: 'Ay',
        startDate: { month: 6, day: 21 },
        endDate: { month: 7, day: 22 },
        traits: ['Duygusal', 'Koruyucu', 'Sezgisel', 'Ailesever'],
    },
    {
        id: 5,
        name: 'Aslan',
        symbol: '♌',
        element: 'Ateş',
        modality: 'Sabit',
        rulingPlanet: 'Güneş',
        startDate: { month: 7, day: 23 },
        endDate: { month: 8, day: 22 },
        traits: ['Yaratıcı', 'Kendinden emin', 'Cömert', 'Karizmatik'],
    },
    {
        id: 6,
        name: 'Başak',
        symbol: '♍',
        element: 'Toprak',
        modality: 'Değişken',
        rulingPlanet: 'Merkür',
        startDate: { month: 8, day: 23 },
        endDate: { month: 9, day: 22 },
        traits: ['Analitik', 'Detaycı', 'Çalışkan', 'Mükemmeliyetçi'],
    },
    {
        id: 7,
        name: 'Terazi',
        symbol: '♎',
        element: 'Hava',
        modality: 'Öncü',
        rulingPlanet: 'Venüs',
        startDate: { month: 9, day: 23 },
        endDate: { month: 10, day: 22 },
        traits: ['Diplomatik', 'Uyumlu', 'Adil', 'Sosyal'],
    },
    {
        id: 8,
        name: 'Akrep',
        symbol: '♏',
        element: 'Su',
        modality: 'Sabit',
        rulingPlanet: 'Plüton',
        startDate: { month: 10, day: 23 },
        endDate: { month: 11, day: 21 },
        traits: ['Tutkulu', 'Kararlı', 'Gizemli', 'Sadık'],
    },
    {
        id: 9,
        name: 'Yay',
        symbol: '♐',
        element: 'Ateş',
        modality: 'Değişken',
        rulingPlanet: 'Jüpiter',
        startDate: { month: 11, day: 22 },
        endDate: { month: 12, day: 21 },
        traits: ['Özgür ruhlu', 'İyimser', 'Maceracı', 'Filozof'],
    },
    {
        id: 10,
        name: 'Oğlak',
        symbol: '♑',
        element: 'Toprak',
        modality: 'Öncü',
        rulingPlanet: 'Satürn',
        startDate: { month: 12, day: 22 },
        endDate: { month: 1, day: 19 },
        traits: ['Disiplinli', 'Hırslı', 'Sorumlu', 'Geleneksel'],
    },
    {
        id: 11,
        name: 'Kova',
        symbol: '♒',
        element: 'Hava',
        modality: 'Sabit',
        rulingPlanet: 'Uranüs',
        startDate: { month: 1, day: 20 },
        endDate: { month: 2, day: 18 },
        traits: ['Yenilikçi', 'Bağımsız', 'İnsancıl', 'Orijinal'],
    },
    {
        id: 12,
        name: 'Balık',
        symbol: '♓',
        element: 'Su',
        modality: 'Değişken',
        rulingPlanet: 'Neptün',
        startDate: { month: 2, day: 19 },
        endDate: { month: 3, day: 20 },
        traits: ['Hayalperest', 'Empatik', 'Sanatsal', 'Sezgisel'],
    },
];

// Güneş burcunu hesapla
export function getSunSign(month: number, day: number): ZodiacSign {
    for (const sign of ZODIAC_SIGNS) {
        // Oğlak burcu için özel kontrol (yıl geçişi)
        if (sign.id === 10) {
            if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
                return sign;
            }
        } else {
            const startMonth = sign.startDate.month;
            const startDay = sign.startDate.day;
            const endMonth = sign.endDate.month;
            const endDay = sign.endDate.day;

            if (
                (month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay)
            ) {
                return sign;
            }
        }
    }
    // Varsayılan olarak Koç döndür (bu noktaya ulaşmamalı)
    return ZODIAC_SIGNS[0];
}

// Basitleştirilmiş yükselen burç hesaplama
// Not: Gerçek hesaplama için swiss ephemeris gerekir, bu basitleştirilmiş bir yaklaşımdır
export function getAscendant(
    birthDate: Date,
    birthHour: number,
    birthMinute: number,
    latitude: number
): ZodiacSign {
    // Basitleştirilmiş hesaplama: Güneş burcundan ve saatten tahmin
    // Her 2 saatte bir burç değişir (24 saat / 12 burç = 2 saat)

    // Güneş doğuş saatini hesapla (basitleştirilmiş, ~6:00 olarak kabul)
    const sunriseHour = 6;

    // Saati decimal'e çevir
    const decimalHour = birthHour + birthMinute / 60;

    // Gece yarısından itibaren geçen saat
    const hoursFromMidnight = decimalHour;

    // Her 2 saatte bir burç değişir
    // Gece yarısında yükselen burç yaklaşık olarak güneş burcunun karşısındadır
    const sunSign = getSunSign(birthDate.getMonth() + 1, birthDate.getDate());
    const sunSignIndex = sunSign.id - 1;

    // Saat bazlı ofset hesapla (her 2 saatte 1 burç)
    const hourOffset = Math.floor(hoursFromMidnight / 2);

    // Yükselen burç = Güneş burcu + saat ofseti (mod 12)
    const ascendantIndex = (sunSignIndex + hourOffset) % 12;

    return ZODIAC_SIGNS[ascendantIndex];
}

// Basitleştirilmiş Ay burcu hesaplama
// Not: Ay her 2.5 günde bir burç değiştirir
export function getMoonSign(birthDate: Date): ZodiacSign {
    // Referans noktası: 1 Ocak 2000 gece yarısı, Ay Yengeç burcunda varsayılır
    const referenceDate = new Date(2000, 0, 1);
    const diffTime = Math.abs(birthDate.getTime() - referenceDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Ay yaklaşık 27.3 günde tüm burçları tamamlar
    const moonCycle = 27.3;
    const daysPerSign = moonCycle / 12;

    // Referans noktasından itibaren geçen günlere göre burç hesapla
    const cyclePosition = (diffDays % moonCycle) / daysPerSign;
    const moonSignIndex = Math.floor(cyclePosition) % 12;

    // Referans burcu (Yengeç = index 3) + pozisyon
    const adjustedIndex = (3 + moonSignIndex) % 12;

    return ZODIAC_SIGNS[adjustedIndex];
}

// Element dağılımını hesapla
export function getElementDistribution(signs: ZodiacSign[]): Record<string, number> {
    const distribution = { Ateş: 0, Toprak: 0, Hava: 0, Su: 0 };
    signs.forEach(sign => {
        distribution[sign.element]++;
    });
    return distribution;
}

// Modalite dağılımını hesapla
export function getModalityDistribution(signs: ZodiacSign[]): Record<string, number> {
    const distribution = { Öncü: 0, Sabit: 0, Değişken: 0 };
    signs.forEach(sign => {
        distribution[sign.modality]++;
    });
    return distribution;
}

// Kişilik özeti oluştur
export function getPersonalitySummary(
    sunSign: ZodiacSign,
    moonSign: ZodiacSign,
    ascendant: ZodiacSign | null
): string {
    let summary = `Güneş burcunuz ${sunSign.name} olarak, ${sunSign.traits.slice(0, 2).join(' ve ').toLowerCase()} özellikleriniz öne çıkar. `;
    summary += `Ay burcunuz ${moonSign.name} olduğundan, duygusal dünyada ${moonSign.traits[0].toLowerCase()} ve ${moonSign.traits[2].toLowerCase()} bir yaklaşım sergilersiniz. `;

    if (ascendant) {
        summary += `Yükselen burcunuz ${ascendant.name}, çevrenize ${ascendant.traits[0].toLowerCase()} ve ${ascendant.traits[1].toLowerCase()} bir izlenim bırakmanıza yardımcı olur.`;
    }

    return summary;
}

// Türkiye şehirleri (enlem/boylam verileri)
export const TURKEY_CITIES = [
    { name: 'Adana', latitude: 37.0, longitude: 35.3213 },
    { name: 'Adıyaman', latitude: 37.7648, longitude: 38.2786 },
    { name: 'Afyonkarahisar', latitude: 38.7507, longitude: 30.5567 },
    { name: 'Ağrı', latitude: 39.7191, longitude: 43.0503 },
    { name: 'Aksaray', latitude: 38.3687, longitude: 34.0370 },
    { name: 'Amasya', latitude: 40.6499, longitude: 35.8353 },
    { name: 'Ankara', latitude: 39.9334, longitude: 32.8597 },
    { name: 'Antalya', latitude: 36.8969, longitude: 30.7133 },
    { name: 'Ardahan', latitude: 41.1105, longitude: 42.7022 },
    { name: 'Artvin', latitude: 41.1828, longitude: 41.8183 },
    { name: 'Aydın', latitude: 37.8560, longitude: 27.8416 },
    { name: 'Balıkesir', latitude: 39.6484, longitude: 27.8826 },
    { name: 'Bartın', latitude: 41.6344, longitude: 32.3375 },
    { name: 'Batman', latitude: 37.8812, longitude: 41.1351 },
    { name: 'Bayburt', latitude: 40.2552, longitude: 40.2249 },
    { name: 'Bilecik', latitude: 40.0567, longitude: 30.0665 },
    { name: 'Bingöl', latitude: 38.8854, longitude: 40.4966 },
    { name: 'Bitlis', latitude: 38.4004, longitude: 42.1095 },
    { name: 'Bolu', latitude: 40.7391, longitude: 31.6089 },
    { name: 'Burdur', latitude: 37.7203, longitude: 30.2906 },
    { name: 'Bursa', latitude: 40.1885, longitude: 29.0610 },
    { name: 'Çanakkale', latitude: 40.1553, longitude: 26.4142 },
    { name: 'Çankırı', latitude: 40.6013, longitude: 33.6134 },
    { name: 'Çorum', latitude: 40.5506, longitude: 34.9556 },
    { name: 'Denizli', latitude: 37.7765, longitude: 29.0864 },
    { name: 'Diyarbakır', latitude: 37.9144, longitude: 40.2306 },
    { name: 'Düzce', latitude: 40.8438, longitude: 31.1565 },
    { name: 'Edirne', latitude: 41.6818, longitude: 26.5623 },
    { name: 'Elazığ', latitude: 38.6810, longitude: 39.2264 },
    { name: 'Erzincan', latitude: 39.7500, longitude: 39.5000 },
    { name: 'Erzurum', latitude: 39.9000, longitude: 41.2700 },
    { name: 'Eskişehir', latitude: 39.7767, longitude: 30.5206 },
    { name: 'Gaziantep', latitude: 37.0662, longitude: 37.3833 },
    { name: 'Giresun', latitude: 40.9128, longitude: 38.3895 },
    { name: 'Gümüşhane', latitude: 40.4386, longitude: 39.5086 },
    { name: 'Hakkari', latitude: 37.5833, longitude: 43.7333 },
    { name: 'Hatay', latitude: 36.4018, longitude: 36.3498 },
    { name: 'Iğdır', latitude: 39.9237, longitude: 44.0450 },
    { name: 'Isparta', latitude: 37.7648, longitude: 30.5566 },
    { name: 'İstanbul', latitude: 41.0082, longitude: 28.9784 },
    { name: 'İzmir', latitude: 38.4192, longitude: 27.1287 },
    { name: 'Kahramanmaraş', latitude: 37.5858, longitude: 36.9371 },
    { name: 'Karabük', latitude: 41.2061, longitude: 32.6204 },
    { name: 'Karaman', latitude: 37.1759, longitude: 33.2287 },
    { name: 'Kars', latitude: 40.6167, longitude: 43.1000 },
    { name: 'Kastamonu', latitude: 41.3887, longitude: 33.7827 },
    { name: 'Kayseri', latitude: 38.7312, longitude: 35.4787 },
    { name: 'Kırıkkale', latitude: 39.8468, longitude: 33.5153 },
    { name: 'Kırklareli', latitude: 41.7333, longitude: 27.2167 },
    { name: 'Kırşehir', latitude: 39.1425, longitude: 34.1709 },
    { name: 'Kilis', latitude: 36.7184, longitude: 37.1212 },
    { name: 'Kocaeli', latitude: 40.8533, longitude: 29.8815 },
    { name: 'Konya', latitude: 37.8746, longitude: 32.4932 },
    { name: 'Kütahya', latitude: 39.4167, longitude: 29.9833 },
    { name: 'Malatya', latitude: 38.3552, longitude: 38.3095 },
    { name: 'Manisa', latitude: 38.6191, longitude: 27.4289 },
    { name: 'Mardin', latitude: 37.3212, longitude: 40.7245 },
    { name: 'Mersin', latitude: 36.8121, longitude: 34.6415 },
    { name: 'Muğla', latitude: 37.2153, longitude: 28.3636 },
    { name: 'Muş', latitude: 38.9462, longitude: 41.7539 },
    { name: 'Nevşehir', latitude: 38.6939, longitude: 34.6857 },
    { name: 'Niğde', latitude: 37.9667, longitude: 34.6833 },
    { name: 'Ordu', latitude: 40.9839, longitude: 37.8764 },
    { name: 'Osmaniye', latitude: 37.0742, longitude: 36.2478 },
    { name: 'Rize', latitude: 41.0201, longitude: 40.5234 },
    { name: 'Sakarya', latitude: 40.6940, longitude: 30.4358 },
    { name: 'Samsun', latitude: 41.2867, longitude: 36.3300 },
    { name: 'Siirt', latitude: 37.9333, longitude: 41.9500 },
    { name: 'Sinop', latitude: 42.0231, longitude: 35.1531 },
    { name: 'Sivas', latitude: 39.7477, longitude: 37.0179 },
    { name: 'Şanlıurfa', latitude: 37.1591, longitude: 38.7969 },
    { name: 'Şırnak', latitude: 37.5164, longitude: 42.4611 },
    { name: 'Tekirdağ', latitude: 40.9833, longitude: 27.5167 },
    { name: 'Tokat', latitude: 40.3167, longitude: 36.5500 },
    { name: 'Trabzon', latitude: 41.0015, longitude: 39.7178 },
    { name: 'Tunceli', latitude: 39.1079, longitude: 39.5401 },
    { name: 'Uşak', latitude: 38.6823, longitude: 29.4082 },
    { name: 'Van', latitude: 38.4891, longitude: 43.4089 },
    { name: 'Yalova', latitude: 40.6500, longitude: 29.2667 },
    { name: 'Yozgat', latitude: 39.8181, longitude: 34.8147 },
    { name: 'Zonguldak', latitude: 41.4564, longitude: 31.7987 },
];

// Türkçe ay isimleri
export const MONTHS_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
