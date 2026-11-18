"use client"
import { CHAT_BASE_PATH } from "@/features/message/component/conversation-list"
import { ConversationPanel } from "@/features/message/component/conversation-panel"
import { useSendPrivateMessage } from "@/features/message/hooks/use-message"
import { generateConvKey } from "@/features/message/message-util"
import { useOtherProfile } from "@/features/profiles/hooks/use-profile-query"
import { useAuthStore } from "@/lib/store/auth-store"
import { ConversationResponseDTO } from "@/lib/type/conversation"
import { MessageResponseDTO } from "@/lib/type/message"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function NewMessagePage() {
    const params = useParams<{ username: string }>()

    const profile = useAuthStore((state) => state.user)
    const router = useRouter()

    const [draft, setDraft] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [replyTo, setReplyTo] = useState<MessageResponseDTO | null>(null)

    const { data: targetUser, isLoading } = useOtherProfile(params.username)
    const { mutate: sendMessage, isPending: isSending } =
        useSendPrivateMessage()

    const otherUserId = targetUser?.id

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
                    router.push(`${CHAT_BASE_PATH}/${encodeURIComponent(generateConvKey(profile?.id || "", targetUser.id))}`)
                },
            }
        )
    }

    const DEFAULT_CONVERSATION: ConversationResponseDTO = {
        id: "",
        conversation_image: targetUser?.avatar_url || "",
        name: targetUser?.username || "",
        conv_key: "",
        created_at: "",
        conversation_type: "PRIVATE",
        participants: [],
        latest_message: [],
    }

    if (isLoading) return null
    if (!profile || !targetUser) return null

    return (
        <div className="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden">
            <ConversationPanel
                conversation={DEFAULT_CONVERSATION}
                messages={[]}
                currentUserId={profile.id}
                isGroup={false}
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