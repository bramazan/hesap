import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Mevduat Faizi Hesaplama - Vadeli Hesap Getiri Hesaplayıcı",
    description:
        "Online mevduat faizi hesaplama aracı. Vadeli hesap getirinizi, stopaj kesintisini ve net kazancınızı anında hesaplayın.",
    keywords: ["mevduat faizi hesaplama", "vadeli hesap", "faiz hesaplama", "stopaj kesintisi", "net faiz getirisi"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/mevduat-faizi-hesaplama",
    },
};

const faqItems = [
    {
        question: "Mevduat faizi hesaplaması nasıl yapılır?",
        answer: "Mevduat faizi, 'Anapara × Faiz Oranı × Vade (Gün) / 36500' formülü ile brüt olarak hesaplanır. Net kazanç için bu tutardan stopaj vergisi düşülür.",
    },
    {
        question: "Stopaj (vergi) oranları nedir?",
        answer: "Stopaj oranları vadeye göre değişir: 6 aya kadar (dahil) %7.5, 1 yıla kadar (dahil) %5, 1 yıldan uzun vadelerde %2.5 oranında vergi kesintisi uygulanır.",
    },
    {
        question: "Faiz getirisi neye göre değişir?",
        answer: "Faiz getirisi; yatırılan anapara tutarına, bankanın sunduğu faiz oranına ve paranın bankada kalacağı gün sayısına (vade) göre değişiklik gösterir.",
    },
    {
        question: "Mevduat faizi günlük mü işlemekte?",
        answer: "Genellikle vadeli mevduat hesapları vade sonunu bekler. Ancak 'Günlük Faiz' (Kırık Faiz) veren hesaplar, parayı her gün işletip istediğiniz zaman çekmenize olanak tanır.",
    },
];

export default function MevduatFaiziLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Mevduat Faizi Hesaplama"
                calculatorDescription="Online mevduat faizi hesaplama aracı. Vadeli hesap getirinizi ve vergi kesintilerini anında hesaplayın."
                canonicalUrl="https://kolayhesap.co/finans/mevduat-faizi-hesaplama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["Brüt/Net Faiz", "Stopaj Hesaplama", "Farklı Vadeler", "Detaylı Tablo"]}
            />
            {children}
        </>
    );
}
