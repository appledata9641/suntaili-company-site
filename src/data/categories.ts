import type { ProductCategoryDefinition } from "@/types/product";

export const productCategories: ProductCategoryDefinition[] = [
  {
    id: "camera",
    slug: "camera",
    name: "監控攝影機",
    shortName: "攝影機",
    seoTitle: "監控攝影機：AHD 類比高清與 IP 網路攝影機",
    description: "AHD 類比高清與 IP 網路攝影機，200 萬到 800 萬畫素，涵蓋半球型、槍型、一體機與戶外防護罩，提供紅外線、全彩與帶聲音機種，可依案場需求搭配。",
  },
  {
    id: "recorder",
    slug: "recorder",
    name: "錄影主機",
    shortName: "NVR / DVR",
    seoTitle: "錄影主機：DVR 混合式與 NVR 網路型錄影主機",
    description: "DVR 混合式錄影主機與 NVR 網路型錄影主機，4 到 36 路，支援 H.265、多硬碟儲存與手機 APP 遠端監看。",
  },
  {
    id: "software",
    slug: "software",
    name: "軟體方案",
    shortName: "軟體",
    seoTitle: "軟體方案：VMS 監控管理平台與中控軟體",
    description: "VMS 監控管理平台與 RD 中控軟體，可集中監看、錄影回放與遠端連線，提供 Windows 與 macOS 版本下載。",
  },
  // 周邊設備目前沒有刊登產品：分類頁會顯示「整理中」，選單、頁尾與首頁先不顯示，加入產品後自動出現
  {
    id: "accessory",
    slug: "accessory",
    name: "周邊設備",
    shortName: "周邊",
    seoTitle: "監控周邊設備：線材、支架、硬碟與變壓器",
    description: "監控系統常用的線材、支架、硬碟與變壓器等周邊設備。",
  },
];
