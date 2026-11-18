
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import {
    MessageCircle,
    Plus,
    RefreshCw,
    Search,
    UsersRound,
    X,
} from "lucide-react"

import { useGetFollowers, useGetFollowing } from "@/features/follow/hooks/use-follow-query"

import type { FollowerResponse } from "@/lib/type/follower"
import type {
    ConversationResponseDTO,
    ParticipantResponse,
} from "@/lib/type/conversation"

import { useIsMobile } from "@/lib/responsive_util"
import { useAuthStore } from "@/lib/store/auth-store"

interface NewMessageDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    conversations: ConversationResponseDTO[]
    onCreateGroup?: () => void
}

function SearchInput({
    value,
    onChange,
}: {
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="px-4 py-3">
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Cari pengguna"
                    aria-label="Cari pengguna"
                    className="h-9 w-full rounded-lg bg-muted pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        aria-label="Hapus pencarian"
                        className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-muted-foreground/40 text-background transition-colors hover:bg-muted-foreground/60"
                    >
                        <X className="size-3" />
                    </button>
                )}
            </div>
        </div>
    )
}

function getParticipantUserId(
    participant: ParticipantResponse,
): string {
    return participant.user.username
}

function findPrivateConversation(
    conversations: ConversationResponseDTO[],
    currentUserId: string,
    username: string,
) {
    return conversations.find((conversation) => {
        if (String(conversation.conversation_type) !== "PRIVATE") {
            return false
        }

        const participantIds = conversation.participants.map(
            getParticipantUserId,
        )

        return (
            participantIds.includes(currentUserId) &&
            participantIds.includes(username)
        )
    })
}

