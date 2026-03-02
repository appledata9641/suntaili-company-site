import type { NextRequest } from "next/server";
import type { DownloadType } from "@/types/download";
import {
  listDownloads,
  serializeDownloadSummary,
} from "@/lib/server/mock-repository";
import {
  jsonOk,
  normalizeSearchTerm,
  paginate,
  parsePositiveInt,
} from "@/lib/server/api-utils";

const validTypes = new Set<DownloadType | "all">(["all", "firmware", "software", "manual"]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category") ?? undefined;
  const rawType = (searchParams.get("type") ?? "all") as DownloadType | "all";
  const type = validTypes.has(rawType) ? rawType : "all";
  const q = normalizeSearchTerm(searchParams.get("q")) || undefined;
  const productSlug = searchParams.get("productSlug") ?? undefined;
  const sort = searchParams.get("sort") ?? "releaseDate:desc";
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("pageSize"), 20, { max: 100 });

  let filtered = listDownloads({ category, type, q, productSlug });

  if (sort === "releaseDate:asc") {
    filtered = [...filtered].reverse();
  }

  const serialized = filtered.map(serializeDownloadSummary);
  const result = paginate(serialized, page, pageSize);

  return jsonOk({
    ...result,
    filters: {
      category: category ?? null,
      type,
      q: q ?? null,
      productSlug: productSlug ?? null,
      sort,
    },
  });
}
