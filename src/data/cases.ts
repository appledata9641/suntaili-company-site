// 案例場景頁（/applications）的資料：應用場域四張卡片與實際案例。

export interface ApplicationScenario {
  title: string;
  image: string;
  // 依設計稿斷行：桌機版每段各占一行，較窄的畫面接成一段自然換行
  description: string[];
  products: string[];
}

export const applicationScenarios: ApplicationScenario[] = [
  {
    title: "商用空間與店面",
    image: "/images/site/cases/scene-1.webp",
    description: ["適合櫃台、出入口、走道、收銀區與倉儲區域監看，", "常搭配 AHD 攝影機、DVR 與既有同軸線路。"],
    products: ["AHD 攝影機", "DVR 錄影主機", "螢幕與影像延伸設備"],
  },
  {
    title: "社區與住宅公共區域",
    image: "/images/site/cases/scene-2.webp",
    description: ["可依梯廳、停車場、信箱區、管理室與大門口規劃攝影機", "數量、夜視距離與錄影保存天數。"],
    products: ["半球攝影機", "室外槍型攝影機", "NVR / DVR"],
  },
  {
    title: "工廠、倉儲與廠區周界",
    image: "/images/site/cases/scene-3.webp",
    description: ["重視長距離夜視、防水防塵、穩定錄影與遠端巡檢，", "可依現場供電與線路距離調整配置。"],
    products: ["PoE 交換器", "IP67 室外攝影機", "多通道錄影主機"],
  },
  {
    title: "系統整合與弱電工程",
    image: "/images/site/cases/scene-4.webp",
    description: ["支援系統整合商確認既有設備相容性、替代型號、線材與", "供電配置，降低現場施工不確定性。"],
    products: ["PoE 周邊", "VMS 管理工具", "門禁與弱電周邊"],
  },
];

export interface CaseStudy {
  name: string;
  image: string;
  tags: string[];
  href: string;
}

// 注意：案場名稱是美編設計稿上的示意文字（XXX），需換成公司提供的真實案例名稱。
// 目前還沒有案例內頁，「閱讀完整案例」先連到立即諮詢頁；之後新增案例內頁時改成各案例網址。
export const caseStudies: CaseStudy[] = [
  {
    name: "北部XXX連鎖門市",
    image: "/images/site/cases/case-1.webp",
    tags: ["半球攝影機", "室外槍型攝影機", "NVR / DVR"],
    href: "/inquiry/",
  },
  {
    name: "中部XXX社區大樓",
    image: "/images/site/cases/case-2.webp",
    tags: ["半球攝影機", "室外槍型攝影機"],
    href: "/inquiry/",
  },
  {
    name: "南部XXX倉儲廠房",
    image: "/images/site/cases/case-3.webp",
    tags: ["PoE 交換器", "IP67 室外攝影機", "多通道錄影主機"],
    href: "/inquiry/",
  },
];
