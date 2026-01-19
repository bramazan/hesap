# PRODUCT VISION — TR "Hesaplayıcı" SaaS (Ücretsiz Araç Platformu)

**Version:** v0.1
**Owner:** (sen)
**Date:** 2026-01-18

---

## 1. Vizyon

Türkiye'de herkesin hızlıca kullanabildiği, modern/minimal tasarımlı, güvenilir ve çok hızlı çalışan **"hesaplama araçları platformu"** oluşturmak. Her hesaplama için ayrı, arama niyetine tam uyan bir sayfa üretmek ve bu sayfalarla organik trafiği kendi markana çekmek.

---

## 2. Hedef

- **Kısa vadede:** 20–50 kaliteli hesaplama sayfası + güçlü site altyapısı + ölçümleme
- **Orta vadede:** 200–500 sayfaya ölçeklenebilir sistem (programatik + editoryal kalite)
- **Uzun vadede:** Aylık 1M kullanıcı (yüksek niyetli dikeylerde ilk sıralar + geniş topic cluster ağı)

---

## 3. Hedef Kullanıcılar

- "Hemen hesaplayıp sonucu görmek isteyen" genel kullanıcı (mobil ağırlıklı)
- İş sahipleri / e-ticaret satıcıları (kâr, komisyon, fiyatlandırma, kargo/desi)
- Çalışanlar (maaş, kıdem/ihbar, vergi)
- Öğrenciler / gündelik ihtiyaç (yüzde, ortalama, birim dönüşümleri vb.)

---

## 4. Kullanıcı Problemleri

- Mevcut sitelerde aşırı reklam, dağınık arayüz, yavaşlık
- Formül/varsayım belirsizliği ve güven problemi
- Mobilde zor kullanım
- Aynı kategori içinde ilgili hesapların birbirine bağlanmaması (kullanıcı "bir sonraki" hesabı bulamıyor)

---

## 5. Çözüm (Ürün Yaklaşımı)

- Minimal ve hızlı UI + net açıklama + örnek hesap + SSS
- Her hesaplama için ayrı URL (SEO odaklı)
- Kategori (topic cluster) mimarisi ve güçlü internal linking
- Programatik üretim (DB tabanlı) ama "kopya sayfa" gibi görünmeyecek özgün içerik parçalarıyla

---

## 6. Temel Farklılaştırıcılar

- **Hız:** Core Web Vitals odaklı, minimal JS
- **Güven:** formül/varsayım şeffaflığı, güncelleme tarihi, kaynak notları
- **"Sadece sonuç" değil:** senaryo/karşılaştırma, tablolar, gerekirse rapor
- **İlgili hesaplayıcı önerileriyle** kullanıcıyı sitede tutma (oturum derinliği)

---

## 7. SEO ve İçerik Stratejisi

### 7.1 Sayfa Şablonu (her hesaplamada standart)

- H1 + 1–2 cümle "ne işe yarar"
- Input alanları + anında sonuç (kullanıcıyı bekletme)
- "Nasıl hesaplanır?" kısa açıklama (formül/varsayım)
- 1–3 adet örnek senaryo
- SSS (3–8 soru)
- İlgili hesaplayıcılar (5–10 internal link)
- (Opsiyon) tablo/grafik, karşılaştırma modları

### 7.2 Topic Cluster ve Internal Linking

- **URL yapısı:** `/[kategori]/[hesaplama-slug]`
- **Her kategori sayfası:** "en popüler hesaplamalar", rehber içerik, internal link hub
- **Her hesap sayfası:** aynı kategorideki "sonraki adım" hesaplara link

### 7.3 Programatik SEO (kalite şartı)

- DB'den sayfa üretimi (title/meta/FAQ/örnekler dahil)
- Her sayfada en az:
  - benzersiz başlık + meta açıklama
  - benzersiz örnek(ler)
  - SSS
  - kategori içi linkleme

### 7.4 AI Özetleri / Zero-click gerçeğine uyum

Salt "tek satır cevap" üretmek yerine; AI'ın doğrudan kopyalayamayacağı değer sun:
- Karşılaştırma tabloları, fiyat/performans tabloları, kullanım rehberi formatı
- Sayfada FAQ bölümü (AI tabanlı aramanın yanıtı özetlemesine katkı sağlar)
- KPI'larda yalnızca sıralama/traffic değil:
  - AI özetlerindeki görünürlük, zero-click oranı, marka etkisi gibi metrikleri takip et

