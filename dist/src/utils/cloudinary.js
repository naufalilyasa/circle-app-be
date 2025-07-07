"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryFolderName = void 0;
const cloudinary_1 = require("cloudinary");
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
(function initCloudinary() {
    return __awaiter(this, void 0, void 0, function* () {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
    });
})();
exports.cloudinaryFolderName = "circle-app-image-storage";
const uploadOnCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!file)
            return null;
        const result = yield cloudinary_1.v2.uploader.upload(file, {
            folder: exports.cloudinaryFolderName,
            resource_type: "image",
        });
        console.log("File uploaded successfully", result.url);
        if (fs_1.default.existsSync(file)) {
            fs_1.default.unlinkSync(file);
            console.log("Local file cleaned up", file);
        }
        else {
            console.warn("Local file not found for cleaned up", file);
        }
        return result.url;
    }
    catch (error) {
        console.error("Error uploading to cloudinary", error);
        if (fs_1.default.existsSync(file)) {
            fs_1.default.unlinkSync(file);
            console.log("Local file cleaned up", file);
        }
        else {
            console.warn("Local file not found for cleaned up", file);
        }
        return null;
    }
});
exports.default = uploadOnCloudinary;
//# sourceMappingURL=cloudinary.js.map