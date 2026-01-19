import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Kolay Hesap - Online Hesaplama Araçları',
        short_name: 'Kolay Hesap',
        description: 'Türkiye\'nin en hızlı ve güvenilir online hesaplama araçları.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb', // Blue-600
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
