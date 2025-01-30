import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"
import customerModel from "../models/customerModel.js"

export const isAuthenticated = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        console.log(token);
        if(!token) return res.status(401).json({
            success:false,
            message:"Please login to access this"
        })
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin/staff or a customer
    let user = await userModel.findById(decodedData._id);
    if (!user) {
      user = await customerModel.findById(decodedData._id);
    }

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Attach user data to request
    next();
  } catch (error) {
    console.log("Please login first");
    res.status(401).send({
      success: false,
      message: "Please login first",
      error: error.message,
    });
  }
};


export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      success: false,
      message: "Only Admins allowed.",
    });
  }
  next();
};

export const isStaff = async (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).send({
      success: false,
      message: "Access denied. Staff only.",
    });
  }
  next();
};


export const isCustomer = async (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).send({
      success: false,
      message: "only customer allowed",
    });
  }
  next();
};
