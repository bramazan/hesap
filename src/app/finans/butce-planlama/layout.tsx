import { Metadata } from "next";

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
};

export default function ButcePlanlamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
