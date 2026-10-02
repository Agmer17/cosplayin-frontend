"use client";

import {
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { PostsResponse } from "@/lib/type/posts";
import { PostCommentsEmpty } from "./posts-comment-empty";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { usePostDelete, usePostsBookmark, usePostsLike } from "../hooks/use-posts";
import { DetailProfileDTO } from "@/lib/type/profile";
import { resolvePublicMedia } from "@/lib/ImageUrlResolver";
import { useState } from "react";
import { PostOptionsDialog } from "./post-option-dialog";
import { toast } from "sonner";

type PostDetailSidebarProps = {
    post: PostsResponse;
    headerOnly?: boolean;
    hideHeader?: boolean;

    onDeletePosts: (id: string) => void
    currentProfile: DetailProfileDTO | null
};

const compactNumber = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
});

export function PostDetailSidebar({
    post,
    headerOnly = false,
    hideHeader = false,
    currentProfile,
    onDeletePosts

}: PostDetailSidebarProps) {
    const author = post.author;
    const isMobile = useIsMobile();

    const [open, setOpen] = useState(false)

    let authorRedirect = "/u/" + author.username;
    if (author.id === currentProfile?.id) {
        authorRedirect = "/my-profile";
    }

    const {
        liked,
        loading,
        toggleLike,
    } = usePostsLike(post.posts_id, post.liked);


    const {
        bookmarked,
        toggleBookmark
    } = usePostsBookmark(post.posts_id, post.bookmarked)

    const handleToggleLike = () => {
        if (!currentProfile) {
            toast.error("kamu harus login sebelum like posts!")
        }

        toggleLike()
    }
    const handleToggleBookmark = () => {
        if (!currentProfile) {
            toast.error("kamu harus login sebelum like masukin postingan ke bookmark!")
        }

        toggleBookmark()
    }


    // ===== Header only mode (mobile top) =====
    if (headerOnly) {
        return (
            <div className="bg-background p-4">
                <div className="flex items-center justify-between">
                    <Link href={authorRedirect}>
                        <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={resolvePublicMedia(author.avatar_url)}
                                    alt={author.display_name}
                                />
                                <AvatarFallback>
                                    {author.display_name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {author.display_name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    @{author.username}
                                </p>
                            </div>
                        </div>
                    </Link>

                    <MoreHorizontal className="h-5 w-5" onClick={() => setOpen(true)} />
                    <PostOptionsDialog
                        open={open}
                        onOpenChange={setOpen}
                        postId={post.posts_id}
                        isAuthor={currentProfile?.id === author.id}
                        onDelete={onDeletePosts}
                    />
                </div>
            </div>
        );
    }

    // ===== Full sidebar =====
    return (
        <div className="flex min-h-0 flex-col bg-background md:h-full">
            {/* Header – hidden on mobile when already rendered above media */}
            {!hideHeader && (
                <>
                    <div className="shrink-0 p-4">
                        <div className="flex items-center justify-between">
                            <Link href={authorRedirect}>
                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={resolvePublicMedia(author.avatar_url)}
                                            alt={author.display_name}
                                        />
                                        <AvatarFallback>
                                            {author.display_name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">
                                            {author.display_name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            @{author.username}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <MoreHorizontal className="h-5 w-5" onClick={() => setOpen(true)} />
                            <PostOptionsDialog
                                open={open}
                                onOpenChange={setOpen}
                                postId={post.posts_id}
                                isAuthor={currentProfile?.id === author.id}
                                onDelete={onDeletePosts}
                            />
                        </div>
                    </div>
                    <Separator />
                </>
            )}

            {/* Caption + Comments */}
            <div className="min-h-0 flex-1 overflow-y-auto">
                {post.caption && (
                    <>
                        <div className="p-4 text-sm leading-relaxed">
                            <span className="mr-1.5 font-semibold">{author.username}</span>
                            <span className="whitespace-pre-line">{post.caption}</span>
                        </div>
                        <Separator />
                    </>
                )}
                {!isMobile && <PostCommentsEmpty />}
            </div>

            {/* Bottom section */}
            <div className="shrink-0">
                <Separator />
                {/* Actions */}
                <div className="flex items-center justify-between px-3 pt-2">
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            aria-label="Like"
                            aria-pressed={liked}
                            disabled={loading}
                            onClick={handleToggleLike}
                        >
                            <Heart
                                className={
                                    liked
                                        ? "h-6! w-6! fill-current text-destructive"
                                        : "h-6! w-6!"
                                }
                            />
                        </Button>
                        <Button type="button" variant="ghost" aria-label="Komentar">
                            <MessageCircle className="h-6! w-6!" />
                        </Button>
                        <Button type="button" variant="ghost" aria-label="Bagikan">
                            <Send className="h-6! w-6!" />
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Simpan"
                        aria-pressed={post.bookmarked}
                        onClick={handleToggleBookmark}
                    >
                        <Bookmark
                            className={
                                bookmarked ? "h-6! w-6! fill-current" : "h-6! w-6!"
                            }
                        />
                    </Button>
                </div>

                <div className="space-y-1 px-4 pb-3">
                    <p className="text-sm font-semibold">
                        {compactNumber.format(post.like_count)} suka
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {dateFormatter.format(new Date(post.created_at))}
                    </p>
                </div>

                {/* Comment Input – still hidden on mobile as before */}
                <Separator />
                {!isMobile && (
                    <div className="flex items-center gap-2 p-3">
                        <Input
                            placeholder="Tambahkan komentar..."
                            className="shadow-none"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="shrink-0 font-semibold"
                        >
                            Kirim
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}