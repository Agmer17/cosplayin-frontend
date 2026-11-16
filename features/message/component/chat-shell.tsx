"use client"

import { usePathname } from "next/navigation"
import { CHAT_BASE_PATH, ConversationList } from "./conversation-list"
import { useIsMobile } from "@/lib/responsive_util"

export function ChatShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const isIndex =
        pathname === CHAT_BASE_PATH || pathname === `${CHAT_BASE_PATH}/`

    if (isMobile) {
        return (
            <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden">
                {isIndex ? (
                    <ConversationList className="h-full min-h-0 min-w-0 flex-1" />
                ) : (
                    <main className="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden">
                        {children}
                    </main>
                )}
            </div>
        )
    }

    return (
        <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden">
            <aside className="flex h-full min-h-0 w-80 shrink-0 flex-col overflow-hidden border-r lg:w-96">
                <ConversationList className="h-full min-h-0 flex-1" />
            </aside>
            <main className="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}