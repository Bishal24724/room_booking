 import express from "express";
 import { isAuthenticated,isAdmin } from "../../middleware/authMiddleware.js";
 import { createFacility,getAllFacility,getSingleFacility,updateFacility,deleteFacility } from "../../controllers/admin/facilitiesController.js";

 const router= express.Router();

 router.post("/create",isAuthenticated,isAdmin,createFacility);
 router.get("/all",isAuthenticated,isAdmin,getAllFacility);
 router.get("/single/:id",isAuthenticated,isAdmin,getSingleFacility);
 router.put("/update/:id",isAuthenticated,isAdmin,updateFacility);
 router.delete("/delete/:id",isAuthenticated,isAdmin,deleteFacility);

 export default router;