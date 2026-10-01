"use client"

import { useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import { DetailProfileDTO } from "@/lib/type/profile"
import { navItems } from "../nav-item"
import { NavMenuItem } from "./nav-menu-item"
import { SidebarProfile } from "./sidebar-profile"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface DesktopSidebarProps {
    profile: DetailProfileDTO | null
    activePage: string
}

export default function DesktopSidebar({
    profile,
    activePage,
}: DesktopSidebarProps) {
    const [hovered, setHovered] = useState(false)
    const { theme, setTheme } = useTheme()

    return (
        <Sidebar
            collapsible="icon"
            className="border-none bg-background pl-4"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <SidebarHeader className="flex-1 bg-background">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </SidebarHeader>

            <SidebarContent className="flex-4 overflow-hidden bg-background scrollbar-none">
                <SidebarGroup className="h-full p-0">
                    <SidebarGroupContent className="h-full">
                        <SidebarMenu className="flex h-full w-full flex-col justify-around">
                            {navItems.map((item) => (
                                <NavMenuItem
                                    key={item.url}
                                    item={item}
                                    activePage={activePage}
                                    hovered={hovered}
                                    authenticated={profile != null}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="flex-1 justify-center bg-background p-0">
                <SidebarProfile profile={profile} hovered={hovered} />
            </SidebarFooter>
        </Sidebar>
    )
}