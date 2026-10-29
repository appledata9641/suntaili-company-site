"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import { ArrowRightLine, CloseLine } from "@/components/icons";
import Checkbox from "@/components/ui/Checkbox";
import { buttonClass } from "@/components/ui/styles";
import { getSpecGroup, productHref, specGroupLabels, type SpecGroupKey } from "@/lib/catalog";
import { compareHref, MAX_COMPARE, useCompareList } from "@/lib/compare";
import { ModelText, modelFontClass } from "./ProductCard";
import { isLongModel, type CompareProduct } from "./product-summary";

const groupOrder: SpecGroupKey[] = ["module", "function", "general"];

interface SpecRow {
  label: string;
  values: (string | null)[];
  differs: boolean;
}

function buildRows(selected: CompareProduct[]) {
  const labels: string[] = [];
  for (const product of selected) {
    for (const spec of product.specs) {
      if (!labels.includes(spec.label)) labels.push(spec.label);
    }
  }
  const rows = labels.map((label): SpecRow & { group: SpecGroupKey } => {
    const values = selected.map((product) => {
      const matches = product.specs.filter((spec) => spec.label === label).map((spec) => spec.value);
      return matches.length ? matches.join("；") : null;
    });
    const normalized = values.map((value) => (value ?? "").replace(/\s+/g, " ").trim());
    return { label, group: getSpecGroup(label), values, differs: selected.length > 1 && new Set(normalized).size > 1 };
  });
  return groupOrder.map((key) => ({ key, rows: rows.filter((row) => row.group === key) }));
}

// 規格不同的列：淺青底＋左側色條
const diffCell = "bg-[#f2fbfc]";

