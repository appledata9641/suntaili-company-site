"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { ArrowUpLine } from "@/components/icons";

// 回到頂端：手機與平板往下捲超過約一個半螢幕高後，在畫面左下角出現向上箭頭，按下回到頁面最上方。
// 桌機版設計稿沒有這個按鈕，1024px 以上不顯示。
function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getSnapshot() {
  return window.scrollY > Math.max(480, window.innerHeight * 1.5);
}

function getServerSnapshot() {
  return false;
}

export default function BackToTop() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toTop = (event: MouseEvent<HTMLButtonElement>) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // 按鈕回到頂端後會隱藏，先移開焦點
    event.currentTarget.blur();
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="回到頁面頂端"
      title="回到頁面頂端"
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
      className={`fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white/95 text-brand-navy shadow-[0_2px_12px_rgba(32,54,86,0.2)] transition-[opacity,translate] duration-200 hover:bg-brand-panel motion-reduce:transition-none lg:hidden ${
        visible ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUpLine className="h-5 w-5" />
    </button>
  );
}
