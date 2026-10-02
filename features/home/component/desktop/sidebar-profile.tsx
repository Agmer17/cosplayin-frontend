"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { LogIn } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DetailProfileDTO } from "@/lib/type/profile"
import { resolvePublicMedia } from "@/lib/ImageUrlResolver"

interface SidebarProfileProps {
    profile: DetailProfileDTO | null
    hovered: boolean
}

export function SidebarProfile({ profile, hovered }: SidebarProfileProps) {
    // ── Logged out ──────────────────────────────────────────────
    if (profile == null) {
        return (
            <SidebarMenu className="w-full">
                <SidebarMenuItem className="w-full">
                    <SidebarMenuButton
                        render={<Link href="/auth" />}
                        className="h-auto w-full justify-start rounded p-2 hover:cursor-pointer"
                    >
                        <LogIn className="h-5! w-5! shrink-0" />

                        <AnimatePresence>
                            {hovered && (
                                <motion.span
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="ml-3 truncate text-lg font-medium"
                                >
                                    Masuk
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    const avatarUrl = resolvePublicMedia(profile.avatar_url)

    return (
        <SidebarMenu className="w-full">
            <SidebarMenuItem className="w-full">
                <SidebarMenuButton render={<Link href="/my-profile" />} className="h-auto w-full justify-start rounded hover:cursor-pointer">
                    <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage referrerPolicy="no-referrer" src={avatarUrl} />
                    </Avatar>

                    <AnimatePresence>
                        {hovered && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="ml-3 flex min-w-0 flex-col"
                            >
                                <span className="truncate text-sm font-medium leading-tight">
                                    {profile.display_name}
                                </span>
                                <span className="truncate text-xs leading-tight">
                                    @{profile.username}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}