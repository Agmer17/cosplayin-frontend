import { clientApi } from "@/lib/api/client-api"
import { ConversationResponseDTO } from "@/lib/type/conversation"

export const MessageClientApi = {

    getLatestChat : () =>
        clientApi.get<ConversationResponseDTO[]>("/conversation/me/latest")
}