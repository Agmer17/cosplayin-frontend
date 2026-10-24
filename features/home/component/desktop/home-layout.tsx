"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import DesktopSidebar from "./desktop-sidebar"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import MobileBottomBar from "../mobile/MobileBottomBar"
import { useAuthStore } from "@/lib/store/auth-store"
import { MobileNavbar } from "../mobile/mobile-navbar"

interface HomeLayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: HomeLayoutProps) {
    const path = usePathname()
    const isMobile = useIsMobile()
    const profile = useAuthStore((state) => state.user)
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen w-full">
            <SidebarProvider>
                {!isMobile && (
                    <DesktopSidebar profile={profile} activePage={path} />
                )}

                {isMobile && !pathname.startsWith("/posts") && (
                    <MobileNavbar />
                )}

                <div className={isMobile ? "w-full pb-14 pt-14" : "w-full"}>
                    {children}
                </div>

                {isMobile && (
                    <MobileBottomBar profile={profile} activePage={path} />
                )}
            </SidebarProvider>
        </div>
    )
}