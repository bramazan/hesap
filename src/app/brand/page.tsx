import Link from "next/link";

export default function BrandPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-gray-100 font-sans p-10">
            <div className="max-w-5xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Logo Tasarım Önerileri</h1>
                    <p className="text-slate-500">
                        "Daha net ve premium" bir görünüm için 3 farklı yaklaşım.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Option 1: The Precision (Geometric) */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#111625] p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[200px]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#1152d4] text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 12h16m-8-8v16" />
                                        {/* A simple Plus/Cross represents 'Add/Positive/Center' */}
                                    </svg>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-baseline gap-[1px] text-lg leading-none">
                                        <span className="font-semibold text-slate-900 dark:text-white tracking-tight">kolay</span>
                                        <span className="font-light text-slate-500 dark:text-slate-400">hesap</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg">1. Minimal Geometrik</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                Açık, net ve İsviçre stili. Güven ve sadelik verir. İkon tam bir karedir (veya yuvarlatılmış).
                            </p>
                        </div>
                    </div>

                    {/* Option 2: The Tech (Abstract) */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#111625] p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[200px]">
                            <div className="flex items-center gap-3">
                                {/* Icon: stylized H or Calculator keys */}
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-6 bg-slate-800 dark:bg-white rounded-full"></div>
                                    <div className="w-1.5 h-6 bg-[#1152d4] rounded-full mt-2"></div>
                                </div>
                                <div className="flex items-baseline gap-[1px] text-xl tracking-tight">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">kolay</span>
                                    <span className="font-bold text-slate-900 dark:text-white">hesap</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg">2. Soyut Denge</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                Mevcut tasarımın daha "dik" ve net hali. İki çubuk, hesaplamanın girdisini ve çıktısını temsil eder.
                            </p>
                        </div>
                    </div>

                    {/* Option 3: Pure Typographic (Luxury) */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#111625] p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[200px]">
                            <div className="flex items-center gap-0.5">
                                <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tighter">kolayhesap</span>
                                <div className="w-2 h-2 bg-[#1152d4] rounded-full mb-1"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg">3. Salt Tipografi</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                İkon yok, sadece güçlü bir tipografi ve vurgu noktası. En "Premium" ve kurumsal duruş.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-100 dark:bg-slate-900 rounded-xl text-center">
                    <p className="mb-4 font-medium">Örnek Header Görünümü (Seçenek 1)</p>
                    <div className="bg-white dark:bg-[#111625] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between max-w-2xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#1152d4] text-white rounded-lg flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14m-7-7h14" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">kolayhesap</span>
                        </div>
                        <div className="flex gap-4 text-sm font-medium text-slate-500">
                            <span>Araçlar</span>
                            <span>Blog</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
