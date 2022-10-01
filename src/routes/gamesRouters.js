import { Router } from "express";
import * as games from "../controllers/gamesControllers.js"

const router = Router()

router.get("/games", games.listGames);
router.post("/games", games.createGame);

export default router;