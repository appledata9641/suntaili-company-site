"use client";

import ProductHierarchyNavigator from "@/components/ProductHierarchyNavigator";
import type { Product } from "@/types/product";

interface ProductsExplorerProps {
  products: Product[];
}

export default function ProductsExplorer({ products }: ProductsExplorerProps) {
  return (
    <div className="space-y-6">
      <ProductHierarchyNavigator products={products} compact />
    </div>
  );
}
