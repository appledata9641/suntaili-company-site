"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import BrandLogo from "@/components/BrandLogo";
import { ArrowDownSLine, ArrowRightSLine, CloseLine, FileCopyLine, MenuLine, QuestionLine } from "@/components/icons";
import { consultLink, mainNav, productMenuSide, type NavGroup, type ProductMenuColumn } from "@/data/navigation";

// 頁首的互動部分：依美編設計稿。主選單 4 項＋「立即諮詢」；產品中心是滿版大選單，其他三項是小下拉選單。
// 產品中心大選單的分類由 Header（伺服器端）依目前刊登的產品篩好再傳進來。
const TAGLINE = "B2B安防監控、弱電整合與AHD客製化組裝";

function isGroupActive(pathname: string, group: NavGroup) {
  return group.activePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

interface HeaderClientProps {
  productColumns: ProductMenuColumn[];
}

export default function HeaderClient({ productColumns }: HeaderClientProps) {
  const pathname = usePathname() ?? "/";
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (key: string) => {
    cancelClose();
    setOpenKey(key);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 160);
  };

  const closeAll = () => {
    cancelClose();
    setOpenKey(null);
    setMobileOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpenKey(null);
    }
  };

  const onGroupBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpenKey(null);
    }
  };

  const megaOpen = openKey === "產品中心";

  return (
    <>
      {/* 頁首固定在畫面上方；這個佔位的高度不變，捲動時頁首縮小也不會讓下面的內容跳動 */}
      <div aria-hidden className="h-[64px] lg:h-[110px]" />
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_1px_0_#acb5c6]" onKeyDown={onKeyDown}>
        <div
          className={`mx-auto flex max-w-[1100px] items-center justify-between gap-6 px-4 transition-[height] duration-200 lg:px-6 ${
            compact ? "h-[64px] lg:h-[72px]" : "h-[64px] lg:h-[110px]"
          }`}
        >
          <Link href="/" className="min-w-0 shrink-0" onClick={closeAll} aria-label="三泰利企業有限公司 首頁">
            <BrandLogo href="" variant="masthead" compact={compact} />
          </Link>

          <nav aria-label="主選單" className="hidden h-full items-center gap-12 lg:flex">
            {mainNav.map((group) => {
              const active = isGroupActive(pathname, group);
              const open = openKey === group.label;
              return (
                <div
                  key={group.label}
                  className="relative flex h-full items-center"
                  onMouseEnter={() => openMenu(group.label)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => openMenu(group.label)}
                  onBlur={onGroupBlur}
                >
                  <Link
                    href={group.href}
                    onClick={closeAll}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={open}
                    aria-haspopup="true"
                    className={`relative py-2 text-sm font-bold tracking-[0.1em] text-brand-navy after:absolute after:-bottom-[3px] after:left-[-4px] after:right-[-4px] after:h-[2px] after:bg-brand-navy after:transition-opacity ${
                      active || open ? "after:opacity-100" : "after:opacity-0 hover:after:opacity-100"
                    }`}
                  >
                    {group.label}
                  </Link>

                  {group.children && open ? (
                    <div className="absolute left-1/2 top-[calc(100%-18px)] z-10 w-[148px] -translate-x-1/2 border border-brand-line bg-white px-4 py-3 shadow-[0_4px_14px_rgba(32,54,86,0.08)]">
                      <ul>
                        {group.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeAll}
                              className="group flex items-center justify-between py-[7px] text-xs font-bold tracking-[0.08em] text-brand-grey hover:text-brand-navy"
                            >
                              {child.label}
                              <ArrowRightSLine className="h-4 w-4 text-brand-grey group-hover:text-brand-navy" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
            <Link
              href={consultLink.href}
              onClick={closeAll}
              aria-current={pathname.startsWith("/inquiry") ? "page" : undefined}
              className="inline-flex h-[38px] items-center rounded-[3px] border border-brand-navy px-[21px] text-sm font-bold tracking-[0.1em] text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              {consultLink.label}
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-[3px] border border-brand-navy px-3 py-2 text-sm font-bold text-brand-navy lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <CloseLine className="h-4 w-4" /> : <MenuLine className="h-4 w-4" />}
            選單
          </button>
        </div>

        {/* 產品中心大選單 */}
        {megaOpen ? (
          <div
            className="absolute inset-x-0 top-full hidden border-t border-brand-line bg-white shadow-[0_10px_24px_rgba(32,54,86,0.12)] lg:flex"
            onMouseEnter={() => openMenu("產品中心")}
            onMouseLeave={scheduleClose}
            onFocus={() => openMenu("產品中心")}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenKey(null);
            }}
          >
            <div className="flex w-[max(300px,calc(50vw-393px))] shrink-0 justify-end bg-brand-navy py-10 pr-8">
              <div className="w-[212px]">
                <Link
                  href={productMenuSide.title.href}
                  onClick={closeAll}
                  className="flex items-center justify-between border-b border-white/70 pb-3 text-base font-bold tracking-[0.1em] text-white"
                >
                  {productMenuSide.title.label}
                  <ArrowRightSLine className="h-5 w-5" />
                </Link>
                <ul className="mt-4 space-y-2.5">
                  {productMenuSide.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAll}
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-white hover:underline"
                      >
                        <ArrowRightSLine className="h-3.5 w-3.5" />
                        {link.label}
                        {link.icon === "question" ? (
                          <QuestionLine className="h-3.5 w-3.5" />
                        ) : (
                          <FileCopyLine className="h-3.5 w-3.5" />
                        )}
                      </Link>
                      {"children" in link && link.children ? (
                        <ul className="mt-1.5 space-y-1 pl-5">
                          {link.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={closeAll}
                                className="text-[10px] font-bold tracking-[0.06em] text-brand-grey before:mr-1 before:content-['•'] hover:text-white hover:underline"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-1 gap-2 py-10 pl-[52px] pr-6">
              {productColumns.map((column) => (
                <div key={column.href} className="w-[150px] shrink-0 xl:w-[163px]">
                  <Link
                    href={column.href}
                    onClick={closeAll}
                    className="inline-flex items-center gap-0.5 text-sm font-bold tracking-[0.08em] text-brand-navy hover:underline"
                  >
                    <ArrowRightSLine className="h-4 w-4" />
                    {column.label}
                  </Link>
                  <ul className="mt-3 space-y-[9px] pl-[18px]">
                    {column.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeAll}
                          className="text-xs font-medium tracking-[0.04em] text-brand-grey hover:font-bold hover:text-brand-navy"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* 手機選單 */}
        {mobileOpen ? (
          <nav
            id="mobile-menu"
            aria-label="手機主選單"
            className="mobile-scroll-panel max-h-[calc(var(--app-vh)-64px)] overflow-y-auto border-t border-brand-line bg-white px-4 pb-6 pt-2 lg:hidden"
          >
            <ul>
              {mainNav.map((group) => {
                const expanded = mobileSection === group.label;
                const children = group.mega
                  ? [{ label: "全部產品", href: "/products/" }, ...productColumns.map(({ label, href }) => ({ label, href }))]
                  : group.children ?? [];
                return (
                  <li key={group.label} className="border-b border-brand-line">
                    <button
                      type="button"
                      onClick={() => setMobileSection(expanded ? null : group.label)}
                      aria-expanded={expanded}
                      className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-bold tracking-[0.1em] text-brand-navy"
                    >
                      {group.label}
                      <ArrowDownSLine className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </button>
                    {expanded ? (
                      <ul className="pb-3">
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeAll}
                              className="flex items-center justify-between rounded-[3px] px-2 py-2.5 text-sm font-bold tracking-[0.06em] text-brand-grey hover:bg-brand-panel hover:text-brand-navy"
                            >
                              {child.label}
                              <ArrowRightSLine className="h-4 w-4" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <Link
              href={consultLink.href}
              onClick={closeAll}
              className="mt-5 flex h-11 items-center justify-center rounded-[5px] bg-brand-blue text-sm font-bold tracking-[0.12em] text-white"
            >
              {consultLink.label}
            </Link>
          </nav>
        ) : null}
      </header>

      <div className="bg-brand-blue px-4 py-[5px] text-center text-xs font-bold tracking-[0.06em] text-white">{TAGLINE}</div>
    </>
  );
}
