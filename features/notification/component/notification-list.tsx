"use client"

import { useMemo, useState, useEffect } from "react"
import { AlertCircle, Bell, Heart, MessageCircle, MessageSquareReply, ThumbsUp, UserPlus } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/features/notification/hooks/use-notification"
import { NotificationItem } from "@/features/notification/component/notification-item"
import { NotificationSkeleton } from "@/features/notification/component/notification-skeleton"
import { notificationApi } from "../api/notification-api"
import type { NotificationType, NotificationResponse } from "@/lib/type/notification"

const NOTIFICATION_TABS: {
    value: NotificationType | "ALL"
    label: string
    icon: React.ReactNode
}[] = [
        { value: "ALL", label: "Semua", icon: <Bell className="size-4" /> },
        { value: "POST_LIKE", label: "Like Post", icon: <Heart className="size-4" /> },
        { value: "COMMENT_LIKE", label: "Like Komentar", icon: <ThumbsUp className="size-4" /> },
        { value: "POST_COMMENT", label: "Komentar", icon: <MessageCircle className="size-4" /> },
        { value: "COMMENT_REPLY", label: "Balasan", icon: <MessageSquareReply className="size-4" /> },
        { value: "FOLLOW", label: "Follow", icon: <UserPlus className="size-4" /> },
    ]

export function NotificationList() {
    const [activeTab, setActiveTab] = useState<NotificationType | "ALL">("ALL")

    useEffect(() => {
        const readAllNotif = async () => {
            notificationApi.readAllNotification()
        }
        readAllNotif()
    }, [])

    const { data, isLoading, isError, refetch, isFetching } = useNotifications()

    const filteredNotifications = useMemo(() => {
        if (!data) return []

        if (activeTab === "ALL") return data

        return data.filter(
            (notification: NotificationResponse) =>
                notification.notification_type === activeTab
        )
    }, [data, activeTab])

    if (isLoading) {
        return <NotificationSkeleton />
    }

    if (isError) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>Gagal memuat notifikasi</AlertTitle>
                    <AlertDescription>
                        <p>
                            Terjadi kesalahan saat mengambil data. Silakan coba
                            lagi.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => refetch()}
                            disabled={isFetching}
                        >
                            {isFetching ? "Memuat..." : "Coba lagi"}
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div>
            <Tabs
                value={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as NotificationType | "ALL")
                }
                className="w-full flex flex-col"
            >
                <div className="px-4 pt-2">
                    <TabsList className="w-full justify-start gap-1 overflow-x-auto bg-muted/50 p-1">
                        {NOTIFICATION_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                            >
                                {tab.icon}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                    {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <Bell className="size-6" />
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                    Belum ada notifikasi
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {activeTab === "ALL"
                                        ? "Aktivitas dari postingan dan akunmu akan muncul di sini."
                                        : "Tidak ada notifikasi untuk kategori ini."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {filteredNotifications.map((notification, index) => (
                                <div key={notification.id}>
                                    <NotificationItem data={notification} read={notification.read_at != null} className="bg-accent" />
                                    {index < filteredNotifications.length - 1 && <Separator />}
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}