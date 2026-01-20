# Next.js Projesi AWS Amplify Deployment Rehberi

Bu dokümantasyon, Next.js projesinin AWS Amplify'a nasıl deploy edileceğini adım adım açıklamaktadır.

---

## 📋 Ön Gereksinimler

1. **AWS Hesabı**: Aktif bir AWS hesabınız olmalı
2. **GitHub/GitLab/Bitbucket Hesabı**: Kodunuzun bir Git repository'de barındırılması gerekiyor
3. **Node.js**: Local geliştirme için Node.js 18+ kurulu olmalı

---

## 🚀 Adım 1: Projeyi Git Repository'ye Yükle

### 1.1 Repository Oluşturma
- GitHub'da yeni bir repository oluşturun (public veya private)
- Repository adı: `kolayhesap` veya istediğiniz bir isim

### 1.2 Projeyi Push Etme

```bash
# Mevcut dizinde git başlat (zaten varsa atlayın)
git init

# Tüm dosyaları stage'e ekle
git add .

# İlk commit
git commit -m "Initial commit - Kolay Hesap uygulaması"

# Remote repository ekle (kendi URL'nizi kullanın)
git remote add origin https://github.com/KULLANICI_ADINIZ/kolayhesap.git

# Main branch'e push
git branch -M main
git push -u origin main
```

---

## 🛠️ Adım 2: AWS Amplify Konsol Kurulumu

