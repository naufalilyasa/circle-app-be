import cors from "cors";
import "dotenv/config";

const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
