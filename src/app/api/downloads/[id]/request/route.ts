import { getDownloadById } from "@/lib/server/mock-repository";
import { issueMockDownloadSignedUrl } from "@/lib/server/storage-signing";
import { jsonError, jsonOk } from "@/lib/server/api-utils";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const item = getDownloadById(id);

  if (!item) {
    return jsonError("Download asset not found", 404);
  }

  let body: { reason?: string; mockVisibility?: "public" | "private" } | null = null;
  try {
    body = (await request.json()) as { reason?: string; mockVisibility?: "public" | "private" };
  } catch {
    body = null;
  }

  // Placeholder authorization model for phase A. Replace with real auth/RBAC later.
  const visibility = body?.mockVisibility ?? "public";
  if (visibility === "private") {
    return jsonError("Download is not available", 403);
  }

  const filename = `${item.productModel}_${item.version}_${item.type}`.replace(/\s+/g, "_");
  const signed = issueMockDownloadSignedUrl({
    assetId: item.id,
    filename,
  });

  return jsonOk({
    itemId: item.id,
    filename,
    ...signed,
    audit: {
      result: "issued",
      requestedAt: new Date().toISOString(),
      reason: body?.reason ?? null,
      mode: "mock-signed-url",
    },
  });
}
