
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FollowClientApi } from "../api/follow-api"
import { profileKeys } from "@/features/profiles/hooks/use-profile-query"
import { followKeys } from "./use-follow-query"
import type { FollowerResponse } from "@/lib/type/follower"

export function useToggleFollow(username: string) {
    const queryClient = useQueryClient()
    const profileQueryKey = profileKeys.other(username)

    return useMutation({
        mutationFn: ({
            userId,
            followed,
        }: {
            userId: string
            followed: boolean
        }) =>
            followed
                ? FollowClientApi.followUsers(userId)
                : FollowClientApi.unFollowUsers(userId),

        onMutate: async ({ userId, followed }) => {
            const followersKey = [...followKeys.all, "followers"]
            const followingKey = [...followKeys.all, "following"]

            // Cancel ongoing queries
            await Promise.all([
                queryClient.cancelQueries({ queryKey: profileQueryKey }),
                queryClient.cancelQueries({ queryKey: followersKey }),
                queryClient.cancelQueries({ queryKey: followingKey }),
            ])

            // Snapshot previous profile cache
            const previousProfile =
                queryClient.getQueryData<FollowerResponse>(profileQueryKey)

            // Snapshot all followers and following caches
            const previousFollowers =
                queryClient.getQueriesData<FollowerResponse[]>({
                    queryKey: followersKey,
                })

            const previousFollowing =
                queryClient.getQueriesData<FollowerResponse[]>({
                    queryKey: followingKey,
                })

            // Update profile status
            queryClient.setQueryData<FollowerResponse>(
                profileQueryKey,
                (old) =>
                    old
                        ? {
                              ...old,
                              status: followed ? "FOLLOWING" : "NONE",
                          }
                        : old
            )

            // Update status in every cached follow list
            const updateFollowLists = (
                queries: typeof previousFollowers
            ) => {
                queries.forEach(([key]) => {
                    queryClient.setQueryData<FollowerResponse[]>(
                        key,
                        (old) =>
                            old?.map((item) =>
                                item.user.username === username
                                    ? {
                                          ...item,
                                          status: followed
                                              ? "FOLLOWING"
                                              : "NONE",
                                      }
                                    : item
                            )
                    )
                })
            }

            updateFollowLists(previousFollowers)
            updateFollowLists(previousFollowing)

            return {
                previousProfile,
                previousFollowers,
                previousFollowing,
            }
        },

        onError: (_error, _variables, context) => {
            if (!context) return

            // Rollback profile
            if (context.previousProfile) {
                queryClient.setQueryData(
                    profileQueryKey,
                    context.previousProfile
                )
            }

            // Rollback all follow lists
            const previousQueries = [
                ...context.previousFollowers,
                ...context.previousFollowing,
            ]

            previousQueries.forEach(([key, data]) => {
                queryClient.setQueryData(key, data)
            })
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: profileQueryKey,
                }),

                queryClient.invalidateQueries({
                    queryKey: [...followKeys.all, "followers"],
                }),

                queryClient.invalidateQueries({
                    queryKey: [...followKeys.all, "following"],
                }),

                queryClient.invalidateQueries({
                    queryKey: profileKeys.me,
                    refetchType: "all",
                }),
            ])
        },
    })
}
