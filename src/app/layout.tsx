import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "三泰利企業有限公司 | Suntaili",
    template: "%s | Suntaili",
  },
  description:
    "三泰利企業有限公司提供台灣工廠直營 AHD組裝客製化、安防監控、監控器材批發與弱電整合服務，並提供產品說明文件與工具軟體下載。",
  openGraph: {
    title: "三泰利企業有限公司 | Suntaili",
    description:
      "B2B 安防監控與弱電整合方案，提供產品導覽、技術文件下載與持續技術支援。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
