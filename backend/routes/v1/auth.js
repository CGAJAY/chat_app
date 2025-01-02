import { Router } from "express";
import {
	checkAuth,
	login,
	logout,
	signUp,
	updateProfile,
} from "../../controllers/auth.js";
import {
	validateLogin,
	validateSignUp,
} from "../../middlewares/authValidation.js";
import { requiresAuthentication } from "../../middlewares/auth.js";

const authRouter = Router();

// /api/v1/auth/
authRouter.get("/", (req, res) => {
	res.json({ message: "auth route" });
});

// /api/v1/auth/signup
authRouter.post("/signup", validateSignUp, signUp);

// /api/v1/auth/login
authRouter.post("/login", validateLogin, login);

// /api/v1/auth/logout
authRouter.delete("/logout", logout);

// /api/v1/auth/protected
authRouter.get(
	"/protected",
	requiresAuthentication,
	(req, res) => {
		res.json({ message: "Protected route" });
	}
);
// /api/v1/auth/check
authRouter.get("/check", checkAuth);

authRouter.put(
	"/update",
	requiresAuthentication,
	updateProfile
);

export { authRouter };
