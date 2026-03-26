import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

cloudinary.config({
  cloud_name: ENV.CLOUADINARY_CLOUD_NAME,
  api_key: ENV.CLOUADINARY_API_KEY,
  api_secret: ENV.CLOUADINARY_API_SECRET,
});

export default cloudinary;
