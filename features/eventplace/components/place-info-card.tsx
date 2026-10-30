
"use client"
import { X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaceFeatureDTO } from "@/lib/type/event-place"
import { cn } from "@/lib/utils"


interface PlaceInfoCardProps {
    feature: PlaceFeatureDTO
    onClose: () => void
    className?: string
}


export function PlaceInfoCard({
    feature,
    onClose,
    className,
}: PlaceInfoCardProps) {
    const [lng, lat] = feature.geometry.coordinates
    const categoryLabel = feature.properties.category
        .replace(/_/g, " ")
        .toLowerCase()


    return (
        <Card
            className={cn(
                "w-full max-w-sm border-0 bg-background/95 shadow-xl backdrop-blur-md",
                className
            )}
        >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base leading-tight">
                        {feature.properties.name}
                    </CardTitle>
                    <Badge variant="secondary" className="capitalize">
                        {categoryLabel}
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 rounded-full"
                    onClick={onClose}
                >
                    <X className="size-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    <span>
                        {lat.toFixed(5)}, {lng.toFixed(5)}
                    </span>
                </div>
                {/* Tombol detail hanya ditampilkan jika route/detail sudah tersedia di proyek.
            Saat ini tidak diasumsikan ada endpoint detail. */}
            </CardContent>
        </Card>
    )
}