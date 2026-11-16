/* eslint-disable @next/next/no-img-element */
"use client"

import {
    SubmitEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    type ChangeEvent,
    type ClipboardEvent,
    type KeyboardEvent,
} from "react"
import { FileText, Loader2, Music, Paperclip, SendHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import type { MessageResponseDTO } from "@/lib/type/message"
import { formatFileSize, getFileType } from "../message-util"

const MAX_TEXTAREA_HEIGHT = 128

export interface ChatComposerProps {
    value: string
    onValueChange: (value: string) => void

    files: File[]
    onAddFiles: (files: File[]) => void
    onRemoveFile: (file: File) => void

    replyTo?: MessageResponseDTO | null
    onCancelReply?: () => void

    onSend: () => void

    disabled?: boolean
    isSending?: boolean
    placeholder?: string
    accept?: string
}


function usePreviewUrl<T extends HTMLImageElement | HTMLVideoElement>(
    file: File,
    enabled: boolean
) {
    const previewRef = useRef<T>(null)

    useEffect(() => {
        if (!enabled) return

        const objectUrl = URL.createObjectURL(file)
        const element = previewRef.current

        if (element) {
            element.src = objectUrl
        }

        return () => {
            URL.revokeObjectURL(objectUrl)
            element?.removeAttribute("src")
        }
    }, [file, enabled])

    return previewRef
}

function PendingFile({
    file,
    onRemove,
}: {
    file: File
    onRemove: () => void
}) {
    const type = getFileType(file)
    const isVisual = type === "IMAGE" || type === "VIDEO"

    const imagePreviewRef = usePreviewUrl<HTMLImageElement>(
        file,
        type === "IMAGE"
    )

    const videoPreviewRef = usePreviewUrl<HTMLVideoElement>(
        file,
        type === "VIDEO"
    )

    const Icon = type === "AUDIO" ? Music : FileText

    return (
        <div className="relative shrink-0">
            {isVisual ? (
                <div className="size-16 overflow-hidden rounded-lg bg-muted">
                    {type === "IMAGE" && (
                        <img
                            ref={imagePreviewRef}
                            alt={file.name}
                            className="size-full object-cover"
                        />
                    )}

                    {type === "VIDEO" && (
                        <video
                            ref={videoPreviewRef}
                            muted
                            preload="metadata"
                            className="size-full object-cover"
                        />
                    )}
                </div>
            ) : (
                <div className="flex h-16 w-44 items-center gap-2 rounded-lg bg-muted px-2.5">
                    <Icon className="size-5 shrink-0 text-muted-foreground" />

                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium">
                            {file.name}
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                            {formatFileSize(file.size)}
                        </p>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={onRemove}
                aria-label={`Hapus ${file.name}`}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
            >
                <X className="size-3" />
            </button>
        </div>
    )
}

// ============================================================
// COMPOSER
// ============================================================

export function ChatComposer({
    value,
    onValueChange,
    files,
    onAddFiles,
    onRemoveFile,
    replyTo = null,
    onCancelReply,
    onSend,
    disabled = false,
    isSending = false,
    placeholder = "Ketik pesan...",
    accept = "image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip",
}: ChatComposerProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const canSend =
        !disabled && !isSending && (value.trim().length > 0 || files.length > 0)

    // Auto-grow textarea sampai batas tinggi
    useLayoutEffect(() => {
        const el = textareaRef.current
        if (!el) return

        el.style.height = "auto"
        el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`
    }, [value])

    // Fokus ke input saat mulai membalas pesan
    useEffect(() => {
        if (replyTo) textareaRef.current?.focus()
    }, [replyTo])

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (canSend) onSend()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
        ) {
            event.preventDefault()
            if (canSend) onSend()
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.currentTarget.files ?? [])
        if (selected.length > 0) onAddFiles(selected)

        // izinkan memilih file yang sama lagi
        event.currentTarget.value = ""
    }

    const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
        const pasted = Array.from(event.clipboardData.files)
        if (pasted.length === 0) return

        event.preventDefault()
        onAddFiles(pasted)
    }

    const replyName = replyTo
        ? replyTo.sender.display_name || replyTo.sender.username
        : ""

    const replyPreview = replyTo
        ? replyTo.text_content?.trim() ||
        (replyTo.media.length > 0 ? "Lampiran" : "Pesan")
        : ""

    return (
        <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t bg-background px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
            {replyTo && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                    <div className="min-w-0 flex-1 border-l-2 border-primary pl-2">
                        <p className="truncate text-xs font-semibold text-primary">
                            Membalas {replyName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            {replyPreview}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Batalkan balasan"
                        onClick={onCancelReply}
                        className="size-7 shrink-0 rounded-full"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            )}

            {files.length > 0 && (
                <div className="flex gap-3 overflow-x-auto px-1 pt-2 pb-2">
                    {files.map((file, index) => (
                        <PendingFile
                            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                            file={file}
                            onRemove={() => onRemoveFile(file)}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-end gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Lampirkan file"
                    disabled={disabled}
                    onClick={() => fileInputRef.current?.click()}
                    className="size-10 shrink-0 rounded-full text-muted-foreground"
                >
                    <Paperclip className="size-5" />
                </Button>

                <div
                    className={cn(
                        "flex min-w-0 flex-1 items-end rounded-3xl border bg-muted/40 px-4 py-2 transition-shadow",
                        "focus-within:ring-2 focus-within:ring-ring/40"
                    )}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        rows={1}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={(event) => onValueChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        className="max-h-32 min-h-6 w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    />
                </div>

                <Button
                    type="submit"
                    size="icon"
                    aria-label="Kirim pesan"
                    disabled={!canSend}
                    className="size-10 shrink-0 rounded-full"
                >
                    {isSending ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <SendHorizontal className="size-5" />
                    )}
                </Button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={accept}
                disabled={disabled}
                onChange={handleFileChange}
                className="sr-only"
                tabIndex={-1}
            />
        </form>
    )
}