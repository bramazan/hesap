"use client";

import { useState } from "react";
import { calculators, categories } from "@/lib/data";
import { PopularCalculators } from "@/components/PopularCalculators";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AllCalculatorsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const filteredCalculators = selectedCategory === "all"
        ? calculators
        : calculators.filter(calc => calc.category === selectedCategory);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anasayfaya Dön
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                            🧮
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Tüm Hesaplamalar</h1>
                    </div>

                    <p className="text-gray-500 max-w-2xl mb-8">
                        Sitemizde bulunan tüm hesaplama araçlarına buradan ulaşabilirsiniz.
                        Finans, sağlık, teknoloji ve günlük yaşam için ihtiyacınız olan tüm araçlar.
                    </p>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                selectedCategory === "all"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            Tümü
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    selectedCategory === category.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCalculators.map((calc, index) => (
                        <Link
                            key={calc.slug}
                            href={`/${calc.category}/${calc.slug}`}
                            className="group relative"
                        >
                            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 h-full">
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                                    {calc.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {calc.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        {calc.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <svg
                                    className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCalculators.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Bu kategoride henüz hesaplama aracı bulunmamaktadır.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
