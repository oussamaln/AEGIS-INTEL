import { ENV } from "./_core/env";

function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    return null;
  }

  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = Math.random().toString(36).substring(2, 10);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  const config = getForgeConfig();

  if (!config) {
    throw new Error("Private file storage is not configured.");
  }

  try {
    const presignUrl = new URL("v1/storage/presign/put", config.forgeUrl + "/");
    presignUrl.searchParams.set("path", key);
    const presignResp = await fetch(presignUrl, {
      headers: { Authorization: `Bearer ${config.forgeKey}` },
    });
    if (!presignResp.ok) {
      throw new Error(`Private storage authorization failed (${presignResp.status}).`);
    }
    const { url: s3Url } = (await presignResp.json()) as { url?: string };
    if (!s3Url) {
      throw new Error("Private storage did not return an upload URL.");
    }
    const body = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
    const uploadResp = await fetch(s3Url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body,
    });
    if (!uploadResp.ok) {
      throw new Error(`Private storage upload failed (${uploadResp.status}).`);
    }
    return { key, url: `/manus-storage/${key}` };
  } catch (error) {
    console.error("[Storage] Private upload failed:", error);
    throw new Error("Evidence could not be stored securely. Please try again.");
  }
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const config = getForgeConfig();
  const key = normalizeKey(relKey);

  if (!config) {
    throw new Error("Private file storage is not configured.");
  }

  try {
    const getUrl = new URL("v1/storage/presign/get", config.forgeUrl + "/");
    getUrl.searchParams.set("path", key);
    const resp = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${config.forgeKey}` },
    });
    if (!resp.ok) {
      throw new Error(`Private storage download authorization failed (${resp.status}).`);
    }
    const { url } = (await resp.json()) as { url?: string };
    if (!url) {
      throw new Error("Private storage did not return a download URL.");
    }
    return url;
  } catch (error) {
    console.error("[Storage] Private download URL failed:", error);
    throw new Error("Private evidence retrieval is temporarily unavailable.");
  }
}
