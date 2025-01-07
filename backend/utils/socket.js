import { Server } from "socket.io";
import http from "http";
import express from "express";
import { configDotenv } from "dotenv";

// Load environment variables from the .env file into process.env
configDotenv();

const app = express(); // Create an express app
const server = http.createServer(app); // Create a server

// Create a socket server
const io = new Server(server, {
	cors: {
		origin: [process.env.FRONTEND_URL],
	},
});

// Used to store online users
const userSocketMap = {}; // { userId: socketId }

// Listen for incoming connections
io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	// Get the userId from the query
	const userId = socket.handshake.query.userId;

	if (userId) {
		// Store the userId and socketId in the userSocketMap
		userSocketMap[userId] = socket.id;
	}

	// Send the list of online users to all clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Listen for the "disconnect" event
	socket.on("disconnect", () => {
		console.log("A user disconnected", socket.id);
		delete userSocketMap[userId]; // Remove the user from the userSocketMap
		// Send the updated list of online users to all clients
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, server, app };
