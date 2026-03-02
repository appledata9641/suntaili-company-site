import type { SiteProfile } from "@/types/site";

export const siteProfile: SiteProfile = {
  companyName: "三泰利企業有限公司",
  brandName: "Suntaili",
  tagline: "監控設備、門禁系統與 B2B 韌體支援",
  shortDescription:
    "提供監視器、錄影主機、門禁系統、PoE 交換器、延長器與相關監控配件之產品供應與技術支援，協助工程商與企業客戶快速部署與維運。",
  contact: {
    phone: "(02)2991-8878",
    email: "service@monitorplayer.com.tw",
    lineId: "@monitorplayer",
    address: "新北市新莊區思源路110號",
    serviceHours: "週一至週六 09:00 - 18:00",
  },
};

export const homeStats = [
  { label: "常用產品分類", value: "8+" },
  { label: "可擴充下載項目", value: "100+" },
  { label: "B2B技術支援", value: "持續服務" },
];

export const solutionUseCases = [
  {
    title: "商業空間",
    description: "門市、辦公室、連鎖據點監控、門禁與遠端巡檢。",
  },
  {
    title: "社區住宅",
    description: "出入口管理、公共區域監看與住戶安全管理。",
  },
  {
    title: "工廠倉儲",
    description: "出貨區、產線、倉儲與跨區網橋傳輸之全天候監控。",
  },
];
