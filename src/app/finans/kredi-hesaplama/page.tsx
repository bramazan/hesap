"use client";

import { useState } from "react";
import Link from "next/link";

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

// Tax rates for Turkish banking (KKDF + BSMV)
const KKDF_RATE = 0.15; // Kaynak Kullanımını Destekleme Fonu
const BSMV_RATE = 0.15; // Banka ve Sigorta Muameleleri Vergisi
const TOTAL_TAX_RATE = KKDF_RATE + BSMV_RATE; // 0.30

// Payment schedule item type
interface PaymentScheduleItem {
    month: number;
    payment: number;
    principal: number;
    interest: number;      // Ham faiz (banka kazancı)
    kkdf: number;          // KKDF vergisi
    bsmv: number;          // BSMV vergisi
    totalCost: number;     // Faiz + Vergi toplamı
    remainingBalance: number;
}

// Calculate gross rate including taxes
const calculateGrossRate = (rawRate: number): number => {
    return rawRate * (1 + TOTAL_TAX_RATE);
};

// Calculate payment schedule with amortization and tax breakdown
const calculatePaymentSchedule = (
    principal: number,
    rawMonthlyRate: number, // Ham faiz oranı (vergi hariç)
    term: number
): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];

    if (rawMonthlyRate <= 0 || term <= 0 || principal <= 0) {
        return schedule;
    }

    // Calculate gross rate with taxes
    const grossRate = calculateGrossRate(rawMonthlyRate);

    // Calculate monthly payment using annuity formula with GROSS rate
    const monthlyPayment = (principal * grossRate * Math.pow(1 + grossRate, term)) /
        (Math.pow(1 + grossRate, term) - 1);

    let remainingBalance = principal;

    for (let month = 1; month <= term; month++) {
        // Raw interest for this month (bank's profit)
        const rawInterest = remainingBalance * rawMonthlyRate;
        // KKDF tax
        const kkdfAmount = rawInterest * KKDF_RATE;
        // BSMV tax
        const bsmvAmount = rawInterest * BSMV_RATE;
        // Total cost = raw interest + taxes
        const totalCost = rawInterest + kkdfAmount + bsmvAmount;
        // Principal portion is the payment minus total cost
        const principalPayment = monthlyPayment - totalCost;
        // Update remaining balance
        remainingBalance = remainingBalance - principalPayment;

        schedule.push({
            month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: rawInterest,
            kkdf: kkdfAmount,
            bsmv: bsmvAmount,
            totalCost: totalCost,
            remainingBalance: Math.max(0, remainingBalance),
        });
    }

    return schedule;
};

const faqItems = [
    {
        question: "Kredi hesaplama nasıl yapılır?",
        answer:
            "Kredi hesaplama, anapara tutarı, aylık faiz oranı ve vade süresine göre aylık taksit tutarını hesaplar. Formül: Taksit = Anapara × (Faiz × (1+Faiz)^Vade) / ((1+Faiz)^Vade - 1)",
    },
    {
        question: "Aylık faiz oranı nedir?",
        answer:
            "Aylık faiz oranı, bankanın kredi tutarı üzerinden her ay aldığı faiz yüzdesidir. Yıllık faiz oranını 12'ye bölerek aylık oranı bulabilirsiniz.",
    },
    {
        question: "Toplam faiz nasıl hesaplanır?",
        answer:
            "Toplam faiz = (Aylık Taksit × Vade Süresi) - Anapara Tutarı formülüyle hesaplanır. Bu tutar, kredinin size maliyetini gösterir.",
    },
    {
        question: "Vade süresi seçimi nasıl etkiler?",
        answer:
            "Vade uzadıkça aylık taksit düşer ancak toplam faiz artar. Kısa vadede taksit yüksek olsa da toplam ödeme daha azdır.",
    },
];

