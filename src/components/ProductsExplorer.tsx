"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductHierarchyNavigator from "@/components/ProductHierarchyNavigator";
import ProductsCatalog from "@/components/ProductsCatalog";
import type { Product, ProductCategoryDefinition } from "@/types/product";

interface ProductsExplorerProps {
  products: Product[];
  categories: ProductCategoryDefinition[];
}

export default function ProductsExplorer({ products, categories }: ProductsExplorerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "hierarchy">("grid");
  const searchParams = useSearchParams();

  const initialKeyword = useMemo(() => {
    return (searchParams.get("keyword") ?? "").trim();
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setViewMode("grid")}
          className={
            viewMode === "grid"
              ? "rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
              : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
          }
        >
          平鋪卡片
        </button>
        <button
          type="button"
          onClick={() => setViewMode("hierarchy")}
          className={
            viewMode === "hierarchy"
              ? "rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
              : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
          }
        >
          分級清單
        </button>
      </div>

      {viewMode === "grid" ? (
        <ProductsCatalog
          key={`grid-${initialKeyword}`}
          products={products}
          categories={categories}
          initialSearchTerm={initialKeyword}
        />
      ) : (
        <ProductHierarchyNavigator products={products} compact />
      )}
    </div>
  );
}
