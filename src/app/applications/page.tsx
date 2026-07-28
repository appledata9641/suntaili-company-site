import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";

const applicationGroups = [
  {
    title: "商用空間與店面",
    description: "適合櫃台、出入口、走道、收銀區與倉儲區域監看，常搭配 AHD 攝影機、DVR 與既有同軸線路。",
    products: ["AHD 攝影機", "DVR 錄影主機", "螢幕與影像延伸設備"],
  },
  {
    title: "社區與住宅公共區域",
    description: "可依梯廳、停車場、信箱區、管理室與大門口規劃攝影機數量、夜視距離與錄影保存天數。",
    products: ["半球攝影機", "室外槍型攝影機", "NVR / DVR"],
  },
  {
    title: "工廠、倉儲與廠區周界",
    description: "重視長距離夜視、防水防塵、穩定錄影與遠端巡檢，可依現場供電與線路距離調整配置。",
    products: ["IP67 室外攝影機", "PoE 交換器", "多通道錄影主機"],
  },
  {
    title: "系統整合與弱電工程",
    description: "支援系統整合商確認既有設備相容性、替代型號、線材與供電配置，降低現場施工不確定性。",
    products: ["PoE 周邊", "VMS 管理工具", "門禁與弱電周邊"],
  },
];

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="應用場域"
          title="依案場情境規劃監控與弱電設備"
          description="三泰利以 B2B 供貨與技術支援為主，協助工程商、系統整合商與經銷夥伴確認產品組合。"
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {applicationGroups.map((group) => (
            <section key={group.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{group.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{group.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.products.map((product) => (
                  <span
                    key={product}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">需要依案場配貨或確認替代型號</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                可提供現場環境、攝影機數量、距離、既有主機或線路狀況，方便快速確認產品搭配。
              </p>
            </div>
            <Link
              href="/inquiry"
              className="inline-flex justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              填寫專案需求
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
