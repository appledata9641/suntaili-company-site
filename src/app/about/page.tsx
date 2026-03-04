import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { siteProfile } from "@/data/site";

const strengths = [
  {
    title: "工程導向支援",
    description: "依案場條件提供設備組合建議與部署重點，降低導入風險。",
  },
  {
    title: "文件維運流程",
    description: "以型號與版本管理文件，協助現場快速排查與交接。",
  },
  {
    title: "穩定供應策略",
    description: "聚焦常用產品線，提升供貨與後續維護的一致性。",
  },
  {
    title: "B2B 合作經驗",
    description: "熟悉商辦、工廠與社區案件流程，重視交期與維運可行性。",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="關於我們"
          title={`${siteProfile.companyName}`}
          description="我們專注於安防監控與弱電整合，提供產品規劃、技術支援與文件服務，協助企業客戶建立穩定可維運的監控系統。"
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">公司定位</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {siteProfile.companyName}
                以 B2B 市場為主，長期投入監控、錄影主機、門禁與周邊設備整合。第一階段網站以產品展示與文件下載為核心，後續可再擴充為權限下載、版本追蹤與後台管理。
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">服務範圍</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600 md:grid-cols-2">
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  網路攝影機規劃與建置
                </li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  NVR / DVR 錄影主機整合
                </li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  門禁與出入口管理系統
                </li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  弱電配套與現場維運支援
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">合作流程</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p>1. 需求訪談與場域評估</p>
                <p>2. 型號選擇與方案建議</p>
                <p>3. 建置、測試與交付文件</p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <ContactCard />
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">核心優勢</h2>
              <div className="mt-4 space-y-3">
                {strengths.map((item) => (
                  <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
