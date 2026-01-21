"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Format number with Turkish locale
const formatNumber = (num: number) => {
    return new Intl.NumberFormat("tr-TR").format(num);
};

// Zodiac signs
const getZodiacSign = (month: number, day: number) => {
    const signs = [
        { name: "Oğlak", emoji: "♑", start: [1, 1], end: [1, 19] },
        { name: "Kova", emoji: "♒", start: [1, 20], end: [2, 18] },
        { name: "Balık", emoji: "♓", start: [2, 19], end: [3, 20] },
        { name: "Koç", emoji: "♈", start: [3, 21], end: [4, 19] },
        { name: "Boğa", emoji: "♉", start: [4, 20], end: [5, 20] },
        { name: "İkizler", emoji: "♊", start: [5, 21], end: [6, 20] },
        { name: "Yengeç", emoji: "♋", start: [6, 21], end: [7, 22] },
        { name: "Aslan", emoji: "♌", start: [7, 23], end: [8, 22] },
        { name: "Başak", emoji: "♍", start: [8, 23], end: [9, 22] },
        { name: "Terazi", emoji: "♎", start: [9, 23], end: [10, 22] },
        { name: "Akrep", emoji: "♏", start: [10, 23], end: [11, 21] },
        { name: "Yay", emoji: "♐", start: [11, 22], end: [12, 21] },
        { name: "Oğlak", emoji: "♑", start: [12, 22], end: [12, 31] },
    ];

    for (const sign of signs) {
        const [startMonth, startDay] = sign.start;
        const [endMonth, endDay] = sign.end;

        if (
            (month === startMonth && day >= startDay) ||
            (month === endMonth && day <= endDay)
        ) {
            return sign;
        }
    }
    return signs[0]; // Oğlak default
};

const faqItems = [
    {
        question: "Yaş nasıl hesaplanır?",
        answer:
            "Yaş, doğum tarihinizden bugüne kadar geçen tam yıl sayısıdır. Ay ve gün de dahil edilerek kesin yaş hesaplanır.",
    },
    {
        question: "Artık yıllar hesaba katılıyor mu?",
        answer:
            "Evet, hesaplama takvim günlerini baz alır ve artık yıllar otomatik olarak hesaba katılır.",
    },
    {
        question: "Toplam gün sayısı neden önemli?",
        answer:
            "Bazı resmi işlemler (sigorta primi, emeklilik vb.) için toplam gün sayısı gerekebilir.",
    },
    {
        question: "Burç nasıl belirlenir?",
        answer:
            "Burç, doğum tarihinize göre belirlenir. Güneş'in o tarihte bulunduğu burç, sizin burcunuzdur.",
    },
];

