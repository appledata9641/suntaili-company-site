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
  address: string;
  addressParts: SiteAddressParts;
  taxId?: string;
  serviceHours: string;
}

export interface SiteProfile {
  companyName: string;
  brandName: string;
  tagline: string;
  shortDescription: string;
  contact: SiteContact;
}
