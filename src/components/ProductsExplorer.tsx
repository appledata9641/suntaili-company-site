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

  return (
    <div className="space-y-6">
      <ProductHierarchyNavigator products={products} compact initialQuery={keyword} />
    </div>
  );
}
