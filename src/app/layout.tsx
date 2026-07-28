import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { siteProfile } from "@/data/site";
import {
  absoluteUrl,
  defaultDescription,
  localBusinessJsonLd,
  organizationJsonLd,
  siteUrl,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteProfile.companyName} | Suntaili`,
    template: `%s | Suntaili`,
  },
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${siteProfile.companyName} | Suntaili`,
    description: defaultDescription,
    url: siteUrl,
    siteName: `${siteProfile.companyName} Suntaili`,
    locale: "zh_TW",
    type: "website",
    images: [absoluteUrl("/images/home-hero.jpg")],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteProfile.companyName} | Suntaili`,
    description: defaultDescription,
    images: [absoluteUrl("/images/home-hero.jpg")],
  },
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
      }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>
        <JsonLd
          id="site-identity-jsonld"
          data={[organizationJsonLd(), localBusinessJsonLd(), websiteJsonLd()]}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
