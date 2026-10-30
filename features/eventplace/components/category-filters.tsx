"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const PLACE_CATEGORIES = [
    { value: "event", label: "Event" },
    { value: "mall", label: "Mall" },
    { value: "nongkrong", label: "Tempat Nongkrong" },
] as const

export type CategoryFilterValue =
    (typeof PLACE_CATEGORIES)[number]["value"]

interface CategoryFiltersProps {
    value: CategoryFilterValue
    onChange: (value: CategoryFilterValue) => void
    className?: string
}

export function CategoryFilters({
    value,
    onChange,
    className,
}: CategoryFiltersProps) {
    return (
        <ScrollArea className={cn("w-full whitespace-nowrap", className)}>
            <div className="flex items-center gap-2 px-1 py-1">
                {PLACE_CATEGORIES.map((cat) => {
                    const isActive = value === cat.value

                    return (
                        <Button
                            key={cat.value}
                            type="button"
                            size="sm"
                            variant="ghost"
                            aria-pressed={isActive}
                            onClick={() => onChange(cat.value)}
                            className={cn(
                                "h-9 shrink-0 rounded-full px-4",
                                "text-xs font-medium tracking-wide",
                                "transition-all duration-200 ease-out",
                                "focus-visible:ring-2 focus-visible:ring-ring",
                                isActive
                                    ? [
                                        "bg-primary text-primary-foreground",
                                        "shadow-sm shadow-primary/20",
                                        "hover:bg-primary/90 hover:text-primary-foreground",
                                    ]
                                    : [
                                        "border border-border/70",
                                        "bg-card text-muted-foreground",
                                        "hover:border-accent/60",
                                        "hover:bg-accent hover:text-foreground",
                                    ]
                            )}
                        >
                            {cat.label}
                        </Button>
                    )
                })}
            </div>

            <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
    )
}