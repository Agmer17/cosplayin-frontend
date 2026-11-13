export const conversationQueryKey = {
    all: ["conversation"] as const,

    latestChat: () =>
        [...conversationQueryKey.all, "latest-chat"] as const,
}