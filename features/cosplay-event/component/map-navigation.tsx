"use client"

import { useCallback, useRef, useState } from "react"
import { NavigationControl } from "@vis.gl/react-maplibre"
import { LocateFixed, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/lib/responsive_util"
import { searchPlaces } from "../util/place-search-util"

const SEARCH_RADIUS_KM = 10
const KM_PER_DEGREE = 111.32

type SearchBounds = {
    minLon: number
    minLat: number
    maxLon: number
    maxLat: number
}

type SearchEventResult = Awaited<ReturnType<typeof searchPlaces>>

interface MapNavigationProps {
    onEventsLoaded: (events: SearchEventResult) => void
}

export default function MapNavigation({
    onEventsLoaded,
}: MapNavigationProps) {
    const isMobile = useIsMobile()
    const [isSearching, setIsSearching] = useState(false)

    const lastFetchedArea = useRef<string | null>(null)

    const fetchEvents = useCallback(
        async (bounds: SearchBounds, force = false) => {
            const areaKey = [
                bounds.minLon,
                bounds.minLat,
                bounds.maxLon,
                bounds.maxLat,
            ].join(",")

            if (!force && lastFetchedArea.current === areaKey) {
                return
            }

            lastFetchedArea.current = areaKey

            try {
                const events = await searchPlaces(bounds)
                onEventsLoaded(events)
            } catch (error) {
                lastFetchedArea.current = null

                console.error("Failed to fetch events:", error)
                toast.error("Gagal mengambil data event")
            }
        },
        [onEventsLoaded]
    )

    const handleFindNearestEvents = () => {
        if (!navigator.geolocation) {
            toast.error("Browser tidak mendukung akses lokasi")
            return
        }

        setIsSearching(true)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords

                    const latDelta = SEARCH_RADIUS_KM / KM_PER_DEGREE

                    const lonDelta =
                        SEARCH_RADIUS_KM /
                        (KM_PER_DEGREE * Math.cos((latitude * Math.PI) / 180))

                    const bounds: SearchBounds = {
                        minLon: longitude - lonDelta,
                        minLat: latitude - latDelta,
                        maxLon: longitude + lonDelta,
                        maxLat: latitude + latDelta,
                    }

                    await fetchEvents(bounds, true)
                } finally {
                    setIsSearching(false)
                }
            },
            (error) => {
                console.error("Geolocation error:", error)

                const errorMessages: Record<number, string> = {
                    1: "Tolong izinkan akses lokasi terlebih dahulu",
                    2: "Lokasi pengguna tidak dapat ditemukan",
                    3: "Waktu pengambilan lokasi habis",
                }

                toast.warning(
                    errorMessages[error.code] ??
                    "Gagal mendapatkan lokasi pengguna",
                    {
                        position: isMobile ? "bottom-right" : "top-right",
                    }
                )

                setIsSearching(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    }

    return (
        <div>
            {!isMobile && (
                <NavigationControl
                    position="bottom-right"
                    showCompass={false}
                    showZoom={true}
                    style={{
                        marginRight: 12,
                        marginBottom: 24,
                    }}
                />
            )}

            <div
                className="absolute z-10"
                style={{
                    right: 5,
                    bottom: isMobile ? 80 : 150,
                }}
            >
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleFindNearestEvents}
                    disabled={isSearching}
                    title="Cari event cosplay dalam radius 10 km"
                    aria-label="Cari event cosplay terdekat"
                    className="
                        h-12 w-12 rounded-full
                        border border-border
                        bg-background text-foreground
                        shadow-lg shadow-black/20
                        transition-all duration-200
                        hover:bg-accent hover:text-accent-foreground
                        active:scale-95
                        disabled:opacity-70
                    "
                >
                    {isSearching ? (
                        <LoaderCircle className="size-5 animate-spin" />
                    ) : (
                        <LocateFixed className="size-5" />
                    )}
                </Button>
            </div>
        </div>
    )
}