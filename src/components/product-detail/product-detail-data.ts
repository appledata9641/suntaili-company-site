import { downloads } from "@/data/downloads";
import {
  getProductCenterCategory,
  getProductChannels,
  getProductForm,
  getProductResolution,
  getSpecGroup,
  specGroupLabels,
  type SpecGroupKey,
} from "@/lib/catalog";
import { sortDownloadsByDateDesc } from "@/lib/downloads";
import type { DownloadItem } from "@/types/download";
import type { Product, ProductSpec } from "@/types/product";

// 產品頁用的資料整理（伺服器端計算，再交給各區塊元件）

export interface ProductDownloadEntry {
  id: string;
  title: string;
  typeLabel: string;
  meta: string;
  url: string;
  external: boolean;
}

const downloadTypeLabels: Record<DownloadItem["type"], string> = {
  firmware: "韌體",
  software: "軟體",
  manual: "說明文件",
};

export function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

// 此型號的下載文件，新到舊；dm- 開頭的是產品型錄 DM
export function getProductDownloads(product: Product): ProductDownloadEntry[] {
  return sortDownloadsByDateDesc(downloads.filter((item) => item.productSlug === product.slug)).map((item) => ({
    id: item.id,
    title: item.title,
    typeLabel: item.id.startsWith("dm-") ? "型錄" : downloadTypeLabels[item.type],
    meta: [item.version, item.releaseDate, item.fileSize].filter(Boolean).join(" ・ "),
    url: item.downloadUrl,
    external: isExternalUrl(item.downloadUrl),
  }));
}

export interface SpecGroupData {
  key: SpecGroupKey;
  label: string;
  rows: ProductSpec[];
}

const specGroupOrder: SpecGroupKey[] = ["module", "function", "general"];

// 規格依「模組參數／功能表控制／一般規範」分組，沒有資料的組別不顯示
export function getSpecGroups(product: Product): SpecGroupData[] {
  return specGroupOrder
    .map((key) => ({
      key,
      label: specGroupLabels[key],
      rows: product.specs.filter((spec) => getSpecGroup(spec.label) === key),
    }))
    .filter((group) => group.rows.length > 0);
}

export function getDimensionSpec(product: Product) {
  return product.specs.find((spec) => spec.label.includes("尺寸") || spec.label.includes("外觀"));
}

export interface ParsedDimensions {
  // 標在圖片上方的橫向尺寸
  width: string;
  // 標在圖片右側的縱向尺寸
  height: string;
}

// 解析「100 × 100 × 80 mm」「Φ94 × 75 mm」這類寫法；看不懂的格式回傳 null（改顯示原文）
export function parseDimensions(value: string, product: Product): ParsedDimensions | null {
  const match = /^\s*([^m（(]+?)\s*mm/i.exec(value);
  if (!match) return null;

  const parts = match[1]
    .split(/\s*[×xX*＊]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2 || parts.length > 3) return null;

  const tokens = parts.map((part) => /^([ΦφØø⌀])?\s*(\d+(?:\.\d+)?)$/.exec(part));
  if (tokens.some((token) => token === null)) return null;

  const label = (token: RegExpExecArray) => `${token[1] ? "Ø" : ""}${token[2]}`;
  const first = tokens[0] as RegExpExecArray;
  const last = tokens[tokens.length - 1] as RegExpExecArray;

  // 槍型「Φ直徑 × 長度」：照片是橫放的機身，長度標在上方、直徑標在右側
  if (parts.length === 2 && first[1] && getProductForm(product) === "槍型") {
    return { width: label(last), height: label(first) };
  }

  return { width: label(first), height: label(last) };
}

// 型號比較卡片的簡短名稱：拿掉品牌字與型號
export function shortProductName(product: Product) {
  let name = product.name.replace(product.model, " ");
  for (const word of ["三泰利", "AVTECH", "DAHUA", "大華"]) {
    name = name.replace(word, " ");
  }
  const short = name.replace(/\s+/g, " ").trim();
  return short || product.name;
}

// 可一起比較的型號：同產品中心分類＋同外型優先，再來是同分類；解析度或路數相同的排前面
export function getCompareCandidates(product: Product, products: Product[], limit = 3) {
  const center = getProductCenterCategory(product);
  const form = getProductForm(product);
  const resolution = getProductResolution(product);
  const channels = getProductChannels(product);

  const score = (item: Product) => {
    let value = 0;
    if (getProductCenterCategory(item) === center) value += 4;
    if (form && getProductForm(item) === form) value += 2;
    if (resolution && getProductResolution(item) === resolution) value += 1;
    if (channels && getProductChannels(item) === channels) value += 1;
    return value;
  };

  return products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        (getProductCenterCategory(item) === center || item.category === product.category),
    )
    .map((item, index) => ({ item, index, score: score(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => item);
}
