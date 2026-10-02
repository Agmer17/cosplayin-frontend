// app/settings/layout.tsx
import { SettingsShell } from "@/features/settings/component/settings-shell"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <SettingsShell>{children}</SettingsShell>
}