"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWsStore } from "@/lib/store/ws-store";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const isLoggedIn = useAuthStore((s) => !!s.user);
    const connect = useWsStore((s) => s.connect);
    const disconnect = useWsStore((s) => s.disconnect);

    useEffect(() => {
        if (isLoggedIn) connect();
        else disconnect();
    }, [isLoggedIn, connect, disconnect]);

    return children;
}