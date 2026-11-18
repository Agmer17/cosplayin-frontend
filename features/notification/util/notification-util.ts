import {
  NotificationResponse,
  NotificationType,
} from "@/lib/type/notification"

export function timeAgo(iso: string): string {
  const diffSec = Math.round(
    (new Date(iso).getTime() - Date.now()) / 1000,
  )

  const rtf = new Intl.RelativeTimeFormat("id", {
    numeric: "auto",
  })

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ]

  for (const [unit, sec] of units) {
    if (Math.abs(diffSec) >= sec) {
      return rtf.format(Math.round(diffSec / sec), unit)
    }
  }

  return "baru saja"
}

export const notificationAction: Record<NotificationType, string> = {
  POST_LIKE: "menyukai postingan kamu",
  COMMENT_LIKE: "menyukai komentar kamu",
  POST_COMMENT: "mengomentari postingan kamu",
  COMMENT_REPLY: "membalas komentar kamu",
  FOLLOW: "mulai mengikuti kamu",
  FOLLOW_REQUEST: "meminta untuk mengikuti kamu",
}

export function notificationHref(n: NotificationResponse): string {
  const actor = n.actors[0]

  if (
    n.notification_type === "FOLLOW" ||
    n.notification_type === "FOLLOW_REQUEST"
  ) {
    return actor ? `/u/${actor.username}` : "#"
  }

  return n.post_preview?.postId
    ? `/posts/${n.post_preview.postId}`
    : "#"
}