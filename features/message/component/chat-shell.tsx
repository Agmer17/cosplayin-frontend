"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CHAT_BASE_PATH, ConversationList } from "./conversation-list"

export function ChatShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isIndex =
        pathname === CHAT_BASE_PATH || pathname === `${CHAT_BASE_PATH}/`

    return (
        <div className="flex h-dvh w-full overflow-hidden">
            <aside
                className={cn(
                    "w-[37%] shrink-0 border-r border-l md:w-80 lg:w-96",
                    !isIndex && "hidden md:block"
                )}
            >
                <ConversationList />
            </aside>

            <main className={cn("min-w-0 flex-1", isIndex && "hidden md:flex")}>
                {children}
            </main>
        </div>
    )
}