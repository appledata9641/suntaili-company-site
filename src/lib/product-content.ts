import { productCategories } from "@/data/categories";
import type { Product } from "@/types/product";

export function getProductCategory(product: Product) {
  return productCategories.find((category) => category.id === product.category);
}

export function getProductUse(product: Product) {
  if (product.category === "camera") {
    return `${product.model} 適合用在監控案場的前端影像採集，依鏡頭、解析度與安裝環境搭配 DVR、NVR 或既有監控系統。`;
  }

  if (product.category === "recorder") {
    return `${product.model} 用於監控影像錄影、回放、儲存與遠端管理，適合需要集中管理多支攝影機的案場。`;
  }

  return `${product.model} 用於監控、弱電或門禁周邊整合，協助系統整合商完成現場配線、管理或延伸需求。`;
}

export function getApplicationFields(product: Product) {
  const fields = new Set<string>();
  const text = [product.name, product.shortDescription, product.description, product.tags.join(" ")].join(" ");

  if (product.category === "camera") {
    fields.add("店面、辦公室、社區公共區域");
    fields.add("出入口、走道、倉儲與停車場監看");
  }

  if (product.category === "recorder") {
    fields.add("小型到中大型監控案場主機配置");
    fields.add("需要錄影、回放、遠端查看的維運場景");
  }

  if (product.category === "accessory") {
    fields.add("弱電配線、網路供電與影像延伸");
    fields.add("系統整合商現場施工與售後維護");
  }

  if (text.includes("AHD") || text.includes("TVI") || text.includes("CVI")) {
    fields.add("既有同軸線路升級或四合一類比高清案場");
  }

  if (text.includes("IP67") || text.includes("室外") || text.includes("戶外")) {
    fields.add("室外牆面、騎樓、廠區周界與防水需求位置");
  }

  if (text.includes("PoE")) {
    fields.add("需要網路供電與集中交換器管理的 IP 監控案場");
  }

  return Array.from(fields).slice(0, 5);
}

export function getCompatibility(product: Product) {
  const specsText = product.specs.map((spec) => `${spec.label} ${spec.value}`).join(" ");
  const allText = [product.name, product.description, product.tags.join(" "), specsText].join(" ");
  const items = new Set<string>();

  if (allText.includes("AHD") || allText.includes("TVI") || allText.includes("CVI")) {
    items.add("AHD / TVI / CVI / CVBS 四合一輸出設備");
    items.add("相容支援對應訊號格式的 DVR 主機");
  }

  if (allText.includes("PoE")) {
    items.add("PoE 交換器與支援 PoE 的網路監控架構");
  }

  if (allText.includes("ONVIF")) {
    items.add("支援 ONVIF 的 NVR 或監控管理平台");
  }

  if (product.category === "recorder") {
    items.add("依通道數搭配對應數量攝影機與硬碟容量");
    items.add("可搭配螢幕、網路設備與遠端監控管理需求");
  }

  if (product.category === "accessory") {
    items.add("需依現場線材、距離、供電與設備介面確認搭配");
  }

  if (items.size === 0) {
    items.add("需依案場設備介面、供電與安裝條件確認搭配");
  }

  return Array.from(items);
}

export function getRelatedProducts(product: Product, products: Product[], limit = 4) {
  const sameSubcategory = products.filter(
    (item) => item.slug !== product.slug && item.subcategoryKey === product.subcategoryKey,
  );
  const sameCategory = products.filter(
    (item) =>
      item.slug !== product.slug &&
      item.subcategoryKey !== product.subcategoryKey &&
      item.category === product.category,
  );

  return [...sameSubcategory, ...sameCategory].slice(0, limit);
}
