"use client";

import { useId } from "react";
import Dropdown, { type DropdownOption } from "@/components/ui/Dropdown";

// 文件下載的篩選列：依設計稿「產品分類｜檔案類型｜搜尋關鍵字」，標籤 18pt 深藍（設計稿字重約 Medium），選單 186px 寬。
interface DownloadFiltersProps<C extends string, T extends string> {
  categoryOptions: DropdownOption<C>[];
  category: C;
  onCategoryChange: (value: C) => void;
  typeOptions: DropdownOption<T>[];
  type: T;
  onTypeChange: (value: T) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
}

const labelClass = "w-[92px] shrink-0 text-lg font-medium text-brand-navy lg:w-auto";

export default function DownloadFilters<C extends string, T extends string>({
  categoryOptions,
  category,
  onCategoryChange,
  typeOptions,
  type,
  onTypeChange,
  keyword,
  onKeywordChange,
}: DownloadFiltersProps<C, T>) {
  const keywordId = useId();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
      <div className="flex items-center gap-3.5">
        <span className={labelClass} aria-hidden="true">
          產品分類
        </span>
        <Dropdown
          value={category}
          options={categoryOptions}
          onChange={onCategoryChange}
          ariaLabel="產品分類"
          className="min-w-0 flex-1 lg:w-[186px] lg:flex-none"
        />
      </div>
      <div className="flex items-center gap-3.5">
        <span className={labelClass} aria-hidden="true">
          檔案類型
        </span>
        <Dropdown
          value={type}
          options={typeOptions}
          onChange={onTypeChange}
          ariaLabel="檔案類型"
          className="min-w-0 flex-1 lg:w-[186px] lg:flex-none"
        />
      </div>
      <div className="flex items-center gap-3.5 lg:min-w-0 lg:flex-1">
        <label htmlFor={keywordId} className={labelClass}>
          搜尋關鍵字
        </label>
        <input
          id={keywordId}
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="例如：AHD、NVR、說明書、工具"
          autoComplete="off"
          enterKeyHint="search"
          className="h-[34px] w-full min-w-0 flex-1 rounded-[3px] border border-brand-grey bg-white px-3 text-sm font-medium tracking-[0.04em] text-brand-blue placeholder:font-normal placeholder:text-brand-grey hover:border-brand-blue focus:border-brand-blue"
        />
      </div>
    </div>
  );
}
