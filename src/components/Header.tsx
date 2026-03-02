"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { siteProfile } from "@/data/site";

const navItems = [
  { href: "/products", label: "產品中心" },
  { href: "/resources", label: "下載中心" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="min-w-0" onClick={() => setMobileOpen(false)}>
            <BrandLogo compact href="" />
          </Link>

          <nav aria-label="主選單" className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition"
                      : "rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="切換選單"
          >
            選單
          </button>
        </div>
        <div className="hidden pb-2 text-xs text-slate-500 md:block">{siteProfile.tagline}</div>

        {mobileOpen ? (
          <nav
            id="mobile-menu"
            aria-label="手機主選單"
            className="grid gap-2 border-t border-slate-200 py-3 md:hidden"
          >
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    active
                      ? "rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"
                      : "rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
