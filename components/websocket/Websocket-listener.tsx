
"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import { useWsStore } from "@/lib/store/ws-store"
import {
    NotificationResponse,
} from "@/lib/type/notification"
import { NotificationItem } from "@/features/notification/component/notification-item"

function showNotificationToast(notification: NotificationResponse) {

    toast.custom(
        () => (
            <NotificationItem data={notification} read={false} className="bg-background border border-primary" />
        ),
        {
            duration: 5000,
        },
    )
}

export default function WebSocketListener() {
    const pathname = usePathname()
    const pathnameRef = useRef(pathname)

    const subscribe = useWsStore((state) => state.subscribe)

    useEffect(() => {
        pathnameRef.current = pathname
    }, [pathname])

    useEffect(() => {
        return subscribe("/user/personal/notifications", (msg) => {
            let notification: NotificationResponse

            try {
                notification = JSON.parse(
                    msg.body,
                ) as NotificationResponse
            } catch (error) {
                console.error(
                    "[ws] Gagal membaca payload notifikasi:",
                    msg.body,
                    error,
                )
                return
            }

            const currentPath = pathnameRef.current

            if (
                currentPath === "/notification" ||
                currentPath.startsWith("/notification/")
            ) {
                return
            }

            showNotificationToast(notification)
        })
    }, [subscribe])

    return null
}