"use client";

import type { DownloadType } from "@/types/download";

interface FilterOption {
  id: string;
  label: string;
}

interface DownloadFiltersProps {
  categoryOptions: FilterOption[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  activeType: DownloadType | "all";
  onTypeChange: (value: DownloadType | "all") => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

const typeOptions: Array<{ id: DownloadType | "all"; label: string }> = [
  { id: "all", label: "全部類型" },
  { id: "manual", label: "說明文件" },
  { id: "software", label: "軟體工具" },
];

export default function DownloadFilters({
  categoryOptions,
  activeCategory,
  onCategoryChange,
  activeType,
  onTypeChange,
  searchTerm,
  onSearchTermChange,
}: DownloadFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1.4fr]">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-800">產品分類</span>
          <select
            value={activeCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
          >
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-800">檔案類型</span>
          <select
            value={activeType}
            onChange={(event) => onTypeChange(event.target.value as DownloadType | "all")}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
          >
            {typeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-800">搜尋型號 / 關鍵字</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="例如：NVR、AHD、說明書、工具"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-500"
          />
        </label>
      </div>
    </div>
  );
}
