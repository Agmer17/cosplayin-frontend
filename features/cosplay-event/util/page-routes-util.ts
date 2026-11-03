export const COSPLAY_EVENT_BASE = "/cosplay-event"
export const SEARCH_PREFIX = `${COSPLAY_EVENT_BASE}/search/`
export const PLACE_PREFIX = `${COSPLAY_EVENT_BASE}/place/`

export const cosplayEventRoutes = {
    base: COSPLAY_EVENT_BASE,

    search: (query: string) => `${SEARCH_PREFIX}${encodeURIComponent(query)}`,

    place: (id: string, fromQuery?: string) => {
        const path = `${PLACE_PREFIX}${encodeURIComponent(id)}`
        return fromQuery ? `${path}?q=${encodeURIComponent(fromQuery)}` : path
    },
}
export function safeDecode(value: string): string {
    try {
        return decodeURIComponent(value)
    } catch {
        return value
    }
}