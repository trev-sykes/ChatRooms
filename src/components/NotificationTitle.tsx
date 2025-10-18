import { useEffect } from "react";
import { useConversations } from "../context/ConversationContext";

interface Props {
    appName?: string;
}

export const NotificationTitle: React.FC<Props> = ({ appName = "MyApp" }) => {
    const { unread } = useConversations();

    useEffect(() => {
        const totalUnread = Object.values(unread).reduce((sum, count) => sum + count, 0);
        document.title = totalUnread > 0 ? `(${totalUnread}) ${appName}` : appName;
    }, [unread, appName]);

    return null;
};
