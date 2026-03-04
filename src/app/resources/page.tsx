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
        <SectionHeading
          eyebrow="文件下載"
          title="產品說明書與工具軟體"
          description="此網站採靜態部署，主要提供長期不常變動的說明文件與工具軟體下載。可透過分類、類型與關鍵字快速查找。"
        />

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
          若檔案版本有更新，請先確認產品型號與版本說明再下載。若找不到對應文件，請直接與三泰利技術窗口聯繫。
        </div>

        <div className="mt-8">
          <ErrorBoundary>
            <Suspense fallback={<div className="text-sm text-slate-600">載入下載清單中...</div>}>
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
