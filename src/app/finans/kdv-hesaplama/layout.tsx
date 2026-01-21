import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "KDV Hesaplama 2025 - KDV Dahil/Hariç Fiyat Hesapla",
    description:
        "Online KDV hesaplama aracı. KDV dahil ve hariç fiyatı, KDV tutarını anında hesaplayın. %20, %10, %1 oranları desteklenir.",
    keywords: ["kdv hesaplama", "kdv hesapla", "kdv dahil", "kdv hariç", "kdv tutarı"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/kdv-hesaplama",
    },
};

const faqItems = [
    {
        question: "Türkiye'de KDV oranları nelerdir?",
        answer: "Türkiye'de üç farklı KDV oranı uygulanmaktadır: %1 (gazete, dergi, kitap), %10 (temel gıda, eğitim, sağlık hizmetleri), %20 (genel oran - çoğu mal ve hizmet).",
    },
    {
        question: "KDV dahil fiyattan KDV nasıl hesaplanır?",
        answer: "KDV Hariç = KDV Dahil Fiyat ÷ (1 + KDV Oranı/100). Örneğin 1200₺ KDV dahil fiyat için %20 KDV: 1200 ÷ 1.20 = 1000₺ KDV hariç, 200₺ KDV tutarı.",
    },
    {
        question: "KDV hariç fiyata KDV nasıl eklenir?",
        answer: "KDV Dahil = KDV Hariç × (1 + KDV Oranı/100). Örneğin 1000₺'ye %20 KDV eklemek için: 1000 × 1.20 = 1200₺ KDV dahil fiyat.",
    },
    {
        question: "Hangi ürünlerde %1 KDV uygulanır?",
        answer: "Gazete, dergi, kitap ve benzeri basılı yayınlarda %1 oranında KDV uygulanmaktadır.",
    },
];

export default function KdvHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="KDV Hesaplama"
                calculatorDescription="Online KDV hesaplama aracı. KDV dahil ve hariç fiyatı, KDV tutarını anında hesaplayın."
                canonicalUrl="https://kolayhesap.co/finans/kdv-hesaplama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["KDV Ekleme", "KDV Çıkarma", "%1 - %10 - %20 Oranları", "Özel Oran Desteği"]}
            />
            {children}
        </>
    );
}
