"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { IMessage } from "@stomp/stompjs"

import type { MessageResponseDTO } from "@/lib/type/message"
import type { ConversationResponseDTO } from "@/lib/type/conversation"

import { useWsSubscription } from "@/lib/use-ws-subscription"
import { conversationQueryKey } from "../hooks/key"
import { useAuthStore } from "@/lib/store/auth-store"
import { appendMessage } from "../message-util"

type LatestMessage = ConversationResponseDTO["latest_message"][number]

function toLatestMessage(
    message: MessageResponseDTO,
): LatestMessage {
    const firstMedia = message.media[0]

    return {
        id: message.id,
        text_content: message.text_content || "",
        created_at: message.created_at,
        first_media_url: firstMedia?.media_url ?? null,
        first_media_type: firstMedia?.media_type ?? null,
        read_by: message.reads,
    }
}

export function ChatMessageListener() {
    const queryClient = useQueryClient()

    const handleIncomingMessage = (stompMessage: IMessage) => {
        try {
            const message: MessageResponseDTO = JSON.parse(stompMessage.body)

            // getState() supaya selalu dapat user terbaru, tidak kena closure basi
            const myId = useAuthStore.getState().user?.id

            const latestKey = conversationQueryKey.latestChat()
            const conversation = queryClient
                .getQueryData<ConversationResponseDTO[]>(latestKey)
                ?.find((c) => c.id === message.conversation_id)

            // Conversation belum ada di sidebar -> refetch, pesan ikut ter-load dari server.
            if (!conversation) {
                void queryClient.invalidateQueries({ queryKey: latestKey })
                return
            }

            // 1. Append ke cache page chat
            if (conversation.conversation_type === "PRIVATE") {
                const other = conversation.participants.find(
                    (p) => p.user.id !== myId,
                )

                if (other) {
                    queryClient.setQueryData<MessageResponseDTO[]>(
                        conversationQueryKey.privateChat(other.user.id),
                        (old) => appendMessage(old, message),
                    )
                }
            } else {
                queryClient.setQueryData<MessageResponseDTO[]>(
                    conversationQueryKey.groupChat(conversation.id),
                    (old) => appendMessage(old, message),
                )
            }

            // 2. Update preview sidebar (sama seperti sebelumnya)
            const latestMessage = toLatestMessage(message)

            queryClient.setQueryData<ConversationResponseDTO[]>(latestKey, (previous) =>
                previous?.map((c) => {
                    if (c.id !== message.conversation_id) return c

                    const latestMessages = [
                        ...c.latest_message.filter((item) => item.id !== message.id),
                        latestMessage,
                    ].sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime(),
                    )

                    return { ...c, latest_message: latestMessages }
                }),
            )
        } catch (error) {
            console.error("[ws] Gagal memproses pesan baru:", stompMessage.body, error)
        }
    }

    // Private chat
    useWsSubscription(
        "/user/personal/private-message",
        handleIncomingMessage,
    )

    // Group chat
    useWsSubscription(
        "/user/personal/group-chat",
        handleIncomingMessage,
    )

    return null
}