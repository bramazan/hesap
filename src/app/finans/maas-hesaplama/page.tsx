"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import salaryParams from "@/data/salary-params-2026.json";

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

// Types
type Mode = "brut-to-net" | "net-to-brut";

interface SalaryResult {
    brut: number;
    sgkKesinti: number;
    issizlikKesinti: number;
    gelirVergisiMatrahi: number;
    gelirVergisi: number;
    damgaVergisi: number;
    toplamKesinti: number;
    net: number;
    isverenSgk: number;
    isverenIssizlik: number;
    isverenMaliyet: number;
    asgarIUcretIstisnaTutari: number;
}

// 2026 Parameters from JSON
const SGK_EMPLOYEE_RATE = salaryParams.sgk.employeeRate;
const UNEMPLOYMENT_RATE = salaryParams.sgk.unemploymentRate;
const STAMP_TAX_RATE = salaryParams.stampTaxRate;
const SGK_CEILING = salaryParams.sgk.ceiling;
const SGK_EMPLOYER_RATE = salaryParams.sgk.employerRate;
const EMPLOYER_UNEMPLOYMENT_RATE = salaryParams.sgk.employerUnemploymentRate;
const MINIMUM_WAGE_GROSS = salaryParams.minimumWage.gross;

// Income Tax Brackets (cumulative)
const TAX_BRACKETS = salaryParams.incomeTaxBrackets.map(bracket => ({
    limit: bracket.limit ?? Infinity,
    rate: bracket.rate,
}));

// Calculate income tax based on cumulative tax base
const calculateIncomeTax = (
    monthlyTaxBase: number,
    cumulativeTaxBaseBefore: number
): { tax: number; newCumulative: number } => {
    const cumulativeAfter = cumulativeTaxBaseBefore + monthlyTaxBase;

    let taxBefore = 0;
    let taxAfter = 0;

    // Calculate tax for cumulative before
    let remaining = cumulativeTaxBaseBefore;
    let prevLimit = 0;
    for (const bracket of TAX_BRACKETS) {
        if (remaining <= 0) break;
        const bracketWidth = bracket.limit - prevLimit;
        const taxableInBracket = Math.min(remaining, bracketWidth);
        taxBefore += taxableInBracket * bracket.rate;
        remaining -= taxableInBracket;
        prevLimit = bracket.limit;
    }

    // Calculate tax for cumulative after
    remaining = cumulativeAfter;
    prevLimit = 0;
    for (const bracket of TAX_BRACKETS) {
        if (remaining <= 0) break;
        const bracketWidth = bracket.limit - prevLimit;
        const taxableInBracket = Math.min(remaining, bracketWidth);
        taxAfter += taxableInBracket * bracket.rate;
        remaining -= taxableInBracket;
        prevLimit = bracket.limit;
    }

    return {
        tax: taxAfter - taxBefore,
        newCumulative: cumulativeAfter,
    };
};

// Calculate minimum wage tax exemption amounts (dynamic based on cumulative base)
const calculateMinimumWageExemption = (cumulativeMinWageBase: number): { gvExemption: number; dvExemption: number; newCumulative: number } => {
    const sgkKesinti = MINIMUM_WAGE_GROSS * SGK_EMPLOYEE_RATE;
    const issizlikKesinti = MINIMUM_WAGE_GROSS * UNEMPLOYMENT_RATE;
    const matrah = MINIMUM_WAGE_GROSS - sgkKesinti - issizlikKesinti;

    const { tax: gvExemption, newCumulative } = calculateIncomeTax(matrah, cumulativeMinWageBase);
    const dvExemption = MINIMUM_WAGE_GROSS * STAMP_TAX_RATE;

    return { gvExemption, dvExemption, newCumulative };
};

