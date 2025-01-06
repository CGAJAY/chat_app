// React hooks for side effects and state management
import { useEffect, useState } from "react";
// Import the chat store
import { useChatStore } from "../store/useChatStore";
// Import the auth store
import { useAuthStore } from "../store/useAuthStore";
// Skeleton loader for the sidebar
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react"; // Icon for users

// Displays a list of users and allows toggling between online/all users
const Sidebar = () => {
	const {
		getUsers, // Function to fetch the list of users
		users, // List of all users
		selectedUser, // Currently selected user
		setSelectedUser, // Function to set the selected user
		isUsersLoading, // Indicates if user data is being fetched
	} = useChatStore();

	const { onlineUsers } = useAuthStore(); // List of online users
	// State to toggle "Show online only" filter
	const [showOnlineOnly, setShowOnlineOnly] =
		useState(false);

	// Fetch the list of users when the component mounts or updates
	useEffect(() => {
		getUsers();
	}, [getUsers]);

	// Filter users based on the "Show online only" state
	const filteredUsers = showOnlineOnly
		? // Keep only the users whose '_id' exists in the 'onlineUsers' array
		  users.filter((user) => onlineUsers.includes(user._id))
		: users; // Show all users

	// Display a skeleton loader while user data is being fetched
	if (isUsersLoading) return <SidebarSkeleton />;

	return (
		<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
			{/* Sidebar header */}
			<div className="border-b border-base-300 w-full p-5">
				{/* Sidebar title with an icon */}
				<div className="flex items-center gap-2">
					<Users className="size-6" />
					<span className="font-medium hidden lg:block">
						Contacts
					</span>
				</div>
				{/* TODO: Online filter toggle */}
				<div className="mt-3 hidden lg:flex items-center gap-2">
					<label className="cursor-pointer flex items-center gap-2">
						<input
							type="checkbox"
							checked={showOnlineOnly}
							onChange={(e) =>
								setShowOnlineOnly(e.target.checked)
							}
							className="checkbox checkbox-sm"
						/>
						<span className="text-sm">
							Show online only
						</span>
					</label>
					{/* Display the count of online users */}
					<span className="text-xs text-zinc-500">
						({onlineUsers.length - 1} online)
					</span>
				</div>
			</div>

			{/* List of users */}
			<div className="overflow-y-auto w-full py-3">
				{filteredUsers.map((user) => (
					<button
						key={user._id}
						onClick={() => setSelectedUser(user)}
						className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
								selectedUser?._id === user._id
									? "bg-base-300 ring-1 ring-base-300"
									: ""
							}
            `}
					>
						{/* User avatar */}
						<div className="relative mx-auto lg:mx-0">
							<img
								src={user.profilePic || "/avatar.png"}
								alt={user.fullName}
								className="size-12 object-cover rounded-full"
							/>
							{/* Green dot for online status */}
							{onlineUsers.includes(user._id) && (
								<span
									className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
								/>
							)}
						</div>

						{/* User info - only visible on larger screens */}
						<div className="hidden lg:block text-left min-w-0">
							<div className="font-medium truncate">
								{user.fullName}
							</div>
							<div className="text-sm text-zinc-400">
								{onlineUsers.includes(user._id)
									? "Online"
									: "Offline"}
							</div>
						</div>
					</button>
				))}
				{/* Display a message if no users are online */}
				{filteredUsers.length === 0 && (
					<div className="text-center text-zinc-500 py-4">
						No online users
					</div>
				)}
			</div>
		</aside>
	);
};
export default Sidebar;
