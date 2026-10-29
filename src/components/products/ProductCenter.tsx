"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowDropDownLine, ArrowDropRightLine, CloseLine } from "@/components/icons";
import Checkbox from "@/components/ui/Checkbox";
import Dropdown, { type DropdownOption } from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";
import { buttonClass } from "@/components/ui/styles";
import {
  brandLabels,
  productCenterCategories,
  productForms,
  productResolutions,
  productsHref,
  type ProductCenterCategoryKey,
  type ProductForm,
  type ProductResolution,
} from "@/lib/catalog";
import { MAX_COMPARE } from "@/lib/compare";
import type { ProductBrand } from "@/types/product";
import CompareTray, { CompareActions } from "./CompareTray";
import ProductCard from "./ProductCard";
import { matchesSearch, searchTokens, type ProductSummary } from "./product-summary";

const PAGE_SIZE = 12;

type CategoryValue = ProductCenterCategoryKey | "all";

// 產品類別選單：只列出目前有產品的分類（例如週邊配件還沒有產品就先不列）
function categoryOptionsFor(products: ProductSummary[]): DropdownOption<CategoryValue>[] {
  return [
    { value: "all", label: "全部產品" },
    ...productCenterCategories
      .filter((category) => products.some((product) => product.centerCategory === category.key))
      .map((category) => ({ value: category.key, label: category.label })),
  ];
}

// 這些分類才顯示「類型／影像解析度」篩選
const attributeCategories: CategoryValue[] = ["all", "ahd-camera", "ip-camera"];
const brandKeys = Object.keys(brandLabels) as ProductBrand[];

interface Filters {
  category: CategoryValue;
  forms: ProductForm[];
  resolutions: ProductResolution[];
  brand: ProductBrand | null;
  keyword: string;
  page: number;
}

const emptyFilters: Filters = { category: "all", forms: [], resolutions: [], brand: null, keyword: "", page: 1 };

function pickList<T extends string>(value: string | null, allowed: readonly T[]): T[] {
  if (!value) return [];
  const items = value.split(",").map((item) => item.trim());
  return allowed.filter((item) => items.includes(item));
}

