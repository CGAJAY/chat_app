import User from "../db/models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import { generateJwtToken } from "../utils/generateJWT.js";
import jwt from "jsonwebtoken";
export const signUp = async (req, res) => {
	const { fullName, email, password } = req.body;
	try {
		// Check if a user with the provided email already exists in the database
		const userExists = await User.findOne({ email });

		// If a user with the same email is found, return a 400 Bad Request response with an error message
		if (userExists) {
			return res
				.status(400)
				.json({ message: "Email already exists" });
		}

		// Generate a salt for password hashing
		// Ensures hashed password are unique even if two users have same password
		const salt = bcrypt.genSaltSync(10);
		// Hashing the password using the generated salt
		const hashedPassword = bcrypt.hashSync(password, salt);

		// Create a new user in the database with the provided data
		const newUser = await User.create({
			fullName,
			email,
			// Store hashed password instead of plain password
			password: hashedPassword,
		});

		// Return success response with user details
		res.status(201).json({
			_id: newUser._id, // Return the user's unique ID
			fullName: newUser.fullName, // Return the registered first name
			email: newUser.email, // Return the registered email
			password: newUser.password,
		});
	} catch (error) {
		console.log(error);
		// Return generic server error message
		res.status(500).json({ message: "Server error" });
	}
};
export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// Check if a user with this username exists in the database
		const user = await User.findOne({ email });

		// If no user is found, return a 400 status with an error message
		if (!user) {
			return res.status(400).json({
				message: "Incorrect Credentials. - email",
			});
		}

		// Compare the provided password with the stored hashed password
		const isPasswordMatch = await bcrypt.compare(
			password,
			user.password
		);

		// If the password is incorrect, return a 400 status with an error message
		if (!isPasswordMatch) {
			return res.status(400).json({
				message: "Incorrect credentials - password.",
			});
		}

		// Destructure out unwanted fields and create a new user object
		const {
			password: _,
			updatedAt,
			__v,
			...userWithoutSensitiveFields
		} = user.toObject();

		// pass the res object to create a cookie containing the jwt
		// Generate JWT token with filtered user details (no sensitive info)
		generateJwtToken(res, userWithoutSensitiveFields);

		// Respond with the filtered user details
		res.status(200).json(userWithoutSensitiveFields);
	} catch (error) {
		console.log(error);
		// Return generic server error message
		res.status(500).json({ message: "Server error" });
	}
};

// Logout function to clear the authentication cookie and respond
export const logout = async (req, res) => {
	try {
		// Clear the authentication cookie
		res.clearCookie(process.env.AUTH_COOKIE_NAME);

		// Respond with a success message
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.log(error);
		// Return generic server error message
		res
			.status(500)
			.json({ message: "An error occurred during logout" });
	}
};

export const updateProfile = async (req, res) => {
	const { profilePic } = req.body;
	const userId = req.user._id;
	try {
		if (!profilePic) {
			return res.status(400).json({
				message: "Profile picture is required",
			});
		}

		// Upload the profile picture to Cloudinary
		const uploadedResponse =
			await cloudinary.uploader.upload(profilePic);

		// Update the user's profile picture in the database
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				profilePic: uploadedResponse.secure_url,
			},
			{ new: true }
		);

		// Respond with the updated user details
		res.status(200).json(updatedUser);
		console.log(updatedUser);
	} catch (error) {
		console.log("Error in profile update", error);
		res.status(500).json({ message: "Server error" });
	}
};
export const checkAuth = async (req, res) => {
	// Get the JWT (token) from the cookies
	const token = req.cookies[process.env.AUTH_COOKIE_NAME];
	console.log("this is my token", token);
	try {
		if (!token) {
			return res
				.status(401)
				.json({ error: "Not authenticated" });
		}
		console.log("this is my token2", token);

		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET
		);
		console.log("this is my token3", token);
		return res.status(200).json(payload.user);
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
};
