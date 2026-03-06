import Image from "next/image";
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
        <section
          className="border-b border-slate-900 bg-slate-950"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(2,6,23,0.94) 0%, rgba(2,6,23,0.9) 100%), url('/images/home-hero.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto max-w-[1600px] px-4 py-6 md:py-8">
            <div className="overflow-hidden rounded-2xl border border-slate-700">
              <div className="min-h-[420px] md:min-h-[520px]">
                <div className="relative flex min-h-[420px] items-end md:min-h-[520px]">
                  <Image
                    src="/images/home-hero.jpg"
                    alt="三泰利產品主視覺"
                    fill
                    priority
                    className="object-contain object-center md:object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/35" />

                  <div className="relative z-10 w-full p-6 md:p-10">
                    <p className="inline-flex rounded-full border border-sky-200/40 bg-slate-900/60 px-3 py-1 text-xs font-medium text-sky-200">
                      安防監控與弱電整合
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                      {siteProfile.companyName}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                      {siteProfile.shortDescription}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href="/products"
                        className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                      >
                        查看產品
                      </Link>
                      <Link
                        href="/resources"
                        className="rounded-full border border-slate-300/50 bg-slate-900/30 px-5 py-3 text-sm font-medium text-white"
                      >
                        文件下載
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="產品介紹"
                title="尋找理想的產品"
                description=""
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
                <li>地址：{siteProfile.contact.address}</li>
                <li>統編：{siteProfile.contact.taxId}</li>
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
