"use client";

import { useState } from "react";

import Link from "next/link";
import { addDays, format } from "date-fns";
import { tr } from "date-fns/locale";

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

// Withholding Tax Rates (Stopaj)
// < 6 months: 7.5%
// 6-12 months: 5%
// > 1 year: 2.5%
const getStopajRate = (days: number): number => {
    if (days < 181) return 0.075;
    if (days < 366) return 0.05;
    return 0.025;
};

// Common term options
const termOptions = [32, 46, 92, 181, 365];

const faqItems = [
    {
        question: "Mevduat faizi hesaplaması nasıl yapılır?",
        answer:
            "Mevduat faizi, 'Anapara × Faiz Oranı × Vade (Gün) / 36500' formülü ile brüt olarak hesaplanır. Net kazanç için bu tutardan stopaj vergisi düşülür.",
    },
    {
        question: "Stopaj (vergi) oranları nedir?",
        answer:
            "Stopaj oranları vadeye göre değişir: 6 aya kadar (dahil) %7.5, 1 yıla kadar (dahil) %5, 1 yıldan uzun vadelerde %2.5 oranında vergi kesintisi uygulanır.",
    },
    {
        question: "Faiz getirisi neye göre değişir?",
        answer:
            "Faiz getirisi; yatırılan anapara tutarına, bankanın sunduğu faiz oranına ve paranın bankada kalacağı gün sayısına (vade) göre değişiklik gösterir.",
    },
    {
        question: "Mevduat faizi günlük mü işlemekte?",
        answer:
            "Genellikle vadeli mevduat hesapları vade sonunu bekler. Ancak 'Günlük Faiz' (Kırık Faiz) veren hesaplar, parayı her gün işletip istediğiniz zaman çekmenize olanak tanır.",
    },
];

