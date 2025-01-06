// Import necessary components and hooks
import { X } from "lucide-react"; // 'X' icon for the close button
// Auth store to access authentication-related data
import { useAuthStore } from "../store/useAuthStore";
// Chat store for managing chat-related state
import { useChatStore } from "../store/useChatStore";

// Displays information about the currently selected user
const ChatHeader = () => {
	// Get the selected user and function to set the selected user from the chat store
	const { selectedUser, setSelectedUser } = useChatStore();

	// Get the list of currently online users from the auth store
	const { onlineUsers } = useAuthStore();

	// Return the JSX for the header
	return (
		<div className="p-2.5 border-b border-base-300">
			{/* Flex container to layout the avatar, user info, and close button */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{/* Avatar section */}
					<div className="avatar">
						<div className="size-10 rounded-full relative">
							{/* Display the selected user's profile picture or a default image */}
							<img
								src={
									selectedUser.profilePic || "/avatar.png"
								}
								alt={selectedUser.fullName} // Add alt text for accessibility
							/>
						</div>
					</div>

					{/* User info section */}
					<div>
						{/* Display the selected user's full name */}
						<h3 className="font-medium">
							{selectedUser.fullName}
						</h3>

						{/* Display online/offline status based on whether the user is in the onlineUsers array */}
						<p className="text-sm text-base-content/70">
							{onlineUsers.includes(selectedUser._id)
								? "Online"
								: "Offline"}
						</p>
					</div>
				</div>

				{/* Close button section */}
				<button onClick={() => setSelectedUser(null)}>
					{/* 'X' icon to close or deselect the current user */}
					<X />
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
