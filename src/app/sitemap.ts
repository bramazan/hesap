import { MetadataRoute } from 'next';
import { calculators } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://kolayhesap.co';

    // Static routes
    const routes = [
        '',
        '/finans',
        '/genel',
        '/e-ticaret',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic calculator routes
    const calculatorRoutes = calculators.map((calc) => ({
        url: `${baseUrl}/${calc.category}/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // High priority for actual tools
    }));

    return [...routes, ...calculatorRoutes];
}
