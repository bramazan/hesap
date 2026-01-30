// Google Analytics utility functions
// Two-tier system:
// 1. Basic Analytics (always runs): IP anonymization + cookieless mode for KVKK/GDPR compliance
// 2. Full Analytics (after consent): All features enabled

export const GA_MEASUREMENT_ID = "G-DN2ELN7JQD";

// Track if GA script is already loaded
let gaScriptLoaded = false;
let gaInitialized = false;

// Consent checking removed - all users tracked unconditionally

// Initialize Google Analytics - Full tracking mode
export const initGA = () => {
    if (typeof window === "undefined" || gaInitialized) return;

    // Initialize dataLayer and gtag function IMMEDIATELY
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
    }
    window.gtag = gtag;

    // Set consent to granted for all users unconditionally
    gtag("consent", "update", {
        "ad_storage": "granted",
        "analytics_storage": "granted",
        "personalization_storage": "granted"
    });

    gtag("js", new Date());

    // Load script with callback to configure after loading
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.onload = () => {
        // Configure AFTER script loads
        window.gtag("config", GA_MEASUREMENT_ID, {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            allow_google_signals: true,
            allow_ad_personalization_signals: true
        });
        console.log("[Analytics] GA Script loaded and configured successfully");
    };
    script.onerror = () => {
        console.error("[Analytics] Failed to load GA script");
    };
    document.head.appendChild(script);

    gaInitialized = true;
    console.log("[Analytics] Initialization started - waiting for script load");
};

// Track page views (for SPA navigation) - unconditional tracking
export const trackPageView = (url: string, title?: string) => {
    if (typeof window === "undefined" || !window.gtag) return;

    window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: title || document.title,
    });
};

// Track custom events - unconditional tracking for all users
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window === "undefined" || !window.gtag) return;

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
