"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { MessageCircle, Plus, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useLatestChat } from "../hooks/use-message"
import { useAuthStore } from "@/lib/store/auth-store"
import { getSortTime } from "../message-util"
import { ConversationItem } from "./conversation-item"
import { NewMessageDialog } from "./new-message-dialog"

export const CHAT_BASE_PATH = "/message"



function ConversationListSkeleton() {
    return (
        <div className="flex flex-col gap-1 px-2 py-1">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                    <Skeleton className="size-12 shrink-0 rounded-full" />

                    <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                            <Skeleton className="h-3.5 w-2/5" />
                            <Skeleton className="h-3 w-10" />
                        </div>
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


    const [newOpen, setNewOpen] = useState<boolean>(false)


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
        <div
            className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden bg-background",
                className
            )}
        >
            <div className="flex h-17 shrink-0 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold tracking-tight">Pesan</h1>
                    {!isLoading && conversations.length > 0 && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                            {conversations.length}
                        </span>
                    )}

                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNewOpen(true)}
                >
                    <Plus className="size-5" />
                </Button>

                <NewMessageDialog
                    open={newOpen}
                    onOpenChange={setNewOpen}
                    conversations={conversations}
                />


            </div>

            <div className="shrink-0 px-3 pt-3 pb-2">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari percakapan..."
                        className="h-9 rounded-full border-transparent bg-muted/70 pl-9 pr-8 text-sm shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-border focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/20"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Hapus pencarian"
                            className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Daftar percakapan */}
            <ScrollArea className="min-h-0 flex-1 overflow-hidden [&_[data-radix-scroll-area-viewport]>div]:block!">
                {isLoading ? (
                    <ConversationListSkeleton />
                ) : isError ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            Gagal memuat percakapan.
                        </p>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                            className="rounded-full"
                        >
                            Coba lagi
                        </Button>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center gap-2.5 px-6 py-14 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <MessageCircle className="size-5" />
                        </div>

                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground">
                                {search
                                    ? "Percakapan tidak ditemukan"
                                    : "Belum ada pesan"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {search
                                    ? `Tidak ada hasil untuk "${search}"`
                                    : "Mulai obrolan baru untuk melihatnya di sini."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0.5 px-2 py-1">
                        {conversations.map((conversation) => {
                            const targetPath = `${CHAT_BASE_PATH}/${encodeURIComponent(conversation.conv_key)}`
                            const rawPath = `${CHAT_BASE_PATH}/${conversation.conv_key}`
                            const isActive =
                                pathname === targetPath || pathname === rawPath

                            return (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    currentUserId={currentUserId}
                                    active={isActive}
                                    onSelect={handleSelect}
                                />
                            )
                        })}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}