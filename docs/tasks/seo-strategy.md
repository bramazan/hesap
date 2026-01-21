# 🚀 kolayhesap.co SEO Strateji ve Analiz Raporu

> **Hedef:** "Hesaplama" anahtar kelimeleri için Google Türkiye'de 1. sırada yer almak
> **Analiz Tarihi:** 21 Ocak 2026
> **Domain:** kolayhesap.co

---

## 📊 Mevcut Durum Analizi

### ✅ Güçlü Yönler

| Alan | Durum | Detay |
|------|-------|-------|
| **Site Mimarisi** | ✅ Mükemmel | Kategori bazlı hiyerarşik yapı (finans/, genel/, e-ticaret/) |
| **Breadcrumb** | ✅ Mükemmel | Tüm sayfalarda Ana Sayfa > Kategori > Sayfa yapısı |
| **robots.txt** | ✅ Doğru | `/api/` ve `/private/` engellenmiş |
| **sitemap.xml** | ✅ Dinamik | Tüm hesaplayıcılar otomatik ekleniyor |
| **Canonical URL** | ✅ Mevcut | `https://kolayhesap.co/...` formatında |
| **Mobile-First** | ✅ Responsive | Tailwind CSS ile tam mobil uyumlu |
| **KVKK/Cookie** | ✅ Uyumlu | Cookie consent banner aktif |
| **Next.js SSR** | ✅ Performans | Server-side rendering ile hızlı yükleme |
| **Internal Linking** | ✅ İyi | "İlgili Hesaplayıcılar" bölümleri mevcut |
| **H1 Tag'lar** | ✅ Kullanıcı Dostu | Kısa ve anlaşılır başlıklar |

---

## 📋 Sayfa Bazlı İçerik Değerlendirmesi

Tüm sayfalar incelendi. Aşağıda mevcut içerik durumu ve öneriler yer almaktadır:

### ✅ İçerik Açısından Yeterli Sayfalar

Bu sayfalar hem "Nasıl Hesaplanır?" hem de "SSS" bölümlerine sahip:

| Sayfa | H1 | Nasıl Hesaplanır | SSS | Değerlendirme |
|-------|-----|-----------------|-----|---------------|
| **Emeklilik Hesaplama** | "Ne Zaman Emekli Olurum?" | ✅ Detaylı (4 madde) | ✅ 5 soru | **Mükemmel** |
| **Maaş Hesaplama** | - | ✅ Var | ✅ Var | **Mükemmel** |
| **KDV Hesaplama** | - | ✅ Var | ✅ Var | **İyi** |
| **Mevduat Faizi** | "Mevduat Faizi Hesapla" | ✅ Formül açık | ✅ 4 soru | **İyi** |
| **Yaş Hesaplama** | "Yaş Hesapla" | ✅ Kısa ama yeterli | ✅ 4 soru | **İyi** |
| **Desi Hesaplama** | "Desi Hesaplama" | ✅ Formül açık | ✅ 4 soru | **İyi** |
| **İmsak Hesaplama** | "İftar ve Sahur Sayacı" | - (gerekli değil) | ✅ 4 soru | **İyi** |

### ⚠️ İçerik Geliştirilebilir Sayfalar

| Sayfa | Eksiklik | Öneri |
|-------|----------|-------|
| **MTV Hesaplama** | SSS kısa (2 soru) | 2-3 soru daha eklenebilir |
| **Kredi Hesaplama** | İncelenmeli | SSS kontrolü gerekli |
| **Yüzde Hesaplama** | İncelenmeli | SSS kontrolü gerekli |

---

## 🎯 SEO Önerileri (Kullanıcı Deneyimini Bozmadan)

### 1. H1 Tag'lar Hakkında ✅ (Değişiklik Gerekmez)

Mevcut H1 tag'ları kullanıcı odaklı ve uygun:
- "Ne Zaman Emekli Olurum?" - Doğrudan soruya cevap
- "Yaş Hesapla" - Kısa ve net
- "İftar ve Sahur Sayacı" - Anlaşılır

**Sonuç:** H1'ler kısa kalabilir. SEO için `title` ve `description` meta tag'ları kullanılmalı.

### 2. Title ve Description Meta Tag'ları (Kritik)

Title tag'lar `<head>` içinde görünür ama H1'den bağımsız olabilir:

```tsx
// Örnek: Emeklilik sayfası için
export const metadata: Metadata = {
    title: "Emeklilik Hesaplama 2026 | Ne Zaman Emekli Olurum? | Kolay Hesap",
    description: "EYT dahil emeklilik tarihinizi hesaplayın. SSK, Bağ-Kur ve memurlar için prim günü, yaş şartı ve sigortalılık süresini anında öğrenin.",
    keywords: ["emeklilik hesaplama", "ne zaman emekli olurum", "eyt hesaplama", "sgk emeklilik"],
};
```

### 3. MTV Hesaplama SSS Genişletme (Önerilen)

Mevcut 2 soruya ek olarak şu sorular eklenebilir:

