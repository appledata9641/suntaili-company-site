import type { MetadataRoute } from "next";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { canonicalUrl } from "@/lib/seo";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-28T00:00:00+08:00");

  const staticEntries = staticRoutes.map((route) => ({
    url: canonicalUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const categoryEntries = productCategories.map((category) => ({
    url: canonicalUrl(`/categories/${category.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productEntries = publishedProducts.map((product) => ({
    url: canonicalUrl(`/products/${product.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries] as MetadataRoute.Sitemap;
}
