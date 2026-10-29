import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { ArrowRightLine } from "@/components/icons";
import { CompareActions } from "@/components/products/CompareTray";
import ProductCard from "@/components/products/ProductCard";
import { toProductSummary } from "@/components/products/product-summary";
import PageHero from "@/components/ui/PageHero";
import { buttonClass } from "@/components/ui/styles";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { productCenterCategories, productsHref } from "@/lib/catalog";
import { activeProductCategories, hasCategoryProducts } from "@/lib/product-availability";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

// 沒有產品的分類（目前是周邊設備）也輸出頁面，讓舊連結還能打開，但頁面顯示「整理中」且不給搜尋引擎收錄
export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = productCategories.find((item) => item.slug === slug);

  if (!category) {
    return pageMetadata({
      title: "找不到產品分類",
      description: "目前找不到此產品分類，請回到產品中心重新查詢。",
      path: "/categories",
    });
  }

  const metadata = pageMetadata({
    title: category.seoTitle ?? `${category.name}分類`,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
  return hasCategoryProducts(category.id) ? metadata : { ...metadata, robots: { index: false, follow: true } };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = productCategories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const products = publishedProducts.filter((product) => product.category === category.id).map(toProductSummary);
  // 主圖副標：取 SEO 標題冒號後的說明（例如「AHD 類比高清與 IP 網路攝影機」）
  const subtitle = category.seoTitle?.split("：")[1] ?? category.seoTitle ?? category.shortName;
  // 這個分類在產品中心對應的篩選（只列出有產品的）
  const centerLinks = productCenterCategories.filter((center) =>
    products.some((product) => product.centerCategory === center.key),
  );
  // 沒有產品時，改列出其他有產品的分類
  const otherCategories = activeProductCategories.filter((item) => item.id !== category.id);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <JsonLd
          id="category-breadcrumb-jsonld"
          data={breadcrumbJsonLd([
            { name: "首頁", path: "/" },
            { name: "產品分類", path: "/categories" },
            { name: category.name, path: `/categories/${category.slug}` },
          ])}
        />
        <PageHero image="/images/site/products/hero.webp" title={category.name} subtitle={subtitle} tone="light" />

        <section className="mx-auto max-w-[1022px] px-4 pb-16 pt-5 lg:pb-[93px]">
          <nav aria-label="麵包屑" className="text-sm font-medium text-brand-grey">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/" className="hover:text-brand-navy">
                  首頁
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/categories/" className="hover:text-brand-navy">
                  產品分類
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-brand-navy">
                {category.name}
              </li>
            </ol>
          </nav>

          <p className="mt-8 text-base font-medium leading-8 text-brand-muted lg:mt-10 lg:text-lg lg:leading-9">
            {category.description}
          </p>

          {products.length > 0 ? (
            <>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-12">
                <h2 className="text-xl font-bold leading-7 text-brand-navy">共 {products.length} 項產品</h2>
                <CompareActions showCount />
              </div>

              <ul className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 lg:gap-y-[13px]">
                {products.map((product, index) => (
                  <li key={product.slug} className="min-w-0">
                    <ProductCard product={product} priority={index < 4} />
                  </li>
                ))}
              </ul>

              <div className="mt-12 flex flex-col gap-4 border border-brand-line bg-brand-panel px-6 py-6 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <p className="text-base font-medium text-brand-navy">
                  {category.id === "camera" ? "想依類型、解析度或品牌篩選，請到產品中心：" : "想依品牌或型號篩選，請到產品中心："}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {centerLinks.map((center) => (
                    <Link key={center.key} href={productsHref({ category: center.key })} className={buttonClass("outline", "sm")}>
                      {center.label}
                      <ArrowRightLine className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-10 flex flex-col items-center gap-5 border border-brand-line bg-brand-panel px-6 py-12 text-center lg:mt-12 lg:py-16">
              <h2 className="text-xl font-bold leading-7 text-brand-navy">{category.name}資料整理中</h2>
              <p className="text-base font-medium leading-relaxed text-brand-muted">需要報價或確認規格，可以直接詢問三泰利。</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/inquiry/" className={buttonClass("primary", "md")}>
                  立即諮詢
                </Link>
                {otherCategories.map((item) => (
                  <Link key={item.id} href={`/categories/${item.slug}/`} className={buttonClass("outline", "md")}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
