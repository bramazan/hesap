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

// Turkish VAT rates
const KDV_RATES = [
    { value: 1, label: "%1", description: "Gazete, dergi, kitap" },
    { value: 10, label: "%10", description: "Temel gıda, eğitim, sağlık" },
    { value: 20, label: "%20", description: "Genel oran" },
];

type Mode = "kdv-haric" | "kdv-dahil";

const faqItems = [
    {
        question: "Türkiye'de KDV oranları nelerdir?",
        answer:
            "Türkiye'de üç farklı KDV oranı uygulanmaktadır: %1 (gazete, dergi, kitap), %10 (temel gıda, eğitim, sağlık hizmetleri), %20 (genel oran - çoğu mal ve hizmet).",
    },
    {
        question: "KDV dahil fiyattan KDV nasıl hesaplanır?",
        answer:
            "KDV Hariç = KDV Dahil Fiyat ÷ (1 + KDV Oranı/100). Örneğin 1200₺ KDV dahil fiyat için %20 KDV: 1200 ÷ 1.20 = 1000₺ KDV hariç, 200₺ KDV tutarı.",
    },
    {
        question: "KDV hariç fiyata KDV nasıl eklenir?",
        answer:
            "KDV Dahil = KDV Hariç × (1 + KDV Oranı/100). Örneğin 1000₺'ye %20 KDV eklemek için: 1000 × 1.20 = 1200₺ KDV dahil fiyat.",
    },
    {
        question: "Hangi ürünlerde %1 KDV uygulanır?",
        answer:
            "Gazete, dergi, kitap ve benzeri basılı yayınlarda %1 oranında KDV uygulanmaktadır.",
    },
];

