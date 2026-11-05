"use client"

import { useEffect } from "react"
import { useMap } from "@vis.gl/react-maplibre"
import { LngLatBounds } from "maplibre-gl"

import { useMapEventStore } from "@/lib/store/map-event-store"
import { JABODETABEK_BOUNDS } from "../util/place-search-util"

const { minLon, maxLon, minLat, maxLat } = JABODETABEK_BOUNDS

const FIT_PADDING = { top: 120, bottom: 60, left: 60, right: 60 } // top lebih besar karena ada search bar

export default function MapAutoFit() {
    const { current: map } = useMap()
    const events = useMapEventStore((state) => state.events)

    useEffect(() => {
        if (!map) return

        // Hanya marker yang punya koordinat valid dan di dalam Jabodetabek
        const points = events.flatMap((e) => {
            const { latitude, longitude } = e.location

            if (
                latitude == null ||
                longitude == null ||
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                longitude < minLon ||
                longitude > maxLon ||
                latitude < minLat ||
                latitude > maxLat
            ) {
                return []
            }

            return [{ latitude, longitude }]
        })

        // Kosong: biarkan posisi/zoom saat ini (default saat init)
        if (points.length === 0) return

        if (points.length === 1) {
            map.flyTo({
                center: [points[0].longitude, points[0].latitude],
                zoom: 15,
                duration: 1200,
                essential: true,
            })
            return
        }

        const bounds = new LngLatBounds()
        points.forEach((p) => bounds.extend([p.longitude, p.latitude]))

        map.fitBounds(bounds, {
            padding: FIT_PADDING,
            maxZoom: 16, // supaya marker yang berdekatan tidak zoom terlalu dalam
            duration: 1200,
            essential: true,
        })
    }, [events, map])

    return null
}