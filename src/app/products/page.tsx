import { Suspense } from "react";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ModelOverview, { type ModelOverviewGroup } from "@/components/products/ModelOverview";
import ProductCenter, { ProductCenterFallback } from "@/components/products/ProductCenter";
import { toProductSummary } from "@/components/products/product-summary";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { publishedProducts } from "@/data/products";
import { activeProductCategories } from "@/lib/product-availability";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "監控攝影機、DVR／NVR 錄影主機產品中心",
  description: "三泰利產品中心提供監控攝影機、DVR／NVR 錄影主機與 VMS 軟體方案型號查詢，可依類型、解析度、品牌與型號篩選。",
  path: "/products",
});

export default function ProductsPage() {
  const summaries = publishedProducts.map(toProductSummary);
  // 型號總覽的分頁：只列出有產品的分類
  const overviewGroups: ModelOverviewGroup[] = activeProductCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    items: publishedProducts
      .filter((product) => product.category === category.id)
      .map((product) => ({ slug: product.slug, model: product.model, name: product.name })),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero
          image="/images/site/products/hero-v2.webp"
          title="產品中心"
          subtitle="根據需求快速查找所需產品"
          tone="light"
        />

        <section className="pb-16 pt-10 lg:pb-[93px] lg:pt-[68px]">
          <SectionTitle
            title="監控攝影機、DVR／NVR 錄影主機產品中心"
            description="依產品線、品牌與型號整理三泰利自有品牌與 AVTECH 等經銷產品，可快速找到目標型號。"
            descriptionTone="muted"
            className="px-4"
          />
          {/* 設計稿的篩選＋產品區左右不對稱（左 131px、右 80px） */}
          <div className="mx-auto mt-8 max-w-[1440px] px-4 sm:px-6 lg:mt-[68px] lg:px-8 min-[87.5rem]:pl-[131px] min-[87.5rem]:pr-[80px]">
            <Suspense fallback={<ProductCenterFallback total={summaries.length} />}>
              <ProductCenter products={summaries} />
            </Suspense>
          </div>
        </section>

        <section className="bg-brand-panel px-4 pb-14 pt-12 sm:px-6 lg:pb-[75px] lg:pt-[60px]">
          <SectionTitle
            title="公開產品型號總覽"
            description="依產品分類整理目前網站公開型號，方便工程採購快速查找。"
            descriptionTone="muted"
          />
          <div className="mt-8 lg:mt-[47px]">
            <ModelOverview groups={overviewGroups} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
