"use client";

import { useDeferredValue, useState } from "react";
import CategoryPills from "@/components/CategoryPills";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import type { Product, ProductCategoryDefinition } from "@/types/product";

interface ProductsCatalogProps {
  products: Product[];
  categories: ProductCategoryDefinition[];
  initialSearchTerm?: string;
}

export default function ProductsCatalog({
  products,
  categories,
  initialSearchTerm = "",
}: ProductsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
  const searchTokens = normalizedSearch.split(/\s+/).filter(Boolean);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" ? true : product.category === activeCategory;
    const matchesSearch = (() => {
      if (searchTokens.length === 0) return true;

      const searchableText = [product.name, product.model, product.shortDescription, product.tags.join(" ")]
        .join(" ")
        .toLowerCase();

      return searchTokens.every((token) => searchableText.includes(token));
    })();

    return matchesCategory && matchesSearch;
  });

  const categoryNameMap = Object.fromEntries(categories.map((category) => [category.id, category.shortName]));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-800">搜尋產品</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="輸入型號、名稱或關鍵字"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-500"
            />
          </label>
          <div className="text-sm text-slate-600 lg:pt-6">共 {filteredProducts.length} 項產品</div>
        </div>
        <div className="mt-4">
          <CategoryPills
            items={[
              { id: "all", label: "全部" },
              ...categories.map((category) => ({
                id: category.id,
                label: category.shortName,
              })),
            ]}
            activeId={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="找不到符合條件的產品"
          description="請調整分類或搜尋條件後重新查詢。"
          actionLabel="清除條件"
          onAction={() => {
            setActiveCategory("all");
            setSearchTerm("");
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryNameMap[product.category] ?? "產品"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
