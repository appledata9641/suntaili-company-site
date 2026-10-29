import { downloads } from "@/data/downloads";
import { publishedProducts } from "@/data/products";
import {
  getProductCenterCategory,
  getProductForm,
  productHref,
  type ProductCenterCategoryKey,
  type ProductForm,
} from "@/lib/catalog";

// 產品型錄頁的資料：dm- 開頭的下載檔，對應到已上架的產品（未上架產品的型錄不顯示）
export interface CatalogEntry {
  id: string;
  model: string;
  // 型錄檔（PDF / 圖片），點縮圖另開分頁，「下載型錄」直接下載
  fileUrl: string;
  // 下載時的檔名（例如「AC-229D_型錄.pdf」）
  downloadName: string;
  // 檔案放在其他網站（例如 Google 雲端）時無法直接下載，改成另開分頁
  external: boolean;
  // 產品頁，點型號前往
  productUrl: string;
  image: string;
  category: ProductCenterCategoryKey;
  form: ProductForm | null;
}

function fileExtension(url: string) {
  const path = url.split(/[?#]/)[0];
  const match = /\.([a-z0-9]+)$/i.exec(path);
  return match ? match[1].toLowerCase() : "";
}

export function getCatalogEntries(): CatalogEntry[] {
  const entries: CatalogEntry[] = [];
  for (const item of downloads) {
    if (!item.id.startsWith("dm-")) continue;
    const product = publishedProducts.find((p) => p.slug === item.productSlug);
    if (!product) continue;
    const extension = fileExtension(item.downloadUrl);
    entries.push({
      id: item.id,
      model: product.model,
      fileUrl: item.downloadUrl,
      downloadName: `${product.model.replace(/[^A-Za-z0-9._-]+/g, "_")}_型錄${extension ? `.${extension}` : ""}`,
      external: /^https?:\/\//i.test(item.downloadUrl),
      productUrl: productHref(product),
      image: `/images/catalog/${item.id}.webp`,
      category: getProductCenterCategory(product),
      form: getProductForm(product),
    });
  }
  return entries.sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));
}
