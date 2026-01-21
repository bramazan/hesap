"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Metadata } from "next";

// Format number with Turkish locale
const formatCurrency = (num: number) => {
    if (!isFinite(num) || isNaN(num)) return "0";
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const formatPercent = (num: number) => {
    if (!isFinite(num) || isNaN(num)) return "0";
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(num);
};

// Profile presets - ordered from low to high savings rate
const PROFILES = {
    minimum: { name: "Minimum", savingsRate: 0.10, flexRate: 0.20, description: "Asgari birikim" },
    dengeli: { name: "Dengeli", savingsRate: 0.25, flexRate: 0.15, description: "Denge odaklı plan" },
    hizli: { name: "Hızlı Birikim", savingsRate: 0.35, flexRate: 0.10, description: "Maksimum birikim" },
};

// Default expense ratios (as % of income)
const DEFAULT_RATIOS = {
    utilities: 0.06,      // Faturalar & iletişim
    food: 0.15,           // Gıda
    transport: 0.06,      // Ulaşım
    health: 0.03,         // Sağlık/Eğitim/Zorunlu diğer
};

// Warning thresholds
const THRESHOLDS = {
    housingIdeal: { min: 0.25, max: 0.35 },
    housingHigh: { min: 0.35, max: 0.40 },
    housingRisk: 0.40,
    savingsMin: 0.10,
    savingsBalanced: { min: 0.20, max: 0.25 },
    debtRisk: 0.40,
    flexLow: 0.05,
};

// Category types
interface BudgetCategory {
    id: string;
    name: string;
    icon: string;
    value: number;
    percent?: number;
    color: string;
}

interface Warning {
    type: "error" | "warning" | "info";
    message: string;
}

// FAQ items
const faqItems = [
    {
        question: "50/30/20 kuralı nedir?",
        answer: "50/30/20 kuralı, gelirinizin %50'sini ihtiyaçlara, %30'unu isteklere ve %20'sini birikim/borç ödemeye ayırmanızı önerir. Bu araç, Türkiye koşullarına uyarlanmış daha detaylı oranlar kullanır.",
    },
    {
        question: "Konut harcaması için ideal oran nedir?",
        answer: "Gelirinizin %25-35'i ideal konut harcaması oranıdır. %40'ın üzerine çıkması finansal risk oluşturabilir ve acil fon biriktirmenizi zorlaştırır.",
    },
    {
        question: "Birikim oranım ne kadar olmalı?",
        answer: "Minimum %10 birikim oranı hedeflemelisiniz. Dengeli bir finansal plan için %20-25, hızlı birikim için %30+ önerilir.",
    },
    {
        question: "Gelir dalgalıysa nasıl planlamalıyım?",
        answer: "Değişken gelirde son 3 ayın en düşük gelirini veya ortalamanın %90'ını 'plan geliri' olarak kullanmanız önerilir. Bu muhafazakâr yaklaşım beklenmedik giderlere karşı sizi korur.",
    },
];

export default function ButcePlanlama() {
    // Mode: 'quick' or 'detailed'
    const [mode, setMode] = useState<"quick" | "detailed">("quick");

    // Common inputs
    const [incomeInput, setIncomeInput] = useState("25.000");
    const [incomeType, setIncomeType] = useState<"fixed" | "variable">("fixed");
    const [variableIncomes, setVariableIncomes] = useState({ m1: "", m2: "", m3: "" });

    // Housing inputs
    const [housingType, setHousingType] = useState<"rent" | "mortgage" | "owned" | "suggest">("rent");
    const [housingInput, setHousingInput] = useState("7.500");

    // Debt & Profile (Quick mode)
    const [debtInput, setDebtInput] = useState("0");
    const [profile, setProfile] = useState<keyof typeof PROFILES>("dengeli");

    // Detailed mode inputs
    const [detailedExpenses, setDetailedExpenses] = useState({
        rent: "",
        maintenance: "",
        electricity: "",
        water: "",
        gas: "",
        internet: "",
        phone: "",
        market: "",
        dining: "",
        transport: "",
        health: "",
        education: "",
        insurance: "",
        subscriptions: "",
        creditPayments: "",
        cardPayments: "",
        savings: "",
    });
    const [yearlyExpenses, setYearlyExpenses] = useState({
        taxes: "",
        maintenance: "",
        vacation: "",
    });

    // Parse income
    const parseAmount = (val: string) => parseInt(val.replace(/\./g, "").replace(/,/g, "")) || 0;
    const income = parseAmount(incomeInput);
    const housing = parseAmount(housingInput);
    const debt = parseAmount(debtInput);

    // Calculate plan income for variable income
    const planIncome = useMemo(() => {
        if (incomeType === "fixed") return income;
        const m1 = parseAmount(variableIncomes.m1);
        const m2 = parseAmount(variableIncomes.m2);
        const m3 = parseAmount(variableIncomes.m3);
        if (m1 && m2 && m3) {
            // Conservative: use minimum
            return Math.min(m1, m2, m3);
        }
        return income;
    }, [income, incomeType, variableIncomes]);

    // Quick mode calculations
    const quickBudget = useMemo(() => {
        const I = planIncome;
        const profileConfig = PROFILES[profile];

        // Housing
        let K = housing;
        let suggestedHousing = null;
        if (housingType === "suggest" || housing === 0) {
            K = I * 0.30; // Default 30%
            suggestedHousing = {
                ideal: { min: I * 0.25, max: I * 0.35 },
                upperLimit: I * 0.40,
            };
        }

        // Calculate expenses based on ratios
        const U = I * DEFAULT_RATIOS.utilities;
        const F = I * DEFAULT_RATIOS.food;
        const T = I * DEFAULT_RATIOS.transport;
        const M = I * DEFAULT_RATIOS.health;
        const B = debt;

        // Savings target
        let S = Math.max(I * profileConfig.savingsRate, I * THRESHOLDS.savingsMin);

        // Remaining for flexible spending
        let W = I - (K + U + F + T + M + B + S);

        // Adjustments if negative
        const warnings: Warning[] = [];
        let deficit = 0;

        if (W < 0) {
            // First reduce flex to 0
            W = 0;
            const remaining = I - (K + U + F + T + M + B);

            if (remaining < I * THRESHOLDS.savingsMin) {
                // Critical deficit
                deficit = (K + U + F + T + M + B + I * THRESHOLDS.savingsMin) - I;
                S = Math.max(0, remaining);
                warnings.push({
                    type: "error",
                    message: `Bütçe açığı: Mevcut zorunlu giderler gelirinizi ₺${formatCurrency(deficit)} aşıyor.`,
                });
            } else {
                S = remaining;
                warnings.push({
                    type: "warning",
                    message: "Esnek harcama alanı kalmadı. Birikim hedefi düşürüldü.",
                });
            }
        }

        // Generate warnings based on thresholds
        const housingRatio = K / I;
        const debtRatio = B / I;
        const savingsRatio = S / I;
        const flexRatio = W / I;

        if (housingRatio > THRESHOLDS.housingRisk) {
            warnings.push({
                type: "error",
                message: `Konut yükü riskli (${formatPercent(housingRatio * 100)}%). Hedef: ≤%40`,
            });
        } else if (housingRatio > THRESHOLDS.housingHigh.min) {
            warnings.push({
                type: "warning",
                message: `Konut yükü yüksek (${formatPercent(housingRatio * 100)}%). İdeal: %25-35`,
            });
        }

        if (debtRatio > THRESHOLDS.debtRisk) {
            warnings.push({
                type: "error",
                message: `Borç yükü riskli (${formatPercent(debtRatio * 100)}%). Nakit akışı tehlikede.`,
            });
        }

        if (savingsRatio < THRESHOLDS.savingsMin) {
            warnings.push({
                type: "warning",
                message: `Birikim oranı minimumun altında (${formatPercent(savingsRatio * 100)}%). Hedef: ≥%10`,
            });
        }

        if (flexRatio < THRESHOLDS.flexLow && W > 0) {
            warnings.push({
                type: "info",
                message: "Esnek alan düşük. Beklenmedik giderler için risk oluşturabilir.",
            });
        }

        const categories: BudgetCategory[] = [
            { id: "housing", name: "Konut", icon: "🏠", value: K, percent: (K / I) * 100, color: "#3B82F6" },
            { id: "utilities", name: "Faturalar & İletişim", icon: "📱", value: U, percent: (U / I) * 100, color: "#8B5CF6" },
            { id: "food", name: "Gıda", icon: "🍽️", value: F, percent: (F / I) * 100, color: "#10B981" },
            { id: "transport", name: "Ulaşım", icon: "🚗", value: T, percent: (T / I) * 100, color: "#F59E0B" },
            { id: "health", name: "Sağlık/Eğitim", icon: "🏥", value: M, percent: (M / I) * 100, color: "#EC4899" },
            { id: "debt", name: "Borç Ödemeleri", icon: "💳", value: B, percent: (B / I) * 100, color: "#EF4444" },
            { id: "savings", name: "Birikim", icon: "💰", value: S, percent: (S / I) * 100, color: "#14B8A6" },
            { id: "flex", name: "Esnek Harcama", icon: "🎯", value: W, percent: (W / I) * 100, color: "#6366F1" },
        ];

        const dailyFlex = W / 30;

        return {
            income: I,
            categories,
            totalExpense: K + U + F + T + M + B + S + W,
            savings: S,
            flex: W,
            dailyFlex,
            warnings,
            suggestedHousing,
            deficit,
        };
    }, [planIncome, housing, housingType, debt, profile]);

    // Detailed mode calculations
    const detailedBudget = useMemo(() => {
        const I = planIncome;

        // Parse all expenses
        const expenses = {
            housing: parseAmount(detailedExpenses.rent) + parseAmount(detailedExpenses.maintenance),
            utilities: parseAmount(detailedExpenses.electricity) + parseAmount(detailedExpenses.water) +
                parseAmount(detailedExpenses.gas) + parseAmount(detailedExpenses.internet) +
                parseAmount(detailedExpenses.phone),
            food: parseAmount(detailedExpenses.market) + parseAmount(detailedExpenses.dining),
            transport: parseAmount(detailedExpenses.transport),
            health: parseAmount(detailedExpenses.health) + parseAmount(detailedExpenses.education) +
                parseAmount(detailedExpenses.insurance),
            subscriptions: parseAmount(detailedExpenses.subscriptions),
            debt: parseAmount(detailedExpenses.creditPayments) + parseAmount(detailedExpenses.cardPayments),
            savings: parseAmount(detailedExpenses.savings),
        };

        // Yearly expenses distributed monthly
        const yearlyMonthly = {
            taxes: parseAmount(yearlyExpenses.taxes) / 12,
            maintenance: parseAmount(yearlyExpenses.maintenance) / 12,
            vacation: parseAmount(yearlyExpenses.vacation) / 12,
        };
        const yearlyTotal = yearlyMonthly.taxes + yearlyMonthly.maintenance + yearlyMonthly.vacation;

        const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0) + yearlyTotal;
        const remaining = I - totalExpense;

        const warnings: Warning[] = [];

        // Calculate ratios
        const housingRatio = expenses.housing / I;
        const debtRatio = expenses.debt / I;
        const savingsRatio = expenses.savings / I;

        if (remaining < 0) {
            warnings.push({
                type: "error",
                message: `Bütçe açığı: Giderler gelirinizi ₺${formatCurrency(Math.abs(remaining))} aşıyor.`,
            });
        }

        if (housingRatio > THRESHOLDS.housingRisk) {
            warnings.push({
                type: "error",
                message: `Konut yükü riskli (${formatPercent(housingRatio * 100)}%).`,
            });
        }

        if (debtRatio > THRESHOLDS.debtRisk) {
            warnings.push({
                type: "error",
                message: `Borç yükü riskli (${formatPercent(debtRatio * 100)}%).`,
            });
        }

        if (savingsRatio < THRESHOLDS.savingsMin && expenses.savings > 0) {
            warnings.push({
                type: "warning",
                message: `Birikim oranı düşük (${formatPercent(savingsRatio * 100)}%). Hedef: ≥%10`,
            });
        }

        const categories: BudgetCategory[] = [
            { id: "housing", name: "Konut", icon: "🏠", value: expenses.housing, percent: (expenses.housing / I) * 100, color: "#3B82F6" },
            { id: "utilities", name: "Faturalar & İletişim", icon: "📱", value: expenses.utilities, percent: (expenses.utilities / I) * 100, color: "#8B5CF6" },
            { id: "food", name: "Gıda", icon: "🍽️", value: expenses.food, percent: (expenses.food / I) * 100, color: "#10B981" },
            { id: "transport", name: "Ulaşım", icon: "🚗", value: expenses.transport, percent: (expenses.transport / I) * 100, color: "#F59E0B" },
            { id: "health", name: "Sağlık/Eğitim", icon: "🏥", value: expenses.health, percent: (expenses.health / I) * 100, color: "#EC4899" },
            { id: "subscriptions", name: "Abonelikler", icon: "📺", value: expenses.subscriptions, percent: (expenses.subscriptions / I) * 100, color: "#A855F7" },
            { id: "debt", name: "Borç Ödemeleri", icon: "💳", value: expenses.debt, percent: (expenses.debt / I) * 100, color: "#EF4444" },
            { id: "savings", name: "Birikim", icon: "💰", value: expenses.savings, percent: (expenses.savings / I) * 100, color: "#14B8A6" },
            { id: "yearly", name: "Yıllık (Aylık)", icon: "📅", value: yearlyTotal, percent: (yearlyTotal / I) * 100, color: "#64748B" },
        ];

        return {
            income: I,
            categories: categories.filter(c => c.value > 0),
            totalExpense,
            remaining,
            savings: expenses.savings,
            warnings,
        };
    }, [planIncome, detailedExpenses, yearlyExpenses]);

    const budget = mode === "quick" ? quickBudget : detailedBudget;

    // Transfer quick plan to detailed
    const transferToDetailed = () => {
        setDetailedExpenses({
            rent: formatCurrency(quickBudget.categories.find(c => c.id === "housing")?.value || 0),
            maintenance: "",
            electricity: formatCurrency((quickBudget.categories.find(c => c.id === "utilities")?.value || 0) * 0.4),
            water: formatCurrency((quickBudget.categories.find(c => c.id === "utilities")?.value || 0) * 0.1),
            gas: formatCurrency((quickBudget.categories.find(c => c.id === "utilities")?.value || 0) * 0.3),
            internet: formatCurrency((quickBudget.categories.find(c => c.id === "utilities")?.value || 0) * 0.15),
            phone: formatCurrency((quickBudget.categories.find(c => c.id === "utilities")?.value || 0) * 0.05),
            market: formatCurrency((quickBudget.categories.find(c => c.id === "food")?.value || 0) * 0.7),
            dining: formatCurrency((quickBudget.categories.find(c => c.id === "food")?.value || 0) * 0.3),
            transport: formatCurrency(quickBudget.categories.find(c => c.id === "transport")?.value || 0),
            health: formatCurrency(quickBudget.categories.find(c => c.id === "health")?.value || 0),
            education: "",
            insurance: "",
            subscriptions: "",
            creditPayments: formatCurrency((quickBudget.categories.find(c => c.id === "debt")?.value || 0) * 0.7),
            cardPayments: formatCurrency((quickBudget.categories.find(c => c.id === "debt")?.value || 0) * 0.3),
            savings: formatCurrency(quickBudget.savings),
        });
        setMode("detailed");
    };

    // Input handler with formatting
    const handleAmountInput = (value: string, setter: (v: string) => void) => {
        const cleaned = value.replace(/\./g, "").replace(/,/g, "");
        if (/^\d*$/.test(cleaned)) {
            setter(cleaned ? formatCurrency(parseInt(cleaned)) : "");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
                                <span className="text-gray-800">Bütçe Planlama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Bütçe Planlama Aracı
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Gelirinize uygun, akıllı bir aylık bütçe oluşturun.
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-2">
                            <button
                                onClick={() => setMode("quick")}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${mode === "quick"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <span>✨</span>
                                    <span>Hızlı Plan</span>
                                </span>
                                <span className="text-xs opacity-75 block mt-0.5">Benim için planla</span>
                            </button>
                            <button
                                onClick={() => setMode("detailed")}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${mode === "detailed"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <span>📝</span>
                                    <span>Detaylı Plan</span>
                                </span>
                                <span className="text-xs opacity-75 block mt-0.5">Kendi bütçemi giriyorum</span>
                            </button>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Income Input */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Aylık Net Gelir
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIncomeType("fixed")}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${incomeType === "fixed"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                        >
                                            Sabit
                                        </button>
                                        <button
                                            onClick={() => setIncomeType("variable")}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${incomeType === "variable"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                        >
                                            Dalgalı
                                        </button>
                                    </div>
                                </div>

                                {incomeType === "fixed" ? (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-medium">₺</span>
                                        </div>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={incomeInput}
                                            onChange={(e) => handleAmountInput(e.target.value, setIncomeInput)}
                                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                            placeholder="25.000"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        {["m1", "m2", "m3"].map((m, i) => (
                                            <div key={m} className="space-y-1">
                                                <label className="text-xs text-gray-500">{i + 1}. Ay</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={variableIncomes[m as keyof typeof variableIncomes]}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\./g, "");
                                                            if (/^\d*$/.test(val)) {
                                                                setVariableIncomes(prev => ({
                                                                    ...prev,
                                                                    [m]: val ? formatCurrency(parseInt(val)) : "",
                                                                }));
                                                            }
                                                        }}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                                        placeholder="20.000"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {incomeType === "variable" && planIncome > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                                        <span>💡</span>
                                        <span>Plan geliri (muhafazakâr): <strong>₺{formatCurrency(planIncome)}</strong></span>
                                    </div>
                                )}
                            </div>

                            {mode === "quick" && (
                                <>
                                    {/* Housing Type */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Konut Durumu
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: "rent", label: "Kira Ödüyorum", icon: "🏠" },
                                                { id: "mortgage", label: "Konut Kredisi", icon: "🏦" },
                                                { id: "owned", label: "Ev Sahibiyim", icon: "🏡" },
                                                { id: "suggest", label: "Sen Öner", icon: "✨" },
                                            ].map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setHousingType(option.id as typeof housingType)}
                                                    className={`p-3 rounded-xl border text-left transition-all ${housingType === option.id
                                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="text-lg">{option.icon}</span>
                                                    <span className="text-sm font-medium ml-2">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {housingType !== "suggest" && (
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="text-gray-400 font-medium">₺</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={housingInput}
                                                    onChange={(e) => handleAmountInput(e.target.value, setHousingInput)}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                                    placeholder={housingType === "owned" ? "Aidat (opsiyonel)" : "Kira + Aidat"}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Debt Input */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Aylık Borç Ödemeleri
                                        </label>
                                        <p className="text-xs text-gray-500 -mt-2">Kredi taksitleri + Kart asgari ödemeleri</p>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-400 font-medium">₺</span>
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={debtInput}
                                                onChange={(e) => handleAmountInput(e.target.value, setDebtInput)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Profile Selection */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Hedef Profili
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {Object.entries(PROFILES).map(([key, val]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setProfile(key as keyof typeof PROFILES)}
                                                    className={`p-4 rounded-xl border text-center transition-all ${profile === key
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className={`text-lg font-bold ${profile === key ? "text-blue-700" : "text-gray-700"}`}>
                                                        {val.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{val.description}</div>
                                                    <div className="text-xs font-medium text-gray-400 mt-2">
                                                        Birikim: %{(val.savingsRate * 100).toFixed(0)}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {mode === "detailed" && (
                                <div className="space-y-6">
                                    {/* Detailed expense inputs grouped by category */}
                                    {[
                                        {
                                            title: "Konut",
                                            icon: "🏠",
                                            fields: [
                                                { key: "rent", label: "Kira / Kredi Taksidi" },
                                                { key: "maintenance", label: "Aidat" },
                                            ],
                                        },
                                        {
                                            title: "Faturalar & İletişim",
                                            icon: "📱",
                                            fields: [
                                                { key: "electricity", label: "Elektrik" },
                                                { key: "water", label: "Su" },
                                                { key: "gas", label: "Doğalgaz" },
                                                { key: "internet", label: "İnternet" },
                                                { key: "phone", label: "Telefon" },
                                            ],
                                        },
                                        {
                                            title: "Gıda",
                                            icon: "🍽️",
                                            fields: [
                                                { key: "market", label: "Market" },
                                                { key: "dining", label: "Dışarıda Yeme" },
                                            ],
                                        },
                                        {
                                            title: "Zorunlu Giderler",
                                            icon: "🚗",
                                            fields: [
                                                { key: "transport", label: "Ulaşım" },
                                                { key: "health", label: "Sağlık" },
                                                { key: "education", label: "Eğitim" },
                                                { key: "insurance", label: "Sigorta" },
                                            ],
                                        },
                                        {
                                            title: "Borç & Abonelikler",
                                            icon: "💳",
                                            fields: [
                                                { key: "creditPayments", label: "Kredi Taksitleri" },
                                                { key: "cardPayments", label: "Kart Ödemeleri" },
                                                { key: "subscriptions", label: "Abonelikler" },
                                            ],
                                        },
                                        {
                                            title: "Birikim",
                                            icon: "💰",
                                            fields: [
                                                { key: "savings", label: "Hedef Birikim" },
                                            ],
                                        },
                                    ].map((group) => (
                                        <div key={group.title} className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <span>{group.icon}</span>
                                                <span>{group.title}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {group.fields.map((field) => (
                                                    <div key={field.key} className="space-y-1">
                                                        <label className="text-xs text-gray-500">{field.label}</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <span className="text-gray-400 text-sm">₺</span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={detailedExpenses[field.key as keyof typeof detailedExpenses]}
                                                                onChange={(e) => {
                                                                    const val = e.target.value.replace(/\./g, "");
                                                                    if (/^\d*$/.test(val)) {
                                                                        setDetailedExpenses(prev => ({
                                                                            ...prev,
                                                                            [field.key]: val ? formatCurrency(parseInt(val)) : "",
                                                                        }));
                                                                    }
                                                                }}
                                                                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Yearly Expenses */}
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <span>📅</span>
                                            <span>Yıllık Ödemeler (Aya Bölünecek)</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { key: "taxes", label: "Vergiler" },
                                                { key: "maintenance", label: "Bakım/Onarım" },
                                                { key: "vacation", label: "Tatil" },
                                            ].map((field) => (
                                                <div key={field.key} className="space-y-1">
                                                    <label className="text-xs text-gray-500">{field.label}</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <span className="text-gray-400 text-sm">₺</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            value={yearlyExpenses[field.key as keyof typeof yearlyExpenses]}
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/\./g, "");
                                                                if (/^\d*$/.test(val)) {
                                                                    setYearlyExpenses(prev => ({
                                                                        ...prev,
                                                                        [field.key]: val ? formatCurrency(parseInt(val)) : "",
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Bütçe planlama aracı, gelirinizi analiz ederek <strong>akıllı bir harcama planı</strong> oluşturur.
                                    İki farklı mod sunuyoruz:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <h3 className="font-bold text-blue-800 mb-2">✨ Hızlı Plan</h3>
                                        <p className="text-sm text-blue-700">
                                            Minimum bilgiyle otomatik bütçe önerisi alın. Sistem, onaylanmış oranlarla
                                            kategorilere dağılım yapar.
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <h3 className="font-bold text-purple-800 mb-2">📝 Detaylı Plan</h3>
                                        <p className="text-sm text-purple-700">
                                            Giderlerinizi kalem kalem girin, sistem analiz edip
                                            iyileştirme önerileri sunsun.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                                    <p className="font-medium text-gray-800 mb-2">📊 Önerilen Oranlar:</p>
                                    <ul className="space-y-1 text-gray-600">
                                        <li>• Konut: Gelirin %25-35'i (maksimum %40)</li>
                                        <li>• Birikim: Minimum %10 (ideal %20-25)</li>
                                        <li>• Borç yükü: Maksimum %40</li>
                                    </ul>
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
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {mode === "quick" ? "Önerilen Bütçe" : "Bütçe Analizi"}
                                </h2>
                                <span className="text-xs text-gray-400">Anlık</span>
                            </div>

                            {/* Warnings */}
                            {budget.warnings.length > 0 && (
                                <div className="space-y-2">
                                    {budget.warnings.map((warning, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-2 p-3 rounded-lg text-sm ${warning.type === "error"
                                                ? "bg-red-50 text-red-700"
                                                : warning.type === "warning"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-blue-50 text-blue-700"
                                                }`}
                                        >
                                            <span>
                                                {warning.type === "error" ? "⚠️" : warning.type === "warning" ? "💡" : "ℹ️"}
                                            </span>
                                            <span>{warning.message}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Suggested Housing (Quick mode) */}
                            {mode === "quick" && quickBudget.suggestedHousing && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-2">
                                    <p className="text-sm font-medium text-blue-800">💡 Önerilen Konut Bütçesi</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">İdeal:</span>
                                            <span className="font-bold text-gray-800 ml-1">
                                                ₺{formatCurrency(quickBudget.suggestedHousing.ideal.min)} - ₺{formatCurrency(quickBudget.suggestedHousing.ideal.max)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Üst Sınır:</span>
                                            <span className="font-bold text-orange-600 ml-1">
                                                ₺{formatCurrency(quickBudget.suggestedHousing.upperLimit)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Budget Breakdown Chart */}
                            <div className="space-y-4">
                                {budget.categories.map((cat) => (
                                    <div key={cat.id} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{cat.icon}</span>
                                                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-gray-900">₺{formatCurrency(cat.value)}</span>
                                                <span className="text-xs text-gray-400 ml-1">(%{formatPercent(cat.percent || 0)})</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(cat.percent || 0, 100)}%`,
                                                    backgroundColor: cat.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Stats */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Aylık Gelir</span>
                                    <span className="font-bold text-gray-900">₺{formatCurrency(planIncome)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Toplam Planlanan</span>
                                    <span className="font-bold text-gray-900">₺{formatCurrency(budget.totalExpense)}</span>
                                </div>
                                {mode === "detailed" && (
                                    <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                        <span className="text-gray-700 font-medium">Kalan</span>
                                        <span className={`font-bold ${(detailedBudget.remaining || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            ₺{formatCurrency(detailedBudget.remaining || 0)}
                                        </span>
                                    </div>
                                )}
                                {mode === "quick" && quickBudget.dailyFlex > 0 && (
                                    <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                        <span className="text-gray-700 font-medium">Günlük Esnek Limit</span>
                                        <span className="font-bold text-indigo-600">₺{formatCurrency(quickBudget.dailyFlex)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-2">
                                {mode === "quick" && (
                                    <button
                                        onClick={transferToDetailed}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Detaylı Plana Aktar</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                                {mode === "detailed" && (
                                    <button
                                        onClick={() => {
                                            setDetailedExpenses({
                                                rent: "", maintenance: "", electricity: "", water: "", gas: "",
                                                internet: "", phone: "", market: "", dining: "", transport: "",
                                                health: "", education: "", insurance: "", subscriptions: "",
                                                creditPayments: "", cardPayments: "", savings: "",
                                            });
                                            setYearlyExpenses({ taxes: "", maintenance: "", vacation: "" });
                                        }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Sıfırla</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    <span>Yazdır / PDF Kaydet</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
                            <span>🔒 Verileriniz Cihazınızda</span>
                            <span>⚡ Anlık Hesaplama</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
