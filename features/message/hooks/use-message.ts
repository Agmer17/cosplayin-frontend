
import { useQuery } from "@tanstack/react-query"
import { conversationQueryKey } from "./key"
import { MessageClientApi } from "../api/message.client"

export function useLatestChat() {
    return useQuery({
        queryKey: conversationQueryKey.latestChat(),
        queryFn: () => MessageClientApi.getLatestChat(),
    })
}