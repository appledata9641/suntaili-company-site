import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-4xl flex-col items-start px-4 py-20">
        <p className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          404
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          找不到這個頁面
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          此頁面可能已移除、網址已變更，或舊下載連結已整理到新版文件下載頁。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            回產品中心
          </Link>
          <Link
            href="/resources"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800"
          >
            前往文件下載
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
