"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Send,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import type { DetailProfileDTO } from "@/lib/type/profile";
import type { PostsResponse } from "@/lib/type/posts";

// TODO: sesuaikan path import di bawah dengan struktur project kamu
import { PostDetailMedia } from "./post-detail-media";
import { postsApi } from "@/features/posts/api/posts.client";
import { usePostsBookmark, usePostsLike } from "../hooks/use-posts";
import { PostOptionsDialog } from "./post-option-dialog";
import { toast } from "sonner";
import { CommentsPanel } from "./comments-pannel";
import { compactNumber, timeAgo } from "@/lib/number-formatter-utils";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */



function UserAvatar({
    user,
    className,
}: {
    user: DetailProfileDTO | null;
    className?: string;
}) {

    if (!user) {
        return <></>
    }

    return (
        <Avatar className={className}>
            <AvatarImage
                src={user.avatar_url}
                alt={user.display_name}
            />
            <AvatarFallback>
                {user.display_name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}



/* -------------------------------------------------------------------------- */
/* PostCard                                                                   */
/* -------------------------------------------------------------------------- */

type PostCardProps = {
    post: PostsResponse;
    currentUser: DetailProfileDTO | null;
    onReport?: (postId: string) => void;
    className?: string;
};

function PostCardBase({ post, currentUser, onReport, className }: PostCardProps) {
    const postId = post.posts_id;
    const { data } = useQuery({
        queryKey: ["posts", postId],
        queryFn: () => postsApi.client.getById(postId),
        initialData: post,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
    const current = data ?? post;

    const { liked, toggleLike } = usePostsLike(postId, current.liked);
    const { bookmarked, toggleBookmark } = usePostsBookmark(
        postId,
        current.bookmarked,
    );

    const handleToggleLike = () => {
        if (!currentUser) {
            toast.error("kamu harus login sebelum like posts!")
        }

        toggleLike()
    }
    const handleToggleBookmark = () => {
        if (!currentUser) {
            toast.error("kamu harus login sebelum like masukin postingan ke bookmark!")
        }

        toggleBookmark()
    }


    const [optionsOpen, setOptionsOpen] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { author } = current;
    const commentsEnabled = current.comment_availability !== "NOT_AVAIBLE";
    const isLongCaption =
        current.caption.length > 110 || current.caption.includes("\n");

    return (
        <article
            className={cn(
                "mx-auto w-full max-w-lg overflow-hidden border-b bg-background sm:rounded-xl sm:border",
                className,
            )}
        >
            {/* Header */}
            <header className="flex items-center gap-3 px-3 py-2.5">
                <Link
                    href={`/u/${author.username}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                >
                    <UserAvatar user={author} className="size-9 shrink-0" />
                    <div className="min-w-0 leading-tight">
                        <p className="truncate text-sm font-semibold">
                            {author.username}
                        </p>
                        <p
                            className="truncate text-xs text-muted-foreground"
                            suppressHydrationWarning
                        >
                            {author.display_name} &middot;{" "}
                            {timeAgo(current.created_at)}
                        </p>
                    </div>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    aria-label="Opsi postingan"
                    onClick={() => setOptionsOpen(true)}
                >
                    <MoreHorizontal className="size-5" />
                </Button>
            </header>

            {/* Media (wajib pakai PostDetailMedia) */}
            <PostDetailMedia media={current.media} caption={current.caption} />

            {/* Actions */}
            <div className="flex items-center gap-1 px-2 pt-2">
                {/* Like */}
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={liked ? "Batal suka" : "Suka"}
                    aria-pressed={liked}
                    onClick={handleToggleLike}
                >
                    <Heart
                        className={cn(
                            "size-6 transition-transform active:scale-90",
                            liked && "fill-red-500 text-red-500",
                        )}
                    />
                </Button>
                <span className="text-sm font-semibold -ml-1 mr-3">
                    {compactNumber.format(current.like_count)}
                </span>

                {/* Comment */}
                {commentsEnabled && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Buka komentar"
                            onClick={() => setCommentsOpen(true)}
                        >
                            <MessageCircle className="size-6" />
                        </Button>
                        <span className="text-sm font-semibold -ml-1 mr-3">
                            {compactNumber.format(current.comment_count)}
                        </span>
                    </>
                )}

                {/* Share (optional – Instagram style) */}
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Bagikan"
                >
                    <Send className="size-6" />
                </Button>
                <span className="text-sm font-semibold -ml-1">
                    {compactNumber.format(current.share_count)}
                </span>

                {/* Bookmark – pushed to the right */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    aria-label={bookmarked ? "Hapus dari simpanan" : "Simpan"}
                    aria-pressed={bookmarked}
                    onClick={handleToggleBookmark}
                >
                    <Bookmark
                        className={cn(
                            "size-6 transition-transform active:scale-90",
                            bookmarked && "fill-foreground",
                        )}
                    />
                </Button>
                <span className="text-sm font-semibold -ml-1">
                    {compactNumber.format(current.bookmark_count)}
                </span>
            </div>

            {/* Meta */}
            <div className="space-y-1 px-4 pb-3">


                {current.caption && (
                    <div className="text-sm">
                        <p
                            className={cn(
                                "whitespace-pre-line wrap-break-word",
                                !expanded && "line-clamp-2",
                            )}
                        >
                            <Link
                                href={`/profile/${author.username}`}
                                className="mr-1.5 font-semibold"
                            >
                                {author.username}
                            </Link>
                            {current.caption}
                        </p>
                        {isLongCaption && !expanded && (
                            <button
                                type="button"
                                onClick={() => setExpanded(true)}
                                className="text-muted-foreground"
                            >
                                selengkapnya
                            </button>
                        )}
                    </div>
                )}

                {commentsEnabled ? (
                    <button
                        type="button"
                        onClick={() => setCommentsOpen(true)}
                        className="text-sm text-muted-foreground"
                    >
                        Lihat komentar
                    </button>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Komentar dinonaktifkan
                    </p>
                )}
            </div>

            <PostOptionsDialog
                open={optionsOpen}
                onOpenChange={setOptionsOpen}
                postId={postId}
                onReport={onReport}
                isAuthor={currentUser?.id == current.author.id}
            />

            {commentsEnabled && (
                <CommentsPanel
                    postId={post.posts_id}
                    open={commentsOpen}
                    onOpenChange={setCommentsOpen}
                    currentUser={currentUser}
                />
            )}
        </article>
    );
}

// memo supaya kartu lama tidak re-render saat halaman baru di-append
export const PostCard = memo(PostCardBase);