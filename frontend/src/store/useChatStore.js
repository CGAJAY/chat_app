import { create } from "zustand";
import toast from "react-hot-toast";
// Get the backend URL from the environment
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Zustand store for managing chat messages
export const useChatStore = create((set) => ({
	// Initial state properties
	messages: [], // Stores all chat messages
	users: [], // Stores all users
	selectedUser: null, // Stores the selected user
	isUserLoading: false, // Indicates if user data is being fetched
	isMessagesLoading: false, // Indicates if messages are being fetched

	getUsers: async () => {
		// Indicate that user data is being fetched
		set({ isUserLoading: true });

		try {
			const response = await fetch(
				`${backendUrl}/messages/users`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}

			const responseData = await response.json();
			console.log(responseData);
			set({ users: responseData });
		} catch (error) {
			console.error("Error fetching users:", error);
			toast.error("Failed to fetch users");
		} finally {
			set({ isUserLoading: false });
		}
	},
	getMessages: async (userId) => {
		// Indicate that messages are being fetched
		set({ isMessagesLoading: true });
		try {
			const response = await fetch(
				`${backendUrl}/messages/${userId}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch messages");
			}

			const responseData = await response.json();
			set({ messages: responseData });
		} catch (error) {
			console.error("Error fetching messages:", error);
			toast.error("Failed to fetch messages");
		}
	},
	setSelectedUser: (selectedUser) =>
		// Update the selected user
		set({ selectedUser }),

	subscribeToMessages: () => {
		// Subscribe to real-time messages
		console.log("Subscribed to messages");
	},
	unsubscribeFromMessages: () => {
		// Unsubscribe from real-time messages
		console.log("Unsubscribed from messages");
	},
}));
