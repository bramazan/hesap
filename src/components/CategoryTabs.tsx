"use client";

import { useState } from "react";

interface Category {
    id: string;
    label: string;
}

interface CategoryTabsProps {
    categories: Category[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
    const [active, setActive] = useState("all");

    return (
        <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 p-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActive(cat.id)}
                        className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${active === cat.id
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
