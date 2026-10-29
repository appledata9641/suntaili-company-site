import type { SiteProfile } from "@/types/site";

export const siteProfile: SiteProfile = {
  companyName: "三泰利企業有限公司",
  brandName: "Suntaili",
  tagline: "B2B 安防監控、弱電整合與 AHD客製化組裝",
  shortDescription:
    "三泰利企業有限公司專注於台灣工廠直營 AHD組裝客製化、安防監控、監控器材批發與弱電整合，提供穩定供貨與技術支援。",
  contact: {
    phone: "(02)2991-8878",
    phoneInternational: "+886-2-2991-8878",
    email: "hsu@suntaili.com",
    address: "242新北市新莊區思源路110號",
    addressParts: {
      postalCode: "242",
      region: "新北市",
      locality: "新莊區",
      street: "思源路110號",
    },
    taxId: "28766429",
    serviceHours: "週一至週五 09:00 - 18:00",
    contactPerson: "許先生",
    // 主要聯絡人的電話先用公司電話
    contactPersonPhone: "(02)2991-8878",
  },
  // 頁尾的社群圖示：填網址才會顯示（蝦皮賣場網址之後提供；Facebook 粉專目前不放）
  social: {
    shopee: "",
    facebook: "",
  },
};
