import { CreateMessageInput } from "@/lib/type/message"
import { SupportedFileType } from "@/lib/type/posts"
import type { MessageResponseDTO } from "@/lib/type/message"
import { ConversationResponseDTO } from "@/lib/type/conversation"

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
})

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
})

/** "14.20" */
export function formatTime(iso: string) {
    const date = new Date(iso)
    return Number.isNaN(date.getTime()) ? "" : timeFormatter.format(date)
}

export function isSameDay(a: string | Date, b: string | Date) {
    return new Date(a).toDateString() === new Date(b).toDateString()
}

/** "Hari ini" | "Kemarin" | "15 November 2026" */
export function formatDateLabel(iso: string) {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ""

    const now = new Date()
    if (isSameDay(date, now)) return "Hari ini"

    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (isSameDay(date, yesterday)) return "Kemarin"

    return dateFormatter.format(date)
}

export function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
}

export function getFileName(url: string, fallback = "Lampiran") {
    const name = url.split(/[?#]/)[0].split("/").pop()
    if (!name) return fallback

    try {
        return decodeURIComponent(name)
    } catch {
        return name
    }
}

/** "report.pdf" -> "PDF" */
export function getFileExtension(name: string) {
    const dot = name.lastIndexOf(".")
    return dot > 0 ? name.slice(dot + 1).toUpperCase() : ""
}

export function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFileType(file: File): SupportedFileType {
    if (file.type.startsWith("image/")) return "IMAGE"
    if (file.type.startsWith("video/")) return "VIDEO"
    if (file.type.startsWith("audio/")) return "AUDIO"
    return "DOCUMENT"
}

export function buildCreateMessageFormData({
    replyTo,
    textContent,
    media = [],
}: CreateMessageInput) {
    const formData = new FormData()

    if (replyTo) formData.append("replyTo", replyTo)

    const text = textContent?.trim()
    if (text) formData.append("textContent", text)

    for (const file of media) formData.append("media", file)

    return formData
}


export function appendMessage(
    old: MessageResponseDTO[] | undefined,
    message: MessageResponseDTO,
) {
    if (!old) return old
    if (old.some((m) => m.id === message.id)) return old

    return [...old, message]
}



export function getSortTime(conversation: ConversationResponseDTO) {
    const latest = conversation.latest_message?.[0]

    return new Date(latest?.created_at ?? conversation.created_at).getTime()
}


export function generateConvKey(first: string, second: string): string {
    const [smaller, larger] =
        compareUuid(first, second) < 0 ? [first, second] : [second, first]

    return `${smaller}:${larger}`
}

function compareUuid(a: string, b: string): number {
    const hexA = a.replaceAll("-", "")
    const hexB = b.replaceAll("-", "")

    const msbA = BigInt.asIntN(64, BigInt("0x" + hexA.slice(0, 16)))
    const msbB = BigInt.asIntN(64, BigInt("0x" + hexB.slice(0, 16)))
    if (msbA !== msbB) return msbA < msbB ? -1 : 1

    const lsbA = BigInt.asIntN(64, BigInt("0x" + hexA.slice(16)))
    const lsbB = BigInt.asIntN(64, BigInt("0x" + hexB.slice(16)))
    if (lsbA !== lsbB) return lsbA < lsbB ? -1 : 1

    return 0
}