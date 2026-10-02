"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { siteProfile } from "@/data/site";

// 依設計稿：主選單 5 項，「詢價合作」改成右側的「立即諮詢」按鈕
const navItems = [
  { href: "/products", label: "產品中心" },
  { href: "/applications", label: "應用場域" },
  { href: "/resources", label: "文件下載" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

const mobileNavItems = [...navItems.slice(0, 3), { href: "/inquiry", label: "詢價合作" }, ...navItems.slice(3)];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1110px] items-center justify-between gap-4 px-4 md:h-[110px] md:px-5">
          <Link href="/" className="min-w-0" onClick={() => setMobileOpen(false)}>
            <BrandLogo href="" variant="masthead" />
          </Link>

          <nav aria-label="主選單" className="hidden items-center gap-5 md:flex lg:gap-7">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b-2 py-2 text-sm font-bold tracking-[0.1em] text-brand-navy ${
                    active ? "border-brand-navy" : "border-transparent hover:border-brand-navy/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/inquiry"
              className="ml-2 inline-flex h-[38px] items-center rounded-[3px] border border-brand-navy px-5 text-sm font-bold tracking-[0.1em] text-brand-navy hover:bg-brand-navy hover:text-white lg:px-[22px]"
            >
              立即諮詢
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-[3px] border border-brand-navy px-3 py-2 text-sm font-bold text-brand-navy md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="切換選單"
          >
            選單
          </button>
        </div>

        {mobileOpen ? (
          <nav id="mobile-menu" aria-label="手機主選單" className="grid gap-1 border-t border-slate-200 px-4 py-3 md:hidden">
            {mobileNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-[3px] px-3 py-2 text-sm font-bold tracking-[0.08em] ${
                    active ? "bg-brand-navy text-white" : "text-brand-navy hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </header>

      <div className="bg-brand-blue px-4 py-[5px] text-center text-xs font-bold tracking-[0.08em] text-white">
        {siteProfile.tagline}
      </div>
    </>
  );
}
