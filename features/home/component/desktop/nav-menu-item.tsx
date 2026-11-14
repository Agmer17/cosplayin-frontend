"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "cn"
import { isActive } from "../nav-item"

import type { navigationItem } from "../nav-item"

interface NavMenuItemProps {
    item: navigationItem
    activePage: string
    hovered: boolean
    authenticated: boolean
}

export function NavMenuItem({
    item,
    activePage,
    hovered,
    authenticated,
}: NavMenuItemProps) {
    if (item.needLogin && !authenticated) {
        return null
    }

    const active = isActive(item.url, activePage)
    const Icon = item.icon

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                render={<Link href={item.url} />}
                isActive={active}
                tooltip={!hovered ? item.title : undefined}
                className={cn(
                    "group relative h-11 w-full overflow-hidden rounded-lg px-3",
                    "transition-colors duration-200",

                    // Background selalu bg-background, apa pun state-nya
                    "bg-background",
                    "hover:bg-background",
                    "active:bg-background",
                    "data-active:bg-background",
                    "data-active:hover:bg-background",
                    "data-open:bg-background",
                    "data-open:hover:bg-background",

                    // Warna teks saat active
                    "data-active:text-primary"
                )}
            >
                {/* Active indicator */}
                <AnimatePresence>
                    {active && (
                        <motion.span
                            layoutId="sidebar-active-indicator"
                            className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                            initial={{ opacity: 0, scaleY: 0.5 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0.5 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>

                <Icon
                    className={cn(
                        "size-5! shrink-0 transition-colors duration-200",
                        active
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                    )}
                />

                <AnimatePresence initial={false}>
                    {hovered && (
                        <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{
                                duration: 0.18,
                                ease: "easeOut",
                            }}
                            className={cn(
                                "truncate text-sm font-medium",
                                active
                                    ? "text-primary"
                                    : "text-sidebar-foreground"
                            )}
                        >
                            {item.title}
                        </motion.span>
                    )}
                </AnimatePresence>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}