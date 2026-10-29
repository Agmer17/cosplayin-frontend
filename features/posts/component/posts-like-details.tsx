
"use client"

import { useIsMobile } from "@/lib/responsive_util"
import { usePostsLikeDetails } from "../hooks/use-posts"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

import { AlertCircle, Heart } from "lucide-react"

type PostsLikeDetailsProps = {
    postId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PostsLikeDetails({
    postId,
    open,
    onOpenChange,
}: PostsLikeDetailsProps) {
    const isMobile = useIsMobile()

    const {
        data: likes,
        isPending,
        isError,
        refetch,
    } = usePostsLikeDetails(postId)

    const content = (
        <div className="flex min-h-0 flex-col">
            {isPending ? (
                <div className="space-y-4 px-4 py-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3"
                        >
                            <Skeleton className="size-11 shrink-0 rounded-full" />

                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                    <AlertCircle className="size-8 text-muted-foreground" />

                    <p className="text-sm text-muted-foreground">
                        Gagal memuat daftar suka.
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="text-sm font-semibold underline underline-offset-4"
                    >
                        Coba lagi
                    </button>
                </div>
            ) : !likes?.length ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full border">
                        <Heart className="size-8" />
                    </div>

                    <p className="font-semibold">
                        Belum ada suka
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Jadilah yang pertama menyukai postingan ini.
                    </p>
                </div>
            ) : (
                <ScrollArea className="max-h-[min(65vh,480px)]">
                    <div className="space-y-1 px-4 py-2">
                        {likes.map((like) => {
                            const author = like.author
                            return (
                                <div
                                    key={like.like_id}
                                    className="flex items-center gap-3 py-2"
                                >
                                    <Avatar className="size-11 shrink-0">
                                        <AvatarImage
                                            src={author.avatar_url || undefined}
                                            alt={author.display_name}
                                        />

                                        <AvatarFallback>
                                            {(
                                                author.display_name ||
                                                author.username ||
                                                "?"
                                            )
                                                .slice(0, 1)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate text-sm font-semibold">
                                            {author.username}
                                        </span>

                                        <span className="truncate text-sm text-muted-foreground">
                                            {author.display_name}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            )}
        </div>
    )

    if (isMobile) {
        return (
            <Drawer
                open={open}
                onOpenChange={onOpenChange}
            >
                <DrawerContent className="max-h-[85dvh]">
                    <DrawerHeader className="border-b">
                        <DrawerTitle className="text-center">
                            Disukai oleh
                        </DrawerTitle>
                    </DrawerHeader>

                    {content}
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
                <DialogHeader className="border-b px-4 py-4">
                    <DialogTitle className="text-center">
                        Disukai oleh
                    </DialogTitle>
                </DialogHeader>

                {content}
            </DialogContent>
        </Dialog>
    )
}
