import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { siteProfile } from "@/data/site";

const strengths = [
  {
    title: "穩定供貨與專案配貨",
    description: "以 B2B 專案需求為主，提供監控設備與周邊器材整合供應。",
  },
  {
    title: "台灣組裝 AHD 客製化",
    description: "可依專案需求提供 AHD 規格客製與整合建議，提升導入效率。",
  },
  {
    title: "弱電整合經驗",
    description: "涵蓋監控系統、傳輸架構與周邊設備，支援場域整體規劃。",
  },
  {
    title: "技術文件與售後支援",
    description: "提供文件下載與技術支援窗口，協助客戶快速排除導入問題。",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="關於我們"
          title={siteProfile.companyName}
          description="三泰利企業有限公司以 B2B 市場為主，專注於弱電整合、監控器材批發與台灣組裝 AHD 客製化，提供穩定供貨與長期技術支援。"
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">公司定位</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                我們以監控器材批發與弱電整合為核心，支援通路夥伴、系統整合商與企業客戶的專案需求，
                並透過標準化資料與文件下載流程，降低導入與維運成本。
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">服務項目</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600 md:grid-cols-2">
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">網路與 AHD 攝影機設備供應</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">NVR / DVR 錄影主機整合</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">PoE、無線橋接與影音延伸設備</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-4">專案規格建議與導入支援</li>
              </ul>
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
