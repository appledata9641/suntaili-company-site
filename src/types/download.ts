import type { ProductCategory } from "@/types/product";

export type DownloadType = "firmware" | "software" | "manual";

export interface DownloadItem {
  id: string;
  // 對應產品頁的 slug；不屬於特定產品的通用下載（例如大華 CMS）可以不填，只會出現在文件下載頁
  productSlug?: string;
  productModel: string;
  category: ProductCategory;
  type: DownloadType;
  title: string;
  version: string;
  releaseDate: string;
  fileSize: string;
  checksum?: string;
  notes?: string;
  minHwVersion?: string;
  downloadUrl: string;
}
