import express from "express";
import { createBook ,getMyBookingHistory} from "../../controllers/customer/bookController.js";
import { isCustomer,isAuthenticated, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Customer books a room
router.post("/booking/create", isAuthenticated, isCustomer, createBook);
router.post("/booking/history",isAuthenticated,isAdmin,getMyBookingHistory);


export default router;