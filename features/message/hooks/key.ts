export const conversationQueryKey = {
    all: ["conversation"] as const,

    latestChat: () =>
        [...conversationQueryKey.all, "latest-chat"] as const,
    privateChat: (userId: string) =>
        [...conversationQueryKey.all, "private", userId] as const,
    groupChat: (conversationId: string) => ["conversation", "group", conversationId] as const,
}