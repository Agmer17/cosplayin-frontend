
"use client"

import { Grid3x3, Users, type LucideIcon } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type ExploreTab = "posts" | "users"

const TABS: { value: ExploreTab; label: string; icon: LucideIcon }[] = [
    { value: "posts", label: "Postingan", icon: Grid3x3 },
    { value: "users", label: "Pengguna", icon: Users },
]

type Props = {
    value: ExploreTab
    onChange: (tab: ExploreTab) => void
}

export function ExploreTabs({ value, onChange }: Props) {
    const activeIndex = Math.max(
        0,
        TABS.findIndex((tab) => tab.value === value),
    )

    return (
        <Tabs value={value} onValueChange={(v) => onChange(v as ExploreTab)}>
            <TabsList className="relative h-auto w-full rounded-none border-b bg-transparent p-0">
                {TABS.map(({ value: tabValue, label, icon: Icon }) => {
                    const isActive = value === tabValue

                    return (
                        <TabsTrigger
                            key={tabValue}
                            value={tabValue}
                            aria-label={label}
                            className={cn(
                                "h-11 flex-1 gap-2 rounded-none border-0 bg-transparent p-0 sm:h-12",
                                "text-muted-foreground shadow-none transition-colors",
                                "hover:bg-muted/40 hover:text-foreground",
                                "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
                                "data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none",
                                "dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent",
                            )}
                        >
                            <Icon
                                className="size-5! sm:size-[22px]!"
                                strokeWidth={isActive ? 2.25 : 1.75}
                            />

                            <span className="hidden text-sm font-medium sm:inline">
                                {label}
                            </span>
                        </TabsTrigger>
                    )
                })}

                {/* Indikator geser */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 flex justify-center transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{
                        width: `${100 / TABS.length}%`,
                        transform: `translateX(${activeIndex * 100}%)`,
                    }}
                >
                    <span className="h-0.5 w-full rounded-full bg-primary" />
                </span>
            </TabsList>
        </Tabs>
    )
}
