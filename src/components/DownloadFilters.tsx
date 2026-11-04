"use client";

import { useId, useRef } from "react";
import Dropdown, { type DropdownOption } from "@/components/ui/Dropdown";

// 文件下載的篩選列：依設計稿「產品分類｜檔案類型｜搜尋關鍵字」，標籤 18pt 深藍（設計稿字重約 Medium），選單 186px 寬。
// 手機版搜尋框字級 16px：小於 16px 時 iPhone 點進輸入框會自動放大畫面。
interface DownloadFiltersProps<C extends string, T extends string> {
  categoryOptions: DropdownOption<C>[];
  category: C;
  onCategoryChange: (value: C) => void;
  typeOptions: DropdownOption<T>[];
  type: T;
  onTypeChange: (value: T) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  // 按 Enter／手機鍵盤的「搜尋」時呼叫，傳入搜尋框（用來收起鍵盤）
  onKeywordSubmit?: (input: HTMLInputElement | null) => void;
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
  onKeywordSubmit,
}: DownloadFiltersProps<C, T>) {
  const keywordId = useId();
  const keywordRef = useRef<HTMLInputElement>(null);

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
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onKeywordSubmit?.(keywordRef.current);
        }}
        className="flex items-center gap-3.5 lg:min-w-0 lg:flex-1"
      >
        <label htmlFor={keywordId} className={labelClass}>
          搜尋關鍵字
        </label>
        <input
          ref={keywordRef}
          id={keywordId}
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="例如：AHD、NVR、說明書、工具"
          autoComplete="off"
          enterKeyHint="search"
          className="h-10 w-full min-w-0 flex-1 rounded-[3px] border border-brand-grey bg-white px-3 text-base font-medium tracking-[0.04em] text-brand-blue placeholder:text-sm placeholder:font-normal placeholder:text-brand-grey hover:border-brand-blue focus:border-brand-blue lg:h-[34px] lg:text-sm"
        />
      </form>
    </div>
  );
}
