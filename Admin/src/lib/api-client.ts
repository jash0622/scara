"use client";

import { ApiResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const COOKIE_NAME = "scara_admin_token";

/** Read the JWT from the JS-readable cookie set at login. */
function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}_js=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { body, params, headers: extraHeaders, ...rest } = options;

  // Build URL
  let fullUrl: string;
  if (API_BASE) {
    const url = new URL(`${API_BASE}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }
    fullUrl = url.toString();
  } else {
    let qs = "";
    if (params) {
      const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
      if (entries.length) {
        qs = "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
      }
    }
    fullUrl = `${path}${qs}`;
  }

  // Attach JWT as Authorization header — token is read from the JS-readable cookie
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string> | undefined),
  };

  const res = await fetch(fullUrl, {
    ...rest,
    credentials: "include",
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // 401 — token expired or invalid, kick to login
  if (res.status === 401) {
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; path=/`;
    document.cookie = `${COOKIE_NAME}_js=; Max-Age=0; path=/`;
    window.location.href = "/login";
    return { success: false, error: { message: "Session expired", code: "UNAUTHORIZED" } };
  }

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    return {
      success: false,
      error: { message: "Invalid server response", code: "PARSE_ERROR" },
    };
  }

  return json;
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, params?: FetchOptions["params"]) =>
    apiFetch<T>(path, { method: "GET", params }),

  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body }),

  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PUT", body }),

  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body }),

  delete: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "DELETE", ...(body ? { body } : {}) }),
};

/**
 * Upload a file directly to S3 via a presigned URL.
 * Returns the permanent publicUrl to store in the DB.
 */
export async function uploadToS3(
  file: File,
  folder: "case-studies" | "case-studies/cards" | "case-studies/banners" | "case-studies/gallery" | "insights" | "general" = "case-studies",
  onProgress?: (pct: number) => void
): Promise<string> {
  // 1. Get presigned URL from our backend
  const presignRes = await api.post<{
    uploadUrl: string;
    publicUrl: string;
    key: string;
  }>("/api/upload/presign", {
    fileName: file.name,
    contentType: file.type,
    folder,
  });

  if (!presignRes.success) {
    throw new Error(presignRes.error.message);
  }

  const { uploadUrl, publicUrl } = presignRes.data;

  // 2. PUT directly to S3 (XMLHttpRequest for progress tracking)
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText}`));
    };
    xhr.onerror = () => reject(new Error("S3 upload network error"));
    xhr.send(file);
  });

  return publicUrl;
}

/** Delete an S3 object by its public URL. */
export async function deleteS3Object(url: string): Promise<void> {
  await api.delete("/api/upload", { url });
}

/**
 * Download a CSV export from a backend endpoint that returns raw text/csv.
 * apiFetch always JSON-parses, so this does a raw fetch with the auth header
 * and triggers a browser download of the resulting blob.
 */
export async function downloadCsv(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  filename = "export.csv"
): Promise<void> {
  const token = getToken();

  // Build the URL the same way apiFetch does.
  let fullUrl: string;
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (API_BASE) {
    const url = new URL(`${API_BASE}${path}`);
    entries.forEach(([k, v]) => url.searchParams.set(k, String(v)));
    fullUrl = url.toString();
  } else {
    const qs = entries.length
      ? "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&")
      : "";
    fullUrl = `${path}${qs}`;
  }

  const res = await fetch(fullUrl, {
    method: "GET",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error(`Export failed (${res.status})`);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}
