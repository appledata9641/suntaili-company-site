"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DownloadFilters from "@/components/DownloadFilters";
import DownloadList from "@/components/DownloadList";
import EmptyState from "@/components/EmptyState";
import { DownloadListSkeleton } from "@/components/LoadingSkeletons";
import { sortDownloadsByDateDesc } from "@/lib/downloads";
import type { DownloadItem, DownloadType } from "@/types/download";
import type { Product, ProductCategoryDefinition } from "@/types/product";

interface DownloadsExplorerProps {
  downloads: DownloadItem[];
  products: Product[];
  categories: ProductCategoryDefinition[];
  initialFilters?: Partial<DownloadFilterState>;
}

type DownloadFilterState = {
  category: string;
  type: DownloadType | "all";
  q: string;
};

const VALID_TYPES = new Set<DownloadType | "all">([
  "all",
  "firmware",
  "software",
  "manual",
]);

function buildQueryString(filters: DownloadFilterState) {
  const params = new URLSearchParams();
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.q.trim()) params.set("q", filters.q.trim());
  return params.toString();
}

export default function DownloadsExplorer({
  downloads,
  products,
  categories,
  initialFilters,
}: DownloadsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const validCategoryIds = new Set<string>(categories.map((c) => c.id));

  const sanitizedInitial: DownloadFilterState = {
    category:
      initialFilters?.category &&
      (initialFilters.category === "all" || validCategoryIds.has(initialFilters.category))
        ? initialFilters.category
        : "all",
    type:
      initialFilters?.type && VALID_TYPES.has(initialFilters.type)
        ? initialFilters.type
        : "all",
    q: initialFilters?.q ?? "",
  };

  const [category, setCategory] = useState<string>(sanitizedInitial.category);
  const [downloadType, setDownloadType] = useState<DownloadType | "all">(sanitizedInitial.type);
  const [searchTerm, setSearchTerm] = useState(sanitizedInitial.q);

  useEffect(() => {
    const nextQuery = buildQueryString({ category, type: downloadType, q: searchTerm });
    const currentQuery =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).toString()
        : "";

    if (nextQuery === currentQuery) return;

    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    });
  }, [category, downloadType, searchTerm, pathname, router]);

  const deferredSearch = useDeferredValue(searchTerm).trim().toLowerCase();
  const isSearching = deferredSearch !== searchTerm.trim().toLowerCase();
  const productNameMap = Object.fromEntries(products.map((p) => [p.slug, p.name]));

  const filteredItems = sortDownloadsByDateDesc(downloads)
    .filter((item) => (category === "all" ? true : item.category === category))
    .filter((item) => (downloadType === "all" ? true : item.type === downloadType))
    .filter((item) => {
      if (!deferredSearch) return true;
      return [
        item.title,
        item.version,
        item.productModel,
        productNameMap[item.productSlug] ?? "",
        item.notes ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch);
    })
    .map((item) => ({
      ...item,
      productName: productNameMap[item.productSlug] ?? item.productModel,
    }));

  const resetFilters = () => {
    setCategory("all");
    setDownloadType("all");
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <DownloadFilters
        categoryOptions={[
          { id: "all", label: "全部分類" },
          ...categories.map((categoryItem) => ({
            id: categoryItem.id,
            label: categoryItem.name,
          })),
        ]}
        activeCategory={category}
        onCategoryChange={setCategory}
        activeType={downloadType}
        onTypeChange={setDownloadType}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <p>符合條件共 {filteredItems.length} 筆下載項目（依更新日期新到舊排序）</p>
        <div className="flex flex-wrap gap-2">
          {(category !== "all" || downloadType !== "all" || searchTerm) && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:border-slate-400"
            >
              清除篩選
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
              } catch {
                // Ignore clipboard failures in unsupported environments.
              }
            }}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:border-slate-400"
          >
            複製目前查詢連結
          </button>
        </div>
      </div>

      {isSearching ? (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            <span className="text-sm text-slate-600">搜尋中...</span>
          </div>
          <DownloadListSkeleton />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="找不到符合條件的下載項目"
          description="請確認型號或關鍵字是否正確，或改用其他分類/類型條件查找。"
          actionLabel="重設條件"
          onAction={resetFilters}
        />
      ) : (
        <DownloadList items={filteredItems} />
      )}
    </div>
  );
}
