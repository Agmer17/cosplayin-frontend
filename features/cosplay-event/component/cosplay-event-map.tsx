"use client"

import { Suspense, type ReactNode } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import { setWorkerUrl } from "maplibre-gl"
import { Map } from "@vis.gl/react-maplibre"
import MapNavigation from "@/features/cosplay-event/component/map-navigation"
import MapSearchBar from "@/features/cosplay-event/component/map-search-bar"

if (typeof window !== "undefined") {
    setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")
}

const initViewState = {
    longitude: 106.799566,
    latitude: -6.597629,
    zoom: 16,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
}

interface CosplayEventMapProps {
    children?: ReactNode
}

export default function CosplayEventMap({ children }: CosplayEventMapProps) {
    return (
        <div className="relative isolate h-dvh w-full overflow-hidden">
            {/* Layer 0: map */}
            <div className="absolute inset-0 z-0">
                <Map
                    initialViewState={initViewState}
                    maxBounds={[106.30, -6.80, 107.20, -5.90]}
                    minZoom={10}
                    maxZoom={20}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"
                >
                    <MapNavigation />
                </Map>
            </div>

            {/* Layer 30: search bar (Suspense wajib karena memakai useSearchParams) */}
            <Suspense fallback={null}>
                <MapSearchBar />
            </Suspense>

            {/* Layer 20: sidebar dari route aktif (absolute, mengatur posisinya sendiri) */}
            {children}
        </div>
    )
}