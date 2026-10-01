import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import { Copy, Flag, Trash } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/lib/responsive/responsive_util";

export function PostOptionsDialog({
    open,
    onOpenChange,
    postId,
    onReport,
    onDelete,
    isAuthor,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId: string;
    onReport?: (postId: string) => void;
    onDelete?: (postId: string) => void;
    isAuthor: boolean;
}) {
    const isMobile = useIsMobile();

    const copyLink = async () => {
        try {
            const url = `${window.location.origin}/posts/${postId}`;
            await navigator.clipboard.writeText(url);
            toast.success("Tautan disalin");
        } catch {
            toast.error("Gagal menyalin tautan");
        }

        onOpenChange(false);
    };

    const report = () => {
        onOpenChange(false);

        if (onReport) onReport(postId);
        else toast.info("Fitur laporan belum tersedia");
    };

    const deletePosts = () => {
        onOpenChange(false);

        if (onDelete) onDelete(postId);
        else toast.info("Fitur hapus belum tersedia");
    };

    const content = (
        <>
            <button
                type="button"
                onClick={report}
                className="flex w-full items-center justify-center gap-2 border-b px-4 py-4 text-sm font-semibold text-destructive transition-colors hover:bg-muted"
            >
                <Flag className="size-4" />
                Laporkan
            </button>

            <button
                type="button"
                onClick={copyLink}
                className="flex w-full items-center justify-center gap-2 border-b px-4 py-4 text-sm transition-colors hover:bg-muted"
            >
                <Copy className="size-4" />
                Salin tautan
            </button>

            {isAuthor && (
                <button
                    type="button"
                    onClick={deletePosts}
                    className="flex w-full items-center justify-center gap-2 border-b px-4 py-4 text-sm font-semibold text-destructive transition-colors hover:bg-muted"
                >
                    <Trash className="size-4" />
                    Hapus
                </button>
            )}

            <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-full px-4 py-4 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
                Batal
            </button>
        </>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="gap-0 p-0">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Opsi postingan</DrawerTitle>
                        <DrawerDescription>
                            Salin tautan atau laporkan postingan ini.
                        </DrawerDescription>
                    </DrawerHeader>

                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Opsi postingan</DialogTitle>
                    <DialogDescription>
                        Salin tautan atau laporkan postingan ini.
                    </DialogDescription>
                </DialogHeader>

                {content}
            </DialogContent>
        </Dialog>
    );
}