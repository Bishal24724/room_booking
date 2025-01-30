import customerModel from "../../models/customerModel.js";
import fs from "fs";


export const registerController = async (req, res) => {
  try {
    
    const { name, email, password, address, city, country, phone } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

   
    const existingCustomer = await customerModel.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create user
    const customer = await customerModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone
    });

    return res.status(200).json({
      message: "Registration successful",
      success: true,
      customer, 
    });
  } catch (error) {
    console.log("Error:", error);

   
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error while registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const customer = await customerModel.findOne({ email });

    if (!customer) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    //check password

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }

    //token

    const token = customer.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "logged in successfully",
        token,
        customer,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error is in login api",
      error,
    });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.customer._id);
    customer.password = undefined;
    res.status(200).send({
      success: true,
      message: "customer profile fetched successfully",
      customer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile api",
      error,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "logout successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile api",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.customer._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation and update

    if (name) customer.name = name;
    if (email) customer.email = email;
    if (address) customer.address = address;
    if (city) customer.city = city;
    if (country) customer.country = country;
    if (phone) customer.phone = phone;

    await customer.save();
    res.status(200).send({
      success: true,
      message: "profile updated successfully",
      customer,
    });
  } catch (error) {}
};



export const updatePasswordController = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.customer._id);
    const { oldPassword, newPassword } = req.body;

    //validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "please provide new or old password",
      });
    }

    // check old password
    const isMatch = await customer.comparePassword(oldPassword);
    //validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid old password",
      });
    }
    customer.password = newPassword;
    await customer.save();
    res.status(200).send({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {}
};


export const updateProfilePicController = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.customer._id);

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No file uploaded",
      });
    }

   
    if (customer.profilePic?.url) {
      const oldFilePath = `./${customer.profilePic.url}`;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    
    customer.profilePic = {
      public_id: req.file.filename, 
      url: req.file.path, 
    };

    await customer.save();

    res.status(200).send({
      success: true,
      message: "Profile picture updated successfully",
      customer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile picture update API",
      error,
    });
  }
};


