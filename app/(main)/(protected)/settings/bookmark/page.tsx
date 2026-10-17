"use client"

import { ArrowLeft, Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"

import { PostsGrid } from "@/features/posts/component/posts-grid"
import { useMyBookmark } from "@/features/posts/hooks/use-posts"

export default function BookmarkViewPage() {
    const router = useRouter()
    const posts = useMyBookmark()

    return (
        <div className="flex h-full w-full flex-col">
            {/* Sticky compact header */}
            <header className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b bg-background px-4 py-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label="Kembali"
                >
                    <ArrowLeft className="size-5" />
                </button>

                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Bookmark className="size-4.5" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-base font-semibold leading-none tracking-tight">
                            Tersimpan
                        </h1>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            Postingan yang kamu simpan untuk dilihat lagi
                        </p>
                    </div>
                </div>
            </header>

            {/* Content area – takes remaining height */}
            <div className="flex-1 overflow-y-auto">
                <PostsGrid
                    posts={posts.data}
                    isPending={posts.isPending}
                    isError={posts.isError}
                    onRetry={() => posts.refetch()}
                    emptyMessage="Kamu belum menyimpan postingan apa pun"
                />
            </div>
        </div>
    )
}