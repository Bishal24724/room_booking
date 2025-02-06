import express from "express";
import { getAllCustomer,getSingleCustomer,deleteCustomer } from "../../controllers/admin/customerController.js";
import { isAdmin, isAuthenticated } from "../../middleware/authMiddleware.js";  

const router = express.Router();

router.get("/all",isAuthenticated,isAdmin,getAllCustomer);
router.get("/:id",isAdmin,isAuthenticated,getSingleCustomer);
router.delete("/delete/:id",isAuthenticated,isAdmin,deleteCustomer);

export default router;
