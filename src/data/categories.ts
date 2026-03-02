import type { ProductCategoryDefinition } from "@/types/product";

export const productCategories: ProductCategoryDefinition[] = [
  {
    id: "camera",
    slug: "camera",
    name: "網路攝影機",
    shortName: "攝影機",
    description: "槍型、半球型、戶外型與網路攝影機等監控設備。",
  },
  {
    id: "recorder",
    slug: "recorder",
    name: "錄影主機",
    shortName: "錄影主機",
    description: "NVR / DVR 主機系列，支援多通道錄影、回放與遠端管理。",
  },
  {
    id: "accessory",
    slug: "accessory",
    name: "監控周邊與傳輸設備",
    shortName: "周邊/傳輸",
    description: "PoE 交換器、無線網橋、延長器、線材與監控配件。",
  },
  {
    id: "access-control",
    slug: "access-control",
    name: "門禁設備",
    shortName: "門禁",
    description: "門禁控制器、讀卡機與出入口管理整合設備。",
  },
];
