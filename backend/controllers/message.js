import User from "../db/models/user.js";
import Message from "../db/models/message.js";
import cloudinary from "../utils/cloudinary.js";
import {
	getReceiverSocketId,
	io,
} from "../utils/socket.js";
// Function to get users for the sidebar, excluding the logged-in user
export const getUsersForSidebar = async (req, res) => {
	// Extract the logged-in user's ID from the request object
	const myId = req.user._id;

	try {
		// Fetch all users except the logged-in user by filtering out their ID
		// `$ne` (not equal) operator excludes the logged-in user's ID
		const filteredUsers = await User.find({
			_id: { $ne: myId }, // Exclude the logged-in user
		}).select("-password"); // Exclude the password field from the results

		res.json(filteredUsers);
	} catch (error) {
		console.log(error);

		res.status(500).json({ message: "Server error" });
	}
};

// Function to get messages between the logged-in user and another user
export const getMessages = async (req, res) => {
	// Destructure the `id` parameter from the request URL and rename it to `userToChatId`
	const { id: userToChatId } = req.params;

	// Extract the logged-in user's ID from the request object
	const myId = req.user._id;

	try {
		const messages = await Message.find({
			$or: [
				{
					senderId: myId,
					receiverId: userToChatId,
				},
				{
					senderId: userToChatId,
					receiverId: myId,
				},
			],
		});

		res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};

export const sendMessage = async (req, res) => {
	// Destructure the `id` parameter from the request URL and rename it to `userToChatId`
	const { id: receiverId } = req.params;

	// Extract the logged-in user's ID from the request object
	const senderId = req.user._id;

	const { text, image } = req.body;

	try {
		let imageUrl;
		if (image) {
			const uploadedResponse =
				await cloudinary.uploader.upload(image);
			imageUrl = uploadedResponse.secure_url;
		}

		const newMessage = await Message.create({
			senderId, // ID of the sender
			receiverId, // ID of the receiver
			text, // The message content
			image: imageUrl, // Optional image URL
		});

		// Get the socketId of the receiver
		const receiverSocketId =
			getReceiverSocketId(receiverId);

		// Check if the receiver is online
		if (receiverSocketId) {
			// Emit a "newMessage" event to the receiver
			io.to(receiverSocketId).emit(
				"newMessage",
				newMessage
			);
		}

		return res.json(newMessage);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};
