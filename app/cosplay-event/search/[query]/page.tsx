import { redirect, RedirectType } from "next/navigation"
import MapPlaceSidebar from "@/features/cosplay-event/component/map-place-sidebar"
import { cosplayEventRoutes, safeDecode } from "@/features/cosplay-event/util/page-routes-util"
import { searchPlaces } from "@/features/cosplay-event/util/place-search-util"

interface SearchPageProps {
    params: Promise<{ query: string }>
}

export default async function SearchPage({ params }: SearchPageProps) {
    const { query: rawQuery } = await params
    const query = safeDecode(rawQuery)
    const results = searchPlaces(query)


    if (results.length === 1) {
        redirect(cosplayEventRoutes.place(results[0].id), RedirectType.replace)
    }

    return <MapPlaceSidebar mode="search" query={query} results={results} />
}