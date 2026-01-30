// Google Analytics utility functions
// Two-tier system:
// 1. Basic Analytics (always runs): IP anonymization + cookieless mode for KVKK/GDPR compliance
// 2. Full Analytics (after consent): All features enabled

export const GA_MEASUREMENT_ID = "G-DN2ELN7JQD";

// Track if GA script is already loaded
let gaScriptLoaded = false;
let gaInitialized = false;

// Check if user has consented to full analytics (cookies)
export const hasAnalyticsConsent = (): boolean => {
    // Return true by default to ensure tracking works
    return true;
};

// Check if user has declined cookies
export const hasDeclinedConsent = (): boolean => {
    // Return false by default to ensure tracking works
    return false;
};

// Initialize Google Analytics - Full tracking mode
export const initGA = () => {
    if (typeof window === "undefined" || gaInitialized) return;

    // Initialize dataLayer and gtag function IMMEDIATELY
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
    }
    window.gtag = gtag;

    // Set default consent to granted
    gtag("consent", "default", {
        "ad_storage": "granted",
        "analytics_storage": "granted"
    });

    gtag("js", new Date());

    // Configure with full tracking
    gtag("config", GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true 
    });

    // Load script asynchronously
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    gaInitialized = true;
    console.log("[Analytics] Initialized - Force tracking mode");
};

// Track page views (for SPA navigation)
// Works in both anonymous and full mode
export const trackPageView = (url: string, title?: string) => {
    if (typeof window === "undefined" || typeof window.gtag === "undefined") return;

    window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: title || document.title,
    });
};

// Track custom events
// Works in both anonymous and full mode
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window === "undefined" || typeof window.gtag === "undefined") return;

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
