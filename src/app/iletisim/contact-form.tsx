"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { initGA, analytics } from "@/lib/analytics";

const SUBJECT_OPTIONS = [
    { value: "general", label: "Genel Sorular" },
    { value: "feedback", label: "Geri Bildirim" },
    { value: "support", label: "Teknik Destek" },
    { value: "business", label: "İş Birliği" },
];

const WEB3FORMS_ACCESS_KEY = "98612770-6de2-47a1-a9a8-dac69e39def7";

export function ContactForm() {
    const [subject, setSubject] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        const subjectLabel = SUBJECT_OPTIONS.find(opt => opt.value === subject)?.label || subject;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name,
                    email,
                    subject: subjectLabel,
                    message,
                    from_name: "Kolay Hesap İletişim Formu",
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus("success");
                setName("");
                setEmail("");
                setSubject("");
                setMessage("");
                // Track successful form submission
                analytics.trackFormSubmission("contact_form", true);
            } else {
                setSubmitStatus("error");
                analytics.trackFormSubmission("contact_form", false);
            }
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === "success") {
        return (
            <section className="max-w-xl mx-auto">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Mesajınız Gönderildi!</h3>
                    <p className="text-muted-foreground mb-6">En kısa sürede size dönüş yapacağız.</p>
                    <Button
                        onClick={() => setSubmitStatus("idle")}
                        variant="outline"
                        className="rounded-full"
                    >
                        Yeni Mesaj Gönder
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
                {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                        Mesaj gönderilemedi. Lütfen tekrar deneyin.
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label
                            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1"
                            htmlFor="name"
                        >
                            Ad Soyad
                        </label>
                        <Input
                            id="name"
                            placeholder="İsminizi giriniz"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="h-14 bg-background border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1"
                            htmlFor="email"
                        >
                            E-posta Adresi
                        </label>
                        <Input
                            id="email"
                            placeholder="ornek@kolayhesap.co"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="h-14 bg-background border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        {/* Using PremiumSelect which handles its own label logic theoretically, but here we strictly follow layout */}
                        <PremiumSelect
                            value={subject}
                            onChange={setSubject}
                            options={SUBJECT_OPTIONS}
                            placeholder="Bir konu seçin"
                            label="Konu"
                            className="h-14 bg-background border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1"
                            htmlFor="message"
                        >
                            Mesajınız
                        </label>
                        <textarea
                            className={cn(
                                "flex min-h-[160px] w-full rounded-xl border border-border/50 bg-background px-5 py-4 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none transition-all duration-300"
                            )}
                            id="message"
                            placeholder="Mesajınızı detaylıca yazabilirsiniz..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            disabled={isSubmitting}
                            rows={6}
                        />
                    </div>

                    <Button
                        className="w-full h-14 text-[13px] font-bold uppercase tracking-[0.2em] rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Gönderiliyor...
                            </span>
                        ) : (
                            "Gönder"
                        )}
                    </Button>
                </form>
            </div>

            <div className="mt-20 pt-12 border-t border-border/50 flex flex-col items-center gap-6">
                <Link
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    href="mailto:destek@kolayhesap.co"
                >
                    destek@kolayhesap.co
                </Link>
            </div>
        </section>
    );
}
