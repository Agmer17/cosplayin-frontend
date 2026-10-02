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
    authenticated
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
                className="h-auto w-full rounded p-2 hover:bg-secondary hover:text-primary"
            >
                <Icon
                    className={cn(
                        "h-5! w-5!",
                        active && "text-primary font-bold"
                    )}
                />

                <AnimatePresence>
                    {hovered && (
                        <motion.span
                            className="text-xl"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {item.title}
                        </motion.span>
                    )}
                </AnimatePresence>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}