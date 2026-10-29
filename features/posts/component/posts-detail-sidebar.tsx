"use client"

import {
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Send,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { PostsResponse } from "@/lib/type/posts"
import { useIsMobile } from "@/lib/responsive_util"
import Link from "next/link"
import { usePostsBookmark, usePostsLike } from "../hooks/use-posts"
import { DetailProfileDTO } from "@/lib/type/profile"
import { useState } from "react"
import { PostOptionsDialog } from "./post-option-dialog"
import { toast } from "sonner"
import { CommentsPanel } from "./comments-pannel"

import {
    CommentReplyProvider,
    PostCommentComposer,
    PostCommentsSection,
} from "@/features/comment/component/post-comment"
import { compactNumber } from "@/lib/number-formatter-utils"
import { PostsLikeDetails } from "./posts-like-details"

type PostDetailSidebarProps = {
    post: PostsResponse;
    headerOnly?: boolean;
    hideHeader?: boolean;

    onDeletePosts: (id: string) => void;
    currentProfile: DetailProfileDTO | null;
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
})

export function PostDetailSidebar({
    post,
    headerOnly = false,
    hideHeader = false,
    currentProfile,
    onDeletePosts,
}: PostDetailSidebarProps) {
    const author = post.author
    const isMobile = useIsMobile()

    const [likeDetails, setLikeDetails] = useState(false)

    const [open, setOpen] = useState(false)
    const [commentOpen, setCommentOpen] = useState(false)

    let authorRedirect = "/u/" + author.username
    if (author.id === currentProfile?.id) {
        authorRedirect = "/my-profile"
    }

    const { liked, loading, toggleLike } = usePostsLike(
        post.posts_id,
        post.liked
    )

    const { bookmarked, toggleBookmark } = usePostsBookmark(
        post.posts_id,
        post.bookmarked
    )

    const handleToggleLike = () => {
        if (!currentProfile) {
            toast.error("kamu harus login sebelum like posts!")
        }
        toggleLike()
    }

    const handleToggleBookmark = () => {
        if (!currentProfile) {
            toast.error(
                "kamu harus login sebelum like masukin postingan ke bookmark!"
            )
        }
        toggleBookmark()
    }

    if (headerOnly) {
        return (
            <div className="border-b bg-background px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href={authorRedirect}
                        className="flex min-w-0 items-center gap-2.5"
                    >
                        <Avatar className="size-8 shrink-0">
                            <AvatarImage
                                src={author.avatar_url}
                                alt={author.display_name}
                            />
                            <AvatarFallback>
                                {author.display_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-5">
                                {author.username}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {author.display_name}
                            </p>
                        </div>
                    </Link>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 rounded-full"
                        aria-label="Opsi postingan"
                        onClick={() => setOpen(true)}
                    >
                        <MoreHorizontal className="size-5" />
                    </Button>

                    <PostOptionsDialog
                        open={open}
                        onOpenChange={setOpen}
                        postId={post.posts_id}
                        isAuthor={currentProfile?.id === author.id}
                        onDelete={onDeletePosts}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-0 w-full flex-col bg-background md:h-full">
            {!hideHeader && (
                <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
                    <Link
                        href={authorRedirect}
                        className="flex min-w-0 items-center gap-2.5"
                    >
                        <Avatar className="size-8 shrink-0">
                            <AvatarImage
                                src={author.avatar_url}
                                alt={author.display_name}
                            />
                            <AvatarFallback>
                                {author.display_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-5">
                                {author.username}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {author.display_name}
                            </p>
                        </div>
                    </Link>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 rounded-full"
                        aria-label="Opsi postingan"
                        onClick={() => setOpen(true)}
                    >
                        <MoreHorizontal className="size-5" />
                    </Button>

                    <PostOptionsDialog
                        open={open}
                        onOpenChange={setOpen}
                        postId={post.posts_id}
                        isAuthor={currentProfile?.id === author.id}
                        onDelete={onDeletePosts}
                    />
                </div>
            )}

            {!isMobile ? (
                <CommentReplyProvider>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {post.caption && (
                            <>
                                <div className="flex items-start gap-3 px-4 py-4">
                                    <p className="min-w-0 flex-1 wrap-break-word text-sm leading-5">
                                        <Link
                                            href={authorRedirect}
                                            className="mr-1.5 font-semibold hover:text-muted-foreground"
                                        >
                                            {author.username}
                                        </Link>
                                        <span className="whitespace-pre-line">
                                            {post.caption}
                                        </span>
                                    </p>
                                </div>
                                <Separator className="opacity-50" />
                            </>
                        )}

                        <PostCommentsSection
                            postId={post.posts_id}
                            currentProfile={currentProfile}
                        />
                    </div>

                    <div className="shrink-0 border-t">
                        <div className="flex items-center justify-between px-3 pt-1.5">
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Like"
                                    aria-pressed={liked}
                                    disabled={loading}
                                    onClick={handleToggleLike}
                                >
                                    <Heart
                                        className={`size-6 ${liked ? "fill-current text-destructive" : ""
                                            }`}
                                    />
                                </Button>
                                <span onClick={() => setLikeDetails(true)} className="hover:cursor-pointer text-sm font-semibold tabular-nums">
                                    {compactNumber.format(post.like_count)}
                                </span>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Komentar"
                                    onClick={() => {
                                        if (isMobile) {
                                            setCommentOpen(true)
                                        }
                                    }}
                                >
                                    <MessageCircle className="size-6" />
                                </Button>
                                <span className="text-sm tabular-nums font-semibold -ml-1 mr-2">
                                    {compactNumber.format(post.comment_count)}
                                </span>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Bagikan"
                                >
                                    <Send className="size-6" />
                                </Button>
                                <span className="text-sm tabular-nums font-semibold -ml-1 mr-2">
                                    {compactNumber.format(post.share_count)}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Simpan"
                                    aria-pressed={post.bookmarked}
                                    onClick={handleToggleBookmark}
                                >
                                    <Bookmark
                                        className={`size-6 ${bookmarked ? "fill-current" : ""}`}
                                    />
                                </Button>
                                <span className="text-sm tabular-nums font-semibold -ml-1">
                                    {compactNumber.format(post.bookmark_count)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 px-4 pb-3 pt-1">
                            <p className="text-xs text-muted-foreground">
                                {dateFormatter.format(new Date(post.created_at))}
                            </p>
                        </div>

                        <PostCommentComposer
                            postId={post.posts_id}
                            currentProfile={currentProfile}
                        />
                    </div>
                </CommentReplyProvider>
            ) : (
                <>
                    <div className="shrink-0 border-t">
                        <div className="flex items-center justify-between px-3 pt-1.5">
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Like"
                                    aria-pressed={liked}
                                    disabled={loading}
                                    onClick={handleToggleLike}
                                >
                                    <Heart
                                        className={`size-6 ${liked ? "fill-current text-destructive" : ""
                                            }`}
                                    />
                                </Button>
                                <span onClick={() => setLikeDetails(true)} className="hover:cursor-pointer text-sm font-semibold tabular-nums">
                                    {compactNumber.format(post.like_count)}
                                </span>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Komentar"
                                    onClick={() => setCommentOpen(true)}
                                >
                                    <MessageCircle className="size-6" />
                                </Button>
                                <span className="text-sm tabular-nums font-semibold -ml-1 mr-2">
                                    {compactNumber.format(post.comment_count)}
                                </span>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Bagikan"
                                >
                                    <Send className="size-6" />
                                </Button>
                                <span className="text-sm tabular-nums font-semibold -ml-1 mr-2">
                                    {compactNumber.format(post.share_count)}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full p-0 hover:bg-muted/60"
                                    aria-label="Simpan"
                                    aria-pressed={post.bookmarked}
                                    onClick={handleToggleBookmark}
                                >
                                    <Bookmark
                                        className={`size-6 ${bookmarked ? "fill-current" : ""}`}
                                    />
                                </Button>
                                <span className="text-sm tabular-nums font-semibold -ml-1">
                                    {compactNumber.format(post.bookmark_count)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 px-4 pb-3 pt-1">
                            <p className="text-xs text-muted-foreground">
                                {dateFormatter.format(new Date(post.created_at))}
                            </p>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {post.caption && (
                                <>
                                    <div className="flex items-start gap-3 px-4 py-4">
                                        <p className="min-w-0 flex-1 wrap-break-word text-sm leading-5">
                                            <Link
                                                href={authorRedirect}
                                                className="mr-1.5 font-semibold hover:text-muted-foreground"
                                            >
                                                {author.username}
                                            </Link>
                                            <span className="whitespace-pre-line">
                                                {post.caption}
                                            </span>
                                        </p>
                                    </div>
                                    <Separator className="opacity-50" />
                                </>
                            )}
                        </div>
                    </div>

                    <CommentsPanel
                        postId={post.posts_id}
                        open={commentOpen}
                        onOpenChange={setCommentOpen}
                        currentUser={currentProfile}
                    />
                </>
            )}

            <PostsLikeDetails
                open={likeDetails}
                postId={post.posts_id}
                onOpenChange={(b) => setLikeDetails(b)}
            />
        </div>
    )
}