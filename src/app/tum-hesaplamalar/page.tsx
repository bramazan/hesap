"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { calculators, categories } from "@/lib/data";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export default function AllCalculatorsPage() {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const category = searchParams.get("category");
        if (category) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory("all");
        }
    }, [searchParams]);

    const filteredCalculators = calculators.filter((calc) => {
        const matchesCategory = selectedCategory === "all" || calc.category === selectedCategory;
        const matchesSearch = calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#101622] transition-colors duration-300">
            <main className="max-w-[1200px] mx-auto px-6 py-12">
                {/* Page Header */}
                <section className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#111318] dark:text-white mb-4">
                        Tüm Hesaplama Araçları
                    </h1>
                    <p className="text-[#616f89] dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Finans, sağlık ve yaşam kalitenizi artıracak hassas hesaplama çözümleri. Aradığınız her şey burada.
                    </p>
                </section>

                {/* Search Bar */}
                <section className="max-w-2xl mx-auto mb-10">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="w-6 h-6 text-[#1152d4]" />
                        </div>
                        <input
                            type="text"
                            className="w-full h-14 pl-14 pr-6 bg-white dark:bg-gray-900 border border-[#f0f2f4] dark:border-gray-800 rounded-full text-lg focus:ring-2 focus:ring-[#1152d4]/20 focus:border-[#1152d4] outline-none transition-all shadow-sm group-hover:shadow-md placeholder:text-[#616f89] dark:placeholder:text-gray-500 text-[#111318] dark:text-white"
                            placeholder="Hesaplama aracı ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Category Filtering */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-all ${selectedCategory === "all"
                                ? "bg-white dark:bg-gray-900 text-[#1152d4] border border-[#1152d4] shadow-[0_0_15px_rgba(17,82,212,0.15)]"
                                : "bg-white dark:bg-gray-900 text-[#111318] dark:text-gray-300 border border-[#f0f2f4] dark:border-gray-800 hover:border-[#1152d4]/50"
                                }`}
                        >
                            <span className="text-sm font-semibold">Hepsi</span>
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-all ${selectedCategory === category.id
                                    ? "bg-white dark:bg-gray-900 text-[#1152d4] border border-[#1152d4] shadow-[0_0_15px_rgba(17,82,212,0.15)]"
                                    : "bg-white dark:bg-gray-900 text-[#111318] dark:text-gray-300 border border-[#f0f2f4] dark:border-gray-800 hover:border-[#1152d4]/50"
                                    }`}
                            >
                                <span className="text-sm font-medium">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Tool Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCalculators.map((calc) => (
                        <Link
                            key={calc.slug}
                            href={`/${calc.category}/${calc.slug}`}
                            className="group relative bg-white dark:bg-gray-900 border border-[#f0f2f4] dark:border-gray-800 p-8 rounded-lg hover:border-[#1152d4]/30 transition-all duration-300 cursor-pointer overflow-hidden block"
                        >
                            <div className="mb-6 flex justify-between items-start">
                                <div className="w-12 h-12 bg-[#1152d4]/5 rounded-xl flex items-center justify-center text-2xl">
                                    {calc.icon}
                                </div>
                                <ArrowRight className="w-6 h-6 text-[#1152d4] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-[#1152d4] transition-colors text-[#111318] dark:text-white">
                                {calc.title}
                            </h3>
                            <p className="text-sm text-[#616f89] dark:text-gray-400">
                                {calc.description}
                            </p>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1152d4] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </Link>
                    ))}
                </section>

                {/* Empty State */}
                {filteredCalculators.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[#616f89] dark:text-gray-400">Bu kategoride veya aramada henüz hesaplama aracı bulunmamaktadır.</p>
                    </div>
                ) : (
                    /* View All / Pagination (Minimalist) */
                    <div className="mt-16 text-center">
                        <button className="bg-[#f0f2f4] dark:bg-gray-800 text-[#111318] dark:text-white font-semibold py-4 px-10 rounded-full hover:bg-[#e5e7eb] dark:hover:bg-gray-700 transition-colors">
                            Daha Fazla Göster
                        </button>
                    </div>
                )}
            </main>
            <div className="h-20"></div> {/* Spacer for footer separation */}
        </div>
    );
}
