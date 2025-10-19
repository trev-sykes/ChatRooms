export class TypingHandler {
    constructor(wss) {
        this.wss = wss;
    }

    broadcastTyping(ws, msg) {
        // Notify all other users in the conversation that someone is typing
        this.wss.clients.forEach(client => {
            if (client !== ws && client.readyState === 1) { // 1 = WebSocket.OPEN
                client.send(JSON.stringify({
                    type: "typing",
                    userId: msg.userId,
                    username: msg.username,
                    conversationId: msg.conversationId
                }));
            }
        });
    }
}