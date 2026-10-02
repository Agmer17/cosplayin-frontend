// components/settings/settings-page-header.tsx
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SettingsPageHeader({
    title,
    description,
}: {
    title: string
    description?: string
}) {
    return (
        <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-2 py-2 md:static md:border-b-0 md:px-8 md:pt-8 md:pb-0">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Link href="/settings" aria-label="Kembali ke Settings">
                    <ArrowLeft />
                </Link>
            </Button>
            <div>
                <h2 className="text-base font-semibold md:text-2xl">{title}</h2>
                {description && (
                    <p className="hidden text-sm text-muted-foreground md:block">{description}</p>
                )}
            </div>
        </header>
    )
}