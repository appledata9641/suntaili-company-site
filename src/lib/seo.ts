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
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = canonicalUrl(path);
  const image = absoluteUrl(ogImagePath);

  return {
    title,
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteProfile.companyName,
    alternateName: siteProfile.brandName,
    url: siteUrl,
    logo: absoluteUrl("/suntaili-logo.svg"),
    email: siteProfile.contact.email,
    telephone: siteProfile.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteProfile.contact.address,
      addressCountry: "TW",
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteProfile.companyName,
    image: absoluteUrl(ogImagePath),
    url: siteUrl,
    telephone: siteProfile.contact.phone,
    email: siteProfile.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteProfile.contact.address,
      addressCountry: "TW",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteProfile.companyName} Suntaili`,
    url: siteUrl,
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
