import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowRightLine, ArticleLine, Box3Fill, FileList3Line, GridFill } from "@/components/icons";

const steps = ["提供案場需求或採購清單", "確認產品型號、數量與搭配方式", "回覆報價、交期與可替代方案", "出貨後提供必要技術文件與支援"];

// 右側流程圖示：依設計稿左右交錯，位置為相對於圖示區左上角（px）
const flowIcons: { Icon: ComponentType<SVGProps<SVGSVGElement>>; left: number; top: number }[] = [
  { Icon: ArticleLine, left: 0, top: 0 },
  { Icon: GridFill, left: 103, top: 60 },
  { Icon: FileList3Line, left: 0, top: 118 },
  { Icon: Box3Fill, left: 103, top: 181 },
];

const scenarios = [
  { title: "商用空間", image: "/images/home/app-office.webp" },
  { title: "住宅社區", image: "/images/home/app-residential.webp" },
  { title: "工廠倉儲", image: "/images/home/app-warehouse.webp" },
];

// 虛線：線段 6px、間隔 4px（設計稿 #8a95a2）
const dashedVertical = "bg-[repeating-linear-gradient(to_bottom,#8a95a2_0_6px,transparent_6px_10px)]";
const dashedHorizontal = "bg-[repeating-linear-gradient(to_right,#8a95a2_0_6px,transparent_6px_10px)]";

function ColumnTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h2 className="text-[24px] font-medium leading-[1.4] tracking-[0.1em] text-brand-navy lg:text-[30px] lg:leading-[42px]">{title}</h2>
      <p className="mt-1 text-[15px] font-bold leading-relaxed tracking-[0.08em] text-brand-grey lg:mt-0 lg:text-lg lg:leading-[27px]">
        {description}
      </p>
    </div>
  );
}

// 主頁「合作流程」與「配置情境」兩欄，中間以細線分隔
export default function CooperationSection() {
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-4 lg:pb-[70px] lg:pt-[77px]">
      <div className="relative mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-2 lg:gap-0 lg:pb-[30px]">
        <span aria-hidden className="absolute inset-y-0 left-1/2 hidden w-[2px] -translate-x-1/2 bg-brand-line lg:block" />

        {/* 合作流程 */}
        <div className="lg:px-6">
          <ColumnTitle title="系統整合商與經銷商合作流程" description="適合大量採購、專案配貨、型號替代、既有案場升級與售後支援" />
          <div className="mx-auto mt-8 flex max-w-[451px] items-start justify-between gap-4 lg:mt-[32px] xl:ml-[89px] xl:mr-0">
            <ol className="grid gap-5 sm:gap-y-[39.67px] sm:pt-[9px]">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-2 text-[15px] font-bold leading-6 tracking-[0.1em] text-brand-grey sm:min-h-6 sm:text-base"
                >
                  <span
                    aria-hidden
                    className="mt-[3.5px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-brand-grey text-[11px] font-bold leading-none tracking-normal text-white"
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="sr-only">步驟 {index + 1}：</span>
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            {/* 流程圖示與虛線連接 */}
            <div aria-hidden className="relative hidden h-[233px] w-[155px] shrink-0 sm:block">
              <span className={`absolute left-[76px] top-[25px] h-[183px] w-px ${dashedVertical}`} />
              {flowIcons.map(({ Icon, left, top }) => {
                const onLeft = left === 0;
                return (
                  <span key={top}>
                    <span
                      className={`absolute h-px ${dashedHorizontal}`}
                      style={{ top: top + 25, left: onLeft ? 52 : 77, width: onLeft ? 25 : 26 }}
                    />
                    <span
                      className="absolute flex h-[52px] w-[52px] items-center justify-center rounded-[8px] border-2 border-brand-navy bg-white text-brand-navy"
                      style={{ top, left }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 配置情境 */}
        <div className="lg:px-6">
          <ColumnTitle title="常見監控與弱電配置情境" description="根據現場環境、距離與供電需求，規劃最適化的產品組合" />
          <ul className="mx-auto mt-8 grid max-w-[520px] grid-cols-3 gap-3 sm:gap-[27.5px] lg:mt-[33px] xl:ml-[40px] xl:mr-0">
            {scenarios.map((scenario) => (
              <li key={scenario.title}>
                <Link
                  href="/applications/#scenarios"
                  className="group block bg-white shadow-[2px_2px_6px_rgba(0,0,0,0.16)] transition-shadow hover:shadow-[3px_5px_14px_rgba(32,54,86,0.22)]"
                >
                  <span className="flex h-[56px] items-center justify-between gap-1 px-2.5 text-sm font-bold tracking-[0.08em] text-brand-blue sm:h-[72px] sm:px-[14px] sm:pb-[14px] sm:text-base">
                    {scenario.title}
                    <ArrowRightLine className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
                  </span>
                  <Image
                    src={scenario.image}
                    alt=""
                    width={360}
                    height={440}
                    loading="lazy"
                    sizes="(min-width: 640px) 155px, 33vw"
                    className="aspect-[155/188] w-full object-cover"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
