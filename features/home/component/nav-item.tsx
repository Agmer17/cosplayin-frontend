import { Bell, CalendarClock, Compass, Home, LucideIcon, Plus, Send, Store } from "lucide-react"

export type navigationItem = {
    title: string,
    url: string,
    icon: LucideIcon
    appearMobile: boolean
    needLogin: boolean
}

export const isActive = (url: string, activePage: string) =>
    url === "/" ? activePage === "/" : activePage === url || activePage.startsWith(url + "/");

export const navItems: navigationItem[] = [
    {
        title: "home",
        url: "/",
        icon: Home,
        appearMobile: true,
        needLogin: false
    },
    {
        title: "eksplor",
        url: "/explore",
        icon: Compass,
        appearMobile: true,
        needLogin: false
    },
    {
        title: "notifikasi",
        url: "/notification",
        icon: Bell,
        appearMobile: false,
        needLogin: true
    },
    {
        title: "buat postingan",
        url: "/create/posts",
        icon: Plus,
        appearMobile: true,
        needLogin: true
    },
    {
        title: "event cosplay",
        url: "/anime-event",
        icon: CalendarClock,
        appearMobile: true,
        needLogin: false
    },
    {
        title: "pesan",
        url: "/message",
        icon: Send,
        appearMobile: false,
        needLogin: true
    },
    {
        title: "marketplace",
        url: "/marketplace",
        icon: Store,
        appearMobile: false,
        needLogin: false
    }
]
