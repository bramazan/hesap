import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "Emeklilik Hesaplama 2026 - Ne Zaman Emekli Olurum?",
    description:
        "EYT dahil emeklilik tarihi hesaplama aracı. Prim günü, sigortalılık süresi ve yaş şartlarına göre emeklilik tarihinizi hesaplayın.",
    keywords: ["emeklilik hesaplama", "ne zaman emekli olurum", "eyt hesaplama", "prim günü", "emeklilik yaşı"],
    alternates: {
        canonical: "https://kolayhesap.co/genel/emeklilik-hesaplama",
    },
};

const faqItems = [
    {
        question: "EYT (Emeklilikte Yaşa Takılanlar) nedir?",
        answer: "09.09.1999 tarihinden önce sigortalı olanlar için yaş şartı aranmadan, sadece prim günü ve sigortalılık süresi şartları ile emeklilik hakkı tanıyan uygulamadır.",
    },
    {
        question: "Prim günü nasıl hesaplanır?",
        answer: "SGK'ya bildirilen her çalışma günü prim günü olarak sayılır. Bir ayda en fazla 30 gün bildirilir. e-Devlet üzerinden 'SGK Tescil ve Hizmet Dökümü' ekranından toplam prim gününüzü öğrenebilirsiniz.",
    },
    {
        question: "4A, 4B ve 4C ne anlama gelir?",
        answer: "4A: SSK (sigortalı çalışanlar), 4B: Bağ-Kur (esnaf, serbest meslek), 4C: Emekli Sandığı (devlet memurları). Emeklilik koşulları statüye göre farklılık gösterir.",
    },
    {
        question: "Kademeli yaş artışı nedir?",
        answer: "5510 sayılı kanun ile 2036 yılından itibaren emeklilik yaşı kademeli olarak artırılarak 2044'te kadın ve erkek için 65 yaşına çıkarılacaktır.",
    },
    {
        question: "Borçlanma ile emeklilik tarihim değişir mi?",
        answer: "Askerlik, doğum gibi borçlanmalar prim gününüzü artırabilir. Bazı borçlanmalar ilk sigortalılık tarihinizi geriye çekebilir. Detaylı hesaplama için SGK'ya başvurmanız önerilir.",
    },
];

export default function EmeklilikHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="Emeklilik Hesaplama"
                calculatorDescription="EYT dahil emeklilik tarihi hesaplama aracı. Prim günü, sigortalılık süresi ve yaş şartlarına göre ne zaman emekli olacağınızı öğrenin."
                canonicalUrl="https://kolayhesap.co/genel/emeklilik-hesaplama"
                categoryName="Genel"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=genel"
                faqItems={faqItems}
                featureList={["EYT Kontrolü", "Prim Günü Takibi", "Yaş Hesaplama", "Projeksiyon"]}
                applicationCategory="UtilitiesApplication"
            />
            {children}
        </>
    );
}
