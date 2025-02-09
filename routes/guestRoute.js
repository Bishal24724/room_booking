import express from "express";
import { getAllRooms,getSingleRoom,getRoomByType,getRoomByPrice } from "../controllers/guestController.js";

const router= express.Router();

router.get("/all",getAllRooms);
router.get("/single/:id",getSingleRoom);
router.get("/type",getRoomByType);
router.get("/price",getRoomByPrice);
export default router;

