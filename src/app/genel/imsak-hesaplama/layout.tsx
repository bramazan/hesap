import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "İmsak Hesaplama - İftar ve Sahur Sayacı",
    description:
        "81 il için güncel namaz vakitleri ve iftar/sahur sayacı. İmsak, güneş, öğle, ikindi, akşam ve yatsı vakitlerini öğrenin.",
    keywords: ["imsak hesaplama", "iftar saati", "sahur saati", "namaz vakitleri", "ramazan imsakiye"],
    alternates: {
        canonical: "https://kolayhesap.co/genel/imsak-hesaplama",
    },
};

const faqItems = [
    {
        question: "Sahura ne kadar kaldı ne demek?",
        answer: "Geri sayım, orucun başlama vakti olan 'İmsak' vaktine göre yapılır. Yani 'Sahura kalan süre', imsak vaktine (yeme içmenin kesilmesi gereken vakit) kalan süredir.",
    },
    {
        question: "Vakitler nereden alınıyor?",
        answer: "Veriler, Diyanet İşleri Başkanlığı takvimine uyumlu olarak API üzerinden (Aladhan Method 13) anlık çekilmektedir.",
    },
    {
        question: "İlçemde vakit farklı olabilir mi?",
        answer: "Evet, bu hesaplama seçilen il merkezi baz alınarak yapılmaktadır. İlçeler arasında birkaç dakikalık farklar oluşabilir.",
    },
    {
        question: "İftar vakti ne zaman?",
        answer: "İftar vakti, Akşam ezanının okunduğu vakittir. Sayaç 'Akşam' vaktine geri sayım yapar.",
    },
];

export default function ImsakHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="İmsak Hesaplama"
                calculatorDescription="81 il için güncel namaz vakitleri ve iftar/sahur sayacı. Canlı geri sayım ile imsak ve iftar vakitlerini takip edin."
                canonicalUrl="https://kolayhesap.co/genel/imsak-hesaplama"
                categoryName="Genel"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=genel"
                faqItems={faqItems}
                featureList={["Canlı Geri Sayım", "6 Vakit", "81 İl", "Aylık İmsakiye"]}
                applicationCategory="LifestyleApplication"
            />
            {children}
        </>
    );
}
