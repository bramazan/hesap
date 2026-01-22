"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50 text-slate-700 dark:text-slate-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <nav className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Menü</h3>
              <MobileLink href="/tum-hesaplamalar" active={pathname === "/tum-hesaplamalar"}>
                Hesaplamalar
              </MobileLink>
              <MobileLink href="/hakkimizda" active={pathname === "/hakkimizda"}>
                Hakkımızda
              </MobileLink>
              <MobileLink href="/iletisim" active={pathname === "/iletisim"}>
                İletişim
              </MobileLink>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                Kategoriler
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <CategoryLink href="/tum-hesaplamalar?category=finans" icon="💰" label="Finans" />
                <CategoryLink href="/tum-hesaplamalar?category=genel" icon="🧮" label="Genel" />
                <CategoryLink href="/tum-hesaplamalar?category=e-ticaret" icon="🛍️" label="E-Ticaret" />
              </div>
            </div>
          </nav>

          <div className="mt-auto">
            <p className="text-xs text-center text-slate-400">
              © 2026 Kolay Hesap
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block text-lg font-medium transition-colors ${
        active
          ? "text-blue-600 dark:text-blue-400"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function CategoryLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
    </Link>
  );
}
