import { productCategories } from "@/data/categories";
import { downloads as rawDownloads } from "@/data/downloads";
import { products as rawProducts } from "@/data/products";
import { sortDownloadsByDateDesc } from "@/lib/downloads";
import type { DownloadItem, DownloadType } from "@/types/download";
import type { Product } from "@/types/product";

function parseFileSizeToBytes(fileSize: string) {
  const match = fileSize.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
  if (!match) return null;
  const value = Number.parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const unitFactor: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  };
  return Math.round(value * (unitFactor[unit] ?? 1));
}

export interface ProductListQuery {
  category?: string;
  q?: string;
  published?: boolean;
}

export interface DownloadListQuery {
  category?: string;
  type?: DownloadType | "all";
  q?: string;
  productSlug?: string;
}

export function listCategories() {
  return productCategories;
}

export function listProducts(query: ProductListQuery = {}) {
  const q = (query.q ?? "").trim().toLowerCase();

  return rawProducts.filter((product) => {
    if (query.published != null && product.published !== query.published) return false;
    if (query.category && query.category !== "all" && product.category !== query.category) return false;
    if (!q) return true;
    return [
      product.name,
      product.model,
      product.shortDescription,
      product.description,
      product.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}

export function getProductBySlug(slug: string) {
  return rawProducts.find((product) => product.slug === slug) ?? null;
}

export function listDownloads(query: DownloadListQuery = {}) {
  const q = (query.q ?? "").trim().toLowerCase();

  return sortDownloadsByDateDesc(rawDownloads)
    .filter((item) =>
      query.category && query.category !== "all" ? item.category === query.category : true,
    )
    .filter((item) => (query.type && query.type !== "all" ? item.type === query.type : true))
    .filter((item) => (query.productSlug ? item.productSlug === query.productSlug : true))
    .filter((item) => {
      if (!q) return true;
      const product = getProductBySlug(item.productSlug);
      return [item.title, item.version, item.productModel, item.notes ?? "", product?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
}

export function getDownloadById(id: string) {
  return rawDownloads.find((item) => item.id === id) ?? null;
}

export function serializeProductSummary(product: Product) {
  const category = productCategories.find((item) => item.id === product.category);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    model: product.model,
    category: product.category,
    categoryName: category?.name ?? product.category,
    shortDescription: product.shortDescription,
    coverImage: product.coverImage,
    tags: product.tags,
    published: product.published,
  };
}

export function serializeProductDetail(product: Product) {
  const category = productCategories.find((item) => item.id === product.category);
  return {
    ...serializeProductSummary(product),
    description: product.description,
    featureBullets: product.featureBullets,
    specs: product.specs,
    gallery: product.gallery ?? [],
    categoryDescription: category?.description ?? null,
  };
}

export function serializeDownloadSummary(item: DownloadItem) {
  const product = getProductBySlug(item.productSlug);
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    version: item.version,
    releaseDate: item.releaseDate,
    fileSize: item.fileSize,
    fileSizeBytes: parseFileSizeToBytes(item.fileSize),
    checksum: item.checksum ?? null,
    notes: item.notes ?? null,
    minHwVersion: item.minHwVersion ?? null,
    product: product
      ? {
          id: product.id,
          slug: product.slug,
          name: product.name,
          model: product.model,
          category: product.category,
        }
      : {
          id: null,
          slug: item.productSlug,
          name: item.productModel,
          model: item.productModel,
          category: item.category,
        },
  };
}

export function serializeDownloadDetail(item: DownloadItem) {
  return {
    ...serializeDownloadSummary(item),
    downloadUrl: item.downloadUrl,
  };
}
