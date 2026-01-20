import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gizlilik Politikası",
    description: "Kolay Hesap gizlilik politikası - Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgiler.",
};

export default function GizlilikPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Gizlilik Politikası
                        </h1>
                        <p className="text-gray-500">
                            Son güncelleme: 21 Ocak 2026
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">1. Giriş</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Kolay Hesap olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz.
                                    Bu Gizlilik Politikası, kolayhesap.co web sitesini kullandığınızda kişisel
                                    verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">2. Toplanan Veriler</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitemizi ziyaret ettiğinizde aşağıdaki verileri toplayabiliriz:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Tarayıcı türü ve versiyonu</li>
                                    <li>İşletim sistemi</li>
                                    <li>Yönlendiren URL (referrer)</li>
                                    <li>Ziyaret edilen sayfalar ve ziyaret süresi</li>
                                    <li>IP adresi (anonimleştirilmiş)</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">3. Çerezler</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
                                    Çerezler, tarayıcınız tarafından cihazınıza kaydedilen küçük metin dosyalarıdır.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Kullandığımız çerez türleri:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li><strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için gerekli</li>
                                    <li><strong>Analitik Çerezler:</strong> Ziyaretçi istatistiklerini toplamak için (Google Analytics)</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">4. Google Analytics</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitemiz, Google Inc. tarafından sağlanan bir web analiz hizmeti olan Google Analytics
                                    kullanmaktadır. Google Analytics, ziyaretçilerin siteyi nasıl kullandığını analiz etmemize
                                    yardımcı olan çerezler kullanır. Bu veriler anonim olarak işlenir ve kişisel kimlik
                                    tespitine yönelik kullanılmaz.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">5. Veri Güvenliği</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Verilerinizin güvenliğini sağlamak için uygun teknik ve organizasyonel önlemler
                                    alıyoruz. Web sitemiz SSL/TLS şifreleme ile korunmaktadır.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">6. Üçüncü Taraf Hizmetleri</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Web sitemiz, iletişim formu için Web3Forms hizmetini kullanmaktadır.
                                    Form aracılığıyla gönderdiğiniz bilgiler (ad, e-posta, mesaj), yalnızca
                                    sizinle iletişim kurmak amacıyla kullanılır ve üçüncü taraflarla paylaşılmaz.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">7. Haklarınız</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki haklara sahipsiniz:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                                    <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                                    <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                                    <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                                    <li>Verilerin silinmesini veya yok edilmesini isteme</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">8. İletişim</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                                </p>
                                <p className="text-gray-600">
                                    E-posta: <a href="mailto:destek@kolayhesap.co" className="text-blue-600 hover:underline">destek@kolayhesap.co</a>
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">9. Değişiklikler</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu
                                    sayfada yayınlanacak ve önemli değişiklikler için kullanıcılar bilgilendirilecektir.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
