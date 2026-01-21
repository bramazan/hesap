import { Metadata } from "next";
import { CalculatorPageSchema } from "@/components/seo/SeoSchemas";

export const metadata: Metadata = {
    title: "IBAN Doğrulama - IBAN Geçerlilik Kontrolü",
    description:
        "Online IBAN doğrulama aracı. TR IBAN numaranızın geçerli olup olmadığını anında kontrol edin. Mod 97 algoritması ile doğrulama.",
    keywords: ["iban doğrulama", "iban kontrol", "iban geçerlilik", "tr iban", "banka hesap numarası"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/iban-dogrulama",
    },
};

const faqItems = [
    {
        question: "IBAN validasyonu neyi garanti eder?",
        answer: "IBAN doğrulama, girilen kodun uluslararası standartlara (ISO 13616) uygun formatta olduğunu ve kontrol basamaklarının tutarlı olduğunu doğrular. Hesabın gerçekten var olduğunu veya kime ait olduğunu garanti etmez.",
    },
    {
        question: "TR IBAN kaç haneli olmalıdır?",
        answer: "Türkiye (TR) IBAN numaraları her zaman 26 karakterden oluşur. İlk 2 karakter ülke kodu (TR), sonraki 2 karakter kontrol basamağı ve kalan 22 karakter banka hesap numarasını içerir.",
    },
    {
        question: "Neden 'kontrol basamağı hatalı' uyarısı alıyorum?",
        answer: "Genellikle bir rakamın yanlış yazılması veya harf/rakam karışıklığı (0 ile O, 1 ile I gibi) nedeniyle matematiksel kontrol sağlanamaz.",
    },
];

export default function IbanDogrulamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CalculatorPageSchema
                calculatorName="IBAN Doğrulama"
                calculatorDescription="Online IBAN doğrulama aracı. TR IBAN numaranızın geçerli olup olmadığını anında kontrol edin."
                canonicalUrl="https://kolayhesap.co/finans/iban-dogrulama"
                categoryName="Finans"
                categoryUrl="https://kolayhesap.co/tum-hesaplamalar?category=finans"
                faqItems={faqItems}
                featureList={["IBAN Doğrulama", "Format Kontrolü", "Mod 97 Algoritması", "Banka Kodu Gösterimi"]}
            />
            {children}
        </>
    );
}
