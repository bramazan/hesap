"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    ZODIAC_SIGNS,
    TURKEY_CITIES,
    MONTHS_TR,
    getSunSign,
    getMoonSign,
    getAscendant,
    getElementDistribution,
    getModalityDistribution,
    getPersonalitySummary,
    ZodiacSign,
} from "@/lib/astrology-data";
import { PremiumSelect } from "@/components/ui/premium-select";

const faqItems = [
    {
        question: "Doğum haritası nedir?",
        answer:
            "Doğum haritası (natal harita), doğduğunuz an gökyüzündeki gezegenlerin konumlarını gösteren astrolojik bir haritadır. Güneş, Ay ve yükselen burç en önemli üç bileşendir.",
    },
    {
        question: "Güneş burcu ne anlama gelir?",
        answer:
            "Güneş burcunuz, doğduğunuz tarihte Güneş'in bulunduğu burçtur. Temel kişiliğinizi, benlik duygunuzu ve hayat amacınızı temsil eder.",
    },
    {
        question: "Yükselen burç (Ascendant) nedir?",
        answer:
            "Yükselen burç, doğduğunuz anda doğu ufkunda yükselen burçtur. Dış görünümünüzü, başkalarına nasıl göründüğünüzü ve ilk izleniminizi belirler. Hesaplanması için doğum saatiniz gereklidir.",
    },
    {
        question: "Ay burcu ne anlama gelir?",
        answer:
            "Ay burcunuz, duygusal doğanızı, içgüdülerinizi ve bilinçaltı tepkilerinizi temsil eder. İç dünyanızı ve duygusal ihtiyaçlarınızı anlamak için önemlidir.",
    },
];

// Generate years from 1920 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

// City options for PremiumSelect
const cityOptions = TURKEY_CITIES.map(city => ({
    value: city.name,
    label: city.name,
}));

