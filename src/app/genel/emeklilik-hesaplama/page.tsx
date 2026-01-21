"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
    ServiceStatus,
    SERVICE_STATUSES,
    EYT_CRITICAL_DATE,
    SSK_5510_DATE,
    getRequiredAge,
    getRequiredDays,
    getRequiredInsuranceYears,
    addYears,
    addDays,
    daysBetween,
    yearsBetween,
    formatDateTR,
} from "@/data/emeklilik-params";

// Format number with Turkish locale
const formatNumber = (num: number) => {
    return new Intl.NumberFormat("tr-TR").format(num);
};

type Gender = "male" | "female";

interface RetirementResult {
    // Emeklilik türü
    retirementType: "EYT" | "NORMAL";
    retirementTypeLabel: string;

    // Tarihi bilgiler
    earliestRetirementDate: Date;
    retirementAge: number;

    // Şartlar
    requiredDays: number;
    currentDays: number;
    missingDays: number;

    requiredInsuranceYears: number;
    currentInsuranceYears: number;
    missingInsuranceYears: number;

    requiredAge: number;
    currentAge: number;
    missingAge: number;

    // Projeksiyon
    dayCompletionDate: Date | null;
    ageCompletionDate: Date | null;
    insuranceCompletionDate: Date | null;

    // Statü
    effectiveStatus: ServiceStatus;

    // Mevzuat bilgisi
    legislationInfo: string;
}

const faqItems = [
    {
        question: "EYT (Emeklilikte Yaşa Takılanlar) nedir?",
        answer:
            "09.09.1999 tarihinden önce sigortalı olanlar için yaş şartı aranmadan, sadece prim günü ve sigortalılık süresi şartları ile emeklilik hakkı tanıyan uygulamadır.",
    },
    {
        question: "Prim günü nasıl hesaplanır?",
        answer:
            "SGK'ya bildirilen her çalışma günü prim günü olarak sayılır. Bir ayda en fazla 30 gün bildirilir. e-Devlet üzerinden 'SGK Tescil ve Hizmet Dökümü' ekranından toplam prim gününüzü öğrenebilirsiniz.",
    },
    {
        question: "4A, 4B ve 4C ne anlama gelir?",
        answer:
            "4A: SSK (sigortalı çalışanlar), 4B: Bağ-Kur (esnaf, serbest meslek), 4C: Emekli Sandığı (devlet memurları). Emeklilik koşulları statüye göre farklılık gösterir.",
    },
    {
        question: "Kademeli yaş artışı nedir?",
        answer:
            "5510 sayılı kanun ile 2036 yılından itibaren emeklilik yaşı kademeli olarak artırılarak 2044'te kadın ve erkek için 65 yaşına çıkarılacaktır.",
    },
    {
        question: "Borçlanma ile emeklilik tarihim değişir mi?",
        answer:
            "Askerlik, doğum gibi borçlanmalar prim gününüzü artırabilir. Bazı borçlanmalar ilk sigortalılık tarihinizi geriye çekebilir. Detaylı hesaplama için SGK'ya başvurmanız önerilir.",
    },
];

