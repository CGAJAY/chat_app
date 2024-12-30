import User from "../db/models/user.js";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/generateJWT.js";
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
			createdAt,
			updatedAt,
			__v,
			...userWithoutPassword
		} = user.toObject();

		// pass the res object to create a cookie containing the jwt
		// Generate JWT token with filtered user details (no sensitive info)
		generateJwtToken(res, userWithoutSensitiveFields);

		// Respond with the filtered user details and a success message
		res.status(200).json(userWithoutSensitiveFields);

		// Respond with the filtered user details and a success message
		res.status(200).json(userWithoutPassword);
	} catch (error) {
		console.log(error);
		// Return generic server error message
		res.status(500).json({ message: "Server error" });
	}
};
export const logout = (req, res) => {
	res.json({ message: "logout" });
};