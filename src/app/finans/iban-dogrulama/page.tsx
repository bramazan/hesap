"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumSelect } from "@/components/ui/premium-select";

// IBAN Validation Logic
const validateIBAN = (iban: string) => {
    // 1. Normalize: Remove spaces, dashes, make uppercase
    const normalized = iban.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    if (!normalized) {
        return { isValid: false, message: "Lütfen bir IBAN giriniz.", normalized: "" };
    }

    // 2. Country Code Check (MVP: TR only support mostly)
    const countryCode = normalized.slice(0, 2);
    if (!/^[A-Z]{2}$/.test(countryCode)) {
        return { isValid: false, message: "Geçersiz ülke kodu.", normalized };
    }

    if (countryCode === "TR") {
        // 3. Length Check for TR
        if (normalized.length !== 26) {
            return {
                isValid: false,
                message: `TR IBAN 26 karakter olmalıdır. (Girilen: ${normalized.length})`,
                normalized
            };
        }

        // 4. Character Check (Digits only after TR)
        const content = normalized.slice(2);
        if (!/^\d+$/.test(content)) {
            return {
                isValid: false,
                message: "TR IBAN ülke kodundan sonra sadece rakam içermelidir.",
                normalized
            };
        }
    }

    // 5. Mod 97 Checksum
    try {
        const rearranged = normalized.slice(4) + normalized.slice(0, 4);
        const numberString = rearranged.replace(/[A-Z]/g, (char) => (char.charCodeAt(0) - 55).toString());

        // Use BigInt for large number modulo
        const remainder = BigInt(numberString) % BigInt(97);

        if (remainder === BigInt(1)) {
            return { isValid: true, message: "IBAN Geçerli", normalized };
        } else {
            return { isValid: false, message: "Kontrol basamağı hatalı (Checksum hatası).", normalized };
        }
    } catch (e) {
        return { isValid: false, message: "Hesaplama hatası.", normalized };
    }
};

const formatIBAN = (iban: string) => {
    // Insert space every 4 characters
    return iban.replace(/(.{4})/g, "$1 ").trim();
};

