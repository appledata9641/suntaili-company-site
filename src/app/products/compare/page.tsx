import { Suspense } from "react";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CompareTable, { CompareTableFallback } from "@/components/products/CompareTable";
import { toCompareProduct } from "@/components/products/product-summary";
import SectionTitle from "@/components/ui/SectionTitle";
import { publishedProducts } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

// 比較結果依使用者勾選而定，不需要被搜尋引擎收錄
export const metadata: Metadata = {
  ...pageMetadata({
    title: "型號比較",
    description: "並排比較三泰利監控攝影機與錄影主機的規格。",
    path: "/products/compare",
  }),
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  const products = publishedProducts.map(toCompareProduct);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-brand-panel px-4 pb-10 pt-12 lg:pb-12 lg:pt-[68px]">
          <SectionTitle
            as="h1"
            title="型號比較"
            description="並排比較所選型號的規格，規格不同的項目會以底色標示。"
            descriptionTone="muted"
          />
        </section>
        <section className="mx-auto max-w-[1108px] px-4 pb-20 lg:pb-[100px]">
          <Suspense fallback={<CompareTableFallback />}>
            <CompareTable products={products} />
          </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  );
}
