"use client";

import { Suspense } from "react";
import CatalogSection from "@/components/catalog/CatalogSection";
import type { CatalogEntry } from "@/components/catalog/catalog-data";
import { useUrlQuery } from "@/components/docs/useUrlQuery";
import Dropdown from "@/components/ui/Dropdown";
import SegmentedControl from "@/components/ui/SegmentedControl";
import {
  getProductCenterCategoryLabel,
  productCenterCategories,
  productForms,
  type ProductCenterCategoryKey,
  type ProductForm,
} from "@/lib/catalog";

// 產品型錄頁的篩選與分類列表。網址參數：?category=ahd-camera|dvr|ip-camera|nvr、?form=半球型|槍型|一體機|防護罩
type CategoryValue = ProductCenterCategoryKey | "all";
type FormValue = ProductForm | "all";

interface CatalogQuery {
  category: CategoryValue;
  form: FormValue;
}

interface SectionDefinition {
  id: string;
  title: string;
  category: ProductCenterCategoryKey;
  // AHD 攝影機依外型分段；null = 產品資料沒有標外型
  form?: ProductForm | null;
}

const sections: SectionDefinition[] = [
  { id: "dome", title: "半球型攝影機", category: "ahd-camera", form: "半球型" },
  { id: "bullet", title: "槍型攝影機", category: "ahd-camera", form: "槍型" },
  { id: "all-in-one", title: "一體機攝影機", category: "ahd-camera", form: "一體機" },
  { id: "housing", title: "防護罩攝影機", category: "ahd-camera", form: "防護罩" },
  { id: "ahd-other", title: "其他AHD攝影機", category: "ahd-camera", form: null },
  { id: "dvr", title: "DVR錄影機", category: "dvr" },
  { id: "ip-camera", title: "網路攝影機", category: "ip-camera" },
  { id: "nvr", title: "網路錄影機", category: "nvr" },
];

const formOptions: { value: FormValue; label: string }[] = [
  { value: "all", label: "全部" },
  ...productForms.map((form) => ({ value: form, label: form })),
];

const defaultQuery: CatalogQuery = { category: "all", form: "all" };
const PATH = "/catalog/";

// 外型切換只在「全部分類」與「AHD攝影機」顯示
function formEnabled(category: CategoryValue) {
  return category === "all" || category === "ahd-camera";
}

interface CatalogExplorerProps {
  entries: CatalogEntry[];
}

export default function CatalogExplorer({ entries }: CatalogExplorerProps) {
  // 靜態輸出時先顯示全部型錄，瀏覽器讀到網址參數後再套用
  return (
    <Suspense fallback={<CatalogBrowser entries={entries} query={defaultQuery} onQueryChange={() => {}} />}>
      <CatalogWithUrl entries={entries} />
    </Suspense>
  );
}

function CatalogWithUrl({ entries }: CatalogExplorerProps) {
  const categories = categoriesWithEntries(entries);
  const [query, setQuery] = useUrlQuery<CatalogQuery>({
    path: PATH,
    parse: (params) => {
      const category = params.get("category");
      const form = params.get("form");
      const nextCategory: CategoryValue = categories.some((key) => key === category)
        ? (category as ProductCenterCategoryKey)
        : "all";
      const nextForm: FormValue =
        formEnabled(nextCategory) && productForms.some((value) => value === form) ? (form as ProductForm) : "all";
      return { category: nextCategory, form: nextForm };
    },
    write: (next, params) => {
      params.delete("category");
      params.delete("form");
      if (next.category !== "all") params.set("category", next.category);
      if (next.form !== "all") params.set("form", next.form);
    },
  });

  return <CatalogBrowser entries={entries} query={query} onQueryChange={(next) => setQuery(next)} />;
}

function categoriesWithEntries(entries: CatalogEntry[]) {
  return productCenterCategories
    .map((category) => category.key)
    .filter((key) => entries.some((entry) => entry.category === key));
}

interface CatalogBrowserProps extends CatalogExplorerProps {
  query: CatalogQuery;
  onQueryChange: (query: CatalogQuery) => void;
}

function CatalogBrowser({ entries, query, onQueryChange }: CatalogBrowserProps) {
  const categoryOptions: { value: CategoryValue; label: string }[] = [
    { value: "all", label: "全部分類" },
    ...categoriesWithEntries(entries).map((key) => ({ value: key, label: getProductCenterCategoryLabel(key) })),
  ];
  const showForm = formEnabled(query.category);

  const visibleSections = sections
    .filter((section) => query.category === "all" || section.category === query.category)
    .map((section) => ({
      ...section,
      entries: entries.filter(
        (entry) =>
          entry.category === section.category &&
          (section.form === undefined || entry.form === section.form) &&
          (!showForm || query.form === "all" || entry.form === query.form),
      ),
    }))
    .filter((section) => section.entries.length > 0);

  const update = (next: CatalogQuery) => {
    const normalized: CatalogQuery = formEnabled(next.category) ? next : { ...next, form: "all" };
    if (normalized.category === query.category && normalized.form === query.form) return;
    onQueryChange(normalized);
  };

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="w-[92px] shrink-0 text-lg font-medium text-brand-navy lg:w-auto" aria-hidden="true">
            型錄分類
          </span>
          <Dropdown
            value={query.category}
            options={categoryOptions}
            onChange={(category) => update({ ...query, category })}
            ariaLabel="型錄分類"
            className="min-w-0 flex-1 lg:w-[186px] lg:flex-none"
          />
        </div>
        {showForm ? (
          <SegmentedControl
            options={formOptions}
            value={query.form}
            onChange={(form) => update({ ...query, form })}
            ariaLabel="攝影機外型"
            className="w-full md:w-auto"
            itemClassName="max-md:min-w-0 max-md:flex-1 max-md:shrink max-md:px-1"
          />
        ) : null}
      </div>

      {visibleSections.length > 0 ? (
        <div className="mt-10 space-y-10 lg:mt-[41px] lg:space-y-[34px]">
          {visibleSections.map((section) => (
            <CatalogSection key={section.id} id={section.id} title={section.title} entries={section.entries} />
          ))}
        </div>
      ) : (
        <div className="mt-10 border-y-2 border-brand-line bg-brand-panel px-6 py-12 text-center">
          <p className="text-base font-medium text-brand-navy">目前沒有符合條件的產品型錄</p>
          <button
            type="button"
            onClick={() => update(defaultQuery)}
            className="mt-5 inline-flex h-[34px] items-center rounded-[3px] border border-brand-blue bg-white px-4 text-sm font-medium tracking-[0.08em] text-brand-blue hover:bg-brand-panel"
          >
            顯示全部型錄
          </button>
        </div>
      )}
    </div>
  );
}
