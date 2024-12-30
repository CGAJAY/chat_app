import { Router } from "express";
import {
	login,
	logout,
	signUp,
} from "../../controllers/auth.js";
import {
	validateLogin,
	validateSignUp,
} from "../../middlewares/authValidation.js";

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

export { authRouter };
