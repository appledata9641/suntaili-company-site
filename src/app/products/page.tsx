import { Suspense } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductsExplorer from "@/components/ProductsExplorer";
import SectionHeading from "@/components/SectionHeading";
import { publishedProducts } from "@/data/products";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="產品中心"
          title="依需求快速找到產品"
          description="分級清單採產品線→子類→型號，可快速找到目標型號。"
        />

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                載入產品資料中...
              </div>
            }
          >
            <ProductsExplorer products={publishedProducts} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
