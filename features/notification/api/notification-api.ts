import { clientApi } from "@/lib/api/client-api"
import { NotificationResponse } from "@/lib/type/notification"


export const notificationApi = {
    getMyNotification : () => {
        return clientApi.get<NotificationResponse[]>("/notifications")
    },

    readAllNotification : () => 
        clientApi.get<string>("/notifications/read-all")
}