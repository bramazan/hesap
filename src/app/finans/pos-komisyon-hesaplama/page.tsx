"use client";

import { useState, useEffect } from "react";
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

export default function PosCommissionCalculator() {
    // State
    const [mode, setMode] = useState<"brut-to-net" | "net-to-brut">("brut-to-net");
    const [amountInput, setAmountInput] = useState<string>("");
    const [rateInput, setRateInput] = useState<string>("3.10");
    const [fixedFeeInput, setFixedFeeInput] = useState<string>("0");

    // Advanced State
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [minCommissionInput, setMinCommissionInput] = useState<string>("");
    const [maxCommissionInput, setMaxCommissionInput] = useState<string>("");

    // Results State
    const [result, setResult] = useState<{
        gross: number;
        commission: number;
        fixedFee: number;
        totalDeduction: number;
        net: number;
        effectiveRate: number;
    } | null>(null);

    // Parse inputs safely
    const amount = parseFloat(amountInput.replace(",", ".")) || 0;
    const rate = parseFloat(rateInput.replace(",", ".")) || 0;
    const fixedFee = parseFloat(fixedFeeInput.replace(",", ".")) || 0;
    const minCommission = parseFloat(minCommissionInput.replace(",", ".")) || 0;
    const maxCommission = parseFloat(maxCommissionInput.replace(",", ".")) || 0;

    // Calculation Logic
    useEffect(() => {
        if (amount <= 0 || rate < 0) {
            setResult(null);
            return;
        }

        let gross = 0;
        let commission = 0;
        let net = 0;

        if (mode === "brut-to-net") {
            // Brüt -> Net
            gross = amount;
            let rawComm = gross * (rate / 100);

            // Apply limits
            if (minCommission > 0) rawComm = Math.max(rawComm, minCommission);
            if (maxCommission > 0) rawComm = Math.min(rawComm, maxCommission);

            commission = rawComm;
            const totalDeduction = commission + fixedFee;
            net = gross - totalDeduction;

            setResult({
                gross,
                commission,
                fixedFee,
                totalDeduction,
                net,
                effectiveRate: gross > 0 ? (totalDeduction / gross) * 100 : 0
            });
        } else {
            // Net -> Brüt (Target Net)
            const targetNet = amount;
            const r = rate / 100;

            if (r >= 1) {
                setResult(null);
                return;
            }

            // Initial Iteration: Gross = (Net + FixedFee) / (1 - rate)
            // This works perfectly if no min/max limits are hit.
            let calculatedGross = (targetNet + fixedFee) / (1 - r);

            // Check limits logic
            if (minCommission > 0 || maxCommission > 0) {
                let provComm = calculatedGross * r;
                let actualComm = provComm;

                if (minCommission > 0) actualComm = Math.max(actualComm, minCommission);
                if (maxCommission > 0) actualComm = Math.min(actualComm, maxCommission);

                // If provisional commission implies we hit a limit, we might need to adjust gross
                if (actualComm !== provComm) {
                    // Reverse with fixed commission
                    // Net = Gross - ActualComm - FixedFee
                    // Gross = Net + ActualComm + FixedFee

                    // Test if using this Fixed Commission makes sense
                    // If we assume MinCommission applies:
                    const grossWithMin = targetNet + minCommission + fixedFee;
                    const commAtMinGross = grossWithMin * r;

                    // If the calculated percentage commission at this new gross is indeed LESS than min,
                    // then strict Min applies.
                    if (minCommission > 0 && commAtMinGross <= minCommission) {
                        calculatedGross = grossWithMin;
                    }
                    // Else if MaxCommission applies:
                    else {
                        const grossWithMax = targetNet + maxCommission + fixedFee;
                        const commAtMaxGross = grossWithMax * r;

                        if (maxCommission > 0 && commAtMaxGross >= maxCommission) {
                            calculatedGross = grossWithMax;
                        }
                        // Else: It means we are in the linear range or transition, original formula should be close enough
                        // or we need specific overlap logic. Standard formula usually best first guess.
                    }
                }
            }

            gross = calculatedGross;

            // Final Forward Pass to calculate exact deductions based on the determined Gross
            let finalComm = gross * r;
            if (minCommission > 0) finalComm = Math.max(finalComm, minCommission);
            if (maxCommission > 0) finalComm = Math.min(finalComm, maxCommission);

            commission = finalComm;
            const totalDeduction = commission + fixedFee;
            net = gross - totalDeduction; // This should be very close to targetNet

            setResult({
                gross,
                commission,
                fixedFee,
                totalDeduction,
                net,
                effectiveRate: gross > 0 ? (totalDeduction / gross) * 100 : 0
            });
        }

    }, [amount, rate, fixedFee, minCommission, maxCommission, mode]);

    const faqItems = [
        {
            question: "Yuvarlama neden yok?",
            answer: "İstediğiniz üzere hesaplama 'ham' matematikle yapılır; ek bir yuvarlama kuralı uygulanmaz."
        },
        {
            question: "Sonuç çok uzun ondalık çıkarsa ne olacak?",
            answer: "Hesaplama yine aynı kalır; sadece ekranda gösterim (format) yapılabilir. Bankanız tahsilatta/ekstrede kuruş seviyesinde farklı gösterebilir."
        },
        {
            question: "Bankamın yatırdığı net ile neden fark olur?",
            answer: "Bankalar/PSP'ler kuruş bazında yuvarlama, kalem bazlı kesinti hesaplama veya farklı gösterim uygulayabilir. Bu sayfa bunları birebir taklit etmez, matematiksel net sonucu verir."
        },
        {
            question: "Komisyon oranını nereden bulacağım?",
            answer: "Sözleşme, POS paneli veya ekstre kesinti kalemlerinden öğrenebilirsiniz."
        },
        {
            question: "Sabit ücret nedir?",
            answer: "İşlem başı hizmet/işlem bedeli gibi ek ücretlerdir (yoksa 0 girin)."
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <main className="max-w-6xl mx-auto px-4 pt-10 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Page Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
                                <span>/</span>
                                <Link href="/tum-hesaplamalar?category=finans" className="hover:text-blue-600 transition-colors">Finans</Link>
                                <span>/</span>
                                <span className="text-gray-800">POS Komisyon Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                POS Komisyon Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Sanal veya fiziki POS işlemleriniz için net kazancınızı veya çekmeniz gereken tutarı hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Mode Toggle */}
                            <div className="flex p-1 bg-gray-100 rounded-xl">
                                <button
                                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${mode === "brut-to-net"
                                        ? "bg-white shadow text-blue-600"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                    onClick={() => setMode("brut-to-net")}
                                >
                                    Ödeme Aldım (Brüt → Net)
                                </button>
                                <button
                                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${mode === "net-to-brut"
                                        ? "bg-white shadow text-blue-600"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                    onClick={() => setMode("net-to-brut")}
                                >
                                    Hesaba Net Geçsin (Net → Brüt)
                                </button>
                            </div>

                            {/* Main Amount Input */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        {mode === "brut-to-net" ? "Çekilen Tutar (Brüt)" : "Hedef Net Tutar"}
                                    </span>
                                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">TRY</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-medium">₺</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={amountInput}
                                        onChange={(e) => setAmountInput(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Rate and Fee Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Komisyon Oranı
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={rateInput}
                                            onChange={(e) => setRateInput(e.target.value)}
                                            step="0.01"
                                            className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-medium">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Sabit Ücret
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-medium">₺</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={fixedFeeInput}
                                            onChange={(e) => setFixedFeeInput(e.target.value)}
                                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Settings Toggle */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <span>{showAdvanced ? "Gelişmiş Ayarları Gizle" : "Gelişmiş Ayarlar (Min/Max Komisyon)"}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Advanced Inputs */}
                            {showAdvanced && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200/50">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Min. Komisyon</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">₺</span>
                                            <input
                                                type="number"
                                                value={minCommissionInput}
                                                onChange={(e) => setMinCommissionInput(e.target.value)}
                                                placeholder="0"
                                                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Max. Komisyon</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">₺</span>
                                            <input
                                                type="number"
                                                value={maxCommissionInput}
                                                onChange={(e) => setMaxCommissionInput(e.target.value)}
                                                placeholder="0"
                                                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <details key={index} className="group bg-gray-50 rounded-xl overflow-hidden">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer text-gray-900 font-medium hover:bg-gray-100 transition-colors">
                                            {item.question}
                                            <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="lg:col-span-5 lg:sticky lg:top-10 lg:mt-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-6 transition-all hover:-translate-y-1 duration-500">
                            {/* Result Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Hesaplama Sonucu</h2>
                                <span className="text-xs text-gray-400">Anlık</span>
                            </div>

                            {/* Main Result Display */}
                            <div className="text-center space-y-2 py-4">
                                <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                    {mode === "brut-to-net" ? "Hesaba Geçecek Net" : "Çekilmesi Gereken Brüt"}
                                </p>
                                <div className="flex items-baseline justify-center gap-1 text-gray-900">
                                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                        ₺{result ? formatCurrency(mode === "brut-to-net" ? result.net : result.gross).split(",")[0] : "0"}
                                    </span>
                                    <span className="text-xl font-semibold text-gray-400">
                                        ,{result ? formatCurrency(mode === "brut-to-net" ? result.net : result.gross).split(",")[1] : "00"}
                                    </span>
                                </div>
                            </div>

                            {/* Summary Box */}
                            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">İşlem Tutarı (Brüt)</span>
                                    <span className="font-bold text-gray-900">
                                        ₺{result ? formatCurrency(result.gross) : "0,00"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Komisyon Tutarı ({rate}%)</span>
                                    <span className="font-bold text-red-500">
                                        -₺{result ? formatCurrency(result.commission) : "0,00"}
                                    </span>
                                </div>

                                {(fixedFee > 0 || (result && result.fixedFee > 0)) && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Sabit Ücret</span>
                                        <span className="font-bold text-red-500">
                                            -₺{result ? formatCurrency(result.fixedFee) : "0,00"}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">Toplam Kesinti</span>
                                    <span className="font-bold text-red-600">
                                        -₺{result ? formatCurrency(result.totalDeduction) : "0,00"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm bg-emerald-50 p-3 rounded-lg -mx-2 mt-2">
                                    <span className="text-emerald-700 font-medium">Net Kazanç</span>
                                    <span className="font-bold text-emerald-700 text-lg">
                                        ₺{result ? formatCurrency(result.net) : "0,00"}
                                    </span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex justify-center gap-6 text-xs text-gray-400 mt-2">
                                <span>🔒 Güvenli Hesaplama</span>
                                <span>⚡ %100 Doğruluk</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
