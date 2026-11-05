"use client"

import { Suspense, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

import HomeLayout from "@/features/home/component/desktop/home-layout"


import "maplibre-gl/dist/maplibre-gl.css"
import { setWorkerUrl } from "maplibre-gl"
import { Map } from "@vis.gl/react-maplibre"

import MapNavigation from "@/features/cosplay-event/component/map-navigation"
import MapSearchBar from "@/features/cosplay-event/component/map-search-bar"
import MapEventMarkers from "@/features/cosplay-event/component/map-event-marker"

import { useMapEventStore } from "@/lib/store/map-event-store"
import { searchPlaces, JABODETABEK_BOUNDS } from "@/features/cosplay-event/util/place-search-util"
import { COSPLAY_EVENT_BASE } from "@/features/cosplay-event/util/page-routes-util"
import MapAutoFit from "./map-auto-fit"
import { useIsMobile } from "@/lib/responsive_util"

if (typeof window !== "undefined") {
    setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")
}

const initViewState = {
    longitude: 106.799566,
    latitude: -6.597629,
    zoom: 16,
    bearing: 0,
    pitch: 0,
    padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
}

interface CosplayEventMapProps {
    children?: ReactNode
}

export default function CosplayEventMap({
    children,
}: CosplayEventMapProps) {

    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <HomeLayout>
                <CosplayEventMapContent>
                    {children}
                </CosplayEventMapContent>
            </HomeLayout>
        )
    }

    return (
        <CosplayEventMapContent>
            {children}
        </CosplayEventMapContent>
    )
}

function CosplayEventMapContent({
    children,
}: CosplayEventMapProps) {
    const pathname = usePathname()
    const setEvents = useMapEventStore((state) => state.setEvents)

    useEffect(() => {
        const isMapHome =
            pathname === COSPLAY_EVENT_BASE ||
            pathname === `${COSPLAY_EVENT_BASE}/`

        if (!isMapHome) return

        let cancelled = false

        setEvents([])

        async function fetchInitialEvents() {
            try {
                const events = await searchPlaces(JABODETABEK_BOUNDS)

                if (cancelled) return

                setEvents(events)
            } catch (error) {
                if (cancelled) return

                console.error("[GET MAP EVENTS ERROR]", error)
                setEvents([])
            }
        }

        fetchInitialEvents()

        return () => {
            cancelled = true
        }
    }, [pathname, setEvents])

    return (
        <div className="relative isolate h-dvh w-full overflow-hidden">
            {/* Layer 0: Map */}
            <div className="absolute inset-0 z-0">
                <Map
                    initialViewState={initViewState}
                    maxBounds={[JABODETABEK_BOUNDS.minLon, JABODETABEK_BOUNDS.minLat, JABODETABEK_BOUNDS.maxLon, JABODETABEK_BOUNDS.maxLat]}
                    minZoom={10}
                    maxZoom={20}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"
                >
                    <MapNavigation onEventsLoaded={(data) => setEvents(data)} />
                    <MapAutoFit />
                    <MapEventMarkers />
                </Map>
            </div>

            <Suspense fallback={null}>
                <MapSearchBar />
            </Suspense>

            {children}
        </div>
    )
}