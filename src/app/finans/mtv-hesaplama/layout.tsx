import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "MTV Hesaplama 2026 - Motorlu Taşıtlar Vergisi",
    description:
        "2026 yılı güncel MTV hesaplama aracı. Otomobil, motosiklet ve diğer araçlarınızın Motorlu Taşıtlar Vergisini kolayca hesaplayın.",
    keywords: ["mtv hesaplama", "motorlu taşıtlar vergisi", "araç vergisi", "araç mtv", "2026 mtv"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/mtv-hesaplama",
    },
};

const faqItems = [
    {
        question: "MTV ödemeleri ne zaman yapılır?",
        answer: "Motorlu Taşıtlar Vergisi her yıl Ocak ve Temmuz aylarında olmak üzere iki eşit taksitte ödenir. İlk taksit 1-31 Ocak, ikinci taksit 1-31 Temmuz tarihleri arasındadır.",
    },
    {
        question: "Araç değeri MTV'yi nasıl etkiler?",
        answer: "01.01.2018 tarihinden sonra tescil edilen otomobillerde MTV tutarı; motor silindir hacmi ve yaşın yanı sıra aracın 'taşıt değeri'ne göre de değişmektedir.",
    },
    {
        question: "MTV'yi nereden ödeyebilirim?",
        answer: "MTV ödemesi GİB (Gelir İdaresi Başkanlığı) internet sitesi, e-Devlet, banka şubeleri veya internet/mobil bankacılık üzerinden yapılabilir.",
    },
    {
        question: "Yeni alınan araçlarda MTV ne zaman başlar?",
        answer: "Yeni alınan araçların MTV'si, aracın tescil edildiği ay itibariyle başlar ve kalan aylar için orantılı olarak hesaplanır.",
    },
    {
        question: "MTV ödenmezse ne olur?",
        answer: "MTV zamanında ödenmediğinde gecikme zammı uygulanır. Ayrıca araç satışı ve devir işlemleri MTV borcu kapatılmadan yapılamaz.",
    },
];

export default function MtvHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="MTV Hesaplama"
                calculatorDescription="2026 yılı güncel MTV hesaplama aracı. Aracınızın Motorlu Taşıtlar Vergisini kolayca hesaplayın."
                canonicalUrl="https://kolayhesap.co/finans/mtv-hesaplama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["2026 Güncel Tarifeler", "Otomobil/Motosiklet", "Yaş ve Değer Bazlı", "Taksit Bilgisi"]}
            />
            {children}
        </>
    );
}
