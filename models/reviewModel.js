import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }
}, { timestamps: true });

const reviewModel= mongoose.model("Review", reviewSchema);

export default reviewModel;
