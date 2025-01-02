// `create` function from Zustand for creating a state management store
import { create } from "zustand";
// Get the backend URL from the environment
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import toast from "react-hot-toast";

// Zustand store for managing authentication state
export const useAuthStore = create((set) => ({
	// Initial state properties
	user: null, // Stores the authenticated user's information
	isSigningUp: false, // Indicates if a sign-up process is ongoing
	isLoggingIn: false, // Indicates if a login process is ongoing
	isUpdatingProfile: false, // Indicates if a profile update is ongoing
	isCheckingAuth: false, // Indicates if authentication status is being checked

	// Function to check the user's authentication status
	checkAuth: async () => {
		// Indicate that the authentication check has started
		set({ isCheckingAuth: true });

		try {
			// Execute a GET request to the check-auth endpoint
			const response = await fetch(
				`${backendUrl}/auth/check`,
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
		} catch (error) {
			// Handle errors and set the user as unauthenticated
			console.error(
				"Error checking authentication:",
				error
			);
			set({ user: null });
		} finally {
			// Indicate that the authentication check is complete
			set({ isCheckingAuth: false });
		}
	},

	// Function to sign up a user
	signup: async (data) => {
		// Set `isSigningUp` to `true` to indicate the process has started
		set({ isSigningUp: true });
		try {
			// Execute a POST request to the signup endpoint using fetch
			const response = await fetch(
				`${backendUrl}/auth/signup`,
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

			// Update the store with user details on successful signup
			set({ user: responseData });
			toast.success("Signup successful");
		} catch (error) {
			// Handle different types of errors
			if (error.name === "TypeError") {
				// Handle network errors or issues with the fetch call
				toast.error(
					"Network error. Please check your connection and try again."
				);
				console.error("Network Error:", error.message);
			} else {
				// Handle application-specific or unexpected errors
				toast.error(
					"An unexpected error occurred. Please try again."
				);
				console.error("Error:", error.message);
			}
		} finally {
			// Indicate that the signup process has completed
			set({ isSigningUp: false });
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true });

		try {
			const response = await fetch(
				`${backendUrl}/auth/login`,
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

			toast.success("Login successful");
		} catch (error) {
			if (error.name === "TypeError") {
				toast.error(
					"Network error. Please check your connection and try again."
				);
				console.error("Network Error:", error.message);
			} else {
				toast.error(error.message);
				console.error("Error:", error.message);
			}
		} finally {
			set({ isLoggingIn: false });
		}
	},

	logout: async () => {
		try {
			const response = await fetch(
				`${backendUrl}/auth/logout`,
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
			toast.success("Logout successful");
		} catch (error) {
			console.error("Error logging out:", error);
			toast.error("An error occurred. Please try again.");
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });

		try {
			const response = await fetch(
				`${backendUrl}/auth/update-profile`,
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
}));
