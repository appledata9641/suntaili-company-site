import type { SiteProfile } from "@/types/site";

export const siteProfile: SiteProfile = {
  companyName: "三泰利企業有限公司",
  brandName: "Suntaili",
  tagline: "B2B 安防監控、弱電整合與文件支援",
  shortDescription:
    "三泰利企業有限公司專注於監控設備、錄影主機、門禁系統與網路周邊整合，提供穩定供貨、技術支援與文件下載服務。",
  contact: {
    phone: "(02)2991-8878",
    email: "service@monitorplayer.com.tw",
    lineId: "@monitorplayer",
    address: "新北市新莊區（請填入正式地址）",
    serviceHours: "週一至週五 09:00 - 18:00",
  },
};

export const homeStats = [
  { label: "服務年資", value: "10+" },
  { label: "合作案場", value: "300+" },
  { label: "B2B 技術支援", value: "持續提供" },
];

export const solutionUseCases = [
  {
    title: "商用空間",
    description:
      "針對辦公室、連鎖店與營運據點，提供監控佈建與遠端管理規劃。",
  },
  {
    title: "住宅社區",
    description:
      "整合公共區域監控與出入口管理，兼顧安全、維運與使用便利性。",
  },
  {
    title: "工廠倉儲",
    description:
      "因應大型空間與長時間運作需求，提供穩定錄影、備援與維護建議。",
  },
];
