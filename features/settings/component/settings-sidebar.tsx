// components/settings/settings-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { settingsNav } from "./settings-nav"

export function SettingsSidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <Sidebar
            collapsible="none"
            className={cn(
                "w-full md:sticky md:top-0 md:h-svh md:w-(--sidebar-width) md:border-r",
                className
            )}
        >
            <SidebarHeader className="p-4 md:p-6">
                <h1 className="text-xl font-semibold">Settings</h1>
            </SidebarHeader>
            <SidebarContent>
                {settingsNav.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-4">
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            isActive={pathname.startsWith(item.href)}
                                            className="h-12 md:h-9"
                                        >
                                            <Link href={item.href} className="flex gap-4">
                                                <item.icon />
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto text-muted-foreground md:hidden" />
                                            </Link>
                                        </SidebarMenuButton>

                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    )
}