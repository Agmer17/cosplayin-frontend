"use client";

import { useEffect, useRef } from "react";
import { useWsStore } from "@/lib/store/ws-store";
import { usePathname } from "next/navigation";
import { NotificationResponse, NotificationType } from "@/lib/type/notification";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const POST_RELATED_TYPES = new Set<NotificationType>([
    "POST_LIKE",
    "POST_COMMENT",
]);

const messages: Record<NotificationType, string> = {
    POST_LIKE: "menyukai postinganmu",
    COMMENT_LIKE: "menyukai komentarmu",
    POST_COMMENT: "mengomentari postinganmu",
    COMMENT_REPLY: "membalas komentarmu",
    FOLLOW: "mulai mengikutimu",
};

function showNotificationToast(notification: NotificationResponse) {
    const actor = notification.actors?.[0];
    const username = actor?.username ?? "Seseorang";
    const otherActors = Math.max((notification.actor_count ?? 1) - 1, 0);
    const actorText =
        otherActors > 0 ? `${username} dan ${otherActors} lainnya` : username;

    const isPostRelated = POST_RELATED_TYPES.has(notification.notification_type);
    const thumbnail = isPostRelated
        ? notification.post_preview?.thumbnail
        : null;

    const showCommentSnippet =
        (notification.notification_type === "POST_COMMENT" ||
            notification.notification_type === "COMMENT_REPLY" ||
            notification.notification_type === "COMMENT_LIKE") &&
        notification.comment_preview?.comment;

    toast.custom(
        (t) => (
            <div
                className={cn(
                    "pointer-events-auto flex w-full max-w-[min(100vw-2rem,24rem)] items-start gap-3",
                    "rounded-xl border bg-background p-3 shadow-lg",
                    "sm:max-w-sm",
                )}
                onClick={() => toast.dismiss(t)}
            >
                {/* Avatar actor */}
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                        src={actor?.profile_picture}
                        alt={username}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="truncate text-sm font-medium leading-snug text-foreground">
                        {actorText}
                    </p>
                    <p className="text-sm leading-snug text-muted-foreground">
                        {messages[notification.notification_type]}
                    </p>

                    {/* Cuplikan komentar (opsional, biar lebih informatif) */}
                    {showCommentSnippet && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                            “{notification.comment_preview.comment}”
                        </p>
                    )}
                </div>

                {/* Thumbnail postingan — hanya untuk POST_LIKE & POST_COMMENT */}
                {thumbnail && (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={thumbnail}
                            alt="Preview postingan"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>
        ),
        {
            duration: 5000,
        },
    );
}

export default function WebSocketListener() {
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);

    const subscribe = useWsStore((s) => s.subscribe);

    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    useEffect(() => {
        return subscribe("/user/personal/notifications", (msg) => {
            let newNotif: NotificationResponse;

            try {
                newNotif = JSON.parse(msg.body) as NotificationResponse;
                console.log(`MESSAGE IN : ${newNotif}`)
            } catch (error) {
                console.error(
                    "[ws] Gagal membaca payload notifikasi:",
                    msg.body,
                    error,
                );
                return;
            }

            const currentPath = pathnameRef.current;

            if (
                currentPath === "/notification" ||
                currentPath.startsWith("/notification/")
            ) {
                return;
            }

            showNotificationToast(newNotif);
        });
    }, [subscribe]);

    return null;
}