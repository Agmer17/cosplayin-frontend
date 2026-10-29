import { RequestOptions } from "@/lib/api/api"
import { clientApi } from "@/lib/api/client-api"
import { PlaceFeatureDTO } from "@/lib/type/event-place"

export const EventPlaceApi = {
  findPointInBox: (params: RequestOptions) =>
    clientApi.get<PlaceFeatureDTO>("/event-places", params),
}
