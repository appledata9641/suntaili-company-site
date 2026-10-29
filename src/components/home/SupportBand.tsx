import Image from "next/image";
import HomeButton from "@/components/home/HomeButton";

// 主頁下方「技術支援·文件下載」橫幅（設計稿高 194px），右側兩個按鈕上下排列
export default function SupportBand() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-blue">
      <Image
        src="/images/site/home/band-support.webp"
        alt=""
        fill
        sizes="100vw"
        loading="lazy"
        className="-z-10 object-cover"
      />
      <div className="mx-auto flex max-w-[1154px] flex-col gap-8 px-5 py-10 sm:px-8 lg:min-h-[194px] lg:flex-row lg:items-center lg:justify-between lg:py-[30px] xl:pl-[57px] xl:pr-0">
        <div className="text-white">
          <p className="text-base font-bold leading-6 tracking-[0.07em] lg:text-lg">技術支援·文件下載</p>
          <h2 className="mt-1.5 text-[22px] font-bold leading-snug tracking-[0.1em] sm:text-[26px] lg:mt-[6px] lg:text-[30px] lg:leading-10">
            找型號、查規格、下載文件，一次搞定
          </h2>
          <p className="mt-1.5 text-[15px] font-medium leading-6 tracking-[0.06em] lg:mt-[3px] lg:text-base">
            查規格、確認案場適用性，或下載軟體與操作手冊，所需資料一次找齊。
          </p>
        </div>
        <div className="flex gap-3 lg:flex-col lg:gap-4">
          <HomeButton href="/inquiry/" variant="light" className="flex-1 lg:flex-none">
            詢價與合作
          </HomeButton>
          <HomeButton href="/resources/" variant="ghost" icon="download" labelOffsetClass="lg:pr-[20px]" className="flex-1 lg:flex-none">
            文件下載
          </HomeButton>
        </div>
      </div>
    </section>
  );
}
