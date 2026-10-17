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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Flag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/lib/responsive_util";

type PostOptionsDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId: string;
    onReport?: (postId: string) => void;
    onDelete?: (postId: string) => void;
    isAuthor: boolean;
};

export function PostOptionsDialog({
    open,
    onOpenChange,
    postId,
    onReport,
    onDelete,
    isAuthor,
}: PostOptionsDialogProps) {
    const isMobile = useIsMobile();

    const close = () => onOpenChange(false);

    const copyLink = async () => {
        try {
            const url = `${window.location.origin}/posts/${postId}`;
            await navigator.clipboard.writeText(url);
            toast.success("Tautan disalin");
        } catch {
            toast.error("Gagal menyalin tautan");
        } finally {
            close();
        }
    };

    const report = () => {
        close();
        if (onReport) onReport(postId);
        else toast.info("Fitur laporan belum tersedia");
    };

    const deletePost = () => {
        close();
        if (onDelete) onDelete(postId);
        else toast.info("Fitur hapus belum tersedia");
    };

    const content = (
        <div className="flex flex-col py-1">
            <Button
                variant="ghost"
                className="h-12 justify-start gap-3 rounded-none px-4 font-semibold text-destructive hover:text-destructive"
                onClick={report}
            >
                <Flag className="size-4" />
                Laporkan
            </Button>

            <Separator />

            <Button
                variant="ghost"
                className="h-12 justify-start gap-3 rounded-none px-4"
                onClick={copyLink}
            >
                <Copy className="size-4" />
                Salin tautan
            </Button>

            {isAuthor && (
                <>
                    <Separator />
                    <Button
                        variant="ghost"
                        className="h-12 justify-start gap-3 rounded-none px-4 font-semibold text-destructive hover:text-destructive"
                        onClick={deletePost}
                    >
                        <Trash2 className="size-4" />
                        Hapus
                    </Button>
                </>
            )}

            <Separator />

            <Button
                variant="ghost"
                className="h-12 justify-center rounded-none px-4 text-muted-foreground"
                onClick={close}
            >
                Batal
            </Button>
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="gap-0 p-0">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Opsi postingan</DrawerTitle>
                        <DrawerDescription>
                            Salin tautan, laporkan, atau hapus postingan ini.
                        </DrawerDescription>
                    </DrawerHeader>
                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden p-0 sm:rounded-xl [&>button]:hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Opsi postingan</DialogTitle>
                    <DialogDescription>
                        Salin tautan, laporkan, atau hapus postingan ini.
                    </DialogDescription>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}