import { getProductBySlug, listDownloads, serializeDownloadSummary, serializeProductDetail } from "@/lib/server/mock-repository";
import { jsonError, jsonOk } from "@/lib/server/api-utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const product = getProductBySlug(slug);

  if (!product) {
    return jsonError("Product not found", 404);
  }

  const relatedDownloads = listDownloads({ productSlug: slug }).map(serializeDownloadSummary);

  return jsonOk({
    item: serializeProductDetail(product),
    relatedDownloadsSummary: {
      total: relatedDownloads.length,
      latestReleaseDate: relatedDownloads[0]?.releaseDate ?? null,
      items: relatedDownloads.slice(0, 5),
    },
  });
}
