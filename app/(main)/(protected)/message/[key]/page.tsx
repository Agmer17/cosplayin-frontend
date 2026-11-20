"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

import { ConversationPanel } from "@/features/message/component/conversation-panel"
import {
    useLatestChat,
    usePrivateChat,
    useSendPrivateMessage,
} from "@/features/message/hooks/use-message"

import type { MessageResponseDTO } from "@/lib/type/message"
import { useAuthStore } from "@/lib/store/auth-store"

export default function ConversationPage() {
    const params = useParams<{ key: string }>()
    const profile = useAuthStore((state) => state.user)

    const [draft, setDraft] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [replyTo, setReplyTo] = useState<MessageResponseDTO | null>(null)

    const { data: conversations, isLoading } = useLatestChat()
    const { mutate: sendMessage, isPending: isSending } =
        useSendPrivateMessage()

    const conversation = conversations?.find(
        (item) => item.conv_key === decodeURIComponent(params.key)
    )

    const otherParticipant =
        conversation?.conversation_type === "PRIVATE"
            ? conversation.participants.find(
                (participant) => participant.user.id !== profile?.id
            )
            : undefined

    const otherUserId = otherParticipant?.user.id ?? ""

    const { data: messages } = usePrivateChat(otherUserId)

    const handleSend = () => {
        if ((!draft.trim() && files.length === 0) || !otherUserId || isSending) {
            return
        }

        sendMessage(
            {
                userId: otherUserId,
                form: {
                    textContent: draft.trim() || undefined,
                    media: files.length > 0 ? files : undefined,
                    replyTo: replyTo?.id ?? null,
                },
            },
            {
                onSuccess: () => {
                    setDraft("")
                    setFiles([])
                    setReplyTo(null)
                },
            }
        )
    }

    if (isLoading) return null

    if (!conversation || !profile) return null

    return (
        <div className="flex h-dvh max-h-dvh w-full min-h-0 min-w-0 flex-1 overflow-hidden">
            <ConversationPanel
                conversation={conversation}
                messages={
                    conversation.conversation_type === "PRIVATE"
                        ? (messages ?? [])
                        : []
                }
                currentUserId={profile.id}
                isGroup={conversation.conversation_type === "GROUP"}
                value={draft}
                onValueChange={setDraft}
                files={files}
                onAddFiles={(added) =>
                    setFiles((prev) => [...prev, ...added])
                }
                onRemoveFile={(file) =>
                    setFiles((prev) =>
                        prev.filter((item) => item !== file)
                    )
                }
                replyTo={replyTo}
                onReply={setReplyTo}
                onCancelReply={() => setReplyTo(null)}
                onSend={handleSend}
                isSending={isSending}
            />
        </div>
    )
}