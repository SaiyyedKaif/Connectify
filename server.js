const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
require("dotenv").config();
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// Initialize Redis clients with environment variable support
let pubClient, subClient;

(async () => {
  try {
    // Use REDIS_URL environment variable if available, fallback to localhost for development
    const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
    
    console.log("Connecting to Redis...");
    pubClient = createClient({ url: redisUrl });
    
    // Add error handling for Redis connection
    pubClient.on('error', (err) => {
      console.error('Redis pub client error:', err);
    });
    
    pubClient.on('connect', () => {
      console.log('Redis pub client connected');
    });
    
    await pubClient.connect();
    subClient = pubClient.duplicate();
    
    subClient.on('error', (err) => {
      console.error('Redis sub client error:', err);
    });
    
    await subClient.connect();
    
    // Set up Redis adapter for Socket.io
    io.adapter(createAdapter(pubClient, subClient));
    console.log("Redis adapter configured successfully");
    
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    console.log("Running without Redis adapter - single server mode");
    // The app will continue to work without Redis, just without multi-server scaling
  }
})();

// Run when client connects
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    }
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (pubClient) {
    await pubClient.quit();
  }
  if (subClient) {
    await subClient.quit();
  }
  server.close(() => {
    console.log('Process terminated');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
