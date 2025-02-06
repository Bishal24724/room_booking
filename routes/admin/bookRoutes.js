import express from "express";
import { isAuthenticated,isAdmin } from "../../middleware/authMiddleware.js";
 import { cancelBooking,getAllBook,searchBookingByName,deleteBooking,getSingleBooking,updatePaymentStatus } from "../../controllers/admin/bookController.js";

 const router= express.Router();
 router.get("/get-all",isAuthenticated,isAdmin,getAllBook);
 router.put("/cancel/:bookingId",isAuthenticated, isAdmin, cancelBooking);
 router.get("/search",isAuthenticated,isAdmin,searchBookingByName);
 router.delete("/delete/:id",isAuthenticated,isAdmin,deleteBooking);
 router.get("/search/:id",isAuthenticated,isAdmin,getSingleBooking);
 router.put("/payment/:id",isAuthenticated,isAdmin,updatePaymentStatus);

 export default router;
