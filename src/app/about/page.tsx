import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { siteProfile } from "@/data/site";

const strengths = [
  {
    title: "產品整合能力",
    description: "涵蓋監控、錄影、周邊與門禁，能依專案規模快速配置。",
  },
  {
    title: "技術支援導向",
    description: "重視型號相容性、版本管理與現場導入問題排查。",
  },
  {
    title: "交付文件清楚",
    description: "逐步整理韌體、手冊與工具程式，降低維運溝通成本。",
  },
  {
    title: "後續擴充彈性",
    description: "網站資料結構預留後端串接，便於導入下載權限與版本紀錄。",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="關於我們"
          title={`${siteProfile.brandName}｜安防設備與韌體支援平台`}
          description="本頁先作為企業官網提案版內容，重點展示公司定位、服務能力與技術支援方向。正式上線時可再補品牌故事、實績案例與認證資訊。"
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">公司定位</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {siteProfile.companyName} 主要提供監視系統設備、錄影主機、門禁控制與周邊配件，並協助工程商與企業客戶進行設備選型、安裝設定與後續維運。網站第一版會以產品展示與下載中心為核心，讓客戶能快速找到正確型號與版本資訊。
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">服務項目</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600 md:grid-cols-2">
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">監控系統產品供應與規劃</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">NVR/DVR 錄影主機導入與設定支援</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">門禁設備與出入口管理整合</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">韌體更新、工具程式與文件整理</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">第一版網站目標</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p>1. 清楚呈現產品分類與型號資訊，方便客戶查詢。</p>
                <p>2. 提供下載中心入口，先完成搜尋與分類體驗。</p>
                <p>3. 建立可延伸資料模型，後續接後端與資料庫時可直接沿用。</p>
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
