"use client";

import { useId, useRef, useState } from "react";
import { ArrowDownSLine, ArrowRightSLine } from "@/components/icons";
import Pagination from "@/components/ui/Pagination";
import type { FaqCategory, FaqItem } from "@/data/faq";

const PAGE_SIZE = 10;
const ALL = "全部";
type Filter = typeof ALL | FaqCategory;

interface FaqBrowserProps {
  items: FaqItem[];
  categories: FaqCategory[];
}

// 常見問題列表：分類頁籤、可展開的問答（第一題預設展開）、每頁 10 題分頁
export default function FaqBrowser({ items, categories }: FaqBrowserProps) {
  const baseId = useId();
  const topRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>(ALL);
  const [page, setPage] = useState(1);
  // 以資料中的順序（索引）記錄展開中的題目
  const [openKeys, setOpenKeys] = useState<ReadonlySet<number>>(() => new Set([0]));

  const filtered = items
    .map((item, key) => ({ ...item, key }))
    .filter((item) => filter === ALL || item.category === filter);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggle = (key: number) => {
    setOpenKeys((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const changeFilter = (value: Filter) => {
    setFilter(value);
    setPage(1);
  };

  const changePage = (value: number) => {
    setPage(value);
    topRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div>
      <div
        ref={topRef}
        id="faq-categories"
        role="group"
        aria-label="問題分類"
        className="grid grid-cols-5 border border-brand-blue"
      >
        {[ALL, ...categories].map((value, index) => {
          const active = value === filter;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => changeFilter(value as Filter)}
              className={`h-10 min-w-0 px-1 text-[13px] font-medium tracking-[0.06em] focus-visible:outline-offset-[-4px] sm:text-sm sm:tracking-[0.1em] ${
                index > 0 ? "border-l border-brand-blue" : ""
              } ${active ? "bg-brand-blue text-white focus-visible:outline-white" : "bg-white text-brand-blue hover:bg-brand-panel"}`}
            >
              {value}
            </button>
          );
        })}
      </div>

      <ul className="mt-10 border-t border-brand-navy lg:mt-[56px]">
        {visible.map((item, index) => {
          const number = (currentPage - 1) * PAGE_SIZE + index + 1;
          const open = openKeys.has(item.key);
          const buttonId = `${baseId}-question-${item.key}`;
          const panelId = `${baseId}-answer-${item.key}`;
          return (
            <li key={item.key} className="border-b border-brand-line">
              <h2>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(item.key)}
                  className="group grid min-h-[58.5px] w-full grid-cols-[32px_minmax(0,1fr)_24px] items-center py-3 pr-2 text-left focus-visible:outline-offset-[-2px] sm:grid-cols-[56px_134px_minmax(0,1fr)_24px] sm:pr-[19px]"
                >
                  <span className="text-center text-xs text-black">{number}</span>
                  <span className="hidden text-center text-xs font-bold text-black sm:block">{item.category}</span>
                  <span className="pl-1 sm:pl-[21px]">
                    <span className="block text-[11px] font-bold leading-4 text-brand-blue sm:hidden">{item.category}</span>
                    <span className="flex items-baseline">
                      <span aria-hidden className="w-[22px] shrink-0 text-base leading-5 text-brand-blue">
                        Q.
                      </span>
                      <span className="text-xs font-bold leading-5 tracking-[0.075em] text-black">{item.question}</span>
                    </span>
                  </span>
                  {open ? (
                    <ArrowDownSLine className="h-6 w-6 text-brand-navy" />
                  ) : (
                    <ArrowRightSLine className="h-6 w-6 text-brand-line transition-colors group-hover:text-brand-blue" />
                  )}
                </button>
              </h2>
              <div id={panelId} hidden={!open} className="pb-8 pl-9 pr-4 pt-2 sm:pb-[45px] sm:pl-[211px] sm:pr-[19px] sm:pt-[15.75px]">
                <div className="flex items-baseline">
                  <span aria-hidden className="w-[22px] shrink-0 text-base leading-7 text-brand-blue">
                    A.
                  </span>
                  <p className="whitespace-pre-line text-xs font-bold leading-7 tracking-[0.075em] text-black">{item.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Pagination page={currentPage} pageCount={pageCount} onChange={changePage} className="mt-12 lg:mt-[93px]" />
    </div>
  );
}
