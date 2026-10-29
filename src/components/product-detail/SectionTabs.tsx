"use client";

import { useEffect, useRef, useState } from "react";

export interface SectionTab {
  id: string;
  label: string;
}

// 規格資訊／產品尺寸／支架配件／型號比較：黏在頁首下方，捲動時自動標示目前區塊
export default function SectionTabs({ tabs }: { tabs: SectionTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;
    // 上方產品卡片與頁尾也一起觀察：直接跳到頁首或頁尾時，區塊本身不會跨線，靠它們觸發重新判斷
    const sentinels = [navRef.current?.previousElementSibling, document.querySelector("footer")].filter(
      (element): element is Element => element instanceof Element,
    );

    // 以畫面 35% 高度的一條橫線為準：最後一個頂端已經過這條線的區塊就是目前區塊
    const lineY = () => Math.round(window.innerHeight * 0.35);
    const update = () => {
      const line = lineY();
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };

    // 區塊跨過這條線時才重新判斷
    let observer: IntersectionObserver | null = null;
    const observe = () => {
      observer?.disconnect();
      const line = lineY();
      observer = new IntersectionObserver(update, {
        rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`,
      });
      [...sections, ...sentinels].forEach((element) => observer?.observe(element));
    };

    // 頁首是固定定位、上方有等高的佔位，頁首縮小時內容不會位移，錨點位置不必另外補差距
    observe();
    window.addEventListener("resize", observe);

    // 帶 #錨點 開啟時，網頁字型載入後文字高度會改變，若目標還在附近就重新對齊一次（不搶使用者的捲動）
    let cancelled = false;
    let hashTarget: HTMLElement | null = null;
    try {
      hashTarget = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    } catch {
      hashTarget = null;
    }
    const align = () => {
      if (cancelled || !hashTarget) return;
      const offset = hashTarget.getBoundingClientRect().top - (Number.parseFloat(getComputedStyle(hashTarget).scrollMarginTop) || 0);
      if (Math.abs(offset) > 4 && Math.abs(offset) < 240) hashTarget.scrollIntoView({ block: "start" });
    };
    // 等瀏覽器一開始的平滑捲動停下來再判斷
    const afterScrollSettles = () => {
      let last = window.scrollY;
      let still = 0;
      let frames = 0;
      const tick = () => {
        if (cancelled) return;
        frames += 1;
        still = window.scrollY === last ? still + 1 : 0;
        last = window.scrollY;
        if (still >= 6 || frames > 150) align();
        else window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    };
    if (hashTarget && document.fonts) document.fonts.ready.then(afterScrollSettles);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, [tabs]);

  return (
    <nav
      ref={navRef}
      aria-label="產品資訊"
      className="sticky top-[64px] z-30 bg-white shadow-[inset_0_-1px_0_var(--color-brand-line)] lg:top-[72px]"
    >
      <ul className="no-scrollbar mx-auto flex h-[50px] max-w-[1067px] items-stretch gap-6 overflow-x-auto px-4 sm:justify-center sm:gap-[50px] lg:h-[62px]">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id} className="flex shrink-0">
              <a
                href={`#${tab.id}`}
                onClick={() => setActive(tab.id)}
                aria-current={isActive ? "location" : undefined}
                className={`relative flex items-center whitespace-nowrap px-[10px] text-sm font-bold tracking-[0.1em] text-brand-navy focus-visible:outline-offset-[-4px] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-brand-navy after:transition-opacity ${
                  isActive ? "after:opacity-100" : "after:opacity-0 hover:after:opacity-40"
                }`}
              >
                {tab.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
