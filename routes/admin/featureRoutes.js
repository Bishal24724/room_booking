import express from "express";

import { isAuthenticated,isAdmin } from "../../middleware/authMiddleware.js";
import { createFeature,getSingleFeature,updateFeature,deleteFeature,getAllFeature } from "../../controllers/admin/featureController.js";

const router= express.Router();

router.post("/create",isAuthenticated,isAdmin,createFeature);
router.get("/all",isAuthenticated,isAdmin,getAllFeature);
router.get("/single/:id",isAuthenticated,isAdmin,getSingleFeature);
router.put("/update/:id",isAuthenticated,isAdmin,updateFeature);
router.delete("/delete/:id",isAuthenticated,isAdmin,deleteFeature);

export default router;