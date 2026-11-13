import { ChatShell } from "@/features/message/component/chat-shell"


export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return <ChatShell>{children}</ChatShell>
}