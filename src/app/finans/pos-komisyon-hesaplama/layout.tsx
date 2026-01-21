import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "POS Komisyon Hesaplama - Net/Brüt Hesaplayıcı",
    description:
        "Online POS komisyon hesaplama aracı. Kartlı ödeme işlemlerinde komisyon kesintisini ve net kazancınızı kolayca hesaplayın.",
    keywords: ["pos komisyon hesaplama", "pos hesaplama", "komisyon kesintisi", "sanal pos", "kartlı ödeme"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/pos-komisyon-hesaplama",
    },
};

const faqItems = [
    {
        question: "POS komisyon oranı nedir?",
        answer: "POS komisyonu, müşteri kartla ödeme yaptığında bankanın veya ödeme kuruluşunun işlem tutarı üzerinden kestiği hizmet bedelidir. Genellikle %1,5 ile %4 arasında değişir.",
    },
    {
        question: "Komisyon kesintisi nasıl hesaplanır?",
        answer: "Komisyon = İşlem Tutarı × (Komisyon Oranı / 100). Örneğin 1.000₺'lik satışta %3 komisyon uygulanırsa: 1.000 × 0,03 = 30₺ komisyon kesilir.",
    },
    {
        question: "Sabit ücret ile yüzdelik komisyon farkı ne?",
        answer: "Yüzdelik komisyon işlem tutarına bağlıdır. Sabit ücret ise işlem başına kesilen sabit tutardır (örn: 0,50₺). Bazı POS anlaşmalarında her iki kesinti birlikte uygulanır.",
    },
    {
        question: "Net→Brüt hesaplaması ne işe yarar?",
        answer: "Elinize belirli bir net tutar geçmesini istiyorsanız, müşteriden ne kadar çekmeniz gerektiğini hesaplar.",
    },
    {
        question: "Farklı bankalarda komisyon oranı değişir mi?",
        answer: "Evet, komisyon oranları banka, ödeme kuruluşu, iş hacmi ve sektöre göre değişir. Genellikle yüksek cirolu işletmeler daha düşük oranlarla anlaşabilir.",
    },
];

export default function PosKomisyonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="POS Komisyon Hesaplama"
                calculatorDescription="Online POS komisyon hesaplama aracı. Kartlı ödeme işlemlerinde komisyon kesintisini ve net kazancınızı hesaplayın."
                canonicalUrl="https://kolayhesap.co/finans/pos-komisyon-hesaplama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["Brüt→Net", "Net→Brüt", "Sabit Ücret", "Min/Max Komisyon"]}
            />
            {children}
        </>
    );
}
