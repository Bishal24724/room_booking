import express from "express";
import { createBook } from "../../controllers/customer/bookController.js";
import { isCustomer,isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Customer books a room
router.post("/booking/create", isAuthenticated, isCustomer, createBook);

export default router;