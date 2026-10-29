"use client";

import Image from "next/image";
import { useRef } from "react";

interface DimensionFigureProps {
  src: string;
  alt: string;
  widthLabel: string;
  heightLabel: string;
}

interface ContentBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// 圖框比例 16:10（產品照片 960×600）
const FRAME_RATIO = 16 / 10;

// 找出照片中非白色（產品本體）的範圍，回傳相對整張照片的比例
function detectContentBox(img: HTMLImageElement): ContentBox | null {
  const { naturalWidth, naturalHeight } = img;
  if (!naturalWidth || !naturalHeight) return null;
  const width = 192;
  const height = Math.max(1, Math.round((naturalHeight / naturalWidth) * width));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  try {
    context.drawImage(img, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    // 下緣改用較深的門檻，避免把產品下方淡淡的倒影或陰影算進去
    let maxStrongY = -1;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const darkest = Math.min(data[i], data[i + 1], data[i + 2]);
        if (darkest < 236) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (darkest < 200 && y > maxStrongY) maxStrongY = y;
        }
      }
    }
    if (maxX < 0) return null;
    const bottom = maxStrongY >= 0 ? maxStrongY : maxY;
    return { left: minX / width, top: minY / height, right: (maxX + 1) / width, bottom: (bottom + 1) / height };
  } catch {
    // 圖片放在其他網域、無法讀取像素時，標線改沿整張照片
    return null;
  }
}

// 產品尺寸示意：照片置中，上方標寬度、右側標高度（標線貼齊照片中的產品外緣）
export default function DimensionFigure({ src, alt, widthLabel, heightLabel }: DimensionFigureProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  const placeLines = (img: HTMLImageElement) => {
    const frame = frameRef.current;
    if (!frame) return;
    const box = detectContentBox(img) ?? { left: 0, top: 0, right: 1, bottom: 1 };
    // object-contain 時照片在圖框內實際占的範圍
    const imageRatio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : FRAME_RATIO;
    const shownWidth = Math.min(1, imageRatio / FRAME_RATIO);
    const shownHeight = Math.min(1, FRAME_RATIO / imageRatio);
    const offsetX = (1 - shownWidth) / 2;
    const offsetY = (1 - shownHeight) / 2;
    const percent = (value: number) => `${(value * 100).toFixed(2)}%`;
    frame.style.setProperty("--dim-l", percent(offsetX + box.left * shownWidth));
    frame.style.setProperty("--dim-r", percent(offsetX + box.right * shownWidth));
    frame.style.setProperty("--dim-t", percent(offsetY + box.top * shownHeight));
    frame.style.setProperty("--dim-b", percent(offsetY + box.bottom * shownHeight));
    frame.dataset.ready = "true";
  };

  return (
    <div
      ref={frameRef}
      className="group/dim relative mx-auto aspect-[16/10] w-[calc(100%-56px)] max-w-[360px] [--dim-b:100%] [--dim-l:0%] [--dim-r:100%] [--dim-t:0%]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 640px) 360px, calc(100vw - 120px)"
        className="object-contain"
        onLoad={(event) => placeLines(event.currentTarget)}
      />

      <div aria-hidden="true" className="opacity-0 transition-opacity duration-300 group-data-[ready=true]/dim:opacity-100">
        {/* 上方寬度標線與數字 */}
        <div className="absolute bottom-[calc(100%-var(--dim-t)+10px)] left-(--dim-l) right-[calc(100%-var(--dim-r))] flex flex-col items-center">
          <span className="text-base leading-6 text-brand-muted sm:text-[20px] sm:leading-7">{widthLabel}</span>
          <span className="mt-1 h-px w-full bg-brand-grey" />
        </div>

        {/* 產品上下緣的延伸線 */}
        <span className="absolute left-(--dim-l) right-[calc(100%-var(--dim-r)-26px)] top-(--dim-t) h-px bg-brand-line" />
        <span className="absolute left-(--dim-l) right-[calc(100%-var(--dim-r)-26px)] top-[calc(var(--dim-b)-1px)] h-px bg-brand-line" />

        {/* 右側高度標線與數字（直書，由下往上讀） */}
        <div className="absolute bottom-[calc(100%-var(--dim-b))] left-[calc(var(--dim-r)+20px)] top-(--dim-t) flex items-center">
          <span className="h-full w-px bg-brand-grey" />
          <span className="ml-2 rotate-180 whitespace-nowrap text-base leading-6 text-brand-muted [writing-mode:vertical-rl] sm:text-[20px] sm:leading-7">
            {heightLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
