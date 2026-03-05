import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { siteProfile } from "@/data/site";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-slate-100 via-white to-white">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-18">
            <p className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-800">
              安防監控與弱電整合
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {siteProfile.companyName}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              {siteProfile.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                查看產品
              </Link>
              <Link
                href="/resources"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800"
              >
                文件下載
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="產品介紹"
                title="從上方選單展開二級分類快速找型號"
                description="桌機版請將滑鼠移到「產品介紹」，可直接看到群組分類與型號；手機版可在選單中展開產品分類。"
              />
              <div className="mt-5">
                <Link
                  href="/products"
                  className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  前往產品中心
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">快速聯絡</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>電話：{siteProfile.contact.phone}</li>
                <li>Email：{siteProfile.contact.email}</li>
                <li>LINE：{siteProfile.contact.lineId}</li>
                <li>服務時間：{siteProfile.contact.serviceHours}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
