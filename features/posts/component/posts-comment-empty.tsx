import { MessageCircle } from "lucide-react";

export function PostCommentsEmpty() {
    return (
        <div className="flex min-h-48 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="text-sm font-semibold">
                Belum ada komentar
            </h3>

            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Fitur komentar belum tersedia untuk postingan ini.
            </p>
        </div>
    );
}