export default function DogumHaritasiHesaplama() {
    const [birthDay, setBirthDay] = useState(15);
    const [birthMonth, setBirthMonth] = useState(3);
    const [birthYear, setBirthYear] = useState(1990);
    const [birthTime, setBirthTime] = useState("10:30");
    const [selectedCity, setSelectedCity] = useState("İstanbul");
    const [knowsTime, setKnowsTime] = useState(true);

    // Parse birth time
    const [birthHour, birthMinute] = useMemo(() => {
        const parts = birthTime.split(":");
        const h = parseInt(parts[0]) || 0;
        const m = parseInt(parts[1]) || 0;
        return [Math.min(23, Math.max(0, h)), Math.min(59, Math.max(0, m))];
    }, [birthTime]);

    const cityData = TURKEY_CITIES.find(c => c.name === selectedCity);

    const results = useMemo(() => {
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

        const sunSign = getSunSign(birthMonth, birthDay);
        const moonSign = getMoonSign(birthDate);
        const ascendant = knowsTime && cityData
            ? getAscendant(birthDate, birthHour, birthMinute, cityData.latitude)
            : null;

        const mainSigns = [sunSign, moonSign];
        if (ascendant) mainSigns.push(ascendant);

        const elementDist = getElementDistribution(mainSigns);
        const modalityDist = getModalityDistribution(mainSigns);
        const summary = getPersonalitySummary(sunSign, moonSign, ascendant);

        return {
            sunSign,
            moonSign,
            ascendant,
            elementDist,
            modalityDist,
            summary,
        };
    }, [birthDay, birthMonth, birthYear, birthHour, birthMinute, cityData, knowsTime]);

    const formatTime = (h: number, m: number) => {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

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
                                <Link href="/tum-hesaplamalar?category=genel" className="hover:text-blue-600 transition-colors">
                                    Genel
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800">Doğum Haritası Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Doğum Haritası Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Güneş burcunuzu, Ay burcunuzu ve yükselen burcunuzu öğrenin.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                            <p>
                                <strong>⚠️ Bilgilendirme:</strong> Astroloji bilimsel olarak kanıtlanmış bir alan değildir.
                                Bu araç eğlence ve kişisel ilgi amaçlıdır.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
                            {/* Birth Date */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Doğum Tarihi
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <select
                                        value={birthDay}
                                        onChange={(e) => setBirthDay(parseInt(e.target.value))}
                                        className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    >
                                        {days.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={birthMonth}
                                        onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                                        className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    >
                                        {MONTHS_TR.map((m, i) => (
                                            <option key={i} value={i + 1}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={birthYear}
                                        onChange={(e) => setBirthYear(parseInt(e.target.value))}
                                        className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Birth Time Toggle */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Doğum Saati
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!knowsTime}
                                            onChange={(e) => setKnowsTime(!e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-500">Saatimi bilmiyorum</span>
                                    </label>
                                </div>
                                {knowsTime && (
                                    <div>
                                        <input
                                            type="time"
                                            value={birthTime}
                                            onChange={(e) => setBirthTime(e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-center text-lg"
                                        />
                                        <p className="text-xs text-gray-400 mt-1 text-center">Saat:Dakika formatında girin</p>
                                    </div>
                                )}
                                {!knowsTime && (
                                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                        Doğum saati bilinmediğinde yükselen burç hesaplanamaz. Ay burcunda da gün içinde değişim olabilir.
                                    </p>
                                )}
                            </div>

                            {/* Birth Place */}
                            <div className="space-y-2">
                                <PremiumSelect
                                    label="Doğum Yeri"
                                    value={selectedCity}
                                    onChange={setSelectedCity}
                                    options={cityOptions}
                                    placeholder="Şehir seçin..."
                                />
                                {cityData && (
                                    <p className="text-xs text-gray-400">
                                        Koordinatlar: {cityData.latitude.toFixed(2)}°N, {cityData.longitude.toFixed(2)}°E
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Doğum haritası, doğduğunuz andaki gezegen konumlarına dayanır.
                                    <strong> Güneş burcu</strong> doğum tarihinize göre belirlenir.
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-2xl">☀️</span>
                                        <div>
                                            <strong>Güneş Burcu:</strong> Doğum tarihinizde Güneş&apos;in bulunduğu burç
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-2xl">🌙</span>
                                        <div>
                                            <strong>Ay Burcu:</strong> Doğum anında Ay&apos;ın bulunduğu burç (yaklaşık)
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-2xl">⬆️</span>
                                        <div>
                                            <strong>Yükselen:</strong> Doğum anında doğu ufkunda yükselen burç
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Not: Bu hesaplama basitleştirilmiş bir yöntem kullanır.
                                    Tam astrolojik analiz için Swiss Ephemeris gibi profesyonel araçlar kullanılmalıdır.
                                </p>
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
                                <h2 className="text-lg font-semibold text-gray-800">Doğum Haritası</h2>
                                <span className="text-xs text-gray-400">
                                    {birthDay} {MONTHS_TR[birthMonth - 1]} {birthYear}
                                </span>
                            </div>

                            {/* Main Signs */}
                            <div className="space-y-4">
                                {/* Sun Sign */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">{results.sunSign.symbol}</span>
                                        <div>
                                            <p className="text-sm text-amber-600 font-medium">☀️ Güneş Burcu</p>
                                            <p className="text-2xl font-bold text-gray-900">{results.sunSign.name}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {results.sunSign.traits.map((trait, i) => (
                                            <span key={i} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Moon Sign */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">{results.moonSign.symbol}</span>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">🌙 Ay Burcu</p>
                                            <p className="text-2xl font-bold text-gray-900">{results.moonSign.name}</p>
                                        </div>
                                    </div>
                                    {!knowsTime && (
                                        <p className="mt-2 text-xs text-blue-500">yaklaşık değer</p>
                                    )}
                                </div>

                                {/* Ascendant */}
                                {results.ascendant ? (
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{results.ascendant.symbol}</span>
                                            <div>
                                                <p className="text-sm text-purple-600 font-medium">⬆️ Yükselen</p>
                                                <p className="text-2xl font-bold text-gray-900">{results.ascendant.name}</p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs text-purple-500">
                                            Saat: {formatTime(birthHour, birthMinute)} • {selectedCity}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-gray-500 text-sm">
                                            Yükselen burç için doğum saati gereklidir
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Element & Modality Distribution */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">Element Dağılımı</p>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>🔥 Ateş</span>
                                            <span className="font-bold">{results.elementDist.Ateş}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>🌍 Toprak</span>
                                            <span className="font-bold">{results.elementDist.Toprak}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>💨 Hava</span>
                                            <span className="font-bold">{results.elementDist.Hava}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>💧 Su</span>
                                            <span className="font-bold">{results.elementDist.Su}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">Modalite</p>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>⚡ Öncü</span>
                                            <span className="font-bold">{results.modalityDist.Öncü}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>🪨 Sabit</span>
                                            <span className="font-bold">{results.modalityDist.Sabit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>🌀 Değişken</span>
                                            <span className="font-bold">{results.modalityDist.Değişken}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personality Summary */}
                            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                                <p className="font-medium mb-1">📝 Kişilik Özeti</p>
                                <p>{results.summary}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-2 print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    <span>Yazdır / PDF Kaydet</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400 print:hidden">
                            <span>⭐ Astroloji Hesaplama</span>
                            <span>⚡ Anlık Sonuç</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
