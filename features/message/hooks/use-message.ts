import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { conversationQueryKey } from "./key"
import { MessageClientApi } from "../api/message.client"
import type { CreateMessageInput } from "@/lib/type/message"

export function useLatestChat() {
    return useQuery({
        queryKey: conversationQueryKey.latestChat(),
        queryFn: MessageClientApi.getLatestChat,
    })
}

export function usePrivateChat(userId: string) {
    return useQuery({
        queryKey: conversationQueryKey.privateChat(userId),
        queryFn: () => MessageClientApi.getPrivateMessage(userId),
        enabled: !!userId,
    })
}

export function useSendPrivateMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            userId,
            form,
        }: {
            userId: string
            form: CreateMessageInput
        }) => MessageClientApi.sendMessage(userId, form),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: conversationQueryKey.latestChat(),
            })
        },
    })
}