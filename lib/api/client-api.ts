import { ApiError, BaseResponse, RequestOptions, buildUrl } from "./api";



async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const fetchFn = options.fetch ?? fetch;
  const headers: Record<string, string> = { ...options.headers };
  let payload: BodyInit | undefined;

  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetchFn(buildUrl(path, options.params), {
    method,
    headers,
    body: payload,
    signal: options.signal,
    credentials: "include",
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

    const errorResponse =
    isJson &&
    responseData &&
    typeof responseData === "object"
        ? (responseData as Record<string, unknown>)
        : undefined;

throw new ApiError(
    res.status,
    errorMessage,
    typeof errorResponse?.timestamp === "string"
        ? errorResponse.timestamp
        : new Date().toISOString(),
    errorResponse?.error,
);
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

export const clientApi = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};