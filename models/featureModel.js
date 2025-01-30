import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true,
      unique: true
     },
}, { timestamps: true });

export default mongoose.model("Feature", featureSchema);