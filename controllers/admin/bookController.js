import bookingModel from "../../models/bookingModel.js";
import { sendEmail } from "../../utils/sendEmail.js"; 
import mongoose from "mongoose";

export const getAllBook= async(req,res)=>{
    const book = await bookingModel.find({}).populate("room");

    if(!book){
        res.status(404).json({
            success:false,
            message:"No booking found"
        });
    }

    res.status(200).json({
        success:true,
        book
    })

}
export const cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { message } = req.body;  
      const booking = await bookingModel.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
  
  
      booking.status = "cancelled";
      await booking.save();
  
    
      const customer = await mongoose.model('Customer').findById(booking.customer); 
  
      const emailContent = `
        Hello ${customer.name},
  
        We regret to inform you that your booking has been cancelled.
  
        Booking Details:
        - Confirmation Code: ${booking.confirmationCode}
        - Check-in Date: ${booking.checkInDate}
        - Check-out Date: ${booking.checkOutDate}
        - Total Price: NRS. ${booking.totalPrice}
  
        ${message ? ` ${message}` : ''}  
  
        If you have any questions, feel free to contact us.
  
        Thank you for your understanding!
  
        Team Bishal Dhakal

        Note: this is an api testing using gmail integration. Dont take it serious.
      `;
  

      await sendEmail(customer.email, "Booking Cancellation Notice - Hotel", emailContent);
  
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully and cancellation email sent.",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };


  
  
