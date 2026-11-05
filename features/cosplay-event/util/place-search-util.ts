import type {
    CosplayEventResponseDTO,
    SearchEventParams,
} from "@/lib/type/event-place"

import { CosplayEventApi } from "../api/cosplay-event-api"

export const JABODETABEK_BOUNDS: Omit<SearchEventParams, "title"> = {
    minLon: 106.4,
    minLat: -6.8,
    maxLon: 107.2,
    maxLat: -5.8,
}

export async function searchPlaces(
    params: SearchEventParams
): Promise<CosplayEventResponseDTO[]> {
    return CosplayEventApi.searchEvent(params)
}

export async function getPlaceById(
    id: string,
    params: Omit<SearchEventParams, "title">
): Promise<CosplayEventResponseDTO | null> {
    const events = await searchPlaces(params)

    return events.find((event) => event.id === id) ?? null
}