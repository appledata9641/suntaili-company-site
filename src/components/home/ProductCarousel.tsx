"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftWideFill, ArrowRightWideFill, StackFill } from "@/components/icons";

export interface ProductCarouselItem {
  title: string;
  href: string;
  // 沒有圖片的卡片是「產品中心」總覽卡（標題＋圖層圖示）
  image?: {
    src: string;
    width: number;
    height: number;
    // 卡片內顯示寬度（px），依設計稿各張圖的大小
    displayWidth: number;
  };
}

interface Edges {
  atStart: boolean;
  atEnd: boolean;
}

function readEdges(element: HTMLElement): Edges {
  const max = element.scrollWidth - element.clientWidth;
  return { atStart: element.scrollLeft <= 1, atEnd: element.scrollLeft >= max - 1 };
}

const cardClass =
  "group flex h-[276px] w-[220px] flex-col items-center rounded-[4px] border border-brand-line bg-white shadow-[0_0_10px_rgba(0,0,0,0.08)] focus-visible:outline-offset-[-2px] md:w-[240px]";

// 主頁「產品」橫向卡片列：桌機一次顯示 4 張（240×276、間距 41px），左右箭頭一次捲動一張。
// 手機版也顯示左右箭頭（提示還能左右滑），卡片列可直接滑動，也可以按箭頭。
export default function ProductCarousel({ items }: { items: ProductCarouselItem[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState<Edges>({ atStart: true, atEnd: false });

  // 捲動位置或尺寸改變時更新左右箭頭是否可按（在事件回呼裡更新狀態）
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const sync = () =>
      setEdges((previous) => {
        const next = readEdges(list);
        return previous.atStart === next.atStart && previous.atEnd === next.atEnd ? previous : next;
      });
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    list.addEventListener("scroll", sync, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", sync);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const card = list.querySelector("li");
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const step = (card?.getBoundingClientRect().width ?? 240) + gap;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const arrowClass =
    "flex h-16 w-9 shrink-0 items-center justify-center text-brand-blue hover:text-brand-navy disabled:cursor-default disabled:opacity-30 disabled:hover:text-brand-blue md:w-10";
  const arrowIconClass = "h-8 w-8 md:h-10 md:w-10";

  return (
    // 手機版往兩側多延伸 12px，箭頭靠近螢幕邊緣，中間留給卡片（下一張會露出一小截）
    <div className="-mx-3 flex items-center justify-center gap-1 md:mx-0 md:gap-3 xl:gap-0">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={edges.atStart}
        aria-controls="home-product-list"
        aria-label="上一個產品分類"
        className={arrowClass}
      >
        <ArrowLeftWideFill className={arrowIconClass} />
      </button>

      <ul
        id="home-product-list"
        ref={listRef}
        aria-label="產品分類"
        className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-3 scroll-px-2 md:w-[545px] md:flex-none md:gap-[41px] md:px-3 md:scroll-px-3 lg:w-[826px] xl:ml-5 xl:mr-3 xl:w-[1107px]"
      >
        {items.map((item) => (
          <li key={item.href} className="shrink-0 snap-start">
            {item.image ? (
              <Link href={item.href} className={cardClass}>
                <h3 className="mt-[28px] text-xl font-bold leading-7 tracking-[0.1em] text-brand-grey">{item.title}</h3>
                <span
                  aria-hidden
                  className="mt-[26px] h-[2px] w-[160px] bg-brand-line transition-colors group-hover:bg-brand-navy group-focus-visible:bg-brand-navy md:w-[180px]"
                />
                <span className="flex w-full flex-1 items-center justify-center px-4 pb-[22px]">
                  <Image
                    src={item.image.src}
                    alt=""
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    sizes="240px"
                    className="h-auto max-w-full transition-transform duration-300 group-hover:scale-[1.04]"
                    style={{ width: item.image.displayWidth }}
                  />
                </span>
              </Link>
            ) : (
              <Link href={item.href} className={`${cardClass} justify-center`}>
                <h3 className="text-2xl font-bold leading-8 tracking-[0.1em] text-brand-grey transition-colors group-hover:text-brand-blue">
                  {item.title}
                </h3>
                <StackFill className="mt-[14px] h-[65px] w-[65px] text-brand-line transition-colors group-hover:text-brand-grey/40" />
              </Link>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={edges.atEnd}
        aria-controls="home-product-list"
        aria-label="下一個產品分類"
        className={arrowClass}
      >
        <ArrowRightWideFill className={arrowIconClass} />
      </button>
    </div>
  );
}
