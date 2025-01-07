// Import the chat store for state management
import { useChatStore } from "../store/useChatStore";
// useEffect for side effects, useRef for DOM manipulation
import { useEffect, useRef } from "react";
// Component to display the chat header
import ChatHeader from "./ChatHeader";
// Component for the message input field
import MessageInput from "./MessageInput";
// Skeleton loader for when messages are loading
import MessageSkeleton from "./skeletons/MessageSkeleton";
// Import the authentication store for user details
import { useAuthStore } from "../store/useAuthStore";
// Utility function to format the message timestamp
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
	const {
		messages, // List of messages
		getMessages, // Function to fetch messages
		isMessagesLoading, // Indicates if messages are being fetched
		selectedUser, // The user you're chatting with
		subscribeToMessages, // Function to subscribe to real-time message updates
		unsubscribeFromMessages, // Function to unsubscribe from real-time message updates
	} = useChatStore();

	// Get the authenticated user's details
	const { user } = useAuthStore();
	// Ref to scroll to the bottom of the chat messages
	const messageEndRef = useRef(null);

	// Fetch messages and set up real-time subscriptions whenever the selected user changes
	useEffect(() => {
		getMessages(selectedUser._id); // Fetch messages for the selected user

		subscribeToMessages(); // Start real-time message updates
		// Cleanup function to unsubscribe when the component unmounts or the user changes
		return () => unsubscribeFromMessages();
	}, [
		selectedUser._id, // Re-run the effect when the selected user changes
		getMessages,
		subscribeToMessages,
		unsubscribeFromMessages,
	]);

	// Scroll to the bottom of the chat messages whenever new messages are added
	useEffect(() => {
		// Check if the messageEndRef and messages exist
		if (messageEndRef.current && messages) {
			messageEndRef.current.scrollIntoView({
				behavior: "smooth", // Smoothly scroll to the bottom
			});
		}
	}, [messages]); // Re-run the effect when new messages are added

	// Display a skeleton loader while messages are being fetched
	if (isMessagesLoading) {
		return (
			<div className="flex-1 flex flex-col overflow-auto">
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col overflow-auto">
			{/* Chat header displays the selected user's details */}
			<ChatHeader />

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{/* Map through the messages array to display each message */}
				{messages.map((message) => (
					<div
						key={message._id}
						className={`chat ${
							message.senderId === user._id
								? "chat-end" // Align messages sent by the current user to the right
								: "chat-start" // Align messages from the other user to the left
						}`}
						ref={messageEndRef}
					>
						{/* Avatar (profile picture) of the sender */}
						<div className=" chat-image avatar">
							<div className="size-10 rounded-full border">
								<img
									src={
										message.senderId === user._id
											? user.profilePic || "/avatar.png"
											: selectedUser.profilePic ||
											  "/avatar.png"
									}
									alt="profile pic"
								/>
							</div>
						</div>
						{/* Header showing the message timestamp */}
						<div className="chat-header mb-1">
							<time className="text-xs opacity-50 ml-1">
								{formatMessageTime(message.createdAt)}
							</time>
						</div>
						{/* Chat bubble with the message text or image */}
						<div className="chat-bubble flex flex-col">
							{/* If the message has an image, display it */}
							{message.image && (
								<img
									src={message.image}
									alt="Attachment"
									className="sm:max-w-[200px] rounded-md mb-2"
								/>
							)}
							{/* If the message has text, display it */}
							{message.text && <p>{message.text}</p>}
						</div>
					</div>
				))}
			</div>

			<MessageInput />
		</div>
	);
};
export default ChatContainer;
