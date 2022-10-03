import { Router } from "express";
import * as retals from "../controllers/rentalsControllers.js"

const router = Router()

router.get("/rentals", retals.listRentals);
router.post("/rentals", retals.createRentals);
router.post("/rentals/:id/return", retals.finishRentals);
router.delete("/rentals/:id", retals.deleteRentals);

export default router;