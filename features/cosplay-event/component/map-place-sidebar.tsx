"use client"
import Link from "next/link"
import {
    ArrowLeft,
    Clock,
    MapPin,
    SearchX,
    X,
    type LucideIcon,
} from "lucide-react"

import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/lib/responsive_util"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cosplayEventRoutes } from "@/features/cosplay-event/util/page-routes-util"
import { MapPlace } from "@/lib/type/event-place"

type SearchModeProps = {
    mode: "search"
    query: string
    results: MapPlace[]
}

type PlaceModeProps = {
    mode: "place"
    place: MapPlace | null
    fromQuery?: string
}

export type MapPlaceSidebarProps = SearchModeProps | PlaceModeProps

interface PanelHeaderProps {
    backHref: string
    backLabel: string
    icon: LucideIcon
    title: string
    subtitle?: string
}

function PanelHeader({
    backHref,
    backLabel,
    icon: Icon,
    title,
    subtitle,
}: PanelHeaderProps) {
    return (
        <div className="
            flex min-h-[4.25rem] shrink-0 items-center
            gap-2 border-b border-border/70
            px-3 py-2
        ">
            <Link
                href={backHref}
                aria-label={backLabel}
                className="
                    flex size-9 shrink-0 items-center justify-center
                    rounded-full text-foreground
                    transition-colors hover:bg-accent
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-ring
                "
            >
                <Icon className="size-[18px]" strokeWidth={2} />
            </Link>

            <div className="min-w-0 flex-1">
                <h2 className="
                    truncate text-[15px] font-semibold
                    leading-tight text-card-foreground
                ">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    )
}

interface EmptyStateProps {
    title: string
    description: string
}

function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="
            flex flex-col items-center justify-center
            gap-3 px-6 py-12 text-center
        ">
            <div className="
                flex size-12 items-center justify-center
                rounded-full bg-muted
            ">
                <SearchX className="size-5 text-muted-foreground" />
            </div>

            <div className="space-y-1">
                <p className="text-sm font-semibold text-card-foreground">
                    {title}
                </p>

                <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>

            <Link
                href={cosplayEventRoutes.base}
                className="
                    mt-1 inline-flex h-9 items-center
                    rounded-full border border-border
                    bg-background px-4 text-sm font-medium
                    transition-colors hover:bg-accent
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-ring
                "
            >
                Kembali ke peta
            </Link>
        </div>
    )
}

interface PlaceListItemProps {
    place: MapPlace
    query: string
}

function PlaceListItem({ place, query }: PlaceListItemProps) {
    return (
        <li>
            <Link
                href={cosplayEventRoutes.place(place.id, query)}
                className="
                    group block space-y-2
                    px-4 py-3.5
                    transition-colors
                    hover:bg-accent/60
                    focus-visible:bg-accent/60
                    focus-visible:outline-none
                "
            >
                {/* Place name */}
                <h3 className="
                    text-sm font-semibold leading-snug
                    text-card-foreground
                    transition-colors
                    group-hover:text-primary
                ">
                    {place.name}
                </h3>

                {/* Category and schedule */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Badge
                        variant="secondary"
                        className="
                            h-5 rounded-full px-2
                            text-[11px] font-medium
                        "
                    >
                        {place.category}
                    </Badge>

                    {place.schedule && (
                        <span className="
                            inline-flex items-center gap-1
                            text-xs text-muted-foreground
                        ">
                            <Clock className="size-3 shrink-0" />
                            {place.schedule}
                        </span>
                    )}
                </div>

                {/* Address */}
                <p className="
                    flex items-start gap-1.5
                    text-[13px] leading-relaxed
                    text-muted-foreground
                ">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />
                    <span>{place.address}</span>
                </p>

                {/* Description */}
                {place.description && (
                    <p className="
                        line-clamp-2 text-xs leading-relaxed
                        text-muted-foreground/80
                    ">
                        {place.description}
                    </p>
                )}
            </Link>
        </li>
    )
}

function PlaceDetail({ place }: { place: MapPlace }) {
    return (
        <div className="divide-y divide-border/70">
            {/* Place information */}
            <section className="space-y-2 px-4 py-4">
                <h3 className="
                    text-xl font-semibold leading-snug
                    text-card-foreground
                ">
                    {place.name}
                </h3>

                <Badge
                    variant="secondary"
                    className="h-5 rounded-full px-2 text-xs"
                >
                    {place.category}
                </Badge>
            </section>

            {/* Address and schedule */}
            <section className="space-y-3 px-4 py-4">
                <div className="flex items-start gap-3 text-sm">
                    <MapPin className="
                        mt-0.5 size-4 shrink-0 text-muted-foreground
                    " />
                    <p className="leading-relaxed text-card-foreground">
                        {place.address}
                    </p>
                </div>

                {place.schedule && (
                    <div className="flex items-start gap-3 text-sm">
                        <Clock className="
                            mt-0.5 size-4 shrink-0 text-muted-foreground
                        " />
                        <p className="leading-relaxed text-card-foreground">
                            {place.schedule}
                        </p>
                    </div>
                )}
            </section>

            {/* Description */}
            {place.description && (
                <section className="px-4 py-4">
                    <p className="
                        text-sm leading-relaxed
                        text-muted-foreground
                    ">
                        {place.description}
                    </p>
                </section>
            )}

            {/* Tags */}
            {place.tags && place.tags.length > 0 && (
                <section className="flex flex-wrap gap-2 px-4 py-4">
                    {place.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full px-3 py-1 text-xs"
                        >
                            {tag}
                        </Badge>
                    ))}
                </section>
            )}
        </div>
    )
}

