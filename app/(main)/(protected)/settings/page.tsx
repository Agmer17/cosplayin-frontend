import { Settings } from "lucide-react"

export default function SettingsIndexPage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <Settings className="size-8" />
            <p className="text-sm">Pilih menu di sebelah kiri untuk mengatur akun kamu.</p>
        </div>
    )
}