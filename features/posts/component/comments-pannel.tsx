"use client";

import { useIsMobile } from "@/lib/responsive_util";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import type { DetailProfileDTO } from "@/lib/type/profile";

import {
    PostCommentComposer,
    PostCommentsSection,
} from "@/features/comment/component/post-comment";

type CommentsPanelProps = {
    postId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentUser: DetailProfileDTO | null;
};

function CommentsBody({
    postId,
    currentUser,
}: {
    postId: string;
    currentUser: DetailProfileDTO | null;
}) {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
                <PostCommentsSection
                    postId={postId}
                    currentProfile={currentUser}
                />
            </div>

            <div className="shrink-0 border-t bg-background pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <PostCommentComposer
                    postId={postId}
                    currentProfile={currentUser}
                />
            </div>
        </div>
    );
}

export function CommentsPanel({
    postId,
    open,
    onOpenChange,
    currentUser,
}: CommentsPanelProps) {
    const isMobile = useIsMobile();

    if (!isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side="right"
                    className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
                >
                    <SheetHeader className="shrink-0 border-b px-4 py-3 text-left">
                        <SheetTitle>Komentar</SheetTitle>
                        <SheetDescription className="sr-only">
                            Daftar komentar pada postingan ini.
                        </SheetDescription>
                    </SheetHeader>

                    <CommentsBody
                        postId={postId}
                        currentUser={currentUser}
                    />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {/* Changed max-h-[85dvh] to h-[85dvh] for fixed predictable height */}
            <DrawerContent className="flex h-[75%] flex-col gap-0 overflow-hidden p-0">
                <DrawerHeader className="shrink-0 border-b text-center">
                    <DrawerTitle>Komentar</DrawerTitle>
                    <DrawerDescription className="sr-only">
                        Daftar komentar pada postingan ini.
                    </DrawerDescription>
                </DrawerHeader>

                <CommentsBody
                    postId={postId}
                    currentUser={currentUser}
                />
            </DrawerContent>
        </Drawer>
    );
}