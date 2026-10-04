"use client";

import { MessageCircle } from "lucide-react";
import { useIsMobile } from "@/lib/responsive_util"; // or your useIsMobile

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
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Send } from "lucide-react";
import type { DetailProfileDTO } from "@/lib/type/profile"; // adjust import
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolvePublicMedia } from "@/lib/image-url-resolver";


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



function CommentsBody({ currentUser }: { currentUser: DetailProfileDTO | null }) {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {/* Scrollable comments area */}
            <div className="flex-1 overflow-y-auto">
                <Empty className="h-full border-0">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MessageCircle />
                        </EmptyMedia>
                        <EmptyTitle>Belum ada komentar</EmptyTitle>
                        <EmptyDescription>
                            Komentar akan muncul di sini.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>

            {/* Comment input / login prompt */}
            <div className="shrink-0 border-t bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {currentUser ? (
                    <InputGroup>
                        <UserAvatar
                            user={currentUser}
                            className="size-8 shrink-0"
                        />
                        <InputGroupInput
                            placeholder="Tambahkan komentar..."
                            className="flex-1"
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton size="icon-sm" variant="ghost">
                                <Send className="size-4" />
                                <span className="sr-only">Kirim</span>
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                ) : (
                    <div className="flex h-8 items-center justify-center text-sm text-muted-foreground">
                        Harus login untuk menambahkan komentar.
                    </div>
                )}
            </div>
        </div>
    );
}

export function CommentsPanel({
    open,
    onOpenChange,
    currentUser,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentUser: DetailProfileDTO | null;
}) {
    const isMobile = useIsMobile()

    if (!isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side="right"
                    className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
                >
                    <SheetHeader className="border-b px-4 py-3 text-left">
                        <SheetTitle>Komentar</SheetTitle>
                        <SheetDescription className="sr-only">
                            Daftar komentar pada postingan ini.
                        </SheetDescription>
                    </SheetHeader>
                    <CommentsBody currentUser={currentUser} />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="flex max-h-[85dvh] flex-col gap-0">
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

