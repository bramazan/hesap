import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Zap, DraftingCompass } from "lucide-react";

export const metadata: Metadata = {
    title: "Hakkımızda | Kolay Hesap",
    description:
        "Türkiye'deki herkes için hızlı, güvenilir ve modern hesaplama araçları sunan bir dijital ekosistem.",
};

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none dark:from-blue-950/20" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-3xl pointer-events-none dark:bg-blue-900/10" />
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-100/30 blur-3xl pointer-events-none dark:bg-purple-900/10" />

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-32 px-6">
                    <div className="max-w-[1200px] mx-auto relative text-center">
                        {/* Floating Element Decoration */}
                        <div className="absolute -right-20 -top-20 opacity-20 pointer-events-none hidden lg:block animate-pulse">
                            <div className="w-64 h-64 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur-3xl opacity-30" />
                        </div>

                        <div className="relative z-10">
                            <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tight text-foreground mb-10">
                                Hakkımızda
                            </h1>
                            <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
                                Türkiye'deki herkes için hızlı, güvenilir ve modern hesaplama
                                araçları sunan bir dijital ekosistem inşa ediyoruz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="max-w-[1200px] mx-auto px-6 py-32 border-t border-border/40">
                    <div className="grid md:grid-cols-2 gap-24 items-start">
                        <div>
                            <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-bold mb-6 block">
                                Vizyonumuz
                            </span>
                            <h2 className="font-serif text-4xl mb-8 leading-tight text-foreground">
                                Dijital dünyada kesinliğin adresi.
                            </h2>
                            <p className="text-muted-foreground leading-relaxed text-lg font-light mb-6">
                                Kolay Hesap, karmaşık formülleri ve zaman alan hesaplamaları
                                saniyeler içinde çözen, kullanıcı odaklı bir platformdur.
                                Amacımız, finansal kararlardan teknik hesaplamalara kadar her
                                alanda yanınızda olan en güvenilir asistanınız olmaktır.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg font-light">
                                Modern tasarım anlayışımızı, en güncel teknolojilerle
                                birleştirerek web deneyimini lüks ve sade bir hale getiriyoruz.
                            </p>
                        </div>
                        <div className="space-y-16">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                    Hassasiyet
                                </h3>
                                <p className="text-muted-foreground leading-relaxed font-light">
                                    Her bir araç, %100 doğruluk payı gözetilerek uzmanlar
                                    tarafından geliştirilir ve düzenli olarak güncellenir.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                    Hız
                                </h3>
                                <p className="text-muted-foreground leading-relaxed font-light">
                                    Vakit en değerli hazinedir. Altyapımızı milisaniyeler içinde
                                    sonuç verecek şekilde optimize ettik.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                    Kullanıcı Odaklılık
                                </h3>
                                <p className="text-muted-foreground leading-relaxed font-light">
                                    Karmaşadan uzak, sadece ihtiyacınız olanı sunan minimalist bir
                                    arayüz tasarladık.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Us Section */}
                <section className="bg-card/30 backdrop-blur-sm py-32 border-y border-border/40">
                    <div className="max-w-[1200px] mx-auto px-6 text-center">
                        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-12 block">
                            Neden Biz?
                        </span>
                        <div className="grid md:grid-cols-3 gap-16">
                            <div className="flex flex-col items-center group">
                                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all duration-500 hover:scale-110">
                                    <ShieldCheck className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-3 text-foreground">
                                    Güvenlik
                                </h4>
                                <p className="text-xs text-muted-foreground leading-loose max-w-[200px] uppercase tracking-tighter">
                                    Verileriniz asla kaydedilmez, her işlem anonim kalır.
                                </p>
                            </div>
                            <div className="flex flex-col items-center group">
                                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all duration-500 hover:scale-110">
                                    <Zap className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-3 text-foreground">
                                    Sadelik
                                </h4>
                                <p className="text-xs text-muted-foreground leading-loose max-w-[200px] uppercase tracking-tighter">
                                    Reklam kirliliğinden uzak, saf fonksiyonellik.
                                </p>
                            </div>
                            <div className="flex flex-col items-center group">
                                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all duration-500 hover:scale-110">
                                    <DraftingCompass className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-3 text-foreground">
                                    Hassasiyet
                                </h4>
                                <p className="text-xs text-muted-foreground leading-loose max-w-[200px] uppercase tracking-tighter">
                                    Mühendislik disipliniyle hazırlanmış algoritmalar.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-[1200px] mx-auto px-6 py-32 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground">
                        Bir sorunuz mu var?
                    </h2>
                    <Link
                        href="/iletisim"
                        className="inline-block border-b border-foreground/30 pb-2 text-sm font-semibold tracking-widest uppercase hover:text-primary hover:border-primary transition-all duration-300"
                    >
                        Bizimle İletişime Geçin
                    </Link>
                </section>
            </main>
        </div>
    );
}
