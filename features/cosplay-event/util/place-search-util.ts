
import { MapPlace, MOCK_PLACES } from "@/lib/type/event-place"

// Case-insensitive. Setiap kata pada query harus cocok di salah satu field:
// nama, kategori, alamat, deskripsi, atau tag.
export function searchPlaces(query: string): MapPlace[] {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return []

    return MOCK_PLACES.filter((place) => {
        const haystack = [
            place.name,
            place.category,
            place.address,
            place.description,
            ...(place.tags ?? []),
        ]
            .join(" ")
            .toLowerCase()

        return tokens.every((token) => haystack.includes(token))
    })
}

export function getPlaceById(id: string): MapPlace | null {
    return MOCK_PLACES.find((place) => place.id === id) ?? null
}