"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"

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

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import {
    Clock,
    RefreshCw,
    Search,
    UserCheck,
    UserPlus,
    UserRound,
    X,
} from "lucide-react"

import {
    useGetFollowers,
    useGetFollowing,
} from "../hooks/use-follow-query"

import type { FollowerResponse } from "@/lib/type/follower"
import { useIsMobile } from "@/lib/responsive_util"
import { useAuthStore } from "@/lib/store/auth-store"
import { useToggleFollow } from "../hooks/use-follow"

interface FollowListDialogProps {
    userId: string
    type: "followers" | "following"
    open: boolean
    onOpenChange: (open: boolean) => void
    renderAction?: (item: FollowerResponse) => ReactNode
}

type CurrentProfile = ReturnType<typeof useAuthStore.getState>["user"]

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
                    placeholder="Cari"
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

function FollowUserItem({
    item,
    currentProfile,
    onNavigate,
    action,
}: {
    item: FollowerResponse
    currentProfile: CurrentProfile
    onNavigate: () => void
    action?: ReactNode
}) {
    const { user } = item
    const isAuthenticated = Boolean(currentProfile?.id)

    const isFollowing = item.status === "FOLLOWING"
    const isRequested = item.status === "REQUESTED"
    const toggleFollow = useToggleFollow(user.username)

    const handleToggleFollow = () => {
        if (!currentProfile?.id) return

        toggleFollow.mutate({
            userId: user.id,
            followed: !isFollowing && !isRequested,
        })
    }

    return (
        <div className="flex items-center gap-3 px-4 py-2 transition-colors hover:cursor-pointer hover:bg-muted/50">
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

            {isAuthenticated && (
                <div className="shrink-0">
                    {action ?? (
                        <Button
                            size="sm"
                            variant={
                                isFollowing || isRequested
                                    ? "outline"
                                    : "default"
                            }
                            className="gap-2 rounded-full px-4 font-semibold transition-colors"
                            onClick={handleToggleFollow}
                        >
                            {isFollowing ? (
                                <>
                                    <UserCheck className="size-4" />
                                    Mengikuti
                                </>
                            ) : isRequested ? (
                                <>
                                    <Clock className="size-4" />
                                    Menunggu
                                </>
                            ) : (
                                <>
                                    <UserPlus className="size-4" />
                                    Ikuti
                                </>
                            )}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

function FollowListSkeleton() {
    return (
        <div className="space-y-4 px-4 py-2">
            {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-11 shrink-0 rounded-full" />

                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                    </div>

                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
            ))}
        </div>
    )
}

function FollowListContent({
    data,
    currentProfile,
    isLoading,
    isError,
    refetch,
    search,
    type,
    onNavigate,
    renderAction,
}: {
    data: FollowerResponse[] | undefined
    currentProfile: CurrentProfile
    isLoading: boolean
    isError: boolean
    refetch: () => void
    search: string
    type: "followers" | "following"
    onNavigate: () => void
    renderAction?: (item: FollowerResponse) => ReactNode
}) {
    const keyword = search.trim().toLowerCase()

    const filtered = useMemo(() => {
        if (!data) return []
        if (!keyword) return data

        return data.filter(
            ({ user }) =>
                user.username.toLowerCase().includes(keyword) ||
                user.display_name.toLowerCase().includes(keyword)
        )
    }, [data, keyword])

    if (isLoading) {
        return <FollowListSkeleton />
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                <p className="text-sm text-muted-foreground">
                    Gagal memuat daftar pengguna.
                </p>

                <Button variant="outline" size="sm" onClick={refetch}>
                    <RefreshCw className="size-4" />
                    Coba lagi
                </Button>
            </div>
        )
    }

    if (!data?.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-foreground">
                    <UserRound className="size-8" />
                </div>

                <p className="text-lg font-semibold">
                    {type === "followers" ? "Followers" : "Following"}
                </p>

                <p className="max-w-[240px] text-sm text-muted-foreground">
                    {type === "followers"
                        ? "Kamu akan melihat semua orang yang mengikuti akun ini di sini."
                        : "Kamu akan melihat semua akun yang diikuti di sini."}
                </p>
            </div>
        )
    }

    if (!filtered.length) {
        return (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                Tidak ada hasil untuk &quot;{search.trim()}&quot;.
            </p>
        )
    }

    return (
        <div className="py-1">
            {filtered.map((item) => (
                <FollowUserItem
                    key={item.user.id}
                    item={item}
                    currentProfile={currentProfile}
                    onNavigate={onNavigate}
                    action={renderAction?.(item)}
                />
            ))}
        </div>
    )
}

export function FollowListDialog({
    userId,
    type,
    open,
    onOpenChange,
    renderAction,
}: FollowListDialogProps) {
    const isMobile = useIsMobile()
    const [search, setSearch] = useState("")

    // Ambil current profile sekali di parent, lalu teruskan ke setiap item.
    const currentProfile = useAuthStore((state) => state.user)

    const followersQuery = useGetFollowers(
        userId,
        open && type === "followers"
    )

    const followingQuery = useGetFollowing(
        userId,
        open && type === "following"
    )

    const query = type === "followers" ? followersQuery : followingQuery

    const title = type === "followers" ? "Followers" : "Following"

    const description =
        type === "followers"
            ? "Pengguna yang mengikuti akun ini."
            : "Pengguna yang diikuti oleh akun ini."

    const handleOpenChange = (next: boolean) => {
        if (!next) setSearch("")
        onOpenChange(next)
    }

    const hasData = !!query.data?.length

    const body = (
        <>
            {hasData && (
                <SearchInput value={search} onChange={setSearch} />
            )}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <FollowListContent
                    data={query.data}
                    currentProfile={currentProfile}
                    isLoading={query.isLoading}
                    isError={query.isError}
                    refetch={query.refetch}
                    search={search}
                    type={type}
                    onNavigate={() => handleOpenChange(false)}
                    renderAction={renderAction}
                />
            </div>
        </>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={handleOpenChange}>
                <DrawerContent className="h-[75dvh] max-h-[75dvh]">
                    <DrawerHeader className="border-b border-border px-4 pb-3 pt-2 text-center">
                        <DrawerTitle className="text-base font-semibold">
                            {title}
                        </DrawerTitle>
                        <DrawerDescription className="sr-only">
                            {description}
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
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex h-[min(70vh,480px)] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[400px]">
                <DialogHeader className="border-b border-border px-4 py-3 text-center sm:text-center">
                    <DialogTitle className="text-base font-semibold">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {body}
            </DialogContent>
        </Dialog>
    )
}
