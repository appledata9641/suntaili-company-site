export type ProductCategory = "camera" | "recorder" | "accessory";

// suntaili = 三泰利自有品牌；avtech、dahua = 三泰利經銷的品牌
export type ProductBrand = "suntaili" | "avtech" | "dahua";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  model: string;
  brand: ProductBrand;
  category: ProductCategory;
  subcategoryKey: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery?: string[];
  featureBullets: string[];
  specs: ProductSpec[];
  tags: string[];
  published: boolean;
}

export interface ProductCategoryDefinition {
  id: ProductCategory;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  // 分類頁的 <title>，沒填就用「{name}分類」
  seoTitle?: string;
}
