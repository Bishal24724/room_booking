import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
    },
    email: {
      type: String,
      required: ["true", "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: ["true", "Password is required"],
      minLength: [6, "password length must be greater than 6 character"],
    },
    address: {
      type: String,
      required: ["true", "Address is required"],
    },
    city: {
      type: String,
      required: ["true", "City is required"],
    },
    country: {
      type: String,
      required: ["true", "Country is required"],
    },
    phone: {
      type: String,
      required: ["true", "Phone is required"],
    },
    profilePic: {
      public_id:{
        type:String,
      },
      url:{
        type:String,
      }
    },
    role:{
      type:String,
      default:"customer"
    }
  },
  { timestamps: true }
);



// Hash function
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 10);
  next();
});




//comparing hash password with plain password during login
customerSchema.methods.comparePassword= async function(plainPassword){
    return await bcrypt.compare(plainPassword,this.password);
};

//jwt token

customerSchema.methods.generateToken= function(){
  return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
    expiresIn:"7d",
  });
}


 const customerModel= mongoose.model("Customer",customerSchema);
 export default customerModel;


 