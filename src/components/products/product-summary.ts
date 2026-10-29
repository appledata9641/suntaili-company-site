import { productCategories } from "@/data/categories";
import {
  brandLabels,
  getProductBadge,
  getProductCenterCategory,
  getProductForm,
  getProductResolution,
  productCenterCategories,
  type ProductCenterCategoryKey,
  type ProductForm,
  type ProductResolution,
} from "@/lib/catalog";
import type { Product, ProductBrand, ProductCategory, ProductSpec } from "@/types/product";

// 產品卡片、篩選與搜尋需要的精簡資料（在伺服器端算好再傳給前端元件，避免把完整產品資料送到瀏覽器）
export interface ProductSummary {
  slug: string;
  model: string;
  name: string;
  // 卡片上顯示的名稱：去掉與型號重複的字
  cardName: string;
  // 名稱依空白分段就能在兩行內排完時，不在中文詞中間斷行（例如「三泰利 AHD 1080P／半球型攝影機」）
  cardNameKeepAll: boolean;
  coverImage: string;
  brand: ProductBrand;
  category: ProductCategory;
  centerCategory: ProductCenterCategoryKey;
  form: ProductForm | null;
  resolution: ProductResolution | null;
  badge: string | null;
  // 搜尋用的正規化文字
  search: string;
}

// 型號比較頁需要的資料
export interface CompareProduct {
  slug: string;
  model: string;
  name: string;
  cardName: string;
  coverImage: string;
  specs: ProductSpec[];
}

// 型號字數很長時（例如 TH-CR-200P2-AHD-DFCS-01）縮小字級，避免卡片爆版
export function isLongModel(model: string) {
  return model.length > 12;
}

// 長型號從最靠近中間的「-」分成兩段，換行時才不會只剩「02」掉到第二行
export function splitModel(model: string): [string, string] | null {
  if (!isLongModel(model)) return null;
  const middle = model.length / 2;
  let best = -1;
  for (let index = 0; index < model.length - 1; index += 1) {
    if (model[index] !== "-") continue;
    if (best < 0 || Math.abs(index + 1 - middle) < Math.abs(best + 1 - middle)) best = index;
  }
  return best < 0 ? null : [model.slice(0, best + 1), model.slice(best + 1)];
}

// 搜尋正規化：全形轉半形、不分大小寫、忽略空白與 - _ . / 等符號
export function normalizeSearch(text: string) {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\-_./()（）、，,:：|]+/g, "");
}

// 把搜尋字串拆成關鍵字（以空白分隔，每個都要符合）
export function searchTokens(query: string) {
  return query
    .normalize("NFKC")
    .split(/\s+/)
    .map(normalizeSearch)
    .filter(Boolean);
}

export function matchesSearch(summary: Pick<ProductSummary, "search">, tokens: string[]) {
  return tokens.every((token) => summary.search.includes(token));
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 粗估文字寬度（以字級 em 計）：中文 1em、英數約 0.5–0.65em
function textWidthEm(text: string) {
  let width = 0;
  for (const char of text) {
    if (/[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(char)) width += 1;
    else if (char === " ") width += 0.23;
    else if (/[A-Z]/.test(char)) width += 0.64;
    else if (/[0-9]/.test(char)) width += 0.56;
    else if (/[a-z]/.test(char)) width += 0.52;
    else width += 0.45;
  }
  return width;
}

// 只在空白處斷行時，名稱能不能在兩行內排完（桌機版卡片名稱欄寬至少約 8.6em）
function fitsWithoutSplitting(name: string, lineEm = 8.6, maxLines = 2) {
  let lines = 1;
  let current = 0;
  for (const word of name.split(/\s+/).filter(Boolean)) {
    const width = textWidthEm(word);
    if (width > lineEm) return false;
    const next = current === 0 ? width : current + 0.23 + width;
    if (next <= lineEm) {
      current = next;
    } else {
      lines += 1;
      current = width;
      if (lines > maxLines) return false;
    }
  }
  return true;
}

function cardNameOf(product: Product) {
  // 只有含數字的型號才拿掉（避免「VMS 管理平台」變成「管理平台」）
  if (!/\d/.test(product.model)) return product.name;
  const stripped = product.name
    .replace(new RegExp(`(^|\\s)${escapeRegExp(product.model)}(?=\\s|$)`, "gi"), " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped || product.name;
}

export function toProductSummary(product: Product): ProductSummary {
  const centerCategory = getProductCenterCategory(product);
  const center = productCenterCategories.find((item) => item.key === centerCategory);
  const categoryName = productCategories.find((item) => item.id === product.category)?.name ?? "";
  const form = getProductForm(product);
  const resolution = getProductResolution(product);

  const haystack = [
    product.model,
    ...(product.legacyModels ?? []),
    product.name,
    product.shortDescription,
    ...product.tags,
    center?.label ?? "",
    center?.groupLabel ?? "",
    categoryName,
    brandLabels[product.brand],
    form ?? "",
    resolution ?? "",
  ]
    .map(normalizeSearch)
    .filter(Boolean)
    // 用「|」分隔欄位，避免前後欄位接起來誤判
    .join("|");

  const cardName = cardNameOf(product);

  return {
    slug: product.slug,
    model: product.model,
    name: product.name,
    cardName,
    cardNameKeepAll: fitsWithoutSplitting(cardName),
    coverImage: product.coverImage,
    brand: product.brand,
    category: product.category,
    centerCategory,
    form,
    resolution,
    badge: getProductBadge(product),
    search: haystack,
  };
}

export function toCompareProduct(product: Product): CompareProduct {
  return {
    slug: product.slug,
    model: product.model,
    name: product.name,
    cardName: cardNameOf(product),
    coverImage: product.coverImage,
    specs: product.specs,
  };
}
