"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { productHref } from "@/lib/catalog";
import { modelFontClass } from "./ProductCard";

export interface ModelOverviewGroup {
  id: string;
  name: string;
  slug: string;
  items: { slug: string; model: string; name: string }[];
}

// 清單捲動區最多看到的列數（超過才顯示底部漸層提示）
const VISIBLE_ROWS = 7;

// 公開產品型號總覽：每個分類一個分頁（設計稿是三個），每頁是可捲動的型號清單（所有分頁的連結都輸出在 HTML 裡）
export default function ModelOverview({ groups }: { groups: ModelOverviewGroup[] }) {
  const [active, setActive] = useState(groups[0]?.id ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % groups.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + groups.length) % groups.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = groups.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setActive(groups[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="mx-auto max-w-[948px]">
      <div
        role="tablist"
        aria-label="產品分類"
        className="grid"
        style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}
      >
        {groups.map((group, index) => {
          const selected = group.id === active;
          return (
            <button
              key={group.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${group.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${group.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(group.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`h-[52px] min-w-0 px-2 text-base tracking-[0.04em] focus-visible:-outline-offset-2 sm:h-[69px] sm:text-xl ${
                selected
                  ? "border-t-[5px] border-brand-navy bg-white font-bold text-brand-navy"
                  : `border-r border-t border-brand-line bg-brand-panel font-medium text-brand-muted hover:text-brand-navy ${
                      index === 0 ? "border-l" : ""
                    }`
              }`}
            >
              {group.name}
            </button>
          );
        })}
      </div>

      {groups.map((group) => {
        const desktopRows = Math.ceil(group.items.length / 2);
        const fadeClass = `${group.items.length > VISIBLE_ROWS ? "block" : "hidden"} ${
          desktopRows > VISIBLE_ROWS ? "md:block" : "md:hidden"
        }`;
        return (
          <div
            key={group.id}
            role="tabpanel"
            id={`${baseId}-panel-${group.id}`}
            aria-labelledby={`${baseId}-tab-${group.id}`}
            hidden={group.id !== active}
            className="bg-white px-4 pb-5 pt-5 sm:pb-6 sm:pl-[41px] sm:pr-[17px] sm:pt-[27px]"
          >
            <div className="flex justify-end sm:pr-[26px]">
              <Link
                href={`/categories/${group.slug}/`}
                className="inline-flex h-10 items-center text-sm font-bold tracking-[0.04em] text-brand-blue hover:text-brand-navy sm:h-5"
              >
                查看分類
              </Link>
            </div>
            <div className="scroll-panel mt-2 max-h-[330px] overflow-y-auto pr-2 sm:mt-[23px] sm:pr-[15px]">
              <ul className="grid gap-x-[13px] gap-y-2 md:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.slug} className="min-w-0">
                    <Link
                      href={productHref(item)}
                      prefetch={false}
                      className="flex h-10 items-center border border-brand-line bg-white px-4 text-sm hover:border-brand-blue/50 hover:bg-brand-panel sm:h-[38px]"
                    >
                      <span className="truncate">
                        <span className={`font-bold text-brand-navy ${modelFontClass}`}>{item.model}</span>{" "}
                        <span className="font-medium text-brand-muted">{item.name}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* 還有更多型號時，底部淡出提示可以往下捲 */}
              <div
                aria-hidden
                className={`pointer-events-none sticky bottom-0 h-14 bg-[linear-gradient(to_top,#fff_40%,rgba(255,255,255,0))] ${fadeClass}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
