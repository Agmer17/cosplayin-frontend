import { SupportedFileType } from "./posts"
import { SimpleProfileDTO } from "./profile"

export type ConversationType = "PRIVATE" | "GROUP"

export type ConversationRoles = "ADMIN" | "USER"

export type ConversationResponseDTO = {
  id: string
  conversation_image: string
  name: string
  conv_key: string
  created_at: string
  conversation_type: ConversationType
  participants: ParticipantResponse[]
  latest_message: ConversationLatestMessageResponse[]
}

export type ParticipantResponse = {
  id: string
  user: SimpleProfileDTO
  role: ConversationRoles
}

export type ConversationLatestMessageResponse = {
  id: string
  text_content: string
  created_at: string
  first_media_url: string
  first_media_type: SupportedFileType
  read_by: MessageReadResponseDTO[]
}

export type MessageReadResponseDTO = {
  user_id: string
  read_at: string
}