export default function MevduatFaiziHesaplama() {
    const [amountInput, setAmountInput] = useState("100.000");
    const [term, setTerm] = useState(32);
    const [rateInput, setRateInput] = useState("45");
    const [customTerm, setCustomTerm] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    // Parse amount safely
    const amount = parseInt(amountInput.replace(/\./g, "").replace(/,/g, "")) || 0;

    // Parse rate safely
    const rate = parseFloat(rateInput.replace(",", ".")) || 0;

    // Calculate details
    const stopajRate = getStopajRate(term);

    // Gross Interest Formula: (Principal * Rate * Days) / 36500
    const grossInterest = (amount * rate * term) / 36500;

    const stopajAmount = grossInterest * stopajRate;
    const netInterest = grossInterest - stopajAmount;
    const totalBalance = amount + netInterest;

    // Percentages for chart and display
    const principalPercent = totalBalance > 0 ? Math.round((amount / totalBalance) * 100) : 100;

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
                                <Link href="/finans" className="hover:text-blue-600 transition-colors">
                                    Finans
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800">Mevduat Faizi Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Mevduat Faizi Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Vadeli hesap getirinizi ve vergi kesintilerini anında hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Deposit Amount */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Anapara Tutarı
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
                                        max="5000000"
                                        step="1000"
                                        value={Math.min(Math.max(amount, 1000), 5000000)}
                                        onChange={(e) => setAmountInput(formatNumber(parseInt(e.target.value)))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-gray-400">
                                        <span>1.000 ₺</span>
                                        <span>5.000.000 ₺</span>
                                    </div>
                                </div>
                            </div>

                            {/* Term Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Vade Süresi (Gün)
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {termOptions.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setTerm(t);
                                                setCustomTerm("");
                                            }}
                                            className={`h-11 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${term === t && !customTerm
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        placeholder="Özel"
                                        value={customTerm}
                                        onChange={(e) => {
                                            setCustomTerm(e.target.value);
                                            if (e.target.value) {
                                                setTerm(parseInt(e.target.value) || 32);
                                            }
                                        }}
                                        className={`h-11 px-3 rounded-lg border text-sm text-center font-medium transition-all outline-none ${customTerm
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-200 bg-white text-gray-600"
                                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                                    />
                                </div>
                            </div>

                            {/* Interest Rate */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Yıllık Faiz Oranı
                                </label>
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={rateInput}
                                        onChange={(e) => setRateInput(e.target.value)}
                                        className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-medium">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Mevduat faizi hesaplamasında <strong>basit faiz formülü</strong> kullanılır.
                                    Bu formül üzerinden stopaj (vergi) düşüldükten sonra net kazanç bulunur.
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                                    Net Kazanç = [(Anapara × Faiz × Gün) / 36500] - Stopaj
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Stopaj</span>
                                        <span>6 aya kadar %7.5, 1 yıla kadar %5, 1 yıl üzeri %2.5</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Gün</span>
                                        <span>Paranın hesapta kalacağı süre</span>
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
                                <span className="text-xs text-gray-400">Vade Sonu</span>
                            </div>

                            {/* Main Result */}
                            <div className="text-center space-y-1 py-2">
                                <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                    Net Faiz Getirisi
                                </p>
                                <div className="flex items-baseline justify-center gap-1 text-gray-900">
                                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                        ₺{formatCurrency(netInterest).split(",")[0]}
                                    </span>
                                    <span className="text-xl font-semibold text-gray-400">
                                        ,{formatCurrency(netInterest).split(",")[1]}
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
                                            className="text-green-500 transition-all duration-700"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray={`${principalPercent}, 100`}
                                            strokeWidth="3"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xs text-gray-400">Anapara</span>
                                        <span className="text-lg font-bold text-gray-800">%{principalPercent}</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase">Anapara</span>
                                            <span className="text-sm font-bold text-gray-800">
                                                ₺{formatNumber(amount)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase">Net Getiri</span>
                                            <span className="text-sm font-bold text-gray-800">
                                                ₺{formatNumber(Math.round(netInterest))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Vade Sonu Toplam</span>
                                    <span className="font-bold text-gray-900">₺{formatCurrency(totalBalance)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Brüt Mevduat Faizi</span>
                                    <span className="font-bold text-blue-500">₺{formatCurrency(grossInterest)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Stopaj (%{stopajRate * 100})</span>
                                    <span className="font-bold text-red-500">-₺{formatCurrency(stopajAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">Vade</span>
                                    <span className="font-bold text-gray-900">{term} Gün</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-2 print:hidden">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <span>{showDetails ? "Detayları Gizle" : "Detaylı Tablo"}</span>
                                    <svg className={`w-5 h-5 transition-transform ${showDetails ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>PDF Olarak İndir</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400 print:hidden">
                            <span>🔒 Güvenli Hesaplama</span>
                            <span>⚡ Güncel Oranlar</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Table Section */}
                {showDetails && (
                    <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 print:block print:shadow-none print:border-none">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Hesaplama Detayları</h2>
                            <span className="text-sm text-gray-500">
                                {format(new Date(), "d MMMM yyyy", { locale: tr })} - {format(addDays(new Date(), term), "d MMMM yyyy", { locale: tr })}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="py-3 px-4 rounded-l-lg">Açıklama</th>
                                        <th className="py-3 px-4 text-right">Tutar / Oran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">Anapara</td>
                                        <td className="py-3 px-4 text-right font-bold text-gray-900">₺{formatNumber(amount)}</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">Vade</td>
                                        <td className="py-3 px-4 text-right text-gray-700">{term} Gün</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">Faiz Oranı (Yıllık)</td>
                                        <td className="py-3 px-4 text-right text-gray-700">%{rateInput}</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">Brüt Faiz Getirisi</td>
                                        <td className="py-3 px-4 text-right font-semibold text-blue-600">₺{formatCurrency(grossInterest)}</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">Stopaj Kesintisi (%{stopajRate * 100})</td>
                                        <td className="py-3 px-4 text-right font-semibold text-red-500">-₺{formatCurrency(stopajAmount)}</td>
                                    </tr>
                                    <tr className="bg-blue-50/50">
                                        <td className="py-4 px-4 font-bold text-gray-900 text-base">Net Faiz Kazancı</td>
                                        <td className="py-4 px-4 text-right font-bold text-green-600 text-base">₺{formatCurrency(netInterest)}</td>
                                    </tr>
                                    <tr className="bg-gray-50/80">
                                        <td className="py-4 px-4 font-bold text-gray-900 rounded-bl-lg">Vade Sonu Toplam Bakiye</td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-900 rounded-br-lg">₺{formatCurrency(totalBalance)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
