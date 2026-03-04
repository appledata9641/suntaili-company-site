import type { DownloadItem } from "@/types/download";

const BASE_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "/downloads";

export const downloads: DownloadItem[] = [
  {
    id: "test-vms-manual-1",
    productSlug: "suntaili-poe-switch-8p",
    productModel: "VMS",
    category: "accessory",
    type: "manual",
    title: "VMS Pro說明書繁體.doc",
    version: "V1.1.6",
    releaseDate: "2026-03-04",
    fileSize: "16.6 MB",
    downloadUrl: `${BASE_URL}/manual/VMS/${encodeURIComponent("VMS Pro說明書繁體.doc")}`,
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
