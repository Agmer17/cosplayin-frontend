import { MessageCircle } from "lucide-react"

export default function ChatIndexPage() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <MessageCircle className="size-10" />
            <p className="text-sm">Pilih percakapan untuk mulai</p>
        </div>
    )
}