export default function CompareTable({ products }: { products: CompareProduct[] }) {
  const searchParams = useSearchParams();
  const compare = useCompareList();
  const [diffOnly, setDiffOnly] = useState(false);

  // 網址有 ?items= 就用網址（可分享），沒有就用瀏覽器裡存的比較清單
  const itemsParam = searchParams.get("items");
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const slugs = itemsParam !== null ? itemsParam.split(",").map((slug) => slug.trim()) : compare.list;
  const selected = Array.from(new Set(slugs))
    .map((slug) => bySlug.get(slug))
    .filter((product): product is CompareProduct => Boolean(product))
    .slice(0, MAX_COMPARE);

  const remove = (slug: string) => {
    if (compare.has(slug)) compare.remove(slug);
    if (itemsParam !== null) {
      const next = selected.map((product) => product.slug).filter((item) => item !== slug);
      window.history.replaceState(null, "", next.length ? compareHref(next) : "/products/compare/?items=");
    }
  };

  if (selected.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-[720px] border border-brand-line bg-white px-6 py-12 text-center lg:mt-12">
        <h2 className="text-xl font-bold text-brand-navy">尚未選擇要比較的型號</h2>
        <p className="mt-3 text-base font-medium leading-relaxed text-brand-muted">
          請到產品中心勾選產品卡片左上角的「比較」（最多 {MAX_COMPARE} 件），再按「比較產品」，即可在這裡並排比較規格。
        </p>
        <Link href="/products/" className={buttonClass("primary", "md", "mt-7")}>
          前往產品中心
        </Link>
      </div>
    );
  }

  const groups = buildRows(selected)
    .map((group) => ({ ...group, rows: diffOnly ? group.rows.filter((row) => row.differs) : group.rows }))
    .filter((group) => group.rows.length > 0);
  const columnCount = selected.length + 1;

  return (
    <div className="mt-8 lg:mt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-brand-muted">
          已選 {selected.length} / {MAX_COMPARE} 個型號
          {selected.length < MAX_COMPARE ? (
            <>
              <span aria-hidden className="mx-2 text-brand-line">
                |
              </span>
              <Link href="/products/" className="font-bold text-brand-blue underline-offset-4 hover:text-brand-navy hover:underline">
                ＋ 加入其他型號
              </Link>
            </>
          ) : null}
        </p>
        {selected.length > 1 ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted">
              <span aria-hidden className={`h-4 w-6 border border-brand-line shadow-[inset_3px_0_0_#5ecbdd] ${diffCell}`} />
              底色標示的項目規格不同
            </span>
            <Checkbox
              checked={diffOnly}
              onChange={setDiffOnly}
              className="py-2 sm:py-0"
              labelClassName={`text-sm ${diffOnly ? "font-bold text-brand-navy" : "font-medium text-brand-muted"}`}
            >
              只顯示不同的規格
            </Checkbox>
          </div>
        ) : null}
      </div>

      <div className="scroll-panel mt-4 overflow-x-auto border border-brand-line">
        <table
          className="w-full table-fixed border-separate border-spacing-0 text-left"
          style={{ minWidth: `${104 + selected.length * 168}px` }}
        >
          <caption className="sr-only">型號規格比較表</caption>
          <colgroup>
            <col className="w-[104px] sm:w-[160px]" />
            {selected.map((product) => (
              <col key={product.slug} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 border-b border-r border-brand-line bg-white px-3 pb-4 align-bottom text-xs font-bold text-brand-navy sm:px-[29px]"
              >
                規格項目
              </th>
              {selected.map((product) => (
                <th
                  key={product.slug}
                  scope="col"
                  className="relative border-b border-brand-line bg-white px-3 pb-5 pt-[52px] align-top font-normal sm:px-5 sm:pt-11"
                >
                  <button
                    type="button"
                    onClick={() => remove(product.slug)}
                    aria-label={`從比較中移除 ${product.model}`}
                    className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center border border-brand-blue bg-white text-brand-blue hover:bg-brand-blue hover:text-white sm:h-8 sm:w-8"
                  >
                    <CloseLine className="h-6 w-6" />
                  </button>
                  <div className="relative mx-auto aspect-[16/10] w-full max-w-[200px]">
                    <Image
                      src={product.coverImage}
                      alt={product.name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 200px, 40vw"
                      className="object-contain"
                    />
                  </div>
                  {/* 型號、名稱保留固定高度，讓各欄的「查看產品頁」對齊 */}
                  <p
                    className={`mt-4 flex min-h-9 items-end font-bold text-brand-navy sm:min-h-10 ${modelFontClass} ${
                      isLongModel(product.model) ? "text-sm leading-[18px] sm:text-base sm:leading-5" : "text-lg leading-6 sm:text-[22px] sm:leading-[26px]"
                    }`}
                  >
                    <span className="min-w-0">
                      <ModelText model={product.model} />
                    </span>
                  </p>
                  <p className="mt-1.5 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-brand-muted">{product.cardName}</p>
                  <Link
                    href={productHref(product)}
                    className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-bold text-brand-blue hover:text-brand-navy sm:min-h-0"
                  >
                    查看產品頁
                    <ArrowRightLine className="h-4 w-4" />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-6 py-10 text-center text-sm font-medium text-brand-muted">
                  所選型號的規格項目都相同。
                </td>
              </tr>
            ) : null}
            {groups.map((group) => (
              <Fragment key={group.key}>
                <tr>
                  <th
                    colSpan={columnCount}
                    scope="colgroup"
                    className="h-[58px] border-b border-brand-line bg-brand-panel px-3 text-left text-base font-bold text-brand-navy sm:px-[29px]"
                  >
                    <span className="sticky left-3 sm:left-[29px]">{specGroupLabels[group.key]}</span>
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className={`sticky left-0 z-[1] border-b border-r border-brand-line px-3 py-3 text-xs font-medium leading-[18px] text-brand-muted sm:px-[29px] ${
                        row.differs ? `${diffCell} shadow-[inset_3px_0_0_#5ecbdd]` : "bg-white"
                      }`}
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={selected[index].slug}
                        className={`border-b border-brand-line px-3 py-3 align-top text-xs leading-[18px] sm:px-5 ${
                          row.differs ? `${diffCell} font-medium text-brand-navy` : "bg-white text-brand-muted"
                        }`}
                      >
                        {value ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selected.length === 1 ? (
        <p className="mt-5 text-sm font-medium text-brand-muted">
          再加入 1 個以上的型號，就能並排比較規格差異。
          <Link href="/products/" className="ml-1 font-bold text-brand-blue hover:text-brand-navy">
            回產品中心挑選
          </Link>
        </p>
      ) : null}
    </div>
  );
}

export function CompareTableFallback() {
  return <div aria-busy="true" className="mt-8 h-[480px] animate-pulse border border-brand-line bg-brand-panel lg:mt-12" />;
}
