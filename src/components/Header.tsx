"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { publishedProducts } from "@/data/products";
import { siteProfile } from "@/data/site";
import { getTaxonomyTree } from "@/data/taxonomy";

const navItems = [
  { href: "/resources", label: "技術文件下載" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTaxonomyOpen, setMobileTaxonomyOpen] = useState(false);
  const [activeMobileGroupKey, setActiveMobileGroupKey] = useState<string>("all");
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const [openSubcategoryKeys, setOpenSubcategoryKeys] = useState<Record<string, boolean>>({});
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const taxonomyTree = useMemo(() => getTaxonomyTree(publishedProducts), []);
  const productsActive = pathname === "/products" || pathname.startsWith("/products/");
  const displayedMobileGroups =
    activeMobileGroupKey === "all"
      ? taxonomyTree
      : taxonomyTree.filter((groupNode) => groupNode.group.key === activeMobileGroupKey);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDesktopProductsMenu = () => {
    clearCloseTimer();
    setDesktopProductsOpen(true);
  };

  const closeDesktopProductsMenuWithDelay = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setDesktopProductsOpen(false);
    }, 160);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="min-w-0" onClick={() => setMobileOpen(false)}>
            <BrandLogo compact href="" />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <div
              className="relative"
              onMouseEnter={openDesktopProductsMenu}
              onMouseLeave={closeDesktopProductsMenuWithDelay}
            >
              <button
                type="button"
                onClick={() => {
                  clearCloseTimer();
                  setDesktopProductsOpen((open) => !open);
                }}
                className={
                  productsActive || desktopProductsOpen
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
                    : "rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                }
                aria-expanded={desktopProductsOpen}
                aria-haspopup="true"
              >
                產品介紹 {desktopProductsOpen ? "▲" : "▼"}
              </button>

              {desktopProductsOpen ? (
                <div className="absolute right-0 top-full z-50 w-[min(980px,calc(100vw-2rem))] pt-2">
                  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">產品介紹</p>
                      <Link href="/products" className="text-xs text-sky-300 hover:text-sky-200">
                        查看全部產品 →
                      </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {taxonomyTree.map((groupNode) => (
                        <section key={groupNode.group.key} className="space-y-4">
                          <h3 className="border-b border-slate-700 pb-2 text-base font-semibold text-sky-300">
                            {groupNode.group.name}
                          </h3>

                          <div className="space-y-4">
                            {groupNode.categories.map((categoryNode) => (
                              <div key={categoryNode.category.id}>
                                <p className="mb-2 text-sm font-semibold text-white">{categoryNode.category.name}</p>
                                <div className="space-y-2">
                                  {categoryNode.subcategories.map((subcategoryNode) => (
                                    <div key={subcategoryNode.subcategory.key} className="space-y-1">
                                      <Link
                                        href="/products"
                                        className="text-sm text-slate-100 hover:text-sky-300"
                                        onClick={() => setDesktopProductsOpen(false)}
                                      >
                                        {subcategoryNode.subcategory.name}
                                      </Link>
                                      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                        {subcategoryNode.products.slice(0, 3).map((product) => (
                                          <Link
                                            key={product.slug}
                                            href={`/products/${product.slug}`}
                                            onClick={() => setDesktopProductsOpen(false)}
                                            className="rounded border border-slate-700 px-2 py-0.5 hover:border-slate-500 hover:text-slate-200"
                                          >
                                            {product.model}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <nav aria-label="主選單" className="flex items-center gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
                        : "rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

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
          <div id="mobile-menu" className="space-y-2 border-t border-slate-200 py-3 md:hidden">
            <nav aria-label="手機主選單" className="grid gap-2">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className={
                  productsActive
                    ? "rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"
                    : "rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                }
              >
                產品中心
              </Link>

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

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-800"
                onClick={() => setMobileTaxonomyOpen((open) => !open)}
                aria-expanded={mobileTaxonomyOpen}
              >
                產品分類
                <span>{mobileTaxonomyOpen ? "▲" : "▼"}</span>
              </button>

              {mobileTaxonomyOpen ? (
                <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-3">
                  <div className="overflow-x-auto pb-1">
                    <div className="flex min-w-max gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveMobileGroupKey("all")}
                        className={
                          activeMobileGroupKey === "all"
                            ? "rounded-full bg-slate-900 px-3 py-1.5 text-xs text-white"
                            : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
                        }
                      >
                        全部
                      </button>
                      {taxonomyTree.map((groupNode) => (
                        <button
                          key={groupNode.group.key}
                          type="button"
                          onClick={() => setActiveMobileGroupKey(groupNode.group.key)}
                          className={
                            activeMobileGroupKey === groupNode.group.key
                              ? "rounded-full bg-slate-900 px-3 py-1.5 text-xs text-white"
                              : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
                          }
                        >
                          {groupNode.group.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
                    {displayedMobileGroups.map((groupNode) => (
                    <div key={groupNode.group.key} className="space-y-2">
                      <div className="text-sm font-semibold text-slate-900">{groupNode.group.name}</div>
                      {groupNode.categories.map((categoryNode) => (
                        <div key={categoryNode.category.id} className="space-y-2">
                          <div className="text-xs font-medium text-slate-700">{categoryNode.category.name}</div>
                          {categoryNode.subcategories.map((subcategoryNode) => {
                            const open = Boolean(openSubcategoryKeys[subcategoryNode.subcategory.key]);
                            return (
                              <div key={subcategoryNode.subcategory.key} className="rounded-lg border border-slate-200 bg-white">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenSubcategoryKeys((current) => ({
                                      ...current,
                                      [subcategoryNode.subcategory.key]: !current[subcategoryNode.subcategory.key],
                                    }))
                                  }
                                  className="flex w-full items-center justify-between px-2.5 py-2 text-left text-xs text-slate-700"
                                  aria-expanded={open}
                                >
                                  {subcategoryNode.subcategory.name}
                                  <span>{open ? "－" : "＋"}</span>
                                </button>
                                {open ? (
                                  <div className="space-y-1 border-t border-slate-100 px-2.5 py-2">
                                    {subcategoryNode.products.map((product) => (
                                      <Link
                                        key={product.slug}
                                        href={`/products/${product.slug}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                                      >
                                        {product.model}
                                      </Link>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
