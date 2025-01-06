import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
	const [text, setText] = useState(""); // State to store the message text
	// State to store the image preview
	const [imagePreview, setImagePreview] = useState(null);
	const fileInputRef = useRef(null); // Reference to the file input element
	const { sendMessage } = useChatStore(); // Function to send a message

	// Function to handle image selection and preview
	const handleImageChange = (e) => {
		const file = e.target.files[0]; // Get the selected file
		// Check if the file is an image file
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		// Create a new file reader to read the image
		const reader = new FileReader();
		reader.onloadend = () => {
			// Set the image preview when reading is complete
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file); // Read the image as a data URL
	};

	// Function to remove the image preview
	const removeImage = () => {
		setImagePreview(null); // Clear the image preview
		if (fileInputRef.current)
			fileInputRef.current.value = ""; // Clear the file input value
	};

	// Function to handle sending a message
	const handleSendMessage = async (e) => {
		e.preventDefault();
		// Don't send empty messages
		if (!text.trim() && !imagePreview) return;

		try {
			// Send the message using the sendMessage function from the store
			await sendMessage({
				text: text.trim(), // Trim the message text
				image: imagePreview, // Send the image preview if it exists
			});

			// Clear form fields and image preview after sending the message
			setText("");
			setImagePreview(null);
			if (fileInputRef.current)
				fileInputRef.current.value = ""; // Clear the file input value
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	return (
		<div className="p-4 w-full">
			{/* If there's an image preview, show it with an option to remove it */}
			{imagePreview && (
				<div className="mb-3 flex items-center gap-2">
					<div className="relative">
						<img
							src={imagePreview}
							alt="Preview"
							className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
						/>
						{/* Button to remove the image */}
						<button
							onClick={removeImage}
							className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
							type="button"
						>
							{/* Close icon to remove image */}
							<X className="size-3" />{" "}
						</button>
					</div>
				</div>
			)}
			{/* Form to send a message */}
			<form
				onSubmit={handleSendMessage}
				className="flex items-center gap-2"
			>
				<div className="flex-1 flex gap-2">
					{/* Text input for message */}
					<input
						type="text"
						className="w-full input input-bordered rounded-lg input-sm sm:input-md"
						placeholder="Type a message..."
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					{/* Hidden file input to select an image */}
					<input
						type="file"
						accept="image/*"
						className="hidden"
						ref={fileInputRef} // Reference to the file input element
						onChange={handleImageChange}
					/>
					{/* Button to open the file input dialog */}
					<button
						type="button"
						className={`hidden sm:flex btn btn-circle
                     ${
												imagePreview
													? "text-emerald-500"
													: "text-zinc-400"
											}`}
						// fileInputRef.current?.click(), simulates a click on the hidden file input field (<input type="file" />).
						// This opens the file dialog to select an image.
						onClick={() => fileInputRef.current?.click()}
					>
						{/* Image icon for selecting an image */}
						<Image size={20} />{" "}
					</button>
				</div>
				{/* Button to send the message */}
				<button
					type="submit"
					className="btn btn-sm btn-circle"
					disabled={!text.trim() && !imagePreview}
				>
					<Send size={22} /> {/* Send icon */}
				</button>
			</form>
		</div>
	);
};
export default MessageInput;
