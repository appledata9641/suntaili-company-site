import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import BracketSection from "@/components/product-detail/BracketSection";
import CompareSection from "@/components/product-detail/CompareSection";
import DimensionSection from "@/components/product-detail/DimensionSection";
import ProductSummary from "@/components/product-detail/ProductSummary";
import SectionTabs, { type SectionTab } from "@/components/product-detail/SectionTabs";
import SpecTable from "@/components/product-detail/SpecTable";
import {
  getCompareCandidates,
  getDimensionSpec,
  getProductDownloads,
  getSpecGroups,
} from "@/components/product-detail/product-detail-data";
import { productBrands } from "@/data/brands";
import { publishedProducts } from "@/data/products";
import { getProductCategory } from "@/lib/product-content";
import { absoluteUrl, breadcrumbJsonLd, canonicalUrl, organizationId, pageMetadata } from "@/lib/seo";

type PublishedProduct = (typeof publishedProducts)[number];

// 產品名稱已含型號時不再重複加型號，避免標題出現「AC-229D ... AC-229D」
function productTitle(product: PublishedProduct) {
  return product.name.includes(product.model) ? product.name : `${product.model} ${product.name}`;
}

function productMetaDescription(product: PublishedProduct) {
  const brand = productBrands[product.brand];
  const suffix =
    brand.relationship === "distributor"
      ? `三泰利經銷 ${brand.name}，提供規格、型錄下載與批發詢價。`
      : "提供規格、型錄下載與批發詢價。";

  return `${product.shortDescription}${suffix}`;
}

export async function generateStaticParams() {
  return publishedProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = publishedProducts.find((item) => item.slug === slug);

  if (!product) {
    return pageMetadata({
      title: "找不到產品",
      description: "目前找不到此產品型號，請回到產品中心重新查詢。",
      path: "/products",
    });
  }

  const title = productTitle(product);

  return pageMetadata({
    title,
    description: productMetaDescription(product),
    path: `/products/${product.slug}`,
    image: product.coverImage,
    titleAbsolute: title.includes("三泰利"),
  });
}

function productJsonLd(product: PublishedProduct, categoryName?: string) {
  const brand = productBrands[product.brand];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    model: product.model,
    sku: product.model,
    mpn: product.model,
    brand: {
      "@type": "Brand",
      name: brand.name,
      ...(brand.alternateName ? { alternateName: brand.alternateName } : {}),
    },
    ...(brand.relationship === "own" ? { manufacturer: { "@id": organizationId } } : {}),
    category: categoryName,
    description: product.description,
    image: [absoluteUrl(product.coverImage)],
    url: canonicalUrl(`/products/${product.slug}`),
    additionalProperty: product.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = publishedProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const category = getProductCategory(product);
  const imageAlt = productTitle(product);
  const specGroups = getSpecGroups(product);
  const dimensionSpec = getDimensionSpec(product);
  const showAccessories = product.category === "camera";
  const related = getCompareCandidates(product, publishedProducts);

  // 只列出有內容的區塊
  const tabs: SectionTab[] = [
    ...(specGroups.length > 0 ? [{ id: "specs", label: "規格資訊" }] : []),
    ...(dimensionSpec ? [{ id: "dimensions", label: "產品尺寸" }] : []),
    ...(showAccessories ? [{ id: "accessories", label: "支架配件" }] : []),
    ...(related.length > 0 ? [{ id: "compare", label: "型號比較" }] : []),
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* 設計稿的中文標點是比例寬度（palt），只影響標點與假名，中文字寬不變 */}
      <main className="[font-feature-settings:'palt']">
        <JsonLd id="product-jsonld" data={productJsonLd(product, category?.name)} />
        <JsonLd
          id="product-breadcrumb-jsonld"
          data={breadcrumbJsonLd([
            { name: "首頁", path: "/" },
            { name: "產品中心", path: "/products" },
            ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
            { name: product.model, path: `/products/${product.slug}` },
          ])}
        />

        <ProductSummary product={product} imageAlt={imageAlt} downloads={getProductDownloads(product)} />

        {tabs.length > 0 ? <SectionTabs tabs={tabs} /> : null}

        {specGroups.length > 0 ? (
          <section
            id="specs"
            aria-labelledby="specs-title"
            className="mx-auto max-w-[1067px] scroll-mt-[114px]! px-4 pt-8 lg:scroll-mt-[134px]! lg:pt-[42px]"
          >
            <h2 id="specs-title" className="sr-only">
              規格資訊
            </h2>
            <SpecTable model={product.model} groups={specGroups} />
          </section>
        ) : null}

        {dimensionSpec ? <DimensionSection product={product} spec={dimensionSpec} imageAlt={imageAlt} /> : null}

        {showAccessories ? <BracketSection /> : null}

        {related.length > 0 ? (
          <CompareSection product={product} related={related} />
        ) : (
          <div className="h-16" aria-hidden="true" />
        )}
      </main>
      <Footer />
    </div>
  );
}
