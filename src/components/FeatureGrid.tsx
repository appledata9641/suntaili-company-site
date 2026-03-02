import SectionHeading from "@/components/SectionHeading";

const features = [
  {
    title: "穩定供貨與產品線規劃",
    desc: "依專案規模提供攝影機、錄影主機、PoE 周邊與門禁設備搭配建議。",
  },
  {
    title: "韌體版本管理支援",
    desc: "以產品型號為核心整理韌體與文件，降低現場誤刷版本風險。",
  },
  {
    title: "技術問題排查協助",
    desc: "針對相容性、遠端連線、錄影異常等常見問題提供處理方向。",
  },
  {
    title: "專案交付文件整備",
    desc: "可提供安裝手冊、設定工具與版本紀錄，協助工程商交付與維運。",
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="服務優勢"
          title="讓設備導入與後續維護更順暢"
          description="第一版網站以前端體驗為主，先把產品資訊與下載入口整理清楚，後續再接上後台與檔案儲存機制。"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
