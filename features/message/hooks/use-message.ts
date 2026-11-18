import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { conversationQueryKey } from "./key"
import { MessageClientApi } from "../api/message.client"
import type { CreateMessageInput, MessageResponseDTO } from "@/lib/type/message"
import { appendMessage } from "../message-util"

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
        mutationFn: ({ userId, form }: { userId: string; form: CreateMessageInput }) =>
            MessageClientApi.sendMessage(userId, form),
        onSuccess: (message, { userId }) => {
            queryClient.setQueryData<MessageResponseDTO[]>(
                conversationQueryKey.privateChat(userId),
                (old) => appendMessage(old, message),
            )

            queryClient.invalidateQueries({
                queryKey: conversationQueryKey.latestChat(),
            })
        },
    })
}