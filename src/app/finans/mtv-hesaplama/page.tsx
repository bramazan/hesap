"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    calculateMtv,
    VEHICLE_TYPES,
    ENGINE_SIZES_CARS,
    ENGINE_SIZES_MOTO,
    VehicleType,
    getVehicleValueRanges
} from "./mtv-data";
import { PremiumSelect } from "@/components/ui/premium-select";

// Format currency
const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const years = Array.from({ length: 47 }, (_, i) => 2026 - i); // 2026 down to 1980

export default function MtvHesaplama() {
    // Form States
    const [vehicleType, setVehicleType] = useState<VehicleType>("otomobil");
    const [year, setYear] = useState<number>(2026);
    const [engineSize, setEngineSize] = useState<string>(""); // e.g. "0-1300" -> logic will parse max
    const [engineSizeVal, setEngineSizeVal] = useState<number>(0); // actual value to pass
    const [vehicleValueRange, setVehicleValueRange] = useState<string>("");

    // Result State
    const [result, setResult] = useState<{ annual: number; installment: number; note?: string } | null>(null);

    // Get value options based on engine
    const currentValueOptions = getVehicleValueRanges(engineSizeVal);

    // Effect to calculate
    useEffect(() => {
        // Range string is "min" value
        const val = vehicleValueRange ? parseFloat(vehicleValueRange) : undefined;

        let calculated = null;
        if (engineSizeVal > 0) {
            calculated = calculateMtv(vehicleType, year, engineSizeVal, val);
        }
        setResult(calculated);
    }, [vehicleType, year, engineSizeVal, vehicleValueRange]);

    // Handlers
    const handleVehicleTypeChange = (val: string) => {
        setVehicleType(val as VehicleType);
        setEngineSize(""); // Reset engine size on type change
        setEngineSizeVal(0);
    };

    const handleEngineChange = (val: string) => {
        setEngineSize(val);
        // Extract max value from range roughly to pass to calculator
        // Format: "min-max" or "min+"
        if (!val) {
            setEngineSizeVal(0);
            return;
        }

        // We need to pass a representative value that falls into the bracket.
        // My simple logic uses "engineSizeVal" to match ranges.
        // Let's parse the string from the Select value options I will generate.
        // Actually, easier: The select value can be the "max" of the range or a representative middle.
        // Let's store the raw string in UI state, but parse `min` from it for logic? 
        // My `calculateMtv` takes a specific number like 1400.
        // So I'll pick the midpoint or min+1.

        // Logic: if "0-1300", pass 1000.
        // if "1301-1600", pass 1400.
        // Let's just pass the 'max' of the range (except for last one).
        // Actually, `mtv-data` checks `r.engineSizeMin <= engineSize && r.engineSizeMax >= engineSize`.
        // So passing the 'min' is safer.
        const parts = val.split("-");
        const min = parseInt(parts[0]);
        setEngineSizeVal(min);
        setVehicleValueRange(""); // Reset value selection
    };

    // Check if we need to show Value Input
    // Rule: Only for Cars, Registered >= 2018
    const showValueInput = vehicleType === "otomobil" && year >= 2018;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <main className="max-w-6xl mx-auto px-4 pt-10 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* LEFT COLUMN: Inputs & Info */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
                                <span>/</span>
                                <Link href="/tum-hesaplamalar?category=finans" className="hover:text-blue-600 transition-colors">Finans</Link>
                                <span>/</span>
                                <span className="text-gray-800">MTV Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                2026 MTV Hesaplama
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Aracınızın Motorlu Taşıtlar Vergisini güncel 2026 oranlarıyla hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">

                            {/* Vehicle Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Araç Tipi
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {VEHICLE_TYPES.map((t) => (
                                        <button
                                            key={t.value}
                                            onClick={() => handleVehicleTypeChange(t.value)}
                                            className={`h-12 px-2 rounded-xl border text-sm font-medium transition-all ${vehicleType === t.value
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Year Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    İlk Tescil Yılı
                                </label>
                                <PremiumSelect
                                    value={year.toString()}
                                    onChange={(val) => setYear(parseInt(val))}
                                    options={years.map(y => ({
                                        value: y.toString(),
                                        label: y.toString()
                                    }))}
                                    placeholder="Yıl Seçiniz"
                                />
                            </div>

                            {/* Engine Size */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Motor Hacmi
                                </label>
                                <PremiumSelect
                                    value={engineSize}
                                    onChange={handleEngineChange}
                                    placeholder="Motor Hacmi Seçiniz"
                                    options={(vehicleType === "motosiklet" ? ENGINE_SIZES_MOTO : ENGINE_SIZES_CARS).map((size) => ({
                                        value: `${size.min}-${size.max}`,
                                        label: size.label
                                    }))}
                                />
                            </div>

                            {/* Vehicle Value (Conditional - Range Select) */}
                            {showValueInput && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <PremiumSelect
                                        label="Araç Değeri (Kasko)"
                                        className="h-14"
                                        placeholder="Araç değer aralığını seçiniz"
                                        value={vehicleValueRange}
                                        onChange={setVehicleValueRange}
                                        options={currentValueOptions.map(o => ({
                                            value: o.min.toString(), // We use min value as ID
                                            label: o.label
                                        }))}
                                    />
                                    <p className="text-xs text-gray-400">Not: Aracın vergisiz piyasa değeri değil, kasko değer listesindeki değeri baz alınabilir.</p>
                                </div>
                            )}

                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Motorlu Taşıtlar Vergisi (MTV) tutarı aşağıdaki faktörlere göre belirlenir:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">Araç Tipi</p>
                                        <div className="text-sm">
                                            Otomobil, motosiklet, minibüs, panelvan vb. araç türlerine göre farklı tarifeler uygulanır.
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">Motor Hacmi</p>
                                        <div className="text-sm">
                                            Motor silindir hacmi (cc) büyüdükçe vergi tutarı artar. Kademeli dilimler uygulanır.
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">İlk Tescil Yaşı</p>
                                        <div className="text-sm">
                                            Aracın yaşı arttıkça MTV tutarı düşer. 1-3 yaş, 4-6 yaş gibi dilimler bulunur.
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">Taşıt Değeri (2018+)</p>
                                        <div className="text-sm">
                                            2018 ve sonrası tescilli araçlarda kasko değeri de MTV&apos;yi etkiler.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
                            <div className="space-y-4">
                                <details className="group bg-gray-50 rounded-xl overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                                        MTV ödemeleri ne zaman yapılır?
                                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-gray-600">
                                        Motorlu Taşıtlar Vergisi her yıl Ocak ve Temmuz aylarında olmak üzere iki eşit taksitte ödenir. İlk taksit 1-31 Ocak, ikinci taksit 1-31 Temmuz tarihleri arasındadır.
                                    </div>
                                </details>
                                <details className="group bg-gray-50 rounded-xl overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                                        Araç değeri MTV'yi nasıl etkiler?
                                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-gray-600">
                                        01.01.2018 tarihinden sonra tescil edilen otomobillerde MTV tutarı; motor silindir hacmi ve yaşın yanı sıra aracın &quot;taşıt değeri&quot;ne göre de değişmektedir. Daha yüksek değerli araçlar, aynı motor hacminde olsalar bile daha yüksek vergi dilimine girebilirler.
                                    </div>
                                </details>
                                <details className="group bg-gray-50 rounded-xl overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                                        MTV&apos;yi nereden ödeyebilirim?
                                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-gray-600">
                                        MTV ödemesi GİB (Gelir İdaresi Başkanlığı) internet sitesi, e-Devlet, banka şubeleri veya internet/mobil bankacılık üzerinden yapılabilir. Ayrıca anlaşmalı PTT şubeleri ve vergi dairelerinden de ödeme yapılabilir.
                                    </div>
                                </details>
                                <details className="group bg-gray-50 rounded-xl overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                                        Yeni alınan araçlarda MTV ne zaman başlar?
                                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-gray-600">
                                        Yeni alınan araçların MTV&apos;si, aracın tescil edildiği ay itibariyle başlar ve kalan aylar için orantılı olarak hesaplanır. Örneğin Mart ayında tescil edilen bir aracın ilk yıl MTV&apos;si, kalan 10 ay için hesaplanır.
                                    </div>
                                </details>
                                <details className="group bg-gray-50 rounded-xl overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                                        MTV ödenmezse ne olur?
                                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-gray-600">
                                        MTV zamanında ödenmediğinde gecikme zammı uygulanır. Ayrıca araç satışı ve devir işlemleri MTV borcu kapatılmadan yapılamaz. Uzun süreli ödenmeme durumunda haciz ve diğer yasal takip işlemleri başlatılabilir.
                                    </div>
                                </details>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Results */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-6 transition-all">

                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Hesaplama Sonucu</h2>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">2026 Tarifesi</span>
                            </div>

                            {/* Annual Amount */}
                            <div className="text-center space-y-2 py-4">
                                <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                    Yıllık Toplam MTV
                                </p>
                                {result ? (
                                    <div className="flex items-baseline justify-center gap-1 text-gray-900 animate-in zoom-in-50 duration-300">
                                        <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-600">
                                            ₺{formatCurrency(result.annual)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-bold text-gray-300">
                                        ---
                                    </div>
                                )}
                            </div>

                            {/* Installments */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <span className="block text-xs text-gray-400 uppercase font-semibold mb-1">Ocak Taksiti</span>
                                    <span className="block text-xl font-bold text-gray-900">
                                        {result ? `₺${formatCurrency(result.installment)}` : "-"}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <span className="block text-xs text-gray-400 uppercase font-semibold mb-1">Temmuz Taksiti</span>
                                    <span className="block text-xl font-bold text-gray-900">
                                        {result ? `₺${formatCurrency(result.installment)}` : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Note */}
                            {result?.note && (
                                <div className="bg-amber-50 text-amber-700 text-xs p-3 rounded-lg border border-amber-100">
                                    ℹ️ {result.note}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-2">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Çıktı Al
                                </button>
                            </div>

                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
                            <span>📅 2026 Güncel</span>
                            <span>🔒 Güvenli</span>
                            <span>⚡ Anlık Hesaplama</span>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
