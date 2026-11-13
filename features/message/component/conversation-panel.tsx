"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLatestChat } from "../hooks/use-message"
import { CHAT_BASE_PATH } from "./conversation-list"

export function ConversationPanel({ convKey }: { convKey: string }) {
    const router = useRouter()
    const { data } = useLatestChat()

    const conversation = data?.find((c) => c.conv_key === convKey)

    return (
        <div className="flex h-full min-h-0 w-full flex-col bg-background">
            <header className="flex items-center gap-3 border-b px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => router.push(CHAT_BASE_PATH)}
                >
                    <ArrowLeft className="size-5" />
                    <span className="sr-only">Kembali</span>
                </Button>

                {conversation && (
                    <Avatar className="size-9">
                        <AvatarImage
                            src={conversation.conversation_image}
                            alt={conversation.name}
                        />
                        <AvatarFallback>
                            {conversation.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )}

                <span className="truncate text-sm font-medium">
                    {conversation?.name ?? "Percakapan"}
                </span>
            </header>

            <div className="flex flex-1 items-center justify-center p-6">
                <p className="break-all text-sm text-muted-foreground">{convKey}</p>
            </div>
        </div>
    )
}