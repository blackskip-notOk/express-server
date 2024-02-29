import { Router } from "express";
import { API_PING } from "../../constants/api";

export const pingRouter = Router();

pingRouter.get(API_PING, (_req, res) => {
	res.send("Pong!");
});
