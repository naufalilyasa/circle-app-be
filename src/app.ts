import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { router as tweetRoutes } from "./routes/tweet";
import { router as userRoutes } from "./routes/user";
import { router as authRoutes } from "./routes/auth";
import path from "path";

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", tweetRoutes, userRoutes, authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
