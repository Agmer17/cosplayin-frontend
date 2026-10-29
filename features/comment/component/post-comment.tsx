"use client"

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
} from "react"
import type { UseQueryResult } from "@tanstack/react-query"
import {
    ChevronDown,
    ChevronUp,
    Flag,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Trash2,
    X,
} from "lucide-react"
import { toast } from "sonner"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import type { CommentResponse } from "@/lib/type/comment"
import type { DetailProfileDTO } from "@/lib/type/profile"

import {
    useCommentReplies,
    useCreateComment,
    useDeleteComment,
    usePostComments,
    useToggleCommentLike,
} from "../hooks/use-comment"
import { compactNumber } from "@/lib/number-formatter-utils"

const MAX_INDENT_DEPTH = 1

// ---------------------------------------------------------------------------
// Reply context
// ---------------------------------------------------------------------------

type ReplyTarget = {
    id: string;
    username: string;
} | null;

type CommentReplyContextValue = {
    replyTo: ReplyTarget;
    startReply: (target: { id: string; username: string }) => void;
    cancelReply: () => void;
    registerComposerFocus: (fn: () => void) => void;
    registerOnReplyStart: (fn: (username: string) => void) => void;
    registerOnReplyCancel: (fn: () => void) => void;
};

const CommentReplyContext = createContext<CommentReplyContextValue | null>(
    null
)

function useCommentReply() {
    const ctx = useContext(CommentReplyContext)
    if (!ctx) {
        throw new Error(
            "useCommentReply must be used inside <CommentReplyProvider>"
        )
    }
    return ctx
}

export function CommentReplyProvider({ children }: { children: ReactNode }) {
    const [replyTo, setReplyTo] = useState<ReplyTarget>(null)

    const focusFnRef = useRef<(() => void) | null>(null)
    const onReplyStartRef = useRef<((username: string) => void) | null>(null)
    const onReplyCancelRef = useRef<(() => void) | null>(null)

    const registerComposerFocus = useCallback((fn: () => void) => {
        focusFnRef.current = fn
    }, [])

    const registerOnReplyStart = useCallback(
        (fn: (username: string) => void) => {
            onReplyStartRef.current = fn
        },
        []
    )

    const registerOnReplyCancel = useCallback((fn: () => void) => {
        onReplyCancelRef.current = fn
    }, [])

    const startReply = useCallback(
        (target: { id: string; username: string }) => {
            setReplyTo(target)
            onReplyStartRef.current?.(target.username)
            requestAnimationFrame(() => {
                focusFnRef.current?.()
            })
        },
        []
    )

    const cancelReply = useCallback(() => {
        setReplyTo(null)
        onReplyCancelRef.current?.()
    }, [])

    return (
        <CommentReplyContext.Provider
            value={{
                replyTo,
                startReply,
                cancelReply,
                registerComposerFocus,
                registerOnReplyStart,
                registerOnReplyCancel,
            }}
        >
            {children}
        </CommentReplyContext.Provider>
    )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCommentDate(value: string) {
    if (!value) return ""

    const date = new Date(value)

    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() <= 1970) {
        return ""
    }

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
    }).format(date)
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
                src={profilePicture || ""}
                alt={username}
            />
            <AvatarFallback>
                {username.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
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
    )
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
    )
}

