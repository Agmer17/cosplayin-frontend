"use client"

import { Marker } from "@vis.gl/react-maplibre"
import { CalendarDays } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { useMapEventStore } from "@/lib/store/map-event-store"
import {
    cosplayEventRoutes,
    safeDecode,
    SEARCH_PREFIX,
} from "../util/page-routes-util"

export default function MapEventMarkers() {
    const events = useMapEventStore((state) => state.events)

    const router = useRouter()
    const pathname = usePathname()

    const fromQuery = pathname.startsWith(SEARCH_PREFIX)
        ? safeDecode(pathname.slice(SEARCH_PREFIX.length)).trim()
        : undefined

    const validEvents = events.flatMap((event) => {
        const { latitude, longitude } = event.location

        if (
            latitude == null ||
            longitude == null ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return []
        }

        return [{ event, latitude, longitude }]
    })

    return (
        <>
            {validEvents.map(({ event, latitude, longitude }) => (
                <Marker
                    key={event.id}
                    longitude={longitude}
                    latitude={latitude}
                    anchor="bottom"
                    onClick={() => {
                        router.push(
                            cosplayEventRoutes.place(event.id, fromQuery)
                        )
                    }}
                >
                    <button
                        type="button"
                        title={event.title}
                        aria-label={`Lihat event ${event.title}`}
                        className="
                            group relative flex h-17 w-14
                            cursor-pointer items-start justify-center
                            outline-none
                        "
                    >
                        {/* Ujung marker */}
                        <span
                            aria-hidden="true"
                            className="
                                absolute bottom-0 left-1/2 z-0
                                size-4 -translate-x-1/2 rotate-45
                                rounded-[3px] bg-white shadow-md
                            "
                        />

                        {/* Gambar event */}
                        <span
                            className="
                                relative z-10 flex size-14 shrink-0
                                items-center justify-center overflow-hidden
                                rounded-full border-[3px] border-white
                                bg-muted shadow-lg ring-1 ring-black/10
                                transition-transform
                                group-hover:scale-110
                                group-focus-visible:scale-110
                            "
                        >
                            {/* Fallback kalau event tidak memiliki gambar */}
                            <span className="
                                absolute inset-0 flex items-center
                                justify-center text-muted-foreground
                            ">
                                <CalendarDays className="size-6" />
                            </span>

                            {event.media_url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={event.media_url}
                                    alt={event.title}
                                    loading="lazy"
                                    draggable={false}
                                    onError={(e) => e.currentTarget.remove()}
                                    className="
                                        relative z-10 size-full
                                        object-cover
                                    "
                                />
                            )}
                        </span>
                    </button>
                </Marker>
            ))}
        </>
    )
}