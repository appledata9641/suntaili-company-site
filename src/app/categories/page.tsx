import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "產品分類",
  description: "依監控攝影機、錄影主機與弱電周邊分類瀏覽三泰利公開產品型號。",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="產品分類"
          title="依產品類型瀏覽型號"
          description="分類頁提供伺服器輸出的產品清單，適合快速查找攝影機、錄影主機與弱電周邊。"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {productCategories.map((category) => {
            const products = publishedProducts.filter((product) => product.category === category.id);

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
              >
                <div className="text-sm font-semibold text-slate-950">{category.name}</div>
                <p className="mt-3 min-h-14 text-sm leading-7 text-slate-600">{category.description}</p>
                <div className="mt-5 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>{products.length} 個公開型號</span>
                  <span>查看分類</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
