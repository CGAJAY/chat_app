import { connect } from "mongoose";

export const connectDB = async () => {
	try {
		// Attempt to connect to the database using the URI from the environment variables (process.env.MONGO_URI)
		// Using await ensures that the code waits for the promise to resolve before moving on, giving you the chance to handle success or failure.
		await connect(process.env.MONGO_URI);

		// If the connection is successful, log a success message to the console
		console.log("Database connected successfully");
	} catch (error) {
		// If there's an error during the connection, catch it and log the error message to the console
		console.log("Database connection error", error);

		// Exit the process with a failure code (1) to stop the application in case of failure
		process.exit(1);
	}
};
