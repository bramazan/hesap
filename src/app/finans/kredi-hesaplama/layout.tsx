import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kredi Hesaplama - Aylık Taksit ve Faiz Hesaplama",
    description:
        "Online kredi hesaplama aracı. Aylık taksit tutarını, toplam ödemeyi ve faiz maliyetini anında hesaplayın.",
    keywords: ["kredi hesaplama", "kredi hesapla", "taksit hesaplama", "kredi faizi", "aylık taksit"],
};

export default function KrediHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
