import type { MetadataRoute } from "next";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { absoluteUrl, canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/products",
  "/categories",
  "/applications",
  "/resources",
  "/inquiry",
  "/faq",
  "/about",
  "/contact",
];

// 不填 lastModified：沒有每頁真實的更新日期時，寫死的日期反而會讓 Google 忽略這個欄位。
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: canonicalUrl(route),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const categoryEntries = productCategories.map((category) => ({
    url: canonicalUrl(`/categories/${category.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productEntries = publishedProducts.map((product) => ({
    url: canonicalUrl(`/products/${product.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
    images: [absoluteUrl(product.coverImage)],
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries] as MetadataRoute.Sitemap;
}
