import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";
import { Readable } from "stream";

(async function initCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
})();

export const cloudinaryFolderName = "circle-app-image-storage";

const uploadOnCloudinary = async (buffer: Buffer): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: cloudinaryFolderName,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary", error);
          return reject(null);
        }
        if (!result?.secure_url) return reject(null);

        console.log("Upload success:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export default uploadOnCloudinary;
