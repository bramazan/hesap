import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Maaş Hesaplama 2026 - Net Brüt Maaş Dönüştürücü",
    description:
        "Online maaş hesaplama aracı. Brütten nete, netten brüte maaş dönüşümü yapın. SGK, vergi kesintileri ve işveren maliyetini görün.",
    keywords: ["maaş hesaplama", "net maaş hesapla", "brüt maaş hesapla", "sgk kesintisi", "gelir vergisi"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/maas-hesaplama",
    },
};

const faqItems = [
    {
        question: "Brüt maaştan hangi kesintiler yapılır?",
        answer: "SGK işçi primi (%14), işsizlik sigortası (%1), gelir vergisi (kümülatif, %15-40 arası dilimli) ve damga vergisi (binde 7,59) kesilir. Asgari ücret tutarına kadar gelir vergisi ve damga vergisi istisnası uygulanır.",
    },
    {
        question: "Kümülatif vergi matrahı nedir?",
        answer: "Gelir vergisi yıllık ve kümülatif çalışır. Yıl içinde biriken vergi matrahınız arttıkça daha yüksek vergi dilimlerine girersiniz. Bu nedenle aynı brüt ücret, yılın başında ve sonunda farklı net sonuçlar üretebilir.",
    },
    {
        question: "Asgari ücret vergi istisnası ne demek?",
        answer: "2026'da asgari ücret seviyesine kadar gelir vergisi ve damga vergisi istisnası uygulanır. Bu nedenle asgari ücrette net maaş yaklaşık 28.075,50 TL olur (sadece SGK kesintileri düşülür).",
    },
    {
        question: "İşveren maliyeti nasıl hesaplanır?",
        answer: "Brüt maaşın üzerine işveren %20.5 SGK primi ve %2 işsizlik sigortası öder. Bu toplam işveren maliyetini oluşturur.",
    },
    {
        question: "SGK tavan ücreti ne anlama gelir?",
        answer: "2026'da SGK prim tavanı 297.270 TL'dir. Brüt ücret bu tutarın üzerindeyse bile, SGK ve işsizlik primleri bu tavan üzerinden hesaplanır.",
    },
];

export default function MaasHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Maaş Hesaplama"
                calculatorDescription="2026 yılı parametreleriyle brütten nete veya netten brüte maaş hesaplama. SGK, vergi kesintileri ve işveren maliyeti dahil."
                canonicalUrl="https://kolayhesap.co/finans/maas-hesaplama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["Brütten Nete", "Netten Brüte", "SGK Kesintileri", "Gelir Vergisi", "İşveren Maliyeti", "Yıllık Maaş Tablosu"]}
            />
            {children}
        </>
    );
}
