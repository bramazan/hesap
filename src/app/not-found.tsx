import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sayfa Bulunamadı - Kolay Hesap",
    description: "Aradığınız sayfa bulunamadı. Ana sayfaya dönerek hesaplama araçlarımıza ulaşabilirsiniz.",
};

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                {/* 404 Number */}
                <div className="relative">
                    <span className="text-[180px] md:text-[220px] font-black text-gray-100 leading-none select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">🔍</span>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 -mt-8 mb-4">
                    Sayfa Bulunamadı
                </h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                    Endişelenmeyin, sizi doğru yere yönlendirelim!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-3.5 px-8 rounded-xl transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        href="/tum-hesaplamalar"
                        className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-8 rounded-xl transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Tüm Hesaplamalar
                    </Link>
                </div>

                {/* Popular Calculators */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                        Popüler Hesaplayıcılar
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link
                            href="/finans/kdv-hesaplama"
                            className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                        >
                            KDV Hesaplama
                        </Link>
                        <Link
                            href="/finans/maas-hesaplama"
                            className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                        >
                            Maaş Hesaplama
                        </Link>
                        <Link
                            href="/genel/yuzde-hesaplama"
                            className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                        >
                            Yüzde Hesaplama
                        </Link>
                        <Link
                            href="/finans/kredi-hesaplama"
                            className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                        >
                            Kredi Hesaplama
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
