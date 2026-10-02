import type { RequestOptions } from "@/lib/api/api";
import { clientApi } from "@/lib/api/client-api";
import type { DetailProfileDTO } from "@/lib/type/profile";

export const profileClientApi = {
    getMyProfile: (options?: RequestOptions) =>
        clientApi.get<DetailProfileDTO>("/profiles/me", options),

    submitOnBoarding : (form : FormData) =>
        clientApi.post<DetailProfileDTO>("/profiles/me/onboarding", form),

    getOtherProfile : (username : string) =>
        clientApi.get<DetailProfileDTO>("/profiles/u/" + username),

    updateMyProfile : (form : FormData) => 
        clientApi.patch<DetailProfileDTO>("/profiles/me", form),

    updateMyUsername : (newUsername : string) =>
        clientApi.patch<string>("/users/me/username", {username : newUsername})

};