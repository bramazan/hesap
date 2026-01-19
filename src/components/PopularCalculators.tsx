import Link from "next/link";

interface Calculator {
    slug: string;
    icon: string;
    title: string;
    description: string;
    category: string;
}

interface PopularCalculatorsProps {
    calculators: Calculator[];
}

export function PopularCalculators({ calculators }: PopularCalculatorsProps) {
    return (
        <section className="py-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Popüler Hesaplamalar</h2>
                    <p className="text-gray-500 mt-1">En çok kullanılan hesaplama araçları</p>
                </div>
                <Link
                    href="/tum-hesaplamalar"
                    className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                    Tümünü Gör
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {calculators.map((calc, index) => (
                    <Link
                        key={calc.slug}
                        href={`/${calc.category}/${calc.slug}`}
                        className="group relative"
                    >
                        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200">
                            {/* Rank number */}
                            <div className="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                {index + 1}
                            </div>

                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
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
                                className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
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
        </section>
    );
}
