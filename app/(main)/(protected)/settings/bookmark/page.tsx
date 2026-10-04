"use client"

import { ArrowLeft, Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"

import { PostsGrid } from "@/features/posts/component/posts-grid"
import { useMyBookmark } from "@/features/posts/hooks/use-posts"

export default function BookmarkViewPage() {
    const router = useRouter()
    const posts = useMyBookmark()

    return (
        <div className="w-full h-full p-4 md:p-6">
            <header className="mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
                        aria-label="Kembali"
                    >
                        <ArrowLeft className="size-5" />
                    </button>

                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Bookmark className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold tracking-tight">
                            Tersimpan
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Postingan yang kamu simpan untuk dilihat lagi
                        </p>
                    </div>
                </div>
            </header>

            <PostsGrid
                posts={posts.data}
                isPending={posts.isPending}
                isError={posts.isError}
                onRetry={() => posts.refetch()}
                emptyMessage="Kamu belum menyimpan postingan apa pun"
            />
        </div>
    )
}