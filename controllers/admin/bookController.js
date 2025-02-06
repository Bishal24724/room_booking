import bookingModel from "../../models/bookingModel.js";
import customerModel from "../../models/customerModel.js";
import { sendEmail } from "../../utils/sendEmail.js";
import mongoose from "mongoose";

//get all booking details
export const getAllBook = async (req, res) => {
  const book = await bookingModel.find({}).populate("room customer");

  if (!book) {
    res.status(404).json({
      success: false,
      message: "No booking found",
    });
  }

  res.status(200).json({
    success: true,
    book,
  });
};

//get details about particular booking

export const getSingleBooking = async (req, res) => {
  try {
    const booking = await bookingModel
      .findById(req.params.id)
      .populate("room customer");
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "No booking found",
      });
    }
    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in api",
    });
  }
};



//cancel booking by admin
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { message } = req.body;
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    const customer = await mongoose
      .model("Customer")
      .findById(booking.customer);

    const emailContent = `
        Hello ${customer.name},
  
        We regret to inform you that your booking has been cancelled.
  
        Booking Details:
        - Confirmation Code: ${booking.confirmationCode}
        - Check-in Date: ${booking.checkInDate}
        - Check-out Date: ${booking.checkOutDate}
        - Total Price: NRS. ${booking.totalPrice}
  
        ${message ? ` ${message}` : ""}  
  
        If you have any questions, feel free to contact us.
  
        Thank you for your understanding!
  
        Team Bishal Dhakal

        Note: this is an api testing using gmail integration. Do not take it serious.
      `;

    await sendEmail(
      customer.email,
      "Booking Cancellation Notice - Hotel",
      emailContent
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully and cancellation email sent.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//search booking by customer name
export const searchBookingByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide customer name",
      });
    }

    const customers = await customerModel.find({
      name: { $regex: new RegExp(name, "i") },
    });

    if (!customers.length) {
      return res.status(404).json({
        success: false,
        message: `No customer found with the name "${name}".`,
      });
    }

    const customerIds = customers.map((customer) => customer._id);

    const bookings = await bookingModel
      .find({
        customer: { $in: customerIds },
      })
      .populate("customer room");

    if (!bookings.length) {
      return res.status(404).json({
        success: false,
        message: `No bookings found for customer "${name}".`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully.",
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in api",
      error: error.message,
    });
  }
};

//delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    await bookingModel.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in api",
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }



    if (booking.paymentStatus == "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment status is already paid",
      });
    }

    booking.paymentStatus = "paid";
    booking.paymentDate= new Date(); 
    await booking.save();
    res.status(200).send({
      success: true,
      message: "Payment status updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in api",
    });
  }
};
