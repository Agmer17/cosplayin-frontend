"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { DetailProfileDTO } from "@/lib/type/profile"
import DesktopSidebar from "./desktop-sidebar"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import MobileBottomBar from "../mobile/MobileBottomBar"
import { useAuthStore } from "@/lib/store/auth-store"

interface HomeLayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: HomeLayoutProps) {
    const path = usePathname()
    const isMobile = useIsMobile()
    const profile = useAuthStore((state) => state.user)

    return (
        <div className="flex min-h-screen w-full">
            <SidebarProvider>
                {!isMobile && (
                    <DesktopSidebar profile={profile} activePage={path} />
                )}

                <div className={isMobile ? "w-full pb-14" : "w-full"}>
                    {children}
                </div>

                {isMobile && (
                    <MobileBottomBar profile={profile} activePage={path} />
                )}
            </SidebarProvider>
        </div>
    )
}