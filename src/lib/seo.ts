import type { Metadata } from "next";
import { siteProfile } from "@/data/site";

export const defaultSiteUrl = "https://www.suntaili.com";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/+$/, "");
export const defaultDescription =
  "三泰利企業有限公司提供 B2B 監控器材批發、AHD 攝影機組裝客製、NVR/DVR、PoE、門禁與弱電整合支援。";
export const ogImagePath = "/images/home-hero.jpg";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

export function canonicalUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  let cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath !== "/" && !cleanPath.endsWith("/")) {
    cleanPath += "/";
  }

  return absoluteUrl(cleanPath);
}

export function pageMetadata({
  title,
  description = defaultDescription,
  path = "/",
  image: imagePath = ogImagePath,
  titleAbsolute = false,
}: {
  title: string;
  description?: string;
  path?: string;
  // 分享到 LINE / Facebook 時顯示的圖片；產品頁用產品圖
  image?: string;
  // 標題本身已含「三泰利」時設為 true，不再加「| 三泰利」後綴
  titleAbsolute?: boolean;
}): Metadata {
  const url = canonicalUrl(path);
  const image = absoluteUrl(imagePath);

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: `${siteProfile.companyName} Suntaili`,
      locale: "zh_TW",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const organizationId = `${siteUrl}/#organization`;

function postalAddressJsonLd() {
  const { addressParts } = siteProfile.contact;

  return {
    "@type": "PostalAddress",
    postalCode: addressParts.postalCode,
    addressRegion: addressParts.region,
    addressLocality: addressParts.locality,
    streetAddress: addressParts.street,
    addressCountry: "TW",
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteProfile.companyName,
    alternateName: [siteProfile.brandName, "三泰利"],
    url: siteUrl,
    logo: absoluteUrl("/suntaili-logo.svg"),
    email: siteProfile.contact.email,
    telephone: siteProfile.contact.phoneInternational,
    taxID: siteProfile.contact.taxId,
    address: postalAddressJsonLd(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: siteProfile.contact.phoneInternational,
      email: siteProfile.contact.email,
      areaServed: "TW",
      availableLanguage: ["zh-Hant"],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: siteProfile.companyName,
    image: absoluteUrl(ogImagePath),
    logo: absoluteUrl("/suntaili-logo.svg"),
    url: siteUrl,
    telephone: siteProfile.contact.phoneInternational,
    email: siteProfile.contact.email,
    address: postalAddressJsonLd(),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteProfile.companyName} Suntaili`,
    url: siteUrl,
    inLanguage: "zh-Hant-TW",
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: `${canonicalUrl("/products")}?keyword={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}
