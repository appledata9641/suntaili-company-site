import Link from "next/link";
import { homeStats, siteProfile } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-100 via-white to-white">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.18),_transparent_65%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <div className="relative">
          <p className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-800">
            安防監控與弱電整合服務
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {siteProfile.brandName}
            <span className="block text-slate-700">企業級監控與弱電整合方案</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {siteProfile.shortDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              查看產品
            </Link>
            <Link
              href="/resources"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:border-slate-400"
            >
              文件下載中心
            </Link>
          </div>
        </div>

        <div className="relative rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="rounded-2xl bg-slate-900 p-5 text-white">
            <div className="text-sm text-slate-300">服務重點</div>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              <li>專注 B2B 案場與工程端需求</li>
              <li>提供產品文件、工具軟體與導入建議</li>
              <li>售前評估與售後技術支援</li>
            </ul>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {homeStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-lg font-semibold text-slate-900">{stat.value}</div>
                <div className="mt-1 text-xs text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
            服務時間：{siteProfile.contact.serviceHours}
          </div>
        </div>
      </div>
    </section>
  );
}
