"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)(),
        POSTGRES_HOST: (0, envalid_1.str)(),
        POSTGRES_PORT: (0, envalid_1.port)(),
        POSTGRES_USER: (0, envalid_1.str)(),
        POSTGRES_PASSWORD: (0, envalid_1.str)(),
        POSTGRES_DB: (0, envalid_1.str)(),
        EMAIL_USER: (0, envalid_1.str)(),
        EMAIL_PASS: (0, envalid_1.str)(),
        EMAIL_HOST: (0, envalid_1.str)(),
        EMAIL_PORT: (0, envalid_1.port)(),
        GOOGLE_APP_PASSWORD: (0, envalid_1.str)(),
        GOOGLE_USER: (0, envalid_1.str)(),
        GOOGLE_SENDER_MAIL: (0, envalid_1.str)(),
        REDIS_URL: (0, envalid_1.str)(),
    });
};
exports.default = validateEnv;
//# sourceMappingURL=validateEnv.js.map