import "server-only";

import { cache } from "react";
import type { RequestOptions } from "@/lib/api/api";
import { serverApi } from "@/lib/api/server-api";
import type { DetailProfileDTO } from "@/lib/type/profile";

export const profileServerApi = {
    getMyProfile: cache((options?: RequestOptions) =>
        serverApi.get<DetailProfileDTO>("/profiles/me", options)
    ),
};