import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { chipClass } from "@/components/ui/styles";
import CompareLinkButton from "@/components/product-detail/CompareLinkButton";
import { shortProductName } from "@/components/product-detail/product-detail-data";
import { productHref } from "@/lib/catalog";
import type { Product } from "@/types/product";

interface CompareSectionProps {
  product: Product;
  related: Product[];
}

// 型號只在「英文段」前斷行，例如 TH-CR-200BN-AHD-／DR-02，不會把結尾的 -02 拆開
function ModelText({ model }: { model: string }) {
  const groups: string[] = [];
  for (const part of model.split("-")) {
    if (groups.length > 0 && /^\d+$/.test(part)) groups[groups.length - 1] += `-${part}`;
    else groups.push(part);
  }
  return groups.map((group, index) => (
    <span key={index} className="whitespace-nowrap">
      {group}
      {index < groups.length - 1 ? "-" : ""}
    </span>
  ));
}

function CardBody({ product }: { product: Product }) {
  return (
    <>
      <div className="relative min-h-[84px] flex-1">
        <Image
          src={product.coverImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 25vw, 45vw"
          className="object-contain"
        />
      </div>
      <p className="mt-2 text-sm font-bold leading-[1.3] text-brand-navy [overflow-wrap:anywhere] sm:text-base">
        <ModelText model={product.model} />
      </p>
      <p className="mt-1 line-clamp-2 break-keep text-xs font-medium leading-[17px] text-brand-muted [overflow-wrap:anywhere]">{shortProductName(product)}</p>
    </>
  );
}

// 型號比較：目前型號＋同類型的推薦型號，最後一顆按鈕帶去比較頁
export default function CompareSection({ product, related }: CompareSectionProps) {
  const cardClass = "relative flex h-[200px] flex-col rounded-[3px] border border-brand-line bg-white px-3 pb-3 pt-4 sm:h-[211px] sm:px-4";

  return (
    <section id="compare" aria-labelledby="compare-title" className="mt-14 scroll-mt-[114px]! bg-brand-panel px-4 pb-12 pt-10 lg:mt-[53px] lg:scroll-mt-[134px]! lg:pb-[53px] lg:pt-[33px]">
      <SectionTitle title={<span id="compare-title">型號比較</span>} />
      <ul className="mx-auto mt-6 grid max-w-[896px] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-[34px]">
        <li className={cardClass} aria-current="page">
          <span className={chipClass("solid", "absolute left-2 top-2 z-[1]")}>目前型號</span>
          <CardBody product={product} />
        </li>
        {related.map((item) => (
          <li key={item.slug} className="flex">
            <Link href={productHref(item)} className={`${cardClass} w-full hover:border-brand-blue`}>
              <CardBody product={item} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <CompareLinkButton slugs={[product.slug, ...related.map((item) => item.slug)]} />
      </div>
    </section>
  );
}
