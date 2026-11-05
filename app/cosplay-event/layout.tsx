import type { ReactNode } from "react"
import CosplayEventMap from "@/features/cosplay-event/component/cosplay-event-map"

export default function CosplayEventLayout({ children }: { children: ReactNode }) {
    return (
        <CosplayEventMap>{children}</CosplayEventMap>)
}