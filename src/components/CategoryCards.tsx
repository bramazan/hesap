import Link from "next/link";

interface Category {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
    count: number;
}

interface CategoryCardsProps {
    categories: Category[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/tum-hesaplamalar?category=${cat.id}`}
                    className="group relative"
                >
                    {/* 3D Card with perspective */}
                    <div
                        className={`relative h-44 rounded-3xl p-5 transition-all duration-300 transform-gpu
              bg-gradient-to-br ${cat.color}
              hover:scale-[1.03] hover:-translate-y-1
              hover:shadow-2xl hover:shadow-${cat.id === 'finans' ? 'emerald' : cat.id === 'genel' ? 'blue' : cat.id === 'e-ticaret' ? 'orange' : 'purple'}-500/20
              group-hover:rotate-1
            `}
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Glass overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl mb-auto shadow-lg">
                                {cat.icon}
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">
                                    {cat.name}
                                </h3>
                                <p className="text-white/70 text-sm line-clamp-2">
                                    {cat.description}
                                </p>
                            </div>

                            {/* Count badge */}
                            <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium">
                                {cat.count} araç
                            </div>

                            {/* Arrow indicator */}
                            <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* 3D Shadow layer */}
                        <div className="absolute -bottom-2 left-4 right-4 h-8 bg-black/10 rounded-3xl blur-xl -z-10 group-hover:blur-2xl transition-all" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
