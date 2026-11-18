
import { create } from "zustand"
import { Client } from "@stomp/stompjs"
import type { IMessage, StompSubscription } from "@stomp/stompjs"

type WsStatus = "disconnected" | "connecting" | "connected" | "error"

type MessageHandler = (message: IMessage) => void

interface SubscriptionEntry {
    destination: string
    callback: MessageHandler
    subscription?: StompSubscription
}

interface WsState {
    status: WsStatus
    connect: () => void
    disconnect: () => Promise<void>
    subscribe: (
        destination: string,
        callback: MessageHandler,
    ) => () => void
}

let client: Client | null = null

let subscriptionId = 0

const subscriptions = new Map<number, SubscriptionEntry>()

const WS_URL =
    process.env.NEXT_PUBLIC_BACKEND_WS_URL ??
    `${process.env.NEXT_PUBLIC_BACKEND_API?.replace(/^http/, "ws").replace(/\/$/, "")}/ws`

function subscribeEntry(
    stompClient: Client,
    entry: SubscriptionEntry,
) {
    if (!stompClient.connected || entry.subscription) return

    try {
        entry.subscription = stompClient.subscribe(
            entry.destination,
            entry.callback,
        )
    } catch (error) {
        console.error(
            `[stomp] Gagal subscribe ke ${entry.destination}:`,
            error,
        )
    }
}

export const useWsStore = create<WsState>((set) => ({
    status: "disconnected",

    connect: () => {
        if (client) return

        set({ status: "connecting" })

        const stompClient = new Client({
            brokerURL: WS_URL,

            reconnectDelay: 5000,

            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            debug: (message) => {
                console.log("[stomp]", message)
            },

            onConnect: () => {
                if (client !== stompClient) return

                console.log("[stomp] Connected")

                set({ status: "connected" })

                // Restore seluruh subscription setelah reconnect.
                subscriptions.forEach((entry) => {
                    entry.subscription = undefined
                    subscribeEntry(stompClient, entry)
                })
            },

            onWebSocketClose: () => {
                if (client !== stompClient) return

                console.log("[stomp] Disconnected")

                subscriptions.forEach((entry) => {
                    entry.subscription = undefined
                })

                set({ status: "disconnected" })
            },

            onWebSocketError: () => {
                if (client !== stompClient) return

                set({ status: "error" })
            },

            onStompError: (frame) => {
                if (client !== stompClient) return

                console.error(
                    "[stomp] Error:",
                    frame.headers["message"],
                    frame.body,
                )

                set({ status: "error" })
            },
        })

        client = stompClient

        stompClient.activate()
    },

    disconnect: async () => {
        if (!client) return

        const currentClient = client

        client = null

        subscriptions.forEach((entry) => {
            entry.subscription = undefined
        })

        await currentClient.deactivate()

        if (!client) {
            set({ status: "disconnected" })
        }
    },

    subscribe: (destination, callback) => {
        const id = ++subscriptionId

        const entry: SubscriptionEntry = {
            destination,
            callback,
        }

        subscriptions.set(id, entry)

        if (client?.connected) {
            subscribeEntry(client, entry)
        }

        return () => {
            const currentEntry = subscriptions.get(id)

            if (!currentEntry) return

            try {
                currentEntry.subscription?.unsubscribe()
            } catch {
            }

            subscriptions.delete(id)
        }
    },
}))
