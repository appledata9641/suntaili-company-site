"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { siteProfile } from "@/data/site";
import { menuTaxonomyGroups } from "@/data/taxonomy";
import type { TaxonomyMenuNode } from "@/types/taxonomy";

const navItems = [
  { href: "/resources", label: "技術文件下載" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

function getNodeHref(node: TaxonomyMenuNode): string {
  if (node.productSlugs && node.productSlugs.length > 0) {
    return `/products/${node.productSlugs[0]}`;
  }
  return "/products";
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTaxonomyOpen, setMobileTaxonomyOpen] = useState(false);
  const [activeMobileGroupKey, setActiveMobileGroupKey] = useState<string>("all");
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const [openNodeKeys, setOpenNodeKeys] = useState<Record<string, boolean>>({});
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const productsActive = pathname === "/products" || pathname.startsWith("/products/");

  const displayedMobileGroups = useMemo(
    () =>
      activeMobileGroupKey === "all"
        ? menuTaxonomyGroups
        : menuTaxonomyGroups.filter((group) => group.key === activeMobileGroupKey),
    [activeMobileGroupKey],
  );

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

  const toggleNode = (key: string) => {
    setOpenNodeKeys((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const renderDesktopNode = (node: TaxonomyMenuNode, depth = 0): React.ReactNode => {
    if (node.children && node.children.length > 0) {
      const titleClass =
        depth === 0
          ? "text-sm font-semibold text-white"
          : depth === 1
            ? "text-sm text-slate-100"
            : "text-xs text-slate-300";

      return (
        <div key={node.key} className={depth === 0 ? "space-y-2" : "space-y-1.5 pl-3"}>
          <div className={titleClass}>{node.label}</div>
          <div className="space-y-1">{node.children.map((child) => renderDesktopNode(child, depth + 1))}</div>
        </div>
      );
    }

    return (
      <Link
        key={node.key}
        href={getNodeHref(node)}
        onClick={() => setDesktopProductsOpen(false)}
        className="block text-sm text-slate-300 hover:text-sky-300"
      >
        {node.label}
      </Link>
    );
  };

  const renderMobileNode = (node: TaxonomyMenuNode, depth = 0): React.ReactNode => {
    const hasChildren = Boolean(node.children && node.children.length > 0);

    if (!hasChildren) {
      return (
        <Link
          key={node.key}
          href={getNodeHref(node)}
          onClick={() => setMobileOpen(false)}
          className={
            depth === 0
              ? "block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              : "block rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
          }
        >
          {node.label}
        </Link>
      );
    }

    const open = Boolean(openNodeKeys[node.key]);
    return (
      <div key={node.key} className="rounded-lg border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => toggleNode(node.key)}
          className={
            depth === 0
              ? "flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-800"
              : "flex w-full items-center justify-between px-2.5 py-2 text-left text-xs text-slate-700"
          }
          aria-expanded={open}
        >
          {node.label}
          <span>{open ? "－" : "＋"}</span>
        </button>
        {open ? (
          <div className="space-y-1 border-t border-slate-100 px-2.5 py-2">
            {node.children?.map((child) => renderMobileNode(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
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
                <div className="absolute right-0 top-full z-50 w-[min(1120px,calc(100vw-2rem))] pt-2">
                  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">產品介紹</p>
                      <Link href="/products" className="text-xs text-sky-300 hover:text-sky-200">
                        查看全部產品 →
                      </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {menuTaxonomyGroups.map((group) => (
                        <section key={group.key} className="space-y-4">
                          <h3 className="border-b border-slate-700 pb-2 text-base font-semibold text-sky-300">
                            {group.name}
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            {group.columns.map((column) => (
                              <div key={column.key} className="space-y-1">
                                {renderDesktopNode(column)}
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
          <div
            id="mobile-menu"
            className="max-h-[calc(100svh-4rem)] overflow-y-auto space-y-2 border-t border-slate-200 py-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:hidden"
          >
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
                <div className="relative space-y-3 border-t border-slate-200 bg-slate-50 p-3">
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
                      {menuTaxonomyGroups.map((group) => (
                        <button
                          key={group.key}
                          type="button"
                          onClick={() => setActiveMobileGroupKey(group.key)}
                          className={
                            activeMobileGroupKey === group.key
                              ? "rounded-full bg-slate-900 px-3 py-1.5 text-xs text-white"
                              : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
                          }
                        >
                          {group.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-[42svh] space-y-3 overflow-y-auto pr-1 pb-2">
                    {displayedMobileGroups.map((group) => (
                      <div key={group.key} className="space-y-2">
                        <div className="text-sm font-semibold text-slate-900">{group.name}</div>
                        {group.columns.map((column) => (
                          <div key={column.key}>{renderMobileNode(column)}</div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 z-10 -mx-3 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur">
                    <button
                      type="button"
                      onClick={() => setMobileTaxonomyOpen(false)}
                      className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                    >
                      收合產品分類
                    </button>
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
