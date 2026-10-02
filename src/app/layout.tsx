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
    default: `${siteProfile.companyName} Suntaili`,
    // 台灣客戶多半用中文品牌名搜尋，後綴用「三泰利」
    template: `%s | 三泰利`,
  },
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${siteProfile.companyName} Suntaili`,
    description: defaultDescription,
    url: siteUrl,
    siteName: `${siteProfile.companyName} Suntaili`,
    locale: "zh_TW",
    type: "website",
    images: [absoluteUrl("/images/og-home.jpg")],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteProfile.companyName} Suntaili`,
    description: defaultDescription,
    images: [absoluteUrl("/images/og-home.jpg")],
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
    <html lang="zh-Hant-TW" suppressHydrationWarning>
      <head>
        {/* 設計稿指定字體 Noto Sans TC；Google Fonts 會依頁面用到的字自動切片載入 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 根 layout 會套用到所有頁面，這條規則是給舊版 pages 目錄用的，這裡不適用 */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
        />
      </head>
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