// 讀取網址參數（格式與 productsHref 相同，另加 page）；選單上沒有的分類視為「全部產品」
function parseFilters(params: { get(name: string): string | null }, categoryOptions: DropdownOption<CategoryValue>[]): Filters {
  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const page = Number.parseInt(params.get("page") ?? "", 10);
  return {
    category: categoryOptions.find((option) => option.value === category)?.value ?? "all",
    forms: pickList(params.get("form"), productForms),
    resolutions: pickList(params.get("res"), productResolutions),
    brand: brandKeys.find((key) => key === brand) ?? null,
    keyword: params.get("keyword") ?? "",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

function filtersHref(filters: Filters) {
  const href = productsHref({
    category: filters.category === "all" ? undefined : filters.category,
    form: filters.forms.length ? filters.forms : undefined,
    res: filters.resolutions.length ? filters.resolutions : undefined,
    brand: filters.brand ?? undefined,
    keyword: filters.keyword.trim() || undefined,
  });
  if (filters.page <= 1) return href;
  return `${href}${href.includes("?") ? "&" : "?"}page=${filters.page}`;
}

function readUrlFilters(categoryOptions: DropdownOption<CategoryValue>[]) {
  return parseFilters(new URLSearchParams(window.location.search), categoryOptions);
}

// 篩選條件寫回網址：用 history.replaceState（Next.js 會同步 useSearchParams），
// 不新增瀏覽紀錄、不捲動頁面，也不會為了換參數重新向伺服器要資料
function writeUrlFilters(filters: Filters) {
  window.history.replaceState(null, "", filtersHref(filters));
}

interface ProductCenterProps {
  products: ProductSummary[];
}

export default function ProductCenter({ products }: ProductCenterProps) {
  const searchParams = useSearchParams();
  const categoryOptions = categoryOptionsFor(products);
  const filters = parseFilters(searchParams, categoryOptions);
  const searchId = useId();
  const listTopRef = useRef<HTMLParagraphElement>(null);
  const keywordTimer = useRef<number | null>(null);

  // 搜尋框：輸入時立即篩選，停止輸入 300ms 後才寫回網址
  const [query, setQuery] = useState(filters.keyword);
  const [urlKeyword, setUrlKeyword] = useState(filters.keyword);
  const [writtenKeyword, setWrittenKeyword] = useState(filters.keyword);
  if (filters.keyword !== urlKeyword) {
    setUrlKeyword(filters.keyword);
    // 不是自己寫入的關鍵字（例如點了選單上的「三泰利 4路」）就帶進搜尋框
    if (filters.keyword !== writtenKeyword) {
      setQuery(filters.keyword);
      setWrittenKeyword(filters.keyword);
    }
  }
  const deferredQuery = useDeferredValue(query);

  const [openGroups, setOpenGroups] = useState({ form: true, res: true });

  useEffect(() => {
    return () => {
      if (keywordTimer.current) window.clearTimeout(keywordTimer.current);
    };
  }, []);

  const showAttributes = attributeCategories.includes(filters.category);
  const tokens = searchTokens(deferredQuery);
  const filtered = products.filter((product) => {
    if (filters.category !== "all" && product.centerCategory !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (showAttributes && filters.forms.length > 0 && !(product.form && filters.forms.includes(product.form))) return false;
    if (
      showAttributes &&
      filters.resolutions.length > 0 &&
      !(product.resolution && filters.resolutions.includes(product.resolution))
    ) {
      return false;
    }
    return matchesSearch(product, tokens);
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters =
    filters.category !== "all" ||
    filters.brand !== null ||
    filters.forms.length > 0 ||
    filters.resolutions.length > 0 ||
    query.trim() !== "";

  const commitKeyword = (value: string) => {
    const keyword = value.trim();
    setWrittenKeyword(keyword);
    writeUrlFilters({ ...readUrlFilters(categoryOptions), keyword, page: 1 });
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    if (keywordTimer.current) window.clearTimeout(keywordTimer.current);
    // 換關鍵字時先回到第 1 頁
    const current = readUrlFilters(categoryOptions);
    if (current.page > 1) writeUrlFilters({ ...current, page: 1 });
    keywordTimer.current = window.setTimeout(() => commitKeyword(value), 300);
  };

  const update = (patch: Partial<Filters>) => {
    writeUrlFilters({ ...readUrlFilters(categoryOptions), page: 1, ...patch });
  };

  const onCategoryChange = (category: CategoryValue) => {
    const current = readUrlFilters(categoryOptions);
    const keep = attributeCategories.includes(category);
    writeUrlFilters({
      ...current,
      category,
      forms: keep ? current.forms : [],
      resolutions: keep ? current.resolutions : [],
      page: 1,
    });
  };

  const toggleForm = (form: ProductForm, checked: boolean) => {
    const current = readUrlFilters(categoryOptions).forms;
    const next = checked ? [...current, form] : current.filter((item) => item !== form);
    update({ forms: productForms.filter((item) => next.includes(item)) });
  };

  const toggleResolution = (resolution: ProductResolution, checked: boolean) => {
    const current = readUrlFilters(categoryOptions).resolutions;
    const next = checked ? [...current, resolution] : current.filter((item) => item !== resolution);
    update({ resolutions: productResolutions.filter((item) => next.includes(item)) });
  };

  const clearAll = () => {
    if (keywordTimer.current) window.clearTimeout(keywordTimer.current);
    setQuery("");
    setWrittenKeyword("");
    writeUrlFilters(emptyFilters);
  };

  const onPageChange = (next: number) => {
    update({ page: next });
    // 換頁後回到產品列表上方，並把焦點移到「共 N 項產品」方便鍵盤與報讀軟體使用者
    listTopRef.current?.scrollIntoView({ block: "start" });
    listTopRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      {/* 快速搜尋 */}
      <div className="grid gap-2 lg:grid-cols-[216px_minmax(0,1fr)] lg:items-center lg:gap-0 min-[87.5rem]:grid-cols-[239px_minmax(0,1fr)]">
        <label
          htmlFor={searchId}
          className="whitespace-nowrap text-base font-bold text-brand-navy lg:pl-[7px] min-[87.5rem]:text-lg"
        >
          快速搜尋分類 / 品牌 / 型號
        </label>
        <div>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (keywordTimer.current) window.clearTimeout(keywordTimer.current);
                commitKeyword(query);
              }
            }}
            placeholder="搜尋分類 / 品牌 / 型號"
            autoComplete="off"
            enterKeyHint="search"
            className="h-10 w-full rounded-[3px] border border-brand-grey bg-white px-3 text-base font-medium text-brand-navy placeholder:font-medium placeholder:text-brand-grey hover:border-brand-blue focus:border-brand-blue focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-navy lg:h-[34px] lg:text-sm"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:mt-[63px] lg:grid-cols-[184px_minmax(0,1fr)] lg:gap-x-8 min-[87.5rem]:gap-x-[55px]">
        {/* 左側篩選 */}
        <aside aria-label="篩選條件" className="min-w-0">
          <p className="text-lg font-bold leading-[26px] text-brand-navy lg:pl-[7px]">產品類別</p>
          <Dropdown
            value={filters.category}
            options={categoryOptions}
            onChange={onCategoryChange}
            ariaLabel="產品類別"
            listTextClassName="text-base"
            className="mt-3 w-full [&>button]:h-10 [&>button]:pl-[21px] [&>button]:text-base lg:mt-[15px] lg:[&>button]:h-[34px]"
          />

          {showAttributes ? (
            <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-1">
              <FilterGroup
                title="類型"
                open={openGroups.form}
                onToggle={() => setOpenGroups((groups) => ({ ...groups, form: !groups.form }))}
              >
                {productForms.map((form) => {
                  const checked = filters.forms.includes(form);
                  return (
                    <Checkbox
                      key={form}
                      checked={checked}
                      onChange={(value) => toggleForm(form, value)}
                      className="py-2 lg:py-0"
                      labelClassName={`text-base font-medium leading-[25.6px] ${checked ? "text-brand-navy" : "text-brand-blue"}`}
                    >
                      {form}
                    </Checkbox>
                  );
                })}
              </FilterGroup>
              <FilterGroup
                title="影像解析度"
                open={openGroups.res}
                onToggle={() => setOpenGroups((groups) => ({ ...groups, res: !groups.res }))}
              >
                {productResolutions.map((resolution) => {
                  const checked = filters.resolutions.includes(resolution);
                  return (
                    <Checkbox
                      key={resolution}
                      checked={checked}
                      onChange={(value) => toggleResolution(resolution, value)}
                      className="py-2 lg:py-0"
                      labelClassName={`text-base font-medium leading-[25.6px] ${checked ? "text-brand-navy" : "text-brand-blue"}`}
                    >
                      {resolution}
                    </Checkbox>
                  );
                })}
              </FilterGroup>
            </div>
          ) : null}
        </aside>

        {/* 右側：比較清單與產品列表 */}
        <div className="min-w-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-sm font-medium leading-[26px] text-brand-muted">
              對比商品 從以下目錄中選擇最多 {MAX_COMPARE} 件商品。
            </p>
            <CompareActions />
          </div>
          <div className="mt-3 lg:mt-5">
            <CompareTray products={products} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 lg:mt-[29px]">
            <p
              ref={listTopRef}
              id="product-list"
              tabIndex={-1}
              aria-live="polite"
              className="text-xl font-bold leading-7 text-brand-navy outline-none"
            >
              共 {filtered.length} 項產品
            </p>
            {filters.brand ? (
              <button
                type="button"
                onClick={() => update({ brand: null })}
                aria-label={`移除品牌條件：${brandLabels[filters.brand]}`}
                className="inline-flex h-10 items-center gap-1 rounded-[3px] border border-brand-blue bg-white pl-2.5 pr-1.5 text-sm font-medium text-brand-blue hover:bg-brand-panel sm:h-8"
              >
                品牌：{brandLabels[filters.brand]}
                <CloseLine className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {filtered.length > 0 ? (
            <>
              <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:mt-6 lg:grid-cols-3 lg:gap-y-[13px] xl:grid-cols-4">
                {pageItems.map((product, index) => (
                  <li key={product.slug} className="min-w-0">
                    <ProductCard product={product} priority={index < 4} />
                  </li>
                ))}
              </ul>
              <Pagination className="mt-8 lg:mt-[37px]" page={page} pageCount={pageCount} onChange={onPageChange} />
            </>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-5 border border-brand-line bg-brand-panel px-6 py-12 text-center lg:mt-6 lg:py-16">
              <p className="text-base font-medium leading-relaxed text-brand-muted">
                目前網站尚未刊登符合條件的產品，歡迎直接詢問。
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/inquiry/" className={buttonClass("primary", "md")}>
                  立即諮詢
                </Link>
                {hasFilters ? (
                  <button type="button" onClick={clearAll} className={buttonClass("outline", "md")}>
                    清除篩選條件
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface FilterGroupProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

// 可收合的篩選群組（類型、影像解析度）
function FilterGroup({ title, open, onToggle, children }: FilterGroupProps) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={`${id}-title`} className="lg:pl-[7px]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="flex h-10 w-full items-center justify-between text-lg font-bold text-brand-navy hover:text-brand-blue lg:h-[26px] lg:w-[140px]"
      >
        <span id={`${id}-title`}>{title}</span>
        <ArrowDropDownLine className={`h-6 w-6 text-brand-blue transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      <div
        id={`${id}-panel`}
        hidden={!open}
        className="mt-1 flex flex-wrap gap-x-6 lg:mt-[5px] lg:flex-col lg:flex-nowrap lg:gap-x-0"
      >
        {children}
      </div>
    </div>
  );
}

// 網址參數讀到之前（靜態 HTML）先顯示的版面骨架，避免頁面跳動
export function ProductCenterFallback({ total }: { total: number }) {
  return (
    <div aria-busy="true">
      <div className="grid gap-2 lg:grid-cols-[216px_minmax(0,1fr)] lg:items-center lg:gap-0 min-[87.5rem]:grid-cols-[239px_minmax(0,1fr)]">
        <p className="whitespace-nowrap text-base font-bold text-brand-navy lg:pl-[7px] min-[87.5rem]:text-lg">
          快速搜尋分類 / 品牌 / 型號
        </p>
        <div className="flex h-10 items-center rounded-[3px] border border-brand-grey bg-white pl-3 text-base font-medium text-brand-grey lg:h-[34px] lg:text-sm">
          搜尋分類 / 品牌 / 型號
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:mt-[63px] lg:grid-cols-[184px_minmax(0,1fr)] lg:gap-x-8 min-[87.5rem]:gap-x-[55px]">
        <div>
          <p className="text-lg font-bold leading-[26px] text-brand-navy lg:pl-[7px]">產品類別</p>
          <div className="mt-3 flex h-10 items-center justify-between rounded-[3px] border border-brand-grey pl-[21px] pr-2 text-base font-medium text-brand-blue lg:mt-[15px] lg:h-[34px]">
            全部產品
            <ArrowDropRightLine className="h-5 w-5" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium leading-[26px] text-brand-muted">對比商品 從以下目錄中選擇最多 {MAX_COMPARE} 件商品。</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:mt-5">
            {Array.from({ length: MAX_COMPARE }, (_, index) => (
              <div
                key={index}
                className={`min-h-[72px] border border-brand-line sm:min-h-[120px] ${index > 0 ? "hidden sm:block" : "col-span-2 sm:col-span-1"}`}
              />
            ))}
          </div>
          <p className="mt-8 text-xl font-bold leading-7 text-brand-navy lg:mt-[29px]">共 {total} 項產品</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:mt-6 lg:grid-cols-3 lg:gap-y-[13px] xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="h-[240px] animate-pulse border border-brand-line bg-brand-panel sm:h-[322px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
