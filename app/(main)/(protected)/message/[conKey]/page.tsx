import { ConversationPanel } from "@/features/message/component/conversation-panel"

export default async function ConversationPage({
    params,
}: {
    params: Promise<{ convKey: string }>
}) {
    const { convKey } = await params
    return <ConversationPanel convKey={convKey} />
}