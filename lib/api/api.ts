export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public timestamp: string,
        public data?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}
export interface BaseResponse<T> {
  message: string;
  data: T;
}

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API ?? "";

export type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Override fetch (tests, or rare SSR usage). Client components can omit this. */
  fetch?: typeof fetch;
  params?: Record<string, string | number | boolean | undefined | null>;
};



export function buildUrl(
  path: string,
  params?: RequestOptions["params"]
): string {
  const url = `${BASE_URL}${path}`;
  if (!params) return url;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }

  const qs = search.toString();
  if (!qs) return url;
  return url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
}
