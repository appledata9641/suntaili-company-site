import type { Metadata } from "next";
import CatalogExplorer from "@/components/catalog/CatalogExplorer";
import { getCatalogEntries } from "@/components/catalog/catalog-data";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "產品型錄下載：AHD 攝影機與錄影主機 DM",
  description:
    "下載三泰利 AHD 攝影機、DVR 錄影機與經銷 NVR 產品型錄（DM），依外型與產品線分類，方便工程採購比對規格。",
  path: "/catalog",
});

const entries = getCatalogEntries();

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero image="/images/site/catalog/hero.webp" title="產品型錄" subtitle="攝影機與錄影主機產品型錄" tone="light" />
        <div className="mx-auto max-w-[1064px] px-4 pb-24 pt-10 sm:px-5 lg:pb-[120px] lg:pt-[73px]">
          <CatalogExplorer entries={entries} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
