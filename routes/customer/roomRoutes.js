import express from "express";
import { getAllRooms,getSingleRoom,getRoomByType,getRoomByPrice } from "../../controllers/customer/roomController.js";
import { isAuthenticated, isCustomer } from "../../middleware/authMiddleware.js";

const router= express.Router();

router.get("/all",isAuthenticated,isCustomer,getAllRooms);
router.get("/single/:id",isAuthenticated,isCustomer,getSingleRoom);
router.get("/type",isAuthenticated,isCustomer,getRoomByType);
router.get("/price",isAuthenticated,isCustomer,getRoomByPrice);



export default router;