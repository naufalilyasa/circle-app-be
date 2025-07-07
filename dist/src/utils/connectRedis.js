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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
require("dotenv/config");
const redisUrl = process.env.REDIS_URL;
const redisClient = (0, redis_1.createClient)({
    url: redisUrl,
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!redisClient.isOpen) {
            yield redisClient.connect();
            console.log("✅ Redis connected successfully");
            yield redisClient.set("try", "Hello welcome to my app");
        }
        else {
            console.log("ℹ️ Redis already connected");
        }
    }
    catch (error) {
        console.log(error);
        setTimeout(connectRedis, 5000);
    }
});
connectRedis();
exports.default = redisClient;
//# sourceMappingURL=connectRedis.js.map