export default function KrediHesaplama() {
    const [amountInput, setAmountInput] = useState("100.000");
    const [term, setTerm] = useState(12);
    const [rateInput, setRateInput] = useState("3.49");
    const [customTerm, setCustomTerm] = useState("");
    const [showSchedule, setShowSchedule] = useState(false);

    // Parse amount safely
    const amount = parseInt(amountInput.replace(/\./g, "").replace(/,/g, "")) || 0;

    // Parse rate safely
    const rate = parseFloat(rateInput.replace(",", ".")) || 0;

    // Calculate loan details
    const monthlyRate = rate / 100;

    // Calculate payment schedule
    const paymentSchedule = calculatePaymentSchedule(amount, monthlyRate, term);

    // Get totals from schedule
    const monthlyPayment = paymentSchedule.length > 0 ? paymentSchedule[0].payment : 0;
    const totalPayment = paymentSchedule.reduce((sum, item) => sum + item.payment, 0);
    const totalInterest = paymentSchedule.reduce((sum, item) => sum + item.interest, 0);
    const totalKkdf = paymentSchedule.reduce((sum, item) => sum + item.kkdf, 0);
    const totalBsmv = paymentSchedule.reduce((sum, item) => sum + item.bsmv, 0);
    const totalTax = totalKkdf + totalBsmv;
    const totalCost = totalInterest + totalTax; // Faiz + Vergi = Toplam Maliyet
    const grossRate = calculateGrossRate(monthlyRate);
    const principalPercent = totalPayment > 0 ? Math.round((amount / totalPayment) * 100) : 100;

    const termOptions = [12, 24, 36, 48, 60];

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
                                <span className="text-gray-800">Kredi Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Kredi Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                İhtiyacınıza en uygun kredi seçeneklerini anında planlayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Loan Amount */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Kredi Tutarı
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
                                            // Allow only numbers, dots and commas
                                            if (/^[\d.,]*$/.test(val)) {
                                                setAmountInput(val);
                                            }
                                        }}
                                        onBlur={() => {
                                            // Format on blur if valid number
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
                                        min="10000"
                                        max="10000000"
                                        step="10000"
                                        value={Math.min(Math.max(amount, 10000), 10000000)}
                                        onChange={(e) => setAmountInput(formatNumber(parseInt(e.target.value)))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-gray-400">
                                        <span>10.000 ₺</span>
                                        <span>10.000.000 ₺</span>
                                    </div>
                                </div>
                            </div>

                            {/* Term Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Vade Süresi (Ay)
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
                                                setTerm(parseInt(e.target.value) || 12);
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
                                    Aylık Faiz Oranı
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
                                    Kredi taksiti hesaplamasında <strong>annüite formülü</strong> kullanılır.
                                    Bu formül, her ay eşit taksit ödemesi yapmanızı sağlar.
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
                                    Taksit = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">P</span>
                                        <span>Anapara (Kredi tutarı)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">r</span>
                                        <span>Aylık faiz oranı (yüzde/100)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">n</span>
                                        <span>Toplam taksit sayısı (vade)</span>
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
                                    Aylık Ödeme Tutarı
                                </p>
                                <div className="flex items-baseline justify-center gap-1 text-gray-900">
                                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                        ₺{formatCurrency(monthlyPayment).split(",")[0]}
                                    </span>
                                    <span className="text-xl font-semibold text-gray-400">
                                        ,{formatCurrency(monthlyPayment).split(",")[1]}
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
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
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
                                            <span className="text-xs text-gray-400 uppercase">Faiz</span>
                                            <span className="text-sm font-bold text-gray-800">
                                                ₺{formatNumber(Math.round(totalInterest))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Toplam Geri Ödeme</span>
                                    <span className="font-bold text-gray-900">₺{formatCurrency(totalPayment)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Toplam Faiz (Banka)</span>
                                    <span className="font-bold text-orange-500">₺{formatCurrency(totalInterest)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Toplam Vergi (KKDF+BSMV)</span>
                                    <span className="font-bold text-purple-500">₺{formatCurrency(totalTax)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">Toplam Maliyet</span>
                                    <span className="font-bold text-red-500">₺{formatCurrency(totalCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Vade</span>
                                    <span className="font-bold text-gray-900">{term} Ay</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Brüt Faiz Oranı</span>
                                    <span className="font-bold text-gray-900">%{formatCurrency(grossRate * 100)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={() => setShowSchedule(!showSchedule)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <span>{showSchedule ? "Ödeme Planını Gizle" : "Ödeme Planını Göster"}</span>
                                    <svg className={`w-5 h-5 transition-transform ${showSchedule ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button className="w-full bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>PDF Olarak İndir</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
                            <span>🔒 Güvenli</span>
                            <span>⚡ Anlık Hesaplama</span>
                        </div>
                    </div>
                </div>

                {/* Payment Schedule Table */}
                {showSchedule && paymentSchedule.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Ödeme Planı</h2>
                            <span className="text-sm text-gray-500">{term} Taksit</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Taksit</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Taksit Tutarı</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Anapara</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Faiz</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">KKDF</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">BSMV</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Kalan Anapara</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paymentSchedule.map((item) => (
                                        <tr key={item.month} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg">
                                                    {item.month}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                                ₺{formatCurrency(item.payment)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-gray-700">
                                                ₺{formatCurrency(item.principal)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-gray-700">
                                                ₺{formatCurrency(item.interest)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-gray-700">
                                                ₺{formatCurrency(item.kkdf)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-gray-700">
                                                ₺{formatCurrency(item.bsmv)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-gray-900">
                                                ₺{formatCurrency(item.remainingBalance)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                                    <tr>
                                        <td className="py-4 px-4 font-bold text-gray-900">Toplam</td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-900">
                                            ₺{formatCurrency(totalPayment)}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-blue-600">
                                            ₺{formatCurrency(amount)}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-700">
                                            ₺{formatCurrency(totalInterest)}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-700">
                                            ₺{formatCurrency(totalKkdf)}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-700">
                                            ₺{formatCurrency(totalBsmv)}
                                        </td>
                                        <td className="py-4 px-4 text-right text-gray-400">—</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
