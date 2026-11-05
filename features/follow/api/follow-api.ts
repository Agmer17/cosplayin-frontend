import { clientApi } from "@/lib/api/client-api"
import { FollowerResponse } from "@/lib/type/follower"

export const FollowClientApi = {

    followUsers : (id : string) =>
        clientApi.post<FollowerResponse>(`/users/${id}/follow`),
    
    unFollowUsers :(id : string) =>
        clientApi.delete(`/users/${id}/follow`),

    getFollowers : (id : string ) =>
        clientApi.get<FollowerResponse[]>(`/users/${id}/follow`),

    getFollowing : (id : string) => 
        clientApi.get<FollowerResponse[]>(`/users/${id}/following`),

    getFollowRequest : () => 
        clientApi.get<FollowerResponse[]>(`/profiles/me/following-requests`),

    declineFollowRequest: (id: string) =>
        clientApi.delete(`/users/${id}/follow-requests`),

    acceptFollowRequest: (id: string) =>
        clientApi.post<string>(`/users/${id}/follow-requests`),

}