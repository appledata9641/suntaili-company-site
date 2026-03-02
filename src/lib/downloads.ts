import type { DownloadItem } from "@/types/download";

export function sortDownloadsByDateDesc<T extends DownloadItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });
}
