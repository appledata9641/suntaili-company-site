export interface SiteContact {
  phone: string;
  email: string;
  lineId?: string;
  address: string;
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
