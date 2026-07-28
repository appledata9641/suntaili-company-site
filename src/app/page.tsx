import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { siteProfile, solutionUseCases } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

const b2bStrengths = [
  {
    title: "監控器材批發配貨",
    description: "依案場需求協助搭配攝影機、錄影主機、PoE、線材與周邊設備。",
  },
  {
    title: "AHD 攝影機組裝客製",
    description: "可依解析度、外型、鏡頭焦距、夜視距離與安裝環境討論配置。",
  },
  {
    title: "弱電整合技術支援",
    description: "協助系統整合商與經銷商確認相容性、替代型號與售後維護方向。",
  },
];

const cooperationSteps = [
  "提供案場需求或採購清單",
  "確認產品型號、數量與搭配方式",
  "回覆報價、交期與可替代方案",
  "出貨後提供必要技術文件與支援",
];

export const metadata: Metadata = pageMetadata({
  title: "三泰利企業有限公司 B2B 安防監控與 AHD 客製",
  description:
    "三泰利企業有限公司提供監控器材批發、AHD 攝影機組裝客製、NVR/DVR、PoE、門禁與弱電整合支援。",
  path: "/",
});

export default function Home() {
  const categorySummaries = productCategories.map((category) => ({
    ...category,
    count: publishedProducts.filter((product) => product.category === category.id).length,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section
          className="border-b border-slate-900 bg-slate-950"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.76) 52%, rgba(15,23,42,0.38) 100%), url('/images/home-hero.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-10 md:min-h-[620px] md:py-16">
            <div className="max-w-3xl pb-10">
              <p className="inline-flex rounded-full border border-cyan-200/40 bg-slate-900/50 px-3 py-1 text-xs font-medium text-cyan-100">
                B2B 安防監控、監控器材批發與 AHD 客製組裝
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {siteProfile.companyName}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100 md:text-lg">
                提供系統整合商、弱電工程商與經銷夥伴監控器材配貨、AHD 攝影機組裝客製、NVR/DVR、PoE、門禁周邊與技術支援。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/inquiry"
                  className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                >
                  詢價與合作
                </Link>
                <Link
                  href="/products"
                  className="rounded-full border border-white/50 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/15"
                >
                  查看產品中心
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <SectionHeading
              eyebrow="產品分類"
              title="從案場需求快速找到產品"
              description="依攝影機、錄影主機與弱電周邊整理型號，方便工程與採購快速比對需求。"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {categorySummaries.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:border-slate-300 hover:bg-white"
                >
                  <div className="text-sm font-semibold text-slate-950">{category.name}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
                  <div className="mt-5 text-xs font-medium text-slate-500">
                    {category.count} 個公開型號
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="工廠直營與客製"
              title="面向工程與通路的穩定供貨支援"
              description="網站不做購物車與零售結帳，重點放在型號查詢、文件下載、案場詢價與合作溝通。"
            />
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {b2bStrengths.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="經銷與專案"
                title="系統整合商與經銷商合作流程"
                description="適合大量採購、專案配貨、替代型號確認、既有案場升級與售後文件支援。"
              />
              <ol className="mt-8 grid gap-3">
                {cooperationSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-7 text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <SectionHeading
                eyebrow="應用場域"
                title="常見監控與弱電配置情境"
                description="依現場環境、距離、供電與既有設備，確認更合適的產品組合。"
              />
              <div className="mt-8 grid gap-4">
                {solutionUseCases.map((useCase) => (
                  <Link
                    key={useCase.title}
                    href="/applications"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:bg-white"
                  >
                    <h3 className="text-sm font-semibold text-slate-950">{useCase.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{useCase.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex rounded-full border border-cyan-200/40 px-3 py-1 text-xs font-medium text-cyan-100">
                技術文件與售後支援
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                查型號、拿文件、確認案場搭配
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                產品頁保留型號、規格、適用場域、相容性與下載文件；文件下載頁整理工具軟體與操作說明書。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <Link
                href="/resources"
                className="rounded-full border border-white/50 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                文件下載
              </Link>
              <Link
                href="/inquiry"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                提出詢價
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