// Calculate salary from gross to net
const calculateBrutToNet = (
    brutUcret: number,
    kumulatifMatrah: number = 0,
    applyMinWageExemption: boolean = true,
    minWageCumulative: number = 0
): SalaryResult => {
    // Step 1: Determine premium base (capped at ceiling)
    const primEsasTutar = Math.min(brutUcret, SGK_CEILING);

    // Step 2: Calculate SGK and unemployment deductions (employee share)
    const sgkKesinti = primEsasTutar * SGK_EMPLOYEE_RATE;
    const issizlikKesinti = primEsasTutar * UNEMPLOYMENT_RATE;

    // Step 3: Calculate income tax base (monthly)
    const gelirVergisiMatrahi = Math.max(0, brutUcret - sgkKesinti - issizlikKesinti);

    // Step 4: Calculate income tax (cumulative)
    const { tax: gelirVergisi } = calculateIncomeTax(gelirVergisiMatrahi, kumulatifMatrah);

    // Step 5: Calculate stamp tax
    const damgaVergisi = brutUcret * STAMP_TAX_RATE;

    // Step 6: Apply minimum wage exemption if applicable
    let finalGelirVergisi = gelirVergisi;
    let finalDamgaVergisi = damgaVergisi;
    let asgarIUcretIstisnaTutari = 0;

    if (applyMinWageExemption) {
        const { gvExemption, dvExemption } = calculateMinimumWageExemption(minWageCumulative);
        finalGelirVergisi = Math.max(0, gelirVergisi - gvExemption);
        finalDamgaVergisi = Math.max(0, damgaVergisi - dvExemption);
        asgarIUcretIstisnaTutari = (gelirVergisi - finalGelirVergisi) + (damgaVergisi - finalDamgaVergisi);
    }

    // Step 7: Calculate net salary
    const toplamKesinti = sgkKesinti + issizlikKesinti + finalGelirVergisi + finalDamgaVergisi;
    const net = brutUcret - toplamKesinti;

    // Employer costs
    const isverenSgk = primEsasTutar * SGK_EMPLOYER_RATE;
    const isverenIssizlik = primEsasTutar * EMPLOYER_UNEMPLOYMENT_RATE;
    const isverenMaliyet = brutUcret + isverenSgk + isverenIssizlik;

    return {
        brut: brutUcret,
        sgkKesinti,
        issizlikKesinti,
        gelirVergisiMatrahi,
        gelirVergisi: finalGelirVergisi,
        damgaVergisi: finalDamgaVergisi,
        toplamKesinti,
        net,
        isverenSgk,
        isverenIssizlik,
        isverenMaliyet,
        asgarIUcretIstisnaTutari,
    };
};

// Calculate salary from net to gross (iterative approach)
const calculateNetToBrut = (
    targetNet: number,
    kumulatifMatrah: number = 0,
    applyMinWageExemption: boolean = true
): SalaryResult => {
    // Initial estimate
    let brutEstimate = targetNet * 1.4;

    // Iterative refinement
    for (let i = 0; i < 20; i++) {
        const result = calculateBrutToNet(brutEstimate, kumulatifMatrah, applyMinWageExemption);
        const diff = targetNet - result.net;

        if (Math.abs(diff) < 0.01) break;

        brutEstimate += diff;
    }

    return calculateBrutToNet(brutEstimate, kumulatifMatrah, applyMinWageExemption);
};

