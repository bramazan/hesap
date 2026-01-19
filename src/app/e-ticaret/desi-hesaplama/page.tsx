"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Format number with Turkish locale
const formatNumber = (num: number) => {
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(num);
};

const faqItems = [
    {
        question: "Desi nedir?",
        answer:
            "Desi, kargo işlemlerinde bir paketin hacimsel ağırlığını ifade eder. Kargo firmaları, taşıma ücretini belirlerken paketin gerçek ağırlığı ile desi değerini karşılaştırır ve hangisi büyükse ona göre ücretlendirme yapar.",
    },
    {
        question: "Desi nasıl hesaplanır?",
        answer:
            "Standart desi hesaplama formülü: (En x Boy x Yükseklik) / 3000 şeklindedir. Ölçüler santimetre (cm) cinsinden alınır.",
    },
    {
        question: "3000 sabiti nedir?",
        answer:
            "Uluslararası standartlarda ve Türkiye'deki kargo firmalarının çoğunda hacimsel ağırlık hesaplanırken kullanılan bölen katsayısıdır. Bazı durumlarda bu katsayı 4000 veya 5000 olarak da kullanılabilir.",
    },
    {
        question: "Ücret ağırlığı nedir?",
        answer:
            "Kargo fiyatlandırmasında kullanılan ağırlıktır. Paketin gerçek ağırlığı (kg) ile desisi (hacimsel ağırlığı) karşılaştırılır; hangisi daha yüksekse o değer 'ücret ağırlığı' olarak kabul edilir.",
    },
];

