import { useQuery } from "@tanstack/react-query"
import { FollowClientApi } from "../api/follow-api"

export const followKeys = {
    all: ["follow"] as const,

    followers: (userId: string) =>
        [...followKeys.all, "followers", userId] as const,

    following: (userId: string) =>
        [...followKeys.all, "following", userId] as const,

    requests: () =>
        [...followKeys.all, "requests"] as const,
}

export function useGetFollowers(userId: string, enabled = true) {
  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: () => FollowClientApi.getFollowers(userId),
    enabled: !!userId && enabled,
  })
}

export function useGetFollowing(userId: string, enabled = true) {
  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: () => FollowClientApi.getFollowing(userId),
    enabled: !!userId && enabled,
  })
}


export function useGetFollowRequests(enabled = true) {
    return useQuery({
        queryKey: followKeys.requests(),
        queryFn: () => FollowClientApi.getFollowRequest(),
        enabled,
    })
}