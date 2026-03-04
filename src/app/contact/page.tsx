import Link from "next/link";
import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { siteProfile } from "@/data/site";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="聯絡我們"
          title="需要選型建議或技術支援"
          description="可先提供型號、案場需求與目前遇到的問題，我們會在服務時段內回覆。"
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ContactCard />

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">詢問前建議準備資料</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>1. 產品型號與目前版本資訊</li>
                <li>2. 問題發生情境與時間點</li>
                <li>3. 已嘗試的排查步驟</li>
                <li>4. 現場網路與供電條件（如 PoE）</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">快速入口</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`mailto:${siteProfile.contact.email}`}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  寄送 Email
                </Link>
                <Link
                  href="/resources"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800"
                >
                  前往文件下載
                </Link>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                若需要大量型號文件，建議先整理清單，我們可提供較完整的對應資訊與下載建議。
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">服務時段</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                服務時間為 {siteProfile.contact.serviceHours}。非服務時段收到的詢問會於下一個工作時段盡快回覆。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
