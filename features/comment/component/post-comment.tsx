"use client";

import { useState, type FormEvent } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import {
    ChevronDown,
    ChevronUp,
    Heart,
    MessageCircle,
    Send,
} from "lucide-react";
import { toast } from "sonner";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import type {
    CommentResponse,
} from "@/lib/type/comment";
import type { DetailProfileDTO } from "@/lib/type/profile";
import { resolvePublicMedia } from "@/lib/image-url-resolver";

import {
    useCommentReplies,
    useCreateComment,
    usePostComments,
    useToggleCommentLike,
} from "../hooks/use-comment";

const compactNumber = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
});

const MAX_INDENT_DEPTH = 3;

function formatCommentDate(value: string) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() <= 1970) {
        return "";
    }

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
    }).format(date);
}

function CommentAvatar({
    username,
    profilePicture,
}: {
    username: string;
    profilePicture: string | null;
}) {
    return (
        <Avatar className="size-8 shrink-0">
            <AvatarImage
                src={resolvePublicMedia(profilePicture || "")}
                alt={username}
            />
            <AvatarFallback>
                {username.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}

function CommentSkeleton() {
    return (
        <div className="flex items-start gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-28 max-w-full" />
                <Skeleton className="h-4 w-full max-w-sm" />

                <div className="flex gap-3 pt-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
        </div>
    );
}

function CommentListSkeleton() {
    return (
        <div
            className="space-y-6 px-4 py-4"
            aria-label="Memuat komentar"
        >
            {Array.from({ length: 4 }).map((_, index) => (
                <CommentSkeleton key={index} />
            ))}
        </div>
    );
}

function CommentItem({
    postId,
    comment,
    currentProfile,
    depth = 0,
}: {
    postId: string;
    comment: CommentResponse;
    currentProfile: DetailProfileDTO | null;
    depth?: number;
}) {
    const [repliesOpen, setRepliesOpen] = useState(false);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyDraft, setReplyDraft] = useState("");

    const isFlat = depth >= MAX_INDENT_DEPTH;

    const repliesQuery = useCommentReplies(
        comment.id,
        repliesOpen
    );

    const createReply = useCreateComment(postId);
    const toggleLike = useToggleCommentLike();

    const isLiked = comment.is_liked ?? false;

    function handleLike() {
        if (!currentProfile) {
            toast.error("Kamu harus login untuk menyukai komentar.");
            return;
        }

        toggleLike.mutate(comment.id);
    }

    function handleOpenReply() {
        if (!currentProfile) {
            toast.error("Kamu harus login untuk membalas komentar.");
            return;
        }

        if (!replyOpen && isFlat && !replyDraft) {
            setReplyDraft(`@${comment.username} `);
        }
        setReplyOpen((previous) => !previous);
    }

    function handleSubmitReply(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const value = replyDraft.trim();

        if (!value || createReply.isPending) {
            return;
        }

        createReply.mutate(
            {
                comment: value,
                replyTo: comment.id,
            },
            {
                onSuccess: () => {
                    setReplyDraft("");
                    setReplyOpen(false);
                    setRepliesOpen(true);
                },
                onError: () => {
                    toast.error("Gagal mengirim balasan.");
                },
            }
        );
    }

    const replies = repliesQuery.data ?? [];

    return (
        <div className="flex flex-col">
            {/* Main Comment Wrapper */}
            <div className="flex items-start gap-3">
                <CommentAvatar
                    username={comment.username}
                    profilePicture={comment.profile_picture}
                />

                <div className="min-w-0 flex-1">
                    <p className="wrap-break-word text-sm leading-5">
                        <span className="mr-1.5 font-semibold">
                            {comment.username}
                        </span>
                        {comment.comment}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <time
                            dateTime={comment.created_at}
                            className="text-xs text-muted-foreground"
                        >
                            {formatCommentDate(comment.created_at)}
                        </time>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto rounded-none px-0 py-0 text-xs font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground"
                            aria-label={
                                isLiked
                                    ? "Batal menyukai komentar"
                                    : "Sukai komentar"
                            }
                            aria-pressed={isLiked}
                            disabled={toggleLike.isPending}
                            onClick={handleLike}
                        >
                            <Heart
                                className={`size-3.5 ${isLiked
                                    ? "fill-current text-destructive"
                                    : ""
                                    }`}
                            />
                            <span>
                                {compactNumber.format(comment.like_count)}
                            </span>
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto rounded-none px-0 py-0 text-xs font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground"
                            onClick={handleOpenReply}
                        >
                            Balas
                        </Button>

                        {(comment.reply_count > 0 || repliesOpen) && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto rounded-none px-0 py-0 text-xs font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground"
                                aria-expanded={repliesOpen}
                                onClick={() =>
                                    setRepliesOpen((previous) => !previous)
                                }
                            >
                                {repliesOpen ? (
                                    <ChevronUp className="size-3.5" />
                                ) : (
                                    <ChevronDown className="size-3.5" />
                                )}

                                {repliesOpen
                                    ? "Sembunyikan balasan"
                                    : `Lihat ${comment.reply_count} balasan`}
                            </Button>
                        )}
                    </div>

                    {replyOpen && (
                        <form
                            className="mt-3 flex min-w-0 items-center gap-2"
                            onSubmit={handleSubmitReply}
                        >
                            <Input
                                value={replyDraft}
                                onChange={(event) =>
                                    setReplyDraft(event.target.value)
                                }
                                placeholder={`Balas @${comment.username}...`}
                                aria-label={`Balas komentar ${comment.username}`}
                                autoComplete="off"
                                className="h-9 min-w-0 flex-1 rounded-full bg-muted/30 shadow-none"
                                disabled={createReply.isPending}
                            />

                            <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="size-9 shrink-0 rounded-full"
                                aria-label="Kirim balasan"
                                disabled={
                                    !replyDraft.trim() ||
                                    createReply.isPending
                                }
                            >
                                <Send className="size-4" />
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            {/* Replies Container moved OUTSIDE the flex-1 text wrapper */}
            {repliesOpen && (
                <div
                    className={
                        isFlat
                            ? "mt-4 space-y-4" // Flat replies stack without extra left margin
                            : "ml-11 mt-4 space-y-4 border-l pl-3 sm:ml-12 sm:pl-4" // ml-11 specifically offsets the 32px avatar + 12px gap
                    }
                >
                    {repliesQuery.isPending ? (
                        <>
                            <CommentSkeleton />
                            <CommentSkeleton />
                        </>
                    ) : repliesQuery.isError ? (
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Gagal memuat balasan.</p>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    void repliesQuery.refetch()
                                }
                            >
                                Coba lagi
                            </Button>
                        </div>
                    ) : replies.length === 0 ? (
                        <p className="py-1 text-sm text-muted-foreground">
                            Belum ada balasan.
                        </p>
                    ) : (
                        replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                postId={postId}
                                comment={reply}
                                currentProfile={currentProfile}
                                depth={depth + 1}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export function PostComments({
    postId,
    currentProfile,
    query,
}: {
    postId: string;
    currentProfile: DetailProfileDTO | null;
    query: UseQueryResult<CommentResponse[], Error>;
}) {
    if (query.isPending) {
        return <CommentListSkeleton />;
    }

    if (query.isError && !query.data) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                <MessageCircle className="size-7 text-muted-foreground" />

                <div className="space-y-1">
                    <p className="text-sm font-semibold">
                        Komentar gagal dimuat
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Periksa koneksi kamu lalu coba lagi.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void query.refetch()}
                >
                    Coba lagi
                </Button>
            </div>
        );
    }

    const comments = query.data ?? [];

    if (comments.length === 0) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full border bg-muted/30">
                    <MessageCircle className="size-6 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-semibold">
                        Belum ada komentar
                    </h3>

                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                        Jadilah yang pertama memberikan komentar pada
                        postingan ini.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 py-4">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    postId={postId}
                    comment={comment}
                    currentProfile={currentProfile}
                />
            ))}
        </div>
    );
}

