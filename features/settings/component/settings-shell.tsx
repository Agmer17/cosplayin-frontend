// components/settings/settings-shell.tsx
"use client"

import { usePathname } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { SettingsSidebar } from "./settings-sidebar"

export function SettingsShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isIndex = pathname === "/settings" || pathname === "/settings/"

    return (
        <SidebarProvider>
            <SettingsSidebar className={cn(!isIndex && "hidden md:flex")} />
            <SidebarInset className={cn(isIndex && "hidden md:flex")}>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}