import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";

(async function initCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
})();

export const cloudinaryFolderName = "circle-app-image-storage";

const uploadOnCloudinary = async (file: string): Promise<string | null> => {
  try {
    if (!file) return null;

    const result = await cloudinary.uploader.upload(file, {
      folder: cloudinaryFolderName,
      resource_type: "image",
    });

    console.log("File uploaded successfully", result.url);

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log("Local file cleaned up", file);
    } else {
      console.warn("Local file not found for cleaned up", file);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to cloudinary", error);

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log("Local file cleaned up", file);
    } else {
      console.warn("Local file not found for cleaned up", file);
    }

    return null;
  }
};

export default uploadOnCloudinary;
