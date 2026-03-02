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
          title="產品諮詢、技術支援與韌體協助"
          description="第一版先提供聯絡資訊與諮詢流程說明。後續若需要，可再加入表單送出、工單追蹤或會員登入功能。"
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ContactCard />

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">建議提供資訊（加快支援）</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>1. 產品型號與硬體版本（例如：SV-NVR-08-4K / HW Rev.B）</li>
                <li>2. 目前韌體版本與預計升級版本</li>
                <li>3. 現場症狀說明（畫面、錄影、連線、權限等）</li>
                <li>4. 安裝環境資訊（網路架構、PoE、硬碟容量、通道數）</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">聯絡方式</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`mailto:${siteProfile.contact.email}`}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  Email 聯絡
                </Link>
                <Link
                  href="/resources"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800"
                >
                  先查下載中心
                </Link>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                若為大量設備升級或專案現場更新需求，建議先提供型號清單，我們可協助整理版本對照與更新順序建議。
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">服務時間與回覆原則</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                服務時間：{siteProfile.contact.serviceHours}。一般技術問題將於工作時段內回覆；若涉及現場設備停機，請於來電時先說明設備型號與緊急程度，以便優先處理。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
