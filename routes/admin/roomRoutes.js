import express from "express";
import { isAuthenticated,isAdmin } from "../../middleware/authMiddleware.js";
import {createRoom,getAllRooms,deleteRoom, updateRoom,changeRoomAvailability} from "../../controllers/admin/roomController.js";
import { roomImageUpload } from "../../middleware/multer.js";


const router= express.Router();
router.post("/create",isAuthenticated,isAdmin,roomImageUpload,createRoom);
router.get("/all",isAuthenticated,isAdmin,getAllRooms);
 router.put("/update/:id",isAuthenticated,isAdmin,updateRoom);
router.delete("/delete/:id",isAuthenticated,isAdmin,deleteRoom);
router.put("/availability/:id", isAuthenticated, isAdmin, changeRoomAvailability);

export default router;