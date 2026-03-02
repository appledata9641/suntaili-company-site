import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "三泰利企業有限公司 Suntaili｜監控設備與韌體支援平台",
    template: "%s | Suntaili",
  },
  description:
    "三泰利企業有限公司（Suntaili）B2B 監控設備官網前端示範版，提供產品資訊、韌體下載、工具程式與技術支援入口。",
  openGraph: {
    title: "三泰利企業有限公司 Suntaili｜監控設備與韌體支援平台",
    description:
      "提供監控設備、錄影主機、門禁整合、無線網橋與韌體/文件下載中心的企業官網前端示範版。",
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
