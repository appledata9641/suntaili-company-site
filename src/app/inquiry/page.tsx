import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InquiryForms from "@/components/InquiryForms";
import SectionHeading from "@/components/SectionHeading";
import { siteProfile } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "詢價合作",
  description: "提供經銷合作、大量採購、專案配貨與 AHD 攝影機客製需求，三泰利協助確認型號與報價。",
  path: "/inquiry",
});

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="詢價合作"
          title="經銷合作、批發採購與專案需求"
          description="提供型號、數量、案場條件與交期，三泰利會依需求協助確認產品搭配、報價與替代方案。"
        />

        <InquiryForms />

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">聯絡資訊</h2>
          <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-900">電話</dt>
              <dd className="mt-1">{siteProfile.contact.phone}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Email</dt>
              <dd className="mt-1">{siteProfile.contact.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">地址</dt>
              <dd className="mt-1">{siteProfile.contact.address}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">服務時間</dt>
              <dd className="mt-1">{siteProfile.contact.serviceHours}</dd>
            </div>
          </dl>
        </section>
      </main>
      <Footer />
    </div>
  );
}
