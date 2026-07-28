import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductsExplorer from "@/components/ProductsExplorer";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "產品中心",
  description: "三泰利產品中心提供監控攝影機、NVR/DVR 錄影主機、PoE 與弱電周邊設備型號查詢。",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="產品中心"
          title="依需求快速找到產品"
          description="分級清單採產品線、子類與型號整理，可快速找到目標型號。"
        />

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                載入產品資料中...
              </div>
            }
          >
            <ProductsExplorer products={publishedProducts} />
          </Suspense>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="全部型號"
            title="公開產品型號速覽"
            description="依產品分類整理目前網站公開型號，方便工程採購快速查找。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {productCategories.map((category) => {
              const products = publishedProducts.filter((product) => product.category === category.id);

              return (
                <div key={category.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-slate-950">{category.name}</h2>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900"
                    >
                      查看分類
                    </Link>
                  </div>
                  <div className="mt-4 space-y-2">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="block rounded-lg bg-white px-3 py-2 text-sm text-slate-700 hover:text-slate-950"
                      >
                        <span className="font-medium">{product.model}</span>
                        <span className="ml-2 text-xs text-slate-500">{product.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
