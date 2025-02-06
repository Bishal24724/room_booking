import express from "express";
import { getAllRooms,getSingleRoom } from "../controllers/guestController";

const router= express.Router();

router.get("/all",getAllRooms);
router.get("/single/:id",getSingleRoom);
export default router;