"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const tweet_1 = require("./routes/tweet");
const user_1 = require("./routes/user");
const auth_1 = require("./routes/auth");
const reply_1 = require("./routes/reply");
const like_1 = require("./routes/like");
const follow_1 = require("./routes/follow");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("./middlewares/cors"));
const morgan_1 = __importDefault(require("morgan"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const config_1 = __importDefault(require("config"));
const method_override_1 = __importDefault(require("method-override"));
(0, validateEnv_1.default)();
const app = (0, express_1.default)();
// Method override
app.use((0, method_override_1.default)("_method"));
// Static file
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("public", express_1.default.static(path_1.default.join(__dirname, "public/temp")));
// template engine
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
// Cors middleware
app.use(cors_1.default);
// Body parser
app.use(express_1.default.json());
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Logger
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/v1/auth", auth_1.router);
app.use("/v1/users", user_1.router);
app.use("/v1/tweets", tweet_1.router);
app.use("/v1/replies", reply_1.router);
app.use("/v1/", like_1.router);
app.use("/v1/", follow_1.router);
app.get("/ping", (req, res) => {
    res.send("pong");
});
// unhandled routes
// app.all("/*", (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(404, `Route ${req.originalUrl} not found`));
// });
// global error handler
app.use((err, req, res, next) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});
const port = config_1.default.get("port");
app.listen(port, () => {
    console.log(`Server running at port ${process.env.PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map