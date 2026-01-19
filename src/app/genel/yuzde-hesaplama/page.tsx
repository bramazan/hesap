"use client";

import { useState } from "react";
import Link from "next/link";

// Format number with Turkish locale
const formatNumber = (num: number, decimals: number = 2) => {
    if (!isFinite(num) || isNaN(num)) return "0";
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
};

const faqItems = [
    {
        question: "Yüzde nasıl hesaplanır?",
        answer:
            "Bir sayının yüzdesini bulmak için sayıyı yüzde değerine bölüp 100 ile çarparsınız. Örneğin 200'ün %15'i = 200 × 15 ÷ 100 = 30",
    },
    {
        question: "Yüzde artış nasıl hesaplanır?",
        answer:
            "Yüzde artış = ((Yeni Değer - Eski Değer) ÷ Eski Değer) × 100. Örneğin 100'den 120'ye artış = %20 artış.",
    },
    {
        question: "Yüzde indirim nasıl hesaplanır?",
        answer:
            "İndirimli fiyat = Orijinal Fiyat - (Orijinal Fiyat × İndirim Oranı ÷ 100). 500₺'lik ürüne %20 indirim = 500 - 100 = 400₺",
    },
    {
        question: "Yüzdelik dilim ne demek?",
        answer:
            "Yüzdelik dilim, bir değerin toplam içindeki payını gösterir. Örneğin %25'lik dilim, toplam 100 birimden 25 birime karşılık gelir.",
    },
];

export default function YuzdeHesaplama() {
    const [numberInput, setNumberInput] = useState("100");
    const [percentInput, setPercentInput] = useState("20");

    // Parse values safely
    const number = parseFloat(numberInput.replace(/\./g, "").replace(",", ".")) || 0;
    const percent = parseFloat(percentInput.replace(",", ".")) || 0;

    // Calculate result
    const result = (number * percent) / 100;
    const resultPercent = number > 0 ? Math.round((result / number) * 100) : 0;

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
                                <Link href="/genel" className="hover:text-blue-600 transition-colors">
                                    Genel
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800">Yüzde Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Yüzde Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Bir sayının yüzdesini anında hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Number Input */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Sayı
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={numberInput}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[\d.,]*$/.test(val)) {
                                                setNumberInput(val);
                                            }
                                        }}
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                        placeholder="Örn: 250"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="10"
                                        value={Math.min(Math.max(number, 0), 10000)}
                                        onChange={(e) => setNumberInput(e.target.value)}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-gray-400">
                                        <span>0</span>
                                        <span>10.000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Percent Input */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Yüzde Oranı
                                </label>
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={percentInput}
                                        onChange={(e) => setPercentInput(e.target.value)}
                                        className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                        placeholder="Örn: 20"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-medium">%</span>
                                    </div>
                                </div>
                                <div className="space-y-2 max-w-xs">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={Math.min(Math.max(percent, 0), 100)}
                                        onChange={(e) => setPercentInput(e.target.value)}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-gray-400">
                                        <span>%0</span>
                                        <span>%100</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Yüzde hesaplama işlemi oldukça basittir. Formül:
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
                                    Sonuç = Sayı × Yüzde ÷ 100
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Örnek 1:</span>
                                        <span>250'nin %20'si = 250 × 20 ÷ 100 = 50</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Örnek 2:</span>
                                        <span>1000'in %15'i = 1000 × 15 ÷ 100 = 150</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Örnek 3:</span>
                                        <span>500'ün %50'si = 500 × 50 ÷ 100 = 250</span>
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
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-[72px]">
                        {/* Floating Result Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-6 transition-all hover:-translate-y-1 duration-500">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Hesaplama Sonucu</h2>
                                <span className="text-xs text-gray-400">Anlık</span>
                            </div>

                            {/* Main Result */}
                            <div className="text-center space-y-1 py-2">
                                <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                    {numberInput} sayısının %{percentInput}'i
                                </p>
                                <div className="flex items-baseline justify-center gap-1 text-gray-900">
                                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                        {formatNumber(result, 2).split(",")[0]}
                                    </span>
                                    <span className="text-xl font-semibold text-gray-400">
                                        ,{formatNumber(result, 2).split(",")[1]}
                                    </span>
                                </div>
                            </div>

                            {/* Visualization */}
                            <div className="flex items-center justify-center gap-6 py-4">
                                {/* Donut Chart */}
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-gray-100"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <path
                                            className="text-blue-500 transition-all duration-700"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray={`${Math.min(resultPercent, 100)}, 100`}
                                            strokeWidth="3"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xs text-gray-400">Oran</span>
                                        <span className="text-lg font-bold text-gray-800">%{percent}</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase">Sonuç</span>
                                            <span className="text-sm font-bold text-gray-800">
                                                {formatNumber(result, 2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase">Kalan</span>
                                            <span className="text-sm font-bold text-gray-800">
                                                {formatNumber(number - result, 2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Girilen Sayı</span>
                                    <span className="font-bold text-gray-900">{formatNumber(number, 2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Yüzde Oranı</span>
                                    <span className="font-bold text-gray-900">%{formatNumber(percent, 2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">Sonuç</span>
                                    <span className="font-bold text-blue-600">{formatNumber(result, 2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Kalan Değer</span>
                                    <span className="font-bold text-gray-900">{formatNumber(number - result, 2)}</span>
                                </div>
                            </div>

                            {/* Related Calculators */}
                            <div className="pt-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">İlgili Hesaplayıcılar</p>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href="/finans/kdv-hesaplama"
                                        className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                    >
                                        KDV Hesaplama
                                    </Link>
                                    <Link
                                        href="/finans/kar-marji-hesaplama"
                                        className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                    >
                                        Kâr Marjı
                                    </Link>
                                    <Link
                                        href="/finans/kredi-hesaplama"
                                        className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                    >
                                        Kredi Hesaplama
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
                            <span>🔒 Güvenli</span>
                            <span>⚡ Anlık Hesaplama</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
