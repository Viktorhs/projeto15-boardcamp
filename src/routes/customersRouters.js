import { Router } from "express";
import * as customers from "../controllers/customersControllers.js"

const router = Router()

router.get("/customers", customers.listCustomers);
router.get("/customers/:id", customers.searchCustomerId);
router.post("/customers", customers.createCustomer);
router.put("/customers/:id", customers.updateCustomer);

export default router;