import type { ProductCategory } from "@/types/product";

export type DownloadType = "firmware" | "software" | "manual";

export interface DownloadItem {
  id: string;
  productSlug: string;
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
