import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { router as tweetRoutes } from "./routes/tweet";
import { router as userRoutes } from "./routes/user";
import { router as authRoutes } from "./routes/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", tweetRoutes, userRoutes, authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
