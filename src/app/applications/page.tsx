import type { Metadata } from "next";
import CaseCard from "@/components/cases/CaseCard";
import CasesCta from "@/components/cases/CasesCta";
import ScenarioCard from "@/components/cases/ScenarioCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { applicationScenarios, caseStudies } from "@/data/cases";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "監控系統應用場域與配置建議",
  description: "依商用空間、社區、工廠倉儲與弱電工程情境，規劃監控攝影機、錄影主機與周邊設備。",
  path: "/applications",
});

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* 設計稿的標點是比例寬度（如「，」「、」較窄），以 palt 字距對齊 */}
      <main className="[font-feature-settings:'palt']">
        <PageHero image="/images/site/cases/hero.webp" title="案例場景" subtitle="從真實案場尋找最佳設備組合" tone="brand" />

        {/* 應用場域 */}
        <section id="scenarios" className="px-4 pb-14 pt-14 lg:pb-[9px] lg:pt-[105px]">
          <SectionTitle
            as="h2"
            tracking="wide"
            title={
              <span className="font-normal lg:tracking-[0.15em]">
                <span className="block sm:inline">精準對應案場需求，</span>
                <span className="block sm:inline">嚴選監控與弱電設備</span>
              </span>
            }
            description={
              <>
                <span className="font-normal tracking-[0.1em] lg:block lg:pt-1 lg:leading-[21px]">
                  三泰利提供齊全的產品線與技術支援，協助工程商、
                </span>
                <span className="font-normal tracking-[0.1em] lg:block lg:leading-[21px]">
                  系統整合商與經銷夥伴快速找到最佳設備組合，讓專案規劃更順手。
                </span>
              </>
            }
          />
          <div className="mx-auto mt-8 grid max-w-[958px] gap-6 md:grid-cols-2 md:gap-x-4 lg:mt-[47px] lg:gap-y-[58px]">
            {applicationScenarios.map((scenario) => (
              <ScenarioCard key={scenario.title} scenario={scenario} />
            ))}
          </div>
        </section>

        {/* 實際案例：背景為透視格線圖 */}
        <section
          id="cases"
          className="bg-[url('/images/site/cases/grid-bg.webp')] bg-[length:1440px_667px] bg-top bg-no-repeat px-4 pb-16 pt-14 lg:pb-[135px] lg:pt-[123px]"
        >
          <SectionTitle
            as="h2"
            tracking="wide"
            title={
              <span className="font-normal lg:tracking-[0.15em]">
                <span className="block md:inline">實際案例</span>
                <span
                  aria-hidden="true"
                  className="hidden h-[0.95em] w-[2px] translate-y-[0.12em] bg-brand-navy/85 md:mx-3 md:inline-block lg:ml-[14px] lg:mr-[19px]"
                />
                <span className="sr-only">：</span>
                <span className="block text-brand-blue md:inline">對應案場情境，精準選配設備</span>
              </span>
            }
            description={
              <span className="font-normal tracking-[0.1em]">
                <span className="block sm:inline">匯整系統整合與工程部署經驗，</span>
                <span className="block sm:inline">為您的弱電專案提供最可靠的配置參考</span>
              </span>
            }
          />
          <ul className="mx-auto mt-10 flex max-w-[959px] flex-wrap justify-center gap-[25px] lg:mt-[50px]">
            {caseStudies.map((item) => (
              <li key={item.name} className="flex w-[303px] max-w-full">
                <CaseCard item={item} />
              </li>
            ))}
          </ul>
        </section>

        <CasesCta />
      </main>
      <Footer />
    </div>
  );
}
