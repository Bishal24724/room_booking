
import multer from "multer";
import path from "path";
import fs from "fs";

// Helper function to create upload directories dynamically
const makeUploadDir = (folder) => {
  const uploadDir = path.join("uploads", folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};


const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = makeUploadDir("profile-pics"); 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});


//room image 
// Storage configuration for room images
const roomImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = makeUploadDir("rooms"); 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});



export const singleUpload = multer({ storage: profilePicStorage }).single("file");

export const roomImageUpload = multer({ 
  storage: roomImageStorage 
}).array("files", 10); 



