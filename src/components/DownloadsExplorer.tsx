"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import DownloadFilters from "@/components/DownloadFilters";
import DownloadList, { type DownloadRow } from "@/components/DownloadList";
import { normalizeSearchText } from "@/components/docs/search";
import { useUrlQuery } from "@/components/docs/useUrlQuery";
import { SortAsc, SortDesc } from "@/components/icons";
import type { DropdownOption } from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";

// 文件下載頁的篩選、排序與列表。網址參數：?category=camera|recorder|software|accessory、?type=manual|software|firmware、?keyword=…
export interface DownloadExplorerRow extends DownloadRow {
  category: string;
  type: string;
  // 搜尋用文字（標題、產品名稱、型號、說明、類型），已轉小寫
  searchText: string;
}

interface DownloadsExplorerProps {
  rows: DownloadExplorerRow[];
  categoryOptions: DropdownOption<string>[];
  typeOptions: DropdownOption<string>[];
}

interface DownloadQuery {
  category: string;
  type: string;
  keyword: string;
}

const ALL = "all";
const PAGE_SIZE = 20;
const PATH = "/resources/";
const defaultQuery: DownloadQuery = { category: ALL, type: ALL, keyword: "" };

export default function DownloadsExplorer(props: DownloadsExplorerProps) {
  // 靜態輸出時先顯示未篩選的完整列表，瀏覽器讀到網址參數後再套用
  return (
    <Suspense fallback={<DownloadsBrowser {...props} query={defaultQuery} onQueryChange={() => {}} />}>
      <DownloadsWithUrl {...props} />
    </Suspense>
  );
}

function DownloadsWithUrl(props: DownloadsExplorerProps) {
  const hasOption = (options: DropdownOption<string>[], value: string | null) =>
    value !== null && value !== ALL && options.some((option) => option.value === value);

  const [query, setQuery] = useUrlQuery<DownloadQuery>({
    path: PATH,
    parse: (params) => {
      const category = params.get("category");
      const type = params.get("type");
      return {
        category: hasOption(props.categoryOptions, category) ? (category as string) : ALL,
        type: hasOption(props.typeOptions, type) ? (type as string) : ALL,
        keyword: params.get("keyword") ?? "",
      };
    },
    write: (next, params) => {
      // 固定順序：category、type、keyword
      for (const key of ["category", "type", "keyword"]) params.delete(key);
      if (next.category !== ALL) params.set("category", next.category);
      if (next.type !== ALL) params.set("type", next.type);
      if (next.keyword.trim()) params.set("keyword", next.keyword);
    },
  });

  return (
    <DownloadsBrowser
      {...props}
      query={query}
      onQueryChange={(next, typing) => setQuery(next, { delay: typing })}
    />
  );
}

interface DownloadsBrowserProps extends DownloadsExplorerProps {
  query: DownloadQuery;
  // typing = 正在輸入關鍵字（網址延遲更新）
  onQueryChange: (query: DownloadQuery, typing: boolean) => void;
}

function DownloadsBrowser({ rows, categoryOptions, typeOptions, query, onQueryChange }: DownloadsBrowserProps) {
  const [newestFirst, setNewestFirst] = useState(true);
  const terms = normalizeSearchText(query.keyword).split(/\s+/).filter(Boolean);
  const filterKey = `${query.category}|${query.type}|${terms.join(" ")}|${newestFirst}`;
  // 換了條件就回到第 1 頁
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

  const filtered = rows
    .filter((row) => query.category === ALL || row.category === query.category)
    .filter((row) => query.type === ALL || row.type === query.type)
    .filter((row) => terms.every((term) => row.searchText.includes(term)));

  // 同一天的資料維持原本順序
  const sorted = [...filtered].sort((a, b) =>
    newestFirst ? b.releaseDate.localeCompare(a.releaseDate) : a.releaseDate.localeCompare(b.releaseDate),
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = pageState.key === filterKey ? Math.min(pageState.page, pageCount) : 1;
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const update = (patch: Partial<DownloadQuery>, typing = false) => {
    const next = { ...query, ...patch };
    if (next.category === query.category && next.type === query.type && next.keyword === query.keyword) return;
    onQueryChange(next, typing);
  };

  const SortIcon = newestFirst ? SortDesc : SortAsc;

  return (
    <div>
      <DownloadFilters
        categoryOptions={categoryOptions}
        category={query.category}
        onCategoryChange={(category) => update({ category })}
        typeOptions={typeOptions}
        type={query.type}
        onTypeChange={(type) => update({ type })}
        keyword={query.keyword}
        onKeywordChange={(keyword) => update({ keyword }, true)}
      />

      <div className="mt-8 flex items-center justify-between gap-4 lg:mt-14">
        <p className="text-sm font-medium text-brand-muted" aria-live="polite">
          符合條件共 {sorted.length} 筆資料
        </p>
        <button
          type="button"
          onClick={() => setNewestFirst((value) => !value)}
          className="-mr-1 inline-flex h-10 items-center gap-2 px-1 text-sm font-medium text-brand-muted hover:text-brand-navy"
        >
          <SortIcon className="h-6 w-6" />
          排序：{newestFirst ? "由新到舊" : "由舊到新"}
        </button>
      </div>

      <div className="mt-1 lg:mt-0.5">
        {visible.length > 0 ? (
          <DownloadList items={visible} />
        ) : (
          <div className="border-y-2 border-brand-line bg-brand-panel px-6 py-12 text-center">
            <p className="text-base font-medium text-brand-navy">找不到符合條件的文件</p>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              請調整分類或關鍵字；攝影機與錄影主機的產品型錄（DM）請至
              <Link href="/catalog/" className="mx-1 text-brand-blue underline underline-offset-2 hover:text-brand-navy">
                產品型錄
              </Link>
              下載。
            </p>
            <button
              type="button"
              onClick={() => update(defaultQuery)}
              className="mt-5 inline-flex h-[34px] items-center rounded-[3px] border border-brand-blue bg-white px-4 text-sm font-medium tracking-[0.08em] text-brand-blue hover:bg-brand-panel"
            >
              清除篩選條件
            </button>
          </div>
        )}
      </div>

      {pageCount > 1 ? (
        <Pagination
          page={page}
          pageCount={pageCount}
          onChange={(next) => setPageState({ key: filterKey, page: next })}
          className="mt-8"
        />
      ) : null}
    </div>
  );
}
