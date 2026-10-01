import "server-only";

import { cookies } from "next/headers";
import { ApiError, type BaseResponse, type RequestOptions, buildUrl } from "./api";


export type ServerRequestOptions = RequestOptions & {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};


async function cookieHeader(): Promise<string> {
  const store = await cookies();
  return store
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: ServerRequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { ...options.headers };
  let payload: BodyInit | undefined;

  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (!headers.Cookie && !headers.cookie) {
    const cookie = await cookieHeader();
    if (cookie) headers.Cookie = cookie;
  }

  const res = await fetch(buildUrl(path, options.params), {
    method,
    headers,
    body: payload,
    signal: options.signal,
    cache: options.cache ?? "default",
    next: options.next,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const responseData = isJson
    ? await res.json().catch(() => null)
    : ((await res.text()) as unknown);

  if (!res.ok) {
    let errorMessage = res.statusText;

    if (isJson && responseData && typeof responseData === "object") {
      const errObj = responseData as Record<string, unknown>;

      if ("error" in errObj) {
        errorMessage =
          typeof errObj.error === "string"
            ? errObj.error
            : JSON.stringify(errObj.error);
      } else if ("message" in errObj) {
        errorMessage = String(errObj.message);
      }
    }

    throw new ApiError(res.status, errorMessage, responseData);
  }

  if (
    isJson &&
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as BaseResponse<T>).data;
  }

  return responseData as T;
}

export const serverApi = {
  get: <T>(path: string, options?: ServerRequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: ServerRequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: ServerRequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: ServerRequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: ServerRequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};