import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ConversationResponseDTO } from "@/lib/type/conversation"
import { cn } from "cn"
import { formatTime, getInitials } from "../message-util"
import { Paperclip } from "lucide-react"

export function ConversationItem({
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
    const hasText = !!latest?.text_content?.trim()

    const hasUnread =
        !!latest &&
        !!currentUserId &&
        !latest.read_by?.some((reader) => reader.user_id === currentUserId)

    return (
        <button
            type="button"
            onClick={() => onSelect(conversation.conv_key)}
            aria-current={active ? "page" : undefined}
            className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                    ? "bg-muted text-foreground"
                    : "hover:bg-muted/60 active:bg-muted/80"
            )}
        >
            <Avatar className="size-12 shrink-0 ring-1 ring-border/60">
                <AvatarImage
                    src={conversation.conversation_image}
                    alt={conversation.name}
                    className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(conversation.name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={cn(
                            "truncate text-sm leading-5",
                            hasUnread
                                ? "font-semibold text-foreground"
                                : "font-medium text-foreground"
                        )}
                    >
                        {conversation.name}
                    </span>

                    {latest && (
                        <span
                            className={cn(
                                "shrink-0 text-[11px] tabular-nums",
                                hasUnread
                                    ? "font-semibold text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {formatTime(latest.created_at)}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div
                        className={cn(
                            "flex min-w-0 flex-1 items-center gap-1.5 text-[13px] leading-5",
                            hasUnread
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        {!latest ? (
                            <span className="truncate italic text-muted-foreground/80">
                                Belum ada pesan
                            </span>
                        ) : (
                            <>
                                {hasMedia && (
                                    <Paperclip className="size-3.5 shrink-0 opacity-75" />
                                )}

                                <span className="truncate">
                                    {hasText ? latest.text_content : "Lampiran"}
                                </span>
                            </>
                        )}
                    </div>

                    {hasUnread && (
                        <span
                            className="size-2.5 shrink-0 rounded-full bg-primary"
                            aria-label="Pesan belum dibaca"
                        />
                    )}
                </div>
            </div>
        </button>
    )
}
