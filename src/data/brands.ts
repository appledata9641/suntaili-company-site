import type { ProductBrand } from "@/types/product";

export interface BrandDefinition {
  // 結構化資料（JSON-LD）使用的品牌名稱
  name: string;
  alternateName?: string;
  // 頁面上顯示的品牌名稱
  label: string;
  relationship: "own" | "distributor";
}

export const productBrands: Record<ProductBrand, BrandDefinition> = {
  suntaili: {
    name: "Suntaili",
    alternateName: "三泰利",
    label: "三泰利 Suntaili",
    relationship: "own",
  },
  avtech: {
    name: "AVTECH",
    label: "AVTECH",
    relationship: "distributor",
  },
  dahua: {
    name: "Dahua",
    alternateName: "大華",
    label: "大華 Dahua",
    relationship: "distributor",
  },
};
