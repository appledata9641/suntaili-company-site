import DownloadsExplorer from "@/components/DownloadsExplorer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { downloads } from "@/data/downloads";
import { publishedProducts } from "@/data/products";
import type { DownloadType } from "@/types/download";

interface ResourcesPageProps {
  searchParams: Promise<{
    category?: string;
    type?: DownloadType | "all";
    q?: string;
  }>;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const query = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="下載中心"
          title="韌體、工具程式與安裝文件"
          description="可依產品分類、下載類型與關鍵字進行查找。已支援 URL 查詢參數分享（category / type / q），方便直接傳給客戶或同事。"
        />

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
          更新前請先確認產品型號與硬體版本，並備份設備設定。若為現場批次更新，建議先進行單機驗證後再大量更新。
        </div>

        <div className="mt-8">
          <ErrorBoundary>
            <DownloadsExplorer
              downloads={downloads}
              products={publishedProducts}
              categories={productCategories}
              initialFilters={{
                category: query.category,
                type: query.type,
                q: query.q,
              }}
            />
          </ErrorBoundary>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">版本相容提醒</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              部分韌體需對應特定硬體版本（HW Rev.），請務必確認後再更新。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">更新前備份</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              建議先匯出設定參數與截圖紀錄，避免更新後需要重新設定造成停機時間。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">技術支援</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              若找不到對應檔案或不確定版本，請至聯絡頁提供型號與目前版本資訊。
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
