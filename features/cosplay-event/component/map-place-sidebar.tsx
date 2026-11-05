"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    ExternalLink,
    MapPin,
    SearchX,
    X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/lib/responsive_util"
import { cosplayEventRoutes } from "@/features/cosplay-event/util/page-routes-util"
import { CosplayEventResponseDTO } from "@/lib/type/event-place"

type SearchModeProps = {
    mode: "search"
    query: string
    results: CosplayEventResponseDTO[]
    isLoading?: boolean
    error?: string | null
}

type PlaceModeProps = {
    mode: "place"
    place: CosplayEventResponseDTO | null
    fromQuery?: string
    isLoading?: boolean
}

export type MapPlaceSidebarProps = SearchModeProps | PlaceModeProps

type PanelHeaderProps = {
    backHref: string
    backLabel: string
    icon: typeof ArrowLeft
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
        <header className="flex min-h-16 shrink-0 items-center gap-2 border-b px-3 py-2">
            <Button
                variant="ghost"
                size="icon"
                className="size-10 shrink-0 rounded-full"


            >
                <Link href={backHref} aria-label={backLabel}>
                    <Icon className="size-4.5" strokeWidth={2} />
                </Link>
            </Button>

            <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold leading-tight">{title}</h2>
                {subtitle ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
                ) : null}
            </div>
        </header>
    )
}

function EmptyState({
    title,
    description,
    action,
}: {
    title: string
    description: string
    action?: ReactNode
}) {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <SearchX className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold">{title}</p>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
            {action}
        </div>
    )
}

