"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// Format number with Turkish locale
const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
};

type Gender = "male" | "female";
type Goal = "lose" | "maintain" | "gain";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extreme";
type ProteinPref = "standard" | "high";
type FatPref = "low" | "moderate" | "high";

interface CalorieResult {
    bmr: number;
    bmrMethod: "mifflin" | "katch";
    tdee: number;
    activityMultiplier: number;
    targetCalories: number;
    dailyDeficit: number;
    weeklyWeightChange: number;
    protein: { grams: number; kcal: number };
    fat: { grams: number; kcal: number };
    carbs: { grams: number; kcal: number };
    warnings: string[];
}

const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; description: string; multiplier: number }[] = [
    { id: "sedentary", label: "Sedanter", description: "Masa başı, az hareket", multiplier: 1.2 },
    { id: "light", label: "Hafif Aktif", description: "Haftada 1-2 gün egzersiz", multiplier: 1.375 },
    { id: "moderate", label: "Orta Aktif", description: "Haftada 3-5 gün egzersiz", multiplier: 1.55 },
    { id: "very", label: "Çok Aktif", description: "Haftada 6-7 gün egzersiz", multiplier: 1.725 },
    { id: "extreme", label: "Aşırı Aktif", description: "Günde 2 antrenman veya ağır iş", multiplier: 1.9 },
];

const GOAL_OPTIONS: { id: Goal; label: string; icon: string }[] = [
    { id: "lose", label: "Kilo Ver", icon: "📉" },
    { id: "maintain", label: "Koru", icon: "⚖️" },
    { id: "gain", label: "Kilo Al", icon: "📈" },
];

const RATE_OPTIONS = [
    { value: 0.25, label: "%0.25/hafta", description: "Yavaş & Sürdürülebilir" },
    { value: 0.5, label: "%0.5/hafta", description: "Orta Hız" },
    { value: 0.75, label: "%0.75/hafta", description: "Hızlı" },
    { value: 1.0, label: "%1.0/hafta", description: "Çok Hızlı" },
];

const faqItems = [
    {
        question: "BMR (Bazal Metabolizma Hızı) nedir?",
        answer: "BMR, vücudunuzun hiçbir aktivite yapmadan, sadece yaşamsal fonksiyonları sürdürmek için harcadığı enerji miktarıdır. Nefes alma, kalp atışı, hücre yenilenmesi gibi temel işlevler için gerekli kaloriyi ifade eder.",
    },
    {
        question: "TDEE (Günlük Toplam Enerji Harcaması) nedir?",
        answer: "TDEE, BMR'ye günlük aktivitelerinizin (yürüyüş, egzersiz, iş) eklenmesiyle hesaplanan toplam günlük kalori ihtiyacınızdır. Kilo korumak için bu kadar kalori almanız gerekir.",
    },
    {
        question: "Mifflin–St Jeor formülü nedir?",
        answer: "1990'da geliştirilen ve günümüzde en doğru kabul edilen BMR hesaplama formülüdür. Yaş, boy, kilo ve cinsiyeti kullanarak bazal metabolizmayı hesaplar.",
    },
    {
        question: "Katch–McArdle formülü ne zaman kullanılır?",
        answer: "Vücut yağ oranınızı biliyorsanız, Katch–McArdle formülü daha kişiselleştirilmiş bir sonuç verir. Bu formül yağsız vücut kütlesini (LBM) baz alarak hesaplama yapar.",
    },
    {
        question: "Güvenli kilo verme hızı nedir?",
        answer: "Genel olarak haftada vücut ağırlığının %0.5-1'i kadar kilo vermek güvenli kabul edilir. Çok hızlı kilo vermek kas kaybına ve metabolizma yavaşlamasına neden olabilir.",
    },
];

