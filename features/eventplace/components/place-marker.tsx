// src/features/event-map/components/place-marker.tsx
"use client"

import { Marker } from "@vis.gl/react-maplibre"
import {
    Building2,
    Coffee,
    MapPin,
    Croissant,
    ShoppingBag,
    Leaf,
} from "lucide-react"
import { PlaceFeatureDTO } from "@/lib/type/event-place"
import { cn } from "@/lib/utils"
const CATEGORY_ICON: Record<string, React.ElementType> = {
    bakery: Croissant,
    coffee: Coffee,
    mall: Building2,
    convenience: ShoppingBag,
    tea: Leaf,
}

const CATEGORY_COLOR: Record<string, string> = {
    bakery: "bg-amber-600",
    coffee: "bg-orange-700",
    mall: "bg-blue-500",
    convenience: "bg-emerald-500",
    tea: "bg-green-600",
}

interface PlaceMarkerProps {
    feature: PlaceFeatureDTO
    selected?: boolean
    onClick: (feature: PlaceFeatureDTO) => void
}

export function PlaceMarker({ feature, selected, onClick }: PlaceMarkerProps) {
    const [lng, lat] = feature.geometry.coordinates
    const Icon = CATEGORY_ICON[feature.properties.category] ?? MapPin
    const color =
        CATEGORY_COLOR[feature.properties.category] ?? "bg-primary"

    return (
        <Marker
            longitude={lng}
            latitude={lat}
            anchor="bottom"
            onClick={(e) => {
                e.originalEvent.stopPropagation()
                onClick(feature)
            }}
        >
            <button
                type="button"
                className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110",
                    color,
                    selected && "scale-125 ring-2 ring-offset-2 ring-primary"
                )}
                aria-label={feature.properties.name}
            >
                <Icon className="size-4 text-white" strokeWidth={2.5} />
            </button>
        </Marker>
    )
}