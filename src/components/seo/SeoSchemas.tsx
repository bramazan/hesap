import JsonLd from './JsonLd';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

interface CalculatorSchemaProps {
    name: string;
    description: string;
    url: string;
    category?: string;
    featureList?: string[];
}

// WebSite Schema - Ana sayfa için site arama özelliği
export function WebSiteSchema() {
    const data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Kolay Hesap",
        "alternateName": "KolayHesap",
        "url": "https://kolayhesap.co",
        "description": "Türkiye'nin en hızlı ve güvenilir online hesaplama araçları",
        "inLanguage": "tr-TR",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://kolayhesap.co/tum-hesaplamalar?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };
    return <JsonLd data={data} />;
}

// Organization Schema - Marka bilgisi
export function OrganizationSchema() {
    const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Kolay Hesap",
        "url": "https://kolayhesap.co",
        "logo": "https://kolayhesap.co/icon.svg",
        "sameAs": [],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://kolayhesap.co/iletisim"
        }
    };
    return <JsonLd data={data} />;
}

// Breadcrumb Schema - Sayfa navigasyonu
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    const data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
    return <JsonLd data={data} />;
}

// FAQ Schema - Sıkça Sorulan Sorular
export function FAQSchema({ items }: { items: FAQItem[] }) {
    if (!items || items.length === 0) return null;

    const data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };
    return <JsonLd data={data} />;
}

// Calculator/Software Application Schema
export function CalculatorSchema({ name, description, url, category = "FinanceApplication", featureList = [] }: CalculatorSchemaProps) {
    const data = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": name,
        "description": description,
        "url": url,
        "applicationCategory": category,
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
        },
        "inLanguage": "tr-TR",
        ...(featureList.length > 0 && { "featureList": featureList.join(", ") })
    };
    return <JsonLd data={data} />;
}

// Kombine Schema - Hesaplayıcı sayfaları için tek seferde tüm schemaları ekler
interface CalculatorPageSchemaProps {
    calculatorName: string;
    calculatorDescription: string;
    canonicalUrl: string;
    categoryName: string;
    categoryUrl: string;
    faqItems?: FAQItem[];
    featureList?: string[];
    applicationCategory?: string;
}

export function CalculatorPageSchema({
    calculatorName,
    calculatorDescription,
    canonicalUrl,
    categoryName,
    categoryUrl,
    faqItems,
    featureList,
    applicationCategory = "FinanceApplication"
}: CalculatorPageSchemaProps) {
    const breadcrumbItems = [
        { name: "Ana Sayfa", url: "https://kolayhesap.co" },
        { name: categoryName, url: categoryUrl },
        { name: calculatorName, url: canonicalUrl }
    ];

    return (
        <>
            <BreadcrumbSchema items={breadcrumbItems} />
            <CalculatorSchema
                name={calculatorName}
                description={calculatorDescription}
                url={canonicalUrl}
                category={applicationCategory}
                featureList={featureList}
            />
            {faqItems && faqItems.length > 0 && <FAQSchema items={faqItems} />}
        </>
    );
}
