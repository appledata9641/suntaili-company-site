import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductsExplorer from "@/components/ProductsExplorer";
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
          title="依需求快速找到產品"
          description="可切換平鋪卡片與分級清單瀏覽。分級清單採產品線→子類→型號，查找效率更高。"
        />

        <div className="mt-8">
          <ProductsExplorer products={publishedProducts} categories={productCategories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
