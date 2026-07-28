import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { siteProfile } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "常見問題",
  description: "三泰利整理監控器材批發、AHD 攝影機客製、相容性確認、文件下載與專案詢價常見問題。",
  path: "/faq",
});

const faqs = [
  {
    question: "三泰利主要服務對象是誰？",
    answer:
      "以系統整合商、弱電工程商、監控器材經銷商與專案採購為主，協助確認型號、配貨、客製與售後文件。",
  },
  {
    question: "可以協助 AHD 攝影機組裝或客製嗎？",
    answer:
      "可以先提供解析度、外型、鏡頭焦距、夜視需求、安裝環境與數量，三泰利會依現有產品與可配置方式協助確認。",
  },
  {
    question: "既有 DVR 或同軸線路可以沿用嗎？",
    answer:
      "需依現場主機支援的訊號格式確認。產品頁若標示 AHD / TVI / CVI / CVBS，仍建議提供主機型號再確認相容性。",
  },
  {
    question: "文件下載頁為什麼不放產品 DM？",
    answer:
      "文件下載頁保留工具軟體與操作說明書，產品 DM 放在各型號產品頁，避免工程人員下載時混到不相關文件。",
  },
  {
    question: "大量採購或專案配貨需要準備哪些資料？",
    answer:
      "建議提供產品型號、預估數量、案場類型、交期、既有設備型號、線路與供電條件，方便回覆報價與替代方案。",
  },
  {
    question: "網站上沒有看到的型號可以詢問嗎？",
    answer:
      "可以。部分型號可能尚未整理到網站，可透過 Email、電話或詢價表單提供需求與照片，由三泰利協助確認。",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-14">
        <SectionHeading
          eyebrow="常見問題"
          title="監控器材批發、客製與文件下載 FAQ"
          description="整理系統整合商與經銷夥伴在詢價、配貨與售後支援時最常遇到的問題。"
        />

        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <section key={faq.question} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950">{faq.question}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">需要進一步確認</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            可來信 {siteProfile.contact.email} 或致電 {siteProfile.contact.phone}，也可以先填寫詢價需求。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/inquiry"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              詢價合作
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800"
            >
              聯絡我們
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
