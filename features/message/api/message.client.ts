import { clientApi } from "@/lib/api/client-api"
import { ConversationResponseDTO } from "@/lib/type/conversation"
import { CreateMessageInput, MessageResponseDTO } from "@/lib/type/message"

export const MessageClientApi = {

    getLatestChat : () =>
        clientApi.get<ConversationResponseDTO[]>("/conversation/me/latest"),

    getPrivateMessage : (userId : string) => 
        clientApi.get<MessageResponseDTO[]>("/message/direct/" + userId),

   sendMessage: (userId: string, form: CreateMessageInput) => {
        const formData = new FormData()

        if (form.replyTo) {
            formData.append("replyTo", form.replyTo)
        }

        if (form.textContent?.trim()) {
            formData.append("textContent", form.textContent.trim())
        }

        form.media?.forEach((file) => {
            formData.append("media", file)
        })

        return clientApi.post<MessageResponseDTO>(
            `/message/direct/${userId}`,
            formData
        )
    },


}