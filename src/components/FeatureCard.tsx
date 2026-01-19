import Link from "next/link";

interface FeatureCardProps {
    href: string;
    icon: string;
    title: string;
    description: string;
}

export function FeatureCard({ href, icon, title, description }: FeatureCardProps) {
    return (
        <Link href={href} className="group block">
            <div className="h-full p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 mb-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                    {description}
                </p>
            </div>
        </Link>
    );
}
