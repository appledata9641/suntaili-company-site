import type { SiteProfile } from "@/types/site";

export const siteProfile: SiteProfile = {
  companyName: "三泰利企業有限公司",
  brandName: "Suntaili",
  tagline: "B2B 安防監控、弱電整合與文件下載支援",
  shortDescription:
    "三泰利企業有限公司專注於弱電整合、監控器材批發與台灣組裝 AHD 客製化，提供穩定供貨與技術支援。",
  contact: {
    phone: "(02)2991-8878",
    email: "service@monitorplayer.com.tw",
    lineId: "@monitorplayer",
    address: "新北市（請填入正式地址）",
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
    description: "辦公室、店面與營運據點監控建置，強化管理效率。",
  },
  {
    title: "住宅社區",
    description: "出入口與公共區域監控整合，提升安全與維運效率。",
  },
  {
    title: "工廠倉儲",
    description: "長時間錄影與遠端巡檢規劃，滿足大型場域需求。",
  },
];
