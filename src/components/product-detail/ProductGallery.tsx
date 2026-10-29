"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { ArrowLeftSLine, ArrowRightSLine } from "@/components/icons";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

// 產品圖庫：主圖 353×353、左右箭頭、下方 61×61 縮圖（只顯示實際有的圖片）
export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const multiple = count > 1;
  const current = images[index] ?? images[0];

  const go = (next: number) => setIndex((next + count) % count);

  // 焦點在圖庫內的按鈕時，可用左右方向鍵切換
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!multiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  };

  const arrowClass =
    "absolute top-1/2 z-[1] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[3px] bg-white/80 text-brand-scroll hover:text-brand-blue lg:bg-transparent";

  return (
    <div className="mx-auto w-full max-w-[353px]" onKeyDown={onKeyDown}>
      <div className="relative">
        <div className="relative aspect-square w-full border border-brand-frame bg-white">
          {current ? (
            <Image
              key={current}
              src={current}
              alt={multiple ? `${alt}（第 ${index + 1} 張，共 ${count} 張）` : alt}
              fill
              priority
              sizes="(min-width: 400px) 353px, calc(100vw - 64px)"
              className="object-contain"
            />
          ) : null}
        </div>

        {multiple ? (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="上一張圖片" className={`${arrowClass} left-1 lg:-left-[43px]`}>
              <ArrowLeftSLine className="h-9 w-9" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="下一張圖片" className={`${arrowClass} right-1 lg:-right-[43px]`}>
              <ArrowRightSLine className="h-9 w-9" />
            </button>
          </>
        ) : null}
      </div>

      {count > 0 ? (
        <ul className="mt-[15px] flex flex-wrap gap-3" aria-label={multiple ? "產品圖片縮圖" : undefined}>
          {images.map((src, i) => {
            const thumb = (
              <Image src={src} alt="" width={59} height={59} sizes="59px" className="h-full w-full object-contain" />
            );
            return (
              <li key={src} className="h-[61px] w-[61px]">
                {multiple ? (
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`顯示第 ${i + 1} 張圖片`}
                    aria-current={i === index ? "true" : undefined}
                    className={`block h-full w-full border bg-white ${
                      i === index ? "border-brand-blue" : "border-brand-frame hover:border-brand-grey"
                    }`}
                  >
                    {thumb}
                  </button>
                ) : (
                  <div className="h-full w-full border border-brand-frame bg-white">{thumb}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}

      {multiple ? (
        <p className="sr-only" aria-live="polite">
          第 {index + 1} 張，共 {count} 張
        </p>
      ) : null}
    </div>
  );
}
