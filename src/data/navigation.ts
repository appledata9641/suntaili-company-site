// 全站選單與頁尾連結：依美編設計稿「網站_菜單」「網站_產品中心菜單」與主頁頁尾。
// 產品分類的連結會標上 category：該分類目前沒有刊登產品時，Header、Footer 會先隱藏（見 src/lib/product-availability.ts）。
import { productsHref, type ProductCenterCategoryKey } from "@/lib/catalog";

export interface NavLink {
  label: string;
  href: string;
  category?: ProductCenterCategoryKey;
}

export interface NavGroup extends NavLink {
  // 這個選單項目在哪些網址底下要顯示為目前所在位置
  activePaths: string[];
  children?: NavLink[];
  mega?: boolean;
}

export const mainNav: NavGroup[] = [
  { label: "產品中心", href: "/products/", activePaths: ["/products", "/categories"], mega: true },
  {
    label: "案例場景",
    href: "/applications/",
    activePaths: ["/applications"],
    children: [
      { label: "實際案例", href: "/applications/#cases" },
      { label: "應用場域", href: "/applications/#scenarios" },
    ],
  },
  {
    label: "技術支援",
    href: "/resources/",
    activePaths: ["/resources", "/catalog"],
    children: [
      { label: "文件下載", href: "/resources/" },
      { label: "產品型錄", href: "/catalog/" },
    ],
  },
  {
    label: "關於我們",
    href: "/about/",
    activePaths: ["/about", "/faq", "/contact"],
    children: [
      { label: "關於三泰利", href: "/about/" },
      { label: "常見問題", href: "/faq/" },
      { label: "立即諮詢", href: "/inquiry/" },
    ],
  },
];

export const consultLink: NavLink = { label: "立即諮詢", href: "/inquiry/" };

// 產品中心大選單左側（深藍底）
export const productMenuSide = {
  title: { label: "產品中心", href: "/products/" },
  links: [
    { label: "常見問題", href: "/faq/", icon: "question" as const },
    {
      label: "文件下載",
      href: "/resources/",
      icon: "file" as const,
      children: [
        { label: "產品規格書", href: "/catalog/" },
        { label: "使用說明書 / 操作手冊", href: "/resources/?type=manual" },
        { label: "驅動程式", href: "/resources/?type=software" },
      ],
    },
  ],
};

export interface ProductMenuColumn extends NavLink {
  category: ProductCenterCategoryKey;
  items: NavLink[];
}

// 產品中心大選單右側的六個分類（沒有產品的分類先不顯示）
export const productMenuColumns: ProductMenuColumn[] = [
  {
    label: "AHD攝影機",
    category: "ahd-camera",
    href: productsHref({ category: "ahd-camera" }),
    items: [
      { label: "半球型", href: productsHref({ category: "ahd-camera", form: "半球型" }) },
      { label: "槍型", href: productsHref({ category: "ahd-camera", form: "槍型" }) },
      { label: "一體機", href: productsHref({ category: "ahd-camera", form: "一體機" }) },
      { label: "防護罩", href: productsHref({ category: "ahd-camera", form: "防護罩" }) },
    ],
  },
  {
    label: "DVR錄影機",
    category: "dvr",
    href: productsHref({ category: "dvr" }),
    items: [
      { label: "三泰利 4路", href: productsHref({ category: "dvr", brand: "suntaili", keyword: "4CH" }) },
      { label: "三泰利 8路", href: productsHref({ category: "dvr", brand: "suntaili", keyword: "8CH" }) },
      { label: "三泰利 16路", href: productsHref({ category: "dvr", brand: "suntaili", keyword: "16CH" }) },
    ],
  },
  {
    label: "網路攝影機",
    category: "ip-camera",
    href: productsHref({ category: "ip-camera" }),
    items: [{ label: "三泰利 5MP", href: productsHref({ category: "ip-camera", brand: "suntaili" }) }],
  },
  {
    label: "網路錄影機",
    category: "nvr",
    href: productsHref({ category: "nvr" }),
    items: [
      { label: "AVTECH", href: productsHref({ category: "nvr", brand: "avtech" }) },
      { label: "PoE 專區", href: productsHref({ category: "nvr", keyword: "PoE" }) },
    ],
  },
  {
    label: "軟體方案",
    category: "software",
    href: productsHref({ category: "software" }),
    items: [
      { label: "VMS 管理平台", href: "/products/suntaili-vms-platform/" },
      { label: "手機 APP下載", href: "/resources/?type=software" },
    ],
  },
  {
    label: "週邊配件",
    category: "accessory",
    href: productsHref({ category: "accessory" }),
    items: [
      { label: "線材", href: productsHref({ category: "accessory", keyword: "線材" }) },
      { label: "支架", href: productsHref({ category: "accessory", keyword: "支架" }) },
      { label: "硬碟", href: productsHref({ category: "accessory", keyword: "硬碟" }) },
      { label: "變壓器", href: productsHref({ category: "accessory", keyword: "變壓器" }) },
    ],
  },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "產品中心",
    links: [
      { label: "AHD攝影機", category: "ahd-camera", href: productsHref({ category: "ahd-camera" }) },
      { label: "DVR錄影機", category: "dvr", href: productsHref({ category: "dvr" }) },
      { label: "網路攝影機", category: "ip-camera", href: productsHref({ category: "ip-camera" }) },
      { label: "網路錄影機", category: "nvr", href: productsHref({ category: "nvr" }) },
      { label: "軟體方案", category: "software", href: productsHref({ category: "software" }) },
      { label: "週邊配件", category: "accessory", href: productsHref({ category: "accessory" }) },
    ],
  },
  {
    title: "案例場景",
    links: [
      { label: "實際案例", href: "/applications/#cases" },
      { label: "應用場域", href: "/applications/#scenarios" },
    ],
  },
  {
    title: "技術支援",
    links: [
      { label: "文件下載", href: "/resources/" },
      { label: "產品型錄", href: "/catalog/" },
    ],
  },
  {
    title: "關於我們",
    links: [
      { label: "關於三泰利", href: "/about/" },
      { label: "常見問題", href: "/faq/" },
      { label: "立即諮詢", href: "/inquiry/" },
    ],
  },
];
