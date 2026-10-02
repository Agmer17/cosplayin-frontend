"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

import { resolvePublicMedia } from "@/lib/ImageUrlResolver";
import { cn } from "@/lib/utils";
import type { DetailProfileDTO } from "@/lib/type/profile";
import type { PostsResponse } from "@/lib/type/posts";

// TODO: sesuaikan path import di bawah dengan struktur project kamu
import { PostDetailMedia } from "./post-detail-media";
import { postsApi } from "@/features/posts/api/posts.client";
import { usePostsBookmark, usePostsLike } from "../hooks/use-posts";
import { PostOptionsDialog } from "./post-option-dialog";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
];

function timeAgo(iso: string) {
    const diffSec = (new Date(iso).getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });
    for (const [unit, sec] of RELATIVE_UNITS) {
        if (Math.abs(diffSec) >= sec) {
            return rtf.format(Math.round(diffSec / sec), unit);
        }
    }
    return "baru saja";
}

function formatCount(n: number) {
    return new Intl.NumberFormat("id", { notation: "compact" }).format(n);
}


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
                src={resolvePublicMedia(user.avatar_url)}
                alt={user.display_name}
            />
            <AvatarFallback>
                {user.display_name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}


// Isi panel komentar (masih kosong karena BE belum ada)
function CommentsBody({ currentUser }: { currentUser: DetailProfileDTO | null }) {
    return (
        <>
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                <MessageCircle className="size-10 text-muted-foreground" />
                <p className="font-semibold">Belum ada komentar</p>
                <p className="text-sm text-muted-foreground">
                    Komentar akan muncul di sini.
                </p>
            </div>
            <div className="flex items-center gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <UserAvatar user={currentUser} className="size-8 shrink-0" />
                <Input disabled placeholder="Tambahkan komentar..." />
            </div>
        </>
    );
}

// Desktop: Sheet dari kanan. Mobile: Drawer dari bawah.
function CommentsPanel({
    open,
    onOpenChange,
    currentUser,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentUser: DetailProfileDTO | null;
}) {
    // const isDesktop = useIsDesktop();

    // if (isDesktop) {
    //     return (
    //         <Sheet open={open} onOpenChange={onOpenChange}>
    //             <SheetContent
    //                 side="right"
    //                 className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
    //             >
    //                 <SheetHeader className="border-b">
    //                     <SheetTitle>Komentar</SheetTitle>
    //                     <SheetDescription className="sr-only">
    //                         Daftar komentar pada postingan ini.
    //                     </SheetDescription>
    //                 </SheetHeader>
    //                 <CommentsBody currentUser={currentUser} />
    //             </SheetContent>
    //         </Sheet>
    //     );
    // }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="flex h-[75dvh] flex-col">
                <DrawerHeader className="border-b text-center">
                    <DrawerTitle>Komentar</DrawerTitle>
                    <DrawerDescription className="sr-only">
                        Daftar komentar pada postingan ini.
                    </DrawerDescription>
                </DrawerHeader>
                <CommentsBody currentUser={currentUser} />
            </DrawerContent>
        </Drawer>
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

    // Cache ["posts", postId] di-seed dari data feed supaya optimistic update
    // di usePostsLike / usePostsBookmark punya target. staleTime Infinity =
    // tidak ada fetch massal per kartu; refetch hanya terjadi saat di-invalidate.
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
            <div className="flex items-center gap-1 px-4 pt-2">
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

                {commentsEnabled && (
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Buka komentar"
                        onClick={() => setCommentsOpen(true)}
                    >
                        <MessageCircle className="size-6" />
                    </Button>
                )}

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
            </div>

            {/* Meta */}
            <div className="space-y-1 px-4 pb-3">
                <p className="text-sm font-semibold">
                    {formatCount(current.like_count)} suka
                </p>

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