
"use client"

import { useEffect } from "react"
import { Toaster } from "sonner"

import { useAuthStore } from "@/lib/store/auth-store"
import { useWsStore } from "@/lib/store/ws-store"
import { useIsMobile } from "@/lib/responsive_util"

export function WebSocketProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const isLoggedIn = useAuthStore((state) => !!state.user)

    const connect = useWsStore((state) => state.connect)
    const disconnect = useWsStore((state) => state.disconnect)

    const isMobile = useIsMobile()

    useEffect(() => {
        if (isLoggedIn) {
            connect()
        } else {
            void disconnect()
        }
    }, [isLoggedIn, connect, disconnect])

    return (
        <>
            <Toaster
                richColors
                position={isMobile ? "top-center" : "bottom-right"}
                closeButton
            />

            {children}
        </>
    )
}
