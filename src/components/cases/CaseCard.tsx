import Image from "next/image";
import Link from "next/link";
import { ArrowRightLine } from "@/components/icons";
import { chipClass } from "@/components/ui/styles";
import type { CaseStudy } from "@/data/cases";

// 實際案例卡片（303×361）：照片已內含下方深色漸層；整張卡片可點，連結文字是「閱讀完整案例」。
export default function CaseCard({ item }: { item: CaseStudy }) {
  return (
    <article className="group relative isolate flex h-[361px] w-[303px] max-w-full flex-col justify-end overflow-hidden bg-brand-navy px-[31px] pb-[18px] text-white">
      <Image
        src={item.image}
        alt=""
        width={303}
        height={361}
        sizes="303px"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      <p className="absolute right-4 top-[18px] text-lg leading-[1.2] tracking-[0.17em]">實景完工照</p>
      <p className="text-sm font-medium leading-[1.2] tracking-[0.14em]">案場名稱</p>
      <h3 className="mt-[2px] text-lg font-medium leading-[1.2] tracking-[0.14em]">{item.name}</h3>
      {/* 標籤列可延伸到右側留白，三個標籤時維持一行（同設計稿） */}
      <ul className="-mr-[14px] mt-[25px] flex flex-wrap gap-[7px]" aria-label="使用設備">
        {item.tags.map((tag) => (
          <li key={tag} className={chipClass("outlineLight", "tracking-normal!")}>
            {tag}
          </li>
        ))}
      </ul>
      <Link
        href={item.href}
        className="mt-3 inline-flex items-center self-start text-xs font-medium leading-[1.2] tracking-[0.17em] after:absolute after:inset-0 group-hover:underline focus-visible:outline-white!"
      >
        閱讀完整案例
        <span className="sr-only">：{item.name}</span>
        <ArrowRightLine className="h-4 w-4" />
      </Link>
    </article>
  );
}
