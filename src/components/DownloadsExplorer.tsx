"use client";

import { useDeferredValue, useState } from "react";
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
}

export default function DownloadsExplorer({
  downloads,
  products,
  categories,
}: DownloadsExplorerProps) {
  const [category, setCategory] = useState<string>("all");
  const [downloadType, setDownloadType] = useState<DownloadType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

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
        <p>符合條件共 {filteredItems.length} 筆資料（依更新日期新到舊排序）</p>
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
          title="找不到符合條件的文件"
          description="請調整分類或關鍵字，或清除篩選條件後重新查詢。"
          actionLabel="重設條件"
          onAction={resetFilters}
        />
      ) : (
        <DownloadList items={filteredItems} />
      )}
    </div>
  );
}
