
/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { NotificationResponse } from "@/lib/type/notification"
import {
    notificationAction,
    notificationHref,
    timeAgo,
} from "@/features/notification/util/notification-util"

type NotificationItemProps = {
    data: NotificationResponse
    read?: boolean
    className?: string
}

export function NotificationItem({
    data,
    className,
}: NotificationItemProps) {
    const shownActors = data.actors.slice(0, 3)
    const first = data.actors[0]
    const others = Math.max(data.actor_count - 1, 0)

    const isVideo = data.post_preview?.fileType === "VIDEO"

    const showCommentPreview =
        data.notification_type !== "POST_LIKE" &&
        data.notification_type !== "FOLLOW" &&
        !!data.comment_preview?.comment

    return (
        <Link
            href={notificationHref(data)}
            className={cn(
                "relative flex items-start gap-3 rounded-2xl px-4 py-3 text-foreground outline-none transition-colors",
                "focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                className,
            )}
        >
            {/* Avatar bertumpuk */}
            <div className="flex shrink-0 -space-x-3 pt-0.5">
                {shownActors.map((actor) => (
                    <Avatar
                        key={actor.user_id}
                        className="size-10 ring-2 ring-background"
                    >
                        <AvatarImage
                            src={actor.profile_picture}
                            alt={actor.username}
                        />
                        <AvatarFallback className="uppercase">
                            {actor.username.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </div>

            {/* Teks notifikasi */}
            <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
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
                    )}{" "}
                    {notificationAction[data.notification_type]}
                </p>

                {showCommentPreview && (
                    <p className="mt-0.5 line-clamp-2 text-sm">
                        “{data.comment_preview?.comment}”
                    </p>
                )}

                <p className="mt-1 text-xs">
                    {timeAgo(data.created_at)}
                </p>
            </div>

            {/* Thumbnail postingan dan indikator belum dibaca */}
            <div className="flex shrink-0 items-center gap-2">
                {data.post_preview?.thumbnail && (
                    <div className="relative size-11 overflow-hidden rounded-md bg-muted">
                        {isVideo ? (
                            <>
                                <video
                                    src={data.post_preview.thumbnail}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="absolute inset-0 size-full object-cover"
                                />

                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Play className="size-5 fill-white text-white drop-shadow" />
                                </div>
                            </>
                        ) : (
                            <img
                                src={data.post_preview.thumbnail}
                                alt="Thumbnail postingan"
                                className="size-full object-cover"
                            />
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
}
