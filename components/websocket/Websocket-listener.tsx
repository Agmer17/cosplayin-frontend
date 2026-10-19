"use client";

import { useEffect } from "react";
import { useWsStore } from "@/lib/store/ws-store";

export default function WebSocketListener() {
    const subscribe = useWsStore((s) => s.subscribe);

    useEffect(() => {
        return subscribe(
            "/user/personal/notifications",
            (msg) => {
                console.log("Notification:", JSON.parse(msg.body));
            },
        );
    }, [subscribe]);

    return null;
}