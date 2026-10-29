"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightLine } from "@/components/icons";
import Checkbox from "@/components/ui/Checkbox";
import { productHref } from "@/lib/catalog";
import { MAX_COMPARE, useCompareList } from "@/lib/compare";
import { isLongModel, splitModel, type ProductSummary } from "./product-summary";

// 型號、規格標籤用的英數字體（設計稿是 Arial 粗體）
export const modelFontClass = "font-[Arial,Helvetica,sans-serif]";

// 卡片上的型號字級：一般 22pt，長型號縮小並允許在「-」處換行
export function modelSizeClass(model: string) {
  return isLongModel(model)
    ? "text-[14px] leading-[18px] sm:text-[18px] sm:leading-[22px]"
    : "text-[18px] leading-[22px] sm:text-[22px] sm:leading-[26px]";
}

// 型號文字：長型號只允許在中間的「-」處換行
export function ModelText({ model }: { model: string }) {
  const parts = splitModel(model);
  if (!parts) return <>{model}</>;
  return (
    <>
      <span className="whitespace-nowrap">{parts[0]}</span>
      <wbr />
      <span className="whitespace-nowrap">{parts[1]}</span>
    </>
  );
}

interface ProductCardProps {
  product: ProductSummary;
  // 第一屏的圖片可以優先載入
  priority?: boolean;
}

// 產品卡片：左上「比較」勾選、右上解析度／路數、產品圖、型號、名稱與箭頭；整張卡片可點到產品頁
export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const compare = useCompareList();
  const checked = compare.has(product.slug);
  const disabled = !checked && compare.isFull;

  return (
    <article className="group relative flex h-full min-w-0 flex-col border border-brand-line bg-white px-3 pb-4 pt-3 transition-[border-color,box-shadow] duration-200 hover:border-brand-grey/60 hover:shadow-[0_2px_12px_rgba(32,54,86,0.08)] sm:min-h-[322px] sm:px-[17px] sm:pb-5 sm:pt-[17px]">
      <div className="pointer-events-none relative z-10 flex min-h-[37px] items-start justify-between gap-2">
        <span className="pointer-events-auto" title={disabled ? `最多可比較 ${MAX_COMPARE} 件商品` : undefined}>
          <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={() => compare.toggle(product.slug)}
            className="-my-[11px] py-[11px] sm:my-0 sm:py-0"
            labelClassName={`text-sm leading-[18px] ${checked ? "font-bold text-brand-navy" : "font-medium text-brand-muted group-hover:text-brand-navy"}`}
          >
            比較<span className="sr-only"> {product.model}</span>
          </Checkbox>
        </span>
        {product.badge ? (
          <span
            className={`inline-flex h-4 items-center border border-brand-navy px-[5px] text-[12px] font-bold leading-none text-brand-navy ${modelFontClass}`}
          >
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="relative mt-1 aspect-[16/10] w-full sm:mt-0 sm:aspect-auto sm:h-[132px]">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 206px, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
          className="object-contain"
        />
      </div>

      <h3 className={`mt-auto pt-4 font-bold text-brand-navy sm:pt-3 ${modelFontClass} ${modelSizeClass(product.model)}`}>
        <Link
          href={productHref(product)}
          className="focus-visible:outline-none! after:absolute after:inset-0 after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-1px] focus-visible:after:outline-brand-navy"
        >
          <ModelText model={product.model} />
        </Link>
      </h3>
      <div className="mt-1.5 flex items-center gap-2 sm:mt-[10px]">
        <p
          className={`line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-[18px] text-brand-muted sm:text-base sm:leading-[18px] ${
            product.cardNameKeepAll ? "lg:[overflow-wrap:anywhere] lg:[word-break:keep-all]" : ""
          }`}
        >
          {product.cardName}
        </p>
        <ArrowRightLine className="h-5 w-5 shrink-0 text-brand-navy transition-transform duration-200 group-hover:translate-x-0.5 sm:mr-[6px] sm:h-6 sm:w-6" />
      </div>
    </article>
  );
}
