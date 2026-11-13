
"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { MessageCircle, Paperclip, Search } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ConversationResponseDTO } from "@/lib/type/conversation"
import { useLatestChat } from "../hooks/use-message"
import { useAuthStore } from "@/lib/store/auth-store"

export const CHAT_BASE_PATH = "/chat"

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
})

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
})

function formatTime(iso: string) {
    const date = new Date(iso)
    const isToday = date.toDateString() === new Date().toDateString()

    return isToday ? timeFormatter.format(date) : dateFormatter.format(date)
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
}

function getSortTime(conversation: ConversationResponseDTO) {
    const latest = conversation.latest_message?.[0]

    return new Date(latest?.created_at ?? conversation.created_at).getTime()
}

function ConversationItem({
    conversation,
    active,
    currentUserId,
    onSelect,
}: {
    conversation: ConversationResponseDTO
    active: boolean
    currentUserId: string | undefined
    onSelect: (convKey: string) => void
}) {
    const latest = conversation.latest_message?.[0]
    const hasMedia = !!latest?.first_media_url
    const hasText = !!latest?.text_content

    // Unread jika current user belum ada di dalam read_by.
    const hasUnread = !!latest && !!currentUserId &&
        !latest.read_by?.some((reader) => reader.user_id === currentUserId)

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={() => onSelect(conversation.conv_key)}
            className={cn(
                "h-auto w-full justify-start gap-3 rounded-none px-4 py-3 text-left font-normal",
                active && "bg-accent text-accent-foreground"
            )}
        >
            <Avatar className="size-12 shrink-0">
                <AvatarImage
                    src={conversation.conversation_image}
                    alt={conversation.name}
                />
                <AvatarFallback>
                    {getInitials(conversation.name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                        {conversation.name}
                    </span>

                    {latest && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                            {formatTime(latest.created_at)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex min-w-0 flex-1 items-center gap-1">
                        {!latest ? (
                            <span className="truncate">
                                Belum ada pesan
                            </span>
                        ) : (
                            <>
                                {hasMedia && (
                                    <Paperclip className="size-3.5 shrink-0" />
                                )}

                                <span className="truncate">
                                    {hasText ? latest.text_content : "Media"}
                                </span>
                            </>
                        )}
                    </div>

                    {hasUnread && (
                        <span
                            className="size-2 shrink-0 rounded-full bg-primary"
                            aria-label="Pesan belum dibaca"
                        />
                    )}
                </div>
            </div>
        </Button>
    )
}

function ConversationListSkeleton() {
    return (
        <div className="flex flex-col">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="size-12 shrink-0 rounded-full" />

                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-3 w-4/5" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function ConversationList({ className }: { className?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const [search, setSearch] = useState("")

    const currentUserId = useAuthStore((state) => state.user?.id)

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
    } = useLatestChat()

    const conversations = useMemo(() => {
        const keyword = search.trim().toLowerCase()

        return [...(data ?? [])]
            .filter((c) => c.name.toLowerCase().includes(keyword))
            .sort((a, b) => getSortTime(b) - getSortTime(a))
    }, [data, search])

    const handleSelect = (convKey: string) => {
        router.push(`${CHAT_BASE_PATH}/${encodeURIComponent(convKey)}`)
    }

    return (
        <div className={cn("flex h-full min-h-0 flex-col bg-background", className)}>
            <div className="flex flex-col gap-3 border-b p-4">
                <h1 className="text-xl font-semibold">Pesan</h1>

                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari percakapan"
                        className="pl-9"
                    />
                </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                {isLoading ? (
                    <ConversationListSkeleton />
                ) : isError ? (
                    <div className="flex flex-col items-center gap-3 p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Gagal memuat percakapan.
                        </p>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                        >
                            Coba lagi
                        </Button>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
                        <MessageCircle className="size-8" />

                        <p className="text-sm">
                            {search
                                ? "Percakapan tidak ditemukan"
                                : "Belum ada percakapan"}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                currentUserId={currentUserId}
                                active={
                                    pathname ===
                                    `${CHAT_BASE_PATH}/${encodeURIComponent(conversation.conv_key)}`
                                }
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
