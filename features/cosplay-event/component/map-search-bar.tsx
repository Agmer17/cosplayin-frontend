
"use client"

import { useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarSearch, Search, UsersRound, X } from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import {
    PLACE_PREFIX,
    SEARCH_PREFIX,
    cosplayEventRoutes,
    safeDecode,
} from "@/features/cosplay-event/util/page-routes-util"

const CATEGORY_SHORTCUTS = [
    { label: "Event", query: "event", icon: CalendarSearch },
    { label: "Kumpul", query: "Kumpul", icon: UsersRound },
] as const

function getQueryFromUrl(
    pathname: string,
    searchParams: Pick<URLSearchParams, "get">
): string | null {
    if (pathname.startsWith(SEARCH_PREFIX)) {
        return safeDecode(pathname.slice(SEARCH_PREFIX.length).split("/")[0])
    }

    if (pathname.startsWith(PLACE_PREFIX)) {
        return searchParams.get("q")
    }

    return ""
}

export default function MapSearchBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const inputRef = useRef<HTMLInputElement>(null)

    const urlKey = `${pathname}?${searchParams.toString()}`

    const [value, setValue] = useState(
        () => getQueryFromUrl(pathname, searchParams) ?? ""
    )
    const [prevUrlKey, setPrevUrlKey] = useState(urlKey)

    if (urlKey !== prevUrlKey) {
        setPrevUrlKey(urlKey)

        const fromUrl = getQueryFromUrl(pathname, searchParams)
        if (fromUrl !== null) setValue(fromUrl)
    }

    function handleSearch(query: string) {
        const normalizedQuery = query.trim()

        router.push(
            normalizedQuery
                ? cosplayEventRoutes.search(normalizedQuery)
                : cosplayEventRoutes.base
        )
    }

    function handleCategoryClick(query: string) {
        setValue(query)
        inputRef.current?.focus()
    }

    function handleClear() {
        setValue("")
        inputRef.current?.focus()
    }

    const activeKeyword = value.trim().toLowerCase()

    return (
        <div className="
            absolute left-4 right-4 top-4 z-30
            flex flex-col md:flex-row gap-2
            md:right-auto md:w-[60%]
        ">
            <form
                role="search"
                className="flex-1"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleSearch(value)
                }}
            >
                <InputGroup
                    className="
                        h-12 w-full overflow-hidden
                        rounded-full border border-border/80
                        bg-background shadow-lg
                        transition-shadow
                        focus-within:shadow-xl
                    "
                >
                    <InputGroupAddon
                        align="inline-start"
                        className="pl-4 pr-0"
                    >
                        <Search
                            className="size-5 text-muted-foreground"
                            strokeWidth={2}
                        />
                    </InputGroupAddon>

                    <InputGroupInput
                        ref={inputRef}
                        type="search"
                        name="q"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Cari event atau tempat..."
                        autoComplete="off"
                        enterKeyHint="search"
                        aria-label="Cari event atau tempat"
                        className="
                            h-12 min-w-0 border-0 bg-transparent
                            text-sm shadow-none
                            placeholder:text-muted-foreground/70
                            focus-visible:ring-0
                            [&::-webkit-search-cancel-button]:appearance-none
                        "
                    />

                    {value && (
                        <InputGroupAddon
                            align="inline-end"
                            className="pr-2"
                        >
                            <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="
                                    size-8 rounded-full
                                    text-muted-foreground
                                    hover:bg-muted
                                "
                                onClick={handleClear}
                                aria-label="Hapus pencarian"
                            >
                                <X className="size-4" />
                            </InputGroupButton>
                        </InputGroupAddon>
                    )}
                </InputGroup>
            </form>

            <div
                className="
                    flex w-full items-center gap-2
                    overflow-x-auto py-0.5
                    scrollbar-none
                    [&::-webkit-scrollbar]:hidden flex-1
                "
                aria-label="Kategori pencarian"
            >
                {CATEGORY_SHORTCUTS.map(({ label, query, icon: Icon }) => {
                    const isActive = activeKeyword === query.toLowerCase()

                    return (
                        <Button
                            key={label}
                            type="button"
                            size="sm"
                            variant="outline"
                            aria-pressed={isActive}
                            onClick={() => handleCategoryClick(query)}
                            className={`
                                h-8 shrink-0 gap-1.5 rounded-full
                                px-3 text-xs font-medium shadow-sm
                                transition-colors
                                ${isActive
                                    ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                    : "border-border/80 bg-background text-foreground hover:bg-accent"
                                }
                            `}
                        >
                            <Icon className="size-3.5" strokeWidth={2} />
                            {label}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
