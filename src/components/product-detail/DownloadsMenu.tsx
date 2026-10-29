"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { DownloadLine } from "@/components/icons";
import { buttonClass, chipClass } from "@/components/ui/styles";
import type { ProductDownloadEntry } from "@/components/product-detail/product-detail-data";

interface DownloadsMenuProps {
  model: string;
  items: ProductDownloadEntry[];
  className?: string;
}

// 「相關文件下載」：有文件時展開小視窗列出此型號的下載；沒有文件時直接連到文件下載頁搜尋此型號
export default function DownloadsMenu({ model, items, className = "" }: DownloadsMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  // 設計稿的外框按鈕是 1px 框線
  const triggerClass = buttonClass("outline", "sm", `border! pl-4 pr-3 max-lg:h-11 ${className}`);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (items.length === 0) {
    return (
      <Link href={`/resources/?keyword=${encodeURIComponent(model)}`} className={triggerClass}>
        相關文件下載
        <DownloadLine className="h-[18px] w-[18px]" />
      </Link>
    );
  }

  // 用鍵盤離開這個區塊時收起
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative" onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`${triggerClass} w-full`}
      >
        相關文件下載
        <DownloadLine className="h-[18px] w-[18px]" />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-40 mt-2 w-[340px] max-w-[calc(100vw-48px)] rounded-[5px] border border-brand-line bg-white p-2 text-left shadow-[0_8px_24px_rgba(32,54,86,0.14)]"
      >
        <p className="px-3 pb-1.5 pt-1 text-xs font-bold tracking-[0.08em] text-brand-grey">{model} 相關文件</p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
                data-ga-event="download_click"
                data-ga-category="download"
                data-ga-label={item.id}
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 rounded-[3px] px-3 py-2.5 hover:bg-brand-panel"
              >
                <span className={chipClass("outline", "mt-0.5 shrink-0")}>{item.typeLabel}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold leading-5 text-brand-navy group-hover:underline">
                    {item.title}
                    {item.external ? <span className="sr-only">（另開新視窗）</span> : null}
                  </span>
                  {item.meta ? <span className="mt-0.5 block text-[11px] leading-4 text-brand-grey">{item.meta}</span> : null}
                </span>
                <DownloadLine className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
