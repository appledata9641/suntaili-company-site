import type { ProductCategoryDefinition } from "@/types/product";

export const productCategories: ProductCategoryDefinition[] = [
  {
    id: "camera",
    slug: "camera",
    name: "監控攝影機",
    shortName: "攝影機",
    description: "AHD 與 IP 攝影機，支援室內外監控、夜視、防水與案場客製搭配。",
  },
  {
    id: "recorder",
    slug: "recorder",
    name: "錄影主機",
    shortName: "NVR / DVR",
    description: "提供多通道錄影、回放、儲存管理與遠端查看。",
  },
  {
    id: "accessory",
    slug: "accessory",
    name: "周邊設備",
    shortName: "周邊",
    description: "PoE 交換器、無線橋接器與影音延伸設備。",
  },
];
