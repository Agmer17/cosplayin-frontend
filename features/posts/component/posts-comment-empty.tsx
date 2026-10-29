import { MessageCircle } from "lucide-react"

export function PostCommentsEmpty() {
    return (
        <div className="flex min-h-48 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full border bg-muted/30">
                <MessageCircle className="size-6 text-muted-foreground" />
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-semibold">
                    Belum ada komentar
                </h3>

                <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Jadilah yang pertama memberikan komentar pada postingan ini.
                </p>
            </div>
        </div>
    )
}