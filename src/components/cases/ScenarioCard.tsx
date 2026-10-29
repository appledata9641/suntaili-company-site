import Image from "next/image";
import { chipClass } from "@/components/ui/styles";
import type { ApplicationScenario } from "@/data/cases";

// 應用場域卡片：上方 470×149 圖片、標題壓在左下；下方說明文字與設備標籤。
export default function ScenarioCard({ scenario }: { scenario: ApplicationScenario }) {
  return (
    <article className="flex flex-col bg-white">
      <div className="relative aspect-[471/149] overflow-hidden bg-brand-navy">
        <Image
          src={scenario.image}
          alt=""
          fill
          sizes="(min-width: 768px) 471px, 100vw"
          className="object-cover"
        />
        <h3 className="absolute bottom-[18px] left-5 right-5 text-lg font-medium leading-[1.2] tracking-[0.15em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.35)] sm:left-[35px] lg:bottom-[26px] lg:text-xl">
          {scenario.title}
        </h3>
      </div>
      <div className="flex-1 border border-t-0 border-brand-line px-5 pb-4 pt-[14px] sm:px-[34px]">
        <p className="text-sm font-medium leading-[1.36] tracking-[0.15em] text-brand-navy">
          {scenario.description.map((line) => (
            <span key={line} className="lg:block">
              {line}
            </span>
          ))}
        </p>
        <ul className="mt-[21px] flex flex-wrap gap-1.5" aria-label="常用設備">
          {scenario.products.map((product) => (
            <li key={product} className={chipClass("outline")}>
              {product}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
