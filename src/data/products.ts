import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "p_cam_01",
    slug: "suntaili-2mp-dome-ip-camera",
    name: "Suntaili 2MP 半球型網路攝影機",
    model: "STL-IPC-2M-DOME",
    category: "camera",
    shortDescription: "適用門市與辦公空間，支援 H.265 與夜視模式。",
    description:
      "適用店面、辦公空間與出入口監控，支援 ONVIF 與 H.265 壓縮，方便併入既有監控系統。",
    coverImage:
      "https://dummyimage.com/960x640/0f172a/e2e8f0&text=STL-IPC-2M-DOME",
    featureBullets: [
      "2MP / H.265 壓縮",
      "紅外線夜視 30m",
      "支援 ONVIF 與 PoE",
      "移動偵測與事件通知",
    ],
    specs: [
      { label: "解析度", value: "1920 x 1080" },
      { label: "鏡頭", value: "2.8mm 固定鏡頭" },
      { label: "夜視距離", value: "30 公尺" },
      { label: "供電", value: "DC12V / PoE" },
    ],
    tags: ["H.265", "PoE", "ONVIF", "室內"],
    published: true,
  },
  {
    id: "p_cam_02",
    slug: "suntaili-5mp-outdoor-bullet-ai",
    name: "Suntaili 5MP 戶外槍型 AI 攝影機",
    model: "STL-IPC-5M-BULLET-AI",
    category: "camera",
    shortDescription: "室外防護等級設計，支援人形/車輛偵測。",
    description:
      "戶外型槍機設計，具備 AI 偵測與夜視功能，適合停車場、工地與外圍監控等場域。",
    coverImage:
      "https://dummyimage.com/960x640/172554/dbeafe&text=STL-IPC-5M-BULLET-AI",
    featureBullets: [
      "5MP 高畫質錄影",
      "IP67 室外防護",
      "人形/車輛偵測",
      "遠端告警推播",
    ],
    specs: [
      { label: "解析度", value: "2592 x 1944" },
      { label: "鏡頭", value: "4mm 固定鏡頭" },
      { label: "夜視距離", value: "50 公尺" },
      { label: "防護等級", value: "IP67" },
    ],
    tags: ["AI", "IP67", "室外", "停車場"],
    published: true,
  },
  {
    id: "p_rec_01",
    slug: "suntaili-nvr-8ch-4k",
    name: "Suntaili 8 路 4K NVR 錄影主機",
    model: "STL-NVR-08-4K",
    category: "recorder",
    shortDescription: "適合中小型場域，支援雙硬碟與遠端管理。",
    description:
      "適用中小型監控建置，支援多路 IP Camera 接入與 4K 顯示輸出，可作為店面與辦公空間錄影主機。",
    coverImage:
      "https://dummyimage.com/960x640/1f2937/f9fafb&text=STL-NVR-08-4K",
    featureBullets: [
      "8 路 IP Camera 接入",
      "雙 SATA 硬碟擴充",
      "HDMI 4K 輸出",
      "手機 / Web 遠端管理",
    ],
    specs: [
      { label: "影像輸入", value: "8CH IPC" },
      { label: "顯示輸出", value: "HDMI 4K / VGA" },
      { label: "硬碟槽", value: "2 x SATA" },
      { label: "網路介面", value: "1 x Gigabit LAN" },
    ],
    tags: ["NVR", "4K", "雙硬碟", "遠端管理"],
    published: true,
  },
  {
    id: "p_rec_02",
    slug: "suntaili-dvr-16ch-hybrid",
    name: "Suntaili 16 路混合式 DVR 主機",
    model: "STL-DVR-16-HY",
    category: "recorder",
    shortDescription: "支援類比與 IP 混合架構，適合舊案升級。",
    description:
      "適合既有類比案場升級，可混合接入類比與 IP 設備，降低整體改造成本。",
    coverImage:
      "https://dummyimage.com/960x640/3f3f46/f4f4f5&text=STL-DVR-16-HY",
    featureBullets: [
      "16 路混合式輸入",
      "舊案改造友善",
      "事件標記回放",
      "USB 備份匯出",
    ],
    specs: [
      { label: "影像輸入", value: "16CH Hybrid" },
      { label: "壓縮格式", value: "H.265 / H.264" },
      { label: "硬碟槽", value: "2 x SATA" },
      { label: "影像輸出", value: "HDMI / VGA" },
    ],
    tags: ["DVR", "Hybrid", "舊案升級", "H.265"],
    published: true,
  },
  {
    id: "p_acc_01",
    slug: "suntaili-poe-switch-8p",
    name: "Suntaili 8 埠 PoE 交換器",
    model: "STL-SW-POE-8P",
    category: "accessory",
    shortDescription: "監控專用 PoE 交換器，支援長距傳輸模式。",
    description:
      "監控常用 PoE 交換器，適用攝影機供電與網路集中管理，方便中小型案場部署。",
    coverImage:
      "https://dummyimage.com/960x640/0b3b2e/d1fae5&text=STL-SW-POE-8P",
    featureBullets: [
      "8 埠 PoE + 2 Uplink",
      "監控模式 VLAN 隔離",
      "長距模式",
      "即插即用",
    ],
    specs: [
      { label: "PoE 埠數", value: "8" },
      { label: "Uplink", value: "2 x Gigabit" },
      { label: "PoE 標準", value: "802.3af/at" },
      { label: "總功率", value: "120W" },
    ],
    tags: ["PoE", "交換器", "監控周邊", "安裝"],
    published: true,
  },
  {
    id: "p_acc_02",
    slug: "suntaili-wireless-bridge-2km",
    name: "Suntaili 2KM 戶外無線網橋",
    model: "STL-WB-2KM-AC",
    category: "accessory",
    shortDescription: "室外型長距離無線橋接器，適用跨區監控傳輸。",
    description:
      "參考現行販售網橋類產品，提供遠距離無線橋接應用，可用於跨棟、停車場與電梯周邊監控訊號回傳。",
    coverImage:
      "https://dummyimage.com/960x640/123b2a/e2fce9&text=STL-WB-2KM-AC",
    featureBullets: [
      "長距離室外傳輸應用",
      "支援 PoE 供電",
      "點對點 / 點對多點模式",
      "適用監控影像回傳",
    ],
    specs: [
      { label: "傳輸距離", value: "最遠約 2KM（環境依實況）" },
      { label: "供電", value: "24V PoE" },
      { label: "模式", value: "AP / 中繼 / 橋接" },
      { label: "用途", value: "室外跨區影像傳輸" },
    ],
    tags: ["無線網橋", "PoE", "室外", "傳輸"],
    published: true,
  },
  {
    id: "p_ac_01",
    slug: "suntaili-ac-2door-controller",
    name: "Suntaili 雙門門禁控制器",
    model: "STL-AC-2D-C1",
    category: "access-control",
    shortDescription: "支援卡片、密碼與事件記錄，適合中小型辦公室。",
    description:
      "適合辦公室與小型商用場域，提供雙門控制、權限管理與事件紀錄功能。",
    coverImage:
      "https://dummyimage.com/960x640/3b2f0b/fef3c7&text=STL-AC-2D-C1",
    featureBullets: [
      "雙門控制",
      "權限群組管理",
      "事件紀錄匯出",
      "可與監控聯動",
    ],
    specs: [
      { label: "控制門數", value: "2 門" },
      { label: "讀卡介面", value: "Wiegand" },
      { label: "通訊", value: "TCP/IP" },
      { label: "事件容量", value: "50,000 筆" },
    ],
    tags: ["門禁", "控制器", "辦公室", "聯動"],
    published: true,
  },
  {
    id: "p_ac_02",
    slug: "suntaili-hdmi-extender-30m",
    name: "Suntaili HDMI 訊號延長器 30M",
    model: "STL-EXT-HDMI-30M",
    category: "accessory",
    shortDescription: "雙網線延長器，1080P 影像延伸應用。",
    description:
      "參考官網熱銷延長器品項，適用攝影機、顯示設備與多媒體影像延伸應用，方便現場佈線延伸。",
    coverImage:
      "https://dummyimage.com/960x640/1e293b/e2e8f0&text=STL-EXT-HDMI-30M",
    featureBullets: [
      "1080P 延伸應用",
      "CAT5e / CAT6 佈線",
      "監控與多媒體設備適用",
      "安裝簡易",
    ],
    specs: [
      { label: "傳輸距離", value: "約 30 米" },
      { label: "影像格式", value: "最高 1080P" },
      { label: "線材", value: "CAT5e / CAT6" },
      { label: "形式", value: "收發一組" },
    ],
    tags: ["延長器", "HDMI", "RJ45", "監控周邊"],
    published: true,
  },
];

export const publishedProducts = products.filter((product) => product.published);
