import Link from "next/link";
import FeatureGrid from "@/components/FeatureGrid";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { siteProfile, solutionUseCases } from "@/data/site";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <SectionHeading
              eyebrow="產品線"
              title="核心產品類別"
              description="依產品線整理，先快速確認應用方向，再進一步查看規格與文件。"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {productCategories.map((category) => {
                const count = publishedProducts.filter(
                  (product) => product.category === category.id,
                ).length;

                return (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="text-sm font-medium text-sky-700">{category.shortName}</div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{category.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{category.description}</p>
                    <div className="mt-4 text-sm text-slate-500">目前上架 {count} 項</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <FeatureGrid />

        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="文件下載"
                title="可依型號快速查找說明文件"
                description="下載中心支援分類與關鍵字查詢，方便工程端與客戶端快速取得文件。"
              />
              <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
                <li>提供說明書、規格書與工具軟體</li>
                <li>依產品型號與版本管理檔案</li>
                <li>後續可擴充為 API 與權限下載</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/resources"
                  className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  前往下載中心
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-900">下載注意事項</div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p>1. 下載前請先確認產品型號與版本資訊。</p>
                <p>2. 如為設定檔或工具，請先閱讀說明再操作。</p>
                <p>3. 若找不到對應文件，請聯絡技術窗口。</p>
                <p>4. 檔案更新時，建議先備份既有設定。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <SectionHeading
              eyebrow="應用場景"
              title="常見導入場域"
              description="依場域需求調整設備組合與架構，兼顧成本、穩定與後續維護。"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {solutionUseCases.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">需要專案建議或產品規劃？</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                歡迎提供案場需求，我們可協助你快速評估產品線與建置方向。
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {siteProfile.contact.phone} ・ {siteProfile.contact.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900"
              >
                聯絡我們
              </Link>
              <Link
                href="/products"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white"
              >
                查看產品
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
