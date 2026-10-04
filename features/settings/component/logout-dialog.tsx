import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"

interface LogoutDialogProps {
    logoutFn: () => void
}

export default function LogoutDialog({ logoutFn }: LogoutDialogProps) {
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <SidebarMenuButton className="hover:bg-secondary hover:cursor-pointer">
                        <div className="flex gap-4 text-destructive">
                            <LogOut className="w-5! h-5!" />
                            <span>Keluar</span>
                        </div>
                    </SidebarMenuButton>
                }
            />

            <DialogContent>
                <DialogHeader>
                    <p className="text-destructive">
                        Apakah kamu yakin ingin keluar dari akun ini?
                    </p>
                </DialogHeader>

                <div className="flex justify-end gap-4">
                    <DialogClose
                        render={
                            <Button variant="outline">
                                Batal
                            </Button>
                        }
                    />

                    <Button
                        variant="destructive"
                        onClick={logoutFn}
                    >
                        Ya
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

