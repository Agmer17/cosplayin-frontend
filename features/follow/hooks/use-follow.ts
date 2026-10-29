import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FollowClientApi } from "../api/follow-api"
import { profileKeys } from "@/features/profiles/hooks/use-profile-query"
import { FollowerResponse } from "@/lib/type/follower"

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient()
  const queryKey = profileKeys.other(username)

  return useMutation({
    mutationFn: ({
      userId,
      followed,
    }: {
      userId: string;
      followed: boolean;
    }) =>
      followed
        ? FollowClientApi.followUsers(userId)
        : FollowClientApi.unFollowUsers(userId),

    onMutate: async ({ followed }) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<FollowerResponse>(queryKey)

      if (previous) {
        queryClient.setQueryData<FollowerResponse>(queryKey, {
          ...previous,
          status: followed ? "FOLLOWING" : "NONE",
        })
      }

      return { previous }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey })
      await queryClient.invalidateQueries({
        queryKey: profileKeys.me,
        refetchType: "all",
      })
    },
  })
}
