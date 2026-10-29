import Link from "next/link";
import { ArrowRightLine, Camera4Line, ComputerLine, MapPinLine, RulerLine } from "@/components/icons";
import { wideButtonClass } from "@/components/inquiry/buttons";

// 案例場景頁最下方的引導橫幅：左側標語、中間 2×2 需求提示、右側「填寫表單需求」。
const needs = [
  { icon: MapPinLine, title: "安裝環境", description: "室內、室外，特殊場域" },
  { icon: Camera4Line, title: "設備數量", description: "預計安裝或更換機台" },
  { icon: RulerLine, title: "監控距離", description: "拍攝範圍與遠近需求" },
  { icon: ComputerLine, title: "現有設備", description: "主機、線路或舊設備" },
];

export default function CasesCta() {
  return (
    <section
      aria-labelledby="cases-cta-title"
      className="bg-brand-panel bg-[url('/images/site/cases/cta-banner.webp')] bg-cover bg-center text-brand-blue"
    >
      {/* 手機：上下堆疊；lg：左側標語＋按鈕、右側需求提示；xl：同設計稿排成一列 */}
      <div className="mx-auto flex max-w-[1154px] flex-col gap-8 px-5 py-10 sm:px-8 lg:grid lg:grid-cols-[auto_auto] lg:items-center lg:justify-between lg:gap-x-10 lg:gap-y-6 xl:flex xl:h-[193px] xl:flex-row xl:gap-6 xl:py-0 xl:pl-[22px] xl:pr-0">
        <div>
          <h2 id="cases-cta-title" className="text-[24px] font-medium leading-[1.2] tracking-[0.1em] lg:text-[30px]">
            <span className="block sm:inline">不知如何挑選？</span>
            <span className="block sm:inline">讓我們幫您搭配</span>
          </h2>
          <p className="mt-2 text-[15px] leading-[1.4] tracking-[0.1em] lg:mt-[6px] lg:text-lg lg:leading-[1.2]">
            <span className="block sm:inline">提供您的需求，</span>
            <span className="block sm:inline">協助您找到合適的監視器與相關設備</span>
          </p>
        </div>
        <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:row-span-2 lg:grid-cols-[213px_auto] lg:gap-x-0 lg:gap-y-8">
          {needs.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-center gap-[14px]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white">
                <Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-lg leading-[1.2] tracking-[0.09em]">{title}</span>
                <span className="mt-[3px] block text-xs font-medium leading-[1.2] tracking-[0.12em]">{description}</span>
              </span>
            </li>
          ))}
        </ul>
        <Link href="/inquiry/#project-form" className={wideButtonClass("primary", "shrink-0 lg:self-start xl:self-auto")}>
          <span className="flex-1 text-center">填寫表單需求</span>
          <ArrowRightLine className="h-[27px] w-[27px] shrink-0" />
        </Link>
      </div>
    </section>
  );
}
