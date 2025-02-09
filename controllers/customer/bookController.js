import bookingModel from "../../models/bookingModel.js";
import roomModel from "../../models/roomModel.js";
import crypto from "crypto"; 
import { sendEmail } from "../../utils/sendEmail.js"; 


const generateConfirmationCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};



export const createBook = async (req, res) => {
  try {
      
  
    const { roomId, checkInDate, checkOutDate, person, name } = req.body;
    const customerId = req.user._id;
    const customerEmail = req.user.email; 
 
    if (!roomId || !checkInDate || !checkOutDate || !person || !name) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required."
       });
    }

const room = await roomModel.findById(roomId);
if (!room) {
  return res.status(404).json({ 
    success: false, 
    message: "Room not found"
   });
}

const existingBooking = await bookingModel.findOne({
    room: roomId,
    checkInDate: { $lte: checkOutDate },
    checkOutDate: { $gte: checkInDate },
  });

  if (existingBooking) {
    return res.status(400).json({ 
      success: false, 
      message: "Room is not available for the selected dates." 
    });
  }


    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();


    today.setHours(0, 0, 0, 0);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

  
    if (checkIn < today) {
      return res.status(400).json({
         success: false,
          message: "Check-in date must be today or a future date."
         });
    }
    if (checkOut <= checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-out date must be at least 1 day after check-in."
       });
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)); 
    const totalPrice = nights * room.pricePerNight;


    const confirmationCode = generateConfirmationCode();

   
    const newBooking = new bookingModel({
      customer: customerId,
      room: roomId,
      person,
      name,
      checkInDate,
      checkOutDate,
      totalPrice,
      confirmationCode, 
    });

    await newBooking.save();

    // Send email
    const emailContent = `
      Hello ${req.user.name},

      Your booking is confirmed!

      Booking Details:
      - Confirmation Code: ${confirmationCode}
      - Check-in Date: ${checkInDate}
      - Check-out Date: ${checkOutDate}
      - Total Price: NRS. ${totalPrice}

      Thank you for booking on our Hotel!

       Team Bishal Dhakal

      Note: This is an api testing and i have integrated email api for my recent project  room booking system. Please Don't take serious.
    `;

    await sendEmail(customerEmail, "Booking Confirmation - Hotel", emailContent);

    res.status(201).json({
      success: true,
      message: "Booking created successfully. Confirmation email sent.",
      booking: newBooking,
    });

  } catch (error) {
    res.status(500).json({
       success: false,
        message: "Error in api" });
  }
};

//customer booking history 
export const getMyBookingHistory=async(req,res)=>{

     const mybooking = await bookingModel.findById({customer:req.user._id}).populate("room").sort({checkInDate:-1});
      try{
    
     if(!mybooking.length){
      return res.status(404).json({success:false,
        message:"No booking found"});
     }

     res.status(200).json({
      success:true,
      mybooking,
     })
    }catch(error){
      res.status(500).json({
        success:false,
        message:"Error in api" });
    }
}
