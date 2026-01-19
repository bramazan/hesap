import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yaş Hesaplama - Doğum Tarihinden Yaş Hesapla",
    description:
        "Online yaş hesaplama aracı. Doğum tarihinizden yaşınızı yıl, ay ve gün olarak anında hesaplayın. Toplam gün sayısını öğrenin.",
    keywords: ["yaş hesaplama", "yaş hesapla", "kaç yaşındayım", "doğum tarihi hesaplama"],
};

export default function YasHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
