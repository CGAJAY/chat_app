// `create` function from Zustand for creating a state management store
import { create } from "zustand";
// Get the backend URL from the environment
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Get the user from local storage
const initialUser = localStorage.getItem("user");

// Zustand store for managing authentication state
export const useAuthStore = create((set, get) => ({
	// Get the user from local storage
	// Initial state properties
	user: initialUser || null, // Stores the authenticated user's information
	isSigningUp: false, // Indicates if a sign-up process is ongoing
	isLoggingIn: false, // Indicates if a login process is ongoing
	isUpdatingProfile: false, // Indicates if a profile update is ongoing
	isCheckingAuth: false, // Indicates if authentication status is being checked
	onlineUsers: [], // Stores the list of online users
	socket: null, // Stores the socket instance

	// Function to check the user's authentication status
	checkAuth: async () => {
		// Indicate that the authentication check has started
		set({ isCheckingAuth: true });

		try {
			// Execute a GET request to the check-auth endpoint
			const response = await fetch(
				`${backendUrl}/api/v1/auth/check`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include", // Include credentials for cookies or tokens
				}
			);
			// Parse the JSON response
			const responseData = await response.json();

			// Validate the response status
			if (!response.ok) {
				set({ user: null });
				console.log("check:", responseData.error);
				console.log(response.status);
				throw new Error(responseData.error);
			}

			// Update the store with the authenticated user details
			console.log(responseData);
			set({ user: responseData });
			// Save the user details to local storage
			localStorage.setItem(
				"user",
				JSON.stringify(responseData)
			);
			get().connectSocket(); // Connect to the socket server
		} catch (error) {
			// Handle errors and set the user as unauthenticated
			console.error(
				"Error checking authentication:",
				error
			);
			set({ user: null });
			// Remove the user details from local storage
			localStorage.removeItem("user");
		} finally {
			// Indicate that the authentication check is complete
			set({ isCheckingAuth: false });
		}
	},

	// Function to sign up a user
	signup: async (data, navigate) => {
		// Set `isSigningUp` to `true` to indicate the process has started
		set({ isSigningUp: true });
		try {
			// Execute a POST request to the signup endpoint using fetch
			const response = await fetch(
				`${backendUrl}/api/v1/auth/signup`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			// Parse the JSON response
			const responseData = await response.json();

			// Check if the response status is successful
			if (!response.ok) {
				return toast.error(responseData.message);
			}

			toast.success("Signup successful");
			navigate("/login"); // Redirect to the login page
			// get().connectSocket(); // Connect to the socket server
		} catch (error) {
			// Handle different types of errors
			// if (error.name === "TypeError") {
			// 	// Handle network errors or issues with the fetch call
			// 	toast.error(
			// 		"Network error. Please check your connection and try again."
			// 	);
			// 	console.error("Network Error:", error.message);
			// } else {
			// Handle application-specific or unexpected errors
			toast.error(
				"An unexpected error occurred. Please try again."
			);
			// console.error("Error:", error.message);
			// }
		} finally {
			// Indicate that the signup process has completed
			set({ isSigningUp: false });
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true });

		try {
			const response = await fetch(
				`${backendUrl}/api/v1/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
					credentials: "include",
				}
			);

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message);
			}

			console.log(responseData);
			set({ user: responseData });
			// Save the user details to local storage
			localStorage.setItem(
				"user",
				JSON.stringify(responseData)
			);
			toast.success("Login successful");
			get().connectSocket(); // Connect to the socket server
		} catch (error) {
			// if (error.name === "TypeError") {
			// 	toast.error(
			// 		"Network error. Please check your connection and try again."
			// 	);
			// 	console.error("Network Error:", error.message);
			// } else {
			toast.error(error.message);
			console.error("Error:", error.message);
			// }
		} finally {
			set({ isLoggingIn: false });
		}
	},

	logout: async () => {
		try {
			const response = await fetch(
				`${backendUrl}/api/v1/auth/logout`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);

			const responseData = await response.json();

			if (!response.ok) {
				console.log(responseData.message);
				throw new Error(responseData.message);
			}

			set({ user: null });
			// Remove the user details from local storage
			localStorage.removeItem("user");
			toast.success("Logout successful");
			get().disconnectSocket(); // Disconnect from the socket server
		} catch (error) {
			console.error("Error logging out:", error);
			toast.error("An error occurred. Please try again.");
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });

		try {
			const response = await fetch(
				`${backendUrl}/api/v1/auth/update-profile`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
					credentials: "include",
				}
			);

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message);
			}

			set({ user: responseData });
			toast.success("Profile updated successfully");
		} catch (error) {
		} finally {
			set({ isUpdatingProfile: false });
		}
	},
	connectSocket: () => {
		const { user } = get();
		// Check if the user is authenticated or the socket is already connected
		if (!user || get().socket?.connected) return;
		// Create a new socket instance
		const socket = io(backendUrl, {
			query: { userId: user._id }, // Send the userId as a query parameter
		});

		socket.connect(); // Connect to the socket server

		set({ socket }); // Update the store with the socket instance

		// Listen for the "getOnlineUsers" event
		socket.on("getOnlineUsers", (userIds) => {
			// Update the store with the online users
			set({ onlineUsers: userIds });
		});
	},
	disconnectSocket: () => {
		// Check if the socket is connected
		if (get().socket?.connected) {
			// Disconnect the socket and set it to null
			get().socket.disconnect();
			set({ socket: null });
		}
	},
}));
