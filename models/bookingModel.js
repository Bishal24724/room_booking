import mongoose from "mongoose";

 
const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    person: {
      type: String, 
      required: true,
    },
    name: [
      {
        type: String, 
        required: true,
      },
    ],
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,  
      required: true,
    },
    confirmationCode: {
      type: String,  
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum:  ["confirmed", "cancelled"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentDate: {
      type:Date
    }
  },

  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;

