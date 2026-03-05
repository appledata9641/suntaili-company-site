import SectionHeading from "@/components/SectionHeading";

const features = [
  {
    title: "產品線完整、供貨穩定",
    desc: "涵蓋攝影機、錄影主機與弱電周邊，方便一次整合採購。",
  },
  {
    title: "文件與工具可快速取得",
    desc: "下載中心提供說明書與工具軟體，現場部署與維護流程更順暢。",
  },
  {
    title: "技術支援可追蹤",
    desc: "針對型號、版本與案場情境提供明確的設定建議與問題排查方向。",
  },
  {
    title: "商用專案導向",
    desc: "以 B2B 專案需求為核心，重視交期、相容性與長期維運可行性。",
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="服務優勢"
          title="聚焦專案落地與長期維運"
          description="從產品選型到文件支援，提供可實際執行的工程導向方案。"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
