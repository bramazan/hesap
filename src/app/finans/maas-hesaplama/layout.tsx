import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Maaş Hesaplama - Net Brüt Maaş Dönüştürücü",
    description:
        "Online maaş hesaplama aracı. Brütten nete, netten brüte maaş dönüşümü yapın. SGK, vergi kesintileri ve işveren maliyetini görün.",
    keywords: ["maaş hesaplama", "net maaş hesapla", "brüt maaş hesapla", "sgk kesintisi", "gelir vergisi"],
};

export default function MaasHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
