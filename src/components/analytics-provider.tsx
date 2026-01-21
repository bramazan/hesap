"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, trackPageView } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize GA on mount - always full tracking
    useEffect(() => {
        initGA();
    }, []);

    // Track page views on route change
    useEffect(() => {
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
        trackPageView(url);
    }, [pathname, searchParams]);

    return <>{children}</>;
}

