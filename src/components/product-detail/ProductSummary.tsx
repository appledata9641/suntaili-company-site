import Link from "next/link";
import { FileUnknowLine } from "@/components/icons";
import { buttonClass, chipClass } from "@/components/ui/styles";
import DownloadsMenu from "@/components/product-detail/DownloadsMenu";
import ProductGallery from "@/components/product-detail/ProductGallery";
import type { ProductDownloadEntry } from "@/components/product-detail/product-detail-data";
import {
  brandLabels,
  getProductCenterCategory,
  getProductCenterCategoryLabel,
  productsHref,
} from "@/lib/catalog";
import { getProductCategory, getProductUse } from "@/lib/product-content";
import type { Product } from "@/types/product";

interface ProductSummaryProps {
  product: Product;
  imageAlt: string;
  downloads: ProductDownloadEntry[];
}

// 品名中的英數型號（例如 AC-229D）不要在連字號處斷行
function renderName(name: string) {
  return name
    .split(/(\s+)/)
    .map((part, index) =>
      /[A-Za-z0-9]-[A-Za-z0-9]/.test(part) ? (
        <span key={index} className="whitespace-nowrap">
          {part}
        </span>
      ) : (
        part
      ),
    );
}

// 內容框可捲動時，上下緣出現淡淡的陰影提示還有內容（純 CSS，不能捲動時不會出現）
const scrollHintStyle = {
  background: [
    "linear-gradient(#fff 30%, rgb(255 255 255 / 0)) center top / 100% 32px no-repeat local",
    "linear-gradient(rgb(255 255 255 / 0), #fff 70%) center bottom / 100% 32px no-repeat local",
    "radial-gradient(farthest-side at 50% 0, rgb(32 54 86 / 0.14), rgb(32 54 86 / 0)) center top / 100% 10px no-repeat scroll",
    "radial-gradient(farthest-side at 50% 100%, rgb(32 54 86 / 0.14), rgb(32 54 86 / 0)) center bottom / 100% 10px no-repeat scroll",
    "#fff",
  ].join(", "),
};

// 產品頁上方：淺灰底＋白色卡片（左：圖庫；右：分類標籤、品名、用途與特色、詢價與下載按鈕）
export default function ProductSummary({ product, imageAlt, downloads }: ProductSummaryProps) {
  const centerCategory = getProductCenterCategory(product);
  const categoryName = getProductCategory(product)?.name;
  const images = [product.coverImage, ...(product.gallery ?? [])].filter(
    (src, index, list) => Boolean(src) && list.indexOf(src) === index,
  );
  const use = getProductUse(product) || product.shortDescription;

  return (
    <section className="bg-brand-panel">
      <div className="mx-auto max-w-[1067px] px-4 pb-10 pt-5 lg:pb-[104px] lg:pt-[58px]">
        <nav aria-label="麵包屑" className="mb-4 lg:mb-[22px]">
          <ol className="flex flex-wrap items-center gap-x-1.5 text-xs leading-4 tracking-[0.04em] text-brand-grey">
            <li>
              <Link href="/products/" className="hover:text-brand-navy hover:underline">
                產品中心
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href={productsHref({ category: centerCategory })} className="hover:text-brand-navy hover:underline">
                {getProductCenterCategoryLabel(centerCategory)}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="min-w-0 break-all">
              {product.model}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 bg-white px-4 py-6 shadow-[0_2px_12px_rgba(32,54,86,0.1)] sm:px-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-x-8 md:gap-y-0 lg:grid-cols-[353px_minmax(0,1fr)] lg:gap-x-[63px] lg:pb-[34px] lg:pl-[60px] lg:pr-[40px] lg:pt-[34px] xl:pl-[91px] xl:pr-[60px]">
          <ProductGallery images={images} alt={imageAlt} />

          <div className="flex min-w-0 flex-col lg:pt-[22px]">
            <div className="flex flex-wrap gap-[5px]">
              {categoryName ? <span className={chipClass("solid")}>{categoryName}</span> : null}
              <span className={chipClass("outline")}>{product.model}</span>
              <span className={chipClass("outline")}>{brandLabels[product.brand]}</span>
            </div>

            <h1 className="mt-[13px] text-balance break-keep text-[20px] font-bold leading-[1.4] text-brand-navy [overflow-wrap:anywhere] lg:text-[24px]">{renderName(product.name)}</h1>

            {product.legacyModels?.length ? (
              <p className="mt-1 text-[10px] leading-[14px] tracking-[0.04em] text-brand-grey">
                舊型號 {product.legacyModels.join("、")}
              </p>
            ) : null}

            <div
              className="scroll-panel mt-[12px] border border-t-[3px] border-brand-line px-5 py-6 sm:px-10 sm:py-[26px] lg:min-h-[180px] lg:max-w-[437px] lg:grow lg:basis-0 lg:overflow-y-auto lg:pb-4"
              style={scrollHintStyle}
            >
              <h2 className="text-sm font-bold leading-5 text-brand-navy">用途</h2>
              <p className="mt-[7px] text-xs font-medium leading-[19px] text-brand-muted">{use}</p>

              {product.featureBullets.length > 0 ? (
                <>
                  <h2 className="mt-4 text-sm font-bold leading-5 text-brand-navy">產品特色</h2>
                  <ul className="mt-[8px] text-xs font-medium leading-[19px] text-brand-muted">
                    {product.featureBullets.map((feature) => (
                      <li key={feature} className="flex">
                        <span aria-hidden="true" className="shrink-0 [font-feature-settings:normal]">
                          ・
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-[9px] sm:flex sm:justify-end lg:mt-[42px] lg:max-w-[435px] lg:pb-[2px]">
              <Link
                href={`/inquiry/?model=${encodeURIComponent(product.model)}#bulk-form`}
                data-ga-event="inquiry_click"
                data-ga-category="lead"
                data-ga-label={product.model}
                className={buttonClass("primary", "sm", "pl-8 pr-3 max-lg:h-11 max-sm:px-3")}
              >
                詢問此型號
                <FileUnknowLine className="h-[18px] w-[18px]" />
              </Link>
              <DownloadsMenu model={product.model} items={downloads} className="max-sm:px-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
