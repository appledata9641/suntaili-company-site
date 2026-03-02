import { issueMockUploadPresign } from "@/lib/server/storage-signing";
import { jsonError, jsonOk } from "@/lib/server/api-utils";

interface PresignUploadBody {
  filename?: string;
  contentType?: string;
  sizeBytes?: number;
  assetType?: "firmware" | "software" | "manual";
  productSlug?: string;
}

export async function POST(request: Request) {
  let body: PresignUploadBody;

  try {
    body = (await request.json()) as PresignUploadBody;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!body.filename || !body.contentType) {
    return jsonError("filename and contentType are required", 400);
  }

  const presign = issueMockUploadPresign({
    filename: body.filename,
    contentType: body.contentType,
    sizeBytes: body.sizeBytes,
  });

  return jsonOk({
    upload: presign,
    metadataDraft: {
      productSlug: body.productSlug ?? null,
      assetType: body.assetType ?? null,
      filename: body.filename,
      contentType: body.contentType,
      sizeBytes: body.sizeBytes ?? null,
    },
    nextStep: "Call POST /api/admin/files/complete-upload after the object upload succeeds.",
    mode: "mock-presign",
  });
}
