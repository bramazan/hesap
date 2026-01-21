"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    TUFE_INDEX,
    MONTHS_TR,
    getAvailableYears,
    getAvailableMonths,
    getIndexValue,
    getLatestPeriod,
    formatPeriod,
    monthsBetween,
} from "@/lib/tufe-data";

// Format number with Turkish locale
const formatCurrency = (num: number) => {
    if (!isFinite(num) || isNaN(num)) return "0,00";
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat("tr-TR").format(num);
};

const formatPercent = (num: number) => {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

const faqItems = [
    {
        question: "Enflasyon hesaplama nasıl yapılır?",
        answer:
            "Enflasyon hesaplaması, TÜİK tarafından yayımlanan TÜFE (Tüketici Fiyat Endeksi) değerleri kullanılarak yapılır. Başlangıç ve bitiş tarihlerindeki endeks değerlerinin oranı, paranın satın alma gücündeki değişimi gösterir.",
    },
    {
        question: "TÜFE endeksi nedir?",
        answer:
            "TÜFE (Tüketici Fiyat Endeksi), tüketicilerin satın aldığı mal ve hizmetlerin fiyat değişimlerini ölçen bir göstergedir. TÜİK tarafından aylık olarak hesaplanır ve 2003=100 bazlı olarak yayımlanır.",
    },
    {
        question: "Yıllıklandırılmış enflasyon (CAGR) nedir?",
        answer:
            "CAGR (Yıllık Bileşik Büyüme Oranı), belirli bir dönemdeki toplam enflasyonun yıllık ortalamaya dönüştürülmüş halidir. Farklı uzunluktaki dönemleri karşılaştırmak için kullanılır.",
    },
    {
        question: "Satın alma gücü kaybı ne demek?",
        answer:
            "Satın alma gücü kaybı, enflasyon nedeniyle paranızın değer kaybetmesini ifade eder. Örneğin, 10 yıl önce 100 TL ile alabildiğiniz ürünler için bugün çok daha fazla ödemeniz gerekmesi.",
    },
];

export default function EnflasyonHesaplama() {
    const [amountInput, setAmountInput] = useState("10.000");

    const latestPeriod = getLatestPeriod();
    const [latestYear, latestMonth] = latestPeriod.split("-").map(Number);

    const [startYear, setStartYear] = useState(2013);
    const [startMonth, setStartMonth] = useState(1);
    const [endYear, setEndYear] = useState(latestYear);
    const [endMonth, setEndMonth] = useState(latestMonth);

    const years = getAvailableYears();

    // Parse amount safely
    const amount = parseInt(amountInput.replace(/\./g, "").replace(/,/g, "")) || 0;

    // Build periods
    const startPeriod = `${startYear}-${String(startMonth).padStart(2, "0")}`;
    const endPeriod = `${endYear}-${String(endMonth).padStart(2, "0")}`;

    // Get index values
    const startIndex = getIndexValue(startPeriod);
    const endIndex = getIndexValue(endPeriod);

    // Calculate results
    const results = useMemo(() => {
        if (!startIndex || !endIndex || amount <= 0) {
            return null;
        }

        const ratio = endIndex / startIndex;
        const updatedValue = amount * ratio;
        const cumulativeInflation = (ratio - 1) * 100;

        const months = monthsBetween(startPeriod, endPeriod);
        const cagr = months > 0 ? (Math.pow(ratio, 12 / months) - 1) * 100 : 0;

        // Satın alma gücü: 1 TL'nin bugünkü değeri
        const purchasingPower = 1 / ratio;

        return {
            updatedValue,
            cumulativeInflation,
            cagr,
            purchasingPower,
            months,
            ratio,
        };
    }, [startIndex, endIndex, amount, startPeriod, endPeriod]);

    // Get available months for each year
    const startMonths = getAvailableMonths(startYear);
    const endMonths = getAvailableMonths(endYear);

    // Ensure valid month selection
    const handleStartYearChange = (year: number) => {
        setStartYear(year);
        const availableMonths = getAvailableMonths(year);
        if (!availableMonths.includes(startMonth)) {
            setStartMonth(availableMonths[0] || 1);
        }
    };

    const handleEndYearChange = (year: number) => {
        setEndYear(year);
        const availableMonths = getAvailableMonths(year);
        if (!availableMonths.includes(endMonth)) {
            setEndMonth(availableMonths[availableMonths.length - 1] || 12);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 pt-10 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Page Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href="/" className="hover:text-blue-600 transition-colors">
                                    Ana Sayfa
                                </Link>
                                <span>/</span>
                                <Link href="/tum-hesaplamalar?category=finans" className="hover:text-blue-600 transition-colors">
                                    Finans
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800">Enflasyon Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Enflasyon Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                TÜİK TÜFE endeksine göre paranızın güncel değerini öğrenin.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Amount */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Tutar
                                    </span>
                                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">
                                        TRY
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-medium">₺</span>
                                    </div>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={amountInput}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[\d.,]*$/.test(val)) {
                                                setAmountInput(val);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (amount > 0) {
                                                setAmountInput(formatNumber(amount));
                                            }
                                        }}
                                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="1000"
                                        max="10000000"
                                        step="1000"
                                        value={Math.min(Math.max(amount, 1000), 10000000)}
                                        onChange={(e) => setAmountInput(formatNumber(parseInt(e.target.value)))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-gray-400">
                                        <span>1.000 ₺</span>
                                        <span>10.000.000 ₺</span>
                                    </div>
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Başlangıç Tarihi
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={startMonth}
                                        onChange={(e) => setStartMonth(parseInt(e.target.value))}
                                        className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    >
                                        {startMonths.map((m) => (
                                            <option key={m} value={m}>
                                                {MONTHS_TR[m - 1]}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={startYear}
                                        onChange={(e) => handleStartYearChange(parseInt(e.target.value))}
                                        className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Bitiş Tarihi
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={endMonth}
                                        onChange={(e) => setEndMonth(parseInt(e.target.value))}
                                        className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    >
                                        {endMonths.map((m) => (
                                            <option key={m} value={m}>
                                                {MONTHS_TR[m - 1]}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={endYear}
                                        onChange={(e) => handleEndYearChange(parseInt(e.target.value))}
                                        className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Paranın güncel değeri, <strong>TÜİK TÜFE endeksi</strong> kullanılarak hesaplanır.
                                    Başlangıç ve bitiş tarihindeki endeks değerleri oranlanarak paranın satın alma gücündeki değişim bulunur.
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm space-y-2">
                                    <div>Güncel Değer = Tutar × (Endeks₂ / Endeks₁)</div>
                                    <div>Kümülatif Enflasyon = ((Endeks₂ / Endeks₁) - 1) × 100</div>
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Endeks₁</span>
                                        <span>Başlangıç tarihindeki TÜFE değeri</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Endeks₂</span>
                                        <span>Bitiş tarihindeki TÜFE değeri</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <details
                                        key={index}
                                        className="group bg-gray-50 rounded-xl overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between p-4 cursor-pointer text-gray-900 font-medium hover:bg-gray-100 transition-colors">
                                            {item.question}
                                            <svg
                                                className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                                            {item.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-8">
                        {/* Floating Result Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-6 transition-all hover:-translate-y-1 duration-500">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Hesaplama Sonucu</h2>
                                <span className="text-xs text-gray-400">TÜFE Bazlı</span>
                            </div>

                            {/* Main Result */}
                            <div className="text-center space-y-1 py-2">
                                <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                    Güncel Değer
                                </p>
                                <div className="flex items-baseline justify-center gap-1 text-gray-900">
                                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                        ₺{results ? formatCurrency(results.updatedValue).split(",")[0] : "0"}
                                    </span>
                                    <span className="text-xl font-semibold text-gray-400">
                                        ,{results ? formatCurrency(results.updatedValue).split(",")[1] : "00"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    {formatPeriod(startPeriod)} → {formatPeriod(endPeriod)}
                                </p>
                            </div>

                            {/* Inflation Indicator */}
                            {results && (
                                <div className="flex items-center justify-center gap-4 py-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-red-500">
                                            %{formatPercent(results.cumulativeInflation)}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                                            Kümülatif Enflasyon
                                        </div>
                                    </div>
                                    <div className="w-px h-12 bg-gray-200" />
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-500">
                                            %{formatPercent(results.cagr)}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                                            Yıllık Ortalama
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Başlangıç Tutarı</span>
                                    <span className="font-bold text-gray-900">₺{formatNumber(amount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Değer Artışı</span>
                                    <span className="font-bold text-green-500">
                                        +₺{results ? formatCurrency(results.updatedValue - amount) : "0,00"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Süre</span>
                                    <span className="font-bold text-gray-900">
                                        {results ? `${Math.floor(results.months / 12)} yıl ${results.months % 12} ay` : "0 ay"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">Satın Alma Gücü</span>
                                    <span className="font-bold text-purple-500">
                                        1 TL = {results ? formatCurrency(results.purchasingPower) : "1,00"} TL
                                    </span>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                                <p>
                                    <strong>{formatPeriod(startPeriod)}</strong>&apos;daki{" "}
                                    <strong>₺{formatNumber(amount)}</strong>, bugünkü satın alma gücüyle{" "}
                                    <strong>₺{results ? formatCurrency(results.updatedValue) : "0"}</strong> değerindedir.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-2 print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    <span>Yazdır / PDF Kaydet</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400 print:hidden">
                            <span>📊 TÜİK TÜFE Verisi</span>
                            <span>⚡ Anlık Hesaplama</span>
                        </div>

                        {/* Data Source */}
                        <div className="mt-4 text-center text-xs text-gray-400">
                            Veri kaynağı:{" "}
                            <a
                                href="https://data.tuik.gov.tr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-500"
                            >
                                TÜİK TÜFE (2003=100)
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
