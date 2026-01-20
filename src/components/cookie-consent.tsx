"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { initGA } from "@/lib/analytics";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
        // Initialize Google Analytics after consent
        initGA();
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-5 duration-500">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/30 p-5 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🍪</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                                Çerez Kullanımı
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                                Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz.
                                Sitemizi kullanarak{" "}
                                <Link
                                    href="/gizlilik"
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                >
                                    Gizlilik Politikamızı
                                </Link>
                                {" "}kabul etmiş olursunuz.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleDecline}
                                className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Reddet
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:-translate-y-0.5"
                            >
                                Kabul Et
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
