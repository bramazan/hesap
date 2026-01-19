import { Metadata } from "next";
import KdvCalculator from "@/components/calculators/KdvCalculator";

export const metadata: Metadata = {
    title: "KDV Hesaplama 2025 - KDV Dahil ve Hariç Hesapla",
    description: "Güncel 2025 KDV oranları ile KDV dahil ve hariç tutarları anında hesaplayın. Pratik KDV hesaplama aracı.",
    keywords: ["kdv hesaplama", "kdv dahil hesaplama", "kdv hariç hesaplama", "kdv", "katma değer vergisi"],
    alternates: {
        canonical: "https://kolayhesap.co/finans/kdv-hesaplama",
    },
};

export default function KdvHesaplamaPage() {
    return (
        <KdvCalculator />
    );
}
