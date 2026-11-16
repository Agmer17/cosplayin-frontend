"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, FileText, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import type { MessageMediaDTO } from "@/lib/type/message"
import { getFileExtension, getFileName } from "../message-util"

const MAX_VISIBLE = 4

export const isVisualMedia = (media: MessageMediaDTO) =>
    media.media_type === "IMAGE" || media.media_type === "VIDEO"

function VisualGrid({
    items,
    inset,
    onOpen,
}: {
    items: MessageMediaDTO[]
    inset: boolean
    onOpen: (index: number) => void
}) {
    const shown = items.slice(0, MAX_VISIBLE)
    const extra = items.length - MAX_VISIBLE

    return (
        <div
            className={cn(
                "grid w-64 gap-0.5 sm:w-72",
                items.length > 1 && "grid-cols-2"
            )}
        >
            {shown.map((media, index) => {
                const isVideo = media.media_type === "VIDEO"
                const filename = getFileName(media.media_url)

                return (
                    <button
                        key={media.id}
                        type="button"
                        onClick={() => onOpen(index)}
                        aria-label={`Buka ${filename}`}
                        className={cn(
                            "relative block overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            inset && "rounded-xl",
                            items.length === 1 ? "max-h-80" : "aspect-square",
                            items.length === 3 && index === 0 && "col-span-2 aspect-[2/1]"
                        )}
                    >
                        {isVideo ? (
                            <video
                                src={media.media_url}
                                preload="metadata"
                                muted
                                playsInline
                                className="size-full object-cover"
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={media.media_url}
                                alt={filename}
                                loading="lazy"
                                className="size-full object-cover"
                            />
                        )}

                        {isVideo && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <span className="flex size-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur">
                                    <Play className="size-5 fill-current" />
                                </span>
                            </span>
                        )}

                        {index === MAX_VISIBLE - 1 && extra > 0 && (
                            <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-xl font-semibold text-foreground backdrop-blur-[2px]">
                                +{extra}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

// ============================================================
// LIGHTBOX
// ============================================================

function MediaViewer({
    items,
    index,
    onIndexChange,
}: {
    items: MessageMediaDTO[]
    index: number | null
    onIndexChange: (index: number | null) => void
}) {
    const item = index === null ? null : items[index]

    const go = (step: number) => {
        if (index === null) return
        onIndexChange((index + step + items.length) % items.length)
    }

    return (
        <Dialog
            open={!!item}
            onOpenChange={(open) => {
                if (!open) onIndexChange(null)
            }}
        >
            <DialogContent className="gap-0 p-2 sm:max-w-3xl">
                <DialogTitle className="sr-only">Pratinjau lampiran</DialogTitle>
                <DialogDescription className="sr-only">
                    Pratinjau gambar atau video dari pesan.
                </DialogDescription>

                {item && (
                    <div className="relative flex items-center justify-center">
                        {item.media_type === "VIDEO" ? (
                            <video
                                key={item.id}
                                src={item.media_url}
                                controls
                                autoPlay
                                playsInline
                                className="max-h-[80vh] w-full rounded-md"
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={item.id}
                                src={item.media_url}
                                alt={getFileName(item.media_url)}
                                className="max-h-[80vh] w-full rounded-md object-contain"
                            />
                        )}

                        {items.length > 1 && (
                            <>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    aria-label="Sebelumnya"
                                    onClick={() => go(-1)}
                                    className="absolute left-2 size-9 rounded-full"
                                >
                                    <ChevronLeft />
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    aria-label="Berikutnya"
                                    onClick={() => go(1)}
                                    className="absolute right-2 size-9 rounded-full"
                                >
                                    <ChevronRight />
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

// ============================================================
// MESSAGE MEDIA
// ============================================================

/**
 * `inset` = media berada di dalam bubble yang punya padding (sudut membulat sendiri).
 * `inset={false}` = media-only bubble, sudut dipotong oleh bubble.
 */
export function MessageMedia({
    media,
    inset = true,
}: {
    media: MessageMediaDTO[]
    inset?: boolean
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const sorted = [...media].sort((a, b) => a.media_order - b.media_order)
    const visual = sorted.filter(isVisualMedia)
    const audio = sorted.filter((m) => m.media_type === "AUDIO")
    const documents = sorted.filter(
        (m) => !isVisualMedia(m) && m.media_type !== "AUDIO"
    )

    return (
        <div className="flex flex-col gap-1">
            {visual.length > 0 && (
                <VisualGrid items={visual} inset={inset} onOpen={setOpenIndex} />
            )}

            {audio.map((item) => (
                <div
                    key={item.id}
                    className="w-64 rounded-xl bg-current/10 p-2 sm:w-72"
                >
                    <audio
                        src={item.media_url}
                        controls
                        preload="none"
                        className="h-10 w-full"
                    />
                </div>
            ))}

            {documents.map((item) => {
                const name = getFileName(item.media_url)

                return (
                    <a
                        key={item.id}
                        href={item.media_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-64 items-center gap-3 rounded-xl bg-current/10 p-2.5 transition-colors hover:bg-current/15 sm:w-72"
                    >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-current/10">
                            <FileText className="size-5" />
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                                {name}
                            </span>
                            <span className="block text-xs opacity-70">
                                {getFileExtension(name) || "Dokumen"}
                            </span>
                        </span>

                        <Download className="size-4 shrink-0 opacity-70" />
                    </a>
                )
            })}

            <MediaViewer
                items={visual}
                index={openIndex}
                onIndexChange={setOpenIndex}
            />
        </div>
    )
}