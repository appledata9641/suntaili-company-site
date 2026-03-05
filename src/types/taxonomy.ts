import type { Product, ProductCategory, ProductCategoryDefinition } from "@/types/product";

export interface ProductSubcategory {
  key: string;
  name: string;
  categoryId: ProductCategory;
}

export interface ProductCategoryGroup {
  key: string;
  name: string;
  categoryIds: ProductCategory[];
}

export interface TaxonomySubcategoryNode {
  subcategory: ProductSubcategory;
  products: Product[];
}

export interface TaxonomyCategoryNode {
  category: ProductCategoryDefinition;
  subcategories: TaxonomySubcategoryNode[];
}

export interface TaxonomyGroupNode {
  group: ProductCategoryGroup;
  categories: TaxonomyCategoryNode[];
}

export interface TaxonomyMenuNode {
  key: string;
  label: string;
  productSlugs?: string[];
  children?: TaxonomyMenuNode[];
}

export interface TaxonomyMenuGroup {
  key: string;
  name: string;
  columns: TaxonomyMenuNode[];
}
