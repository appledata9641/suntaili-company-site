import { createHash, randomUUID } from "node:crypto";

interface DownloadSignPayload {
  assetId: string;
  filename: string;
  expiresInSeconds?: number;
}

interface UploadPresignPayload {
  filename: string;
  contentType: string;
  sizeBytes?: number;
}

const DEFAULT_EXPIRES_IN_SECONDS = 180;

export function issueMockDownloadSignedUrl(payload: DownloadSignPayload) {
  const expiresInSeconds = payload.expiresInSeconds ?? DEFAULT_EXPIRES_IN_SECONDS;
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
  const token = createHash("sha256")
    .update(`${payload.assetId}:${payload.filename}:${expiresAt.toISOString()}:${randomUUID()}`)
    .digest("hex")
    .slice(0, 32);

  const url = new URL("https://download.example.com/mock-signed-download");
  url.searchParams.set("asset", payload.assetId);
  url.searchParams.set("file", payload.filename);
  url.searchParams.set("token", token);
  url.searchParams.set("exp", expiresAt.toISOString());

  return {
    downloadUrl: url.toString(),
    expiresAt: expiresAt.toISOString(),
    expiresInSeconds,
  };
}

export function issueMockUploadPresign(payload: UploadPresignPayload) {
  const uploadId = randomUUID();
  const objectKey = `uploads/${new Date().toISOString().slice(0, 10)}/${uploadId}-${payload.filename}`;
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  return {
    uploadId,
    storageProvider: "mock-r2",
    bucket: "suntaili-downloads",
    objectKey,
    expiresAt: expiresAt.toISOString(),
    method: "PUT",
    uploadUrl: `https://upload.example.com/mock-presign/${encodeURIComponent(objectKey)}`,
    headers: {
      "content-type": payload.contentType,
    },
    constraints: {
      maxSizeBytes: 2 * 1024 ** 3,
      requestedSizeBytes: payload.sizeBytes ?? null,
    },
  };
}
