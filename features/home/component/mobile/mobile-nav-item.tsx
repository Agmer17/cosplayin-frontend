"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { isActive } from "../nav-item"
import type { navigationItem } from "../nav-item"

interface BottomNavItemProps {
    item: navigationItem
    activePage: string
}

export function BottomNavItem({ item, activePage }: BottomNavItemProps) {
    const active = isActive(item.url, activePage)
    const Icon = item.icon

    return (
        <Button
            variant="ghost"
            className="h-full min-h-11 flex-1 rounded-none py-3 hover:bg-secondary hover:text-primary"
        >
            <Link href={item.url} aria-current={active ? "page" : undefined}>
                <Icon
                    className={cn(
                        "h-5! w-5!",
                        active && "fill-primary text-primary"
                    )}
                />
                <span className="sr-only">{item.title}</span>
            </Link>
        </Button>
    )
}