import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true, select: false }, 
  type: { type: String, required: true, enum: ["single", "double", "suite"] },
  pricePerNight: { type: Number, required: true },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
  facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Facility" }],
  Pic: {
    public_id:{
      type:String,
    },
    url:{
      type:String,
    }
  },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const roomModel = mongoose.model("Room", roomSchema);

export default roomModel;