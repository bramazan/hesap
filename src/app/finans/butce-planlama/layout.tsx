import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Bütçe Planlama - Akıllı Aylık Bütçe Hesaplama Aracı",
    description:
        "Gelirinize uygun akıllı bütçe planı oluşturun. Konut, gıda, ulaşım ve birikim hedeflerinizi optimize edin. Hızlı ve detaylı planlama modları.",
    keywords: [
        "bütçe planlama",
        "bütçe hesaplama",
        "aylık bütçe",
        "harcama planı",
        "birikim hesaplama",
        "gelir gider hesaplama",
        "50 30 20 kuralı",
    ],
    alternates: {
        canonical: "https://kolayhesap.co/finans/butce-planlama",
    },
};

const faqItems = [
    {
        question: "Bütçe planlaması neden önemlidir?",
        answer: "Bütçe planlaması, gelirinizi verimli kullanmanızı, borçtan kaçınmanızı ve birikim yapmanızı sağlar. Düzenli bütçe takibi finansal hedeflerinize ulaşmanızı kolaylaştırır.",
    },
    {
        question: "50/30/20 kuralı nedir?",
        answer: "50/30/20 kuralı popüler bir bütçe metodudur: Gelirinizin %50'si ihtiyaçlara (kira, faturalar), %30'u isteklere (eğlence, yeme-içme), %20'si birikime ayrılır.",
    },
    {
        question: "Aylık bütçe nasıl hazırlanır?",
        answer: "Önce toplam gelirinizi belirleyin. Ardından sabit giderlerinizi (kira, fatura, kredi) listeleyin. Kalan tutarı değişken giderler ve birikim arasında paylaştırın.",
    },
    {
        question: "Birikim oranı ne kadar olmalı?",
        answer: "Genel olarak gelirinizin en az %20'sini biriktirmeniz önerilir. Ancak bu oran durumunuza göre değişebilir. Önemli olan düzenli olarak birikim yapabilmenizdir.",
    },
];

export default function ButcePlanlamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Bütçe Planlama"
                calculatorDescription="Gelirinize uygun akıllı bütçe planı oluşturun. Konut, gıda, ulaşım ve birikim hedeflerinizi optimize edin."
                canonicalUrl="https://kolayhesap.co/finans/butce-planlama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["Hızlı Bütçe Planı", "Detaylı Planlama", "50/30/20 Kuralı", "Birikim Hedefi", "Önerilen Bütçe"]}
            />
            {children}
        </>
    );
}
