
import Room from "../../models/roomModel.js";
import Feature from "../../models/featureModel.js";
import Facility from "../../models/facilitesModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


// Create new room
 export const createRoom = async (req, res) => {
  try {
    const { number, type, pricePerNight, features = [], facilities = [], isAvailable = true } = req.body;

   
    if (!number || !type || !pricePerNight) {
      return res.status(400).json({ message: "Number, type, and price per night are required" });
    }

    // Validate features
    if (features.length > 0) {
      const validFeatures = await Feature.find({ _id: { $in: features } });
      if (validFeatures.length !== features.length) {
        return res.status(400).json({ message: "Feature Not Found" });
      }
    }

    // Validate facilities
    if (facilities.length > 0) {
      const validFacilities = await Facility.find({ _id: { $in: facilities } });
      if (validFacilities.length !== facilities.length) {
        return res.status(400).json({ 
          success:true,
          message: "Facility Not Found" });
      }
    }
  // Validate files
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({
      success: false,
      message: "Room images are required",
    });
  }

   

  const Pic = req.files.map((file) => ({
    url: `/uploads/rooms/${file.filename}`
  }));

    const newRoom = await Room.create({
      number,
      type,
      pricePerNight,
      features,
      facilities,
      Pic,
      isAvailable,
    
    });

    res.status(200).json({
        message: "Room created successfully",
        newRoom,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        success:false,
        message: "Room number already exists" 
    });
    }
    res.status(500).json({ 
        success:false,
        message: error.message
     });
  }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .select('+number')
      .populate('features')
      .populate('facilities');

    res.status(200).json({
        success:true,
        rooms});
  } catch (error) {
    res.status(500).json({ 
        success:false,
        message: "Error in api",
    error, });
  }
};

// Get single room
export const getSingleRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .select('+number')
      .populate('features')
      .populate('facilities');

    if (!room) {
      return res.status(404).json({
        success:false,
        message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room availability
export const changeRoomAvailability = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true, runValidators: true }
    )
      .select('+number')
      .populate('features')
      .populate('facilities');

    if (!room) {
      return res.status(404).json({ 
        success:false,
        message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ 
      success:false,
      message: error.message });
  }
};


 export const updateRoom = async (req, res) => {
  try {
   
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }
    

    const { number, type, pricePerNight, features, facilities, isAvailable } = req.body;

    // Update room details if provided
    if (number) room.number = number;
    if (type) room.type = type;
    if (pricePerNight) room.pricePerNight = pricePerNight;
    if (features) room.features = features;
    if (facilities) room.facilities = facilities;
    if (isAvailable !== undefined) room.isAvailable = isAvailable;


    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/rooms/${file.filename}`,
      }));

    
      
      room.Pic.push(...newImages);
    }

    await room.save();

    res.status(200).send({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating room",
    
    });
  }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    for (let index = 0; index < room.Pic.length; index++) {
      const image = room.Pic[index];
      const filePath = path.resolve("uploads/rooms", image.url.split("/").pop());


      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
          } else {
            console.log(`Successfully deleted ${filePath}`);
          }
        });
      } else {
        console.warn(`File does not exist: ${filePath}`);
      }
    }

    await room.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in API",
      error: error.message,
    });
  }
};
