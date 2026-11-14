/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import {
    AtSign,
    Bell,
    Heart,
    MessageCircle,
    Play,
    UserPlus,
    type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import type { NotificationResponse } from "@/lib/type/notification"

import {
    notificationAction,
    notificationHref,
    timeAgo,
} from "@/features/notification/util/notification-util"
import {
    useAcceptFollowRequest,
    useDeclineFollowRequest,
} from "@/features/follow/hooks/use-follow-requests"

type NotificationItemProps = {
    data: NotificationResponse
    read?: boolean
    className?: string
}

// Badge kecil di pojok avatar (ala TikTok). Sesuaikan key dengan enum backend-mu.
const typeBadge: Record<string, { icon: LucideIcon; className: string }> = {
    POST_LIKE: { icon: Heart, className: "bg-destructive text-white" },
    COMMENT_LIKE: { icon: Heart, className: "bg-destructive text-white" },
    POST_COMMENT: {
        icon: MessageCircle,
        className: "bg-primary text-primary-foreground",
    },
    COMMENT_REPLY: {
        icon: MessageCircle,
        className: "bg-primary text-primary-foreground",
    },
    MENTION: { icon: AtSign, className: "bg-primary text-primary-foreground" },
    FOLLOW: { icon: UserPlus, className: "bg-primary text-primary-foreground" },
    FOLLOW_REQUEST: {
        icon: UserPlus,
        className: "bg-primary text-primary-foreground",
    },
}

const fallbackBadge = {
    icon: Bell,
    className: "bg-muted-foreground text-background",
}

export function NotificationItem({
    data,
    read,
    className,
}: NotificationItemProps) {
    const acceptMutation = useAcceptFollowRequest()
    const declineMutation = useDeclineFollowRequest()

    const first = data.actors[0]
    const others = Math.max(data.actor_count - 1, 0)

    const isFollowRequest = data.notification_type === "FOLLOW_REQUEST"
    const isVideo = data.post_preview?.fileType === "VIDEO"
    const isProcessing =
        acceptMutation.isPending || declineMutation.isPending

    const showCommentPreview =
        !["POST_LIKE", "FOLLOW", "FOLLOW_REQUEST"].includes(
            data.notification_type,
        ) && !!data.comment_preview?.comment

    const badge = typeBadge[data.notification_type] ?? fallbackBadge
    const BadgeIcon = badge.icon

    const handleAccept = () => {
        if (!first?.user_id || isProcessing) return

        acceptMutation.mutate(first.user_id, {
            onSuccess: () => toast.success("Permintaan mengikuti diterima!"),
            onError: () => toast.error("Gagal menerima permintaan mengikuti."),
        })
    }

    const handleDecline = () => {
        if (!first?.user_id || isProcessing) return

        declineMutation.mutate(first.user_id, {
            onSuccess: () => toast.success("Permintaan mengikuti ditolak."),
            onError: () => toast.error("Gagal menolak permintaan mengikuti."),
        })
    }

    // Setelah request ditolak, tombol disembunyikan.
    const showFollowActions = isFollowRequest && !declineMutation.isSuccess

    return (
        <div
            className={cn(
                "relative flex items-center gap-3 px-4 py-3 transition-colors",
                "hover:bg-muted/50",
                !read && "bg-primary/5",
                className,
            )}
        >
            {/* Dot unread di tepi kiri */}
            {!read && (
                <span
                    aria-label="Belum dibaca"
                    className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary"
                />
            )}

            {/* Avatar + text (satu area klik) */}
            <Link
                href={notificationHref(data)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <div className="relative shrink-0">
                    <Avatar className="size-12">
                        <AvatarImage
                            src={first?.profile_picture}
                            alt={first?.username}
                        />
                        <AvatarFallback className="uppercase">
                            {first?.username?.charAt(0) ?? "?"}
                        </AvatarFallback>
                    </Avatar>

                    <span
                        aria-hidden
                        className={cn(
                            "absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full ring-2 ring-background",
                            badge.className,
                        )}
                    >
                        <BadgeIcon className="size-2.5 fill-current" />
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-foreground">
                        <span className="font-semibold">
                            {first?.username ?? "Seseorang"}
                        </span>

                        {others > 0 && (
                            <>
                                {" "}dan{" "}
                                <span className="font-semibold">
                                    {others} lainnya
                                </span>
                            </>
                        )}

                        {" "}
                        {notificationAction[data.notification_type]}

                        {/* Waktu inline, ala Instagram */}
                        <span className="ml-1.5 whitespace-nowrap text-xs text-muted-foreground">
                            {timeAgo(data.created_at)}
                        </span>
                    </p>

                    {showCommentPreview && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                            {data.comment_preview?.comment}
                        </p>
                    )}
                </div>
            </Link>

            {/* Kanan: tombol follow request ATAU thumbnail post */}
            {showFollowActions ? (
                <div className="flex shrink-0 items-center gap-2">
                    {acceptMutation.isSuccess ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 rounded-lg px-4"
                            disabled
                        >
                            Diterima
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="sm"
                                className="h-8 rounded-lg px-4"
                                disabled={isProcessing || !first?.user_id}
                                onClick={handleAccept}
                            >
                                {acceptMutation.isPending
                                    ? "Memproses..."
                                    : "Konfirmasi"}
                            </Button>

                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 rounded-lg px-4"
                                disabled={isProcessing || !first?.user_id}
                                onClick={handleDecline}
                            >
                                {declineMutation.isPending
                                    ? "Memproses..."
                                    : "Hapus"}
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                data.post_preview?.thumbnail && (
                    <Link
                        href={notificationHref(data)}
                        tabIndex={-1}
                        aria-hidden
                        className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                        {isVideo ? (
                            <>
                                <video
                                    src={data.post_preview.thumbnail}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="absolute inset-0 size-full object-cover"
                                />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                                    <Play className="size-4 fill-white text-white drop-shadow" />
                                </div>
                            </>
                        ) : (
                            <img
                                src={data.post_preview.thumbnail}
                                alt="Thumbnail postingan"
                                className="size-full object-cover"
                            />
                        )}
                    </Link>
                )
            )}
        </div>
    )
}