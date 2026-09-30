import type { ProductCategoryDefinition } from "@/types/product";

export const productCategories: ProductCategoryDefinition[] = [
  {
    id: "camera",
    slug: "camera",
    name: "監控攝影機",
    shortName: "攝影機",
    seoTitle: "監控攝影機：AHD 類比高清與 IP 網路攝影機",
    description: "AHD 類比高清與 IP 網路攝影機，涵蓋半球型、槍型與變焦機種，支援紅外線夜視與室外防水，可依案場需求搭配。",
  },
  {
    id: "recorder",
    slug: "recorder",
    name: "錄影主機",
    shortName: "NVR / DVR",
    seoTitle: "錄影主機：DVR 混合式與 NVR 網路型錄影主機",
    description: "DVR 混合式錄影主機與 NVR 網路型錄影主機，4 到 36 路，支援 H.265、多硬碟儲存與手機 APP 遠端監看。",
  },
  {
    id: "accessory",
    slug: "accessory",
    name: "周邊設備",
    shortName: "周邊",
    seoTitle: "監控周邊設備與 VMS 管理平台",
    description: "VMS 監控管理平台與周邊設備，可集中管理多台錄影主機與攝影機。",
  },
];
