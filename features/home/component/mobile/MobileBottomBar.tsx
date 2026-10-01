"use client"

import Link from "next/link"
import { LogIn } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { DetailProfileDTO } from "@/lib/type/profile"
import { isActive, navItems } from "../nav-item"
import { BottomNavItem } from "./mobile-nav-item"
import { resolvePublicMedia } from "@/lib/ImageUrlResolver"

interface MobileBottomBarProps {
    profile: DetailProfileDTO | null
    activePage: string
}

export default function MobileBottomBar({
    profile,
    activePage,
}: MobileBottomBarProps) {
    const authenticated = profile != null

    const items = navItems.filter(
        (item) => item.appearMobile && (!item.needLogin || authenticated)
    )

    const avatarUrl = resolvePublicMedia(profile?.avatar_url || "")

    const profileActive = isActive("/profile", activePage)

    return (
        <nav
            aria-label="Mobile"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            <div className="flex h-14 w-full items-stretch justify-around">
                {items.map((item) => (
                    <BottomNavItem
                        key={item.url}
                        item={item}
                        activePage={activePage}
                    />
                ))}

                <Button
                    variant="ghost"
                    className="h-full min-h-11 flex-1 rounded-none py-3 hover:bg-secondary hover:text-primary"
                >
                    {authenticated ? (
                        <Link href="/my-profile" aria-current={profileActive ? "page" : undefined}>
                            <Avatar

                                className={cn(
                                    "h-7 w-7 shrink-0",
                                    profileActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                )}
                            >
                                <AvatarImage referrerPolicy="no-referrer" src={avatarUrl} alt={profile.display_name} />
                            </Avatar>
                            <span className="sr-only">{profile.display_name}</span>
                        </Link>
                    ) : (
                        <Link href="/auth">
                            <LogIn className="h-5! w-5!" />
                            <span className="sr-only">Sign in</span>
                        </Link>
                    )}
                </Button>
            </div>
        </nav>
    )
}