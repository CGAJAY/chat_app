import { Schema, model } from "mongoose";

// User Schema
const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		profilePic: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true } // Enable timestamps
);

const User = model("User", userSchema);
export default User;
