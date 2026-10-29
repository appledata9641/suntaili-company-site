import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { Archive2Line, EditLine, WrenchLine } from "@/components/icons";

const services: { title: string; description: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  {
    title: "監控器材批發配貨",
    description: "依案場需求協助搭配攝影機、錄影主機、PoE、線材與周邊設備",
    Icon: Archive2Line,
  },
  {
    title: "AHD 攝影機組裝客製",
    description: "可依解析度、外型、鏡頭焦距、夜視距離與安裝環境討論配置",
    Icon: EditLine,
  },
  {
    title: "弱電整合技術支援",
    description: "協助整合商評估規格相容、建議替代型號與售後對接",
    Icon: WrenchLine,
  },
];

// 主頁「工廠直營·客製服務」橫幅：左側說明、右側三項服務（圖示框 44×44、圓角 8px）
export default function ServiceBand() {
  return (
    <section className="relative isolate overflow-hidden bg-[#dde4ee]">
      <Image
        src="/images/site/home/band-factory.webp"
        alt=""
        fill
        sizes="100vw"
        loading="lazy"
        className="-z-10 object-cover object-left"
      />
      <div className="mx-auto grid max-w-[1140px] gap-10 px-5 py-12 sm:px-8 lg:min-h-[362px] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:py-10 xl:grid-cols-[642px_minmax(0,1fr)] xl:gap-0 xl:pl-[22px] xl:pr-0">
        <div className="[text-shadow:0_1px_8px_rgba(32,54,86,0.25)]">
          <p className="text-base font-bold leading-6 tracking-[0.07em] text-white lg:text-lg">工廠直營·客製服務</p>
          <h2 className="mt-2 text-[24px] font-bold leading-[1.35] tracking-[0.1em] text-white lg:text-[30px] lg:leading-10">
            穩定供貨與客製支援
          </h2>
          <p className="mt-1 max-w-[530px] text-base font-medium leading-6 tracking-[0.07em] text-white lg:text-lg">
            網站不做購物車與零售結帳，重點放在<strong className="font-black">型號查詢</strong>、
            <strong className="font-black">文件下載</strong>、
            <br className="hidden xl:inline" />
            <strong className="font-black">案場詢價</strong>與
            <strong className="font-black">合作溝通</strong>
          </p>
        </div>

        <ul className="grid gap-6 rounded-[5px] bg-white/85 p-5 sm:p-6 lg:gap-[39.5px] lg:bg-transparent lg:p-0">
          {services.map(({ title, description, Icon }) => (
            <li key={title} className="flex items-center gap-[14px]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-brand-blue text-white">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-base font-bold leading-[22px] tracking-[0.1em] text-brand-blue lg:text-lg">{title}</h3>
                <p className="text-[13px] font-bold leading-[18px] tracking-[0.08em] text-brand-blue lg:text-sm xl:whitespace-nowrap">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
