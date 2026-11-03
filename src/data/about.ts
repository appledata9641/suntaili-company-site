// 關於我們頁的文字與圖片（依美編設計稿「網站_關於我們」）。

// 「關於三泰利」段落：桌機版依設計稿分成三行
export const aboutIntroLines = [
  "我們以監控器材批發與弱電整合為核心，",
  "支援通路夥伴、系統整合商與企業客戶的專案需求，",
  "並透過標準化資料與文件下載流程，降低導入與維運成本。",
];

export interface CoreService {
  title: string;
  // 桌機版依設計稿分兩行
  descriptionLines: [string, string];
  image: string;
}

// 「核心與服務」四格
export const coreServices: CoreService[] = [
  {
    title: "B2B穩定供貨",
    descriptionLines: ["專注專案需求，整合供應", "監控與周邊設備。"],
    image: "/images/site/about/core-1-v2.webp",
  },
  {
    title: "台灣直營客製",
    descriptionLines: ["提供 AHD 規格彈性組裝，", "加速專案導入。"],
    image: "/images/site/about/core-2-v2.webp",
  },
  {
    title: "專業弱電整合",
    descriptionLines: ["涵蓋監控與傳輸架構，", "支援整體場域規劃。"],
    image: "/images/site/about/core-3-v2.webp",
  },
  {
    title: "健全售後支援",
    descriptionLines: ["專責窗口與技術文件，", "高效排解導入問題。"],
    image: "/images/site/about/core-4-v2.webp",
  },
];

export interface HistoryEntry {
  period: string;
  description: string;
  image?: { src: string; alt: string };
}

// 公司歷程：年份與內容由公司提供（2026-10-29），之後要改字直接改這裡。
// 有 image 的年份，桌機版會在右側顯示照片（設計稿排在第 1、3、5 筆）。
export const companyHistory: HistoryEntry[] = [
  {
    period: "2006",
    description: "開始售賣類比監視器。",
    image: { src: "/images/site/about/history-1.webp", alt: "藍色牆面上的槍型監控攝影機" },
  },
  {
    period: "2010",
    description: "開始接入數位攝影機。",
  },
  {
    period: "2016",
    description: "跨入弱電整合。",
    image: { src: "/images/site/about/history-2.webp", alt: "辦公室座位區" },
  },
  {
    period: "2018",
    description: "開始建立組裝廠。",
  },
  {
    period: "2022",
    description: "整合 IP Cam（網路攝影機）。",
    image: { src: "/images/site/about/history-3.webp", alt: "廠房內的橘色鋼構設備" },
  },
  {
    period: "至今",
    description: "持續開發模組。",
  },
];
