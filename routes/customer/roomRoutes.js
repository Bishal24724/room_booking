import express from "express";
import { getAllRooms,getSingleRoom } from "../../controllers/customer/roomController.js";
import { isAuthenticated, isAdmin } from "../../middleware/authMiddleware.js";

const router= express.Router();

router.get("/all",isAuthenticated,isAdmin,getAllRooms);
router.get("/single/:id",isAuthenticated,isAdmin,getSingleRoom);
export default router;