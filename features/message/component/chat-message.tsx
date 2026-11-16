"use client"

import { Check, CheckCheck, CornerUpLeft, Paperclip } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import type { MessageReplyToDTO, MessageResponseDTO } from "@/lib/type/message"
import { formatTime, getInitials } from "../message-util"
import { isVisualMedia, MessageMedia } from "./chat-message-media"

export interface ChatMessageProps {
    message: MessageResponseDTO
    currentUserId: string
    isFirst: boolean
    isLast: boolean
    isGroup?: boolean
    onReply?: (message: MessageResponseDTO) => void
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g

function FormattedText({ text, isOwn }: { text: string; isOwn: boolean }) {
    const parts = text.split(URL_REGEX)

    return (
        <>
            {parts.map((part, index) => {
                if (part.match(URL_REGEX)) {
                    return (
                        <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "underline underline-offset-2 break-all transition-opacity hover:opacity-80",
                                isOwn
                                    ? "text-primary-foreground"
                                    : "text-primary"
                            )}
                        >
                            {part}
                        </a>
                    )
                }
                return part
            })}
        </>
    )
}

function ReplyQuote({
    reply,
    own,
}: {
    reply: MessageReplyToDTO
    own: boolean
}) {
    const text = reply.text_content?.trim()

    return (
        <div
            className={cn(
                "rounded-xl border-l-[3px] px-2.5 py-1.5 text-xs",
                own
                    ? "border-primary-foreground/80 bg-primary-foreground/15 text-primary-foreground"
                    : "border-primary bg-background/80 text-foreground"
            )}
        >
            <p className="font-semibold">@{reply.sender_username}</p>

            <p className="line-clamp-2 flex items-center gap-1 opacity-85">
                {text ? (
                    text
                ) : (
                    <>
                        <Paperclip className="size-3 shrink-0" />
                        Lampiran
                    </>
                )}
            </p>
        </div>
    )
}

export function ChatMessage({
    message,
    currentUserId,
    isFirst,
    isLast,
    isGroup = false,
    onReply,
}: ChatMessageProps) {
    const isOwn = message.sender.id === currentUserId
    const displayName = message.sender.display_name || message.sender.username

    const text = message.text_content?.trim()
    const media = message.media ?? []
    const isRead = message.reads?.some((read) => read.user_id !== currentUserId)

    const visualOnly =
        !text &&
        !message.reply_to &&
        media.length > 0 &&
        media.every(isVisualMedia)

    const radius = isOwn
        ? cn(!isFirst && "rounded-tr-md", !isLast && "rounded-br-md")
        : cn(!isFirst && "rounded-tl-md", !isLast && "rounded-bl-md")

    return (
        <div
            className={cn(
                "group/message flex items-end gap-2",
                isOwn && "flex-row-reverse",
                isFirst ? "mt-3.5" : "mt-0.5"
            )}
        >
            {isGroup &&
                !isOwn &&
                (isLast ? (
                    <Avatar className="size-7 shrink-0 ring-1 ring-border/50">
                        <AvatarImage
                            src={message.sender.avatar_url}
                            alt={displayName}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-[10px] font-medium">
                            {getInitials(displayName)}
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="size-7 shrink-0" aria-hidden />
                ))}

            <div
                className={cn(
                    "flex min-w-0 max-w-[82%] flex-col sm:max-w-[68%]",
                    isOwn ? "items-end" : "items-start"
                )}
            >
                {isGroup && !isOwn && isFirst && (
                    <span className="mb-1 px-2.5 text-xs font-medium text-muted-foreground">
                        {displayName}
                    </span>
                )}

                <div
                    className={cn(
                        "flex items-center gap-1.5",
                        isOwn && "flex-row-reverse"
                    )}
                >
                    <div
                        className={cn(
                            "min-w-0 overflow-hidden rounded-2xl text-sm leading-relaxed",
                            !visualOnly &&
                            (isOwn
                                ? "bg-primary text-primary-foreground shadow-2xs"
                                : "border border-border/60 bg-muted/80 text-foreground"),
                            radius
                        )}
                    >
                        {message.reply_to && (
                            <div className="p-1.5 pb-0">
                                <ReplyQuote
                                    reply={message.reply_to}
                                    own={isOwn}
                                />
                            </div>
                        )}

                        {media.length > 0 && (
                            <div
                                className={cn(
                                    "max-w-[280px] sm:max-w-[320px] [&_img]:max-h-72 [&_img]:w-full [&_img]:object-cover [&_video]:max-h-72",
                                    visualOnly ? undefined : "p-1.5"
                                )}
                            >
                                <MessageMedia
                                    media={media}
                                    inset={!visualOnly}
                                />
                            </div>
                        )}

                        {text && (
                            <p className="whitespace-pre-wrap wrap-break-word px-3.5 py-2">
                                <FormattedText text={text} isOwn={isOwn} />
                            </p>
                        )}
                    </div>

                    {onReply && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Balas pesan"
                            onClick={() => onReply(message)}
                            className="size-7 shrink-0 rounded-full text-muted-foreground opacity-60 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 sm:opacity-0 sm:group-hover/message:opacity-100"
                        >
                            <CornerUpLeft className="size-3.5" />
                        </Button>
                    )}
                </div>

                {isLast && (
                    <div className="mt-1 flex items-center gap-1 px-1 text-[11px] tabular-nums text-muted-foreground">
                        <time dateTime={message.created_at}>
                            {formatTime(message.created_at)}
                        </time>

                        {isOwn &&
                            (isRead ? (
                                <CheckCheck
                                    className="size-3.5 text-primary"
                                    aria-label="Dibaca"
                                />
                            ) : (
                                <Check
                                    className="size-3.5"
                                    aria-label="Terkirim"
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}