import Image from "next/image";
import HomeButton from "@/components/home/HomeButton";

// 設計稿標語中的細「×」：用 SVG 畫，佔一個中文字加字距的寬度
function CrossMark() {
  return (
    <span className="inline-flex w-[1.2em] items-center justify-center pr-[0.2em] align-[0.06em]">
      <svg aria-hidden viewBox="0 0 17 17" className="h-[0.68em] w-[0.68em] text-brand-cyan">
        <path d="M1 1 16 16M16 1 1 16" stroke="currentColor" strokeWidth="2.1" fill="none" />
      </svg>
      <span className="sr-only">×</span>
    </span>
  );
}

// 主頁主視覺：設計稿高度 678px（1440 寬），左側公司名稱與標語、右側產品圖與兩個按鈕，底部兩行服務說明。
export default function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden lg:h-[678px]">
      <Image
        src="/images/site/home/hero-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-top"
      />
      {/* 螢幕比設計稿寬時，底圖會被裁掉下緣的白色漸層，這裡補上 */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 hidden h-[220px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0),#fff_80%)] min-[1441px]:block" />

      <div className="mx-auto flex max-w-[1088px] flex-col gap-10 px-5 pt-12 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:px-10 lg:pt-[164px] xl:pl-[15px] xl:pr-0">
        <div className="lg:shrink-0">
          <p className="text-[14px] font-medium leading-5 tracking-[0.08em] text-white sm:text-base">[ B2B 弱電專區｜工程通路 ]</p>
          <h1 className="mt-3 text-[40px] font-bold leading-[1.2] tracking-[0.08em] sm:text-[46px] lg:mt-[12px] lg:whitespace-nowrap lg:text-[52px] lg:leading-[63px]">
            <span className="block text-brand-cyan">三泰利</span>
            <span className="block text-white">企業有限公司</span>
          </h1>
          <p className="mt-3 text-[20px] font-medium leading-[30px] tracking-[0.19em] text-white sm:text-[22px] lg:mt-[15px] lg:text-[25px] lg:tracking-[0.2em]">
            監控設備配貨
            <CrossMark />
            彈性客製
          </p>
          <p className="mt-3 flex min-h-[31px] max-w-[325px] items-center justify-center rounded-[3px] bg-brand-teal px-3 py-1 text-center text-[13px] font-bold leading-[18px] tracking-[0.11em] text-white sm:text-sm lg:mt-[13px] lg:w-[325px] lg:px-0 lg:py-0">
            專為系統整合、弱電工程商與經銷夥伴打造
          </p>
        </div>

        <div className="flex flex-col items-center lg:w-[413px] lg:shrink-0">
          <Image
            src="/images/site/home/hero-products.webp"
            alt="PoE 交換器與錄影主機"
            width={300}
            height={169}
            priority
            className="h-auto w-[260px] drop-shadow-[0_0_14px_rgba(143,247,255,0.55)] sm:w-[300px] lg:ml-[57px] lg:self-start"
          />
          <div className="mt-6 flex w-full max-w-[413px] gap-3 lg:mt-px lg:gap-[21px]">
            <HomeButton href="/inquiry/" variant="light" labelOffsetClass="lg:pr-[8px]" iconOffsetClass="lg:right-[9.5px]" className="flex-1 lg:flex-none">
              詢價與合作
            </HomeButton>
            <HomeButton href="/products/" variant="ghost" iconOffsetClass="lg:right-[9.5px]" className="flex-1 lg:flex-none">
              查看產品中心
            </HomeButton>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-[1100px] px-5 pb-10 text-center text-[16px] font-medium leading-[1.6] tracking-[0.1em] text-brand-grey sm:text-[18px] lg:mt-[134px] lg:px-0 lg:pb-0 lg:pl-[0.2em] lg:text-[24px] lg:leading-[34px] lg:tracking-[0.2em]">
        <span className="block">涵蓋AHD攝影機組裝客製、NVR／DVR、PoE與門禁周邊</span>
        <span className="mt-1 block lg:mt-0">提供全方位監控器材配貨與原廠級技術支援</span>
      </p>
    </section>
  );
}
