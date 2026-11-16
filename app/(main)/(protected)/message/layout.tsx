import { ChatShell } from "@/features/message/component/chat-shell"

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen h-dvh w-full min-w-0 overflow-hidden">
            <ChatShell>{children}</ChatShell>
        </div>
    )
}