export default function KdvHesaplama() {
    const [amountInput, setAmountInput] = useState("1.000");
    const [selectedRate, setSelectedRate] = useState(20);
    const [customRate, setCustomRate] = useState("");
    const [mode, setMode] = useState<Mode>("kdv-haric");

    // Parse amount safely
    const amount = parseFloat(amountInput.replace(/\./g, "").replace(",", ".")) || 0;

    // Get active rate
    const activeRate = customRate ? (parseFloat(customRate.replace(",", ".")) || 0) : selectedRate;
    const isCustomRate = customRate !== "" && !KDV_RATES.some(r => r.value === activeRate);

    // Calculate KDV
    let kdvHaric: number, kdvTutari: number, kdvDahil: number;

    if (mode === "kdv-haric") {
        kdvHaric = amount;
        kdvTutari = (amount * activeRate) / 100;
        kdvDahil = amount + kdvTutari;
    } else {
        kdvDahil = amount;
        kdvHaric = amount / (1 + activeRate / 100);
        kdvTutari = amount - kdvHaric;
    }

    // Calculate percentages for visualization
    const kdvPercent = kdvDahil > 0 ? Math.round((kdvTutari / kdvDahil) * 100) : 0;

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
                                <span className="text-gray-800">KDV Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                KDV Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                KDV dahil veya hariç fiyatı anında hesaplayın.
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
                                        onClick={() => setMode("kdv-haric")}
                                        className={`h-14 flex flex-col items-center justify-center rounded-xl border text-sm font-medium transition-all ${mode === "kdv-haric"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="font-bold">KDV Ekle</span>
                                        <span className="text-xs opacity-70">Hariç → Dahil</span>
                                    </button>
                                    <button
                                        onClick={() => setMode("kdv-dahil")}
                                        className={`h-14 flex flex-col items-center justify-center rounded-xl border text-sm font-medium transition-all ${mode === "kdv-dahil"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="font-bold">KDV Çıkar</span>
                                        <span className="text-xs opacity-70">Dahil → Hariç</span>
                                    </button>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        {mode === "kdv-haric" ? "KDV Hariç Tutar" : "KDV Dahil Tutar"}
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
                                        inputMode="decimal"
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
                                        min="100"
                                        max="100000"
                                        step="100"
                                        value={Math.min(Math.max(amount, 100), 100000)}
                                        onChange={(e) => setAmountInput(formatNumber(parseInt(e.target.value)))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-gray-400">
                                        <span>100 ₺</span>
                                        <span>100.000 ₺</span>
                                    </div>
                                </div>
                            </div>

                            {/* KDV Rate Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    KDV Oranı
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {KDV_RATES.map((rate) => (
                                        <button
                                            key={rate.value}
                                            onClick={() => {
                                                setSelectedRate(rate.value);
                                                setCustomRate("");
                                            }}
                                            className={`h-16 flex flex-col items-center justify-center rounded-xl border text-sm font-medium transition-all ${selectedRate === rate.value && !customRate
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="font-bold text-lg">{rate.label}</span>
                                            <span className="text-xs opacity-70 text-center px-1 leading-tight">{rate.description}</span>
                                        </button>
                                    ))}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="Özel"
                                            value={customRate}
                                            onChange={(e) => setCustomRate(e.target.value)}
                                            className={`w-full h-16 px-3 rounded-xl border text-center font-bold transition-all outline-none ${customRate
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600"
                                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                                        />
                                        {customRate && (
                                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-blue-500">
                                                Özel oran
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isCustomRate && (
                                    <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                                        ⚠️ Girdiğiniz %{activeRate} oranı Türkiye'deki standart KDV oranları arasında değil.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    KDV (Katma Değer Vergisi) hesaplaması iki şekilde yapılır:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">KDV Ekleme</p>
                                        <div className="font-mono text-sm">
                                            KDV Dahil = Tutar × (1 + Oran/100)
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">KDV Çıkarma</p>
                                        <div className="font-mono text-sm">
                                            KDV Hariç = Tutar ÷ (1 + Oran/100)
                                        </div>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Örnek:</span>
                                        <span>1000₺'ye %20 KDV eklemek: 1000 × 1.20 = 1200₺</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">Örnek:</span>
                                        <span>1200₺'den %20 KDV çıkarmak: 1200 ÷ 1.20 = 1000₺</span>
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
                                    {mode === "kdv-haric" ? "KDV Dahil Fiyat" : "KDV Hariç Fiyat"}
                                </p>
                                <div className="flex items-baseline justify-center gap-1 text-gray-900">
                                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                        ₺{formatCurrency(mode === "kdv-haric" ? kdvDahil : kdvHaric).split(",")[0]}
                                    </span>
                                    <span className="text-xl font-semibold text-gray-400">
                                        ,{formatCurrency(mode === "kdv-haric" ? kdvDahil : kdvHaric).split(",")[1]}
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
                                            strokeDasharray={`${100 - kdvPercent}, 100`}
                                            strokeWidth="3"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xs text-gray-400">KDV</span>
                                        <span className="text-lg font-bold text-gray-800">%{activeRate}</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase">KDV Hariç</span>
                                            <span className="text-sm font-bold text-gray-800">
                                                ₺{formatCurrency(kdvHaric)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase">KDV Tutarı</span>
                                            <span className="text-sm font-bold text-orange-500">
                                                ₺{formatCurrency(kdvTutari)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">KDV Hariç Tutar</span>
                                    <span className="font-bold text-gray-900">₺{formatCurrency(kdvHaric)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">KDV Tutarı (%{activeRate})</span>
                                    <span className="font-bold text-orange-500">₺{formatCurrency(kdvTutari)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">KDV Dahil Tutar</span>
                                    <span className="font-bold text-green-600">₺{formatCurrency(kdvDahil)}</span>
                                </div>
                            </div>

                            {/* KDV Rate Info */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-xs text-blue-600 uppercase tracking-wider mb-2 font-semibold">Seçili KDV Oranı</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-700">%{activeRate}</span>
                                    <span className="text-sm text-blue-600">
                                        {KDV_RATES.find(r => r.value === activeRate)?.description || "Özel oran"}
                                    </span>
                                </div>
                            </div>

                            {/* Related Calculators */}
                            <div className="pt-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">İlgili Hesaplayıcılar</p>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href="/genel/yuzde-hesaplama"
                                        className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                    >
                                        Yüzde Hesaplama
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
