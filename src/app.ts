import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { router as tweetRoutes } from "./routes/tweet";
import { router as userRoutes } from "./routes/user";
import { router as authRoutes } from "./routes/auth";
import { router as replyRoutes } from "./routes/reply";
import { router as likeRoutes } from "./routes/like";
import { router as followRoutes } from "./routes/follow";
import path from "path";
import corsMiddleware from "./middlewares/cors";
import morgan from "morgan";
import AppError from "./utils/appError";
import validateEnv from "./utils/validateEnv";
import config from "config";
import methodOverride from "method-override";

validateEnv();

const app = express();

// Method override
app.use(methodOverride("_method"));

// Static file
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("public", express.static(path.join(__dirname, "public/temp")));

// template engine
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

// Cors middleware
app.use(corsMiddleware);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logger
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/replies", replyRoutes);
app.use("/api/v1/", likeRoutes);
app.use("/api/v1/", followRoutes);
app.get("/ping", (req, res) => {
  res.send("pong");
});

// unhandled routes
// app.all("/*", (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(404, `Route ${req.originalUrl} not found`));
// });

// global error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// const port = config.get<number>("port");

// app.listen(port, () => {
//   console.log(`Server running at port ${process.env.PORT}`);
// });

export default app;
