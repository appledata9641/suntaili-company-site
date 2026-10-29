import Image from "next/image";
import { companyHistory } from "@/data/about";

// 公司歷程時間軸：左側虛線＋圓點、年份 30pt #5b6d8b、說明 18pt #8a95a2，部分年份右側附圖（226×102）
export default function CompanyTimeline() {
  return (
    <div className="relative mx-auto max-w-[688px]">
      {/* 虛線：線段 6px、間隔 4px，從第一個圓點到最後一段文字底部 */}
      <span
        aria-hidden
        className="absolute bottom-[25px] left-[6px] top-[19px] w-px bg-[repeating-linear-gradient(to_bottom,#8a95a2_0_6px,transparent_6px_10px)]"
      />
      <ol>
        {companyHistory.map((entry) => (
          <li key={entry.period} className="relative pb-[22px] pl-10 sm:pl-[48px]">
            <span aria-hidden className="absolute left-0 top-[19px] h-3 w-3 rounded-full bg-brand-blue" />
            <div className="md:max-w-[390px]">
              <h3 className="text-[26px] font-bold leading-10 tracking-[0.02em] text-brand-blue lg:text-[30px]">{entry.period}</h3>
              <p className="mt-2 text-base font-bold leading-[22px] tracking-[0.08em] text-brand-grey sm:mt-[16.4px] lg:text-lg">
                {entry.description}
              </p>
            </div>
            {entry.image ? (
              <Image
                src={entry.image.src}
                alt={entry.image.alt}
                width={226}
                height={102}
                loading="lazy"
                className="mt-4 h-auto w-full max-w-[226px] md:absolute md:right-0 md:top-[5px] md:mt-0"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
