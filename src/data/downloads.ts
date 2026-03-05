import type { DownloadItem } from "@/types/download";

const BASE_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "/downloads";

export const downloads: DownloadItem[] = [
  {
    id: "test-vms-manual-1",
    productSlug: "suntaili-vms-software",
    productModel: "三泰利 VMS",
    category: "accessory",
    type: "software",
    title: "VMS",
    version: "V1.1.6",
    releaseDate: "2026-03-04",
    fileSize: "152.9 MB",
    downloadUrl: "https://drive.google.com/file/d/1q0LLfF_YosaF2870T0DvpcYpu_6ma-It/view?usp=drive_link",
  },
  {
    id: "test-th-ch258m3nd-catalog-1",
    productSlug: "suntaili-5mp-outdoor-bullet-ai",
    productModel: "TH-CH258M3ND",
    category: "camera",
    type: "manual",
    title: "TH-CH258M3ND-DF-A2812PW_2 CH.jpg",
    version: "V1.1.6",
    releaseDate: "2026-03-04",
    fileSize: "440 KB",
    downloadUrl: `${BASE_URL}/manual/TH-CH258M3ND/${encodeURIComponent("TH-CH258M3ND-DF-A2812PW_2 CH.jpg")}`,
  },
];
