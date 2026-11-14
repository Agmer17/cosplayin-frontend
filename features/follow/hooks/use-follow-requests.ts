
import { useInvalidateNotifications } from "@/features/notification/hooks/use-notification"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FollowClientApi } from "../api/follow-api"


export const followRequestKeys = {
    all: ["follow-requests"] as const,
}

export function useAcceptFollowRequest() {
    const queryClient = useQueryClient()
    const invalidateNotifications = useInvalidateNotifications()

    return useMutation({
        mutationFn: (id: string) =>
            FollowClientApi.acceptFollowRequest(id),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: followRequestKeys.all,
                }),
                invalidateNotifications(),
            ])
        },
    })
}

export function useDeclineFollowRequest() {
    const queryClient = useQueryClient()
    const invalidateNotifications = useInvalidateNotifications()

    return useMutation({
        mutationFn: (id: string) =>
            FollowClientApi.declineFollowRequest(id),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: followRequestKeys.all,
                }),
                invalidateNotifications(),
            ])
        },
    })
}
