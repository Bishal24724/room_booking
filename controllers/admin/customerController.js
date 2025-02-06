import customerModel from "../../models/customerModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getAllCustomer = async (req, res) => {
  try {
    const customer = await customerModel.find({});

    res.status(200).send({
      message: "Customer data fetched successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in api",
    });
  }
};

export const getSingleCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await customerModel.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Customer data fetched successfully",
      customer,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in api",
    });
  }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);
    if (!customer) {
      return res.status(404).send({
        success: false,
        message: "Customer not found",
      });
    }

    for (let index = 0; index < customer.profilePic.length; index++) {
      const image = customer.profilePic[index];
      const filePath = path.resolve(
        "uploads/profile-pics",
        image.url.split("/").pop()
      );

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(`Error deleting file: ${filePath}`, err);
          } else {
            console.log(`Successfully deleted ${filePath}`);
          }
        });
      } else {
        console.warn(`File does not exist: ${filePath}`);
      }
    }
    await customerModel.deleteOne({ _id: req.params.id });
    res.status(200).send({
      success: true,
      message: "Customer deleted successfully",
      customer,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in api",
    });
  }
};
