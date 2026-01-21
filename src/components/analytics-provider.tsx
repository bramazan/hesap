"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, initGAAnonymous, trackPageView, hasAnalyticsConsent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize GA on mount
    // Always starts in anonymous mode (KVKK compliant)
    // Upgrades to full mode if consent exists
    useEffect(() => {
        const initAnalytics = async () => {
            if (hasAnalyticsConsent()) {
                // User has already consented - use full tracking
                await initGA();
            } else {
                // No consent yet or declined - use anonymous tracking
                await initGAAnonymous();
            }
        };

        initAnalytics();

        // Listen for consent changes (from CookieConsent component)
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
