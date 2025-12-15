// PublicConversations.tsx
import { PageWrapper } from "./layout/PageWrapper"
import { PublicConversationList } from "./PublicConversationList"

export const PublicConversations = () => {
    return (
        <PageWrapper centered>
            <div style={{ marginBottom: '16px' }} />
            <PublicConversationList />
            <div style={{ marginBottom: '16px' }} />
        </PageWrapper>
    )
}