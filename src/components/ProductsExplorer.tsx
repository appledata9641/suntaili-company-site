"use client";

import { useSearchParams } from "next/navigation";
import ProductHierarchyNavigator from "@/components/ProductHierarchyNavigator";
import type { Product } from "@/types/product";

interface ProductsExplorerProps {
  products: Product[];
}

export default function ProductsExplorer({ products }: ProductsExplorerProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const kseq = searchParams.get("kseq") ?? "";
  const resetKey = `${keyword}::${kseq}`;

  return (
    <div className="space-y-6">
      <ProductHierarchyNavigator key={resetKey} products={products} compact initialQuery={keyword} />
    </div>
  );
}
