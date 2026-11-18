"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { IMessage } from "@stomp/stompjs"

import type { MessageResponseDTO } from "@/lib/type/message"
import type { ConversationResponseDTO } from "@/lib/type/conversation"

import { useWsSubscription } from "@/lib/use-ws-subscription"
import { conversationQueryKey } from "../hooks/key"

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

            const queryKey = conversationQueryKey.latestChat()
            const previous =
                queryClient.getQueryData<ConversationResponseDTO[]>(queryKey)

            // Conversation belum ada di cache atau belum masuk daftar.
            if (!previous?.some(
                (conversation) => conversation.id === message.conversation_id,
            )) {
                void queryClient.invalidateQueries({ queryKey })
                return
            }

            const latestMessage = toLatestMessage(message)

            queryClient.setQueryData<ConversationResponseDTO[]>(
                queryKey,
                (previous) => {
                    if (!previous) return previous

                    return previous.map((conversation) => {
                        if (conversation.id !== message.conversation_id) {
                            return conversation
                        }

                        // Hindari duplikasi dan urutkan pesan berdasarkan waktu.
                        const latestMessages = [
                            ...conversation.latest_message.filter(
                                (item) => item.id !== message.id,
                            ),
                            latestMessage,
                        ].sort(
                            (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime(),
                        )

                        return {
                            ...conversation,
                            latest_message: latestMessages,
                        }
                    })
                },
            )
        } catch (error) {
            console.error(
                "[ws] Gagal memproses pesan baru:",
                stompMessage.body,
                error,
            )
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