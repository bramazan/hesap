"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SUBJECT_OPTIONS = [
    { value: "general", label: "Genel Sorular" },
    { value: "feedback", label: "Geri Bildirim" },
    { value: "support", label: "Teknik Destek" },
    { value: "business", label: "İş Birliği" },
];

export function ContactForm() {
    const [subject, setSubject] = useState("");

    return (
        <section className="max-w-xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
                <form action="#" className="space-y-8">
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
                            placeholder="ornek@hesapla.io"
                            type="email"
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
                            rows={6}
                        />
                    </div>

                    <Button
                        className="w-full h-14 text-[13px] font-bold uppercase tracking-[0.2em] rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                        type="submit"
                        size="lg"
                    >
                        Gönder
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
                <div className="flex gap-8">
                    <Link
                        className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        href="#"
                    >
                        Twitter
                    </Link>
                    <Link
                        className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        href="#"
                    >
                        Instagram
                    </Link>
                    <Link
                        className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        href="#"
                    >
                        LinkedIn
                    </Link>
                </div>
            </div>
        </section>
    );
}