> **Kaynak:** [analyticahouse.com](https://analyticahouse.com)

---

## 8. Gelir Modeli (şimdilik ikincil, ama mimariye yedir)

- **İlk aşama:** trafik büyütme (tamamen ücretsiz)
- **Sonra:** reklam (display/native) + sponsor alanları
- **Daha güçlü opsiyonlar (ileride):**
  - lead/affiliate akışları (hesap sonucu → "teklif al")
  - freemium: PDF export, kaydetme, paylaşılabilir link, geçmiş, reklamsız, API
  - white-label widget / B2B lisans

---

## 9. Ürün Kapsamı (MVP)

- Kategori yapısı + 20–30 hesaplayıcı
- Hesaplayıcı sayfası şablonu (yukarıdaki bileşenlerle)
- **Yönetim paneli (basit):**
  - hesaplayıcı oluştur/düzenle (slug, başlık, açıklama)
  - alanlar (inputlar)
  - formül tanımı
  - SSS + örnek senaryolar
- Site içi arama + kategori sayfaları
- **Analytics (GA4 + Search Console) + temel event'ler:**
  - hesapla tıklaması, sonuç görüntüleme, örnek kullanım, paylaşma

---

## 10. Teknik Mimari Önerisi (Next.js + API + DB)

### 10.1 Frontend

- **Next.js (App Router)**
- SSG/ISR ile sayfaları statik gibi hızlı sun (ölçeklenebilirlik + SEO)
- Hesaplama mümkünse client-side (hız), kritik parçalar minimal JS

### 10.2 Backend / API

API'yi "hesapla" için zorunlu kılma; ama şunlar için kullan:
- formül/parametre konfigürasyonu (tek merkez)
- rate limiting / abuse önleme
- paylaşılabilir link, kaydetme, raporlama
- PDF oluşturma (server-side)

### 10.3 Database

**Postgres (Supabase/Neon gibi)**

**Örnek tablolar:**
```sql
calculators(id, slug, title, category, description, seo_title, seo_description, updated_at, status)
fields(id, calculator_id, key, label, type, unit, min, max, default, required)
formulas(id, calculator_id, definition_json)
faqs(id, calculator_id, question, answer)
examples(id, calculator_id, input_json, output_json, note)
```

**Opsiyonel:**
```sql
share_links(id, calculator_id, input_json, created_at)
saved_scenarios(user_id, calculator_id, input_json, name, created_at)
```

### 10.4 Formül Güvenliği

- **"eval" kullanma**
- JSONLogic benzeri güvenli expression engine tercih et (formüller DB'de taşınabilir olsun)

### 10.5 Operasyon / SEO Araçları

- Teknik SEO taraması ve hataları yakalamak için **Screaming Frog** gibi araçlar
- Anahtar kelime ve rekabet araştırması için **Ahrefs** gibi araçlar

> **Kaynak:** [roible.com](https://roible.com)

---

## 11. Performans ve Kalite Kriterleri

- Mobil öncelikli UX
- Çok hızlı ilk yükleme (SSR/SSG + düşük JS)
- Input değişince hızlı hesaplama (debounce, doğru state yönetimi)
- Erişilebilirlik (label, klavye ile kullanım)
- Güven sinyalleri: "son güncelleme", "varsayımlar", "iletişim"

---

## 12. Ölçümleme (Başarı Metrikleri)

### SEO:
- indexlenen sayfa sayısı, impressions, CTR, top queries (GSC)
- kategori bazında büyüme (cluster performansı)

### Ürün:
- hesaplama başına etkileşim (result view / session)
- geri dönüş oranı, sayfa başına oturum süresi

### GEO/AI etkisi:
- AI özet görünürlüğü ve zero-click etkisi gibi metrikleri ayrıca izleme yaklaşımı

> **Kaynak:** [analyticahouse.com](https://analyticahouse.com)

---

## 13. Riskler ve Önlemler

- **Kopya/benzer sayfa riski** → her sayfada özgün örnek + SSS + açıklama standardı
- **AI/zero-click** → interaktif değer, tablo/karşılaştırma, FAQ
- **Rekabet (mevcut büyük siteler)** → önce dar bir dikeyde "en iyi" olmak, sonra genişlemek
- **Spam/abuse (bot)** → rate limit, caching, WAF

> **Kaynak:** [analyticahouse.com](https://analyticahouse.com)

---

## 14. Yol Haritası (Öneri)

- **Phase 0 (1–2 hafta):** Dikey seçimi + ilk 20 hesaplayıcı listesi + bilgi mimarisi + UI kit
- **Phase 1 (2–6 hafta):** MVP (Next.js + DB tabanlı şablon + 20–30 sayfa + indexleme)
- **Phase 2 (6–12 hafta):** Cluster genişletme (50–150 sayfa), internal link otomasyonu, daha iyi örnek/SSS
- **Phase 3 (3–9 ay):** Ölçek (200–500+), "karşılaştırma modu", paylaşım, PDF, kaydetme
- **Phase 4 (9–18 ay):** Gelir katmanı (reklam + sponsor + affiliate/lead testleri)

---

## 15. Net Kararlar (şimdiden)

- ✅ Ücretsiz hesaplayıcılar (paywall yok)
- ✅ Her hesaplayıcı ayrı sayfa + kategori hub'ları
- ✅ Programatik üretim var ama kalite standardı zorunlu
- ✅ Performans ve minimal tasarım "özellik" değil, ürünün çekirdeği