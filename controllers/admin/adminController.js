import userModel from "../../models/userModel.js";


export const registerController = async (req, res) => {
  try {
    
    const { name, email, password,role } = req.body;

   
    if (
      !name ||
      !email ||
      !password
     
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

   
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create user
    const user = await userModel.create({
      name,
      email,
      password,
       role
    });

    return res.status(200).json({
      message: "Registration successful",
      success: true,
      user, 
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

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    //check password

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }

    //token

    const token = user.generateToken();

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
        user,
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
      message: "Error in logout api",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation and update

    if (name) user.name = name;
    if (email) user.email = email;
  

    await user.save();
    res.status(200).send({
      success: true,
      message: "profile updated successfully",
      user,
    });
  } catch (error) {}
};



export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    //validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "please provide new or old password",
      });
    }

    // check old password
    const isMatch = await user.comparePassword(oldPassword);
    //validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid old password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {

  }
};




