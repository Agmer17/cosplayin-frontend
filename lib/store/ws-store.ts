import { create } from "zustand"
import { Client, IMessage, StompSubscription } from "@stomp/stompjs"

type WsStatus = "disconnected" | "connecting" | "connected" | "error";
type MessageHandler = (msg: IMessage) => void;

interface SubEntry {
  destination: string;
  callback: MessageHandler;
  sub?: StompSubscription;
}

interface WsState {
  status: WsStatus;
  connect: () => void;
  disconnect: () => Promise<void>;
  subscribe: (destination: string, callback: MessageHandler) => () => void;
  publish: (destination: string, body: unknown) => void;
}

let client: Client | null = null
const entries = new Set<SubEntry>()

const WS_URL = process.env.NEXT_PUBLIC_BACKEND_API + "/ws"

export const useWsStore = create<WsState>((set) => ({
  status: "disconnected",

  connect: () => {
    if (client) return

    set({ status: "connecting" })

    client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => {
        console.log("[stomp]", str)
      },

      onConnect: () => {
        set({ status: "connected" })
        entries.forEach((e) => {
          e.sub = client!.subscribe(e.destination, e.callback)
        })
      },
      onWebSocketClose: () => set({ status: "disconnected" }),
      onWebSocketError: () => set({ status: "error" }),
      onStompError: (frame) => {
        console.error("[stomp] error:", frame.headers["message"], frame.body)
        set({ status: "error" })
      },
    })

    client.activate()
  },

  disconnect: async () => {
    if (!client) return
    const c = client
    client = null
    entries.forEach((e) => (e.sub = undefined))
    await c.deactivate()
    set({ status: "disconnected" })
  },

  subscribe: (destination, callback) => {
    const entry: SubEntry = { destination, callback }
    entries.add(entry)

    if (client?.connected) {
      entry.sub = client.subscribe(destination, callback)
    }

    // return fungsi unsubscribe
    return () => {
      try {
        entry.sub?.unsubscribe()
      } catch {
        // koneksi sudah putus, abaikan
      }
      entries.delete(entry)
    }
  },

  publish: (destination, body) => {
    if (!client?.connected) {
      console.warn("[stomp] belum connected, publish dibatalkan")
      return
    }
    client.publish({ destination, body: JSON.stringify(body) })
  },
}))