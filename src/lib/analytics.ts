// Google Analytics utility functions
// Only tracks if user has consented to cookies

export const GA_MEASUREMENT_ID = "G-DN2ELN7JQD";

// Check if user has consented to analytics
export const hasAnalyticsConsent = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("cookie-consent") === "accepted";
};

// Initialize Google Analytics (called after consent)
export const initGA = () => {
    if (!hasAnalyticsConsent()) return;

    // Load gtag script dynamically
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
    });
};

// Track page views (for SPA navigation)
export const trackPageView = (url: string, title?: string) => {
    if (!hasAnalyticsConsent() || typeof window.gtag === "undefined") return;

    window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: title || document.title,
    });
};

// Track custom events
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (!hasAnalyticsConsent() || typeof window.gtag === "undefined") return;

    window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

// Predefined event trackers
export const analytics = {
    // Track when a calculation is performed
    trackCalculation: (calculatorName: string, details?: string) => {
        trackEvent("calculate", "Calculator", `${calculatorName}${details ? ` - ${details}` : ""}`);
    },

    // Track form submissions
    trackFormSubmission: (formName: string, success: boolean) => {
        trackEvent(
            success ? "form_submit_success" : "form_submit_error",
            "Form",
            formName
        );
    },

    // Track outbound links
    trackOutboundLink: (url: string) => {
        trackEvent("click", "Outbound Link", url);
    },

    // Track CTA clicks
    trackCTAClick: (ctaName: string) => {
        trackEvent("click", "CTA", ctaName);
    },

    // Track search
    trackSearch: (query: string, resultsCount: number) => {
        trackEvent("search", "Site Search", query, resultsCount);
    },

    // Track errors
    trackError: (errorType: string, errorMessage: string) => {
        trackEvent("error", errorType, errorMessage);
    },
};

// TypeScript declarations
declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}
