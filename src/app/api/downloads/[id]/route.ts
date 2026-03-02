import { getDownloadById, serializeDownloadDetail } from "@/lib/server/mock-repository";
import { jsonError, jsonOk } from "@/lib/server/api-utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const item = getDownloadById(id);

  if (!item) {
    return jsonError("Download asset not found", 404);
  }

  return jsonOk({ item: serializeDownloadDetail(item) });
}
