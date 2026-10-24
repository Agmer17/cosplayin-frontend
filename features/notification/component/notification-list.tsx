"use client"

import { AlertCircle, Bell } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/features/notification/hooks/use-notification"
import { NotificationItem } from "@/features/notification/component/notification-item"
import { NotificationSkeleton } from "@/features/notification/component/notification-skeleton"

export function NotificationList() {
    const { data, isLoading, isError, refetch, isFetching } =
        useNotifications()

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

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Bell className="size-6" />
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                        Belum ada notifikasi
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Aktivitas dari postingan dan akunmu akan muncul di sini.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {data.map((notification, index) => (
                <div key={notification.id}>
                    <NotificationItem data={notification} />

                    {index < data.length - 1 && <Separator />}
                </div>
            ))}
        </div>
    )
}