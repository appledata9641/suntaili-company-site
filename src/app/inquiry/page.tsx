import type { Metadata } from "next";
import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InquiryForms from "@/components/InquiryForms";
import InquiryPrepPanel from "@/components/inquiry/InquiryPrepPanel";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "監控器材批發詢價與經銷合作",
  description: "提供經銷合作、大量採購、專案配貨與 AHD 攝影機客製需求，三泰利協助確認型號與報價。",
  path: "/inquiry",
});

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* 設計稿的標點是比例寬度（如「，」「、」較窄），以 palt 字距對齊 */}
      <main className="bg-brand-page [font-feature-settings:'palt']">
        <PageHero image="/images/site/inquiry/hero-v2.webp" title="立即諮詢" subtitle="填寫需求，取得協助" tone="light" />

        <div className="mx-auto max-w-[1170px] px-4 pb-16 pt-10 lg:pb-[63px] lg:pt-[89px]">
          <ContactCard gaLabelPrefix="inquiry_card" />

          <section className="mt-14 lg:mt-[69px]">
            <SectionTitle title={<span className="font-medium tracking-[0.1em]">產品選型與應用諮詢</span>} />
            <div className="mt-6 lg:mt-[25px]">
              <InquiryPrepPanel gaLabel="inquiry_prep_email" />
            </div>
          </section>

          <InquiryForms className="mt-14 lg:mt-[62px]" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
