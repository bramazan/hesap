"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumSelect } from "@/components/ui/premium-select";

// Simplified list of 81 provinces
const TURKEY_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
    "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
    "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
    "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kırıkkale", "Kırklareli",
    "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt", "Sinop",
    "Şırnak", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

interface PrayerTimes {
    Fajr: string;    // İmsak
    Sunrise: string; // Güneş
    Dhuhr: string;   // Öğle
    Asr: string;     // İkindi
    Maghrib: string; // Akşam (İftar)
    Isha: string;    // Yatsı
    date: string;    // Readable date
}

// Turkish Month Map
const TURKISH_MONTHS: Record<string, string> = {
    "January": "Ocak", "February": "Şubat", "March": "Mart", "April": "Nisan", "May": "Mayıs", "June": "Haziran",
    "July": "Temmuz", "August": "Ağustos", "September": "Eylül", "October": "Ekim", "November": "Kasım", "December": "Aralık"
};

export default function ImsakHesaplama() {
    const [city, setCity] = useState("İstanbul");
    const [todayTimes, setTodayTimes] = useState<PrayerTimes | null>(null);
    const [tomorrowTimes, setTomorrowTimes] = useState<PrayerTimes | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    // Calendar State
    const [showCalendar, setShowCalendar] = useState(false);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [calendarLoading, setCalendarLoading] = useState(false);

    // Initial client-side time set
    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Today/Tomorrow Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const formatDate = (d: Date) => {
                    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
                }

                const [res1, res2] = await Promise.all([
                    fetch(`https://api.aladhan.com/v1/timingsByCity/${formatDate(today)}?city=${city}&country=Turkey&method=13`),
                    fetch(`https://api.aladhan.com/v1/timingsByCity/${formatDate(tomorrow)}?city=${city}&country=Turkey&method=13`)
                ]);

                const data1 = await res1.json();
                const data2 = await res2.json();

                if (data1.code === 200) {
                    setTodayTimes({ ...data1.data.timings, date: data1.data.date.readable });
                }
                if (data2.code === 200) {
                    setTomorrowTimes({ ...data2.data.timings, date: data2.data.date.readable });
                }

            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [city]);

    // Fetch Monthly Data
    useEffect(() => {
        if (showCalendar && monthlyData.length === 0) {
            const fetchMonthly = async () => {
                setCalendarLoading(true);
                try {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1;

                    const res = await fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=Turkey&method=13`);
                    const data = await res.json();

                    if (data.code === 200) {
                        setMonthlyData(data.data);
                    }
                } catch (error) {
                    console.error("Calendar API Error:", error);
                } finally {
                    setCalendarLoading(false);
                }
            };
            fetchMonthly();
        }
    }, [showCalendar, city, monthlyData.length]);

    // Reset calendar when city changes
    useEffect(() => {
        setMonthlyData([]);
        setShowCalendar(false);
    }, [city]);


    // Format number to 2 digits
    const pad = (n: number) => n.toString().padStart(2, '0');

    // Parse time string "HH:MM" to Date object
    const parseTime = (timeStr: string, isTomorrow = false) => {
        if (!currentTime || !timeStr) return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        const d = new Date(currentTime);
        if (isTomorrow) d.setDate(d.getDate() + 1);
        d.setHours(hours, minutes, 0, 0);
        return d;
    };

    // Calculation Logic
    const getStatus = () => {
        if (!todayTimes || !tomorrowTimes || !currentTime) return null;

        const now = currentTime;
        const imsakToday = parseTime(todayTimes.Fajr);
        const iftarToday = parseTime(todayTimes.Maghrib);
        const imsakTomorrow = parseTime(tomorrowTimes.Fajr, true);

        if (!imsakToday || !iftarToday || !imsakTomorrow) return null;

        // Determine phase
        if (now < imsakToday) {
            return {
                label: "Sahura Kalan Süre",
                targetDate: imsakToday,
                nextEvent: "İmsak",
                nextTime: todayTimes.Fajr
            };
        }
        else if (now < iftarToday) {
            return {
                label: "İftara Kalan Süre",
                targetDate: iftarToday,
                nextEvent: "İftar",
                nextTime: todayTimes.Maghrib
            };
        }
        else {
            return {
                label: "Sahura Kalan Süre", // Next day's Imsak
                targetDate: imsakTomorrow,
                nextEvent: "Yarınki İmsak",
                nextTime: tomorrowTimes.Fajr
            };
        }
    };

    const status = getStatus();

    const calculateTimeLeft = () => {
        if (!status || !currentTime) return { hours: 0, minutes: 0, seconds: 0 };
        const diff = status.targetDate.getTime() - currentTime.getTime();
        if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return { hours, minutes, seconds };
    };

    const timeLeft = calculateTimeLeft();

    const faqItems = [
        {
            question: "Sahura ne kadar kaldı ne demek?",
            answer: "Geri sayım, orucun başlama vakti olan 'İmsak' vaktine göre yapılır. Yani 'Sahura kalan süre', imsak vaktine (yeme içmenin kesilmesi gereken vakit) kalan süredir."
        },
        {
            question: "Vakitler nereden alınıyor?",
            answer: "Veriler, Diyanet İşleri Başkanlığı takvimine uyumlu olarak API üzerinden (Aladhan Method 13) anlık çekilmektedir."
        },
        {
            question: "İlçemde vakit farklı olabilir mi?",
            answer: "Evet, bu hesaplama seçilen il merkezi baz alınarak yapılmaktadır. İlçeler arasında birkaç dakikalık farklar oluşabilir."
        },
        {
            question: "İftar vakti ne zaman?",
            answer: "İftar vakti, Akşam ezanının okunduğu vakittir. Sayaç 'Akşam' vaktine geri sayım yapar."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <main className="max-w-6xl mx-auto px-4 pt-10 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Breadcrumb & Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
                                <span>/</span>
                                <Link href="/tum-hesaplamalar?category=genel" className="hover:text-blue-600 transition-colors">Genel</Link>
                                <span>/</span>
                                <span className="text-gray-800">İmsak Hesaplama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                İftar ve Sahur Sayacı
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Bulunduğunuz il için oruç ve namaz vakitlerini takip edin.
                            </p>
                        </div>

                        {/* Selection Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <PremiumSelect
                                label="Şehir Seçiniz"
                                value={city}
                                onChange={setCity}
                                options={TURKEY_CITIES.map(c => ({ value: c, label: c }))}
                            />
                        </div>

                        {/* Times Grid */}
                        {todayTimes && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">Bugünün Vakitleri</h3>
                                    <span className="text-sm text-gray-500">{todayTimes.date}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        { l: "İmsak", t: todayTimes.Fajr },
                                        { l: "Güneş", t: todayTimes.Sunrise },
                                        { l: "Öğle", t: todayTimes.Dhuhr },
                                        { l: "İkindi", t: todayTimes.Asr },
                                        { l: "Akşam (İftar)", t: todayTimes.Maghrib, highlight: true },
                                        { l: "Yatsı", t: todayTimes.Isha }
                                    ].map((item, i) => (
                                        <div key={i} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${status?.nextEvent === "İftar" && item.highlight
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : status?.nextEvent === "İmsak" && item.l === "İmsak"
                                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                                : "bg-gray-50 border-gray-100 text-gray-700"
                                            }`}>
                                            <span className="text-xs uppercase tracking-wider opacity-70 mb-1">{item.l}</span>
                                            <span className="text-xl font-bold">{item.t}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Toggle Calendar Button */}
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="w-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{showCalendar ? "Aylık İmsakiyeyi Gizle" : "Aylık İmsakiyeyi Görüntüle"}</span>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${showCalendar ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* FAQ */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

                    {/* Right Column: Countdown */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-[72px]">
                        <div className="rounded-3xl p-8 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center text-center gap-6 relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,71.2,34.7C60.1,46.3,49.3,55.8,37.3,63.1C25.2,70.4,12,75.5,-1.9,78.8C-15.8,82.1,-30.3,83.6,-42.6,77.7C-54.9,71.8,-65,58.4,-72.4,44.1C-79.9,29.8,-84.6,14.6,-83.1,0.2C-81.6,-14.2,-73.9,-27.8,-64.1,-39.2C-54.3,-50.6,-42.4,-59.8,-29.9,-67.8C-17.4,-75.8,-4.3,-82.6,9.8,-82.6L44.7,-76.4Z" transform="translate(100 100)" />
                                </svg>
                            </div>

                            {loading ? (
                                <div className="space-y-4 animate-pulse w-full">
                                    <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
                                    <div className="h-20 bg-white/20 rounded w-3/4 mx-auto"></div>
                                </div>
                            ) : status ? (
                                <>
                                    <div className="space-y-2 relative z-10">
                                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                                            <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
                                            {city}
                                        </div>
                                        <h2 className="text-blue-100 font-medium uppercase tracking-widest text-sm">
                                            {status.label}
                                        </h2>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-baseline justify-center gap-1 font-mono leading-none">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-6xl md:text-7xl font-bold">{pad(timeLeft.hours)}</span>
                                                <span className="text-xs text-blue-200">SAAT</span>
                                            </div>
                                            <span className="text-6xl md:text-7xl font-bold opacity-50">:</span>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-6xl md:text-7xl font-bold">{pad(timeLeft.minutes)}</span>
                                                <span className="text-xs text-blue-200">DAKİKA</span>
                                            </div>
                                            <span className="text-6xl md:text-7xl font-bold opacity-50">:</span>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-6xl md:text-7xl font-bold">{pad(timeLeft.seconds)}</span>
                                                <span className="text-xs text-blue-200">SANİYE</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 bg-white/10 rounded-xl p-4 w-full backdrop-blur-sm mt-2 border border-white/10">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-100">{status.nextEvent} Vakti</span>
                                            <span className="text-2xl font-bold">{status.nextTime}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-12 text-blue-100">Veriler yüklenemedi.</div>
                            )}

                            <div className="text-xs text-blue-200/60 mt-auto relative z-10">
                                Kaynak: Diyanet İşleri Başkanlığı (via Aladhan)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Calendar Table */}
                {showCalendar && (
                    <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 scroll-mt-24" id="calendar-section">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{city} İçin Aylık İmsakiye</h2>
                            <span className="text-sm text-gray-500 capitalize">
                                {new Date().toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>

                        {calendarLoading ? (
                            <div className="py-12 flex justify-center text-gray-500">
                                <span className="animate-pulse">Takvim yükleniyor...</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/50">
                                            <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-xl">Tarih</th>
                                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">İmsak</th>
                                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Güneş</th>
                                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Öğle</th>
                                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">İkindi</th>
                                            <th className="py-4 px-4 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">İftar</th>
                                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-xl">Yatsı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {monthlyData.map((day, idx) => {
                                            const isToday = day.date.readable === todayTimes?.date;
                                            const englishMonth = day.date.gregorian.month.en;
                                            const turkishMonth = TURKISH_MONTHS[englishMonth] || englishMonth;

                                            return (
                                                <tr key={idx} className={`transition-colors ${isToday ? "bg-blue-50/60" : "hover:bg-gray-50"}`}>
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                        {day.date.gregorian.day} <span className="hidden sm:inline">{turkishMonth}</span>
                                                        <div className="text-[10px] text-gray-400 font-normal sm:hidden">{turkishMonth}</div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm font-semibold text-gray-900">
                                                        {day.timings.Fajr.split(" ")[0]}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm text-gray-500 hidden sm:table-cell">
                                                        {day.timings.Sunrise.split(" ")[0]}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm text-gray-500 hidden sm:table-cell">
                                                        {day.timings.Dhuhr.split(" ")[0]}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm text-gray-500 hidden sm:table-cell">
                                                        {day.timings.Asr.split(" ")[0]}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm font-bold text-blue-600">
                                                        {day.timings.Maghrib.split(" ")[0]}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm text-gray-500">
                                                        {day.timings.Isha.split(" ")[0]}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
