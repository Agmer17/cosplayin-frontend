import { clientApi } from "@/lib/api/client-api"


import { RequestOptions } from "@/lib/api/api"
import { CosplayEventResponseDTO, SearchEventParams } from "@/lib/type/event-place"

export const CosplayEventApi = {
  searchEvent: (params: SearchEventParams, options?: RequestOptions) =>
    clientApi.get<CosplayEventResponseDTO[]>("/cosplay-event/map", {
      ...options,
      params: {
        minLon: params.minLon,
        minLat: params.minLat,
        maxLon: params.maxLon,
        maxLat: params.maxLat,
        title: params.title,
      },
    }),
}