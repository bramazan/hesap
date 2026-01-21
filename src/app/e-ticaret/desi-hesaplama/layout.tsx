import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Desi Hesaplama - Kargo Hacim Hesaplayıcı",
    description:
        "Online desi hesaplama aracı. Kargo paketlerinizin hacimsel ağırlığını (desi) anında hesaplayın. Gerçek ağırlık karşılaştırması dahil.",
    keywords: ["desi hesaplama", "desi hesapla", "kargo desi", "hacimsel ağırlık", "kargo hesaplama"],
    alternates: {
        canonical: "https://kolayhesap.co/e-ticaret/desi-hesaplama",
    },
};

const faqItems = [
    {
        question: "Desi nedir?",
        answer: "Desi, kargo işlemlerinde bir paketin hacimsel ağırlığını ifade eder. Kargo firmaları, taşıma ücretini belirlerken paketin gerçek ağırlığı ile desi değerini karşılaştırır ve hangisi büyükse ona göre ücretlendirme yapar.",
    },
    {
        question: "Desi nasıl hesaplanır?",
        answer: "Standart desi hesaplama formülü: (En x Boy x Yükseklik) / 3000 şeklindedir. Ölçüler santimetre (cm) cinsinden alınır.",
    },
    {
        question: "3000 sabiti nedir?",
        answer: "Uluslararası standartlarda ve Türkiye'deki kargo firmalarının çoğunda hacimsel ağırlık hesaplanırken kullanılan bölen katsayısıdır. Bazı durumlarda bu katsayı 4000 veya 5000 olarak da kullanılabilir.",
    },
    {
        question: "Ücret ağırlığı nedir?",
        answer: "Kargo fiyatlandırmasında kullanılan ağırlıktır. Paketin gerçek ağırlığı (kg) ile desisi (hacimsel ağırlığı) karşılaştırılır; hangisi daha yüksekse o değer 'ücret ağırlığı' olarak kabul edilir.",
    },
];

export default function DesiHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Desi Hesaplama"
                calculatorDescription="Online desi hesaplama aracı. Kargo paketlerinizin hacimsel ağırlığını anında hesaplayın."
                canonicalUrl="https://kolayhesap.co/e-ticaret/desi-hesaplama"
                categoryName="E-Ticaret"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=e-ticaret"
                faqItems={faqItems}
                featureList={["Desi Hesaplama", "Ücret Ağırlığı", "Farklı Katsayılar", "Çoklu Paket"]}
                applicationCategory="BusinessApplication"
            />
            {children}
        </>
    );
}
