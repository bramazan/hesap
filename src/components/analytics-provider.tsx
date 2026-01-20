"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, trackPageView, hasAnalyticsConsent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize GA on mount if consent exists
    useEffect(() => {
        if (hasAnalyticsConsent()) {
            initGA();
        }

        // Listen for consent changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "cookie-consent" && e.newValue === "accepted") {
                initGA();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Track page views on route change
    useEffect(() => {
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
        trackPageView(url);
    }, [pathname, searchParams]);

    return <>{children}</>;
}
