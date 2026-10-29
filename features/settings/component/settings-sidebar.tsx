"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/api"
import { AuthClientApi } from "@/features/auth/api/auth"
import LogoutDialog from "./logout-dialog"
import { useQueryClient } from "@tanstack/react-query"

export function SettingsSidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const clearUser = useAuthStore((state) => state.clearUser)
    const router = useRouter()
    const queryClient = useQueryClient()


    const handleLogout = () => {
        try {
            AuthClientApi.logout()
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error(err.message)
            }
            toast.error("ada yang salah sama internet kamu! silahkan coba lagi nanti!")
            return
        }

        clearUser()
        queryClient.clear()
        router.push("/")
        toast.message("berhasil logout!")

    }

    return (
        <Sidebar
            collapsible="none"
            className={cn(
                "w-full md:sticky md:top-0 md:h-svh md:w-(--sidebar-width) md:border-r bg-background",
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

            <SidebarFooter>
                <SidebarMenu>
                    <LogoutDialog
                        logoutFn={handleLogout}
                    />
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}