// Calculate annual salary schedule
const calculateAnnualSalary = (
    startAmount: number,
    mode: Mode
): SalaryResult[] => {
    const schedule: SalaryResult[] = [];
    let tableCurrentCumulative = 0;
    let tableMinWageCumulative = 0;

    const monthlySgkBase = Math.min(MINIMUM_WAGE_GROSS, SGK_CEILING);
    const minWageMatrah = monthlySgkBase - (monthlySgkBase * SGK_EMPLOYEE_RATE) - (monthlySgkBase * UNEMPLOYMENT_RATE);

    for (let month = 1; month <= 12; month++) {
        let result: SalaryResult;

        // Asgari ücret istisna hesabı (o ay için)
        const { tax: gvExemption, newCumulative: newMinCumulative } = calculateIncomeTax(minWageMatrah, tableMinWageCumulative);
        const dvExemption = MINIMUM_WAGE_GROSS * STAMP_TAX_RATE;

        const minWageExemptionAmount = gvExemption; // Bu değeri calculateBrutToNet'e doğrudan geçemiyoruz fonksiyon yapısı gereği ama parametre ile halledebiliriz.
        // Aslında calculateBrutToNet fonksiyonunu her ay için o ayın kumulatif min wage değerini verecek şekilde güncelledik.

        if (mode === "brut-to-net") {
            const brut = startAmount;

            // O ayın minWageCumulative değerini kullanarak hesapla
            const calc = calculateBrutToNet(brut, tableCurrentCumulative, true, tableMinWageCumulative);

            // Bir sonraki ay için kümülatifi güncelle:
            // calculateBrutToNet içinde gelirVergisi hesaplanırken newCumulative dönmüyor, result objesi dönüyor.
            // Bu yüzden kümülatifi manuel güncellememiz lazım.
            const primEsasTutar = Math.min(brut, SGK_CEILING);
            const sgkKesinti = primEsasTutar * SGK_EMPLOYEE_RATE;
            const issizlikKesinti = primEsasTutar * UNEMPLOYMENT_RATE;
            const matrah = Math.max(0, brut - sgkKesinti - issizlikKesinti);
            const { newCumulative } = calculateIncomeTax(matrah, tableCurrentCumulative);

            tableCurrentCumulative = newCumulative;
            result = calc;

        } else {
            // Net sabit, Brüt değişir (İteratif)
            // Bu kısımda "Hedef Net" her ay aynı.
            // Fakat asgari ücret istisnası aydan aya değiştiği için,
            // Hedef neti tutturmak için gereken brüt de değişecektir.

            let brutEstimate = startAmount * 1.4; // Başlangıç tahmini
            if (schedule.length > 0) brutEstimate = schedule[schedule.length - 1].brut; // Önceki aydan tahmin

            for (let i = 0; i < 20; i++) {
                const calc = calculateBrutToNet(brutEstimate, tableCurrentCumulative, true, tableMinWageCumulative);
                const diff = startAmount - calc.net;
                if (Math.abs(diff) < 0.01) break;
                brutEstimate += diff;
            }

            result = calculateBrutToNet(brutEstimate, tableCurrentCumulative, true, tableMinWageCumulative);

            // Kümülatif güncelleme
            const primEsasTutar = Math.min(result.brut, SGK_CEILING);
            const sgkKesinti = primEsasTutar * SGK_EMPLOYEE_RATE;
            const issizlikKesinti = primEsasTutar * UNEMPLOYMENT_RATE;
            const matrah = Math.max(0, result.brut - sgkKesinti - issizlikKesinti);
            const { newCumulative } = calculateIncomeTax(matrah, tableCurrentCumulative);

            tableCurrentCumulative = newCumulative;
        }

        // Asgari ücret kümlatifini güncelle
        tableMinWageCumulative = newMinCumulative;

        schedule.push(result);
    }

    return schedule;
};