function EventThumbnail({
    src,
    title,
    className = "",
}: {
    src: string | null | undefined
    title: string
    className?: string
}) {
    const [hasError, setHasError] = useState(false)

    if (!src || hasError) {
        return (
            <div
                aria-label={`Tidak ada gambar untuk ${title}`}
                className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground ${className}`}
            >
                <CalendarDays className="size-6" aria-hidden="true" />
            </div>
        )
    }

    return (
        <div className={`shrink-0 overflow-hidden rounded-lg bg-muted ${className}`}>
            {/* A regular img keeps externally hosted event media independent of next/image config. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={title}
                loading="lazy"
                className="size-full object-cover"
                onError={() => setHasError(true)}
            />
        </div>
    )
}

function formatLocationType(value?: string | null) {
    if (!value?.trim()) return "Lokasi event"

    return value
        .trim()
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase())
}

function parseDate(value?: string | null) {
    if (!value) return null

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(value?: string | null, withTime = true) {
    const date = parseDate(value)
    if (!date) return null

    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        ...(withTime ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" as const } : {}),
    }).format(date)
}

function formatEventSchedule(
    startAt?: string | null,
    endAt?: string | null,
) {
    const start = parseDate(startAt)
    const end = parseDate(endAt)

    if (start && end) {
        const sameDay = start.toDateString() === end.toDateString()

        if (sameDay) {
            const dateLabel = formatDate(startAt, false)
            const startTime = new Intl.DateTimeFormat("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
            }).format(start)
            const endTime = new Intl.DateTimeFormat("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
            }).format(end)

            return `${dateLabel}, ${startTime}–${endTime}`
        }

        return `${formatDate(startAt)} – ${formatDate(endAt)}`
    }

    if (start) return formatDate(startAt)
    if (end) return `Sampai ${formatDate(endAt)}`
    return null
}

function formatCreatedAt(value?: string | null) {
    return formatDate(value)
}

function getSafeExternalUrl(value?: string | null) {
    if (!value?.trim()) return null

    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null
    } catch {
        return null
    }
}

function PlaceListItem({
    event,
    query,
}: {
    event: CosplayEventResponseDTO
    query: string
}) {
    const location = event.location
    const schedule = formatEventSchedule(event.start_at, event.end_at)
    const locationName = location?.name?.trim()
    const address = location?.address?.trim()

    return (
        <li>
            <Link
                href={cosplayEventRoutes.place(event.id, query)}
                className="group flex gap-3 px-4 py-4 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
                <EventThumbnail
                    src={event.media_url}
                    title={event.title}
                    className="size-24 sm:size-28"
                />

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="space-y-1">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                            {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="h-5 rounded-full px-2 text-[11px] font-medium">
                                {formatLocationType(location?.location_type)}
                            </Badge>
                            {locationName ? (
                                <span className="truncate text-xs text-muted-foreground">
                                    {locationName}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {schedule ? (
                        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                            <Clock3 className="mt-0.5 size-3.5 shrink-0" />
                            <span>{schedule}</span>
                        </p>
                    ) : null}

                    {address ? (
                        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                            <MapPin className="mt-0.5 size-3.5 shrink-0" />
                            <span className="line-clamp-2">{address}</span>
                        </p>
                    ) : null}
                </div>
            </Link>
        </li>
    )
}

function DetailRow({
    icon: Icon,
    label,
    children,
}: {
    icon: typeof MapPin
    label: string
    children: ReactNode
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="text-sm leading-relaxed">{children}</div>
            </div>
        </div>
    )
}

function PlaceDetail({ event }: { event: CosplayEventResponseDTO }) {
    const location = event.location
    const schedule = formatEventSchedule(event.start_at, event.end_at)
    const createdAt = formatCreatedAt(event.created_at)
    const eventInformationUrl = getSafeExternalUrl(event.event_information_url)
    const locationName = location?.name?.trim()
    const address = location?.address?.trim()

    return (
        <div className="pb-6">
            {event.media_url ? (
                <div className="px-4 pt-4">
                    <EventThumbnail
                        src={event.media_url}
                        title={event.title}
                        className="aspect-video w-full"
                    />
                </div>
            ) : null}

            <section className="space-y-3 px-4 py-4">
                <div className="space-y-2">
                    <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
                        {formatLocationType(location?.location_type)}
                    </Badge>
                    <h3 className="text-xl font-semibold leading-snug tracking-tight">
                        {event.title}
                    </h3>
                    {locationName ? (
                        <p className="text-sm text-muted-foreground">{locationName}</p>
                    ) : null}
                </div>

                {eventInformationUrl ? (
                    <Button className="w-full sm:w-auto" variant="outline"
                    >
                        <a
                            href={eventInformationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex gap-4 items-center justify-center"
                        >
                            <p>Informasi event</p>
                            <ExternalLink className="size-4" />
                        </a>
                    </Button>
                ) : null}
            </section>

            <div className="border-y">
                <section className="space-y-4 px-4 py-4">
                    {schedule ? (
                        <DetailRow icon={Clock3} label="Waktu event">
                            {schedule}
                        </DetailRow>
                    ) : (
                        <DetailRow icon={CalendarDays} label="Waktu event">
                            <span className="text-muted-foreground">Jadwal belum tersedia</span>
                        </DetailRow>
                    )}

                    {locationName ? (
                        <DetailRow icon={MapPin} label="Tempat">
                            {locationName}
                        </DetailRow>
                    ) : null}

                    {address ? (
                        <DetailRow icon={MapPin} label="Alamat">
                            {address}
                        </DetailRow>
                    ) : (
                        <DetailRow icon={MapPin} label="Alamat">
                            <span className="text-muted-foreground">Alamat belum tersedia</span>
                        </DetailRow>
                    )}
                </section>
            </div>

            {event.description?.trim() ? (
                <section className="space-y-2 px-4 py-4">
                    <h4 className="text-sm font-semibold">Tentang event</h4>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {event.description}
                    </p>
                </section>
            ) : null}

            {createdAt ? (
                <p className="px-4 pt-2 text-xs text-muted-foreground">
                    Ditambahkan {createdAt}
                </p>
            ) : null}
        </div>
    )
}

function SearchLoadingState() {
    return (
        <div className="space-y-4 p-4" aria-label="Memuat hasil pencarian" aria-live="polite">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                    <div className="size-24 shrink-0 animate-pulse rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-full animate-pulse rounded bg-muted" />
                        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function SearchPanel({
    query,
    results,
    isLoading = false,
    error,
}: Omit<SearchModeProps, "mode">) {
    const resultLabel = `${results.length} event ditemukan`

    return (
        <>
            <PanelHeader
                backHref={cosplayEventRoutes.base}
                backLabel="Tutup hasil pencarian"
                icon={X}
                title={query.trim() ? `Hasil untuk “${query}”` : "Event di area ini"}
                subtitle={isLoading ? "Memperbarui hasil…" : resultLabel}
            />

            <ScrollArea className="min-h-0 flex-1">
                {error && results.length === 0 ? (
                    <EmptyState
                        title="Pencarian gagal"
                        description={error}
                        action={
                            <Button variant="outline" size="sm"
                            >
                                <Link href={cosplayEventRoutes.base}>Kembali ke peta</Link>
                            </Button>
                        }
                    />
                ) : isLoading && results.length === 0 ? (
                    <SearchLoadingState />
                ) : results.length === 0 ? (
                    <EmptyState
                        title="Belum ada event"
                        description={
                            query.trim()
                                ? `Tidak ada event yang cocok dengan “${query}” di area peta ini. Coba kata kunci lain atau geser peta ke area berbeda.`
                                : "Belum ada event di area peta ini. Coba geser atau perbesar peta untuk mencari area lain."
                        }
                        action={
                            <Button variant="outline" size="sm"
                            >
                                <Link href={cosplayEventRoutes.base}>Kembali ke peta</Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        {error ? (
                            <p className="border-b bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                                Hasil terakhir ditampilkan. Pembaruan gagal: {error}
                            </p>
                        ) : null}
                        {isLoading ? (
                            <p className="border-b bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                                Memperbarui hasil berdasarkan area peta…
                            </p>
                        ) : null}
                        <ul className="divide-y">
                            {results.map((event) => (
                                <PlaceListItem key={event.id} event={event} query={query} />
                            ))}
                        </ul>
                    </>
                )}
            </ScrollArea>
        </>
    )
}

function PlacePanel({
    place,
    fromQuery,
    isLoading = false,
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
                title={place?.title ?? (isLoading ? "Memuat event…" : "Event tidak ditemukan")}
                subtitle={place ? formatLocationType(place.location?.location_type) : undefined}
            />

            <ScrollArea className="min-h-0 flex-1">
                {isLoading && !place ? (
                    <SearchLoadingState />
                ) : place ? (
                    <PlaceDetail event={place} />
                ) : (
                    <EmptyState
                        title="Event tidak ditemukan"
                        description="Event ini mungkin sudah dihapus, tidak tersedia, atau tautannya sudah tidak valid."
                        action={
                            <Button variant="outline" size="sm"
                            >
                                <Link href={cosplayEventRoutes.base}>Kembali ke peta</Link>
                            </Button>
                        }
                    />
                )}
            </ScrollArea>
        </>
    )
}

export default function MapPlaceSidebar(props: MapPlaceSidebarProps) {
    const isMobile = useIsMobile()

    const panel =
        props.mode === "search" ? (
            <SearchPanel
                query={props.query}
                results={props.results}
                isLoading={props.isLoading}
                error={props.error}
            />
        ) : (
            <PlacePanel
                place={props.place}
                fromQuery={props.fromQuery}
                isLoading={props.isLoading}
            />
        )

    if (isMobile) {
        return (
            <Drawer open modal={false}>
                <DrawerContent className="h-[60%] gap-0 overflow-hidden rounded-t-2xl border-border bg-card p-0">
                    {panel}
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <aside
            aria-label="Panel event dan lokasi"
            className="absolute inset-x-auto bottom-4 left-4 top-20 z-20 w-[min(420px,calc(100%-2rem))]"
        >
            <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-2xl border bg-card p-0 shadow-xl">
                {panel}
            </Card>
        </aside>
    )
}
