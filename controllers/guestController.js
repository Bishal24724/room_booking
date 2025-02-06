import Room from "../../models/roomModel.js";
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

  