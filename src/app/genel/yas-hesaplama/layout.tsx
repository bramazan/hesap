import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Yaş Hesaplama - Doğum Tarihinden Yaş Hesapla",
    description:
        "Online yaş hesaplama aracı. Doğum tarihinizden yaşınızı yıl, ay ve gün olarak anında hesaplayın. Toplam gün sayısını öğrenin.",
    keywords: ["yaş hesaplama", "yaş hesapla", "kaç yaşındayım", "doğum tarihi hesaplama"],
    alternates: {
        canonical: "https://kolayhesap.co/genel/yas-hesaplama",
    },
};

const faqItems = [
    {
        question: "Yaş nasıl hesaplanır?",
        answer: "Yaş, doğum tarihiniz ile bugünün tarihi arasındaki farka göre hesaplanır. Yıl, ay ve gün olarak detaylı sonuç verilir.",
    },
    {
        question: "Toplam kaç gün yaşadım?",
        answer: "Doğum tarihinizden bugüne kadar geçen toplam gün sayısı, her yıl için 365 gün (artık yıllarda 366) hesaplanarak bulunur.",
    },
    {
        question: "Burç hesaplama nasıl yapılır?",
        answer: "Burcunuz, doğum tarihinizin hangi zodyak dönemine denk geldiğine göre belirlenir. Her burç yaklaşık 30 günlük bir dönemi kapsar.",
    },
];

export default function YasHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Yaş Hesaplama"
                calculatorDescription="Online yaş hesaplama aracı. Doğum tarihinizden yaşınızı yıl, ay ve gün olarak anında hesaplayın."
                canonicalUrl="https://kolayhesap.co/genel/yas-hesaplama"
                categoryName="Genel"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=genel"
                faqItems={faqItems}
                featureList={["Yaş Hesaplama", "Gün Sayısı", "Burç Hesaplama", "Bir Sonraki Doğum Günü"]}
                applicationCategory="UtilitiesApplication"
            />
            {children}
        </>
    );
}
