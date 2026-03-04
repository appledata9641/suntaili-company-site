import type { DownloadItem } from "@/types/download";

const BASE_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "/downloads";

export const downloads: DownloadItem[] = [
  {
    id: "test-dvr-manual-1",
    productSlug: "suntaili-dvr-16ch-hybrid",
    productModel: "DVR",
    category: "recorder",
    type: "manual",
    title: "DVR說明書.doc",
    version: "V1.1.6",
    releaseDate: "2026-03-04",
    fileSize: "32.6 MB",
    downloadUrl: `${BASE_URL}/manual/DVR/${encodeURIComponent("DVR說明書.doc")}`,
  },
  {
    id: "test-nvr-manual-1",
    productSlug: "suntaili-nvr-8ch-4k",
    productModel: "NVR",
    category: "recorder",
    type: "manual",
    title: "NVR說明書.docx",
    version: "V1.1.6",
    releaseDate: "2026-03-04",
    fileSize: "68.5 MB",
    downloadUrl: `${BASE_URL}/manual/NVR/${encodeURIComponent("NVR說明書.docx")}`,
  },
  {
    id: "test-vms-manual-1",
    productSlug: "suntaili-vms-platform",
    productModel: "VMS",
    category: "accessory",
    type: "manual",
    title: "VMS Pro說明書繁體.doc",
    version: "V1.1.6",
    releaseDate: "2026-03-04",
    fileSize: "16.6 MB",
    downloadUrl: `${BASE_URL}/manual/VMS/${encodeURIComponent("VMS Pro說明書繁體.doc")}`,
  },
];
