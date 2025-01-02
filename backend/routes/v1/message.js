import { Router } from "express";
import { requiresAuthentication } from "../../middlewares/auth.js";
import {
	getMessages,
	getUsersForSidebar,
	sendMessage,
} from "../../controllers/message.js";

const messageRouter = Router();

// /api/v1/messgae/
messageRouter.get("/", (req, res) => {
	res.json({ message: "message route" });
});

// /api/v1/message/users
messageRouter.get(
	"/users",
	requiresAuthentication,
	getUsersForSidebar
);

// /api/v1/message/:id
messageRouter.get(
	"/:id",
	requiresAuthentication,
	getMessages
);

// /api/v1/message/:id
messageRouter.post(
	"/send/:id",
	requiresAuthentication,
	sendMessage
);
export { messageRouter };
