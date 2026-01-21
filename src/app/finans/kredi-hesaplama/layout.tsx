import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Kredi Hesaplama - Aylık Taksit ve Faiz Hesaplama",
    description:
        "Online kredi hesaplama aracı. Aylık taksit tutarını, toplam ödemeyi ve faiz maliyetini anında hesaplayın.",
    keywords: ["kredi hesaplama", "kredi hesapla", "taksit hesaplama", "kredi faizi", "aylık taksit"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/kredi-hesaplama",
    },
};

const faqItems = [
    {
        question: "Kredi hesaplama nasıl yapılır?",
        answer: "Kredi hesaplama, anapara tutarı, aylık faiz oranı ve vade süresine göre aylık taksit tutarını hesaplar. Formül: Taksit = Anapara × (Faiz × (1+Faiz)^Vade) / ((1+Faiz)^Vade - 1)",
    },
    {
        question: "Aylık faiz oranı nedir?",
        answer: "Aylık faiz oranı, bankanın kredi tutarı üzerinden her ay aldığı faiz yüzdesidir. Yıllık faiz oranını 12'ye bölerek aylık oranı bulabilirsiniz.",
    },
    {
        question: "Toplam faiz nasıl hesaplanır?",
        answer: "Toplam faiz = (Aylık Taksit × Vade Süresi) - Anapara Tutarı formülüyle hesaplanır. Bu tutar, kredinin size maliyetini gösterir.",
    },
    {
        question: "Vade süresi seçimi nasıl etkiler?",
        answer: "Vade uzadıkça aylık taksit düşer ancak toplam faiz artar. Kısa vadede taksit yüksek olsa da toplam ödeme daha azdır.",
    },
];

export default function KrediHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Kredi Hesaplama"
                calculatorDescription="Online kredi hesaplama aracı. Aylık taksit tutarını, toplam ödemeyi ve faiz maliyetini anında hesaplayın."
                canonicalUrl="https://kolayhesap.co/finans/kredi-hesaplama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["Aylık Taksit Hesaplama", "Toplam Ödeme", "Faiz Maliyeti", "KKDF ve BSMV Detayı", "Ödeme Planı"]}
            />
            {children}
        </>
    );
}