export default function DesiHesaplama() {
    // Inputs
    const [width, setWidth] = useState<string>("");
    const [length, setLength] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("1");
    const [divisor, setDivisor] = useState<number>(3000);

    // Results
    const [result, setResult] = useState<{
        volume: number;
        desi: number;
        totalDesi: number;
        chargeableWeight: number | null;
        chargeableType: 'desi' | 'weight' | null;
    } | null>(null);

    const calculate = () => {
        const w = parseFloat(width);
        const l = parseFloat(length);
        const h = parseFloat(height);
        const qty = parseInt(quantity) || 1;
        const kg = weight ? parseFloat(weight) : 0;

        if (!w || !l || !h) {
            setResult(null);
            return;
        }

        const volumeCm3 = w * l * h;
        const singleDesi = volumeCm3 / divisor;
        const totalDesi = singleDesi * qty;

        let chargeableWeight = null;
        let chargeableType: 'desi' | 'weight' | null = null;

        if (kg > 0) {
            const totalWeight = kg * qty;
            if (totalDesi > totalWeight) {
                chargeableWeight = totalDesi;
                chargeableType = 'desi';
            } else {
                chargeableWeight = totalWeight;
                chargeableType = 'weight';
            }
        }

        setResult({
            volume: volumeCm3,
            desi: singleDesi,
            totalDesi: totalDesi,
            chargeableWeight,
            chargeableType
        });
    };

    useEffect(() => {
        calculate();
    }, [width, length, height, weight, quantity, divisor]);

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
                                <Link href="/e-ticaret" className="hover:text-blue-600 transition-colors">
                                    E-Ticaret
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800">Desi Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Desi Hesaplama
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Kargolarınızın hacimsel ağırlığını (desi) kolayca hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Width */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        En (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(e.target.value)}
                                        placeholder="Örn: 30"
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal"
                                    />
                                </div>

                                {/* Length */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Boy (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        placeholder="Örn: 40"
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal"
                                    />
                                </div>

                                {/* Height */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Yükseklik (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="Örn: 20"
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Weight */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Ağırlık (kg)
                                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold normal-case">Opsiyonel</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="Örn: 5"
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal"
                                    />
                                    <p className="text-xs text-gray-400">Gerçek ağırlık ile karşılaştırma için.</p>
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Adet
                                    </label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="1"
                                        min="1"
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal"
                                    />
                                </div>
                            </div>

                            {/* Advanced Options Toggle */}
                            <div className="pt-2 border-t border-gray-100">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="text-gray-500 hover:text-gray-900 px-0 hover:bg-transparent">
                                            <span>Gelişmiş Ayarlar</span>
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4 bg-white" align="start">
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-900">Desi Böleni (Katsayı)</label>
                                                <select
                                                    value={divisor}
                                                    onChange={(e) => setDivisor(Number(e.target.value))}
                                                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                >
                                                    <option value={3000}>3000 (Standart - Yurtiçi)</option>
                                                    <option value={4000}>4000 (Bazı Kargo f.)</option>
                                                    <option value={5000}>5000 (Yurtdışı / Uçak)</option>
                                                </select>
                                                <p className="text-xs text-gray-500">
                                                    Çoğu yurtiçi kargo firması için standart 3000'dir.
                                                </p>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Desi hesaplaması, gönderinin hacmine göre belirlenen bir ağırlık değeridir.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">Formül</p>
                                        <div className="text-sm font-mono text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                                            (En x Boy x Yükseklik) / 3000
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">Karşılaştırma</p>
                                        <div className="text-sm">
                                            Gerçek ağırlık ile desi karşılaştırılır, büyük olan ücretlendirmeye esas alınır.
                                        </div>
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
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-[72px]">
                        {/* Floating Result Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-6 transition-all hover:-translate-y-1 duration-500">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Hesaplama Sonucu</h2>
                                <span className="text-xs text-gray-400">Anlık</span>
                            </div>

                            {result ? (
                                <>
                                    {/* Main Result: Desi */}
                                    <div className="text-center space-y-1 py-4">
                                        <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                            Hesaplanan Desi
                                        </p>
                                        <div className="flex items-baseline justify-center gap-2 text-gray-900">
                                            <span className="text-5xl font-extrabold tracking-tight text-blue-600">
                                                {formatNumber(result.totalDesi)}
                                            </span>
                                            <span className="text-xl font-semibold text-gray-400">
                                                Desi
                                            </span>
                                        </div>
                                        {parseInt(quantity) > 1 && (
                                            <p className="text-xs text-gray-400">
                                                ({quantity} adet ürün için toplam)
                                            </p>
                                        )}
                                    </div>

                                    {/* Chargeable Weight Alert */}
                                    {result.chargeableWeight !== null && (
                                        <div className={`rounded-xl p-4 border ${result.chargeableType === 'desi'
                                            ? 'bg-blue-50 border-blue-100'
                                            : 'bg-orange-50 border-orange-100'
                                            }`}>
                                            <div className="flex items-start gap-3">
                                                <Info className={`w-5 h-5 mt-0.5 ${result.chargeableType === 'desi' ? 'text-blue-600' : 'text-orange-600'
                                                    }`} />
                                                <div>
                                                    <p className={`font-bold text-sm ${result.chargeableType === 'desi' ? 'text-blue-800' : 'text-orange-800'
                                                        }`}>
                                                        Ücretlendirilecek Ağırlık: {formatNumber(result.chargeableWeight)} {result.chargeableType === 'desi' ? 'Desi' : 'Kg'}
                                                    </p>
                                                    <p className={`text-xs mt-1 ${result.chargeableType === 'desi' ? 'text-blue-600' : 'text-orange-600'
                                                        }`}>
                                                        {result.chargeableType === 'desi'
                                                            ? 'Desi değeri gerçek ağırlıktan (kg) daha yüksek olduğu için baz alınır.'
                                                            : 'Gerçek ağırlık (kg) desi değerinden daha yüksek olduğu için baz alınır.'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary Stats */}
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Tekil Desi</span>
                                            <span className="font-bold text-gray-900">{formatNumber(result.desi)} Desi</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Hacim (m³)</span>
                                            <span className="font-bold text-gray-900">{formatNumber(result.volume / 1000000)} m³</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                            <span className="text-gray-500">Kullanılan Katsayı</span>
                                            <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                                                /{divisor}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-6xl">📦</span>
                                    <p className="text-gray-500 mt-4">Ölçüleri girerek hesaplayın</p>
                                </div>
                            )}

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
                                        href="/finans/kdv-hesaplama"
                                        className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                    >
                                        KDV Hesaplama
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
                            <span>⚡ Anlık Sonuç</span>
                            <span>📏 Hassas Hesaplama</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

