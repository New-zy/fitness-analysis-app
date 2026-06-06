// Preconfigured storage helpers for Manus WebDev templates
// Uses the Biz-provided storage proxy (Authorization: Bearer <token>)

import { ENV } from "./_core/env";

type StorageConfig = { baseUrl: string; apiKey: string };

function getStorageConfig(): StorageConfig {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY",
    );
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

function buildUploadUrl(baseUrl: string, relKey: string): URL {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}

async function buildDownloadUrl(baseUrl: string, relKey: string, apiKey: string): Promise<string> {
  const downloadApiUrl = new URL("v1/storage/downloadUrl", ensureTrailingSlash(baseUrl));
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey),
  });
  return (await response.json()).url;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

function buildMultipartBody(
  data: Buffer | Uint8Array | string,
  contentType: string,
  fileName: string,
): { body: Buffer; headers: HeadersInit } {
  const boundary = `----FormBoundary${Date.now()}${Math.random().toString(36).slice(2)}`;
  const crlf = "\r\n";
  const buf = typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data);

  const header = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
    `Content-Type: ${contentType}`,
    "",
    "",
  ].join(crlf);

  const footer = `${crlf}--${boundary}--${crlf}`;

  const body = Buffer.concat([
    Buffer.from(header, "utf-8"),
    buf,
    Buffer.from(footer, "utf-8"),
  ]);

  return {
    body,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
  };
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const { body, headers: formHeaders } = buildMultipartBody(
    data,
    contentType,
    key.split("/").pop() ?? key,
  );

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { ...buildAuthHeaders(apiKey), ...formHeaders },
    body,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`,
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey),
  };
}
