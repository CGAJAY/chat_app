import { Router } from "express";

const v2Router = Router();

// /api/v1/
v2Router.get("/", (req, res) => {
	res.json({
		message: "Hello from v2",
	});
});

export { v2Router };
