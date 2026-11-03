import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ArrowRightLine } from "@/components/icons";
import PageHero from "@/components/ui/PageHero";
import { buttonClass, cardShadow } from "@/components/ui/styles";
import { publishedProducts } from "@/data/products";
import { activeProductCategories } from "@/lib/product-availability";
import { pageMetadata } from "@/lib/seo";
import type { ProductCategory } from "@/types/product";

export const metadata: Metadata = pageMetadata({
  title: "產品分類：監控攝影機、錄影主機與軟體方案",
  description: "依監控攝影機、錄影主機與 VMS 軟體方案分類瀏覽三泰利公開產品型號。",
  path: "/categories",
});

// 分類圖片沿用主頁「產品」區塊的圖
const categoryImages: Record<ProductCategory, string> = {
  camera: "/images/home/cat-camera.webp",
  recorder: "/images/home/cat-recorder.webp",
  software: "/images/products/vms.jpg",
  accessory: "/images/home/cat-accessory.webp",
};

// 只列出有產品的分類（周邊設備目前沒有產品，先不列）；四個分類時桌機改成一列四格
const gridClass = activeProductCategories.length > 3 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero image="/images/site/products/hero-v2.webp" title="產品分類" subtitle="依產品線瀏覽監控設備" tone="light" />

        <section className="mx-auto max-w-[1108px] px-4 pb-16 pt-12 lg:pb-[93px] lg:pt-[68px]">
          <ul className={`grid gap-5 lg:gap-[30px] ${gridClass}`}>
            {activeProductCategories.map((category) => {
              const count = publishedProducts.filter((product) => product.category === category.id).length;
              return (
                <li key={category.id} className="min-w-0">
                  <Link
                    href={`/categories/${category.slug}/`}
                    className={`group flex h-full flex-col rounded-[3px] border border-brand-line bg-white px-6 pb-6 pt-7 transition-[border-color,box-shadow] duration-200 hover:border-brand-grey/60 ${cardShadow} hover:shadow-[0_4px_16px_rgba(32,54,86,0.12)]`}
                  >
                    <h2 className="text-center text-xl font-medium tracking-[0.12em] text-brand-grey transition-colors group-hover:text-brand-navy">
                      {category.name}
                    </h2>
                    <span
                      aria-hidden
                      className="mx-auto mt-4 block h-px w-[160px] bg-brand-line transition-colors group-hover:bg-brand-navy"
                    />
                    <div className="relative mt-6 h-[140px]">
                      <Image
                        src={categoryImages[category.id]}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 300px, 90vw"
                        className="object-contain"
                      />
                    </div>
                    <p className="mt-6 text-sm font-medium leading-7 text-brand-muted">{category.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-brand-line pt-4">
                      <span className="text-sm font-bold text-brand-navy">{count} 個公開型號</span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-blue group-hover:text-brand-navy">
                        查看分類
                        <ArrowRightLine className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 flex flex-col items-center gap-4 text-center lg:mt-16">
            <p className="text-base font-medium text-brand-muted">想依類型、解析度、品牌或型號快速篩選？</p>
            <Link href="/products/" className={buttonClass("outline", "md")}>
              前往產品中心
              <ArrowRightLine className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