```typescript
const additionalFaqs = [
    {
        question: "MTV'yi nereden ödeyebilirim?",
        answer: "MTV ödemesi GİB (Gelir İdaresi Başkanlığı) internet sitesi, e-Devlet, banka şubeleri veya internet/mobil bankacılık üzerinden yapılabilir."
    },
    {
        question: "Yeni araçlarda MTV ne zaman başlar?",
        answer: "Yeni alınan araçların MTV'si, aracın tescil edildiği ay itibariyle başlar ve kalan aylar için orantılı olarak hesaplanır."
    },
    {
        question: "MTV ödenmezse ne olur?",
        answer: "MTV zamanında ödenmediğinde gecikme zammı uygulanır. Ayrıca araç satışı ve devir işlemleri MTV borcu kapatılmadan yapılamaz."
    }
];
```

### 4. JSON-LD Schema Ekleme (Orta Öncelik)

Mevcut yapıya schema eklemek için basit bir component:

```tsx
// src/components/seo/CalculatorSchema.tsx
export function CalculatorSchema({ 
    name, 
    description, 
    url 
}: { 
    name: string; 
    description: string; 
    url: string; 
}) {
    const data = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": name,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "url": url,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
        },
        "description": description,
        "inLanguage": "tr",
        "publisher": {
            "@type": "Organization",
            "name": "Kolay Hesap",
            "url": "https://kolayhesap.co"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
```

### 5. Open Graph Görselleri (Düşük Öncelik)

Sosyal medya paylaşımları için 1200x630px görseller oluşturulabilir.

---

## 📊 Rakip Analizi

### Türkiye'deki Ana Rakipler

| Rakip | Güçlü Yönleri | Zayıf Yönleri |
|-------|---------------|---------------|
| **Paraşüt** | Marka bilinirliği, muhasebe entegrasyonu | Karmaşık UI, yavaş |
| **Logo İşbaşı** | Güvenilir marka, detaylı içerik | Sadece finans odaklı |
| **Hesapkurdu.com** | SEO optimizasyonu, çok araç | Eski tasarım, reklam fazla |
| **seoaraclarim.com** | Çoklu araç sunumu | Düşük kalite, güvensiz görünüm |

### Kolay Hesap Avantajları

1. **Modern Tasarım** - Rakiplerin çoğu eski tasarıma sahip
2. **Hız** - Next.js ile rakiplerin çoğundan hızlı
3. **Mobil Deneyim** - En iyi mobil deneyimi
4. **Dinamik Tablolar** - Yıllık hesaplama tabloları benzersiz (kredi, maaş)
5. **FAQ Bölümleri** - Hemen her sayfada detaylı SSS

---

## ✅ Acil Yapılması Gerekenler

### Öncelik 1: Metadata Güncellemeleri (1-2 saat)

Her sayfa için `generateMetadata` veya `export const metadata` ekle/güncelle:

**MTV Hesaplama için örnek:**
```tsx
export const metadata: Metadata = {
    title: "MTV Hesaplama 2026 | Motorlu Taşıtlar Vergisi Hesapla",
    description: "2026 motorlu taşıtlar vergisi (MTV) tutarını anında hesaplayın. Otomobil, motosiklet ve ticari araçlar için güncel vergi tarifesi.",
    keywords: ["mtv hesaplama", "motorlu taşıtlar vergisi", "araç vergisi 2026", "mtv ne kadar"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/mtv-hesaplama",
    },
};
```

### Öncelik 2: MTV SSS Genişletme (30 dk)

Yukarıdaki 3 soruyu MTV sayfasına ekle.

### Öncelik 3: Schema Markup (2-3 saat)

Ana hesaplayıcı sayfalarına `WebApplication` schema ekle.

---

## 📋 Yapılmayacaklar (UX Bozar)

❌ H1 tag'ları uzun ve SEO keyword dolu yapmak  
❌ İçeriği gereksiz yere şişirmek  
❌ Kullanıcıyı ilgilendirmeyen teknik bilgiler eklemek  
❌ Sayfa yükleme hızını düşürecek görsel/script eklemek

---

## 📈 Başarı Metrikleri (KPI)

| Metrik | Başlangıç | 3 Ay Hedef | 6 Ay Hedef |
|--------|-----------|------------|------------|
| Organik Trafik | ? | +50% | +150% |
| Ortalama Pozisyon | ? | Top 10 | Top 3 |
| Core Web Vitals | ? | Tümü Yeşil | Tümü Yeşil |

---

## 🛠️ İzleme Araçları

- **Google Search Console** - Arama performansı
- **Google Analytics 4** - Kullanıcı analizi
- **Google Page Speed Insights** - Performans
- **Rich Results Test** - Schema doğrulama

---

## 📌 Sonuç

kolayhesap.co **teknik olarak güçlü** ve **kullanıcı deneyimi iyi** bir sitedir. 

SEO için yapılması gereken:
1. **Meta title ve description** optimizasyonu (H1'e dokunmadan)
2. **MTV sayfasına** 2-3 SSS daha ekleme
3. **Schema markup** ekleme
4. **Open Graph görselleri** oluşturma (opsiyonel)

**Tahmini süre:** 3-6 ay içinde ilk 5'e ulaşmak mümkün.

---

*Bu belge kolayhesap.co için kullanıcı deneyimini koruyarak hazırlanmış SEO stratejisidir.*
*Son güncelleme: 21 Ocak 2026*
