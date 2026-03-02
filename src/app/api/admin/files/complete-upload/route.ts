import { randomUUID } from "node:crypto";
import { jsonError, jsonOk } from "@/lib/server/api-utils";

interface CompleteUploadBody {
  uploadId?: string;
  objectKey?: string;
  bucket?: string;
  filename?: string;
  contentType?: string;
  sizeBytes?: number;
  sha256?: string;
  productSlug?: string;
  assetType?: "firmware" | "software" | "manual";
  title?: string;
  version?: string;
  releaseDate?: string;
  notes?: string;
}

export async function POST(request: Request) {
  let body: CompleteUploadBody;

  try {
    body = (await request.json()) as CompleteUploadBody;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!body.uploadId || !body.objectKey || !body.filename || !body.contentType) {
    return jsonError("uploadId, objectKey, filename, contentType are required", 400);
  }

  const storedFileId = randomUUID();
  const draftAssetId = randomUUID();

  return jsonOk({
    mode: "mock-complete-upload",
    storedFile: {
      id: storedFileId,
      bucket: body.bucket ?? "suntaili-downloads",
      objectKey: body.objectKey,
      originalFilename: body.filename,
      mimeType: body.contentType,
      sizeBytes: body.sizeBytes ?? null,
      sha256: body.sha256 ?? null,
      createdAt: new Date().toISOString(),
    },
    suggestedDownloadAssetDraft: {
      id: draftAssetId,
      productSlug: body.productSlug ?? null,
      type: body.assetType ?? null,
      title: body.title ?? body.filename,
      version: body.version ?? null,
      releaseDate: body.releaseDate ?? null,
      notes: body.notes ?? null,
      status: "draft",
    },
    note: "正式版請在此步驟寫入 DB（stored_files + download_assets）並建立關聯。",
  });
}
