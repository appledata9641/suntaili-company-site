"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightLine, CloseLine, ResetLeftLine } from "@/components/icons";
import { productHref } from "@/lib/catalog";
import { compareHref, MAX_COMPARE, useCompareList } from "@/lib/compare";
import { ModelText, modelFontClass, modelSizeClass } from "./ProductCard";
import type { ProductSummary } from "./product-summary";

// 「全部重置」與「比較產品」按鈕（產品中心、分類頁共用）
export function CompareActions({ showCount = false }: { showCount?: boolean }) {
  const compare = useCompareList();
  const count = compare.list.length;
  const ready = count >= 2;

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-[19px] gap-y-2">
      {showCount ? (
        <span className="text-sm font-medium text-brand-muted" aria-live="polite">
          已選 {count} / {MAX_COMPARE} 件
        </span>
      ) : null}
      <button
        type="button"
        onClick={compare.clear}
        disabled={count === 0}
        className="inline-flex h-10 items-center gap-[7px] text-sm font-bold text-brand-navy hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40 lg:h-[26px]"
      >
        <ResetLeftLine className="h-6 w-6" />
        全部重置
      </button>
      {ready ? (
        <Link
          href={compareHref(compare.list)}
          className="inline-flex h-10 items-center rounded-[3px] bg-brand-navy px-4 text-sm font-bold text-white hover:bg-brand-blue lg:h-[26px] lg:px-[7px]"
        >
          比較產品
        </Link>
      ) : (
        <button
          type="button"
          disabled
          title="請至少勾選 2 件商品"
          className="inline-flex h-10 cursor-not-allowed items-center rounded-[3px] bg-brand-navy px-4 text-sm font-bold text-white opacity-40 lg:h-[26px] lg:px-[7px]"
        >
          比較產品
        </button>
      )}
    </div>
  );
}

interface CompareTrayProps {
  products: ProductSummary[];
}

// 比較清單：4 格，已選的商品顯示圖片與型號，空格提示如何加入
export default function CompareTray({ products }: CompareTrayProps) {
  const compare = useCompareList();
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const selected = compare.list
    .map((slug) => bySlug.get(slug))
    .filter((product): product is ProductSummary => Boolean(product));
  const emptyCount = MAX_COMPARE - selected.length;
  const isEmpty = selected.length === 0;

  return (
    <ul aria-label="比較清單" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {selected.map((product) => (
        <li key={product.slug} className="min-w-0">
          <CompareSlot product={product} onRemove={() => compare.remove(product.slug)} />
        </li>
      ))}
      {Array.from({ length: emptyCount }, (_, index) => (
        <li
          key={`empty-${index}`}
          // 手機版只留一格提示，避免一排大空框；重複的提示不必再念給報讀軟體
          aria-hidden={index > 0 ? true : undefined}
          className={`min-w-0 ${index > 0 ? "hidden sm:block" : ""} ${isEmpty ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <div
            className={`flex h-full flex-col items-center justify-center border border-brand-line px-3 text-center text-sm font-medium leading-6 text-brand-grey ${
              isEmpty ? "min-h-[72px] sm:min-h-[120px]" : "min-h-[190px] sm:min-h-[240px] min-[87.5rem]:min-h-[322px]"
            }`}
          >
            <p>
              <span className="inline-block">勾選下方產品的「比較」</span>
              <span className="inline-block">即可加入</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CompareSlot({ product, onRemove }: { product: ProductSummary; onRemove: () => void }) {
  return (
    <div className="group relative flex h-full min-h-[190px] flex-col border border-brand-blue bg-white px-3 pb-4 pt-11 sm:min-h-[240px] sm:px-4 min-[87.5rem]:min-h-[322px] min-[87.5rem]:px-[27px] min-[87.5rem]:pb-5 min-[87.5rem]:pt-[54px]">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`從比較清單移除 ${product.model}`}
        className="absolute -right-px -top-px z-10 flex h-10 w-10 items-center justify-center border border-brand-blue bg-white text-brand-blue hover:bg-brand-blue hover:text-white sm:h-8 sm:w-8"
      >
        <CloseLine className="h-6 w-6" />
      </button>
      <div className="relative h-[76px] w-full sm:h-[96px] min-[87.5rem]:h-[132px]">
        <Image src={product.coverImage} alt="" fill sizes="(min-width: 1280px) 186px, (min-width: 640px) 18vw, 40vw" className="object-contain" />
      </div>
      <p className={`mt-auto break-words pt-3 font-bold text-brand-navy ${modelFontClass} ${modelSizeClass(product.model)}`}>
        <Link
          href={productHref(product)}
          className="focus-visible:outline-none! after:absolute after:inset-0 after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-1px] focus-visible:after:outline-brand-navy"
        >
          <ModelText model={product.model} />
        </Link>
      </p>
      <div className="mt-1.5 flex items-center gap-2 sm:mt-[8px]">
        <p
          className={`line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-[18px] text-brand-muted min-[87.5rem]:text-base ${
            product.cardNameKeepAll ? "min-[87.5rem]:[overflow-wrap:anywhere] min-[87.5rem]:[word-break:keep-all]" : ""
          }`}
        >
          {product.cardName}
        </p>
        <ArrowRightLine className="h-5 w-5 shrink-0 text-brand-navy transition-transform duration-200 group-hover:translate-x-0.5 sm:h-6 sm:w-6 min-[87.5rem]:-mr-[10px]" />
      </div>
    </div>
  );
}
