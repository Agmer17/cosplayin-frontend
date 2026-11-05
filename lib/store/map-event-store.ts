import { create } from "zustand"

import type { CosplayEventResponseDTO } from "@/lib/type/event-place"

interface MapEventState {
    events: CosplayEventResponseDTO[]

    setEvents: (events: CosplayEventResponseDTO[]) => void
    clearEvents: () => void
}

export const useMapEventStore = create<MapEventState>()((set) => ({
    events: [],

    setEvents: (events) => set({ events }),

    clearEvents: () => set({ events: [] }),
}))