import { AtSign, Bookmark, User, type LucideIcon } from "lucide-react"

export type SettingsNavItem = { title: string; href: string; icon: LucideIcon }
export type SettingsNavGroup = { label: string; items: SettingsNavItem[] }
export const settingsNav: SettingsNavGroup[] = [
    {
        label: "AKun",
        items: [
            { title: "Update Profile", href: "/settings/update-profile", icon: User },
            { title: "Update Username", href: "/settings/update-username", icon: AtSign },
        ],
    },

    {
        label: "Aktivitas",
        items: [
            { title: "Postingan Tersimpan", href: "/settings/bookmark", icon: Bookmark }
        ]

    }
]