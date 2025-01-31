import facilitesModel from "../../models/facilitesModel.js";
import roomModel from "../../models/roomModel.js";

export const createFacility=async(req,res)=>{
   try {
        const {name}= req.body;
        if(!name){
            return res.status(400).json({message:"name is required"});
        }
        const newFacility=await facilitesModel.create({name});
        res.status(201).json({message:"facility created successfully",newFacility});

    
   } catch (error) {
         res.status(500).send({
            success:false,
            message:"Error in api",
            error,
         })
   }
}

export const getSingleFacility= async(req,res)=>{
    try {
        const id=req.params.id;
        const facility=await facilitesModel.findById(id);
        if(!facility){
            return res.status(404).json({
                success:false,
                message:"facility not found"});
            }
            res.status(200).json({
                success:true,
                message:"facility found successfully",facility});
        }catch(error){
            res.status(500).send({
                success:false,
                message:"Error in api",
                error,
        })
        }
    }

    export const getAllFacility=async(req,res)=>{
        try {
            const facility=await facilitesModel.find({});
            res.status(200).send({
                success:true,
                facility
        });
    
            
        } catch (error) {
            res.status(500).send({
                success:false,
                message:"Error in api",
            })
            
        }
    }

    export const updateFacility = async(req,res) => {
        try {
            const id = req.params.id;
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "name is required" });
                }
                const existingFacility = await facilitesModel.findById(id);
        if (!existingFacility) {
            return res.status(404).json({ message: "Facility not found" });
        }
                const updatedFacility = await facilitesModel.findByIdAndUpdate(id, { name }, { new: true });
                res.status(200).json({ message: "facility updated successfully", updatedFacility });

            
        } catch (error) {
            res.status(500).send({
                success:false,
                message:"Error in api",
                error,
            })
        }
        
    }

    
    export const deleteFacility = async(req,res)=>{
        try {
            const id= req.params.id;
            const facility=await facilitesModel.findById(id);
            if(!facility){
                return res.status(404).json({
                    success:false,
                    message:"facility not found"
                    });
                    }
                       //remove facility from room
                    await roomModel.updateMany(
                        { facilities: id }, 
                        { $pull: { facilities: id } }  
                    );
                    await facilitesModel.findByIdAndDelete(id);
                    res.status(200).json({ 
                        success:true,
                        message: "facility deleted successfully" });
            
        } catch (error) {
              res.status(500).send({
                success:false,
                message:"Error in api",
                error,
              })
        }
    }
    

