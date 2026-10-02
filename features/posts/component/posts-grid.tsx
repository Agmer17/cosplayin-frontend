"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Bookmark, Camera, Copy, Heart, Play, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/lib/responsive/responsive_util";
import type { PostsResponse } from "@/lib/type/posts";
import { resolveMediaUrl } from "@/lib/ImageUrlResolver";

const compactNumber = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
});

/* ---------------------------------- Item ---------------------------------- */

function PostGridItem({
    post,
    showStats,
}: {
    post: PostsResponse;
    showStats: boolean;
}) {
    const media = post.media ?? [];
    const cover = [...media].sort(
        (a, b) => a.display_order - b.display_order,
    )[0];

    const isMultiple = media.length > 1;
    const isVideo = cover?.media_type === "VIDEO";

    return (
        <Link
            href={`/posts/${post.posts_id}`}
            className="group relative block w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ aspectRatio: "3 / 4" }}
            aria-label={post.caption || "Buka postingan"}
        >
            {cover?.media_type === "IMAGE" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={resolveMediaUrl(cover.media_url)}
                    alt={post.caption ?? ""}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}

            {isVideo && (
                <video
                    src={resolveMediaUrl(cover.media_url)}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}

            {(!cover ||
                (!isVideo && cover.media_type !== "IMAGE")) && (
                    <div className="flex h-full w-full items-center justify-center p-3">
                        <p className="line-clamp-6 text-sm text-muted-foreground">
                            {post.caption}
                        </p>
                    </div>
                )}

            {(isVideo || isMultiple) && (
                <div className="absolute right-2 top-2 text-white drop-shadow">
                    {isMultiple ? (
                        <Copy
                            className="h-4 w-4"
                            aria-label="Beberapa media"
                        />
                    ) : (
                        <Play
                            className="h-4 w-4"
                            aria-label="Video"
                        />
                    )}
                </div>
            )}

            {showStats && (
                <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Stat
                        icon={
                            <Heart className="h-5 w-5 fill-current" />
                        }
                        value={post.like_count}
                    />

                    <Stat
                        icon={
                            <Bookmark className="h-5 w-5 fill-current" />
                        }
                        value={post.bookmark_count}
                    />

                    <Stat
                        icon={<Share2 className="h-5 w-5" />}
                        value={post.share_count}
                    />
                </div>
            )}
        </Link>
    );
}

function Stat({
    icon,
    value,
}: {
    icon: ReactNode;
    value: number;
}) {
    return (
        <span className="flex items-center gap-1.5 text-sm font-semibold">
            {icon}
            {compactNumber.format(value ?? 0)}
        </span>
    );
}

/* ---------------------------------- Grid ---------------------------------- */

type PostsGridProps = {
    posts?: PostsResponse[];
    isPending?: boolean;
    isError?: boolean;
    onRetry?: () => void;
    emptyMessage?: string;
};

export function PostsGrid({
    posts,
    isPending,
    isError,
    onRetry,
    emptyMessage = "tidak ada postingan"
}: PostsGridProps) {
    const isMobile = useIsMobile();
    console.log(posts)

    const gridClass = `grid grid-cols-3 ${isMobile ? "gap-0.5" : "gap-1"
        }`;

    if (isPending) {
        return <PostsGridSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                <p className="text-sm text-destructive">
                    Postingan gagal dimuat.
                </p>

                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                    >
                        Coba lagi
                    </Button>
                )}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                    <Camera className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-semibold">
                    {emptyMessage}
                </h3>

            </div>
        );
    }

    return (
        <div className={gridClass}>
            {posts.map((post) => (
                <PostGridItem
                    key={post.posts_id}
                    post={post}
                    showStats={!isMobile}
                />
            ))}
        </div>
    );
}

export function PostsGridSkeleton() {
    const isMobile = useIsMobile();

    return (
        <div
            className={`grid grid-cols-3 ${isMobile ? "gap-0.5" : "gap-1"
                }`}
            aria-hidden
        >
            {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="w-full rounded-none"
                    style={{ aspectRatio: "3 / 4" }}
                />
            ))}
        </div>
    );
}