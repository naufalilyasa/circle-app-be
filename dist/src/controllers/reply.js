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
exports.updateReply = exports.deleteReply = exports.createReply = exports.getReplyById = exports.getAllReplies = void 0;
const client_1 = require("../prisma/client");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const getAllReplies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client_1.prisma.reply.findMany();
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.getAllReplies = getAllReplies;
const getReplyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield client_1.prisma.reply.findUnique({ where: { id } });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.getReplyById = getReplyById;
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, authorId, tweetId } = req.body;
        const fileImagePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        let image = null;
        if (fileImagePath) {
            image = yield (0, cloudinary_1.default)(fileImagePath);
        }
        const result = yield client_1.prisma.reply.create({
            data: {
                content,
                authorId,
                tweetId,
                imageUrl: image,
            },
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.createReply = createReply;
const deleteReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield client_1.prisma.reply.delete({
            where: {
                id,
            },
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.deleteReply = deleteReply;
const updateReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { content } = req.body;
        const result = yield client_1.prisma.reply.update({
            where: { id },
            data: { content },
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.updateReply = updateReply;
//# sourceMappingURL=reply.js.map