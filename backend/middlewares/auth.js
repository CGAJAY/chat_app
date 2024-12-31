import jwt from "jsonwebtoken";
// middleware to check if the user is authenticated
export const requiresAuthentication = async (
	req,
	res,
	next
) => {
	// Get the token from the cookie
	const token = req.cookies[process.env.AUTH_COOKIE_NAME];

	try {
		// if token is not provided, return a 401 status with an error message
		if (!token) {
			return res.status(401).json({
				message: "Unauthorized - no token provided",
			});
		}
		// Verify the token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET
		);

		if (!decoded) {
			return res.status(401).json({
				message: "Unauthorized - token is invalid",
			});
		}

		// Attach the user details to the request object
		req.user = decoded.user;

		// Proceed to the next middleware
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Server error" });
	}
};
