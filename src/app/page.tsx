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
              title="核心安防產品分類"
              description="以產品線方式整理，方便後續串接下載中心與版本管理。客戶可以先找產品，再查看對應韌體與文件。"
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
                    <div className="mt-4 text-sm text-slate-500">目前展示 {count} 項產品</div>
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
                eyebrow="下載中心"
                title="依產品型號快速查找韌體與文件"
                description="第一版前端已建立分類、搜尋與列表檢視，後續可直接接後端 API 與檔案儲存服務。"
              />
              <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
                <li>支援依產品分類篩選（攝影機 / 錄影主機 / 周邊 / 門禁）</li>
                <li>支援依型號、版本、檔名關鍵字搜尋</li>
                <li>可擴充下載權限、簽名網址與版本控管流程</li>
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
              <div className="text-sm font-medium text-slate-900">下載前提醒</div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p>1. 先確認設備完整型號與硬體版本（HW Rev.）。</p>
                <p>2. 更新前請備份重要設定與匯出參數檔。</p>
                <p>3. 若為專案現場批次更新，建議先做單機驗證。</p>
                <p>4. 若不確定版本相容性，請先聯絡技術支援。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <SectionHeading
              eyebrow="應用場景"
              title="常見導入場域"
              description="此區塊先作為簡版展示，後續若需要可再擴充成完整解決方案頁。"
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
              <h2 className="text-2xl font-semibold text-white">需要技術協助或產品建議？</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                歡迎提供專案場域與需求，我們可協助規劃產品組合與下載/升級流程建議。
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
                查看產品中心
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
