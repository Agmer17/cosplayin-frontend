
"use client"

import { useQuery } from "@tanstack/react-query"

import { EventPlaceApi } from "@/features/eventplace/api/event-place-api"
import { FindBoxDTO } from "@/lib/type/event-place"
import { useDebounce } from "@/hooks/use-debounce"

interface Bounds {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}

export const eventPlaceKeys = {
  all: ["event-places"] as const,

  box: (bbox: Bounds) =>
    [...eventPlaceKeys.all, "box", bbox] as const,
}

export function useEventPlaces(bounds: Bounds | null) {
  const debouncedBounds = useDebounce(bounds, 400)

  return useQuery({
    queryKey: debouncedBounds
      ? eventPlaceKeys.box(debouncedBounds)
      : eventPlaceKeys.all,

    queryFn: async (): Promise<FindBoxDTO> => {
      if (!debouncedBounds) {
        return {
          type: "FeatureCollection",
          features: [],
        }
      }

      return await EventPlaceApi.findPointInBox({
        params: {
          minLng: debouncedBounds.minLng,
          minLat: debouncedBounds.minLat,
          maxLng: debouncedBounds.maxLng,
          maxLat: debouncedBounds.maxLat,
        },
      })
    },

    enabled: debouncedBounds !== null,
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  })
}
