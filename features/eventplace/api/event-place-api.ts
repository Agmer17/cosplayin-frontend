import { RequestOptions } from "@/lib/api/api"
import { clientApi } from "@/lib/api/client-api"
import { FindBoxDTO } from "@/lib/type/event-place"

export const EventPlaceApi = {
  findPointInBox: (params: RequestOptions) =>
    clientApi.get<FindBoxDTO>("/event-places", params),
}