export default function YasHesaplama() {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [result, setResult] = useState<{
        years: number;
        months: number;
        days: number;
        totalDays: number;
        totalWeeks: number;
        totalMonths: number;
        totalHours: number;
        nextBirthday: number;
        zodiac: { name: string; emoji: string };
        dayOfWeek: string;
    } | null>(null);

    useEffect(() => {
        if (!selectedDate) {
            setResult(null);
            return;
        }

        const birth = selectedDate;
        const today = new Date();

        if (birth > today) {
            setResult(null);
            return;
        }

        // Calculate years, months, days
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Total calculations
        const diffTime = Math.abs(today.getTime() - birth.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;

        // Days until next birthday
        const nextBirthday = new Date(
            today.getFullYear(),
            birth.getMonth(),
            birth.getDate()
        );
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.ceil(
            (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Zodiac sign
        const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate());

        // Day of week born
        const daysOfWeek = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
        const dayOfWeek = daysOfWeek[birth.getDay()];

        setResult({
            years,
            months,
            days,
            totalDays,
            totalWeeks,
            totalMonths,
            totalHours,
            nextBirthday: daysUntilBirthday,
            zodiac,
            dayOfWeek,
        });
    }, [selectedDate]);

    // Calculate life progress (assuming 80 years average life expectancy)
    const lifeProgress = result ? Math.min(Math.round((result.years / 80) * 100), 100) : 0;

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
                                <span className="text-gray-800">Yaş Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Yaş Hesapla
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Doğum tarihinizden yaşınızı gün gün hesaplayın.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            {/* Birth Date Input */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Doğum Tarihi
                                    </span>
                                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">
                                        📅
                                    </span>
                                </label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between h-14 px-4 bg-gray-50 border-gray-200 rounded-xl text-lg font-bold text-gray-900 hover:bg-gray-100"
                                        >
                                            {selectedDate ? (
                                                format(selectedDate, "d MMMM yyyy", { locale: tr })
                                            ) : (
                                                <span className="text-gray-400 font-normal">Tarih seçin...</span>
                                            )}
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setOpen(false);
                                            }}
                                            captionLayout="dropdown"
                                            fromYear={1920}
                                            toYear={new Date().getFullYear()}
                                            disabled={(date) => date > new Date()}
                                            defaultMonth={selectedDate || new Date(1990, 0, 1)}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Quick Select Birth Years */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hızlı Seçim (Doğum Yılı)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[1990, 1985, 1980, 1975, 1970, 2000, 2005, 2010].map((year) => (
                                        <button
                                            key={year}
                                            onClick={() => {
                                                setSelectedDate(new Date(year, 0, 1));
                                                setOpen(true);
                                            }}
                                            className={`px-4 py-2 rounded-lg border font-medium transition-all ${selectedDate && selectedDate.getFullYear() === year
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Yaş hesaplaması, doğum tarihiniz ile bugünün tarihi arasındaki farkı hesaplar.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">Kesin Yaş</p>
                                        <div className="text-sm">
                                            Yıl, ay ve gün olarak tam yaşınız
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">Toplam Süre</p>
                                        <div className="text-sm">
                                            Gün, hafta, saat cinsinden yaşınız
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
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-8">
                        {/* Floating Result Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-6 transition-all hover:-translate-y-1 duration-500">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Yaşınız</h2>
                                <span className="text-xs text-gray-400">Anlık</span>
                            </div>

                            {result ? (
                                <>
                                    {/* Main Result */}
                                    <div className="text-center space-y-1 py-2">
                                        <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                            Kesin Yaşınız
                                        </p>
                                        <div className="flex items-baseline justify-center gap-2 text-gray-900">
                                            <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                                {result.years}
                                            </span>
                                            <span className="text-xl font-semibold text-gray-400">
                                                yıl
                                            </span>
                                            <span className="text-2xl font-bold">
                                                {result.months}
                                            </span>
                                            <span className="text-lg font-semibold text-gray-400">
                                                ay
                                            </span>
                                            <span className="text-2xl font-bold">
                                                {result.days}
                                            </span>
                                            <span className="text-lg font-semibold text-gray-400">
                                                gün
                                            </span>
                                        </div>
                                    </div>

                                    {/* Life Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Hayat Yolculuğu</span>
                                            <span className="font-bold text-gray-700">%{lifeProgress}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                                                style={{ width: `${lifeProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 text-center">80 yıl ortalama yaşam süresi baz alınmıştır</p>
                                    </div>

                                    {/* Zodiac & Birthday */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                                            <span className="text-3xl">{result.zodiac.emoji}</span>
                                            <p className="text-sm font-bold text-purple-700 mt-1">{result.zodiac.name}</p>
                                            <p className="text-xs text-purple-500">Burç</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                                            <span className="text-3xl">🎂</span>
                                            <p className="text-sm font-bold text-orange-700 mt-1">
                                                {result.nextBirthday === 0 ? "Bugün!" : `${result.nextBirthday} gün`}
                                            </p>
                                            <p className="text-xs text-orange-500">Doğum Günü</p>
                                        </div>
                                    </div>

                                    {/* Summary Stats */}
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Toplam Gün</span>
                                            <span className="font-bold text-gray-900">{formatNumber(result.totalDays)} gün</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Toplam Hafta</span>
                                            <span className="font-bold text-gray-900">{formatNumber(result.totalWeeks)} hafta</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Toplam Ay</span>
                                            <span className="font-bold text-gray-900">{formatNumber(result.totalMonths)} ay</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Toplam Saat</span>
                                            <span className="font-bold text-gray-900">{formatNumber(result.totalHours)} saat</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                            <span className="text-gray-500">Doğduğunuz Gün</span>
                                            <span className="font-bold text-blue-600">{result.dayOfWeek}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-6xl">🎂</span>
                                    <p className="text-gray-500 mt-4">Doğum tarihinizi girin</p>
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
                                        href="/finans/maas-hesaplama"
                                        className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                    >
                                        Maaş Hesaplama
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
