import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { getProductCenterCategory, productCenterCategories, type ProductCenterCategoryKey } from "@/lib/catalog";
import type { ProductCategory } from "@/types/product";

// 依目前刊登的產品判斷哪些分類有產品。
// 沒有產品的分類（目前是週邊配件）先不顯示在選單、頁尾、首頁、產品中心與分類頁；
// 之後在 src/data/products.ts 加入該分類的產品，重新建置後就會自動出現。
// 注意：這個檔案會載入完整產品資料，只能在伺服器端（頁面、Header、Footer）使用，不要在 "use client" 元件裡 import。

// 產品中心的分類（AHD攝影機、DVR錄影機…週邊配件）
export const activeCenterCategoryKeys: ProductCenterCategoryKey[] = productCenterCategories
  .filter((category) => publishedProducts.some((product) => getProductCenterCategory(product) === category.key))
  .map((category) => category.key);

export function hasCenterCategoryProducts(key: ProductCenterCategoryKey) {
  return activeCenterCategoryKeys.includes(key);
}

// 產品分類頁的分類（監控攝影機、錄影主機、軟體方案、周邊設備）
export const activeProductCategories = productCategories.filter((category) =>
  publishedProducts.some((product) => product.category === category.id),
);

export function hasCategoryProducts(id: ProductCategory) {
  return activeProductCategories.some((category) => category.id === id);
}
