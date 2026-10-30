"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

import { PlaceFeatureDTO } from "@/lib/type/event-place"
import { cn } from "@/lib/utils"

interface MapSearchBarProps {
    features: PlaceFeatureDTO[]
    onSelect: (feature: PlaceFeatureDTO) => void
    className?: string
}

export function MapSearchBar({
    features,
    onSelect,
    className,
}: MapSearchBarProps) {
    const [query, setQuery] = useState("")
    const [value, setValue] = useState<PlaceFeatureDTO | null>(null)
    const [open, setOpen] = useState(false)

    const results = useMemo(() => {
        const q = query.trim().toLowerCase()

        if (!q) return []

        return features
            .filter((feature) => {
                const name = feature.properties.name.toLowerCase()
                const category =
                    feature.properties.category?.toLowerCase() ?? ""

                return name.includes(q) || category.includes(q)
            })
            .slice(0, 8)
    }, [features, query])

    const handleSelect = (feature: PlaceFeatureDTO) => {
        setValue(feature)
        setQuery(feature.properties.name)
        setOpen(false)

        onSelect(feature)
    }

    const handleClear = () => {
        setValue(null)
        setQuery("")
        setOpen(false)
    }

    return (
        <div className={cn("relative w-full max-w-md", className)}>
            <Combobox
                items={results}
                value={value}
                inputValue={query}
                open={open}
                onValueChange={(feature) => {
                    if (feature) {
                        handleSelect(feature)
                    }
                }}
                onInputValueChange={(inputValue) => {
                    setQuery(inputValue)
                    setOpen(true)
                }}
                onOpenChange={setOpen}
                itemToStringValue={(feature) => feature.properties.name}
            >
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                    <ComboboxInput
                        placeholder="Cari tempat, event, atau gathering..."
                        className={cn(
                            "h-11 w-full rounded-full border-0",
                            "bg-background/95 pl-10 pr-10 shadow-lg",
                            "backdrop-blur-md focus-visible:ring-2"
                        )}
                    />

                    {query && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1.5 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full"
                            onClick={handleClear}
                        >
                            <X className="size-4" />
                        </Button>
                    )}
                </div>

                <ComboboxContent className="w-(--anchor-width)">
                    <ComboboxEmpty>
                        Tidak ada hasil
                    </ComboboxEmpty>

                    <ComboboxList>
                        {(feature) => (
                            <ComboboxItem
                                key={feature.properties.id}
                                value={feature}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {feature.properties.name}
                                    </span>

                                    <span className="text-xs text-muted-foreground capitalize">
                                        {feature.properties.category
                                            ?.replace(/_/g, " ")
                                            .toLowerCase() ?? "Tempat"}
                                    </span>
                                </div>
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    )
}

