import featureModel from "../../models/facilitesModel.js";
import roomModel from "../../models/roomModel.js";

export const createFeature=async(req,res)=>{
   try {
        const {name}= req.body;
        if(!name){
            return res.status(400).json({message:"name is required"});
        }
        const newFeature=await featureModel.create({name});
        res.status(201).json({message:"feature created successfully",newFeature});

    
   } catch (error) {
         res.status(500).send({
            success:false,
            message:"Error in api",
            error,
         })
   }
}
export const getAllFeature=async(req,res)=>{
    try {
        const features=await featureModel.find({});
        res.status(200).send({
            success:true,
            features
    });

        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in api",
        })
        
    }
}
export const getSingleFeature= async(req,res)=>{
    try {
        const id=req.params.id;
        const feature=await featureModel.findById(id).populate("name");
        if(!feature){
            return res.status(404).json({
                success:false,
                message:"feature not found"});
            }
            res.status(200).json({
                success:true,
                message:"feature found successfully",feature});
        }catch(error){
            res.status(500).send({
                success:false,
                message:"Error in api",
                error,
        })
        }
    }

    export const updateFeature = async(req,res) => {
        try {
            const id = req.params.id;
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "name is required" });
                }
                const existingFeature = await featureModel.findById(id);
        if (!existingFeature) {
            return res.status(404).json({ message: "Feature not found" });
        }
                const updatedFeature = await featureModel.findByIdAndUpdate(id, { name }, { new: true });
                res.status(200).json({ message: "feature updated successfully", updatedFeature });

            
        } catch (error) {
            res.status(500).send({
                success:false,
                message:"Error in api",
                error,
            })
        }
        
    }

    export const deleteFeature = async(req,res)=>{
        try {
            const id= req.params.id;
            const feature=await featureModel.findById(id);
            if(!feature){
                return res.status(404).json({
                    success:false,
                    message:"feature not found"
                    });
                    }
                       //remove feature from room
                    await roomModel.updateMany(
                        { features: id }, 
                        { $pull: { features: id } }  
                    );
                    await featureModel.findByIdAndDelete(id);
                    res.status(200).json({ 
                        success:true,
                        message: "feature deleted successfully" });
            
        } catch (error) {
              res.status(500).send({
                success:false,
                message:"Error in api",
                error,
              })
        }
    }
    

