"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"

import MapPlaceSidebar from "@/features/cosplay-event/component/map-place-sidebar"

import { safeDecode } from "@/features/cosplay-event/util/page-routes-util"

import {
    getPlaceById,
    JABODETABEK_BOUNDS,
} from "@/features/cosplay-event/util/place-search-util"

import { useMapEventStore } from "@/lib/store/map-event-store"

import type { CosplayEventResponseDTO } from "@/lib/type/event-place"

type PlaceResult = {
    id: string
    place: CosplayEventResponseDTO | null
}

export default function PlacePage() {
    const params = useParams<{ id: string }>()
    const searchParams = useSearchParams()

    const id = safeDecode(params.id)
    const q = searchParams.get("q")

    const fromQuery = q?.trim() ? safeDecode(q) : undefined

    const setEvents = useMapEventStore((state) => state.setEvents)

    const [result, setResult] = useState<PlaceResult | null>(null)

    useEffect(() => {
        if (!id) {
            setEvents([])
            return
        }

        let cancelled = false

        async function fetchPlace() {
            try {
                const place = await getPlaceById(id, JABODETABEK_BOUNDS)

                if (cancelled) return

                setResult({ id, place })

                setEvents(place ? [place] : [])
            } catch (error) {
                if (cancelled) return

                console.error("[GET EVENT DETAIL ERROR]", error)

                setResult({ id, place: null })
                setEvents([])
            }
        }

        fetchPlace()

        return () => {
            cancelled = true
        }
    }, [id, setEvents])

    // Derived state: hasil dianggap valid hanya kalau id-nya cocok
    const isCurrent = !!id && result?.id === id
    const place = isCurrent ? result.place : null
    const isLoading = !!id && !isCurrent

    return (
        <MapPlaceSidebar
            mode="place"
            place={place}
            fromQuery={fromQuery}
            isLoading={isLoading}
        />
    )
}