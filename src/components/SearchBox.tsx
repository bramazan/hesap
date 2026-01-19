"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Calculator {
    slug: string;
    icon: string;
    title: string;
    description: string;
    category: string;
    categoryLabel: string;
}

interface SearchBoxProps {
    calculators: Calculator[];
}

export function SearchBox({ calculators }: SearchBoxProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filteredCalculators = useMemo(() => {
        if (!query.trim()) return [];
        const searchQuery = query.toLowerCase().trim();
        return calculators.filter(
            (calc) =>
                calc.title.toLowerCase().includes(searchQuery) ||
                calc.description.toLowerCase().includes(searchQuery) ||
                calc.categoryLabel.toLowerCase().includes(searchQuery)
        ).slice(0, 3);
    }, [query, calculators]);

    const handleSelect = (calc: Calculator) => {
        router.push(`/${calc.category}/${calc.slug}`);
        setIsOpen(false);
        setQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || filteredCalculators.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredCalculators.length - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredCalculators.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                handleSelect(filteredCalculators[selectedIndex]);
                break;
            case "Escape":
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredCalculators]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-[100]">
            {/* Search Input - Clean & Modern */}
            <div
                className={`relative transition-all duration-300 ${isFocused
                    ? "transform scale-[1.02]"
                    : ""
                    }`}
            >
                <div
                    className={`flex items-center gap-4 px-6 py-5 bg-white rounded-2xl border-2 transition-all duration-300 ${isFocused
                        ? "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                        : "border-gray-200 shadow-lg shadow-gray-200/60 hover:border-gray-300"
                        }`}
                >
                    {/* Search Icon */}
                    <svg
                        className={`w-6 h-6 transition-colors ${isFocused ? "text-blue-500" : "text-gray-400"
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Hesaplayıcı ara..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => {
                            setIsOpen(true);
                            setIsFocused(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 text-lg text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                    />

                    {/* Clear button */}
                    {query && (
                        <button
                            onClick={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {/* Keyboard shortcut hint */}
                    {!query && !isFocused && (
                        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-500 font-mono">/</kbd>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Dropdown Results */}
            {isOpen && filteredCalculators.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-300/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                        {filteredCalculators.map((calc, index) => (
                            <button
                                key={calc.slug}
                                onClick={() => handleSelect(calc)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150 ${index === selectedIndex
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                {/* Icon with gradient background */}
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform ${index === selectedIndex
                                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 shadow-lg shadow-blue-500/30"
                                        : "bg-gray-100"
                                        }`}
                                >
                                    {calc.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div
                                        className={`font-semibold ${index === selectedIndex ? "text-blue-700" : "text-gray-800"
                                            }`}
                                    >
                                        {calc.title}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        {calc.description}
                                    </div>
                                </div>

                                {/* Category badge */}
                                <span
                                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${index === selectedIndex
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {calc.categoryLabel}
                                </span>

                                {/* Arrow */}
                                <svg
                                    className={`w-5 h-5 transition-all ${index === selectedIndex
                                        ? "text-blue-500 translate-x-1"
                                        : "text-gray-300"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {isOpen && query.trim() && filteredCalculators.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 text-center z-50">
                    <div className="text-4xl mb-3">🔍</div>
                    <div className="text-gray-600 font-medium">&quot;{query}&quot; için sonuç bulunamadı</div>
                    <div className="text-sm text-gray-400 mt-1">Farklı bir anahtar kelime deneyin</div>
                </div>
            )}
        </div>
    );
}
