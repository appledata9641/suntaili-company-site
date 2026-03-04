import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "三泰利企業有限公司 | 安防監控與弱電整合",
    template: "%s | Suntaili",
  },
  description:
    "三泰利企業有限公司提供監控設備、錄影主機、門禁系統與弱電整合服務，並提供產品說明文件與工具軟體下載。",
  openGraph: {
    title: "三泰利企業有限公司 | Suntaili",
    description:
      "B2B 安防監控與弱電整合，提供產品展示與長期文件下載中心。",
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
