import express from "express";
import { registerController, loginController, logoutController, updateProfileController, updatePasswordController,updateProfilePicController } from "../../controllers/customer/customerController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";  
import { singleUpload } from "../../middleware/multer.js";

const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", isAuthenticated, logoutController);
router.put("/profile-update", isAuthenticated, updateProfileController);
router.put("/update-password", isAuthenticated, updatePasswordController);
router.put('/update-picture',isAuthenticated,singleUpload,updateProfilePicController);
export default router;
