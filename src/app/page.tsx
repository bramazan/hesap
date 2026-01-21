import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { CategoryCards } from "@/components/CategoryCards";
import { PopularCalculators } from "@/components/PopularCalculators";
import { CustomRequestSection } from "@/components/CTASection";
import { calculators, categories } from "@/lib/data";
import { WebSiteSchema, OrganizationSchema } from "@/components/seo/SeoSchemas";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* SEO Schemas */}
      <WebSiteSchema />
      <OrganizationSchema />
      {/* Hero Section - Compact with Categories */}
      <section className="relative bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-bl from-cyan-200/30 to-blue-200/20 rounded-full blur-3xl -translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-8">
          {/* Badge */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 text-blue-700 text-xs font-medium rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Türkiye&apos;nin En Kapsamlı Hesaplama Platformu
            </span>
          </div>

          {/* Headline - More Compact */}
          <h1 className="text-center text-3xl md:text-5xl font-light text-gray-800 tracking-tight mb-4">
            <span className="italic font-serif text-blue-600">Hassas</span> Hesaplama,{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dijital Kolaylık
            </span>
          </h1>

          {/* Subtitle - Shorter */}
          <p className="text-center text-gray-500 text-base max-w-lg mx-auto mb-8">
            Finansal hesaplamalardan günlük metriklere, hızlı ve ücretsiz.
          </p>

          {/* Search Box */}
          <div className="mb-12">
            <SearchBox calculators={calculators} />
          </div>

          {/* Categories - Now Inside Hero */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Kategoriler</h2>
              {/* Removed "Tümü" link as requested */}
            </div>
            <CategoryCards categories={categories} />
          </div>
        </div>
      </section>

      {/* Popular Calculators Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <PopularCalculators calculators={calculators} />
      </section>

      {/* CustomRequestSection */}
      <section className="max-w-5xl mx-auto px-4">
        <CustomRequestSection />
      </section>
    </div>
  );
}
