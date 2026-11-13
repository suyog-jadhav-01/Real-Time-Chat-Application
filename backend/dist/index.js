import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map();
function broadcast_members(roomid) {
    const clients = rooms.get(roomid);
    if (!clients)
        return;
    const members = Array.from(clients)
        .map((client) => client.username)
        .filter((username) => Boolean(username));
    const response = JSON.stringify({
        type: "room-members",
        payload: members,
    });
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(response);
        }
    }
}
function broadcast_room_count(roomid) {
    const clients = rooms.get(roomid);
    if (!clients)
        return;
    const total_members = clients.size;
    const response = JSON.stringify({
        type: "room-count",
        payload: total_members,
    });
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(response);
        }
    }
}
function leave_room(socket) {
    const roomid = socket.roomid;
    if (!roomid)
        return;
    const clients = rooms.get(roomid);
    if (!clients) {
        socket.roomid = undefined;
        return;
    }
    clients.delete(socket);
    socket.roomid = undefined;
    if (clients.size === 0) {
        rooms.delete(roomid);
        return;
    }
    broadcast_members(roomid);
    broadcast_room_count(roomid);
}
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsed_message = JSON.parse(message.toString()); //here message will be a string first we have to convert that string int object beause we are storing info in objects in allsockets
        if (parsed_message.type === "join") {
            const roomid = parsed_message.payload.roomid;
            const username = parsed_message.payload.username;
            if (typeof roomid !== "string" || !roomid.trim() || typeof username !== "string" || !username.trim()) {
                return;
            }
            const id = roomid.trim();
            const name = username.trim();
            // Leave the old room if this connection changes rooms
            leave_room(socket);
            socket.username = name;
            socket.roomid = id;
            if (!rooms.has(id)) {
                rooms.set(id, new Set());
            }
            rooms.get(id).add(socket);
            // const total_members= rooms.get(roomid)?.size;
            socket.send((JSON.stringify({
                type: "join",
                payload: { roomid: id,
                    username: name
                }
            })));
            broadcast_members(id);
            broadcast_room_count(id);
            /////////////////////////////////////////////////////
        }
        if (parsed_message.type === "chat") {
            const current_room = socket.roomid;
            if (!current_room) {
                return;
            }
            const clients = rooms.get(current_room);
            if (!clients)
                return;
            const response = JSON.stringify({
                type: "chat",
                payload: {
                    username: socket.username,
                    message: parsed_message.payload.message,
                },
            });
            for (const client of clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(response);
                }
            }
            ////////////////////////////////////////////////////////////////////
        }
    });
    socket.on("close", () => {
        leave_room(socket);
    });
});
//# sourceMappingURL=index.js.map