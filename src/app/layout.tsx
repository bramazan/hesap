import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Hesaplayıcı - Hızlı ve Kolay Online Hesaplama Araçları",
    template: "%s | Hesaplayıcı",
  },
  description:
    "Türkiye'nin en hızlı ve güvenilir online hesaplama araçları. KDV, maaş, kredi, yüzde ve daha fazlasını anında hesaplayın.",
  keywords: [
    "hesaplama",
    "hesaplayıcı",
    "online hesaplama",
    "KDV hesaplama",
    "maaş hesaplama",
    "yüzde hesaplama",
  ],
  authors: [{ name: "Hesaplayıcı" }],
  creator: "Hesaplayıcı",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Hesaplayıcı",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {/* Transparent Header - Blends with Hero */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-slate-50/90 to-transparent border-b border-white/20">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="font-semibold text-gray-800 tracking-tight">hesapla.io</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Tüm Araçlar
              </Link>
              <Link
                href="#"
                className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Pro ✨
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Brand */}
              <div>
                <Link href="/" className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">H</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">hesapla.io</span>
                </Link>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Hızlı ve güvenilir hesaplama araçları.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-3">Hesaplayıcılar</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/finans/kdv-hesaplama" className="text-gray-500 hover:text-gray-900">KDV Hesaplama</Link></li>
                  <li><Link href="/finans/maas-hesaplama" className="text-gray-500 hover:text-gray-900">Maaş Hesaplama</Link></li>
                  <li><Link href="/finans/kredi-hesaplama" className="text-gray-500 hover:text-gray-900">Kredi Hesaplama</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-3">Kategoriler</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/finans" className="text-gray-500 hover:text-gray-900">Finans</Link></li>
                  <li><Link href="/genel" className="text-gray-500 hover:text-gray-900">Genel</Link></li>
                  <li><Link href="/e-ticaret" className="text-gray-500 hover:text-gray-900">E-Ticaret</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-3">Yasal</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="#" className="text-gray-500 hover:text-gray-900">Gizlilik</Link></li>
                  <li><Link href="#" className="text-gray-500 hover:text-gray-900">Kullanım Şartları</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              © 2026 hesapla.io
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
