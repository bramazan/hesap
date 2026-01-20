import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kullanım Şartları",
    description: "Kolay Hesap kullanım şartları ve koşulları - Web sitesini kullanırken uymanız gereken kurallar.",
};

export default function KullanimSartlariPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Kullanım Şartları
                        </h1>
                        <p className="text-gray-500">
                            Son güncelleme: 21 Ocak 2026
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">1. Kabul</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    kolayhesap.co web sitesini kullanarak, bu Kullanım Şartlarını kabul etmiş sayılırsınız.
                                    Bu şartları kabul etmiyorsanız, web sitesini kullanmayınız.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">2. Hizmet Tanımı</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Kolay Hesap, kullanıcılara çeşitli hesaplama araçları sunan ücretsiz bir web sitesidir.
                                    Sunulan hesaplayıcılar arasında KDV hesaplama, maaş hesaplama, kredi hesaplama,
                                    yüzde hesaplama ve benzeri araçlar bulunmaktadır.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">3. Sorumluluk Reddi</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitemizdeki hesaplama araçları yalnızca bilgilendirme amaçlıdır. Sonuçların
                                    doğruluğunu garanti etmiyoruz. Hesaplama sonuçları:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Profesyonel mali, hukuki veya vergi danışmanlığı yerine geçmez</li>
                                    <li>Resmi veya bağlayıcı bir belge olarak kullanılamaz</li>
                                    <li>Güncel mevzuat değişikliklerini anında yansıtmayabilir</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed">
                                    Önemli finansal kararlar için mutlaka uzman bir danışmana başvurmanızı öneririz.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">4. Fikri Mülkiyet</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitesindeki tüm içerik, tasarım, logo, metin, grafik ve yazılım Kolay Hesap'a
                                    aittir veya lisans altında kullanılmaktadır. İzinsiz kopyalama, dağıtma veya
                                    değiştirme yasaktır.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">5. Kullanıcı Yükümlülükleri</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitesini kullanırken:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Yasalara ve bu şartlara uygun davranmalısınız</li>
                                    <li>Siteyi kötü amaçlı kullanmamalısınız</li>
                                    <li>Diğer kullanıcıların deneyimini olumsuz etkileyecek davranışlardan kaçınmalısınız</li>
                                    <li>Otomatik sistemler veya botlar kullanarak siteye aşırı yük bindirmemelisiniz</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">6. Üçüncü Taraf Bağlantıları</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitemiz üçüncü taraf web sitelerine bağlantılar içerebilir. Bu siteler üzerinde
                                    kontrolümüz yoktur ve içeriklerinden sorumlu değiliz. Bu siteleri kendi sorumluluğunuzda
                                    ziyaret etmeniz gerekir.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">7. Hizmet Değişiklikleri</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Kolay Hesap, herhangi bir zamanda ve önceden haber vermeksizin:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Hizmetlerde değişiklik yapabilir</li>
                                    <li>Yeni özellikler ekleyebilir veya mevcut özellikleri kaldırabilir</li>
                                    <li>Web sitesini geçici veya kalıcı olarak askıya alabilir</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">8. Sınırlı Sorumluluk</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Kolay Hesap, web sitesinin kullanımından kaynaklanan doğrudan, dolaylı, arızi,
                                    özel veya sonuç olarak ortaya çıkan zararlardan sorumlu tutulamaz. Bu, hesaplama
                                    hatalarından, veri kaybından veya hizmet kesintilerinden kaynaklanan zararları içerir.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">9. Uygulanacak Hukuk</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Bu Kullanım Şartları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir
                                    anlaşmazlık durumunda İstanbul Mahkemeleri yetkilidir.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">10. Değişiklikler</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Bu Kullanım Şartlarını zaman zaman güncelleyebiliriz. Güncel sürüm her zaman
                                    bu sayfada yayınlanacaktır. Web sitesini kullanmaya devam ederek, güncellenmiş
                                    şartları kabul etmiş sayılırsınız.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">11. İletişim</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Bu Kullanım Şartları hakkında sorularınız için:
                                </p>
                                <p className="text-gray-600">
                                    E-posta: <a href="mailto:destek@kolayhesap.co" className="text-blue-600 hover:underline">destek@kolayhesap.co</a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
