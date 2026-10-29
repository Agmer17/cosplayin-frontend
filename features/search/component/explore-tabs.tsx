"use client"

import { Grid3x3, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type ExploreTab = "posts" | "users";

type Props = {
    value: ExploreTab;
    onChange: (tab: ExploreTab) => void;
};


export function ExploreTabs({ value, onChange }: Props) {
    const triggerClass = cn(
        "h-11 flex-1 rounded-none border-0 border-b-2 border-transparent bg-transparent p-0 sm:h-12",
        "text-muted-foreground shadow-none transition-colors",
        "hover:text-foreground",
        "data-[state=active]:border-foreground data-[state=active]:bg-transparent",
        "data-[state=active]:text-foreground data-[state=active]:shadow-none",
        "dark:data-[state=active]:border-foreground dark:data-[state=active]:bg-transparent"
    )

    const iconClass = "!size-5 sm:!size-6"
    return (
        <Tabs value={value} onValueChange={(v) => onChange(v as ExploreTab)}>
            <TabsList className="h-auto w-full rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="posts" aria-label="Postingan" className={triggerClass}>
                    <Grid3x3
                        className={iconClass}
                        strokeWidth={value === "posts" ? 2.25 : 1.75}
                    />
                </TabsTrigger>

                <TabsTrigger value="users" aria-label="Pengguna" className={triggerClass}>
                    <Users
                        className={iconClass}
                        strokeWidth={value === "users" ? 2.25 : 1.75}
                    />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}