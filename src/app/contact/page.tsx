import Link from "next/link";
import type { Metadata } from "next";
import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ArrowRightLine } from "@/components/icons";
import { wideButtonClass } from "@/components/inquiry/buttons";
import InquiryPrepPanel from "@/components/inquiry/InquiryPrepPanel";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "聯絡我們：監控器材詢價與技術支援",
  description: "聯絡三泰利企業有限公司，洽詢監控器材批發、AHD 攝影機客製、NVR/DVR、PoE 與弱電整合需求。",
  path: "/contact",
});

// 舊網址保留的聯絡頁（不在新選單中）：沿用立即諮詢頁的聯絡卡與諮詢區塊，表單集中在立即諮詢頁。
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* 設計稿的標點是比例寬度（如「，」「、」較窄），以 palt 字距對齊 */}
      <main className="bg-brand-page [font-feature-settings:'palt']">
        <PageHero image="/images/site/inquiry/hero.webp" title="聯絡我們" subtitle="選型建議與技術支援" tone="light" />

        <div className="mx-auto max-w-[1170px] px-4 pb-16 pt-10 lg:pb-[90px] lg:pt-[89px]">
          <ContactCard gaLabelPrefix="contact_card" />

          <section className="mt-14 lg:mt-[69px]">
            <SectionTitle title={<span className="font-medium tracking-[0.1em]">產品選型與應用諮詢</span>} />
            <div className="mt-6 lg:mt-[25px]">
              <InquiryPrepPanel gaLabel="contact_page_email" />
            </div>
          </section>

          <div className="mt-12 flex justify-center lg:mt-[62px]">
            <Link href="/inquiry/" className={wideButtonClass("primary")}>
              <span className="flex-1 text-center">填寫詢價需求</span>
              <ArrowRightLine className="h-[27px] w-[27px] shrink-0" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
