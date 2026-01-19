import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yüzde Hesaplama - Bir Sayının Yüzdesini Hesapla",
    description:
        "Online yüzde hesaplama aracı. Bir sayının yüzdesini, yüzde artış ve azalışı anında hesaplayın. Ücretsiz ve hızlı.",
    keywords: ["yüzde hesaplama", "yüzde hesapla", "yüzde bulma", "yüzdelik hesaplama"],
};

export default function YuzdeHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
