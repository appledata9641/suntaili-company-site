import type { Metadata } from "next";
import DownloadsExplorer, { type DownloadExplorerRow } from "@/components/DownloadsExplorer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { normalizeSearchText } from "@/components/docs/search";
import PageHero from "@/components/ui/PageHero";
import { productCategories } from "@/data/categories";
import { downloads } from "@/data/downloads";
import { publishedProducts } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import type { DownloadType } from "@/types/download";

// 產品型錄（dm- 開頭）放在「產品型錄」頁，這裡只列說明書與軟體
const resourceDownloads = downloads.filter((item) => !item.id.startsWith("dm-"));

const typeLabels: Record<DownloadType, string> = {
  software: "軟體",
  manual: "說明文件",
  firmware: "韌體",
};

// 搜尋時也找得到的類型別名（設計稿的搜尋提示「說明書、工具」）
const typeKeywords: Record<DownloadType, string> = {
  software: "軟體 工具 軟體工具",
  manual: "說明文件 說明書 手冊",
  firmware: "韌體 firmware",
};

const typeOrder: DownloadType[] = ["software", "manual", "firmware"];

const rows: DownloadExplorerRow[] = resourceDownloads.map((item) => {
  const product = item.productSlug ? publishedProducts.find((p) => p.slug === item.productSlug) : undefined;
  const productName = product?.name ?? item.productModel;
  const categoryName = productCategories.find((category) => category.id === item.category)?.name ?? "";
  return {
    id: item.id,
    title: item.title,
    productLabel: productName === item.productModel ? productName : `${productName} (${item.productModel})`,
    notes: item.notes,
    typeLabel: typeLabels[item.type],
    version: item.version,
    releaseDate: item.releaseDate,
    fileSize: item.fileSize,
    downloadUrl: item.downloadUrl,
    category: item.category,
    type: item.type,
    searchText: normalizeSearchText(
      [item.title, productName, item.productModel, item.version ?? "", item.notes ?? "", typeKeywords[item.type], categoryName].join(" "),
    ),
  };
});

// 設計稿兩個選單的預設字對調了（產品分類寫「全部類型」、檔案類型寫「全部分類」），這裡改成對應的說法
// 只列出有文件的分類
const categoryOptions = [
  { value: "all", label: "全部分類" },
  ...productCategories
    .filter((category) => rows.some((row) => row.category === category.id))
    .map((category) => ({ value: category.id, label: category.name })),
];

// 沒有檔案的類型（例如目前沒有韌體）不列在選單
const typeOptions = [
  { value: "all", label: "全部類型" },
  ...typeOrder
    .filter((type) => resourceDownloads.some((item) => item.type === type))
    .map((type) => ({ value: type, label: typeLabels[type] })),
];

export const metadata: Metadata = pageMetadata({
  title: "監控系統說明書與工具軟體下載",
  description: "下載三泰利監控系統工具軟體、VMS 說明書與產品操作文件；產品型錄（DM）請至產品型錄頁下載。",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero image="/images/site/docs/hero.webp" title="文件下載" subtitle="監控系統說明書與工具軟體下載" tone="brand" />
        <section aria-labelledby="downloads-heading" className="mx-auto max-w-[1064px] px-4 pb-24 pt-10 sm:px-5 lg:pb-[150px] lg:pt-[81px]">
          <h2 id="downloads-heading" className="sr-only">
            文件列表
          </h2>
          <DownloadsExplorer rows={rows} categoryOptions={categoryOptions} typeOptions={typeOptions} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