const faqItems = [
    {
        question: "Brüt maaştan hangi kesintiler yapılır?",
        answer:
            "SGK işçi primi (%14), işsizlik sigortası (%1), gelir vergisi (kümülatif, %15-40 arası dilimli) ve damga vergisi (binde 7,59) kesilir. Asgari ücret tutarına kadar gelir vergisi ve damga vergisi istisnası uygulanır.",
    },
    {
        question: "Kümülatif vergi matrahı nedir?",
        answer:
            "Gelir vergisi yıllık ve kümülatif çalışır. Yıl içinde biriken vergi matrahınız arttıkça daha yüksek vergi dilimlerine girersiniz. Bu nedenle aynı brüt ücret, yılın başında ve sonunda farklı net sonuçlar üretebilir.",
    },
    {
        question: "Asgari ücret vergi istisnası ne demek?",
        answer:
            "2026'da asgari ücret seviyesine kadar gelir vergisi ve damga vergisi istisnası uygulanır. Bu nedenle asgari ücrette net maaş yaklaşık 28.075,50 TL olur (sadece SGK kesintileri düşülür).",
    },
    {
        question: "İşveren maliyeti nasıl hesaplanır?",
        answer:
            "Brüt maaşın üzerine işveren %20.5 SGK primi ve %2 işsizlik sigortası öder. Bu toplam işveren maliyetini oluşturur.",
    },
    {
        question: "SGK tavan ücreti ne anlama gelir?",
        answer:
            "2026'da SGK prim tavanı 297.270 TL'dir. Brüt ücret bu tutarın üzerindeyse bile, SGK ve işsizlik primleri bu tavan üzerinden hesaplanır.",
    },
];

