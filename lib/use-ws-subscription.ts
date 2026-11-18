
"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import type { IMessage } from "@stomp/stompjs"

import { useWsStore } from "@/lib/store/ws-store"

type MessageHandler = (message: IMessage) => void

export function useWsSubscription(
    destination: string,
    callback: MessageHandler,
    enabled = true,
) {
    const subscribe = useWsStore((state) => state.subscribe)

    const callbackRef = useRef(callback)

    useLayoutEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        if (!enabled || !destination) return

        return subscribe(destination, (message) => {
            callbackRef.current(message)
        })
    }, [destination, enabled, subscribe])
}
