
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOut, ShieldAlert } from "lucide-react"

interface LogoutDialogProps {
    logoutFn: () => void
}

export default function LogoutDialog({ logoutFn }: LogoutDialogProps) {
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <SidebarMenuButton className="hover:bg-secondary hover:cursor-pointer">
                        <LogOut className="size-5 text-destructive" />
                        <span className="text-destructive">Keluar</span>
                    </SidebarMenuButton>
                }
            />

            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-xl">
                <DialogHeader className="items-center text-center sm:text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                        <ShieldAlert className="size-7 text-destructive" />
                    </div>

                    <DialogTitle className="pt-2 text-xl">
                        Keluar dari akun?
                    </DialogTitle>

                    <DialogDescription className="max-w-sm text-sm leading-relaxed">
                        Apakah kamu yakin ingin keluar dari akun ini? Kamu perlu masuk
                        kembali untuk mengakses akunmu.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                        }
                    />

                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={logoutFn}
                    >
                        <LogOut className="size-4" />
                        Ya, keluar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
