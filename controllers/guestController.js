import { parse } from "dotenv";
import Room from "../models/roomModel.js";
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .select("+number")
      .populate("features")
      .populate("facilities");

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in api",
      error,
    });
  }
};

export const getSingleRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .select("+number")
      .populate("features")
      .populate("facilities");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).send({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in api",
    });
  }
};

//search by price
export const getRoomByPrice = async (req, res) => {
  try {
    const { minprice, maxprice } = req.query;

    const min = parseFloat(minprice) || 0;
    const max = parseFloat(maxprice) || Number.MAX_VALUE;

    const room = await Room.find({
      pricePerNight: { $gte: min, $lte: max },
    })
      .select("+number")
      .populate("features")
      .populate("facilities");

    if (!room.length) {
     return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).send({
      success: true,
      room,
    });
  } catch (error) {
   return res.status(500).send({
      success: false,
      message: "Error in api",
    });
  }
};

// search by room type

export const getRoomByType= async(req,res)=>{
  try {
    const {type}= req.query;

     if(!type){

      return res.status(404).send({
        success:false,
        message:"Provide Room Type"
      })
     }

    const room= await Room.find({
      type: { $regex: new RegExp("^" + type + "$", "i") },
      isAvailable:true
    }).select("+number").populate("facilities").populate("features");

    if(!room.length){
      return res.status(404).send({
        success:false,
        message:"Room not available"
      })
    }

    res.status(200).send({
      success:true,
      room
    });
    
  } catch (error) {
       res.status(500).send({
        success:false,
        message:"Error in api"
       });   
  }
}


