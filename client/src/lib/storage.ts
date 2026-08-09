export async function storagePut(
  relKey: string,
  data: Uint8Array | Blob | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  // Request presigned URL from forge API proxy via frontend key
  const forgeUrl = (import.meta.env.VITE_FRONTEND_FORGE_API_URL || "").replace(/\/+$/, "");
  const forgeKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY || "";

  const hash = Math.random().toString(36).substring(2, 10);
  const lastDot = relKey.lastIndexOf(".");
  const key = lastDot === -1 ? `${relKey}_${hash}` : `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;

  if (!forgeUrl || !forgeKey) {
    // Fallback mock storage key if forge env is absent in local preview
    return { key, url: `/manus-storage/${key}` };
  }

  try {
    const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
    presignUrl.searchParams.set("path", key);

    const presignResp = await fetch(presignUrl, {
      headers: { Authorization: `Bearer ${forgeKey}` },
    });

    if (!presignResp.ok) {
      throw new Error("Failed to get presigned upload URL");
    }

    const { url: s3Url } = await presignResp.json();
    const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data as any], { type: contentType });

    const uploadResp = await fetch(s3Url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: blob,
    });

    if (!uploadResp.ok) {
      throw new Error("Failed to upload file to storage");
    }

    return { key, url: `/manus-storage/${key}` };
  } catch (err) {
    console.warn("[Storage] Upload fallback used:", err);
    return { key, url: `/manus-storage/${key}` };
  }
}
