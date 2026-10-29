export interface SiteAddressParts {
  postalCode: string;
  region: string;
  locality: string;
  street: string;
}

export interface SiteContact {
  phone: string;
  // 國際格式，給結構化資料（JSON-LD）使用
  phoneInternational: string;
  email: string;
  lineId?: string;
  // 立即諮詢、聯絡我們的「主要聯絡人」與電話；沒填就不顯示
  contactPerson?: string;
  contactPersonPhone?: string;
  address: string;
  addressParts: SiteAddressParts;
  taxId?: string;
  serviceHours: string;
}

// 社群與賣場連結：填了網址才會在頁尾顯示圖示
export interface SiteSocialLinks {
  shopee?: string;
  facebook?: string;
}

export interface SiteProfile {
  companyName: string;
  brandName: string;
  tagline: string;
  shortDescription: string;
  contact: SiteContact;
  social?: SiteSocialLinks;
}