### 2.1 AWS Amplify'a Giriş
1. [AWS Console](https://console.aws.amazon.com/) adresine gidin
2. Arama çubuğuna **"Amplify"** yazın ve AWS Amplify servisini seçin
3. **"Create new app"** veya **"Yeni uygulama oluştur"** butonuna tıklayın

### 2.2 Git Provider Bağlantısı
1. **"Host web app"** seçeneğini seçin
2. Git provider'ınızı seçin (GitHub, GitLab, Bitbucket, AWS CodeCommit)
3. **"Continue"** butonuna tıklayın
4. AWS'in repository'nize erişmesi için yetkilendirme yapın
5. Deploy etmek istediğiniz repository'yi seçin
6. Branch olarak `main` veya `master` seçin

---

## ⚙️ Adım 3: Build Ayarları

### 3.1 Amplify.yml Dosyası Oluşturma

Proje kök dizininde `amplify.yml` dosyası oluşturun:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 3.2 AWS Amplify Konsol Build Ayarları

Amplify otomatik olarak Next.js projesini algılayacaktır. Eğer manuel yapılandırma gerekirse:

| Ayar | Değer |
|------|-------|
| **Framework** | Next.js - SSR |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Node.js version** | 18 veya 20 |

### 3.3 Node.js Versiyonu Ayarlama

**Advanced Settings** bölümünde:
- **Build image**: `Amazon Linux:2023`
- **Node.js version**: `18` veya `20`

Veya `amplify.yml` dosyasında:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 20
        - nvm use 20
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

---

## 🌐 Adım 4: Environment Variables (Ortam Değişkenleri)

Eğer projenizde environment variable'lar varsa:

### 4.1 Amplify Konsolunda Ayarlama
1. Sol menüden **"Hosting" > "Environment variables"** seçin
2. **"Manage variables"** butonuna tıklayın
3. Değişkenlerinizi ekleyin:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://kolayhesap.co` |
| `NODE_ENV` | `production` |

### 4.2 .env Dosyası Oluşturma (Opsiyonel)

Local geliştirme için `.env.local` dosyası:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ **Önemli**: `.env.local` dosyasını **asla** Git'e commit etmeyin! `.gitignore` dosyasında olduğundan emin olun.

---

## 🚢 Adım 5: Deploy İşlemi

### 5.1 İlk Deploy
1. Tüm ayarları yaptıktan sonra **"Save and deploy"** butonuna tıklayın
2. Amplify otomatik olarak build sürecini başlatacaktır
3. Build süreci genellikle 3-7 dakika sürer

### 5.2 Build Durumunu Takip Etme
- **Provision**: Altyapı hazırlanıyor
- **Build**: Kod derleniyor
- **Deploy**: Uygulama yayınlanıyor
- **Verify**: Deployment doğrulanıyor

### 5.3 Build Loglarını İnceleme
Herhangi bir hata durumunda sol menüden **"Build"** seçeneğine tıklayarak detaylı logları inceleyebilirsiniz.

---

## 🔗 Adım 6: Custom Domain Ayarlama

### 6.1 Domain Ekleme
1. Sol menüden **"Hosting" > "Custom domains"** seçin
2. **"Add domain"** butonuna tıklayın
3. Domain adınızı girin: `kolayhesap.co`

### 6.2 DNS Ayarları

#### Route 53 Kullanıyorsanız:
- AWS otomatik olarak DNS kayıtlarını yapılandırır

#### Harici DNS Sağlayıcısı Kullanıyorsanız:
DNS sağlayıcınızda aşağıdaki kayıtları ekleyin:

| Kayıt Tipi | Host | Değer |
|------------|------|-------|
| CNAME | `www` | `d1234567890.cloudfront.net` (Amplify'dan alın) |
| ANAME/ALIAS | `@` | `d1234567890.cloudfront.net` |

### 6.3 SSL Sertifikası
AWS Amplify otomatik olarak ücretsiz SSL sertifikası sağlar. Domain doğrulaması için:
1. DNS kayıtlarına CNAME doğrulama kaydı ekleyin
2. Doğrulama genellikle 24-48 saat sürer

---

## 🔄 Adım 7: Otomatik Deploy (CI/CD)

### 7.1 Automatic Deployments
Varsayılan olarak, `main` branch'e yapılan her push otomatik deploy tetikler.

### 7.2 Branch Deploy Ayarları
1. **"Hosting" > "Build settings"** bölümüne gidin
2. **"Branch autodetection"** ayarını yapılandırın:
   - `main` → Production
   - `develop` → Staging (opsiyonel)

### 7.3 Preview Branches
PR'lar için otomatik preview environment oluşturmak için:
1. **"Previews"** sekmesine gidin
2. **"Enable previews"** seçeneğini aktifleştirin
3. GitHub'da PR açıldığında otomatik preview URL oluşturulur

---

## 📊 Adım 8: Monitoring ve Analytics

### 8.1 CloudWatch Logs
1. **"Hosting" > "Monitoring"** bölümüne gidin
2. Access logs ve build logs'ları görüntüleyin

### 8.2 Build Notifications
1. **"Build settings" > "Build notifications"** bölümüne gidin
2. Email veya Slack bildirimleri ayarlayın

---

## 🐛 Sorun Giderme

### Yaygın Hatalar ve Çözümleri

#### 1. Build Hatası: "npm ci failed"
```bash
# package-lock.json'ın güncel olduğundan emin olun
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

#### 2. Node.js Versiyon Hatası
`amplify.yml` dosyasına Node.js versiyonunu ekleyin (Adım 3.3'e bakın)

#### 3. Build Timeout
Build settings'de timeout süresini artırın (varsayılan: 30 dakika)

#### 4. Environment Variable Erişim Hatası
- `NEXT_PUBLIC_` prefix'i ile başlayan değişkenler client-side'da erişilebilir
- Diğer değişkenler sadece server-side'da erişilebilir

#### 5. 404 Hatası (Sayfa Bulunamadı)
Next.js SSR modunda çalıştığından, Amplify'ın "Platform" ayarının **"Web compute"** olduğundan emin olun.

---

## ✅ Deployment Kontrol Listesi

- [ ] Proje GitHub'a push edildi
- [ ] `amplify.yml` dosyası oluşturuldu
- [ ] AWS Amplify'da uygulama oluşturuldu
- [ ] Git repository bağlandı
- [ ] Environment variables ayarlandı
- [ ] Build başarıyla tamamlandı
- [ ] Custom domain eklendi
- [ ] SSL sertifikası aktif
- [ ] Otomatik deploy çalışıyor
- [ ] Uygulama canlıda test edildi

---

## 📚 Faydalı Linkler

- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [AWS Amplify Next.js SSR Support](https://docs.amplify.aws/nextjs/)

---

## 💡 İpuçları

1. **Staging Environment**: Production'dan önce `staging` branch'i oluşturup test edin
2. **Rollback**: Hatalı deploy durumunda önceki versiyona geri dönebilirsiniz
3. **Cache**: Build süresini kısaltmak için `node_modules` ve `.next/cache` önbelleğe alınır
4. **Cost**: AWS Free Tier kapsamında aylık 1000 build dakikası ücretsizdir

---

*Son güncelleme: Ocak 2026*