function SearchPanel({
    query,
    results,
}: Omit<SearchModeProps, "mode">) {
    return (
        <>
            <PanelHeader
                backHref={cosplayEventRoutes.base}
                backLabel="Tutup hasil pencarian"
                icon={X}
                title={`Hasil untuk "${query}"`}
                subtitle={`${results.length} tempat ditemukan`}
            />

            <ScrollArea className="min-h-0 flex-1">
                {results.length === 0 ? (
                    <EmptyState
                        title="Tidak ada hasil"
                        description={`
                            Tidak ada tempat yang cocok dengan "${query}".
                            Coba kata kunci lain, misalnya "event" atau "Kumpul".
                        `}
                    />
                ) : (
                    <ul className="divide-y divide-border/70">
                        {results.map((place) => (
                            <PlaceListItem
                                key={place.id}
                                place={place}
                                query={query}
                            />
                        ))}
                    </ul>
                )}
            </ScrollArea>
        </>
    )
}

function PlacePanel({
    place,
    fromQuery,
}: Omit<PlaceModeProps, "mode">) {
    const backHref = fromQuery
        ? cosplayEventRoutes.search(fromQuery)
        : cosplayEventRoutes.base

    const backLabel = fromQuery
        ? "Kembali ke hasil pencarian"
        : "Kembali ke peta"

    return (
        <>
            <PanelHeader
                backHref={backHref}
                backLabel={backLabel}
                icon={ArrowLeft}
                title={place ? place.name : "Tempat tidak ditemukan"}
                subtitle={place?.category}
            />

            <ScrollArea className="min-h-0 flex-1">
                {place ? (
                    <PlaceDetail place={place} />
                ) : (
                    <EmptyState
                        title="Tempat tidak ditemukan"
                        description="
                            Tempat ini mungkin sudah dihapus atau tautannya salah.
                        "
                    />
                )}
            </ScrollArea>
        </>
    )
}


export default function MapPlaceSidebar(props: MapPlaceSidebarProps) {
    const isMobile = useIsMobile()

    const panel = props.mode === "search" ? (
        <SearchPanel
            query={props.query}
            results={props.results}
        />
    ) : (
        <PlacePanel
            place={props.place}
            fromQuery={props.fromQuery}
        />
    )

    if (isMobile) {
        return (
            <Drawer open modal={false}>
                <DrawerContent
                    className="
                        h-[65%]
                        gap-0 overflow-hidden
                        rounded-t-2xl
                        border-border bg-card p-0
                    "
                >
                    {panel}
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <aside
            aria-label="Panel informasi tempat"
            className="
                absolute inset-x-auto bottom-4 left-4
                top-20 z-20
                w-[30%]
            "
        >
            <Card
                className="
                    flex h-full flex-col gap-0
                    overflow-hidden rounded-xl
                    border border-border bg-card p-0
                    shadow-xl
                "
            >
                {panel}
            </Card>
        </aside>
    )
}
