import express from "express";
import { registerController, loginController, logoutController, updateProfileController, updatePasswordController } from "../../controllers/admin/adminController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";  

const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", isAuthenticated, logoutController);
router.put("/profile-update", isAuthenticated, updateProfileController);
router.put("/update-password", isAuthenticated, updatePasswordController);

export default router;
