"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWsStore } from "@/lib/store/ws-store";
import { Toaster } from "sonner";
import { useIsMobile } from "@/lib/responsive_util";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const isLoggedIn = useAuthStore((s) => !!s.user);
    const connect = useWsStore((s) => s.connect);
    const disconnect = useWsStore((s) => s.disconnect);

    const isMobile = useIsMobile()

    useEffect(() => {
        if (isLoggedIn) connect();
        else disconnect();
    }, [isLoggedIn, connect, disconnect]);

    return (
        <>
            <Toaster richColors={true} position={isMobile ? "top-center" : "bottom-right"} closeButton={true} />
            {children}
        </>);
}