import Image from "next/image";
import Link from "next/link";
import type { CatalogEntry } from "@/components/catalog/catalog-data";
import { DownloadLine } from "@/components/icons";

// 一個型錄分類：標題「▍半球型攝影機」＋型錄縮圖（桌機一列 6 張）。
// 點縮圖開啟型錄檔（另開分頁），點型號前往產品頁，點「下載型錄」直接下載檔案。
interface CatalogSectionProps {
  id: string;
  title: string;
  entries: CatalogEntry[];
}

export default function CatalogSection({ id, title, entries }: CatalogSectionProps) {
  const headingId = `catalog-${id}`;
  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="flex items-center gap-2.5 pl-[3px] text-lg font-medium leading-7 tracking-[0.04em] text-brand-navy lg:text-xl"
      >
        <span aria-hidden="true" className="h-[18px] w-[3px] shrink-0 bg-brand-navy lg:h-[19px]" />
        {title}
      </h2>
      <ul className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-[25px] lg:gap-y-10">
        {entries.map((entry) => (
          <li key={entry.id} className="flex min-w-0 flex-col items-center">
            <a
              href={entry.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[150/212] w-full overflow-hidden border border-brand-line bg-white hover:border-brand-grey"
            >
              <Image
                src={entry.image}
                alt={`${entry.model} 產品型錄`}
                fill
                sizes="(min-width: 1024px) 150px, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 46vw"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="sr-only">（另開新視窗）</span>
            </a>
            <Link
              href={entry.productUrl}
              className="mt-1.5 max-w-full text-balance break-words text-center text-[15px] leading-6 text-brand-blue underline decoration-1 underline-offset-[3px] hover:text-brand-navy lg:text-base"
            >
              {entry.model}
              <span className="sr-only"> 產品介紹</span>
            </Link>
            <a
              href={entry.fileUrl}
              {...(entry.external ? { target: "_blank", rel: "noopener noreferrer" } : { download: entry.downloadName })}
              data-ga-event="download_click"
              data-ga-category="catalog"
              data-ga-label={entry.id}
              className="mt-auto inline-flex h-8 items-center gap-1 rounded-[3px] px-2 text-[13px] font-medium tracking-[0.04em] text-brand-grey hover:bg-brand-panel hover:text-brand-navy"
            >
              <DownloadLine className="h-4 w-4" />
              下載型錄
              <span className="sr-only">
                ：{entry.model}
                {entry.external ? "（另開新視窗）" : ""}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