export default function MaasHesaplama() {
    const [amountInput, setAmountInput] = useState("33.030");
    const [mode, setMode] = useState<Mode>("brut-to-net");
    const [kumulatifInput, setKumulatifInput] = useState("0");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [result, setResult] = useState<SalaryResult | null>(null);

    // Parse amount safely
    const amount = parseFloat(amountInput.replace(/\./g, "").replace(",", ".")) || 0;
    const kumulatif = parseFloat(kumulatifInput.replace(/\./g, "").replace(",", ".")) || 0;

    useEffect(() => {
        if (amount <= 0) {
            setResult(null);
            return;
        }

        if (mode === "brut-to-net") {
            setResult(calculateBrutToNet(amount, kumulatif));
        } else {
            setResult(calculateNetToBrut(amount, kumulatif));
        }
    }, [amount, mode, kumulatif]);

    // Calculate annual data independently (simulating a full year from Jan to Dec)
    const annualSchedule = amount > 0 ? calculateAnnualSalary(amount, mode) : [];

    // Calculate percentages for visualization
    const netPercent = result && result.brut > 0
        ? Math.round((result.net / result.brut) * 100)
        : 0;

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
                                <span className="text-gray-800">Maaş Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Maaş Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                2026 yılı parametreleriyle brütten nete veya netten brüte maaş hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Mode Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hesaplama Modu
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setMode("brut-to-net")}
                                        className={`h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${mode === "brut-to-net"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        Brüt → Net
                                    </button>
                                    <button
                                        onClick={() => setMode("net-to-brut")}
                                        className={`h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${mode === "net-to-brut"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        Net → Brüt
                                    </button>
                                </div>
                            </div>

                            {/* Salary Amount */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        {mode === "brut-to-net" ? "Brüt Ücret" : "Net Ücret"}
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
                                        min={MINIMUM_WAGE_GROSS}
                                        max="300000"
                                        step="1000"
                                        value={Math.min(Math.max(amount, MINIMUM_WAGE_GROSS), 300000)}
                                        onChange={(e) => setAmountInput(formatNumber(parseInt(e.target.value)))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-gray-400">
                                        <span>{formatNumber(MINIMUM_WAGE_GROSS)} ₺</span>
                                        <span>300.000 ₺</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Select Amounts */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hızlı Seçim
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[33030, 50000, 75000, 100000, 150000, 200000].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmountInput(formatNumber(val))}
                                            className={`px-4 py-2 rounded-lg border font-medium transition-all ${amount === val
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {formatNumber(val)} ₺
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Advanced Options */}
                            <div className="border-t border-gray-100 pt-6">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <svg
                                        className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Gelişmiş Seçenekler
                                </button>

                                {showAdvanced && (
                                    <div className="mt-4 space-y-4">
                                        <label className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                Kümülatif Vergi Matrahı
                                            </span>
                                            <span className="text-xs text-gray-400">(Anlık Hesaplama İçin)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-400 font-medium">₺</span>
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={kumulatifInput}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (/^[\d.,]*$/.test(val)) {
                                                        setKumulatifInput(val);
                                                    }
                                                }}
                                                placeholder="0"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Yıl içinde daha önce biriken vergi matrahınızı girin. Sağdaki &quot;Anlık&quot; kart hesaplamasını etkiler. Alttaki yıllık tablo her zaman Ocak ayından başlar.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Monthly Breakdown Table */}


                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Brütten nete maaş hesaplamasında sırasıyla aşağıdaki kesintiler yapılır:
                                </p>
                                <ol className="space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                        <span><strong>SGK Sigortalı Payı:</strong> Brüt ücretin %14&apos;ü (tavan: 297.270 TL)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                        <span><strong>İşsizlik Sigortası:</strong> Brüt ücretin %1&apos;i</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                        <span><strong>Gelir Vergisi:</strong> Matrah üzerinden kümülatif tarifeye göre (%15-40)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                        <span><strong>Damga Vergisi:</strong> Brüt ücretin binde 7,59&apos;u</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                                        <span><strong>Asgari Ücret İstisnası:</strong> GV ve DV&apos;den asgari ücrete isabet eden tutar düşülür</span>
                                    </li>
                                </ol>

                                <div className="bg-gray-50 rounded-xl p-4 mt-4">
                                    <p className="font-semibold text-gray-800 mb-2">2026 Gelir Vergisi Dilimleri:</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {salaryParams.incomeTaxBrackets.map((bracket, idx) => (
                                            <div key={idx} className="flex justify-between">
                                                <span>{bracket.label}:</span>
                                                <span className="font-bold">%{bracket.rate * 100}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                                <span className="text-xs text-gray-400">2026</span>
                            </div>

                            {result ? (
                                <>
                                    {/* Main Result */}
                                    <div className="text-center space-y-1 py-2">
                                        <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                            {mode === "brut-to-net" ? "Net Ücret" : "Brüt Ücret"}
                                        </p>
                                        <div className="flex items-baseline justify-center gap-1 text-gray-900">
                                            <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                                ₺{formatCurrency(mode === "brut-to-net" ? result.net : result.brut).split(",")[0]}
                                            </span>
                                            <span className="text-xl font-semibold text-gray-400">
                                                ,{formatCurrency(mode === "brut-to-net" ? result.net : result.brut).split(",")[1]}
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
                                                    strokeDasharray={`${netPercent}, 100`}
                                                    strokeWidth="3"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-xs text-gray-400">Net</span>
                                                <span className="text-lg font-bold text-gray-800">%{netPercent}</span>
                                            </div>
                                        </div>

                                        {/* Legend */}
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 uppercase">Net</span>
                                                    <span className="text-sm font-bold text-gray-800">
                                                        ₺{formatNumber(Math.round(result.net))}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-gray-200" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 uppercase">Kesinti</span>
                                                    <span className="text-sm font-bold text-gray-800">
                                                        ₺{formatNumber(Math.round(result.toplamKesinti))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deductions Breakdown */}
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Brüt Ücret</span>
                                            <span className="font-bold text-gray-900">₺{formatCurrency(result.brut)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">SGK İşçi Payı (%14)</span>
                                            <span className="font-bold text-red-500">-₺{formatCurrency(result.sgkKesinti)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">İşsizlik Sigortası (%1)</span>
                                            <span className="font-bold text-red-500">-₺{formatCurrency(result.issizlikKesinti)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Gelir Vergisi</span>
                                            <span className="font-bold text-red-500">-₺{formatCurrency(result.gelirVergisi)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Damga Vergisi</span>
                                            <span className="font-bold text-red-500">-₺{formatCurrency(result.damgaVergisi)}</span>
                                        </div>
                                        {result.asgarIUcretIstisnaTutari > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Asgari Ücret İstisnası</span>
                                                <span className="font-bold text-green-500">+₺{formatCurrency(result.asgarIUcretIstisnaTutari)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                            <span className="text-gray-700 font-medium">Net Ücret</span>
                                            <span className="font-bold text-green-600">₺{formatCurrency(result.net)}</span>
                                        </div>
                                    </div>

                                    {/* Employer Cost */}
                                    <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                                        <p className="text-sm font-medium text-blue-700">İşveren Maliyeti</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-600">Brüt Ücret</span>
                                            <span className="font-bold text-blue-800">₺{formatCurrency(result.brut)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-600">İşveren SGK (%20.5)</span>
                                            <span className="font-bold text-blue-800">+₺{formatCurrency(result.isverenSgk)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-600">İşveren İşsizlik (%2)</span>
                                            <span className="font-bold text-blue-800">+₺{formatCurrency(result.isverenIssizlik)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-t border-blue-200 pt-2">
                                            <span className="text-blue-700 font-medium">Toplam Maliyet</span>
                                            <span className="font-extrabold text-blue-900">₺{formatCurrency(result.isverenMaliyet)}</span>
                                        </div>
                                    </div>

                                    {/* Related Calculators */}
                                    <div className="pt-2">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">İlgili Hesaplayıcılar</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href="/finans/kredi-hesaplama"
                                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                            >
                                                Kredi Hesaplama
                                            </Link>
                                            <Link
                                                href="/finans/kdv-hesaplama"
                                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                            >
                                                KDV Hesaplama
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-6xl">💰</span>
                                    <p className="text-gray-500 mt-4">Maaş tutarını girin</p>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
                            <span>🔒 Güvenli</span>
                            <span>⚡ Anlık Hesaplama</span>
                            <span>📅 2026 Verileri</span>
                        </div>
                    </div>
                </div>

                {annualSchedule.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Yıllık Maaş Tablosu (2026)</h2>
                            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                {mode === "brut-to-net" ? "Sabit Brüt" : "Sabit Net (Yaklaşık)"}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-3 px-4 text-left font-semibold text-gray-600">Ay</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-600">Brüt</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-600">Net</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-600">Kesinti</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-600">Gelir Vergisi</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-600">Damga Vergisi</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-600">Maliyet</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {annualSchedule.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-gray-900">
                                                {new Date(2026, idx).toLocaleString('tr-TR', { month: 'long' })}
                                            </td>
                                            <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(row.brut)}</td>
                                            <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(row.net)}</td>
                                            <td className="py-3 px-4 text-right text-red-500">{formatCurrency(row.toplamKesinti)}</td>
                                            <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(row.gelirVergisi)}</td>
                                            <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(row.damgaVergisi)}</td>
                                            <td className="py-3 px-4 text-right text-blue-600">{formatCurrency(row.isverenMaliyet)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-blue-50 border-t border-blue-100 font-bold">
                                    <tr>
                                        <td className="py-3 px-4 text-blue-900">Yıllık Toplam</td>
                                        <td className="py-3 px-4 text-right text-blue-900">
                                            {formatCurrency(annualSchedule.reduce((a, b) => a + b.brut, 0))}
                                        </td>
                                        <td className="py-3 px-4 text-right text-green-700">
                                            {formatCurrency(annualSchedule.reduce((a, b) => a + b.net, 0))}
                                        </td>
                                        <td className="py-3 px-4 text-right text-red-700">
                                            {formatCurrency(annualSchedule.reduce((a, b) => a + b.toplamKesinti, 0))}
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-600">
                                            {formatCurrency(annualSchedule.reduce((a, b) => a + b.gelirVergisi, 0))}
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-600">
                                            {formatCurrency(annualSchedule.reduce((a, b) => a + b.damgaVergisi, 0))}
                                        </td>
                                        <td className="py-3 px-4 text-right text-blue-700">
                                            {formatCurrency(annualSchedule.reduce((a, b) => a + b.isverenMaliyet, 0))}
                                        </td>
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
