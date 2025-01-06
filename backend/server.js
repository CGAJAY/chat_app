// Import the Express framework to create the server
import express from "express";
import { connectDB } from "./db/connectDB.js";
import cors from "cors";

// Import dotenv to load environment variables from a .env file
import { configDotenv } from "dotenv";

// Import cookie-parser to parse cookies from the request headers
import cookieParser from "cookie-parser";

// Import the route handlers for API versions v1 and v2
import { v1Router } from "./routes/v1/index.js";
import { v2Router } from "./routes/v2/index.js";

// Load environment variables from the .env file into process.env
configDotenv();

connectDB(); // Connect to the database

// Initialize the Express application
const app = express();

const PORT = process.env.PORT;

// Enable CORS - Allow communication with front-end
const corsOptions = {
	origin: process.env.FRONTEND_URL,
	credentials: true,
};

// Middleware to enable CORS
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json({ limit: "10mb" }));

// Middleware to parse cookies from the request headers
app.use(cookieParser());

// ROUTES
app.get("/", (req, res) => {
	console.log("Request received on root path");
	res.json({
		message: "Silence is golden",
	});
});

// Use the v1Router for all requests starting with "/api/v1"
app.use("/api/v1", v1Router);

// Use the v2Router for all requests starting with "/api/v2"
app.use("/api/v2", v2Router);

// END ROUTES
app.use("*", (req, res) => {
	// Inform the client that the requested resource was not found
	res.status(404).json({
		message: "Not found",
	});
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
