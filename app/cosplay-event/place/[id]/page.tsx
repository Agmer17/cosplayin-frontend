import MapPlaceSidebar from "@/features/cosplay-event/component/map-place-sidebar"
import { safeDecode } from "@/features/cosplay-event/util/page-routes-util"
import { getPlaceById } from "@/features/cosplay-event/util/place-search-util"

interface PlacePageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ q?: string | string[] }>
}

export default async function PlacePage({ params, searchParams }: PlacePageProps) {
    const { id } = await params
    const { q } = await searchParams

    const place = getPlaceById(safeDecode(id))
    const fromQuery = typeof q === "string" && q.trim() ? q : undefined

    return <MapPlaceSidebar mode="place" place={place} fromQuery={fromQuery} />
}