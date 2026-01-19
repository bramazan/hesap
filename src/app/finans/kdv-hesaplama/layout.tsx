import { Metadata } from "next";

export const metadata: Metadata = {
    title: "KDV Hesaplama - KDV Dahil/Hariç Fiyat Hesapla",
    description:
        "Online KDV hesaplama aracı. KDV dahil ve hariç fiyatı, KDV tutarını anında hesaplayın. %20, %10, %1 oranları desteklenir.",
    keywords: ["kdv hesaplama", "kdv hesapla", "kdv dahil", "kdv hariç", "kdv tutarı"],
};

export default function KdvHesaplamaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
