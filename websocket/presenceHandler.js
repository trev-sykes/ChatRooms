export class PresenceHandler {
    constructor(wss) {
        this.wss = wss;
        this.onlineUsers = new Map();// Maps userId to WebSocket connection
    }

    handleUserJoin(ws, userId) {
        this.onlineUsers.set(userId, ws);

        // Send the new user a list of who's currently online
        ws.send(JSON.stringify({
            type: "presence_init",
            users: Array.from(this.onlineUsers.keys())
        }));

        // Let everyone else know this user just came online
        this.broadcastPresence(userId, true, ws);
    }

    handleUserDisconnect(userId) {
        this.onlineUsers.delete(userId);

        // Notify everyone that this user went offline
        this.broadcastPresence(userId, false);
    }

    broadcastPresence(userId, online, excludeWs = null) {
        this.wss.clients.forEach(client => {

            // Don't send presence to the user themselves or closed connections
            if (client !== excludeWs && client.readyState === 1) { // 1 = OPEN
                client.send(JSON.stringify({
                    type: "presence",
                    userId,
                    online
                }));
            }
        });
    }

    getOnlineUsers() {
        return this.onlineUsers;
    }
}