function NewMessageUserItem({
    item,
    onMessage,
    onNavigate,
}: {
    item: FollowerResponse
    onMessage: () => void
    onNavigate: () => void
}) {
    const { user } = item

    return (
        <div className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-muted/50">
            <Link
                href={`/u/${user.username}`}
                onClick={onNavigate}
                className="flex min-w-0 flex-1 items-center gap-3"
            >
                <Avatar className="size-11 shrink-0">
                    <AvatarImage
                        src={user.avatar_url ?? undefined}
                        alt={user.display_name}
                        className="object-cover"
                    />

                    <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-semibold">
                        {user.username}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                        {user.display_name}
                    </p>
                </div>
            </Link>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Kirim pesan ke ${user.username}`}
                onClick={onMessage}
                className="size-9 shrink-0 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
            >
                <MessageCircle className="size-[19px]" />
            </Button>
        </div>
    )
}

function UserListSkeleton() {
    return (
        <div className="space-y-4 px-4 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-11 shrink-0 rounded-full" />

                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                    </div>

                    <Skeleton className="size-9 rounded-full" />
                </div>
            ))}
        </div>
    )
}

function EmptyUserList() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-muted-foreground/40">
                <UsersRound className="size-8 text-muted-foreground" />
            </div>

            <p className="text-base font-semibold">
                Belum ada pengguna
            </p>

            <p className="max-w-[240px] text-sm text-muted-foreground">
                Pengguna yang mengikuti atau kamu ikuti akan muncul di sini.
            </p>
        </div>
    )
}

export function NewMessageDialog({
    open,
    onOpenChange,
    conversations,
    onCreateGroup,
}: NewMessageDialogProps) {
    const isMobile = useIsMobile()
    const router = useRouter()

    const [search, setSearch] = useState("")

    const currentUser = useAuthStore((state) => state.user)
    const currentUserId = currentUser?.id ?? ""

    const followersQuery = useGetFollowers(
        currentUserId,
        open && !!currentUserId,
    )

    const followingQuery = useGetFollowing(
        currentUserId,
        open && !!currentUserId,
    )

    const users = useMemo(() => {
        const uniqueUsers = new Map<string, FollowerResponse>()

        const combined = [
            ...(followersQuery.data ?? []),
            ...(followingQuery.data ?? []),
        ]

        for (const item of combined) {
            if (
                item.user.id &&
                item.user.id !== currentUserId
            ) {
                uniqueUsers.set(item.user.id, item)
            }
        }

        return Array.from(uniqueUsers.values())
    }, [
        followersQuery.data,
        followingQuery.data,
        currentUserId,
    ])

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase()

        if (!keyword) return users

        return users.filter(({ user }) =>
            user.username.toLowerCase().includes(keyword) ||
            user.display_name.toLowerCase().includes(keyword),
        )
    }, [users, search])

    const isLoading =
        followersQuery.isLoading || followingQuery.isLoading

    const isError =
        followersQuery.isError && followingQuery.isError

    const handleOpenChange = (next: boolean) => {
        if (!next) setSearch("")
        onOpenChange(next)
    }

    const handleMessage = (username: string) => {
        if (!currentUserId) return

        const existingConversation = findPrivateConversation(
            conversations,
            currentUserId,
            username,
        )

        handleOpenChange(false)

        if (existingConversation) {
            router.push(`/message/${existingConversation.conv_key}`)
            return
        }

        router.push(`/message/new/${username}`)
    }

    const handleRetry = () => {
        void Promise.all([
            followersQuery.refetch(),
            followingQuery.refetch(),
        ])
    }

    const body = (
        <>
            {/* Create group */}
            <div className="border-b px-4 py-3">
                <Button
                    type="button"
                    variant="outline"
                    disabled={!onCreateGroup}
                    onClick={onCreateGroup}
                    className="h-12 w-full justify-start gap-3 rounded-xl"
                >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Plus className="size-4" />
                    </div>

                    <div className="flex flex-col items-start gap-0.5">
                        <span className="text-sm font-semibold">
                            Buat grup
                        </span>

                        <span className="text-xs text-muted-foreground">
                            Mulai percakapan bersama
                        </span>
                    </div>
                </Button>
            </div>

            {/* User list */}
            <div className="flex min-h-0 flex-1 flex-col">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                />

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    {isLoading ? (
                        <UserListSkeleton />
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                            <p className="text-sm text-muted-foreground">
                                Gagal memuat daftar pengguna.
                            </p>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRetry}
                            >
                                <RefreshCw className="size-4" />
                                Coba lagi
                            </Button>
                        </div>
                    ) : !users.length ? (
                        <EmptyUserList />
                    ) : !filteredUsers.length ? (
                        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                            Tidak ada hasil untuk &quot;{search.trim()}&quot;.
                        </p>
                    ) : (
                        <div className="py-1">
                            {filteredUsers.map((item) => (
                                <NewMessageUserItem
                                    key={item.user.id}
                                    item={item}
                                    onMessage={() =>
                                        handleMessage(item.user.username)
                                    }
                                    onNavigate={() =>
                                        handleOpenChange(false)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )

    if (isMobile) {
        return (
            <Drawer
                open={open}
                onOpenChange={handleOpenChange}
            >
                <DrawerContent className="flex h-[85dvh] max-h-[85dvh] flex-col">
                    <DrawerHeader className="border-b px-4 pb-3 pt-2 text-center">
                        <DrawerTitle className="text-base font-semibold">
                            Pesan baru
                        </DrawerTitle>

                        <DrawerDescription className="sr-only">
                            Pilih pengguna untuk memulai percakapan.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)]">
                        {body}
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="flex h-[min(75vh,560px)] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[440px]">
                <DialogHeader className="border-b px-4 py-3 text-center sm:text-center">
                    <DialogTitle className="text-base font-semibold">
                        Pesan baru
                    </DialogTitle>

                    <DialogDescription className="sr-only">
                        Pilih pengguna untuk memulai percakapan.
                    </DialogDescription>
                </DialogHeader>

                {body}
            </DialogContent>
        </Dialog>
    )
}
