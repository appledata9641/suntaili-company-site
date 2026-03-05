export type ProductCategory =
  | "camera"
  | "recorder"
  | "accessory"
  | "access-control";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  model: string;
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
}
