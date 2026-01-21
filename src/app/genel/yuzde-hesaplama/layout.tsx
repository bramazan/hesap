import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Yüzde Hesaplama - Bir Sayının Yüzdesini Hesapla",
    description:
        "Online yüzde hesaplama aracı. Bir sayının yüzdesini, yüzde artış ve azalışı anında hesaplayın. Ücretsiz ve hızlı.",
    keywords: ["yüzde hesaplama", "yüzde hesapla", "yüzde bulma", "yüzdelik hesaplama"],
    alternates: {
        canonical: "https://kolayhesap.co/genel/yuzde-hesaplama",
    },
};

const faqItems = [
    {
        question: "Yüzde nasıl hesaplanır?",
        answer: "Bir sayının yüzdesini bulmak için sayıyı yüzde değerine bölüp 100 ile çarparsınız. Örneğin 200'ün %15'i = 200 × 15 ÷ 100 = 30",
    },
    {
        question: "Yüzde artış nasıl hesaplanır?",
        answer: "Yüzde artış = ((Yeni Değer - Eski Değer) ÷ Eski Değer) × 100. Örneğin 100'den 120'ye artış = %20 artış.",
    },
    {
        question: "Yüzde indirim nasıl hesaplanır?",
        answer: "İndirimli fiyat = Orijinal Fiyat - (Orijinal Fiyat × İndirim Oranı ÷ 100). 500₺'lik ürüne %20 indirim = 500 - 100 = 400₺",
    },
    {
        question: "Yüzdelik dilim ne demek?",
        answer: "Yüzdelik dilim, bir değerin toplam içindeki payını gösterir. Örneğin %25'lik dilim, toplam 100 birimden 25 birime karşılık gelir.",
    },
];

export default function YuzdeHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Yüzde Hesaplama"
                calculatorDescription="Online yüzde hesaplama aracı. Bir sayının yüzdesini, yüzde artış ve azalışı anında hesaplayın."
                canonicalUrl="https://kolayhesap.co/genel/yuzde-hesaplama"
                categoryName="Genel"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=genel"
                faqItems={faqItems}
                featureList={["Yüzde Hesaplama", "Yüzde Artış", "Yüzde Azalış", "Anlık Sonuç"]}
                applicationCategory="UtilitiesApplication"
            />
            {children}
        </>
    );
}
