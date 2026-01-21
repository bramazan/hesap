import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { AnalyticsProvider } from "@/components/analytics-provider";

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
    default: "Kolay Hesap - Hızlı ve Kolay Online Hesaplama Araçları",
    template: "%s | Kolay Hesap",
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
  authors: [{ name: "Kolay Hesap" }],
  creator: "Kolay Hesap",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Kolay Hesap",
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
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Analytics Provider - Only tracks after cookie consent */}
        <Suspense fallback={null}>
          <AnalyticsProvider>
            <></>
          </AnalyticsProvider>
        </Suspense>
        {/* Transparent Header - Blends with Hero */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-slate-50/90 to-transparent border-b border-white/20">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white shadow-lg shadow-blue-900/5 border border-slate-100 flex flex-col items-center justify-center gap-1 overflow-hidden transition-transform group-hover:scale-105">
                <div className="w-5 h-1.5 bg-slate-300 rounded-full shadow-sm transform -rotate-12 translate-x-0.5" />
                <div className="w-5 h-1.5 bg-[#1152d4] rounded-full shadow-sm transform -rotate-12 -translate-x-0.5" />
              </div>
              <div className="flex items-baseline gap-[1px] font-sans text-xl tracking-tight">
                <span className="font-normal text-slate-700 dark:text-slate-200">kolay</span>
                <span className="font-bold text-slate-900 dark:text-white">hesap</span>
              </div>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span
                  className="px-5 py-2 bg-[#1152d4] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-600/20 inline-block"
                >
                  Pro ✨
                </span>
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Yakında
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-white dark:bg-[#101622] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-10">
              {/* Brand */}
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-[3px]">
                    <div className="w-4 h-1 bg-slate-300 rounded-full transform -rotate-12 translate-x-0.5" />
                    <div className="w-4 h-1 bg-[#1152d4] rounded-full transform -rotate-12 -translate-x-0.5" />
                  </div>
                  <div className="flex items-baseline gap-[1px] font-sans text-lg tracking-tight">
                    <span className="font-normal text-slate-700 dark:text-slate-200">kolay</span>
                    <span className="font-bold text-slate-900 dark:text-white">hesap</span>
                  </div>
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                  Modern ve hassas hesaplama araçları paketi. Finansal kararlarınızı güçlendirin.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-200 text-sm mb-3">Hesaplayıcılar</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/finans/kdv-hesaplama" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">KDV Hesaplama</Link></li>
                  <li><Link href="/finans/maas-hesaplama" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Maaş Hesaplama</Link></li>
                  <li><Link href="/finans/kredi-hesaplama" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Kredi Hesaplama</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-200 text-sm mb-3">Kategoriler</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/tum-hesaplamalar?category=finans" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Finans</Link></li>
                  <li><Link href="/tum-hesaplamalar?category=genel" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Genel</Link></li>
                  <li><Link href="/tum-hesaplamalar?category=e-ticaret" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">E-Ticaret</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-200 text-sm mb-3">Kurumsal</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/hakkimizda" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Hakkımızda</Link></li>
                  <li><Link href="/iletisim" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">İletişim</Link></li>
                  <li><Link href="/gizlilik" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Gizlilik</Link></li>
                  <li><Link href="/kullanim-sartlari" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Kullanım Şartları</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-500">
              © 2026 kolayhesap.co
            </div>
          </div>
        </footer>

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
