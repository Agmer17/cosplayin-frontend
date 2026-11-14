"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { cn } from "cn"
import { isActive } from "../nav-item"

import type { navigationItem } from "../nav-item"

interface BottomNavItemProps {
    item: navigationItem
    activePage: string
}

export function BottomNavItem({
    item,
    activePage,
}: BottomNavItemProps) {
    const active = isActive(item.url, activePage)
    const Icon = item.icon

    return (
        <Link
            href={item.url}
            aria-current={active ? "page" : undefined}
            aria-label={item.title}
            className={cn(
                "relative flex h-full min-h-14 flex-1 items-center justify-center",
                "rounded-none transition-colors duration-200",
                "active:bg-muted/50",
                active
                    ? "text-primary"
                    : "text-muted-foreground"
            )}
        >
            {active && (
                <motion.span
                    layoutId="mobile-bottom-nav-indicator"
                    className="absolute top-0 h-[3px] w-8 rounded-full bg-primary"
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                    }}
                />
            )}

            <Icon
                className={cn(
                    "size-5! shrink-0 transition-transform duration-200",
                    active && "scale-110"
                )}
                strokeWidth={active ? 2.5 : 2}
            />
        </Link>
    )
}