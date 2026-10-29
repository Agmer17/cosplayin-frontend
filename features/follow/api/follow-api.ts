import { clientApi } from "@/lib/api/client-api";
import { FollowerResponse } from "@/lib/type/follower";

export const FollowClientApi = {

    followUsers : (id : string) =>
        clientApi.post<FollowerResponse>(`/users/${id}/follow`),
    
    unFollowUsers :(id : string) =>
        clientApi.delete(`/users/${id}/follow`),
}