// Wrapper praktis jika query tidak perlu dibuat di parent.
export function PostCommentsSection({
    postId,
    currentProfile,
}: {
    postId: string;
    currentProfile: DetailProfileDTO | null;
}) {
    const query = usePostComments(postId);

    return (
        <PostComments
            postId={postId}
            currentProfile={currentProfile}
            query={query}
        />
    );
}

// Composer untuk komentar utama.
// Composer ini bisa dipakai pada desktop maupun mobile.
export function PostCommentComposer({
    postId,
    currentProfile,
}: {
    postId: string;
    currentProfile: DetailProfileDTO | null;
}) {
    const [draft, setDraft] = useState("");
    const createComment = useCreateComment(postId);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const value = draft.trim();

        if (!value || createComment.isPending) {
            return;
        }

        createComment.mutate(
            {
                comment: value,
                replyTo: null,
            },
            {
                onSuccess: () => {
                    setDraft("");
                },
                onError: () => {
                    toast.error("Gagal mengirim komentar.");
                },
            }
        );
    }

    if (!currentProfile) {
        return (
            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                Harus login untuk menambahkan komentar.
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex min-w-0 items-center gap-2 px-4 py-2.5"
        >
            <Avatar className="size-8 shrink-0">
                <AvatarImage
                    src={resolvePublicMedia(currentProfile.avatar_url)}
                    alt={currentProfile.display_name}
                />
                <AvatarFallback>
                    {currentProfile.display_name
                        .charAt(0)
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Tambahkan komentar..."
                aria-label="Tambahkan komentar"
                autoComplete="off"
                className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                disabled={createComment.isPending}
            />

            <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="shrink-0 px-1 font-semibold text-primary hover:bg-transparent hover:text-primary"
                disabled={!draft.trim() || createComment.isPending}
            >
                {createComment.isPending ? "Mengirim..." : "Kirim"}
            </Button>
        </form>
    );
}