import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { buttonClass } from "@/components/ui/styles";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto flex max-w-[1042px] flex-col items-center px-5 py-24 text-center lg:py-32">
        <p className="text-sm font-bold tracking-[0.3em] text-brand-grey">404</p>
        <h1 className="mt-4 text-[24px] font-bold tracking-[0.12em] text-brand-navy lg:text-[30px]">找不到這個頁面</h1>
        <p className="mt-3 max-w-xl text-[15px] font-medium leading-relaxed tracking-[0.04em] text-brand-grey lg:text-lg">
          此頁面可能已移除、網址已變更，或舊下載連結已整理到新版文件下載頁。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/products/" className={buttonClass("primary", "md")}>
            回產品中心
          </Link>
          <Link href="/resources/" className={buttonClass("outline", "md")}>
            前往文件下載
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
