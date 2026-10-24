/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationResponse } from "@/lib/type/notification"
import {
    notificationAction,
    notificationHref,
    timeAgo,
} from "@/features/notification/util/notification-util"

export function NotificationItem({ data }: { data: NotificationResponse }) {
    const isUnread = data.read_at === null
    const shownActors = data.actors.slice(0, 3)
    const first = data.actors[0]
    const others = Math.max(data.actor_count - 1, 0)

    const showCommentPreview =
        data.notification_type !== "POST_LIKE" &&
        data.notification_type !== "FOLLOW" &&
        !!data.comment_preview?.comment

    return (
        <Link
            href={notificationHref(data)}
            className={cn(
                "flex items-start gap-3 px-4 py-3 transition-colors outline-none",
                "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                isUnread && "bg-accent/50"
            )}
        >
            {/* Avatar bertumpuk */}
            <div className="flex shrink-0 -space-x-3 pt-0.5">
                {shownActors.map((actor) => (
                    <Avatar key={actor.user_id} className="size-10 ring-2 ring-background">
                        <AvatarImage src={actor.profile_picture} alt={actor.username} />
                        <AvatarFallback className="uppercase">
                            {actor.username.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </div>

            {/* Teks */}
            <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                    <span className="font-semibold">{first?.username ?? "Seseorang"}</span>
                    {others > 0 && (
                        <>
                            {" "}dan <span className="font-semibold">{others} lainnya</span>
                        </>
                    )}{" "}
                    {notificationAction[data.notification_type]}
                </p>

                {showCommentPreview && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        “{data.comment_preview.comment}”
                    </p>
                )}

                <p className="mt-1 text-xs text-muted-foreground">
                    {timeAgo(data.last_activity_at)}
                </p>
            </div>

            {/* Thumbnail post + indikator belum dibaca */}
            <div className="flex shrink-0 items-center gap-2">
                {data.post_preview?.thumbnail && (
                    <div className="relative size-11 overflow-hidden rounded-md bg-muted">
                        <img
                            src={data.post_preview.thumbnail}
                            alt="Thumbnail postingan"
                            sizes="44px"
                            className="object-cover"
                        />
                    </div>
                )}
                {isUnread && (
                    <span
                        className="size-2.5 rounded-full bg-primary"
                        role="status"
                        aria-label="Belum dibaca"
                    />
                )}
            </div>
        </Link>
    )
}