// ---------------------------------------------------------------------------
// CommentItem
// ---------------------------------------------------------------------------

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
    const [repliesOpen, setRepliesOpen] = useState(false)

    const isFlat = depth >= MAX_INDENT_DEPTH

    const repliesQuery = useCommentReplies(comment.id, repliesOpen)
    const toggleLike = useToggleCommentLike()
    const deleteComment = useDeleteComment(postId)
    const { startReply } = useCommentReply()

    const isLiked = comment.is_liked ?? false
    const isOwner =
        !!currentProfile?.username &&
        currentProfile.username === comment.username

    function handleLike() {
        if (!currentProfile) {
            toast.error("Kamu harus login untuk menyukai komentar.")
            return
        }
        toggleLike.mutate({ commentId: comment.id, liked: !isLiked })
    }

    function handleOpenReply() {
        if (!currentProfile) {
            toast.error("Kamu harus login untuk membalas komentar.")
            return
        }

        startReply({ id: comment.id, username: comment.username })
    }

    function handleDelete() {
        deleteComment.mutate(comment.id, {
            onSuccess: () => {
                toast.success("Komentar berhasil dihapus.")
            },
            onError: () => {
                toast.error("Gagal menghapus komentar.")
            },
        })
    }

    function handleReport() {
        toast.success("Laporan komentar telah dikirim.")
    }

    const replies = repliesQuery.data ?? []

    return (
        <div className="flex flex-col">
            <div className="flex items-start gap-3">
                <CommentAvatar
                    username={comment.username}
                    profilePicture={comment.profile_picture}
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                        <p className="min-w-0 flex-1 wrap-break-word text-sm leading-5">
                            <span className="mr-1.5 font-semibold">
                                {comment.username}
                            </span>

                            {comment.comment}
                        </p>

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 shrink-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                                    />
                                }
                            >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Opsi komentar</span>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                    onClick={handleReport}
                                    className="gap-2"
                                >
                                    <Flag className="size-4" />
                                    Laporkan
                                </DropdownMenuItem>

                                {isOwner && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={deleteComment.isPending}
                                            className="gap-2"
                                        >
                                            <Trash2 className="size-4" />
                                            {deleteComment.isPending
                                                ? "Menghapus..."
                                                : "Hapus"}
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

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
                                    setRepliesOpen((prev) => !prev)
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
                </div>
            </div>

            {repliesOpen && (
                <div
                    className={
                        isFlat
                            ? "mt-4 space-y-4"
                            : "ml-11 mt-4 space-y-4 border-l pl-3 sm:ml-12 sm:pl-4"
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
                                onClick={() => void repliesQuery.refetch()}
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
    )
}

// ---------------------------------------------------------------------------
// PostComments
// ---------------------------------------------------------------------------

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
        return <CommentListSkeleton />
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
        )
    }

    const comments = query.data ?? []

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
        )
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
    )
}

export function PostCommentsSection({
    postId,
    currentProfile,
}: {
    postId: string;
    currentProfile: DetailProfileDTO | null;
}) {
    const query = usePostComments(postId)

    return (
        <PostComments
            postId={postId}
            currentProfile={currentProfile}
            query={query}
        />
    )
}

// ---------------------------------------------------------------------------
// Bottom composer
// ---------------------------------------------------------------------------

export function PostCommentComposer({
    postId,
    currentProfile,
}: {
    postId: string;
    currentProfile: DetailProfileDTO | null;
}) {
    const [draft, setDraft] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const createComment = useCreateComment(postId)
    const {
        replyTo,
        cancelReply,
        registerComposerFocus,
        registerOnReplyStart,
        registerOnReplyCancel,
    } = useCommentReply()

    useEffect(() => {
        registerComposerFocus(() => {
            inputRef.current?.focus()
            const len = inputRef.current?.value.length ?? 0
            inputRef.current?.setSelectionRange(len, len)
        })

        registerOnReplyStart((username) => {
            setDraft(`@${username} `)
        })

        registerOnReplyCancel(() => {
            setDraft("")
        })
    }, [
        registerComposerFocus,
        registerOnReplyStart,
        registerOnReplyCancel,
    ])

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const value = draft.trim()
        if (!value || createComment.isPending) return

        createComment.mutate(
            {
                comment: value,
                replyTo: replyTo?.id ?? null,
            },
            {
                onSuccess: () => {
                    setDraft("")
                    cancelReply()
                },
                onError: () => {
                    toast.error(
                        replyTo
                            ? "Gagal mengirim balasan."
                            : "Gagal mengirim komentar."
                    )
                },
            }
        )
    }

    if (!currentProfile) {
        return (
            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                Harus login untuk menambahkan komentar.
            </div>
        )
    }

    return (
        <div className="border-t bg-background">
            {replyTo && (
                <div className="flex items-center justify-between gap-2 border-b px-4 py-2 text-xs text-muted-foreground">
                    <span>
                        Membalas{" "}
                        <span className="font-semibold text-primary">
                            @{replyTo.username}
                        </span>
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0 rounded-full"
                        onClick={cancelReply}
                        aria-label="Batalkan balasan"
                    >
                        <X className="size-3.5" />
                    </Button>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="flex min-w-0 items-center gap-2 px-4 py-2.5"
            >
                <Avatar className="size-8 shrink-0">
                    <AvatarImage
                        src={currentProfile.avatar_url}
                        alt={currentProfile.display_name}
                    />
                    <AvatarFallback>
                        {currentProfile.display_name
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <Input
                    ref={inputRef}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={
                        replyTo
                            ? `Balas @${replyTo.username}...`
                            : "Tambahkan komentar..."
                    }
                    aria-label={
                        replyTo
                            ? `Balas komentar ${replyTo.username}`
                            : "Tambahkan komentar"
                    }
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
        </div>
    )
}