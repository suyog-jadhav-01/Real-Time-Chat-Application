# Real-Time Chat Application

A real-time, room-based messaging application built using React, Node.js, and WebSockets. It enables users to join chat rooms, exchange messages instantly, and see other active members without refreshing the page.

## Features

- **Real-Time Messaging:** Send and receive messages instantly using WebSocket connections.
- **Room-Based Chat:** Join specific rooms and communicate with members in the same room.
- **Live Member Count:** View the number of users currently connected to a room.
- **Active Members:** See the usernames of users currently present in a room.
- **Dynamic Room Management:** Users can join and leave rooms dynamically.
- **Connection Status:** Track the WebSocket connection status.
- **Interactive UI:** React-based interface for a smooth messaging experience.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| TypeScript | Type safety |
| Node.js | Backend runtime |
| WebSocket (`ws`) | Real-time communication |
| React Router | Frontend navigation |

## Project Structure

```text
real-time-chat/
│
├── backend/
│   ├── src/
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md
```



## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd real-time-chat
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Start the WebSocket server:

```bash
npm run dev
```

The backend runs on:

```text
ws://localhost:8080
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application in your browser at the Vite URL, typically:

```text
http://localhost:5173
```

## How It Works

1. A user enters a username and selects or joins a chat room.
2. The frontend establishes a WebSocket connection with the Node.js server.
3. The server maintains active WebSocket connections and organizes users into rooms.
4. When a user sends a message, the server broadcasts it to other connected members of that room.
5. Room membership and active member information are updated as users join or disconnect.

## Screenshots

<img width="959" height="419" alt="Screenshot 2026-11-14 000205" src="https://github.com/user-attachments/assets/baf6bd03-babb-493c-9c7d-59ad35b964ee" />

```markdown

```

## Future Improvements

- Private one-to-one messaging.
- Persistent message history using MongoDB.
- User authentication and authorization.
- Typing indicators.
- Message timestamps.
- Online/offline presence indicators.
- Message delivery and read receipts.

## Learning Outcomes

- Understanding WebSocket connections and bidirectional communication.
- Managing multiple client connections on a Node.js server.
- Implementing room-based message broadcasting.
- Handling user connection and disconnection events.
- Integrating a React frontend with a real-time backend.

---

**Built with React, Node.js, and WebSockets.**
