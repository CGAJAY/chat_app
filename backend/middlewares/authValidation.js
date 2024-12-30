// Function to validate user details during signUp
export const validateSignUp = (req, res, next) => {
	const { fullName, email, password } = req.body;
	try {
		// Check if all fields are provided
		if (!fullName || !email || !password) {
			return res
				.status(400)
				.json({ message: "All fields are required" });
		}

		// Check if full name is an emty string
		if (fullName.trim() === "") {
			return res
				.status(400)
				.json({ message: "First name can't be empty" });
		}

		// Validate the email format using a regular expression (regex)
		const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.json({ message: "Email is invalid" });
		}

		// Password validation
		if (password.length < 6) {
			return res.status(400).json({
				message:
					"Password must be atleast 6 characters long",
			});
		}

		let hasLowerCase = false;
		let hasUpperCase = false;
		let hasNumber = false;

		// Iterate through each char in the password
		for (let i = 0; i < password.length; i++) {
			let char = password[i];
			if (char >= "a" && char <= "z") {
				hasLowerCase = true;
			} else if (char >= "A" && char <= "Z") {
				hasUpperCase = true;
			} else if (char >= "0" && char <= "9") {
				hasNumber = true;
			}
		}

		// Check if all conditions are met
		if (!hasLowerCase || !hasUpperCase || !hasNumber) {
			return res.status(400).json({
				message:
					"Password must contain at least one lowercase letter, one uppercase letter and one number",
			});
		}

		// Call the next middleware function if all validations pass
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Server error." });
	}
};

// Function to validate user details during login
export const validateLogin = (req, res, next) => {
	const { email, password } = req.body;
	try {
		// Check if email and password are provided
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "All fields are required" });
		}

		// Check if the email is an empty string
		if (email.trim() === "") {
			return res
				.status(400)
				.json({ message: "Email cannot be empty" });
		}

		// Check if the password is greater than 5 characters
		if (password.length < 6) {
			return res.status(400).json({
				message:
					"Password must Must have More than 5 characters",
			});
		}

		// Call the next middleware function if all validations pass
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Server error." });
	}
};
