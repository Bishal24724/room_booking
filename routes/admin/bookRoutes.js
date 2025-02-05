import express from "express";
import { isAuthenticated,isAdmin } from "../../middleware/authMiddleware.js";
 import { cancelBooking } from "../../controllers/admin/bookController.js";

 const router= express.Router();
 router.put("/cancel/:bookingId",isAuthenticated, isAdmin, cancelBooking);

 export default router;
