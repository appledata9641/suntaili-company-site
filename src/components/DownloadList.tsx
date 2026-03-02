import Link from "next/link";
import type { DownloadItem, DownloadType } from "@/types/download";

interface DownloadListRow extends DownloadItem {
  productName: string;
}

interface DownloadListProps {
  items: DownloadListRow[];
}

const typeLabelMap: Record<DownloadType, string> = {
  firmware: "韌體",
  software: "軟體工具",
  manual: "說明文件",
};

export default function DownloadList({ items }: DownloadListProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">產品 / 檔案</th>
              <th className="px-4 py-3">類型</th>
              <th className="px-4 py-3">版本</th>
              <th className="px-4 py-3">更新日期</th>
              <th className="px-4 py-3">大小</th>
              <th className="px-4 py-3 text-right">下載</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {item.productName} ({item.productModel})
                  </div>
                  {item.notes ? (
                    <div className="mt-1 text-xs text-slate-500">{item.notes}</div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{typeLabelMap[item.type]}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{item.version}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{item.releaseDate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{item.fileSize}</td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={item.downloadUrl}
                    className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-slate-400"
                  >
                    下載
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-xs text-slate-600">
                  {item.productName} ({item.productModel})
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                {typeLabelMap[item.type]}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>版本：{item.version}</div>
              <div>大小：{item.fileSize}</div>
              <div>日期：{item.releaseDate}</div>
              {item.minHwVersion ? <div>硬體：{item.minHwVersion}</div> : null}
            </div>
            {item.notes ? <p className="mt-3 text-xs text-slate-500">{item.notes}</p> : null}
            <Link
              href={item.downloadUrl}
              className="mt-4 inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800"
            >
              下載檔案
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
