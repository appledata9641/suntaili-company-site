import type { AnchorHTMLAttributes } from "react";

// 文件下載列表：桌機用表格（依設計稿欄位與欄寬），手機改成一筆一張卡片。
export interface DownloadRow {
  id: string;
  title: string;
  // 產品名稱（型號），例如「三泰利 VMS 管理平台 (RD 中控軟體)」
  productLabel: string;
  notes?: string;
  typeLabel: string;
  version?: string;
  releaseDate: string;
  fileSize: string;
  downloadUrl: string;
}

interface DownloadListProps {
  items: DownloadRow[];
}

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

// 外部連結（雲端硬碟）另開分頁；網站上的檔案直接下載
function downloadLinkProps(item: DownloadRow): AnchorHTMLAttributes<HTMLAnchorElement> {
  return isExternal(item.downloadUrl)
    ? { href: item.downloadUrl, target: "_blank", rel: "noopener noreferrer" }
    : { href: item.downloadUrl, download: true };
}

function DownloadLabel({ item }: { item: DownloadRow }) {
  return (
    <>
      下載<span className="sr-only">：{item.title}{isExternal(item.downloadUrl) ? "（另開新視窗）" : ""}</span>
    </>
  );
}

const buttonClass =
  "inline-flex items-center justify-center rounded-[3px] bg-brand-blue text-xs font-bold tracking-[0.08em] text-white hover:bg-brand-navy";

const cellClass = "px-2 text-center align-middle text-xs text-brand-muted";

export default function DownloadList({ items }: DownloadListProps) {
  return (
    <>
      <table className="hidden w-full table-fixed border-collapse md:table">
        <caption className="sr-only">文件下載列表</caption>
        <colgroup>
          <col className="w-[32.6%]" />
          <col className="w-[17.2%]" />
          <col className="w-[8%]" />
          <col className="w-[15.1%]" />
          <col className="w-[13.2%]" />
          <col />
        </colgroup>
        <thead>
          <tr className="border-y-2 border-brand-line bg-brand-panel text-base font-medium text-brand-navy">
            <th scope="col" className="h-[60px] pl-7 pr-2 text-left font-medium">
              產品 / 文件
            </th>
            <th scope="col" className="px-2 font-medium">
              類型
            </th>
            <th scope="col" className="px-2 font-medium">
              版本
            </th>
            <th scope="col" className="px-2 font-medium">
              更新日期
            </th>
            <th scope="col" className="px-2 font-medium">
              檔案大小
            </th>
            <th scope="col" className="px-2 font-medium">
              下載
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-brand-line">
              <th scope="row" className="pb-[13px] pl-7 pr-2 pt-[14px] text-left align-middle font-normal">
                <span className="block text-sm leading-5 text-brand-navy">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-[18px] text-brand-grey">{item.productLabel}</span>
                {item.notes ? <span className="block text-[10px] leading-4 text-brand-grey">{item.notes}</span> : null}
              </th>
              <td className={cellClass}>{item.typeLabel}</td>
              <td className={cellClass}>{item.version ?? "—"}</td>
              <td className={cellClass}>{item.releaseDate}</td>
              <td className={cellClass}>{item.fileSize}</td>
              <td className="px-2 text-center align-middle">
                <a {...downloadLinkProps(item)} className={`${buttonClass} h-[30px] w-[60px]`}>
                  <DownloadLabel item={item} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="border-t-2 border-brand-line md:hidden">
        {items.map((item) => (
          <li key={item.id} className="border-b border-brand-line py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-6 text-brand-navy">{item.title}</p>
                <p className="mt-0.5 text-xs leading-[18px] text-brand-grey">{item.productLabel}</p>
                {item.notes ? <p className="mt-0.5 text-[11px] leading-4 text-brand-grey">{item.notes}</p> : null}
              </div>
              <a {...downloadLinkProps(item)} className={`${buttonClass} h-10 w-16 shrink-0`}>
                <DownloadLabel item={item} />
              </a>
            </div>
            <dl className="mt-3 grid grid-cols-4 gap-2 rounded-[3px] bg-brand-panel px-2 py-2 text-center">
              {[
                ["類型", item.typeLabel],
                ["版本", item.version ?? "—"],
                ["更新日期", item.releaseDate],
                ["檔案大小", item.fileSize],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[11px] leading-4 text-brand-grey">{label}</dt>
                  <dd className="mt-0.5 break-words text-xs leading-4 text-brand-muted">{value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
