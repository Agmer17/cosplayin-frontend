
"use client"

import { useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HomeIcon, Search, X } from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"

import {
    PLACE_PREFIX,
    SEARCH_PREFIX,
    cosplayEventRoutes,
    safeDecode,
} from "@/features/cosplay-event/util/page-routes-util"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/lib/responsive_util"



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
    const isMobile = useIsMobile()

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

    function handleClear() {
        setValue("")
        inputRef.current?.focus()
    }


    return (
        <div className="
            absolute left-4 right-4 top-4 z-30
            flex flex-col md:flex-row gap-2
            md:right-auto md:w-[30%]
        ">

            {!isMobile && (
                <Button
                    variant="outline"
                    size="icon"
                    className="size-12 shrink-0 rounded-full bg-background shadow-lg"
                    onClick={() => router.push("/")}
                    aria-label="Kembali ke halaman utama"
                >
                    <HomeIcon className="size-5" />
                </Button>
            )}
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
        </div>
    )
}
