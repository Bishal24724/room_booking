import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const facilitesModel=mongoose.model("Facility", facilitySchema);
export default facilitesModel;