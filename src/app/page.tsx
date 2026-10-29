import Image from "next/image";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CooperationSection from "@/components/home/CooperationSection";
import HomeHero from "@/components/home/HomeHero";
import ProductCarousel, { type ProductCarouselItem } from "@/components/home/ProductCarousel";
import ServiceBand from "@/components/home/ServiceBand";
import SupportBand from "@/components/home/SupportBand";
import { productsHref } from "@/lib/catalog";
import { hasCategoryProducts } from "@/lib/product-availability";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "三泰利企業有限公司 B2B 安防監控與 AHD 客製",
  description:
    "三泰利企業有限公司提供監控器材批發、AHD 攝影機組裝客製、NVR/DVR、PoE、門禁與弱電整合支援。",
  path: "/",
});

// 首頁版面依美編設計稿「網站_主頁」（1440 寬）。

// 「產品」卡片列：第一張是產品中心總覽，後面依序為三大分類與其他產品類別。
// 周邊設備目前沒有刊登產品，先不顯示（加入產品後自動出現）。
const allProductCards: (ProductCarouselItem & { requires?: "accessory" })[] = [
  { title: "產品中心", href: "/products/" },
  {
    title: "監控攝影機",
    href: "/categories/camera/",
    image: { src: "/images/home/cat-camera.webp", width: 520, height: 323, displayWidth: 131 },
  },
  {
    title: "錄影主機",
    href: "/categories/recorder/",
    image: { src: "/images/home/cat-recorder.webp", width: 520, height: 160, displayWidth: 174 },
  },
  {
    title: "周邊設備",
    requires: "accessory",
    href: "/categories/accessory/",
    image: { src: "/images/home/cat-accessory.webp", width: 520, height: 166, displayWidth: 171 },
  },
  {
    title: "網路攝影機",
    href: productsHref({ category: "ip-camera" }),
    image: { src: "/images/products/th-ch258m3nd.jpg", width: 960, height: 600, displayWidth: 210 },
  },
  {
    title: "網路錄影機",
    href: productsHref({ category: "nvr" }),
    image: { src: "/images/products/dgh8516ax.jpg", width: 960, height: 600, displayWidth: 190 },
  },
  {
    title: "軟體方案",
    href: productsHref({ category: "software" }),
    image: { src: "/images/products/vms.jpg", width: 960, height: 600, displayWidth: 176 },
  },
];

const productCards: ProductCarouselItem[] = allProductCards.filter(
  (card) => !card.requires || hasCategoryProducts(card.requires),
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HomeHero />

        {/* 主視覺下方的攝影機陳列圖（與主視覺底部的白色漸層重疊 19px） */}
        <div className="relative px-5 lg:-mt-[19px]">
          <Image
            src="/images/site/home/product-shelf.webp"
            alt="三款監控攝影機陳列"
            width={500}
            height={195}
            className="mx-auto h-auto w-full max-w-[500px]"
          />
        </div>

        <section aria-labelledby="home-products-title" className="px-4 pb-14 pt-4 lg:pb-[65px] lg:pt-[26px]">
          <h2
            id="home-products-title"
            className="pl-[0.25em] text-center text-[26px] font-bold leading-[42px] tracking-[0.25em] text-brand-navy lg:text-[30px]"
          >
            產品
          </h2>
          <div className="mt-4 lg:mt-[23px]">
            <ProductCarousel items={productCards} />
          </div>
        </section>

        <ServiceBand />
        <CooperationSection />
        <SupportBand />
      </main>

      <Footer />
    </div>
  );
}
