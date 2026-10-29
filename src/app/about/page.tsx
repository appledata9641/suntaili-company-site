import { Fragment } from "react";
import type { Metadata } from "next";
import CompanyTimeline from "@/components/about/CompanyTimeline";
import CoreServiceTiles from "@/components/about/CoreServiceTiles";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { aboutIntroLines } from "@/data/about";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "關於我們：AHD 攝影機組裝客製與監控器材批發",
  description: "三泰利企業有限公司以 B2B 安防監控、監控器材批發、AHD 攝影機客製與弱電整合支援為主要服務。",
  path: "/about",
});

// 關於我們：版面依美編設計稿「網站_關於我們」（主圖、關於三泰利、核心與服務、公司歷程）
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero image="/images/site/about/hero.webp" title="關於我們" subtitle="專為系統整合與工程商而生" tone="light" />

        <section className="px-5 pt-14 sm:px-8 lg:pt-[111px]">
          <SectionTitle title="關於三泰利" />
          <p className="mx-auto mt-5 max-w-[620px] text-center text-base font-bold leading-8 tracking-[0.1em] text-brand-grey lg:mt-[26px] lg:max-w-none lg:text-lg lg:leading-[35px]">
            {aboutIntroLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? <br className="hidden lg:inline" /> : null}
                {line}
              </Fragment>
            ))}
          </p>
        </section>

        <section className="pt-16 lg:pt-[96px]">
          <SectionTitle title="核心與服務" className="px-5" />
          <div className="mt-8 lg:mt-[53px]">
            <CoreServiceTiles />
          </div>
        </section>

        <section className="px-5 pb-16 pt-16 sm:px-8 lg:pb-[69px] lg:pt-[100px]">
          <SectionTitle title="公司歷程" />
          <div className="mt-8 lg:mt-[30px]">
            <CompanyTimeline />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
