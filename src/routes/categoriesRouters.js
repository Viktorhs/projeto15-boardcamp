import {Router} from 'express';
import * as categories from "../controllers/categoriesControllers.js";

const router = Router();

router.get("/categories", categories.listCategories);
router.post("/categories", categories.createCategorie);

export default router;