export default function IbanDogrulama() {
    const [ibanInput, setIbanInput] = useState("");
    const [result, setResult] = useState<{ isValid: boolean; message: string; normalized: string } | null>(null);
    const [country, setCountry] = useState("TR");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (!ibanInput && !isDirty) {
            setResult(null);
            return;
        }

        const validation = validateIBAN(ibanInput);

        // Only show error if user has started typing or it's not empty
        if (!ibanInput) {
            setResult(null);
        } else {
            setResult(validation);
        }
    }, [ibanInput, country, isDirty]);

    const handleCopy = () => {
        if (result?.normalized) {
            navigator.clipboard.writeText(result.normalized);
            // Could show a toast here
        }
    };

    const faqItems = [
        {
            question: "IBAN validasyonu neyi garanti eder?",
            answer: "IBAN doğrulama, girilen kodun uluslararası standartlara (ISO 13616) uygun formatta olduğunu ve kontrol basamaklarının tutarlı olduğunu doğrular. Hesabın gerçekten var olduğunu veya kime ait olduğunu garanti etmez."
        },
        {
            question: "TR IBAN kaç haneli olmalıdır?",
            answer: "Türkiye (TR) IBAN numaraları her zaman 26 karakterden oluşur. İlk 2 karakter ülke kodu (TR), sonraki 2 karakter kontrol basamağı ve kalan 22 karakter banka hesap numarasını içerir."
        },
        {
            question: "Neden 'kontrol basamağı hatalı' uyarısı alıyorum?",
            answer: "Genellikle bir rakamın yanlış yazılması veya harf/rakam karışıklığı (0 ile O, 1 ile I gibi) nedeniyle matematiksel kontrol sağlanamaz."
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 pt-10 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Page Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href="/" className="hover:text-blue-600 transition-colors">
                                    Ana Sayfa
                                </Link>
                                <span>/</span>
                                <Link href="/tum-hesaplamalar?category=finans" className="hover:text-blue-600 transition-colors">
                                    Finans
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800">IBAN Doğrulama</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                IBAN Doğrulama
                            </h1>
                            <p className="text-gray-500 text-lg">
                                IBAN numarasının geçerliliğini ve formatını anında kontrol edin.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
                            <div className="space-y-4">
                                <PremiumSelect
                                    label="Ülke"
                                    value={country}
                                    onChange={setCountry}
                                    options={[
                                        { value: "TR", label: "🇹🇷 Türkiye (TR)" },
                                        // Future expansion
                                    ]}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        IBAN Numarası
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={ibanInput}
                                        onChange={(e) => {
                                            setIbanInput(e.target.value);
                                            setIsDirty(true);
                                        }}
                                        placeholder="TR12 3456 ..."
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-mono text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-400">
                                    Boşluk veya tire kullanabilirsiniz. Otomatik olarak temizlenecektir.
                                </p>
                            </div>
                        </div>

                        {/* Detailed Info Card (Visible when valid) */}
                        {result?.isValid && (
                            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-green-800">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Validasyon Başarılı
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white p-3 rounded-lg border border-green-100">
                                        <span className="text-gray-500 block text-xs uppercase">Banka Kodu</span>
                                        <span className="font-mono font-bold text-gray-900">{result.normalized.slice(4, 9)}</span>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-green-100">
                                        <span className="text-gray-500 block text-xs uppercase">Rezerv Alan</span>
                                        <span className="font-mono font-bold text-gray-900">{result.normalized.slice(9, 10)}</span>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-green-100 md:col-span-2">
                                        <span className="text-gray-500 block text-xs uppercase">Hesap Numarası</span>
                                        <span className="font-mono font-bold text-gray-900">{result.normalized.slice(10)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* How It Works Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Doğrulanır?</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    IBAN (Uluslararası Banka Hesap Numarası) doğrulaması aşağıdaki adımlardan oluşur:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">1. Format Kontrolü</p>
                                        <div className="text-sm">
                                            TR IBAN tam olarak 26 karakter olmalıdır. İlk 2 karakter ülke kodu (TR), sonraki karakterler sadece rakam içermelidir.
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-800 mb-2">2. Checksum Kontrolü</p>
                                        <div className="text-sm">
                                            IBAN numarasındaki kontrol basamakları (3. ve 4. karakterler) matematiksel olarak doğrulanır (Mod 97 algoritması).
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <p className="font-semibold text-blue-800 mb-2">TR IBAN Yapısı</p>
                                    <div className="font-mono text-sm bg-white p-3 rounded">
                                        <span className="text-blue-600">TR</span>
                                        <span className="text-purple-600">00</span>
                                        <span className="text-green-600">00000</span>
                                        <span className="text-orange-600">0</span>
                                        <span className="text-gray-600">0000000000000000</span>
                                    </div>
                                    <div className="text-xs mt-2 space-y-1">
                                        <p><span className="text-blue-600 font-semibold">TR:</span> Ülke Kodu</p>
                                        <p><span className="text-purple-600 font-semibold">00:</span> Kontrol Basamağı</p>
                                        <p><span className="text-green-600 font-semibold">00000:</span> Banka Kodu (5 hane)</p>
                                        <p><span className="text-orange-600 font-semibold">0:</span> Rezerv Alan</p>
                                        <p><span className="text-gray-600 font-semibold">16 hane:</span> Hesap Numarası</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <details
                                        key={index}
                                        className="group bg-gray-50 rounded-xl overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between p-4 cursor-pointer text-gray-900 font-medium hover:bg-gray-100 transition-colors">
                                            {item.question}
                                            <svg
                                                className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                                            {item.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:mt-[72px]">
                        {/* Result Card */}
                        <div className={`rounded-3xl p-8 shadow-xl border transition-all duration-500 flex flex-col gap-6 ${!result
                            ? "bg-white shadow-gray-200/50 border-gray-100"
                            : result.isValid
                                ? "bg-white shadow-green-200/50 border-green-100 ring-2 ring-green-500/20"
                                : "bg-white shadow-red-200/50 border-red-100 ring-2 ring-red-500/20"
                            }`}>
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Sonuç</h2>
                                <span className="text-xs text-gray-400">Anlık Kontrol</span>
                            </div>

                            {/* Main Result */}
                            <div className="text-center space-y-4 py-2">
                                {!result ? (
                                    <div className="text-gray-400 py-4">
                                        <div className="text-4xl mb-2">🔍</div>
                                        <p>Kontrol etmek için bir IBAN girin</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${result.isValid ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                            }`}>
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {result.isValid
                                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                }
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-bold ${result.isValid ? "text-green-600" : "text-red-600"}`}>
                                                {result.isValid ? "IBAN Geçerli" : "IBAN Geçersiz"}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">{result.message}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Normalized IBAN Display */}
                            {result?.normalized && (
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2 group relative">
                                    <span className="text-xs text-gray-400 uppercase font-semibold">Normalize Edilmiş IBAN</span>
                                    <div className="font-mono text-sm sm:text-base md:text-lg font-bold text-gray-800">
                                        {formatIBAN(result.normalized)}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all opacity-0 group-hover:opacity-100"
                                        title="Kopyala"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Info */}
                            <div className="text-xs text-gray-400 text-center leading-relaxed">
                                Bu işlem tamamen tarayıcınızda gerçekleşir.
                                <br />Girdiğiniz IBAN sunucularımıza kaydedilmez.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
