import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import DownloadsExplorer from "@/components/DownloadsExplorer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { downloads } from "@/data/downloads";
import { publishedProducts } from "@/data/products";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading eyebrow="文件下載" title="產品說明書與工具軟體" />

        <div className="mt-8">
          <ErrorBoundary>
            <Suspense fallback={<div className="text-sm text-slate-600">載入下載資料中...</div>}>
              <DownloadsExplorer
                downloads={downloads}
                products={publishedProducts}
                categories={productCategories}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
    </div>
  );
}