export default function KaloriHesaplama() {
    // Temel bilgiler
    const [gender, setGender] = useState<Gender>("male");
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    // Opsiyonel
    const [bodyFat, setBodyFat] = useState("");

    // Aktivite
    const [activity, setActivity] = useState<ActivityLevel>("moderate");

    // Hedef
    const [goal, setGoal] = useState<Goal>("maintain");
    const [rate, setRate] = useState(0.5);

    // Makro tercihleri
    const [proteinPref, setProteinPref] = useState<ProteinPref>("standard");
    const [fatPref, setFatPref] = useState<FatPref>("moderate");

    // Gelişmiş seçenekler
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Parse inputs
    const ageNum = parseInt(age) || 0;
    const heightNum = parseFloat(height) || 0;
    const weightNum = parseFloat(weight) || 0;
    const bodyFatNum = bodyFat ? parseFloat(bodyFat) : null;

    // Calculate result
    const result = useMemo((): CalorieResult | null => {
        if (ageNum < 14 || ageNum > 90 || heightNum < 120 || heightNum > 230 || weightNum < 30 || weightNum > 250) {
            return null;
        }

        const warnings: string[] = [];

        // BMR Calculation
        let bmr: number;
        let bmrMethod: "mifflin" | "katch" = "mifflin";

        if (bodyFatNum !== null && bodyFatNum >= 3 && bodyFatNum <= 60) {
            // Katch–McArdle (yağ oranı varsa)
            const lbm = weightNum * (1 - bodyFatNum / 100);
            bmr = 370 + 21.6 * lbm;
            bmrMethod = "katch";
        } else {
            // Mifflin–St Jeor (varsayılan)
            if (gender === "male") {
                bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
            } else {
                bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
            }
        }

        // TDEE Calculation
        const activityData = ACTIVITY_LEVELS.find(a => a.id === activity)!;
        const tdee = bmr * activityData.multiplier;

        // Target Calories
        let dailyDeficit = 0;
        let weeklyWeightChange = 0;

        if (goal !== "maintain") {
            weeklyWeightChange = (weightNum * rate) / 100;
            dailyDeficit = (weeklyWeightChange * 7700) / 7; // 1 kg yağ ≈ 7700 kcal
        }

        let targetCalories = tdee;
        if (goal === "lose") {
            targetCalories = tdee - dailyDeficit;
        } else if (goal === "gain") {
            targetCalories = tdee + dailyDeficit;
        }

        // Warnings
        if (targetCalories < bmr && goal === "lose") {
            warnings.push("Hedef kalori BMR'nin altında. Bu sürdürülebilir olmayabilir.");
        }
        if (gender === "female" && targetCalories < 1200) {
            warnings.push("Kalori çok düşük. Uzman görüşü almanız önerilir.");
        }
        if (gender === "male" && targetCalories < 1500) {
            warnings.push("Kalori çok düşük. Uzman görüşü almanız önerilir.");
        }
        if (rate >= 1.0 && goal === "lose") {
            warnings.push("Çok hızlı kilo verme hedefi seçtiniz. Kas kaybı riski yüksek.");
        }

        // Makro Calculation
        // Protein
        let proteinPerKg = proteinPref === "standard" ? 1.6 : 2.2;
        let proteinGrams = weightNum * proteinPerKg;

        // Yağ oranı girildiyse LBM bazlı protein
        if (bodyFatNum !== null && bodyFatNum >= 3 && bodyFatNum <= 60 && proteinPref === "high") {
            const lbm = weightNum * (1 - bodyFatNum / 100);
            proteinGrams = lbm * 2.2;
        }

        const proteinKcal = proteinGrams * 4;

        // Yağ
        let fatPerKg = fatPref === "low" ? 0.6 : fatPref === "moderate" ? 0.8 : 1.0;
        let fatGrams = weightNum * fatPerKg;
        const fatKcal = fatGrams * 9;

        // Karbonhidrat (kalan)
        let carbKcal = targetCalories - proteinKcal - fatKcal;
        let carbGrams = carbKcal / 4;

        // Karb negatif çıkarsa düzelt
        if (carbGrams < 0) {
            warnings.push("Makro dağılımı ayarlandı. Kalori çok düşük veya protein/yağ çok yüksek.");
            // Yağı minimum'a çek
            fatGrams = weightNum * 0.6;
            const newFatKcal = fatGrams * 9;
            carbKcal = targetCalories - proteinKcal - newFatKcal;
            carbGrams = Math.max(0, carbKcal / 4);
        }

        return {
            bmr: Math.round(bmr),
            bmrMethod,
            tdee: Math.round(tdee),
            activityMultiplier: activityData.multiplier,
            targetCalories: Math.round(targetCalories),
            dailyDeficit: Math.round(dailyDeficit),
            weeklyWeightChange: Math.round(weeklyWeightChange * 100) / 100,
            protein: { grams: Math.round(proteinGrams), kcal: Math.round(proteinKcal) },
            fat: { grams: Math.round(fatGrams), kcal: Math.round(fatGrams * 9) },
            carbs: { grams: Math.round(carbGrams), kcal: Math.round(carbGrams * 4) },
            warnings,
        };
    }, [gender, ageNum, heightNum, weightNum, bodyFatNum, activity, goal, rate, proteinPref, fatPref]);

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
                                <Link href="/tum-hesaplamalar?category=saglik" className="hover:text-blue-600 transition-colors">
                                    Sağlık
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800">Kalori Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Kalori İhtiyacı Hesaplama
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Günlük kalori ihtiyacınızı ve makro besin dağılımınızı hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Gender Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Cinsiyet
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setGender("male")}
                                        className={`h-12 flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all ${gender === "male"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span>👨</span> Erkek
                                    </button>
                                    <button
                                        onClick={() => setGender("female")}
                                        className={`h-12 flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all ${gender === "female"
                                            ? "border-pink-500 bg-pink-50 text-pink-600"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span>👩</span> Kadın
                                    </button>
                                </div>
                            </div>

                            {/* Age, Height, Weight */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Yaş
                                    </label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="30"
                                        min="14"
                                        max="90"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Boy (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="175"
                                        min="120"
                                        max="230"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Kilo (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="75"
                                        min="30"
                                        max="250"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Body Fat (Optional) */}
                            <div className="space-y-2">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Vücut Yağ Oranı (%)
                                    </span>
                                    <span className="text-xs text-gray-400">Opsiyonel</span>
                                </label>
                                <input
                                    type="number"
                                    value={bodyFat}
                                    onChange={(e) => setBodyFat(e.target.value)}
                                    placeholder="Bilmiyorsanız boş bırakın"
                                    min="3"
                                    max="60"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                />
                                <p className="text-xs text-gray-400">
                                    Yağ oranı girdiğinizde daha kişisel sonuç için Katch–McArdle formülü kullanılır.
                                </p>
                            </div>

                            {/* Activity Level */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Aktivite Seviyesi
                                </label>
                                <div className="space-y-2">
                                    {ACTIVITY_LEVELS.map((level) => (
                                        <button
                                            key={level.id}
                                            onClick={() => setActivity(level.id)}
                                            className={`w-full p-4 flex items-center justify-between rounded-xl border text-left transition-all ${activity === level.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 bg-white hover:bg-gray-50"
                                                }`}
                                        >
                                            <div>
                                                <p className={`font-medium ${activity === level.id ? "text-blue-600" : "text-gray-700"}`}>
                                                    {level.label}
                                                </p>
                                                <p className="text-sm text-gray-400">{level.description}</p>
                                            </div>
                                            <span className={`text-sm font-bold ${activity === level.id ? "text-blue-600" : "text-gray-400"}`}>
                                                ×{level.multiplier}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Goal Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hedefiniz
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {GOAL_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setGoal(option.id)}
                                            className={`p-4 flex flex-col items-center gap-2 rounded-xl border text-sm font-medium transition-all ${goal === option.id
                                                ? option.id === "lose"
                                                    ? "border-red-500 bg-red-50 text-red-600"
                                                    : option.id === "gain"
                                                        ? "border-green-500 bg-green-50 text-green-600"
                                                        : "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="text-2xl">{option.icon}</span>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rate Selection (only for lose/gain) */}
                            {goal !== "maintain" && (
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Hedef Hızı
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {RATE_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setRate(option.value)}
                                                className={`p-3 flex flex-col items-center gap-1 rounded-xl border text-sm transition-all ${rate === option.value
                                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span className="font-bold">{option.label}</span>
                                                <span className="text-xs text-gray-400">{option.description}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                    Makro Tercihleri
                                </button>

                                {showAdvanced && (
                                    <div className="mt-4 space-y-6">
                                        {/* Protein Preference */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                Protein Tercihi
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => setProteinPref("standard")}
                                                    className={`p-3 rounded-xl border text-sm transition-all ${proteinPref === "standard"
                                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="font-bold">Standart</span>
                                                    <span className="text-xs text-gray-400 block">1.6 g/kg</span>
                                                </button>
                                                <button
                                                    onClick={() => setProteinPref("high")}
                                                    className={`p-3 rounded-xl border text-sm transition-all ${proteinPref === "high"
                                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="font-bold">Yüksek</span>
                                                    <span className="text-xs text-gray-400 block">2.0-2.2 g/kg</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Fat Preference */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                Yağ Tercihi
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <button
                                                    onClick={() => setFatPref("low")}
                                                    className={`p-3 rounded-xl border text-sm transition-all ${fatPref === "low"
                                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="font-bold">Düşük</span>
                                                    <span className="text-xs text-gray-400 block">0.6 g/kg</span>
                                                </button>
                                                <button
                                                    onClick={() => setFatPref("moderate")}
                                                    className={`p-3 rounded-xl border text-sm transition-all ${fatPref === "moderate"
                                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="font-bold">Orta</span>
                                                    <span className="text-xs text-gray-400 block">0.8 g/kg</span>
                                                </button>
                                                <button
                                                    onClick={() => setFatPref("high")}
                                                    className={`p-3 rounded-xl border text-sm transition-all ${fatPref === "high"
                                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="font-bold">Yüksek</span>
                                                    <span className="text-xs text-gray-400 block">1.0 g/kg</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Kalori ihtiyacınız aşağıdaki adımlarla hesaplanır:
                                </p>
                                <ol className="space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                        <span><strong>BMR Hesaplama:</strong> Mifflin–St Jeor formülü ile bazal metabolizma hesaplanır. Yağ oranı girerseniz Katch–McArdle kullanılır.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                        <span><strong>TDEE Hesaplama:</strong> BMR × Aktivite Katsayısı ile günlük toplam enerji harcaması bulunur.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                        <span><strong>Hedef Kalori:</strong> 1 kg yağ ≈ 7700 kcal formülüyle günlük açık/fazla hesaplanır.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                                        <span><strong>Makro Dağılımı:</strong> Protein ve yağ tercihlerinize göre gram ve kalori değerleri hesaplanır.</span>
                                    </li>
                                </ol>

                                <div className="bg-amber-50 rounded-xl p-4 mt-4 border border-amber-100">
                                    <p className="font-semibold text-amber-800 mb-2">⚠️ Tıbbi Uyarı</p>
                                    <p className="text-sm text-amber-700">
                                        Bu hesaplamalar tahminidir. Hamilelik, emzirme, ergenlik, diyabet veya tiroit gibi özel durumlarda mutlaka bir diyetisyen veya hekime danışın.
                                    </p>
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
                                <h2 className="text-lg font-semibold text-gray-800">Kalori Hesabı</h2>
                                <span className="text-xs text-gray-400">🔥</span>
                            </div>

                            {result ? (
                                <>
                                    {/* BMR Method Badge */}
                                    <div className="flex justify-center">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${result.bmrMethod === "katch"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {result.bmrMethod === "katch" ? "Katch–McArdle" : "Mifflin–St Jeor"}
                                        </span>
                                    </div>

                                    {/* Main Result */}
                                    <div className="text-center space-y-1 py-2">
                                        <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                            Hedef Günlük Kalori
                                        </p>
                                        <div className="flex items-baseline justify-center gap-2 text-gray-900">
                                            <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                                {formatNumber(result.targetCalories)}
                                            </span>
                                            <span className="text-xl text-gray-400">kcal</span>
                                        </div>
                                        {goal !== "maintain" && (
                                            <p className="text-sm text-gray-400">
                                                {goal === "lose" ? "📉" : "📈"} Haftalık ~{result.weeklyWeightChange} kg {goal === "lose" ? "kayıp" : "artış"}
                                            </p>
                                        )}
                                    </div>

                                    {/* BMR & TDEE */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">BMR</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatNumber(result.bmr)}</p>
                                            <p className="text-xs text-gray-400">kcal/gün</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">TDEE</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatNumber(result.tdee)}</p>
                                            <p className="text-xs text-gray-400">kcal/gün</p>
                                        </div>
                                    </div>

                                    {/* Macro Distribution */}
                                    <div className="space-y-3">
                                        <p className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Makro Dağılımı</p>

                                        {/* Protein */}
                                        <div className="bg-red-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🥩</span>
                                                    <span className="font-medium text-red-700">Protein</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-red-700">{result.protein.grams}g</span>
                                                    <span className="text-sm text-red-400 ml-2">({result.protein.kcal} kcal)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fat */}
                                        <div className="bg-yellow-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🧈</span>
                                                    <span className="font-medium text-yellow-700">Yağ</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-yellow-700">{result.fat.grams}g</span>
                                                    <span className="text-sm text-yellow-500 ml-2">({result.fat.kcal} kcal)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Carbs */}
                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🍞</span>
                                                    <span className="font-medium text-blue-700">Karbonhidrat</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-blue-700">{result.carbs.grams}g</span>
                                                    <span className="text-sm text-blue-400 ml-2">({result.carbs.kcal} kcal)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warnings */}
                                    {result.warnings.length > 0 && (
                                        <div className="bg-amber-50 rounded-xl p-4 space-y-2">
                                            <p className="text-sm font-medium text-amber-700">⚠️ Uyarılar</p>
                                            {result.warnings.map((warning, i) => (
                                                <p key={i} className="text-sm text-amber-600">{warning}</p>
                                            ))}
                                        </div>
                                    )}

                                    {/* Quick Summary Cards */}
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                                        <p className="text-sm font-medium text-gray-700 mb-3">🎯 Hızlı Özet</p>
                                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                            <div className="bg-white/80 rounded-lg p-2">
                                                <p className="text-gray-400">Koruma</p>
                                                <p className="font-bold text-gray-700">{formatNumber(result.tdee)}</p>
                                            </div>
                                            <div className="bg-white/80 rounded-lg p-2">
                                                <p className="text-gray-400">Verme</p>
                                                <p className="font-bold text-red-600">{formatNumber(result.tdee - 500)}</p>
                                            </div>
                                            <div className="bg-white/80 rounded-lg p-2">
                                                <p className="text-gray-400">Alma</p>
                                                <p className="font-bold text-green-600">{formatNumber(result.tdee + 300)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Related Calculators */}
                                    <div className="pt-2">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">İlgili Hesaplayıcılar</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href="/genel/yas-hesaplama"
                                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                            >
                                                Yaş Hesaplama
                                            </Link>
                                            <Link
                                                href="/finans/butce-planlama"
                                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                            >
                                                Bütçe Planlama
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-6xl">🔥</span>
                                    <p className="text-gray-500 mt-4">Bilgilerinizi girin</p>
                                    <p className="text-gray-400 text-sm mt-2">Yaş, boy ve kilonuzu girerek kalori ihtiyacınızı hesaplayın</p>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
                            <span>🔒 Güvenli</span>
                            <span>⚡ Anlık Hesaplama</span>
                            <span>🧬 Bilimsel Formül</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
