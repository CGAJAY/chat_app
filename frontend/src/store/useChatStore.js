import { create } from "zustand";
import toast from "react-hot-toast";
// Get the backend URL from the environment
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuthStore } from "./useAuthStore";

// Zustand store for managing chat messages
export const useChatStore = create((set, get) => ({
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
				`${backendUrl}/api/v1/messages/users`,
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
				`${backendUrl}/api/v1/messages/${userId}`,
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
			console.log(responseData);
		} catch (error) {
			console.error("Error fetching messages:", error);
			toast.error("Failed to fetch messages");
		} finally {
			set({ isMessagesLoading: false });
		}
	},
	setSelectedUser: (selectedUser) => {
		// Update the selected user
		set({ selectedUser });
	},
	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get();
		try {
			const response = await fetch(
				`${backendUrl}/api/v1/messages/send/${selectedUser._id}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(messageData),
				}
			);

			const responseData = await response.json();
			if (!response.ok) {
				console.log(responseData);
				throw new Error("Failed to send message");
			}

			set({ messages: [...messages, responseData] });
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message");
		}
	},
	// Subscribe to real-time messages
	subscribeToMessages: () => {
		const { selectedUser } = get();

		if (!selectedUser) {
			return;
		}

		// Get the socket instance from the auth store
		const socket = useAuthStore.getState().socket;

		// Listen for incoming messages
		socket.on("newMessage", (newMessage) => {
			const { messages } = get();
			if (newMessage.senderId === selectedUser._id) {
				set({ messages: [...messages, newMessage] });
			}
			set({ messages: [...messages, newMessage] });
		});
	},
	unsubscribeFromMessages: () => {
		// Get the socket instance from the auth store
		const socket = useAuthStore.getState().socket;
		socket.off("newMessage");
	},
}));
