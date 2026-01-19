import Link from "next/link";

export function CustomRequestSection() {
    return (
        <section className="py-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 md:p-16">
                {/* Background decorations */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-500/10 to-blue-500/5 rounded-full blur-3xl" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

                <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl mb-6 shadow-lg shadow-blue-500/30">
                        ⚡
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                        Özel Hesaplama mı İstiyorsunuz?
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
                        Kurumsal ihtiyaçlarınıza yönelik özel algoritmalar ve
                        interaktif hesaplama araçları geliştirebiliriz.
                    </p>

                    {/* Features list */}
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {['API Entegrasyonu', 'White-label Çözümler', 'Özel Algoritmalar'].map((feature) => (
                            <div key={feature} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-white/80 text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Bize Ulaşın
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center px-8 py-4 text-white font-medium rounded-xl border border-white/20 hover:bg-white/10 transition-all"
                        >
                            Daha Fazla Bilgi
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
