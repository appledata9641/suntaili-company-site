import type { Metadata } from "next";
import FaqBrowser from "@/components/faq/FaqBrowser";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { faqTabCategories, faqs } from "@/data/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "監控器材批發與 AHD 客製常見問題",
  description: "三泰利整理監控器材批發、AHD 攝影機客製、相容性確認、文件下載與專案詢價常見問題。",
  path: "/faq",
});

// 搜尋引擎用的 FAQPage 結構化資料（內容與頁面上的問答相同）
function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// 常見問題：版面依美編設計稿「網站_常見問題」（無主圖，標題置中、分類頁籤、問答列表與分頁）
export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-[983px] px-4 pb-20 pt-14 lg:pb-[114px] lg:pt-[108px]">
        <JsonLd id="faq-jsonld" data={faqPageJsonLd()} />
        <h1 className="text-center text-[26px] font-bold leading-[42px] tracking-[0.06em] text-brand-navy lg:text-[30px]">常見問題</h1>
        <div className="mt-8 lg:mt-[51px]">
          <FaqBrowser items={faqs} categories={faqTabCategories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
