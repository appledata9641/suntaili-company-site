import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import DimensionFigure from "@/components/product-detail/DimensionFigure";
import { parseDimensions } from "@/components/product-detail/product-detail-data";
import type { Product, ProductSpec } from "@/types/product";

interface DimensionSectionProps {
  product: Product;
  spec: ProductSpec;
  imageAlt: string;
}

// 產品尺寸：目前還沒有正式尺寸圖，先用產品照片加上依規格數字畫的標線示意
export default function DimensionSection({ product, spec, imageAlt }: DimensionSectionProps) {
  const dimensions = parseDimensions(spec.value, product);

  return (
    <section id="dimensions" aria-labelledby="dimensions-title" className="scroll-mt-[114px]! px-4 pt-14 lg:scroll-mt-[134px]! lg:pt-[62px]">
      <SectionTitle title={<span id="dimensions-title">產品尺寸</span>} />
      <div className="mx-auto mt-6 max-w-[896px] border border-brand-frame px-5 pb-8 pt-6 sm:px-10 sm:pb-9 sm:pt-[41px] lg:mt-[25px]">
        <p className="text-sm font-medium text-brand-muted sm:text-[18px] sm:leading-[26px]">(尺寸單位mm)</p>
        {dimensions ? (
          <div className="pt-12 sm:pt-10">
            <DimensionFigure
              src={product.coverImage}
              alt={`${imageAlt} 尺寸示意`}
              widthLabel={dimensions.width}
              heightLabel={dimensions.height}
            />
          </div>
        ) : (
          <div className="relative mx-auto mt-6 aspect-[16/10] w-full max-w-[360px]">
            <Image src={product.coverImage} alt={`${imageAlt} 尺寸示意`} fill sizes="360px" className="object-contain" />
          </div>
        )}
        <p className="mt-4 text-center text-xs leading-5 text-brand-grey sm:text-sm">
          {spec.label}：{spec.value}
        </p>
      </div>
    </section>
  );
}
