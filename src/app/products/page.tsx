import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductsCatalog from "@/components/ProductsCatalog";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="產品中心"
          title="監控設備與門禁產品一覽"
          description="依產品線分類整理型號與規格摘要，方便客戶先了解產品定位，再查看對應說明文件與工具軟體。"
        />

        <div className="mt-8">
          <ProductsCatalog products={publishedProducts} categories={productCategories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
