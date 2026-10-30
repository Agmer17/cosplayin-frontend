// src/app/(main)/event-map/page.tsx   ← sesuaikan path
"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { Map, type MapRef, type ViewStateChangeEvent } from "@vis.gl/react-maplibre"
import { setWorkerUrl } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { useEventPlaces } from "@/features/eventplace/hooks/cosplay-event-hooks"
import { MapSearchBar } from "@/features/eventplace/components/map-search-bar"
import {
    CategoryFilters,
    type CategoryFilterValue,
} from "@/features/eventplace/components/category-filters"
import { MapControls } from "@/features/eventplace/components/map-control"
import { PlaceMarker } from "@/features/eventplace/components/place-marker"
import { PlaceInfoCard } from "@/features/eventplace/components/place-info-card"
import { PlaceFeatureDTO } from "@/lib/type/event-place"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

if (typeof window !== "undefined") {
    setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")
}

const INITIAL_VIEW = {
    longitude: 106.8272,
    latitude: -6.1754,
    zoom: 15,
}

export default function CosplayEventMapPage() {


    const mapRef = useRef<MapRef>(null)
    const [bounds, setBounds] = useState<{
        minLng: number
        minLat: number
        maxLng: number
        maxLat: number
    } | null>(null)
    const [category, setCategory] = useState<CategoryFilterValue>("nongkrong")
    const [selected, setSelected] = useState<PlaceFeatureDTO | null>(null)

    const { data, isLoading, isError, error, isFetching } = useEventPlaces(bounds)

    // Kategori yang termasuk "Tempat Nongkrong" (selain mall)
    const HANGOUT_PLACE = ["bakery", "coffee", "cafe", "tea", "convenience"]

    const features = useMemo(() => {
        const list = data?.features ?? []

        if (category === "event") {
            // TODO: ganti dengan data event aktif dari backend nanti
            return [] // dummy kosong dulu
        }

        if (category === "mall") {
            return list.filter(
                (f) => (f.properties.category ?? "").toLowerCase() === "mall"
            )
        }

        if (category === "nongkrong") {
            return list.filter((f) =>
                HANGOUT_PLACE.includes(
                    (f.properties.category ?? "").toLowerCase()
                )
            )
        }

        return list
    }, [data, category])

    const handleMoveEnd = useCallback((e: ViewStateChangeEvent) => {
        const b = e.target.getBounds()
        setBounds({
            minLng: b.getWest(),
            minLat: b.getSouth(),
            maxLng: b.getEast(),
            maxLat: b.getNorth(),
        })
    }, [])

    const handleSelectPlace = useCallback((feature: PlaceFeatureDTO) => {
        setSelected(feature)
        const [lng, lat] = feature.geometry.coordinates
        mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: Math.max(mapRef.current.getZoom(), 14),
            duration: 800,
        })
    }, [])

    const handleZoomIn = () => {
        mapRef.current?.zoomIn({ duration: 300 })
    }
    const handleZoomOut = () => {
        mapRef.current?.zoomOut({ duration: 300 })
    }
    const handleReset = () => {
        mapRef.current?.flyTo({ ...INITIAL_VIEW, duration: 1000 })
        setSelected(null)
    }
    const handleLocate = () => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                mapRef.current?.flyTo({
                    center: [pos.coords.longitude, pos.coords.latitude],
                    zoom: 14,
                    duration: 1000,
                })
            },
            () => {
                // silent fail – user can still use map
            },
            { enableHighAccuracy: true, timeout: 8000 }
        )
    }

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Map */}
            <Map
                ref={mapRef}
                initialViewState={INITIAL_VIEW}
                style={{ width: "100%", height: "100%" }}
                mapStyle="https://tiles.openfreemap.org/styles/liberty"
                onMoveEnd={handleMoveEnd}
                onLoad={(e) => {
                    const b = e.target.getBounds()
                    setBounds({
                        minLng: b.getWest(),
                        minLat: b.getSouth(),
                        maxLng: b.getEast(),
                        maxLat: b.getNorth(),
                    })
                }}
                onClick={() => setSelected(null)}
            >
                {features.map((f) => (
                    <PlaceMarker
                        key={f.properties.id}
                        feature={f}
                        selected={selected?.properties.id === f.properties.id}
                        onClick={handleSelectPlace}
                    />
                ))}
            </Map>

            {/* Floating Search + Filters */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-3 sm:p-4">
                <div className="pointer-events-auto flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                    <MapSearchBar
                        features={data?.features ?? []}
                        onSelect={handleSelectPlace}
                        className="w-full sm:max-w-md"
                    />
                </div>
                <div className="pointer-events-auto max-w-full overflow-hidden">
                    <CategoryFilters value={category} onChange={setCategory} />
                </div>
            </div>

            {/* Map Controls */}
            <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-4">
                <MapControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onReset={handleReset}
                    onLocate={handleLocate}
                />
            </div>

            {/* Place Info Card */}
            {selected && (
                <div className="absolute bottom-4 left-3 right-3 z-20 sm:left-4 sm:right-auto sm:w-80">
                    <PlaceInfoCard
                        feature={selected}
                        onClose={() => setSelected(null)}
                    />
                </div>
            )}

            {/* Loading indicator (subtle) */}
            {(isLoading || isFetching) && (
                <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2">
                    <div className="rounded-full bg-background/90 px-4 py-1.5 text-xs font-medium shadow-md backdrop-blur-sm">
                        Memuat lokasi…
                    </div>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className="absolute left-3 right-3 top-24 z-10 sm:left-4 sm:right-auto sm:w-80">
                    <Alert variant="destructive" className="shadow-lg">
                        <AlertCircle className="size-4" />
                        <AlertTitle>Gagal memuat lokasi</AlertTitle>
                        <AlertDescription className="text-xs">
                            {(error as Error)?.message ?? "Periksa koneksi dan coba lagi."}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Empty state when no features in view */}
            {!isLoading && !isError && features.length === 0 && bounds && (
                <div className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-full bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-md backdrop-blur-sm">
                    Tidak ada lokasi di area ini
                </div>
            )}
        </div>
    )
}