export default function EmeklilikHesaplama() {
    // Form state
    const [gender, setGender] = useState<Gender>("male");
    const [birthDateOpen, setBirthDateOpen] = useState(false);
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    const [insuranceDateOpen, setInsuranceDateOpen] = useState(false);
    const [firstInsuranceDate, setFirstInsuranceDate] = useState<Date | undefined>(undefined);
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus>("4A");
    const [currentDaysInput, setCurrentDaysInput] = useState("");
    const [monthlyDaysInput, setMonthlyDaysInput] = useState("30");
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Parse inputs
    const currentDays = parseInt(currentDaysInput.replace(/\./g, "")) || 0;
    const monthlyDays = parseInt(monthlyDaysInput) || 30;

    // Calculate result
    const result = useMemo((): RetirementResult | null => {
        if (!birthDate || !firstInsuranceDate || currentDays <= 0) {
            return null;
        }

        const today = new Date();

        // Mevcut yaş ve sigortalılık süresi hesaplama
        const currentAge = yearsBetween(birthDate, today);
        const currentInsuranceYears = yearsBetween(firstInsuranceDate, today);

        // EYT kontrolü
        const isEYT = firstInsuranceDate < EYT_CRITICAL_DATE;

        // Gerekli şartları belirle
        const requiredDays = getRequiredDays(serviceStatus, firstInsuranceDate);
        const requiredInsuranceYears = getRequiredInsuranceYears(gender, firstInsuranceDate);

        // Eksik günleri hesapla
        const missingDays = Math.max(0, requiredDays - currentDays);

        // Eksik sigortalılık süresi
        const missingInsuranceYears = Math.max(0, requiredInsuranceYears - currentInsuranceYears);

        // Prim günü tamamlama tarihi projeksiyonu
        let dayCompletionDate: Date | null = null;
        if (missingDays > 0 && monthlyDays > 0) {
            const monthsNeeded = Math.ceil(missingDays / monthlyDays);
            dayCompletionDate = new Date(today);
            dayCompletionDate.setMonth(dayCompletionDate.getMonth() + monthsNeeded);
        } else if (missingDays === 0) {
            dayCompletionDate = today;
        }

        // Prim günü tamamlama yılı (yaş şartını belirlemek için)
        const completionYear = dayCompletionDate?.getFullYear() ?? today.getFullYear();

        // Gerekli yaş
        const requiredAge = getRequiredAge(completionYear, gender, firstInsuranceDate);
        const missingAge = Math.max(0, requiredAge - currentAge);

        // Yaş tamamlama tarihi
        let ageCompletionDate: Date | null = null;
        if (requiredAge > 0) {
            ageCompletionDate = addYears(birthDate, requiredAge);
        }

        // Sigortalılık süresi tamamlama tarihi
        let insuranceCompletionDate: Date | null = null;
        if (requiredInsuranceYears > 0) {
            insuranceCompletionDate = addYears(firstInsuranceDate, requiredInsuranceYears);
        }

        // En erken emeklilik tarihi hesaplama
        let earliestRetirementDate = today;
        const dates: Date[] = [];

        if (dayCompletionDate) dates.push(dayCompletionDate);
        if (ageCompletionDate && requiredAge > 0) dates.push(ageCompletionDate);
        if (insuranceCompletionDate && requiredInsuranceYears > 0) dates.push(insuranceCompletionDate);

        if (dates.length > 0) {
            earliestRetirementDate = new Date(Math.max(...dates.map(d => d.getTime())));
        }

        // Emeklilik yaşı
        const retirementAge = yearsBetween(birthDate, earliestRetirementDate);

        // Mevzuat bilgisi
        let legislationInfo = "";
        if (isEYT) {
            legislationInfo = `İlk sigortalılık tarihiniz (${formatDateTR(firstInsuranceDate)}) 09.09.1999 tarihinden önce olduğu için EYT kapsamındasınız. Yaş şartı aranmaz, sigortalılık süresi ve prim günü şartları geçerlidir.`;
        } else if (firstInsuranceDate >= SSK_5510_DATE) {
            legislationInfo = `İlk sigortalılık tarihiniz (${formatDateTR(firstInsuranceDate)}) 01.10.2008 tarihinden sonra olduğu için 5510 sayılı Kanun hükümleri uygulanır. Prim günü ve yaş şartı birlikte aranır.`;
        } else {
            legislationInfo = `İlk sigortalılık tarihiniz (${formatDateTR(firstInsuranceDate)}) geçiş dönemine (09.09.1999 - 30.09.2008) denk geldiğinden kademeli geçiş hükümleri uygulanır.`;
        }

        return {
            retirementType: isEYT ? "EYT" : "NORMAL",
            retirementTypeLabel: isEYT ? "EYT (Yaş Şartı Yok)" : "Normal Emeklilik",
            earliestRetirementDate,
            retirementAge,
            requiredDays,
            currentDays,
            missingDays,
            requiredInsuranceYears,
            currentInsuranceYears,
            missingInsuranceYears,
            requiredAge,
            currentAge,
            missingAge,
            dayCompletionDate,
            ageCompletionDate,
            insuranceCompletionDate,
            effectiveStatus: serviceStatus,
            legislationInfo,
        };
    }, [birthDate, firstInsuranceDate, gender, serviceStatus, currentDays, monthlyDays]);

    // Progress percentage for visualization
    const dayProgress = result ? Math.min(Math.round((result.currentDays / result.requiredDays) * 100), 100) : 0;

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
                                <span className="text-gray-800">Emeklilik Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Ne Zaman Emekli Olurum?
                            </h1>
                            <p className="text-gray-500 text-lg">
                                EYT dahil, en erken emeklilik tarihinizi ve gerekli şartları hesaplayın.
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

                            {/* Birth Date */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Doğum Tarihi
                                    </span>
                                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">
                                        📅
                                    </span>
                                </label>
                                <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between h-14 px-4 bg-gray-50 border-gray-200 rounded-xl text-lg font-bold text-gray-900 hover:bg-gray-100"
                                        >
                                            {birthDate ? (
                                                format(birthDate, "d MMMM yyyy", { locale: tr })
                                            ) : (
                                                <span className="text-gray-400 font-normal">Tarih seçin...</span>
                                            )}
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={birthDate}
                                            onSelect={(date) => {
                                                setBirthDate(date);
                                                setBirthDateOpen(false);
                                            }}
                                            captionLayout="dropdown"
                                            fromYear={1940}
                                            toYear={new Date().getFullYear() - 15}
                                            disabled={(date) => date > new Date()}
                                            defaultMonth={birthDate || new Date(1980, 0, 1)}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* First Insurance Date */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        İlk Sigortalı Giriş Tarihi
                                    </span>
                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">
                                        SGK
                                    </span>
                                </label>
                                <Popover open={insuranceDateOpen} onOpenChange={setInsuranceDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between h-14 px-4 bg-gray-50 border-gray-200 rounded-xl text-lg font-bold text-gray-900 hover:bg-gray-100"
                                        >
                                            {firstInsuranceDate ? (
                                                format(firstInsuranceDate, "d MMMM yyyy", { locale: tr })
                                            ) : (
                                                <span className="text-gray-400 font-normal">Tarih seçin...</span>
                                            )}
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={firstInsuranceDate}
                                            onSelect={(date) => {
                                                setFirstInsuranceDate(date);
                                                setInsuranceDateOpen(false);
                                            }}
                                            captionLayout="dropdown"
                                            fromYear={1960}
                                            toYear={new Date().getFullYear()}
                                            disabled={(date) => date > new Date()}
                                            defaultMonth={firstInsuranceDate || new Date(1999, 0, 1)}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <p className="text-xs text-gray-400">
                                    e-Devlet &gt; SGK Tescil ve Hizmet Dökümü ekranından öğrenebilirsiniz.
                                </p>
                            </div>

                            {/* Service Status */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hizmet Statüsü
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {SERVICE_STATUSES.map((status) => (
                                        <button
                                            key={status.id}
                                            onClick={() => setServiceStatus(status.id)}
                                            className={`p-3 flex flex-col items-center gap-1 rounded-lg border text-sm font-medium transition-all ${serviceStatus === status.id
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="font-bold">{status.id}</span>
                                            <span className="text-xs text-gray-400">{status.id === "4A" ? "SSK" : status.id === "4B" ? "Bağ-Kur" : "Memur"}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Current Premium Days */}
                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Mevcut Prim Günü
                                    </span>
                                    <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded text-xs">
                                        GÜN
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={currentDaysInput}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[\d.]*$/.test(val)) {
                                                setCurrentDaysInput(val);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (currentDays > 0) {
                                                setCurrentDaysInput(formatNumber(currentDays));
                                            }
                                        }}
                                        placeholder="Örn: 5000"
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-400">
                                    e-Devlet &gt; SGK Hizmet Dökümü ekranındaki toplam gün sayısını girin.
                                </p>
                            </div>

                            {/* Quick Select Days */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hızlı Seçim (Prim Günü)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[3000, 5000, 6000, 7000, 7200, 9000].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setCurrentDaysInput(formatNumber(val))}
                                            className={`px-4 py-2 rounded-lg border font-medium transition-all ${currentDays === val
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {formatNumber(val)} gün
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
                                                Aylık Ortalama Prim Günü
                                            </span>
                                            <span className="text-xs text-gray-400">(Projeksiyon İçin)</span>
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {[0, 15, 20, 30].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setMonthlyDaysInput(String(val))}
                                                    className={`py-3 rounded-lg border font-medium transition-all ${monthlyDays === val
                                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {val === 0 ? "Çalışmıyor" : `${val} gün`}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Bundan sonra ayda ortalama kaç gün prim yatacağını seçin.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Hesaplanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Emeklilik tarihi hesaplamasında aşağıdaki faktörler dikkate alınır:
                                </p>
                                <ol className="space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                        <span><strong>EYT Kontrolü:</strong> 09.09.1999 öncesi sigortalı olanlar için yaş şartı aranmaz</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                        <span><strong>Prim Günü:</strong> 5510 sonrası 4A için 7200 gün, 4B/4C için 9000 gün</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                        <span><strong>Yaş Şartı:</strong> Prim gününüzü tamamlayacağınız yıla göre kademeli yaş belirlenir</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                                        <span><strong>En Erken Tarih:</strong> Tüm şartların tamamlandığı en geç tarih, emeklilik tarihinizdir</span>
                                    </li>
                                </ol>

                                <div className="bg-amber-50 rounded-xl p-4 mt-4 border border-amber-100">
                                    <p className="font-semibold text-amber-800 mb-2">⚠️ Önemli Uyarı</p>
                                    <p className="text-sm text-amber-700">
                                        Bu hesaplama genel bilgi amaçlıdır. Kesin sonuç için SGK&apos;ya başvurunuz. Borçlanma, yıpranma payı gibi özel durumlar ayrıca değerlendirilmelidir.
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
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-[72px]">
                        {/* Floating Result Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-6 transition-all hover:-translate-y-1 duration-500">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Emeklilik Tahmini</h2>
                                <span className="text-xs text-gray-400">2026</span>
                            </div>

                            {result ? (
                                <>
                                    {/* Retirement Type Badge */}
                                    <div className="flex justify-center">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${result.retirementType === "EYT"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {result.retirementTypeLabel}
                                        </span>
                                    </div>

                                    {/* Main Result */}
                                    <div className="text-center space-y-1 py-2">
                                        <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                                            En Erken Emeklilik Tarihi
                                        </p>
                                        <div className="flex items-baseline justify-center gap-2 text-gray-900">
                                            <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                                {formatDateTR(result.earliestRetirementDate)}
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-500">
                                            ({result.retirementAge} yaşında)
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Prim Günü İlerlemesi</span>
                                            <span className="font-bold text-gray-700">%{dayProgress}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-700"
                                                style={{ width: `${dayProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 text-center">
                                            {formatNumber(result.currentDays)} / {formatNumber(result.requiredDays)} gün
                                        </p>
                                    </div>

                                    {/* Requirements Status */}
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <p className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Şartlar</p>

                                        {/* Prim Günü */}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Prim Günü</span>
                                            {result.missingDays === 0 ? (
                                                <span className="font-bold text-green-600">✓ Tamam</span>
                                            ) : (
                                                <span className="font-bold text-orange-600">
                                                    {formatNumber(result.missingDays)} gün eksik
                                                </span>
                                            )}
                                        </div>

                                        {/* Sigortalılık Süresi (sadece EYT için) */}
                                        {result.requiredInsuranceYears > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Sigortalılık Süresi</span>
                                                {result.missingInsuranceYears === 0 ? (
                                                    <span className="font-bold text-green-600">✓ Tamam ({result.requiredInsuranceYears} yıl)</span>
                                                ) : (
                                                    <span className="font-bold text-orange-600">
                                                        {result.missingInsuranceYears} yıl eksik
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Yaş Şartı */}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Yaş Şartı</span>
                                            {result.requiredAge === 0 ? (
                                                <span className="font-bold text-green-600">Yok (EYT)</span>
                                            ) : result.missingAge === 0 ? (
                                                <span className="font-bold text-green-600">✓ Tamam ({result.requiredAge} yaş)</span>
                                            ) : (
                                                <span className="font-bold text-orange-600">
                                                    {result.requiredAge} yaş ({result.missingAge} yıl kaldı)
                                                </span>
                                            )}
                                        </div>

                                        {/* Statü */}
                                        <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                            <span className="text-gray-500">Emeklilik Statüsü</span>
                                            <span className="font-bold text-blue-600">{result.effectiveStatus}</span>
                                        </div>
                                    </div>

                                    {/* Projections */}
                                    {result.missingDays > 0 && (
                                        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                                            <p className="text-sm font-medium text-blue-700">📊 Projeksiyon</p>
                                            {monthlyDays > 0 ? (
                                                <>
                                                    <p className="text-sm text-blue-600">
                                                        Ayda <strong>{monthlyDays} gün</strong> prim ile:
                                                    </p>
                                                    <p className="text-sm text-blue-800 font-bold">
                                                        Eksik günler {result.dayCompletionDate ? formatDateTR(result.dayCompletionDate) : "-"} tarihinde tamamlanır.
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-blue-600">
                                                    Çalışma durumu belirsiz. Gelişmiş seçeneklerden aylık prim günü seçin.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Legislation Info */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">📜 Mevzuat Bilgisi</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {result.legislationInfo}
                                        </p>
                                    </div>

                                    {/* Related Calculators */}
                                    <div className="pt-2">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">İlgili Hesaplayıcılar</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href="/finans/maas-hesaplama"
                                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                            >
                                                Maaş Hesaplama
                                            </Link>
                                            <Link
                                                href="/genel/yas-hesaplama"
                                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                            >
                                                Yaş Hesaplama
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-6xl">🏖️</span>
                                    <p className="text-gray-500 mt-4">Bilgilerinizi girin</p>
                                    <p className="text-gray-400 text-sm mt-2">Doğum tarihi, ilk sigorta tarihi ve prim gününüzü girerek hesaplayın</p>
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
            </main>
        </div>
    );
}
