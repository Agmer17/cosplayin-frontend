
"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { CHAT_BASE_PATH } from "./conversation-list"
import { useIsMobile } from "@/lib/responsive_util"

import type { ConversationResponseDTO } from "@/lib/type/conversation"
import type { MessageResponseDTO } from "@/lib/type/message"

import { ConversationChat } from "./conversation-chat"

interface ConversationPanelProps {
    conversation: ConversationResponseDTO
    messages: MessageResponseDTO[]
    currentUserId: string
    isGroup?: boolean

    value: string
    onValueChange: (value: string) => void

    files: File[]
    onAddFiles: (files: File[]) => void
    onRemoveFile: (file: File) => void

    replyTo?: MessageResponseDTO | null
    onReply?: (message: MessageResponseDTO) => void
    onCancelReply?: () => void

    onSend: () => void
    disabled?: boolean
    isSending?: boolean
}

export function ConversationPanel({
    conversation,
    messages,
    currentUserId,
    isGroup = false,
    value,
    onValueChange,
    files,
    onAddFiles,
    onRemoveFile,
    replyTo,
    onReply,
    onCancelReply,
    onSend,
    disabled = false,
    isSending = false,
}: ConversationPanelProps) {
    const router = useRouter()
    const isMobile = useIsMobile()

    return (
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">

            {/* Fixed conversation header */}
            <header className="flex h-[68px] shrink-0 items-center gap-3 border-b px-4">
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(CHAT_BASE_PATH)}
                    >
                        <ArrowLeft className="size-5" />
                        <span className="sr-only">Kembali</span>
                    </Button>
                )}

                <Avatar className="size-9">
                    <AvatarImage
                        src={conversation.conversation_image}
                        alt={conversation.name}
                    />
                    <AvatarFallback>
                        {conversation.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <span className="truncate text-sm font-medium">
                    {conversation.name}
                </span>
            </header>

            {/* Chat body */}
            <ConversationChat
                className="min-h-0 flex-1"
                messages={messages}
                currentUserId={currentUserId}
                isGroup={isGroup}
                value={value}
                onValueChange={onValueChange}
                files={files}
                onAddFiles={onAddFiles}
                onRemoveFile={onRemoveFile}
                replyTo={replyTo}
                onReply={onReply}
                onCancelReply={onCancelReply}
                onSend={onSend}
                disabled={disabled}
                isSending={isSending}
            />
        </div>
    )
}
