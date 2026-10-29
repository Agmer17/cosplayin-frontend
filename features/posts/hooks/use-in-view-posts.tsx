"use client"

import { useEffect, useRef, useState } from "react"

export function useInView<T extends Element>(threshold = 0.6) {
    const ref = useRef<T>(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold])

    return [ref, inView] as const
}