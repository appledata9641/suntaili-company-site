import type { ProductCategoryDefinition } from "@/types/product";

export const productCategories: ProductCategoryDefinition[] = [
  {
    id: "camera",
    slug: "camera",
    name: "網路攝影機",
    shortName: "攝影機",
    description: "室內外網路攝影機，支援夜視、事件偵測與遠端管理。",
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
