"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronDown, Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MessageResponseDTO } from "@/lib/type/message"
import { formatDateLabel, isSameDay } from "../message-util"

import { ChatMessage } from "./chat-message"
import { ChatComposer } from "./chat-composer"

export interface ConversationChatProps {
    messages: MessageResponseDTO[]
    currentUserId: string
    isGroup?: boolean

    value: string
    onValueChange: (value: string) => void

    files: File[]
    onAddFiles: (files: File[]) => void
    onRemoveFile: (file: File) => void

    replyTo?: MessageResponseDTO | null
    onReply?: (message: MessageResponseDTO) => void
    onCancelReply?: () => void

    onSend: () => void

    disabled?: boolean
    isSending?: boolean
    className?: string
}

const STICK_THRESHOLD = 120

export function ConversationChat({
    messages,
    currentUserId,
    isGroup = false,
    value,
    onValueChange,
    files,
    onAddFiles,
    onRemoveFile,
    replyTo = null,
    onReply,
    onCancelReply,
    onSend,
    disabled = false,
    isSending = false,
    className,
}: ConversationChatProps) {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const stickRef = useRef(true)
    const initialRef = useRef(true)

    const [dragging, setDragging] = useState(false)
    const [showScrollBottom, setShowScrollBottom] = useState(false)

    const last = messages.at(-1)
    const lastId = last?.id
    const lastIsOwn = last?.sender.id === currentUserId

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        const el = scrollerRef.current
        if (!el) return

        el.scrollTo({
            top: el.scrollHeight,
            behavior,
        })
    }

    useEffect(() => {
        if (!lastId) return

        if (stickRef.current || lastIsOwn) {
            scrollToBottom(initialRef.current ? "auto" : "smooth")
        }

        initialRef.current = false
    }, [lastId, lastIsOwn])

    useEffect(() => {
        const el = scrollerRef.current
        const content = contentRef.current

        if (!el || !content) return

        const observer = new ResizeObserver(() => {
            if (stickRef.current) {
                el.scrollTop = el.scrollHeight
            }
        })

        observer.observe(content)

        return () => observer.disconnect()
    }, [])

    return (
        <div
            className={cn(
                "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background",
                className
            )}
            onDragOver={(event) => {
                if (
                    disabled ||
                    !event.dataTransfer.types.includes("Files")
                )
                    return

                event.preventDefault()
                setDragging(true)
            }}
            onDragLeave={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget as Node | null
                    )
                ) {
                    setDragging(false)
                }
            }}
            onDrop={(event) => {
                if (event.dataTransfer.files.length === 0) return

                event.preventDefault()
                setDragging(false)

                if (!disabled) {
                    onAddFiles(Array.from(event.dataTransfer.files))
                }
            }}
        >
            {/* Scrollable message area */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <div
                    ref={scrollerRef}
                    onScroll={(event) => {
                        const el = event.currentTarget
                        const distanceFromBottom =
                            el.scrollHeight - el.scrollTop - el.clientHeight

                        const isNearBottom =
                            distanceFromBottom < STICK_THRESHOLD
                        stickRef.current = isNearBottom
                        setShowScrollBottom(!isNearBottom)
                    }}
                    className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
                >
                    <div
                        ref={contentRef}
                        className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-3 py-4 sm:px-6"
                    >
                        {messages.length === 0 ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-1.5 text-center">
                                <p className="text-sm font-medium text-foreground">
                                    Belum ada pesan
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Kirim pesan pertama untuk memulai percakapan.
                                </p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const previous = messages[index - 1]
                                const next = messages[index + 1]

                                const startsNewDay =
                                    !previous ||
                                    !isSameDay(
                                        previous.created_at,
                                        message.created_at
                                    )

                                const isFirst =
                                    startsNewDay ||
                                    previous.sender.id !== message.sender.id

                                const isLast =
                                    !next ||
                                    next.sender.id !== message.sender.id ||
                                    !isSameDay(
                                        next.created_at,
                                        message.created_at
                                    )

                                return (
                                    <Fragment key={message.id}>
                                        {startsNewDay && (
                                            <div className="sticky top-2 z-10 my-3 flex justify-center pointer-events-none">
                                                <span className="rounded-full border border-border/60 bg-background/85 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs backdrop-blur-md">
                                                    {formatDateLabel(
                                                        message.created_at
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <ChatMessage
                                            message={message}
                                            currentUserId={currentUserId}
                                            isFirst={isFirst}
                                            isLast={isLast}
                                            isGroup={isGroup}
                                            onReply={onReply}
                                        />
                                    </Fragment>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Floating Scroll-to-Bottom Button */}
                {showScrollBottom && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label="Ke pesan terbaru"
                        onClick={() => scrollToBottom("smooth")}
                        className="absolute right-4 bottom-4 z-10 size-9 rounded-full border border-border/60 bg-card text-foreground shadow-md transition-transform hover:scale-105 hover:bg-muted"
                    >
                        <ChevronDown className="size-4" />
                    </Button>
                )}
            </div>

            {/* Fixed composer */}
            <div className="relative z-10 shrink-0 bg-background">
                <ChatComposer
                    value={value}
                    onValueChange={onValueChange}
                    files={files}
                    onAddFiles={onAddFiles}
                    onRemoveFile={onRemoveFile}
                    replyTo={replyTo}
                    onCancelReply={onCancelReply}
                    onSend={onSend}
                    disabled={disabled}
                    isSending={isSending}
                />
            </div>

            {/* Drag overlay */}
            {dragging && (
                <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary bg-background/80 backdrop-blur-sm">
                    <Paperclip className="size-6 text-primary" />

                    <p className="text-sm font-medium">
                        Lepas file untuk melampirkan
                    </p>
                </div>
            )}
        </div>
    )
}