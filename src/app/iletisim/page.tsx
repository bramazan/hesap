import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
    title: "Bize Ulaşın | Kolay Hesap",
    description:
        "Sorularınız, geri bildirimleriniz veya iş birliği önerileriniz için bizimle iletişime geçin.",
};

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none dark:from-blue-950/20" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-3xl pointer-events-none dark:bg-blue-900/10" />
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-100/30 blur-3xl pointer-events-none dark:bg-purple-900/10" />

            <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-32 relative z-10">
                <section className="text-center mb-24">
                    <h1 className="font-serif text-6xl md:text-7xl font-medium tracking-tight text-foreground mb-8">
                        Bize Ulaşın
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                        Sorularınız, geri bildirimleriniz veya iş birliği önerileriniz için
                        bizimle iletişime geçin. Ekibimiz size en kısa sürede dönüş
                        yapacaktır.
                    </p>
                </section>

                <ContactForm />
            </main>
        </div>
    );
}
