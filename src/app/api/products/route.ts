import type { NextRequest } from "next/server";
import {
  listProducts,
  serializeProductSummary,
} from "@/lib/server/mock-repository";
import {
  jsonOk,
  normalizeSearchTerm,
  paginate,
  parseBoolean,
  parsePositiveInt,
} from "@/lib/server/api-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const q = normalizeSearchTerm(searchParams.get("q")) || undefined;
  const published = parseBoolean(searchParams.get("published"), true);
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("pageSize"), 12, { max: 100 });

  const filtered = listProducts({ category, q, published }).map(serializeProductSummary);
  const result = paginate(filtered, page, pageSize);

  return jsonOk({
    ...result,
    filters: {
      category: category ?? null,
      q: q ?? null,
      published,
    },
  });
}
