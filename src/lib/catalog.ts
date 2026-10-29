import type { Product, ProductBrand } from "@/types/product";

// 產品中心的分類（依美編設計稿「產品中心菜單」與產品中心左側「產品類別」）。
// 網址參數格式：/products/?category=ahd-camera&form=半球型&res=5MP&brand=suntaili&keyword=...
export type ProductCenterCategoryKey = "ahd-camera" | "dvr" | "ip-camera" | "nvr" | "software" | "accessory";

export interface ProductCenterCategory {
  key: ProductCenterCategoryKey;
  label: string;
  // 首頁、產品卡片上用的大分類名稱
  groupLabel: string;
}

export const productCenterCategories: ProductCenterCategory[] = [
  { key: "ahd-camera", label: "AHD攝影機", groupLabel: "監控攝影機" },
  { key: "dvr", label: "DVR錄影機", groupLabel: "錄影主機" },
  { key: "ip-camera", label: "網路攝影機", groupLabel: "監控攝影機" },
  { key: "nvr", label: "網路錄影機", groupLabel: "錄影主機" },
  { key: "software", label: "軟體方案", groupLabel: "軟體方案" },
  { key: "accessory", label: "周邊配件", groupLabel: "周邊設備" },
];

export const productForms = ["半球型", "槍型", "一體機", "防護罩"] as const;
export type ProductForm = (typeof productForms)[number];

export const productResolutions = ["2MP", "5MP", "8MP"] as const;
export type ProductResolution = (typeof productResolutions)[number];

export const brandLabels: Record<ProductBrand, string> = {
  suntaili: "三泰利Suntaili",
  avtech: "AVTECH",
  dahua: "DAHUA",
};

export function getProductCenterCategory(product: Product): ProductCenterCategoryKey {
  const key = product.subcategoryKey;
  if (key.startsWith("ahd-camera") || key === "other-camera") return "ahd-camera";
  if (key.startsWith("ip-camera")) return "ip-camera";
  if (key === "dvr") return "dvr";
  if (key === "nvr" || key === "other-recorder") return "nvr";
  if (key === "vms-platform" || product.category === "software") return "software";
  return "accessory";
}

export function getProductCenterCategoryLabel(key: ProductCenterCategoryKey) {
  return productCenterCategories.find((category) => category.key === key)?.label ?? "";
}

const formKeywords: Record<ProductForm, string[]> = {
  半球型: ["半球"],
  槍型: ["槍型"],
  一體機: ["一體機"],
  防護罩: ["防護罩"],
};

// 產品名稱與標籤沒寫外型的機種（AC-535、AC-536 名稱是「室外型攝影機」，原本的產品選單放在槍型）
const formOverrides: Record<string, ProductForm> = {
  "suntaili-ac-535": "槍型",
  "suntaili-ac-536": "槍型",
};

export function getProductForm(product: Product): ProductForm | null {
  if (product.category !== "camera") return null;
  if (formOverrides[product.slug]) return formOverrides[product.slug];
  for (const form of productForms) {
    const words = formKeywords[form];
    if (product.tags.some((tag) => words.includes(tag)) || words.some((word) => product.name.includes(word))) {
      return form;
    }
  }
  return null;
}

export function getProductResolution(product: Product): ProductResolution | null {
  if (product.category !== "camera") return null;
  const match = /(\d)mp$/i.exec(product.subcategoryKey);
  if (match) {
    const value = `${match[1]}MP`;
    if ((productResolutions as readonly string[]).includes(value)) return value as ProductResolution;
  }
  const tag = product.tags.find((item) => (productResolutions as readonly string[]).includes(item));
  return (tag as ProductResolution | undefined) ?? null;
}

export function getProductChannels(product: Product): number | null {
  const tag = product.tags.find((item) => /^\d+CH$/i.test(item));
  if (tag) return Number.parseInt(tag, 10);
  const match = /(\d+)\s*路/.exec(product.name);
  return match ? Number.parseInt(match[1], 10) : null;
}

// 產品卡片右上角的小標籤：攝影機顯示解析度，錄影主機顯示路數
export function getProductBadge(product: Product): string | null {
  const resolution = getProductResolution(product);
  if (resolution) return resolution;
  const channels = getProductChannels(product);
  if (channels) return `${channels}CH`;
  return null;
}

export function productHref(product: Pick<Product, "slug">) {
  return `/products/${product.slug}/`;
}

export interface ProductsQuery {
  category?: ProductCenterCategoryKey;
  form?: ProductForm | ProductForm[];
  res?: ProductResolution | ProductResolution[];
  brand?: ProductBrand;
  keyword?: string;
}

// 產品中心的連結（選單、頁尾、首頁都用這個組網址，產品中心頁讀同樣的參數）
export function productsHref(query: ProductsQuery = {}) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.form) params.set("form", ([] as string[]).concat(query.form).join(","));
  if (query.res) params.set("res", ([] as string[]).concat(query.res).join(","));
  if (query.brand) params.set("brand", query.brand);
  if (query.keyword) params.set("keyword", query.keyword);
  const search = params.toString();
  return search ? `/products/?${search}` : "/products/";
}

export function catalogHref(form?: string) {
  return form ? `/catalog/?form=${encodeURIComponent(form)}` : "/catalog/";
}

// 產品頁規格表分組：依設計稿「模組參數／功能表控制／一般規範」三組
export type SpecGroupKey = "module" | "function" | "general";

export const specGroupLabels: Record<SpecGroupKey, string> = {
  module: "模組參數",
  function: "功能表控制",
  general: "一般規範",
};

const generalSpecWords = ["電源", "功耗", "電流", "尺寸", "外觀", "重量", "工作", "環境", "溫度", "濕度", "防水", "防塵", "材質", "外殼", "保固", "認證", "安裝"];
const functionSpecWords = ["功能", "控制", "OSD", "UTC", "選單", "曝光", "白平衡", "降噪", "寬動態", "WDR", "BLC", "HLC", "語言", "聲音", "音訊", "MIC", "智慧", "偵測", "移動", "遠端", "APP", "軟體", "協定", "錄影模式", "備份", "網路功能", "警報"];

export function getSpecGroup(label: string): SpecGroupKey {
  if (generalSpecWords.some((word) => label.includes(word))) return "general";
  if (functionSpecWords.some((word) => label.toUpperCase().includes(word.toUpperCase()))) return "function";
  return "module";
}
