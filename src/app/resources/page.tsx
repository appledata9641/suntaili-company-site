import { Suspense } from "react";
import type { Metadata } from "next";
import ErrorBoundary from "@/components/ErrorBoundary";
import DownloadsExplorer from "@/components/DownloadsExplorer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { downloads } from "@/data/downloads";
import { publishedProducts } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

const resourceDownloads = downloads.filter((item) => !item.id.startsWith("dm-"));

export const metadata: Metadata = pageMetadata({
  title: "文件下載",
  description: "下載三泰利監控系統工具軟體、VMS 說明書與產品操作文件，產品 DM 請至各型號頁查看。",
  path: "/resources",
});

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
                downloads={resourceDownloads}
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
