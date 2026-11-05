
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import MapPlaceSidebar from "@/features/cosplay-event/component/map-place-sidebar"

import {
    cosplayEventRoutes,
    safeDecode,
} from "@/features/cosplay-event/util/page-routes-util"

import {
    searchPlaces,
    JABODETABEK_BOUNDS,
} from "@/features/cosplay-event/util/place-search-util"

import { useMapEventStore } from "@/lib/store/map-event-store"

import type { CosplayEventResponseDTO } from "@/lib/type/event-place"

export default function SearchPage() {
    const router = useRouter()
    const params = useParams<{ query: string }>()

    const query = safeDecode(params.query).trim()

    const setEvents = useMapEventStore((state) => state.setEvents)

    const [results, setResults] = useState<CosplayEventResponseDTO[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!query) {
            setEvents([])
            router.replace(cosplayEventRoutes.base)
            return
        }

        let cancelled = false

        async function fetchEvents() {
            setIsLoading(true)
            setError(null)

            setEvents([])
            setResults([])

            try {
                const events = await searchPlaces({
                    ...JABODETABEK_BOUNDS,
                    title: query,
                })

                if (cancelled) return

                setResults(events)

                setEvents(events)
            } catch (err) {
                if (cancelled) return

                console.error("[SEARCH EVENT ERROR]", err)

                setError(
                    err instanceof Error
                        ? err.message
                        : "Terjadi kesalahan saat mencari event."
                )

                setResults([])
                setEvents([])
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        fetchEvents()

        return () => {
            cancelled = true
        }
    }, [query, router, setEvents])

    return (
        <MapPlaceSidebar
            mode="search"
            query={query}
            results={results}
            isLoading={isLoading}
            error={error}
        />
    )
}
