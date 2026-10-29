import { NotificationList } from "@/features/notification/component/notification-list"

export default function NotificationsPage() {
    return (
        <main className=" mx-auto w-full max-w-xl">
            <h1 className="px-4 py-4 text-lg font-semibold">Notifikasi</h1>
            <NotificationList />
        </main>
    )
}