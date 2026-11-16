import type { SupportedFileType } from "./posts"
import type { SimpleProfileDTO } from "./profile"
import type { MessageReadResponseDTO } from "./conversation"

export type { MessageReadResponseDTO } from "./conversation"

export type MessageResponseDTO = {
    id: string
    conversation_id: string
    sender: SimpleProfileDTO
    text_content: string | null
    reply_to: MessageReplyToDTO | null
    media: MessageMediaDTO[]
    reads: MessageReadResponseDTO[]
    created_at: string
}

export type MessageReplyToDTO = {
    text_content: string | null
    sender_username: string
    media_url: string | null
}

export type MessageMediaDTO = {
    id: string
    media_url: string
    media_type: SupportedFileType
    media_order: number
}

export type CreateMessageInput = {
    replyTo?: string | null
    textContent?: string
    media?: File[]
}