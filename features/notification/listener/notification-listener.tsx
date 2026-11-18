"use client"

import { useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useWsSubscription } from "@/lib/use-ws-subscription"
import type { NotificationResponse } from "@/lib/type/notification"
import { NotificationItem } from "@/features/notification/component/notification-item"
import { notificationKeys } from "../hooks/notification-keys"

function showNotificationToast(notification: NotificationResponse) {
    toast.custom(
        () => (
            <NotificationItem
                data={notification}
                read={false}
                className="bg-background border border-primary"
            />
        ),
        {
            duration: 1500,
        },
    )
}

export default function NotificationListener() {
    const pathname = usePathname()
    const pathnameRef = useRef(pathname)
    const queryClient = useQueryClient()

    useEffect(() => {
        pathnameRef.current = pathname
    }, [pathname])

    useWsSubscription(
        "/user/personal/notifications",
        (message) => {
            let notification: NotificationResponse

            try {
                notification = JSON.parse(message.body)
            } catch (error) {
                console.error(
                    "[ws] Gagal membaca payload notifikasi:",
                    message.body,
                    error,
                )
                return
            }

            queryClient.invalidateQueries({ queryKey: notificationKeys.all })

            const currentPath = pathnameRef.current

            if (
                currentPath === "/notification" ||
                currentPath.startsWith("/notification/")
            ) {
                return
            }

            showNotificationToast(notification)
        },
    )

    return null
}